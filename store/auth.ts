import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  isGuest?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean | undefined;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: undefined,
  error: null,

  initialize: async () => {
    try {
      set({ loading: true, error: null });
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Session error:', error);
        set({ loading: false, error: 'Failed to get session' });
        return;
      }

      if (session) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('User fetch error:', userError);
          set({ loading: false, error: 'Failed to fetch user data' });
          return;
        }

        set({ token: session.access_token, user, loading: false, error: null });
      } else {
        set({ loading: false, error: null });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false, error: 'Failed to initialize authentication' });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ loading: false, error: null });

      console.log(
        process.env.EXPO_PUBLIC_SUPABASE_URL,
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
        email,
        password
      );

      const {
        data: { session, user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('login session ', session);
      console.log('login user: ', user);

      if (session) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;

        set({ token: session.access_token, user, loading: false, error: null });
        router.push('/privacy-policy');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      set({ error: error.message || 'Failed to login', loading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ loading: false, error: null });

      console.log(email, password);

      const {
        data: { user, session },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('registered session ', session);
      console.log('registered user: ', user);

      if (error) {
        throw error;
      }

      if (session) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .insert([{ id: session.user.id, email, name }])
          .select()
          .single();

        if (userError) throw userError;

        set({ token: session.access_token, user, loading: false, error: null });
        router.push('/privacy-policy');
      } else {
        set({ loading: false, error: 'Failed to create session' });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      set({ error: error.message || 'Failed to register', loading: false });
    }
  },

  continueAsGuest: async () => {
    try {
      set({ loading: true, error: null });
      const guestUser = {
        id: `guest-${Date.now()}`,
        email: `guest-${Date.now()}@example.com`,
        name: 'Guest User',
        isGuest: true,
      };

      set({ user: guestUser, loading: false, error: null });
      router.push('/privacy-policy');
    } catch (error: any) {
      console.error('Guest login error:', error);
      set({ error: 'Failed to continue as guest', loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await supabase.auth.signOut();
      set({ token: null, user: null, loading: false, error: null });
      router.replace('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      set({ loading: false, error: 'Failed to logout' });
    }
  },
}));
