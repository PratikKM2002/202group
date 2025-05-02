import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import useRestaurantStore from '../../store/restaurantStore';
import useAuthStore from '../../store/authStore';
import Button from '../../components/common/Button';
import RestaurantCard from '../../components/restaurant/RestaurantCard';

const RestaurantManagerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { restaurants, fetchRestaurants, isLoading } = useRestaurantStore();
  const [error, setError] = useState<string | null>(null);

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
          <h1 className="text-2xl font-bold text-white">My Restaurants</h1>
          <p className="text-neutral-400 mt-1">Manage your restaurant listings</p>
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

      {restaurants.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">No Restaurants Yet</h2>
          <p className="text-neutral-400 mb-6">
            Get started by adding your first restaurant listing.
          </p>
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/restaurant/new')}
          >
            Add Restaurant
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="relative group">
              <RestaurantCard restaurant={restaurant} />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Settings size={16} />}
                  onClick={() => navigate(`/restaurant/edit/${restaurant.id}`)}
                >
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantManagerPage;