import React, { useState } from 'react';
import { Calendar, FileText, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Question } from '../utils/searchUtils';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SearchResultsProps {
  results: Question[];
  query: string;
  loading: boolean;
}

export function SearchResults({ results, query, loading }: SearchResultsProps) {
  const { user } = useAuth();
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user, results]);

  const fetchBookmarks = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('bookmarks')
      .select('question_id')
      .eq('user_id', user.id);

    if (data) {
      setBookmarkedQuestions(new Set(data.map(b => b.question_id)));
    }
  };

  const toggleBookmark = async (questionId: string) => {
    if (!user) return;

    setBookmarkLoading(prev => new Set(prev).add(questionId));

    try {
      const isBookmarked = bookmarkedQuestions.has(questionId);

      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', questionId);

        setBookmarkedQuestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
      } else {
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            question_id: questionId
          });

        setBookmarkedQuestions(prev => new Set(prev).add(questionId));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setBookmarkLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Search</h3>
        <p className="text-gray-500">
          Paste a Cambridge question above to find matching mark schemes
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-500 mb-4">
          We couldn't find any matching questions for your search.
        </p>
        <div className="text-sm text-gray-400 space-y-1">
          <p>Try:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Using different keywords</li>
            <li>Checking your spelling</li>
            <li>Selecting a different subject</li>
            <li>Making your query more specific</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Found {results.length} matching question{results.length !== 1 ? 's' : ''}
        </h2>
      </div>

      <div className="space-y-4">
        {results.map((question) => (
          <div key={question.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {question.subject}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{question.year} {question.session}</span>
                  </div>
                  <span className="text-gray-400">Paper {question.paper_number}</span>
                </div>

                {user && (
                  <button
                    onClick={() => toggleBookmark(question.id)}
                    disabled={bookmarkLoading.has(question.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                    title={bookmarkedQuestions.has(question.id) ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    {bookmarkedQuestions.has(question.id) ? (
                      <BookmarkCheck className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Question:</h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {question.question_text}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Mark Scheme:</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {question.mark_scheme}
                    </p>
                  </div>
                </div>

                {question.keywords.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Keywords:</h4>
                    <div className="flex flex-wrap gap-2">
                      {question.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}