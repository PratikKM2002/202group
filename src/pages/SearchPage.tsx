import React from 'react';
import SearchForm from '../components/search/SearchForm';

const SearchPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Find Your Table</h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Search for available reservations at thousands of restaurants
        </p>
      </div>
      
      <div className="mt-8">
        <SearchForm />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900">Browse by Location</h3>
          <p className="mt-2 text-neutral-600">
            Find restaurants by city, neighborhood, or landmark
          </p>
        </div>
        
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900">Filter Your Search</h3>
          <p className="mt-2 text-neutral-600">
            Narrow results by cuisine type, price range, or special features
          </p>
        </div>
        
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900">Select Your Date and Time</h3>
          <p className="mt-2 text-neutral-600">
            Find available tables for your preferred dining schedule
          </p>
        </div>
      </div>
      
      <div className="mt-16 bg-neutral-100 rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Can't decide where to eat?</h2>
            <p className="text-neutral-600 mb-4">
              Browse our curated collections of top restaurants for any occasion, cuisine, or mood.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Date Night Spots
              </a>
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Weekend Brunch
              </a>
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Outdoor Dining
              </a>
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Best for Groups
              </a>
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Award Winners
              </a>
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Local Favorites
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.pexels.com/photos/3434523/pexels-photo-3434523.jpeg"
              alt="Restaurant dining"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;