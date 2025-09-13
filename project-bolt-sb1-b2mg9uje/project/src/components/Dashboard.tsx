import React, { useState, useEffect } from 'react';
import { 
  User, 
  History, 
  Bookmark, 
  BarChart3, 
  Crown, 
  Calendar,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { supabase } from '../lib/supabase';
import { Question } from '../utils/searchUtils';
import { format } from 'date-fns';

interface SearchHistoryItem {
  id: string;
  query: string;
  results_count: number;
  created_at: string;
}

interface BookmarkedQuestion extends Question {
  bookmark_created_at: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'bookmarks' | 'analytics'>('overview');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch search history
      const { data: historyData } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch bookmarked questions
      const { data: bookmarksData } = await supabase
        .from('bookmarks')
        .select(`
          created_at,
          questions (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setSearchHistory(historyData || []);
      
      if (bookmarksData) {
        const bookmarkedQs = bookmarksData.map(bookmark => ({
          ...bookmark.questions,
          bookmark_created_at: bookmark.created_at
        })) as BookmarkedQuestion[];
        setBookmarkedQuestions(bookmarkedQs);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (questionId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('question_id', questionId);

      setBookmarkedQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const getSearchStats = () => {
    const totalSearches = searchHistory.length;
    const avgResultsPerSearch = totalSearches > 0 
      ? Math.round(searchHistory.reduce((sum, item) => sum + item.results_count, 0) / totalSearches)
      : 0;
    
    return { totalSearches, avgResultsPerSearch };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'history', label: 'Search History', icon: History },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { totalSearches, avgResultsPerSearch } = getSearchStats();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your searches, bookmarks, and account settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Account Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                {profile?.subscription_type === 'premium' ? (
                  <Crown className="w-8 h-8 text-yellow-500" />
                ) : (
                  <User className="w-8 h-8 text-blue-500" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {profile?.subscription_type === 'premium' ? 'Premium' : 'Free'} Account
                  </h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              {profile?.subscription_type === 'free' && (
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors">
                  Upgrade to Premium
                </button>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold text-gray-900">Searches Today</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.subscription_type === 'premium' ? '∞' : `${profile?.searches_today || 0}/3`}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {profile?.subscription_type === 'premium' 
                  ? 'Unlimited searches' 
                  : `${Math.max(0, 3 - (profile?.searches_today || 0))} remaining`
                }
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Bookmark className="w-6 h-6 text-purple-500" />
                <h3 className="font-semibold text-gray-900">Bookmarks</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{bookmarkedQuestions.length}</p>
              <p className="text-sm text-gray-600 mt-1">Saved questions</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            {searchHistory.length > 0 ? (
              <div className="space-y-3">
                {searchHistory.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 truncate">{item.query}</p>
                      <p className="text-xs text-gray-500">
                        {item.results_count} results • {format(new Date(item.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No searches yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Search History</h3>
            <p className="text-sm text-gray-600 mt-1">Your recent searches and results</p>
          </div>
          <div className="p-6">
            {searchHistory.length > 0 ? (
              <div className="space-y-4">
                {searchHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.query}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>{item.results_count} results</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No search history yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Bookmarked Questions</h3>
            <p className="text-sm text-gray-600 mt-1">Questions you've saved for later</p>
          </div>
          <div className="p-6">
            {bookmarkedQuestions.length > 0 ? (
              <div className="space-y-4">
                {bookmarkedQuestions.map((question) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {question.subject}
                        </span>
                        <span className="text-sm text-gray-600">
                          {question.year} {question.session} • Paper {question.paper_number}
                        </span>
                      </div>
                      <button
                        onClick={() => removeBookmark(question.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{question.question_text}</p>
                    <p className="text-xs text-gray-500">
                      Bookmarked {format(new Date(question.bookmark_created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookmarked questions yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold text-gray-900">Search Statistics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Searches</span>
                  <span className="font-medium">{totalSearches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Results per Search</span>
                  <span className="font-medium">{avgResultsPerSearch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bookmarked Questions</span>
                  <span className="font-medium">{bookmarkedQuestions.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Account Info</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="font-medium capitalize">{profile?.subscription_type || 'Free'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {profile?.created_at ? format(new Date(profile.created_at), 'MMM yyyy') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}