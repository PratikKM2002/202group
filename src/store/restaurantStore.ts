import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Restaurant, Review, TimeSlot, SearchParams } from '../types';
import { mockRestaurants, mockReviews } from '../utils/mockData';
import { format, parse, addDays } from 'date-fns';

interface RestaurantState {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  searchParams: SearchParams;
  
  fetchRestaurants: () => Promise<void>;
  searchRestaurants: (params: SearchParams) => Promise<void>;
  getRestaurantById: (id: string) => Promise<void>;
  getRestaurantReviews: (id: string) => Promise<void>;
  getAvailableTimeSlots: (restaurantId: string, date: Date, partySize: number) => TimeSlot[];
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'rating' | 'reviewCount' | 'bookingsToday' | 'isApproved' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => Promise<void>;
  approveRestaurant: (id: string) => Promise<void>;
  removeRestaurant: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<void>;
}

const defaultSearchParams: SearchParams = {
  date: new Date(),
  time: '19:00',
  partySize: 2,
  location: '',
  cuisine: '',
};

const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      restaurants: mockRestaurants,
      filteredRestaurants: mockRestaurants.filter(r => r.isApproved),
      currentRestaurant: null,
      reviews: [],
      isLoading: false,
      error: null,
      searchParams: defaultSearchParams,
      
      fetchRestaurants: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { restaurants } = get();
          const currentRestaurants = restaurants.length > 0 ? restaurants : mockRestaurants;
          
          set({
            restaurants: currentRestaurants,
            filteredRestaurants: currentRestaurants.filter(r => r.isApproved),
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred fetching restaurants',
            isLoading: false
          });
        }
      },
      
      searchRestaurants: async (params) => {
        set({ isLoading: true, error: null, searchParams: params });
        
        try {
          const { restaurants } = get();
          let filtered = restaurants.filter(r => r.isApproved);
          
          // Filter by location if provided
          if (params.location) {
            const locationLower = params.location.toLowerCase();
            filtered = filtered.filter(r => 
              r.address.city.toLowerCase().includes(locationLower) ||
              r.address.state.toLowerCase().includes(locationLower) ||
              r.address.zipCode.includes(params.location!)
            );
          }
          
          // Filter by cuisine if provided
          if (params.cuisine) {
            const cuisineLower = params.cuisine.toLowerCase();
            filtered = filtered.filter(r => 
              r.cuisine.toLowerCase().includes(cuisineLower)
            );
          }
          
          set({
            filteredRestaurants: filtered,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred searching restaurants',
            isLoading: false
          });
        }
      },
      
      getRestaurantById: async (id) => {
        set({ isLoading: true, error: null, currentRestaurant: null });
        
        try {
          const { restaurants } = get();
          const restaurant = restaurants.find(r => r.id === id);
          
          if (!restaurant) {
            set({ error: 'Restaurant not found', isLoading: false });
            return;
          }
          
          set({
            currentRestaurant: restaurant,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred fetching the restaurant',
            isLoading: false
          });
        }
      },
      
      getRestaurantReviews: async (id) => {
        set({ isLoading: true, error: null, reviews: [] });
        
        try {
          const restaurantReviews = mockReviews.filter(r => r.restaurantId === id);
          
          set({
            reviews: restaurantReviews,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred fetching reviews',
            isLoading: false
          });
        }
      },
      
      getAvailableTimeSlots: (restaurantId, date, partySize) => {
        const { restaurants } = get();
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return [];
        
        const dayOfWeek = format(date, 'EEEE').toLowerCase();
        const hours = restaurant.hours[dayOfWeek];
        
        if (!hours) return [];
        
        const openTime = parse(hours.open, 'HH:mm', new Date());
        const closeTime = parse(hours.close, 'HH:mm', new Date());
        
        // Generate time slots every 30 minutes
        const slots: TimeSlot[] = [];
        let currentTime = openTime;
        
        while (currentTime <= closeTime) {
          const timeString = format(currentTime, 'HH:mm');
          
          // Simulate some random availability
          const isAvailable = Math.random() > 0.3; // 70% chance of availability
          
          slots.push({
            time: timeString,
            available: isAvailable,
          });
          
          // Add 30 minutes
          currentTime = new Date(currentTime.getTime() + 30 * 60000);
        }
        
        return slots;
      },
      
      addRestaurant: async (restaurantData) => {
        set({ isLoading: true, error: null });
        
        try {
          const newRestaurant: Restaurant = {
            ...restaurantData,
            id: `restaurant-${Date.now()}`,
            rating: 0,
            reviewCount: 0,
            bookingsToday: 0,
            isApproved: false, // New restaurants start as unapproved
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set(state => ({
            restaurants: [...state.restaurants, newRestaurant],
            isLoading: false,
          }));
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred adding the restaurant',
            isLoading: false
          });
        }
      },
      
      updateRestaurant: async (id, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          set(state => {
            const restaurantIndex = state.restaurants.findIndex(r => r.id === id);
            
            if (restaurantIndex === -1) {
              throw new Error('Restaurant not found');
            }
            
            const updatedRestaurants = [...state.restaurants];
            updatedRestaurants[restaurantIndex] = {
              ...updatedRestaurants[restaurantIndex],
              ...updates,
              updatedAt: new Date().toISOString(),
            };
            
            return {
              restaurants: updatedRestaurants,
              currentRestaurant: id === state.currentRestaurant?.id 
                ? updatedRestaurants[restaurantIndex]
                : state.currentRestaurant,
              isLoading: false,
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred updating the restaurant',
            isLoading: false
          });
        }
      },
      
      approveRestaurant: async (id) => {
        const { updateRestaurant } = get();
        await updateRestaurant(id, { isApproved: true });
      },
      
      removeRestaurant: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          set(state => ({
            restaurants: state.restaurants.filter(r => r.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred removing the restaurant',
            isLoading: false
          });
        }
      },
      
      addReview: async (review) => {
        set({ isLoading: true, error: null });
        
        try {
          const newReview = {
            ...review,
            id: `review-${Date.now()}`,
            date: new Date().toISOString(),
          };
          
          set(state => ({
            reviews: [...state.reviews, newReview],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred adding the review',
            isLoading: false
          });
        }
      },
    }),
    {
      name: 'restaurant-store',
      partialize: (state) => ({
        restaurants: state.restaurants,
        reviews: state.reviews,
      }),
    }
  )
);

export default useRestaurantStore;