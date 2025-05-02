import { User, UserRole, Restaurant, Review, Booking, BookingStatus } from '../types';
import { format, subDays, addDays } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    role: UserRole.Customer,
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: UserRole.Customer,
  },
  {
    id: '3',
    email: 'manager@italianplace.com',
    name: 'Mario Rossi',
    role: UserRole.RestaurantManager,
  },
  {
    id: '4',
    email: 'manager@sushispot.com',
    name: 'Takashi Yamamoto',
    role: UserRole.RestaurantManager,
  },
  {
    id: '5',
    email: 'admin@booktable.com',
    name: 'Admin User',
    role: UserRole.Admin,
  },
];

// Mock Restaurants
export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Fog City Diner',
    description: 'Classic American diner with a modern twist, serving comfort food with a gourmet touch.',
    cuisine: 'American',
    priceRange: 2,
    address: {
      street: '1300 Battery St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94111',
      country: 'USA',
      latitude: 37.7987,
      longitude: -122.4007,
    },
    contactInfo: {
      phone: '(415) 982-2000',
      email: 'info@fogcitydiner.com',
      website: 'https://fogcitydiner.com',
    },
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '22:00' },
    },
    images: [
      'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    ],
    rating: 4.5,
    reviewCount: 428,
    bookingsToday: 15,
    isApproved: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T15:30:00Z',
    managerId: '1',
  },
  {
    id: '2',
    name: 'Sushi Ran',
    description: 'Award-winning Japanese restaurant known for its fresh sushi and innovative fusion dishes.',
    cuisine: 'Japanese',
    priceRange: 4,
    address: {
      street: '107 Caledonia St',
      city: 'Sausalito',
      state: 'CA',
      zipCode: '94965',
      country: 'USA',
      latitude: 37.8575,
      longitude: -122.4750,
    },
    contactInfo: {
      phone: '(415) 332-3620',
      email: 'reservations@sushiran.com',
      website: 'https://sushiran.com',
    },
    hours: {
      monday: { open: '11:30', close: '21:30' },
      tuesday: { open: '11:30', close: '21:30' },
      wednesday: { open: '11:30', close: '21:30' },
      thursday: { open: '11:30', close: '21:30' },
      friday: { open: '11:30', close: '22:00' },
      saturday: { open: '11:30', close: '22:00' },
      sunday: { open: '11:30', close: '21:30' },
    },
    images: [
      'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
      'https://images.pexels.com/photos/2098082/pexels-photo-2098082.jpeg',
    ],
    rating: 4.8,
    reviewCount: 892,
    bookingsToday: 25,
    isApproved: true,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-03-19T14:20:00Z',
    managerId: '2',
  },
  {
    id: '3',
    name: 'Chez Panisse',
    description: 'Iconic restaurant pioneering California cuisine with a focus on local, organic ingredients.',
    cuisine: 'California',
    priceRange: 4,
    address: {
      street: '1517 Shattuck Ave',
      city: 'Berkeley',
      state: 'CA',
      zipCode: '94709',
      country: 'USA',
      latitude: 37.8775,
      longitude: -122.2697,
    },
    contactInfo: {
      phone: '(510) 548-5525',
      email: 'info@chezpanisse.com',
      website: 'https://chezpanisse.com',
    },
    hours: {
      monday: { open: '11:30', close: '22:00' },
      tuesday: { open: '11:30', close: '22:00' },
      wednesday: { open: '11:30', close: '22:00' },
      thursday: { open: '11:30', close: '22:00' },
      friday: { open: '11:30', close: '22:30' },
      saturday: { open: '11:30', close: '22:30' },
      sunday: { open: '11:30', close: '22:00' },
    },
    images: [
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg',
    ],
    rating: 4.7,
    reviewCount: 1567,
    bookingsToday: 30,
    isApproved: true,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-03-18T16:45:00Z',
    managerId: '3',
  },
  {
    id: '4',
    name: 'Tacolicious',
    description: 'Modern Mexican restaurant serving creative tacos and craft cocktails in a vibrant setting.',
    cuisine: 'Mexican',
    priceRange: 2,
    address: {
      street: '741 Valencia St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94110',
      country: 'USA',
      latitude: 37.7647,
      longitude: -122.4217,
    },
    contactInfo: {
      phone: '(415) 626-1344',
      email: 'mission@tacolicious.com',
      website: 'https://tacolicious.com',
    },
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '22:00' },
    },
    images: [
      'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
      'https://images.pexels.com/photos/2098082/pexels-photo-2098082.jpeg',
    ],
    rating: 4.3,
    reviewCount: 723,
    bookingsToday: 18,
    isApproved: true,
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-03-21T13:15:00Z',
    managerId: '4',
  },
  {
    id: '5',
    name: 'State Bird Provisions',
    description: 'Innovative dim sum-style restaurant serving creative California cuisine with Asian influences.',
    cuisine: 'Fusion',
    priceRange: 3,
    address: {
      street: '1529 Fillmore St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94115',
      country: 'USA',
      latitude: 37.7727,
      longitude: -122.4347,
    },
    contactInfo: {
      phone: '(415) 795-1272',
      email: 'info@statebirdsf.com',
      website: 'https://statebirdsf.com',
    },
    hours: {
      monday: { open: '17:30', close: '22:00' },
      tuesday: { open: '17:30', close: '22:00' },
      wednesday: { open: '17:30', close: '22:00' },
      thursday: { open: '17:30', close: '22:00' },
      friday: { open: '17:30', close: '22:30' },
      saturday: { open: '17:30', close: '22:30' },
      sunday: { open: '17:30', close: '22:00' },
    },
    images: [
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg',
    ],
    rating: 4.6,
    reviewCount: 945,
    bookingsToday: 22,
    isApproved: true,
    createdAt: '2024-01-25T10:30:00Z',
    updatedAt: '2024-03-22T12:00:00Z',
    managerId: '5',
  },
  {
    id: '6',
    name: 'Slanted Door',
    description: 'Modern Vietnamese restaurant with stunning views of the Bay Bridge and Ferry Building.',
    cuisine: 'Vietnamese',
    priceRange: 3,
    address: {
      street: '1 Ferry Building #3',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94111',
      country: 'USA',
      latitude: 37.7957,
      longitude: -122.3937,
    },
    contactInfo: {
      phone: '(415) 861-8032',
      email: 'info@slanteddoor.com',
      website: 'https://slanteddoor.com',
    },
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '22:30' },
      saturday: { open: '11:00', close: '22:30' },
      sunday: { open: '11:00', close: '22:00' },
    },
    images: [
      'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
      'https://images.pexels.com/photos/2098082/pexels-photo-2098082.jpeg',
    ],
    rating: 4.4,
    reviewCount: 1123,
    bookingsToday: 28,
    isApproved: true,
    createdAt: '2024-01-30T09:15:00Z',
    updatedAt: '2024-03-23T11:30:00Z',
    managerId: '6',
  },
  {
    id: '7',
    name: 'Zuni Café',
    description: 'Iconic restaurant known for its wood-fired chicken and Mediterranean-inspired cuisine.',
    cuisine: 'Mediterranean',
    priceRange: 3,
    address: {
      street: '1658 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
      latitude: 37.7737,
      longitude: -122.4217,
    },
    contactInfo: {
      phone: '(415) 552-2522',
      email: 'info@zunicafe.com',
      website: 'https://zunicafe.com',
    },
    hours: {
      monday: { open: '11:30', close: '22:00' },
      tuesday: { open: '11:30', close: '22:00' },
      wednesday: { open: '11:30', close: '22:00' },
      thursday: { open: '11:30', close: '22:00' },
      friday: { open: '11:30', close: '22:30' },
      saturday: { open: '11:30', close: '22:30' },
      sunday: { open: '11:30', close: '22:00' },
    },
    images: [
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg',
    ],
    rating: 4.5,
    reviewCount: 876,
    bookingsToday: 20,
    isApproved: true,
    createdAt: '2024-02-05T08:45:00Z',
    updatedAt: '2024-03-24T10:45:00Z',
    managerId: '7',
  },
  {
    id: '8',
    name: 'Benu',
    description: 'Three-Michelin-starred restaurant offering innovative Korean-inspired tasting menus.',
    cuisine: 'Korean',
    priceRange: 4,
    address: {
      street: '22 Hawthorne St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      latitude: 37.7877,
      longitude: -122.4007,
    },
    contactInfo: {
      phone: '(415) 685-4860',
      email: 'info@benusf.com',
      website: 'https://benusf.com',
    },
    hours: {
      monday: { open: '17:30', close: '21:30' },
      tuesday: { open: '17:30', close: '21:30' },
      wednesday: { open: '17:30', close: '21:30' },
      thursday: { open: '17:30', close: '21:30' },
      friday: { open: '17:30', close: '21:30' },
      saturday: { open: '17:30', close: '21:30' },
      sunday: { open: '17:30', close: '21:30' },
    },
    images: [
      'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
      'https://images.pexels.com/photos/2098082/pexels-photo-2098082.jpeg',
    ],
    rating: 4.9,
    reviewCount: 567,
    bookingsToday: 12,
    isApproved: true,
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-03-25T09:30:00Z',
    managerId: '8',
  }
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    restaurantId: '1',
    userId: '1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Amazing pasta and excellent service! The tiramisu was to die for.',
    date: '2023-04-12T18:30:00Z',
  },
  {
    id: '2',
    restaurantId: '1',
    userId: '2',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Great food and atmosphere. A bit loud on Friday nights but still worth it.',
    date: '2023-04-08T19:45:00Z',
  },
  {
    id: '3',
    restaurantId: '2',
    userId: '1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Best sushi in the city! The omakase was incredible.',
    date: '2023-04-15T20:15:00Z',
  },
  {
    id: '4',
    restaurantId: '3',
    userId: '2',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Delicious burgers and great craft beer selection.',
    date: '2023-04-05T12:30:00Z',
  },
  {
    id: '5',
    restaurantId: '4',
    userId: '1',
    userName: 'John Doe',
    rating: 3,
    comment: 'Good tacos but service was a bit slow.',
    date: '2023-04-10T13:45:00Z',
  },
];

