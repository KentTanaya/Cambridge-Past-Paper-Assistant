import React, { useState } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { CAMBRIDGE_SUBJECTS } from '../utils/searchUtils';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

interface SearchFormProps {
  onSearch: (query: string, subject: string) => void;
  loading: boolean;
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('all');
  const { user } = useAuth();
  const { canSearch } = useUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (user && !canSearch()) {
      alert('You have reached your daily search limit. Upgrade to Premium for unlimited searches!');
      return;
    }
    
    onSearch(query.trim(), subject);
  };

  const canPerformSearch = !user || canSearch();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Paste your Cambridge question here
          </label>
          <textarea
            id="question"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Example: Calculate the derivative of f(x) = 3x² + 2x - 1..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Subject Filter
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={loading}
            >
              <option value="all">All Subjects</option>
              {CAMBRIDGE_SUBJECTS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={loading || !query.trim() || !canPerformSearch}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>

        {!canPerformSearch && (
          <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              You've reached your daily search limit. 
              <button className="ml-1 underline font-medium hover:text-amber-900">
                Upgrade to Premium
              </button> for unlimited searches!
            </p>
          </div>
        )}
      </form>
    </div>
  );
}