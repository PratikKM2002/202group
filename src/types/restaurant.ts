export interface RestaurantFormData {
  name: string;
  description: string;
  cuisine: string;
  priceRange: number;
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
    website: string;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  images: string[];
}

export interface Restaurant extends RestaurantFormData {
  id: string;
  managerId: string;
  isApproved: boolean;
  suspended: boolean;
  createdAt: string;
  updatedAt: string;
} 