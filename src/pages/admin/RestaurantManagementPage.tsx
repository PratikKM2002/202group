import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRestaurantStore from '../../store/restaurantStore';
import useAuthStore from '../../store/authStore';
import { UserRole } from '../../types';
import Button from '../../components/common/Button';
import { AlertCircle } from 'lucide-react';

const RestaurantManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { restaurants, fetchRestaurants, updateRestaurant, removeRestaurant, isLoading, error } = useRestaurantStore();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== UserRole.Admin) {
      navigate('/login');
      return;
    }

    fetchRestaurants();
  }, [user, navigate, fetchRestaurants]);

  const handleEdit = (restaurantId: string) => {
    navigate(`/admin/restaurants/${restaurantId}/edit`);
  };

  const handleSuspend = async (restaurantId: string, currentlySuspended: boolean) => {
    try {
      await updateRestaurant(restaurantId, { suspended: !currentlySuspended });
      fetchRestaurants(); // Refresh the list
    } catch (error) {
      console.error('Failed to update restaurant status:', error);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (statusFilter === 'active') return !restaurant.suspended;
    if (statusFilter === 'suspended') return restaurant.suspended;
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Restaurant Management</h1>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'suspended')}
              className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-4 py-2"
            >
              <option value="all">All Restaurants</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-900/50 border border-error-700 rounded-lg flex items-center gap-3 text-error-400">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-700/50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300">Restaurant</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-neutral-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredRestaurants.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-neutral-400">
                      No restaurants found
                    </td>
                  </tr>
                ) : (
                  filteredRestaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-neutral-700/30">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{restaurant.name}</div>
                          <div className="text-sm text-neutral-400">{restaurant.cuisine}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-300">
                        {restaurant.address.city}, {restaurant.address.state}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            restaurant.suspended
                              ? 'bg-error-900/50 text-error-400'
                              : 'bg-success-900/50 text-success-400'
                          }`}
                        >
                          {restaurant.suspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(restaurant.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant={restaurant.suspended ? "primary" : "danger"}
                            size="sm"
                            onClick={() => handleSuspend(restaurant.id, restaurant.suspended)}
                          >
                            {restaurant.suspended ? 'Activate' : 'Suspend'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagementPage; 