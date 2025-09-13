import React, { useState, useEffect } from 'react';
import { Users, Crown, Search, Calendar, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  user_id: string;
  subscription_type: 'free' | 'premium';
  searches_today: number;
  last_search_date: string;
  created_at: string;
  email?: string;
  total_searches?: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'free' | 'premium'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Get user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        return;
      }

      // Get user emails from auth.users (this would need RLS policy adjustment in production)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      // Get search counts for each user
      const usersWithData = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { count: totalSearches } = await supabase
            .from('search_history')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.user_id);

          const authUser = authUsers?.users.find(u => u.id === profile.user_id);

          return {
            ...profile,
            email: authUser?.email || 'Unknown',
            total_searches: totalSearches || 0
          };
        })
      );

      setUsers(usersWithData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (userId: string, newType: 'free' | 'premium') => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ subscription_type: newType })
        .eq('user_id', userId);

      if (error) {
        alert('Error updating subscription: ' + error.message);
        return;
      }

      setUsers(prev => prev.map(user => 
        user.user_id === userId 
          ? { ...user, subscription_type: newType }
          : user
      ));
    } catch (error) {
      alert('Error updating subscription');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesSubscription = subscriptionFilter === 'all' || user.subscription_type === subscriptionFilter;
    return matchesSearch && matchesSubscription;
  });

  const stats = {
    total: users.length,
    premium: users.filter(u => u.subscription_type === 'premium').length,
    free: users.filter(u => u.subscription_type === 'free').length,
    activeToday: users.filter(u => {
      const today = new Date().toISOString().split('T')[0];
      return u.last_search_date === today && u.searches_today > 0;
    }).length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">Manage registered users and their subscriptions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Crown className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.premium}</p>
              <p className="text-sm text-gray-600">Premium Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.free}</p>
              <p className="text-sm text-gray-600">Free Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeToday}</p>
              <p className="text-sm text-gray-600">Active Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subscription</label>
            <select
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value as 'all' | 'free' | 'premium')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Subscriptions</option>
              <option value="free">Free Users</option>
              <option value="premium">Premium Users</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSubscriptionFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Subscription</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Searches Today</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total Searches</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-500">ID: {user.user_id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {user.subscription_type === 'premium' ? (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Users className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.subscription_type === 'premium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.subscription_type}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {user.subscription_type === 'premium' ? '∞' : `${user.searches_today}/3`}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{user.total_searches}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={user.subscription_type}
                      onChange={(e) => updateSubscription(user.user_id, e.target.value as 'free' | 'premium')}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}