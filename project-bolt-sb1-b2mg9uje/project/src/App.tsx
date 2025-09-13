import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PricingModal } from './components/PricingModal';
import { SearchForm } from './components/SearchForm';
import { SearchResults } from './components/SearchResults';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useUserProfile } from './hooks/useUserProfile';
import { useAdmin } from './hooks/useAdmin';
import { supabase } from './lib/supabase';
import { searchQuestions, Question } from './utils/searchUtils';

function AppContent() {
  const [currentView, setCurrentView] = useState<'search' | 'dashboard' | 'admin'>('search');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  const { user } = useAuth();
  const { incrementSearchCount } = useUserProfile();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
        return;
      }

      setAllQuestions(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = async (query: string, subject: string) => {
    setLoading(true);
    setCurrentQuery(query);

    try {
      // Perform search
      const results = searchQuestions(query, allQuestions, subject === 'all' ? undefined : subject);
      setSearchResults(results);

      // Record search in history and increment count for logged-in users
      if (user) {
        await Promise.all([
          supabase.from('search_history').insert({
            user_id: user.id,
            query,
            results_count: results.length
          }),
          incrementSearchCount()
        ]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect non-admin users away from admin panel
  useEffect(() => {
    if (currentView === 'admin' && !isAdmin) {
      setCurrentView('search');
    }
  }, [currentView, isAdmin]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAuthClick={() => setShowAuthModal(true)}
        onUpgradeClick={() => setShowPricingModal(true)}
        onDashboardClick={() => setCurrentView('dashboard')}
        onAdminClick={() => setCurrentView('admin')}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {currentView === 'admin' ? (
        <AdminPanel />
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'search' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Cambridge Past Paper Assistant
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find mark schemes instantly by pasting your Cambridge IGCSE, AS Level, or A Level questions. 
                Search through thousands of past papers across all subjects.
              </p>
            </div>

            {/* Search Form */}
            <SearchForm onSearch={handleSearch} loading={loading} />

            {/* Search Results */}
            <SearchResults 
              results={searchResults} 
              query={currentQuery} 
              loading={loading} 
            />

            {/* Features Section */}
            {!currentQuery && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
                  <p className="text-gray-600 text-sm">
                    Advanced text matching finds similar questions even with different wording
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">All Subjects</h3>
                  <p className="text-gray-600 text-sm">
                    Mathematics, Sciences, Economics, Business Studies, and more
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                  <p className="text-gray-600 text-sm">
                    Get mark schemes immediately instead of searching through PDFs
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Dashboard />
        )}
        </main>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />

      {/* Footer */}
      {currentView !== 'admin' && (
        <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Cambridge Past Paper Assistant</p>
            <p className="text-sm">
              Helping students find mark schemes faster • Not affiliated with Cambridge Assessment
            </p>
          </div>
        </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;