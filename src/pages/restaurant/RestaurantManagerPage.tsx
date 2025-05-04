import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Clock, Image, Phone, MapPin, Info, Globe, Calendar, Table, CheckCircle, AlertCircle } from 'lucide-react';
import useRestaurantStore from '../../store/restaurantStore';
import useAuthStore from '../../store/authStore';
import Button from '../../components/common/Button';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import { Restaurant } from '../../types';

const RestaurantManagerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { restaurants, fetchRestaurants, isLoading } = useRestaurantStore();
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        await fetchRestaurants();
      } catch (err) {
        setError('Failed to load restaurants');
        console.error('Error loading restaurants:', err);
      }
    };

    loadRestaurants();
  }, [fetchRestaurants]);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Restaurant Management</h1>
          <p className="text-neutral-400 mt-1">Manage your restaurant listings and settings</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => navigate('/restaurant/new')}
        >
          Add New Restaurant
        </Button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-error-900/50 border border-error-700 rounded-lg">
          <p className="text-error-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Restaurant List */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4">
            <h2 className="text-xl font-semibold text-white mb-4">My Restaurants</h2>
            {restaurants.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-400 mb-4">No restaurants yet</p>
                <Button
                  variant="primary"
                  leftIcon={<Plus size={16} />}
                  onClick={() => navigate('/restaurant/new')}
                >
                  Add Restaurant
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedRestaurant?.id === restaurant.id
                        ? 'bg-primary-500/20 border border-primary-500'
                        : 'hover:bg-neutral-800/50'
                    }`}
                    onClick={() => handleRestaurantSelect(restaurant)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">{restaurant.name}</h3>
                        <p className="text-sm text-neutral-400">{restaurant.cuisine}</p>
                      </div>
                      {restaurant.isApproved ? (
                        <CheckCircle className="text-success-500" size={16} />
                      ) : (
                        <AlertCircle className="text-warning-500" size={16} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="lg:col-span-2">
          {selectedRestaurant ? (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="glass-card p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="secondary"
                    leftIcon={<Calendar size={16} />}
                    onClick={() => navigate(`/restaurant/bookings/${selectedRestaurant.id}`)}
                  >
                    View Bookings
                  </Button>
                  <Button
                    variant="secondary"
                    leftIcon={<Table size={16} />}
                    onClick={() => navigate(`/restaurant/tables/${selectedRestaurant.id}`)}
                  >
                    Manage Tables
                  </Button>
                  <Button
                    variant="secondary"
                    leftIcon={<Image size={16} />}
                    onClick={() => navigate(`/restaurant/photos/${selectedRestaurant.id}`)}
                  >
                    Update Photos
                  </Button>
                  <Button
                    variant="secondary"
                    leftIcon={<Clock size={16} />}
                    onClick={() => navigate(`/restaurant/hours/${selectedRestaurant.id}`)}
                  >
                    Set Hours
                  </Button>
                </div>
              </div>

              {/* Main Details */}
              <div className="glass-card p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">{selectedRestaurant.name}</h2>
                      {selectedRestaurant.isApproved ? (
                        <span className="px-2 py-1 text-xs font-medium bg-success-500/20 text-success-400 rounded">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-warning-500/20 text-warning-400 rounded">
                          Pending Approval
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-400">{selectedRestaurant.cuisine}</p>
                  </div>
                  <Button
                    variant="primary"
                    leftIcon={<Settings size={16} />}
                    onClick={() => navigate(`/restaurant/edit/${selectedRestaurant.id}`)}
                  >
                    Edit Details
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <MapPin size={16} />
                      <div>
                        <p>{selectedRestaurant.address.street}</p>
                        <p className="text-sm">
                          {selectedRestaurant.address.city}, {selectedRestaurant.address.state} {selectedRestaurant.address.zipCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Phone size={16} />
                      <span>{selectedRestaurant.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Globe size={16} />
                      <span>{selectedRestaurant.contactInfo.website || 'No website'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-neutral-400">
                      <Info size={16} className="mt-1" />
                      <p className="text-sm">{selectedRestaurant.description}</p>
                    </div>
                  </div>

                  {/* Hours and Booking */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-neutral-400">
                      <Clock size={16} className="mt-1" />
                      <div>
                        <h3 className="text-white font-medium mb-2">Operating Hours</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(selectedRestaurant.hours).map(([day, hours]) => (
                            <div key={day} className="text-sm">
                              <span className="font-medium">{formatDay(day)}:</span>
                              <br />
                              {hours.open} - {hours.close}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photos */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-neutral-400 mb-4">
                      <Image size={16} />
                      <h3 className="text-white font-medium">Photos</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedRestaurant.images?.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-video rounded-lg bg-neutral-800 overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={`Restaurant photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-4">Select a Restaurant</h2>
              <p className="text-neutral-400">
                Choose a restaurant from the list to view and manage its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagerPage;