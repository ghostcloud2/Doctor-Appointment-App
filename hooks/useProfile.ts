import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: {
    fullName: string;
    phoneNumber: string;
  }) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName,
          phone_number: updates.phoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;
      fetchProfile();
    } catch (error) {
      setError(error.message);
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
}