import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id: string;
  user_id: string;
  subscription_type: 'free' | 'premium';
  searches_today: number;
  last_search_date: string;
  created_at: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canSearch = (): boolean => {
    if (!profile) return false;
    if (profile.subscription_type === 'premium') return true;
    
    const today = new Date().toISOString().split('T')[0];
    if (profile.last_search_date !== today) {
      return true; // New day, reset searches
    }
    
    return profile.searches_today < 3;
  };

  const incrementSearchCount = async () => {
    if (!user || !profile) return;

    const today = new Date().toISOString().split('T')[0];
    const isNewDay = profile.last_search_date !== today;
    
    const newSearchCount = isNewDay ? 1 : profile.searches_today + 1;

    const { error } = await supabase
      .from('user_profiles')
      .update({
        searches_today: newSearchCount,
        last_search_date: today
      })
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => prev ? {
        ...prev,
        searches_today: newSearchCount,
        last_search_date: today
      } : null);
    }
  };

  return {
    profile,
    loading,
    canSearch,
    incrementSearchCount,
    refetch: fetchProfile
  };
}