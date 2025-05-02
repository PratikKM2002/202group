import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, MapPin, ChevronDown } from 'lucide-react';
import SearchForm from '../components/search/SearchForm';
import RestaurantList from '../components/restaurant/RestaurantList';
import RestaurantMap from '../components/map/RestaurantMap';
import Button from '../components/common/Button';
import useRestaurantStore from '../store/restaurantStore';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchRestaurants, filteredRestaurants, isLoading } = useRestaurantStore();
  
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [cuisine, setCuisine] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number[]>([]);
  
  // Parse URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const partySize = searchParams.get('partySize');
    const locationParam = searchParams.get('location');
    const cuisineParam = searchParams.get('cuisine');
    
    if (date && time && partySize) {
      searchRestaurants({
        date: new Date(date),
        time: time || '19:00',
        partySize: parseInt(partySize) || 2,
        location: locationParam || undefined,
        cuisine: cuisineParam || undefined,
      });
      
      if (cuisineParam) {
        setCuisine(cuisineParam);
      }
    } else {
      // If missing required params, redirect back to search page
      navigate('/search');
    }
  }, [location.search, searchRestaurants, navigate]);
  
  // Handle time slot selection
  const handleTimeSelect = (restaurantId: string, time: string) => {
    const searchParams = new URLSearchParams(location.search);
    const date = searchParams.get('date') || '';
    const partySize = searchParams.get('partySize') || '2';
    
    navigate(`/restaurants/${restaurantId}?date=${date}&time=${time}&partySize=${partySize}`);
  };
  
  // Apply filters
  const applyFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    
    if (cuisine) {
      searchParams.set('cuisine', cuisine);
    } else {
      searchParams.delete('cuisine');
    }
    
    navigate(`/search/results?${searchParams.toString()}`);
  };
  
  // Get formatted date and party size for display
  const getSearchInfo = () => {
    const searchParams = new URLSearchParams(location.search);
    const date = searchParams.get('date');
    const partySize = searchParams.get('partySize');
    
    let dateText = 'Today';
    if (date) {
      const dateObj = new Date(date);
      dateText = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
    
    return {
      date: dateText,
      partySize: partySize ? `${partySize} ${parseInt(partySize) === 1 ? 'person' : 'people'}` : '2 people',
      location: searchParams.get('location') || 'Any Location',
    };
  };
  
  const searchInfo = getSearchInfo();
  
  // Only show non-suspended restaurants in search results
  const visibleFilteredRestaurants = filteredRestaurants.filter(r => !r.suspended);

  return (
    <div>
      {/* Search bar */}
      <div className="bg-primary-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchForm inline className="bg-white p-4 rounded-lg shadow" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search summary */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Available restaurants for {searchInfo.date}
          </h1>
          <div className="flex flex-wrap items-center text-sm text-neutral-600">
            <div className="mr-4 mb-2">
              <span className="font-medium">{searchInfo.partySize}</span>
            </div>
            
            {searchInfo.location !== 'Any Location' && (
              <div className="flex items-center mr-4 mb-2">
                <MapPin size={16} className="mr-1" />
                <span>{searchInfo.location}</span>
              </div>
            )}
            
            <div className="mr-4 mb-2">
              <span>{filteredRestaurants.length} restaurants available</span>
            </div>
          </div>
        </div>
        
        {/* Filters and view toggle */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            leftIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm text-neutral-600">View:</span>
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  !showMap
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50'
                } rounded-l-md border border-neutral-300`}
                onClick={() => setShowMap(false)}
              >
                List
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  showMap
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50'
                } rounded-r-md border border-neutral-300 border-l-0`}
                onClick={() => setShowMap(true)}
              >
                Map
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="cuisine" className="block text-sm font-medium text-neutral-700 mb-1">
                  Cuisine
                </label>
                <select
                  id="cuisine"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Cuisines</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Chinese">Chinese</option>
                  <option value="American">American</option>
                  <option value="French">French</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Price
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((price) => (
                    <button
                      key={price}
                      type="button"
                      className={`flex-1 py-2 px-3 border ${
                        priceRange.includes(price)
                          ? 'bg-primary-50 border-primary-500 text-primary-700'
                          : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                      } rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      onClick={() => {
                        if (priceRange.includes(price)) {
                          setPriceRange(priceRange.filter(p => p !== price));
                        } else {
                          setPriceRange([...priceRange, price]);
                        }
                      }}
                    >
                      {'$'.repeat(price)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2 flex items-end">
                <Button variant="primary" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Results */}
        <div className="mt-6">
          {showMap ? (
            <div className="h-[600px] rounded-lg overflow-hidden">
              <RestaurantMap restaurants={visibleFilteredRestaurants} height="100%" />
            </div>
          ) : (
            <RestaurantList 
              restaurants={visibleFilteredRestaurants} 
              isLoading={isLoading}
              showTimeSlots
              onTimeSelect={handleTimeSelect}
              emptyMessage="No restaurants available for the selected criteria. Try changing your search parameters."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;