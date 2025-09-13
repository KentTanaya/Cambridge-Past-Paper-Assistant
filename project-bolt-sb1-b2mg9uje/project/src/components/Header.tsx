import React from 'react';
import { BookOpen, User, LogOut, Search, Crown, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAdmin } from '../hooks/useAdmin';

interface HeaderProps {
  onAuthClick: () => void;
  onUpgradeClick: () => void;
  onDashboardClick: () => void;
  onAdminClick: () => void;
  currentView: 'search' | 'dashboard';
  onViewChange: (view: 'search' | 'dashboard') => void;
}

export function Header({ onAuthClick, onUpgradeClick, onDashboardClick, onAdminClick, currentView, onViewChange }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { isAdmin } = useAdmin();

  const handleSignOut = async () => {
    await signOut();
    onViewChange('search');
  };

  const getRemainingSearches = () => {
    if (!profile) return 0;
    if (profile.subscription_type === 'premium') return '∞';
    
    const today = new Date().toISOString().split('T')[0];
    if (profile.last_search_date !== today) {
      return 3; // New day
    }
    
    return Math.max(0, 3 - profile.searches_today);
  };

  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Cambridge Assistant</h1>
              <p className="text-xs text-gray-500">Past Paper Mark Schemes</p>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            {!user && (
              <button
                onClick={onUpgradeClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade to Pro</span>
              </button>
            )}

            {user && (
              <>
                <button
                  onClick={() => onViewChange('search')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'search'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>

                <button
                  onClick={() => onViewChange('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={onAdminClick}
                    className="flex items-center space-x-2 px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </button>
                )}

                <button
                  onClick={onUpgradeClick}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade to Pro</span>
                </button>

                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  {profile?.subscription_type === 'premium' ? (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{getRemainingSearches()}</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-600">
                    {profile?.subscription_type === 'premium' ? 'Premium' : `${getRemainingSearches()} searches left`}
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </>
            )}

            {!user && (
              <button
                onClick={onAuthClick}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}