// Generate mock bookings across multiple dates
const today = new Date();
const generateBookings = () => {
  const bookings: Booking[] = [];
  const statuses = [BookingStatus.Pending, BookingStatus.Confirmed, BookingStatus.Cancelled, BookingStatus.Completed];
  const times = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
  
  // Generate bookings for the past 14 days and next 14 days
  for (let i = -14; i <= 14; i++) {
    const date = format(addDays(today, i), 'yyyy-MM-dd');
    const numBookings = Math.floor(Math.random() * 10) + 5; // 5-15 bookings per day
    
    for (let j = 0; j < numBookings; j++) {
      const restaurantId = String(Math.floor(Math.random() * 6) + 1);
      const userId = String(Math.floor(Math.random() * 2) + 1);
      const timeIndex = Math.floor(Math.random() * times.length);
      const partySize = Math.floor(Math.random() * 6) + 1;
      
      // Past bookings should be completed or cancelled, future bookings pending or confirmed
      let statusIndex = 0;
      if (i < 0) {
        // Past bookings: completed or cancelled
        statusIndex = Math.random() > 0.2 ? 3 : 2; // 80% completed, 20% cancelled
      } else {
        // Future bookings: pending or confirmed
        statusIndex = Math.random() > 0.3 ? 1 : 0; // 70% confirmed, 30% pending
      }

      bookings.push({
        id: `booking-${date}-${j}`,
        restaurantId,
        userId,
        date,
        time: times[timeIndex],
        partySize,
        status: statuses[statusIndex],
        specialRequests: Math.random() > 0.7 ? 'Window seat please' : undefined,
        createdAt: format(subDays(today, Math.abs(i) + Math.floor(Math.random() * 5)), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        updatedAt: format(subDays(today, Math.abs(i)), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      });
    }
  }
  
  return bookings;
};

export const mockBookings: Booking[] = generateBookings();

// Generate analytics mock data
export const generateAnalytics = (): any => {
  // Filter bookings for the last 30 days
  const thirtyDaysAgo = subDays(today, 30);
  const recentBookings = mockBookings.filter(booking => 
    new Date(booking.date) >= thirtyDaysAgo && new Date(booking.date) <= today
  );

  // Count bookings by status
  const totalBookings = recentBookings.length;
  const completedBookings = recentBookings.filter(b => b.status === BookingStatus.Completed).length;
  const cancelledBookings = recentBookings.filter(b => b.status === BookingStatus.Cancelled).length;
  
  // Calculate average party size
  const totalPartySize = recentBookings.reduce((sum, booking) => sum + booking.partySize, 0);
  const averagePartySize = totalBookings > 0 ? totalPartySize / totalBookings : 0;
  
  // Count bookings by day
  const bookingsByDay: { date: string; count: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    const count = recentBookings.filter(b => b.date === date).length;
    bookingsByDay.push({ date, count });
  }
  
  // Count bookings by restaurant
  const bookingsByRestaurant = mockRestaurants.map(restaurant => ({
    name: restaurant.name,
    count: recentBookings.filter(b => b.restaurantId === restaurant.id).length,
  }));
  
  // Get top restaurants
  const topRestaurants = [...bookingsByRestaurant].sort((a, b) => b.count - a.count).slice(0, 5);
  
  return {
    totalBookings,
    completedBookings,
    cancelledBookings,
    averagePartySize,
    bookingsByDay: bookingsByDay.reverse(), // Chronological order
    bookingsByRestaurant,
    topRestaurants,
  };
};