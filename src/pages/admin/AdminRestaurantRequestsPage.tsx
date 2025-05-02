import React, { useEffect, useState } from 'react';
import { Check, X, ExternalLink } from 'lucide-react';
import useRestaurantStore from '../../store/restaurantStore';
import Button from '../../components/common/Button';

const AdminRestaurantRequestsPage = () => {
  const { restaurants, fetchRestaurants, approveRestaurant, removeRestaurant, isLoading } = useRestaurantStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Filter pending restaurants
  const pendingRestaurants = restaurants.filter(r => 
    !r.isApproved && 
    (searchTerm === '' || 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApprove = async (id: string) => {
    try {
      await approveRestaurant(id);
      // Refresh the list
      fetchRestaurants();
    } catch (error) {
      console.error('Error approving restaurant:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm('Are you sure you want to reject this restaurant? This action cannot be undone.')) {
      try {
        await removeRestaurant(id);
        // Refresh the list
        fetchRestaurants();
      } catch (error) {
        console.error('Error rejecting restaurant:', error);
      }
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Restaurant Requests</h1>
          <p className="text-neutral-400 mt-1">Review and manage restaurant registration requests</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {pendingRestaurants.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">No Pending Requests</h2>
          <p className="text-neutral-400">There are no restaurant requests waiting for approval.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="glass-card p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">{restaurant.name}</h2>
                  <p className="text-neutral-400 mb-4">{restaurant.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-300 mb-1">Cuisine</h3>
                      <p className="text-white">{restaurant.cuisine}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-300 mb-1">Price Range</h3>
                      <p className="text-white">{'$'.repeat(restaurant.priceRange)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-300 mb-1">Location</h3>
                      <p className="text-white">
                        {restaurant.address.city}, {restaurant.address.state}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-300 mb-1">Contact</h3>
                      <p className="text-white">{restaurant.contactInfo.phone}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${restaurant.name} - ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Check size={16} />}
                    onClick={() => handleApprove(restaurant.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<X size={16} />}
                    onClick={() => handleReject(restaurant.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ExternalLink size={16} />}
                    onClick={() => window.open(`/restaurants/${restaurant.id}`, '_blank')}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRestaurantRequestsPage;