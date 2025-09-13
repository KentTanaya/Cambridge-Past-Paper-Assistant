import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Search, Calendar, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format, subDays, startOfDay } from 'date-fns';

interface AnalyticsData {
  dailySearches: Array<{ date: string; count: number }>;
  subjectPopularity: Array<{ subject: string; count: number }>;
  userGrowth: Array<{ date: string; count: number }>;
  searchTrends: Array<{ query: string; count: number }>;
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    dailySearches: [],
    subjectPopularity: [],
    userGrowth: [],
    searchTrends: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = startOfDay(subDays(new Date(), days));

      // Get daily searches
      const { data: searchHistory } = await supabase
        .from('search_history')
        .select('created_at, query')
        .gte('created_at', startDate.toISOString());

      // Get user registrations
      const { data: userProfiles } = await supabase
        .from('user_profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      // Process daily searches
      const dailySearches = Array.from({ length: days }, (_, i) => {
        const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
        const count = searchHistory?.filter(s => 
          format(new Date(s.created_at), 'yyyy-MM-dd') === date
        ).length || 0;
        return { date, count };
      });

      // Process subject popularity (simplified - in real app, you'd store subject with search)
      const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies'];
      const subjectCounts: Record<string, number> = {};
      
      searchHistory?.forEach(search => {
        subjects.forEach(subject => {
          if (search.query.toLowerCase().includes(subject.toLowerCase())) {
            subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
          }
        });
      });

      const subjectPopularity = Object.entries(subjectCounts)
        .map(([subject, count]) => ({ subject, count }))
        .sort((a, b) => b.count - a.count);

      // Process user growth
      const userGrowth = Array.from({ length: days }, (_, i) => {
        const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
        const count = userProfiles?.filter(u => 
          format(new Date(u.created_at), 'yyyy-MM-dd') === date
        ).length || 0;
        return { date, count };
      });

      // Process search trends (most common queries)
      const queryCount: Record<string, number> = {};
      searchHistory?.forEach(search => {
        const query = search.query.toLowerCase().trim();
        if (query.length > 10) { // Only count substantial queries
          queryCount[query] = (queryCount[query] || 0) + 1;
        }
      });

      const searchTrends = Object.entries(queryCount)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setData({
        dailySearches,
        subjectPopularity,
        userGrowth,
        searchTrends
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalSearches = data.dailySearches.reduce((sum, day) => sum + day.count, 0);
  const totalUsers = data.userGrowth.reduce((sum, day) => sum + day.count, 0);
  const avgSearchesPerDay = Math.round(totalSearches / data.dailySearches.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Detailed insights into platform usage and trends</p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Search className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalSearches}</p>
              <p className="text-sm text-gray-600">Total Searches</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              <p className="text-sm text-gray-600">New Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{avgSearchesPerDay}</p>
              <p className="text-sm text-gray-600">Avg Searches/Day</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.subjectPopularity.length}</p>
              <p className="text-sm text-gray-600">Active Subjects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Searches Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Searches</h3>
          <div className="space-y-2">
            {data.dailySearches.map((day, index) => {
              const maxCount = Math.max(...data.dailySearches.map(d => d.count));
              const width = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-xs text-gray-600 w-16">
                    {format(new Date(day.date), 'MMM d')}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-900 w-8">{day.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Popularity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Subjects</h3>
          <div className="space-y-3">
            {data.subjectPopularity.slice(0, 6).map((subject, index) => {
              const maxCount = Math.max(...data.subjectPopularity.map(s => s.count));
              const width = maxCount > 0 ? (subject.count / maxCount) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-900 w-24 truncate">{subject.subject}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 w-8">{subject.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registrations</h3>
          <div className="space-y-2">
            {data.userGrowth.map((day, index) => {
              const maxCount = Math.max(...data.userGrowth.map(d => d.count));
              const width = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-xs text-gray-600 w-16">
                    {format(new Date(day.date), 'MMM d')}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-purple-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-900 w-8">{day.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Search Queries</h3>
          <div className="space-y-3">
            {data.searchTrends.slice(0, 8).map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <p className="text-sm text-gray-900 truncate">{trend.query}</p>
                </div>
                <span className="text-sm font-medium text-gray-600">{trend.count}</span>
              </div>
            ))}
            {data.searchTrends.length === 0 && (
              <p className="text-gray-500 text-sm">No search trends available yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}