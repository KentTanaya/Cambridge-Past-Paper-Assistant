import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function BulkImport() {
  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [importResults, setImportResults] = useState<{ success: number, errors: string[] } | null>(null);

  const downloadTemplate = () => {
    const template = `subject,year,session,paper_number,question_text,mark_scheme,keywords
Mathematics,2023,May/June,1,"Calculate the derivative of f(x) = 3x² + 2x - 1","Step 1: Apply power rule to each term
f'(x) = 6x + 2
Step 2: The derivative is f'(x) = 6x + 2","derivative,calculus,power rule"
Physics,2023,Oct/Nov,2,"A ball is thrown vertically upward with initial velocity 20 m/s. Calculate the maximum height reached.","Using v² = u² + 2as
At maximum height, v = 0
0 = 20² + 2(-9.8)s
s = 400/(2×9.8) = 20.4 m","kinematics,projectile motion,maximum height"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (csv: string) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map((line, index) => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      const row: any = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      
      return { ...row, lineNumber: index + 2 };
    });
  };

  const validateRow = (row: any) => {
    const errors = [];
    
    if (!row.subject) errors.push('Subject is required');
    if (!row.year || isNaN(parseInt(row.year))) errors.push('Valid year is required');
    if (!row.session || !['May/June', 'Oct/Nov'].includes(row.session)) {
      errors.push('Session must be "May/June" or "Oct/Nov"');
    }
    if (!row.paper_number) errors.push('Paper number is required');
    if (!row.question_text) errors.push('Question text is required');
    if (!row.mark_scheme) errors.push('Mark scheme is required');
    
    return errors;
  };

  const handleImport = async () => {
    if (!csvData.trim()) {
      setMessage({ type: 'error', text: 'Please paste CSV data or upload a file' });
      return;
    }

    setLoading(true);
    setMessage(null);
    setImportResults(null);

    try {
      const rows = parseCSV(csvData);
      const validRows = [];
      const errors = [];

      // Validate all rows
      for (const row of rows) {
        const rowErrors = validateRow(row);
        if (rowErrors.length > 0) {
          errors.push(`Line ${row.lineNumber}: ${rowErrors.join(', ')}`);
        } else {
          validRows.push({
            subject: row.subject,
            year: parseInt(row.year),
            session: row.session,
            paper_number: row.paper_number,
            question_text: row.question_text,
            mark_scheme: row.mark_scheme,
            keywords: row.keywords ? row.keywords.split(',').map((k: string) => k.trim()) : []
          });
        }
      }

      if (errors.length > 0 && validRows.length === 0) {
        setMessage({ type: 'error', text: 'No valid rows found. Please check your data.' });
        setImportResults({ success: 0, errors });
        return;
      }

      // Import valid rows
      let successCount = 0;
      for (const row of validRows) {
        try {
          const { error } = await supabase
            .from('questions')
            .insert(row);
          
          if (!error) {
            successCount++;
          } else {
            errors.push(`Failed to import question: ${error.message}`);
          }
        } catch (err) {
          errors.push(`Failed to import question: ${err}`);
        }
      }

      setImportResults({ success: successCount, errors });
      
      if (successCount > 0) {
        setMessage({ 
          type: 'success', 
          text: `Successfully imported ${successCount} question${successCount !== 1 ? 's' : ''}!` 
        });
        setCsvData('');
      } else {
        setMessage({ type: 'error', text: 'No questions were imported successfully.' });
      }

    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to parse CSV data. Please check the format.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Import Questions</h2>
        <p className="text-gray-600">Import multiple questions at once using CSV format</p>
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

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Template Download */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Download CSV Template</h3>
              <p className="text-sm text-blue-700">
                Get the correct format for importing questions
              </p>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>
        </div>

        {/* CSV Input */}
        <div>
          <label htmlFor="csvData" className="block text-sm font-medium text-gray-700 mb-2">
            CSV Data
          </label>
          <textarea
            id="csvData"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            rows={12}
            placeholder="Paste your CSV data here or upload a file...

Format:
subject,year,session,paper_number,question_text,mark_scheme,keywords
Mathematics,2023,May/June,1,&quot;Question text here&quot;,&quot;Mark scheme here&quot;,&quot;keyword1,keyword2&quot;"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Upload CSV File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop your CSV file here, or click to browse</p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setCsvData(event.target?.result as string);
                  };
                  reader.readAsText(file);
                }
              }}
              className="hidden"
              id="csvFile"
            />
            <label
              htmlFor="csvFile"
              className="inline-flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Choose File</span>
            </label>
          </div>
        </div>

        {/* Import Button */}
        <div className="flex justify-end">
          <button
            onClick={handleImport}
            disabled={loading || !csvData.trim()}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{loading ? 'Importing...' : 'Import Questions'}</span>
          </button>
        </div>
      </div>

      {/* Import Results */}
      {importResults && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Results</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800">
                Successfully imported: {importResults.success} question{importResults.success !== 1 ? 's' : ''}
              </span>
            </div>

            {importResults.errors.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">Errors ({importResults.errors.length}):</span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {importResults.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-800 mb-1">{error}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}