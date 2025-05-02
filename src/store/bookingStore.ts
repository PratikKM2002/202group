import { create } from 'zustand';
import { Booking, BookingStatus } from '../types';
import { mockBookings, mockRestaurants } from '../utils/mockData';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  
  fetchUserBookings: (userId: string) => Promise<void>;
  fetchRestaurantBookings: (restaurantId: string) => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  getBookingById: (id: string) => Promise<void>;
  createBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
}

const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  
  fetchUserBookings: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter bookings for the user
      const userBookings = mockBookings.filter(b => b.userId === userId);
      
      // Sort by date (most recent first)
      userBookings.sort((a, b) => 
        new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
      );
      
      set({
        bookings: userBookings,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred fetching bookings',
        isLoading: false
      });
    }
  },
  
  fetchRestaurantBookings: async (restaurantId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter bookings for the restaurant
      const restaurantBookings = mockBookings.filter(b => b.restaurantId === restaurantId);
      
      // Sort by date (most recent first)
      restaurantBookings.sort((a, b) => 
        new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
      );
      
      set({
        bookings: restaurantBookings,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred fetching bookings',
        isLoading: false
      });
    }
  },
  
  fetchAllBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sort by date (most recent first)
      const sortedBookings = [...mockBookings].sort((a, b) => 
        new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
      );
      
      set({
        bookings: sortedBookings,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred fetching bookings',
        isLoading: false
      });
    }
  },
  
  getBookingById: async (id) => {
    set({ isLoading: true, error: null, currentBooking: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const booking = mockBookings.find(b => b.id === id);
      
      if (!booking) {
        set({ error: 'Booking not found', isLoading: false });
        return;
      }
      
      set({
        currentBooking: booking,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred fetching the booking',
        isLoading: false
      });
    }
  },
  
  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Date.now()}`,
        status: BookingStatus.Confirmed, // Auto-confirm for demo purposes
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to mock bookings (this would be a database operation in a real app)
      mockBookings.push(newBooking);
      
      // Update bookings today count for the restaurant
      const restaurant = mockRestaurants.find(r => r.id === bookingData.restaurantId);
      if (restaurant && isToday(parseISO(bookingData.date))) {
        restaurant.bookingsToday++;
      }
      
      set({
        currentBooking: newBooking,
        isLoading: false,
      });
      
      return newBooking;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred creating the booking',
        isLoading: false
      });
    }
  },
  
  updateBookingStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const bookingIndex = mockBookings.findIndex(b => b.id === id);
      
      if (bookingIndex === -1) {
        set({ error: 'Booking not found', isLoading: false });
        return;
      }
      
      // Update the booking
      mockBookings[bookingIndex].status = status;
      mockBookings[bookingIndex].updatedAt = new Date().toISOString();
      
      // If canceling a booking for today, update the restaurant's bookingsToday count
      if (
        status === BookingStatus.Cancelled && 
        isToday(parseISO(mockBookings[bookingIndex].date)) &&
        mockBookings[bookingIndex].status !== BookingStatus.Cancelled
      ) {
        const restaurant = mockRestaurants.find(r => r.id === mockBookings[bookingIndex].restaurantId);
        if (restaurant && restaurant.bookingsToday > 0) {
          restaurant.bookingsToday--;
        }
      }
      
      // If this is the current booking, update it
      if (get().currentBooking?.id === id) {
        set({ currentBooking: mockBookings[bookingIndex] });
      }
      
      set({ isLoading: false });
      
      return mockBookings[bookingIndex];
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred updating the booking',
        isLoading: false
      });
    }
  },
}));

export default useBookingStore;