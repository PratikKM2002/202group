import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Calendar, Settings, Upload, Edit } from 'lucide-react';
import useRestaurantStore from '../../store/restaurantStore';
import useAuthStore from '../../store/authStore';
import Button from '../../components/common/Button';

const RestaurantDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentRestaurant, getRestaurantById } = useRestaurantStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRestaurantData = async () => {
      if (user?.restaurantId) {
        await getRestaurantById(user.restaurantId);
      }
      setIsLoading(false);
    };

    loadRestaurantData();
  }, [user, getRestaurantById]);

  const handleEdit = () => {
    if (currentRestaurant) {
      navigate(`/restaurant/edit/${currentRestaurant.id}`);
    }
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
        <h1 className="text-2xl font-bold text-neutral-800">Restaurant Dashboard</h1>
        <Button
          variant="primary"
          leftIcon={<Edit size={16} />}
          onClick={handleEdit}
        >
          Edit Restaurant
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Today's Bookings</p>
              <h3 className="text-2xl font-bold text-neutral-800">24</h3>
            </div>
            <Calendar className="text-primary-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Avg. Party Size</p>
              <h3 className="text-2xl font-bold text-neutral-800">3.5</h3>
            </div>
            <Users className="text-primary-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Peak Hours</p>
              <h3 className="text-2xl font-bold text-neutral-800">7-9 PM</h3>
            </div>
            <Clock className="text-primary-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Rating</p>
              <h3 className="text-2xl font-bold text-neutral-800">4.8</h3>
            </div>
            <div className="text-secondary-500">★</div>
          </div>
        </div>
      </div>

      {/* Restaurant Profile */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">Restaurant Profile</h2>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Settings size={16} />}
            onClick={() => window.location.href = `/restaurant/settings`}
          >
            Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-neutral-800 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-500">Restaurant Name</label>
                <p className="text-neutral-800">{currentRestaurant?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500">Cuisine Type</label>
                <p className="text-neutral-800">{currentRestaurant?.cuisine}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500">Description</label>
                <p className="text-neutral-800">{currentRestaurant?.description}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-neutral-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-500">Address</label>
                <p className="text-neutral-800">
                  {currentRestaurant?.address.street}<br />
                  {currentRestaurant?.address.city}, {currentRestaurant?.address.state} {currentRestaurant?.address.zipCode}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500">Phone</label>
                <p className="text-neutral-800">{currentRestaurant?.contactInfo.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500">Email</label>
                <p className="text-neutral-800">{currentRestaurant?.contactInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Photos */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">Restaurant Photos</h2>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Upload size={16} />}
            onClick={() => {/* Handle photo upload */}}
          >
            Upload Photos
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentRestaurant?.images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`${currentRestaurant.name} - Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-neutral-100"
                onClick={() => {/* Handle photo deletion */}}
              >
                <span className="sr-only">Delete photo</span>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">Operating Hours</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle hours editing */}}
          >
            Edit Hours
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(currentRestaurant?.hours || {}).map(([day, hours]) => (
            <div key={day} className="flex justify-between items-center py-2 border-b border-neutral-100">
              <span className="capitalize text-neutral-800">{day}</span>
              <span className="text-neutral-600">
                {hours.open} - {hours.close}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboardPage;