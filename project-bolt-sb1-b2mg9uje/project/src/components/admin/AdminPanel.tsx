import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Plus, 
  Upload, 
  Settings,
  TrendingUp,
  Search,
  Crown,
  Globe
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AddQuestionForm } from './AddQuestionForm';
import { BulkImport } from './BulkImport';
import { ManageQuestions } from './ManageQuestions';
import { UserManagement } from './UserManagement';
import { Analytics } from './Analytics';
import { WebScraper } from './WebScraper';
import { AdminSettings } from './AdminSettings';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'add-question', label: 'Add Question', icon: Plus },
    { id: 'bulk-import', label: 'Bulk Import', icon: Upload },
    { id: 'manage-questions', label: 'Manage Questions', icon: FileText },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'scraper', label: 'Web Scraper', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Crown className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-purple-100">Cambridge Past Paper Assistant Management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
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
          <div className="p-6">
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'add-question' && <AddQuestionForm />}
            {activeTab === 'bulk-import' && <BulkImport />}
            {activeTab === 'manage-questions' && <ManageQuestions />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'scraper' && <WebScraper />}
            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}