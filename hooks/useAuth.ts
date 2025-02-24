import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface AuthState {
  session: any;
  user: any;
  error: string | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    metadata: { fullName: string; role: 'patient' | 'doctor' }
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  session: null,
  user: null,
  error: null,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user });
        
        if (session) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      });
    } catch (error) {
      set({ error: 'Failed to initialize auth' });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.replace('/(tabs)');
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  signUp: async (email: string, password: string, metadata) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;
      router.replace('/(tabs)');
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/login');
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));