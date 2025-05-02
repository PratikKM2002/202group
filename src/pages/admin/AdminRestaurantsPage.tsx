import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Plus } from 'lucide-react';
import useRestaurantStore from '../../store/restaurantStore';

const AdminRestaurantsPage = () => {
  const navigate = useNavigate();
  const { restaurants, updateRestaurant, fetchRestaurants } = useRestaurantStore();

  // Handler for Edit button
  const handleEdit = (restaurantId: string) => {
    console.log('Edit clicked for restaurant:', restaurantId);
    navigate(`/admin/restaurants/${restaurantId}/edit`);
  };

  // Handler for Suspend button
  const handleSuspend = async (restaurantId: string, currentlySuspended: boolean) => {
    console.log('Suspend clicked for restaurant:', restaurantId, 'Currently suspended:', currentlySuspended);
    await updateRestaurant(restaurantId, { suspended: !currentlySuspended });
    await fetchRestaurants(); // Refresh the list after update
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Restaurant Management</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/restaurant/new')}
          leftIcon={<Plus size={16} />}
        >
          Add New Restaurant
        </Button>
      </div>
      
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Search restaurants..." 
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white w-64"
            />
            <select className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>
          <select className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white">
            <option>10 per page</option>
            <option>25 per page</option>
            <option>50 per page</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-neutral-700">
                <th className="px-6 py-3 text-sm font-medium text-neutral-300">Restaurant</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-300">Manager</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-300">Location</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-300">Status</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {restaurants && restaurants.length > 0 && restaurants.map((restaurant) => (
                <tr className="text-neutral-300" key={restaurant.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-neutral-700"></div>
                      <div className="ml-4">
                        <div className="font-medium">{restaurant.name}</div>
                        <div className="text-sm text-neutral-400">{restaurant.cuisine}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">Manager</div>
                    <div className="text-sm text-neutral-400">manager@example.com</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{restaurant.address.street}</div>
                    <div className="text-sm text-neutral-400">{restaurant.address.city}, {restaurant.address.state}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${restaurant.suspended ? 'bg-red-900/50 text-red-400' : 'bg-primary-900/50 text-primary-400'}`}>
                      {restaurant.suspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="primary" size="sm" className="mr-2" onClick={() => handleEdit(restaurant.id)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleSuspend(restaurant.id, !!restaurant.suspended)}>
                      {restaurant.suspended ? 'Activate' : 'Suspend'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-neutral-400">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">24</span> results
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRestaurantsPage;