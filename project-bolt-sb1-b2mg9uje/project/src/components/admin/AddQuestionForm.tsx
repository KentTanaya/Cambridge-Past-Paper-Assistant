import React, { useState } from 'react';
import { Plus, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CAMBRIDGE_SUBJECTS } from '../../utils/searchUtils';

export function AddQuestionForm() {
  const [formData, setFormData] = useState({
    subject: '',
    year: new Date().getFullYear(),
    session: 'May/June',
    paper_number: '',
    question_text: '',
    mark_scheme: '',
    keywords: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const { error } = await supabase
        .from('questions')
        .insert({
          subject: formData.subject,
          year: formData.year,
          session: formData.session,
          paper_number: formData.paper_number,
          question_text: formData.question_text,
          mark_scheme: formData.mark_scheme,
          keywords: keywordsArray
        });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: 'Question added successfully!' });
        // Reset form
        setFormData({
          subject: '',
          year: new Date().getFullYear(),
          session: 'May/June',
          paper_number: '',
          question_text: '',
          mark_scheme: '',
          keywords: ''
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Question</h2>
        <p className="text-gray-600">Add a single Cambridge past paper question to the database</p>
      </div>

      {message && (
        <div className={`flex items-center space-x-2 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <p className={`text-sm ${
            message.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Subject</option>
              {CAMBRIDGE_SUBJECTS.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="2015"
              max="2030"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-2">
              Session *
            </label>
            <select
              id="session"
              name="session"
              value={formData.session}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="May/June">May/June</option>
              <option value="Oct/Nov">Oct/Nov</option>
            </select>
          </div>

          <div>
            <label htmlFor="paper_number" className="block text-sm font-medium text-gray-700 mb-2">
              Paper Number *
            </label>
            <input
              type="text"
              id="paper_number"
              name="paper_number"
              value={formData.paper_number}
              onChange={handleChange}
              placeholder="e.g., 1, 2, 3"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="question_text" className="block text-sm font-medium text-gray-700 mb-2">
            Question Text *
          </label>
          <textarea
            id="question_text"
            name="question_text"
            value={formData.question_text}
            onChange={handleChange}
            rows={6}
            placeholder="Enter the complete question text..."
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label htmlFor="mark_scheme" className="block text-sm font-medium text-gray-700 mb-2">
            Mark Scheme *
          </label>
          <textarea
            id="mark_scheme"
            name="mark_scheme"
            value={formData.mark_scheme}
            onChange={handleChange}
            rows={8}
            placeholder="Enter the complete mark scheme with step-by-step solutions..."
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
            Keywords (Optional)
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            placeholder="derivative, calculus, integration (comma-separated)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Add relevant keywords to improve search matching (separate with commas)
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setFormData({
              subject: '',
              year: new Date().getFullYear(),
              session: 'May/June',
              paper_number: '',
              question_text: '',
              mark_scheme: '',
              keywords: ''
            })}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Adding...' : 'Add Question'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}