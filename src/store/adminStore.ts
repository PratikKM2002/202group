import { create } from 'zustand';
import { mockRestaurants, generateAnalytics } from '../utils/mockData';
import { AnalyticsData } from '../types';

interface AdminState {
  pendingRestaurants: any[];
  analyticsData: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  
  fetchPendingRestaurants: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
}

const useAdminStore = create<AdminState>((set) => ({
  pendingRestaurants: [],
  analyticsData: null,
  isLoading: false,
  error: null,
  
  fetchPendingRestaurants: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter for unapproved restaurants
      const pendingRestaurants = mockRestaurants.filter(r => !r.isApproved);
      
      set({
        pendingRestaurants,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred fetching pending restaurants',
        isLoading: false
      });
    }
  },
  
  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate analytics data
      const analyticsData = generateAnalytics();
      
      set({
        analyticsData,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred fetching analytics data',
        isLoading: false
      });
    }
  },
}));

export default useAdminStore;