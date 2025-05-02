import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Utensils, Clock, Calendar, Users } from 'lucide-react';
import SearchForm from '../components/search/SearchForm';
import RestaurantList from '../components/restaurant/RestaurantList';
import useRestaurantStore from '../store/restaurantStore';
import Button from '../components/common/Button';

const HomePage: React.FC = () => {
  const { restaurants, fetchRestaurants, isLoading } = useRestaurantStore();
  
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);
  
  // Get top rated restaurants
  const topRatedRestaurants = [...restaurants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Add intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-animation');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div>
      {/* Hero section */}
      <div 
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg)',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find the perfect table at amazing restaurants
          </h1>
          <p className="text-xl text-white mb-8">
            Book online for the best dining experiences at top-rated restaurants
          </p>
          
          <div className="mt-8">
            <SearchForm />
          </div>
        </div>
      </div>
      
      {/* How it works section */}
      <div className="py-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-12">How DineReserve Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-400">
                  <Calendar size={28} />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-medium text-white">Choose a Date & Time</h3>
              <p className="mt-2 text-neutral-400">
                Select your preferred date, time, and party size to find available tables.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-400">
                  <Utensils size={28} />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-medium text-white">Pick a Restaurant</h3>
              <p className="mt-2 text-neutral-400">
                Browse restaurant options with available time slots and make your selection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-400">
                  <Users size={28} />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-medium text-white">Enjoy Your Meal</h3>
              <p className="mt-2 text-neutral-400">
                Receive instant confirmation and arrive at the restaurant worry-free.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured restaurants section */}
      <div className="py-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Top Rated Restaurants</h2>
              <p className="mt-2 text-neutral-400">Discover the best dining experiences in your area</p>
            </div>
            <Link to="/search">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                View All
              </Button>
            </Link>
          </div>
          
          <RestaurantList restaurants={topRatedRestaurants} isLoading={isLoading} />
        </div>
      </div>
      
      {/* Restaurant owners CTA */}
      <div className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold text-white">Own a Restaurant?</h2>
              <p className="mt-2 text-primary-100 max-w-xl">
                Join DineReserve and reach thousands of diners looking for their next memorable meal. 
                Our platform helps you fill more tables, reduce no-shows, and grow your business.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button 
                  className="bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg" 
                  size="lg"
                >
                  Join as a Restaurant
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10" 
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <img 
                src="https://images.pexels.com/photos/3184195/pexels-photo-3184195.jpeg" 
                alt="Restaurant owner using tablet" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="py-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">What Our Users Say</h2>
            <p className="mt-2 text-neutral-400">
              Hear from diners and restaurant owners who love DineReserve
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <div className="flex text-yellow-400 mb-4">
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
              </div>
              <p className="text-neutral-300 mb-4">
                "DineReserve made it so easy to discover new restaurants in my area. 
                I found my new favorite Italian place and I'm never looking back!"
              </p>
              <div className="font-medium text-white">Sarah T.</div>
              <div className="text-sm text-neutral-400">Food enthusiast</div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex text-yellow-400 mb-4">
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
              </div>
              <p className="text-neutral-300 mb-4">
                "As a restaurant owner, DineReserve has become an essential part of our business. 
                We've seen a 30% increase in bookings since joining the platform."
              </p>
              <div className="font-medium text-white">Michael R.</div>
              <div className="text-sm text-neutral-400">Restaurant owner</div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex text-yellow-400 mb-4">
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
              </div>
              <p className="text-neutral-300 mb-4">
                "No more calling restaurants and waiting on hold. I can book a table in seconds, 
                and I love being able to see reviews from other diners."
              </p>
              <div className="font-medium text-white">David L.</div>
              <div className="text-sm text-neutral-400">Business traveler</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Download app section */}
      <div className="py-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get the DineReserve App</h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              Book restaurants, manage reservations, and earn dining rewards on the go
            </p>
            
            <div className="flex justify-center space-x-4">
              <a href="#" className="inline-block transition-transform hover:scale-105">
                <div className="glass-card p-4 flex items-center space-x-2">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" 
                    alt="Download on App Store" 
                    className="h-8"
                  />
                  <div className="text-left">
                    <div className="text-xs text-neutral-400">Download on the</div>
                    <div className="text-sm font-semibold text-white">App Store</div>
                  </div>
                </div>
              </a>
              <a href="#" className="inline-block transition-transform hover:scale-105">
                <div className="glass-card p-4 flex items-center space-x-2">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" 
                    alt="Get it on Google Play" 
                    className="h-8"
                  />
                  <div className="text-left">
                    <div className="text-xs text-neutral-400">Get it on</div>
                    <div className="text-sm font-semibold text-white">Google Play</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;