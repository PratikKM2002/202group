export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export enum UserRole {
  Customer = 'customer',
  RestaurantManager = 'restaurant_manager',
  Admin = 'admin',
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  priceRange: number; // 1-4 ($-$$$$)
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: {
    [key: string]: { // day of week
      open: string; // HH:MM format
      close: string; // HH:MM format
    };
  };
  images: string[];
  rating: number; // 1-5 stars
  reviewCount: number;
  bookingsToday: number;
  isApproved: boolean;
  suspended?: boolean;
  createdAt: string;
  updatedAt: string;
  managerId: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  restaurantId: string;
  userId: string;
  date: string;
  time: string;
  partySize: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface SearchParams {
  date: Date;
  time: string;
  partySize: number;
  location?: string;
  cuisine?: string;
}

export interface AnalyticsData {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averagePartySize: number;
  bookingsByDay: { date: string; count: number }[];
  bookingsByRestaurant: { name: string; count: number }[];
  topRestaurants: { name: string; count: number }[];
}