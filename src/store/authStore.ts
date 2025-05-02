import { create } from 'zustand';
import axios from 'axios';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

// Hardcoded admin credentials
const ADMIN_EMAIL = 'pratikkm02@gmail.com';
const ADMIN_PASSWORD = 'admin123';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  initialize: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        set({ user: null, isLoading: false });
        return;
      }

      // Check if it's a stored admin session
      const adminData = localStorage.getItem('admin_data');
      if (adminData) {
        const admin = JSON.parse(adminData);
        set({
          user: admin,
          isLoading: false
        });
        return;
      }

      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });

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
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_data');
      set({ 
        user: null,
        error: error instanceof Error ? error.message : 'Failed to initialize auth',
        isLoading: false 
      });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      // Check for admin login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: 'admin-1',
          email: ADMIN_EMAIL,
          name: 'Admin',
          role: UserRole.Admin
        };
        
        localStorage.setItem('admin_data', JSON.stringify(adminUser));
        set({
          user: adminUser,
          isLoading: false
        });
        return;
      }

      // Regular user login
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata.name || user.email!.split('@')[0],
            role: UserRole.Customer
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

  register: async (email: string, name: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
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
            role: UserRole.Customer
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
      localStorage.removeItem('admin_data');
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