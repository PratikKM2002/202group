import { create } from 'zustand';
import axios from 'axios';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  login: (email: string, password: string, role?: 'admin' | 'manager' | 'customer') => Promise<void>;
  register: (email: string, name: string, password: string, role: 'admin' | 'manager' | 'customer') => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  initialize: async () => {
    try {
      // Only check for Supabase session
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name || user.email!.split('@')[0],
            role: user.user_metadata.role
          },
          isLoading: false
        });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      set({ 
        user: null,
        error: error instanceof Error ? error.message : 'Failed to initialize auth',
        isLoading: false 
      });
    }
  },

  login: async (email: string, password: string, role?: 'admin' | 'manager' | 'customer') => {
    try {
      set({ isLoading: true, error: null });
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (user) {
        // Optionally check role if provided
        if (role && user.user_metadata.role !== role) {
          throw new Error('User does not have the required role');
        }
        set({
          user: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name || user.email!.split('@')[0],
            role: user.user_metadata.role
          },
          isLoading: false
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to login',
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (email: string, name: string, password: string, role: 'admin' | 'manager' | 'customer') => {
    try {
      set({ isLoading: true, error: null });
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      if (error) throw error;
      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name,
            role: user.user_metadata.role
          },
          isLoading: false
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to register',
        isLoading: false 
      });
      throw error;
    }
  },

  loginWithGoogle: async (accessToken: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      localStorage.setItem('auth_token', accessToken);

      set({
        user: {
          id: response.data.sub,
          email: response.data.email,
          name: response.data.name,
          role: UserRole.Customer
        },
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login with Google',
        isLoading: false 
      });
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('auth_token');
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to logout',
        isLoading: false 
      });
    }
  }
}));

export default useAuthStore;