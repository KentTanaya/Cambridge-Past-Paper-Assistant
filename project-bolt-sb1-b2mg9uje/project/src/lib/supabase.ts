import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string;
          subject: string;
          year: number;
          session: string;
          paper_number: string;
          question_text: string;
          mark_scheme: string;
          keywords: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          subject: string;
          year: number;
          session: string;
          paper_number: string;
          question_text: string;
          mark_scheme: string;
          keywords?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          subject?: string;
          year?: number;
          session?: string;
          paper_number?: string;
          question_text?: string;
          mark_scheme?: string;
          keywords?: string[];
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          subscription_type: 'free' | 'premium';
          searches_today: number;
          last_search_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_type?: 'free' | 'premium';
          searches_today?: number;
          last_search_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_type?: 'free' | 'premium';
          searches_today?: number;
          last_search_date?: string;
          created_at?: string;
        };
      };
      search_history: {
        Row: {
          id: string;
          user_id: string;
          query: string;
          results_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          query: string;
          results_count: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          query?: string;
          results_count?: number;
          created_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          created_at?: string;
        };
      };
    };
  };
};