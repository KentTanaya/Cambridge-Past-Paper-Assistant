import React, { useState, useEffect } from 'react';
import { Users, FileText, Search, TrendingUp, Crown, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalQuestions: number;
  totalSearches: number;
  premiumUsers: number;
  searchesToday: number;
  questionsThisMonth: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalQuestions: 0,
    totalSearches: 0,
    premiumUsers: 0,
    searchesToday: 0,
    questionsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [popularSubjects, setPopularSubjects] = useState<Array<{subject: string, count: number}>>([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get premium users
      const { count: premiumUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_type', 'premium');

      // Get total questions
      const { count: totalQuestions } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      // Get total searches
      const { count: totalSearches } = await supabase
        .from('search_history')
        .select('*', { count: 'exact', head: true });

      // Get searches today
      const today = new Date().toISOString().split('T')[0];
      const { count: searchesToday } = await supabase
        .from('search_history')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Get questions added this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const { count: questionsThisMonth } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonth.toISOString());

      // Get popular subjects
      const { data: subjectData } = await supabase
        .from('search_history')
        .select('query')
        .limit(1000);

      // Simple subject analysis (in real app, you'd store subject with search)
      const subjectCounts: Record<string, number> = {};
      const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies'];
      
      subjectData?.forEach(search => {
        subjects.forEach(subject => {
          if (search.query.toLowerCase().includes(subject.toLowerCase())) {
            subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
          }
        });
      });

      const popularSubjectsArray = Object.entries(subjectCounts)
        .map(([subject, count]) => ({ subject, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalUsers: totalUsers || 0,
        totalQuestions: totalQuestions || 0,
        totalSearches: totalSearches || 0,
        premiumUsers: premiumUsers || 0,
        searchesToday: searchesToday || 0,
        questionsThisMonth: questionsThisMonth || 0
      });

      setPopularSubjects(popularSubjectsArray);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12% this month'
    },
    {
      title: 'Total Questions',
      value: stats.totalQuestions.toLocaleString(),
      icon: FileText,
      color: 'bg-green-500',
      change: `+${stats.questionsThisMonth} this month`
    },
    {
      title: 'Total Searches',
      value: stats.totalSearches.toLocaleString(),
      icon: Search,
      color: 'bg-purple-500',
      change: `${stats.searchesToday} today`
    },
    {
      title: 'Premium Users',
      value: stats.premiumUsers.toLocaleString(),
      icon: Crown,
      color: 'bg-yellow-500',
      change: `${((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}% conversion`
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your Cambridge Assistant platform performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-xs text-green-600">{card.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Subjects */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Subjects</h3>
          {popularSubjects.length > 0 ? (
            <div className="space-y-3">
              {popularSubjects.map((subject, index) => (
                <div key={subject.subject} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    <span className="text-sm text-gray-900">{subject.subject}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(subject.count / popularSubjects[0].count) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{subject.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No search data available yet</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Plus className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Add New Question</p>
                  <p className="text-sm text-blue-700">Add a single question manually</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Upload className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Bulk Import</p>
                  <p className="text-sm text-green-700">Import multiple questions at once</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">View Analytics</p>
                  <p className="text-sm text-purple-700">Detailed usage statistics</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}