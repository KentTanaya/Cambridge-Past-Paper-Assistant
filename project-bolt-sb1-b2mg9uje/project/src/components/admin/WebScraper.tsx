import React, { useState } from 'react';
import { Globe, Play, AlertCircle, CheckCircle, ExternalLink, Download } from 'lucide-react';

export function WebScraper() {
  const [urls, setUrls] = useState('');
  const [scraping, setScraping] = useState(false);
  const [results, setResults] = useState<Array<{
    url: string;
    status: 'success' | 'error';
    message: string;
    questionsFound?: number;
  }>>([]);

  const handleScrape = async () => {
    const urlList = urls.split('\n').filter(url => url.trim());
    
    if (urlList.length === 0) {
      alert('Please enter at least one URL');
      return;
    }

    setScraping(true);
    setResults([]);

    // Simulate scraping process (in real implementation, this would call your backend)
    for (const url of urlList) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      // Simulate random results
      const success = Math.random() > 0.3;
      const questionsFound = success ? Math.floor(Math.random() * 10) + 1 : 0;
      
      setResults(prev => [...prev, {
        url: url.trim(),
        status: success ? 'success' : 'error',
        message: success 
          ? `Successfully extracted ${questionsFound} questions`
          : 'Failed to extract content - site may be protected or format not supported',
        questionsFound
      }]);
    }

    setScraping(false);
  };

  const commonSites = [
    {
      name: 'Cambridge Assessment',
      url: 'https://www.cambridgeinternational.org/programmes-and-qualifications/',
      description: 'Official Cambridge past papers'
    },
    {
      name: 'Physics & Maths Tutor',
      url: 'https://www.physicsandmathstutor.com/',
      description: 'Popular educational resource site'
    },
    {
      name: 'Save My Exams',
      url: 'https://www.savemyexams.co.uk/',
      description: 'Revision notes and past papers'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Web Scraper</h2>
        <p className="text-gray-600">Automatically extract Cambridge past paper questions from educational websites</p>
      </div>

      {/* Warning Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900 mb-1">Important Legal Notice</h3>
            <p className="text-sm text-amber-800">
              Please ensure you have permission to scrape content from websites. Respect robots.txt files, 
              rate limits, and copyright laws. Only scrape publicly available educational content for 
              legitimate educational purposes.
            </p>
          </div>
        </div>
      </div>

      {/* URL Input */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
            Website URLs (one per line)
          </label>
          <textarea
            id="urls"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={8}
            placeholder="https://example.com/cambridge-papers/mathematics
https://example.com/past-papers/physics
https://example.com/igcse-questions/chemistry"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {urls.split('\n').filter(url => url.trim()).length} URLs to scrape
          </p>
          
          <button
            onClick={handleScrape}
            disabled={scraping || !urls.trim()}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{scraping ? 'Scraping...' : 'Start Scraping'}</span>
          </button>
        </div>
      </div>

      {/* Common Sites */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Educational Sites</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {commonSites.map((site, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{site.name}</h4>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-sm text-gray-600 mb-3">{site.description}</p>
              <button
                onClick={() => setUrls(prev => prev + (prev ? '\n' : '') + site.url)}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                Add to List
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scraping Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scraping Results</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                {result.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{result.url}</p>
                  <p className={`text-sm ${
                    result.status === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.message}
                  </p>
                </div>
                {result.questionsFound && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {result.questionsFound} questions
                  </span>
                )}
              </div>
            ))}
          </div>

          {results.some(r => r.status === 'success') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Total questions found: {results.reduce((sum, r) => sum + (r.questionsFound || 0), 0)}
                  </p>
                </div>
                <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Import to Database</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scraper Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scraper Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delay Between Requests (seconds)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              defaultValue="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Avoid overwhelming target servers</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Pages per Site
            </label>
            <input
              type="number"
              min="1"
              max="100"
              defaultValue="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Limit crawl depth</p>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-gray-700">Respect robots.txt</span>
            </label>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-gray-700">Extract mark schemes</span>
            </label>
          </div>
        </div>
      </div>

      {/* Implementation Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Implementation Status</h3>
            <p className="text-sm text-blue-800">
              This is a demonstration interface. The actual web scraping functionality would require:
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Backend service with web scraping libraries (Puppeteer, Scrapy, etc.)</li>
              <li>Content parsing algorithms for different site structures</li>
              <li>Rate limiting and ethical scraping practices</li>
              <li>Content validation and quality checks</li>
              <li>Integration with the question database</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}