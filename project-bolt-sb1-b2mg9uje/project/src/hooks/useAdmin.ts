import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ADMIN_EMAILS = ['kent1tanaya@gmail.com']; // Can be expanded to include more admin emails

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const adminStatus = ADMIN_EMAILS.includes(user.email || '');
      setIsAdmin(adminStatus);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, [user]);

  return { isAdmin, loading };
}