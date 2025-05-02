import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Star, Calendar, ChevronLeft, ChevronRight, Phone, Mail, Globe } from 'lucide-react';
import useRestaurantStore from '../store/restaurantStore';
import BookingForm from '../components/booking/BookingForm';
import ReviewList from '../components/review/ReviewList';
import ReviewForm from '../components/review/ReviewForm';
import RestaurantMap from '../components/map/RestaurantMap';
import Button from '../components/common/Button';
import { TimeSlot } from '../types';

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { currentRestaurant, getRestaurantById, reviews, getRestaurantReviews, getAvailableTimeSlots, isLoading } = useRestaurantStore();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'photos'>('overview');
  
  // Parse URL parameters for booking form
  const searchParams = new URLSearchParams(location.search);
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');
  const partySizeParam = searchParams.get('partySize');
  
  const initialDate = dateParam ? new Date(dateParam) : new Date();
  const initialTime = timeParam || undefined;
  const initialPartySize = partySizeParam ? parseInt(partySizeParam) : 2;
  
  useEffect(() => {
    if (id) {
      getRestaurantById(id);
      getRestaurantReviews(id);
    }
  }, [id, getRestaurantById, getRestaurantReviews]);
  
  useEffect(() => {
    if (id) {
      const slots = getAvailableTimeSlots(id, initialDate, initialPartySize);
      setTimeSlots(slots);
    }
  }, [id, initialDate, initialPartySize, getAvailableTimeSlots]);

  if (isLoading || !currentRestaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-neutral-800 rounded w-1/2 mb-4"></div>
          <div className="h-80 bg-neutral-800 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-6 bg-neutral-800 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-neutral-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-neutral-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-72 bg-neutral-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderPriceRange = (range: number) => {
    return Array(range)
      .fill(0)
      .map((_, i) => <DollarSign key={i} size={16} className="inline-block text-primary-400" />);
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === currentRestaurant.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? currentRestaurant.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-neutral-900 min-h-screen">
      {/* Hero section with main image */}
      <div className="relative h-[400px] md:h-[500px]">
        <div className="absolute inset-0">
          <img
            src={currentRestaurant.images[currentImageIndex]}
            alt={currentRestaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent"></div>
        </div>
        
        {/* Image navigation */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button
            onClick={prevImage}
            className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {currentRestaurant.images.length}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Restaurant details */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-white">{currentRestaurant.name}</h1>
              <div className="flex items-center bg-primary-900/50 text-primary-300 px-3 py-1.5 rounded-full">
                <Star size={16} className="mr-1.5 fill-current" />
                <span className="font-medium">{currentRestaurant.rating}</span>
                <span className="text-sm text-primary-400 ml-1">({currentRestaurant.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <span className="text-neutral-300">{currentRestaurant.cuisine}</span>
              <span className="text-neutral-600">•</span>
              <span className="text-primary-400">
                {renderPriceRange(currentRestaurant.priceRange)}
              </span>
              <span className="text-neutral-600">•</span>
              <div className="flex items-center text-neutral-300">
                <MapPin size={14} className="mr-1" />
                <span>{currentRestaurant.address.city}, {currentRestaurant.address.state}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-neutral-800 mb-6">
              <div className="flex space-x-8">
                <button
                  className={`py-4 font-medium text-sm border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-neutral-400 hover:text-neutral-300'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`py-4 font-medium text-sm border-b-2 ${
                    activeTab === 'reviews'
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-neutral-400 hover:text-neutral-300'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({reviews.length})
                </button>
                <button
                  className={`py-4 font-medium text-sm border-b-2 ${
                    activeTab === 'photos'
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-neutral-400 hover:text-neutral-300'
                  }`}
                  onClick={() => setActiveTab('photos')}
                >
                  Photos ({currentRestaurant.images.length})
                </button>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <div>
                <div className="glass-card p-8 mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">About {currentRestaurant.name}</h2>
                  <p className="text-neutral-300 mb-8">{currentRestaurant.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                      <ul className="space-y-4">
                        <li className="flex items-start text-neutral-300">
                          <MapPin size={18} className="mr-3 text-neutral-400 mt-1 flex-shrink-0" />
                          <div>
                            <p>{currentRestaurant.address.street}</p>
                            <p>{currentRestaurant.address.city}, {currentRestaurant.address.state} {currentRestaurant.address.zipCode}</p>
                          </div>
                        </li>
                        <li className="flex items-center text-neutral-300">
                          <Phone size={18} className="mr-3 text-neutral-400 flex-shrink-0" />
                          <p>{currentRestaurant.contactInfo.phone}</p>
                        </li>
                        <li className="flex items-center text-neutral-300">
                          <Mail size={18} className="mr-3 text-neutral-400 flex-shrink-0" />
                          <p>{currentRestaurant.contactInfo.email}</p>
                        </li>
                        {currentRestaurant.contactInfo.website && (
                          <li className="flex items-center">
                            <Globe size={18} className="mr-3 text-neutral-400 flex-shrink-0" />
                            <a 
                              href={currentRestaurant.contactInfo.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary-400 hover:text-primary-300 transition-colors"
                            >
                              {currentRestaurant.contactInfo.website.replace(/^https?:\/\//, '')}
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Hours of Operation</h3>
                      <ul className="space-y-2">
                        {Object.entries(currentRestaurant.hours).map(([day, hours]) => (
                          <li key={day} className="flex items-center justify-between text-neutral-300">
                            <span className="capitalize">{day}</span>
                            <span className="font-medium text-primary-400">{hours.open} - {hours.close}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-8 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Location</h3>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <RestaurantMap restaurant={currentRestaurant} height="100%" />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Customer Reviews</h2>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400 mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={18}
                            className={`${
                              star <= Math.round(currentRestaurant.rating)
                                ? 'fill-current'
                                : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-neutral-300">
                        {currentRestaurant.rating} out of 5 ({currentRestaurant.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                
                <ReviewForm 
                  restaurantId={currentRestaurant.id} 
                  onSuccess={() => getRestaurantReviews(currentRestaurant.id)}
                />
                
                <div className="mt-8">
                  <ReviewList reviews={reviews} isLoading={isLoading} />
                </div>
              </div>
            )}
            
            {activeTab === 'photos' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Photos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {currentRestaurant.images.map((image, index) => (
                    <div key={index} className="rounded-lg overflow-hidden aspect-w-16 aspect-h-9">
                      <img
                        src={image}
                        alt={`${currentRestaurant.name} - photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Booking form */}
          <div className="md:col-span-1">
            <BookingForm 
              restaurant={currentRestaurant}
              timeSlots={timeSlots}
              initialDate={initialDate}
              initialTime={initialTime}
              initialPartySize={initialPartySize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;