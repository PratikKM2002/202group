import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { addDays } from 'date-fns';
import { Clock, Users, CalendarIcon, MessageSquare } from 'lucide-react';
import Button from '../common/Button';
import { Restaurant, TimeSlot } from '../../types';
import useAuthStore from '../../store/authStore';
import useBookingStore from '../../store/bookingStore';
import 'react-datepicker/dist/react-datepicker.css';

interface BookingFormProps {
  restaurant: Restaurant;
  timeSlots: TimeSlot[];
  initialDate?: Date;
  initialTime?: string;
  initialPartySize?: number;
}

const BookingForm: React.FC<BookingFormProps> = ({
  restaurant,
  timeSlots,
  initialDate = new Date(),
  initialTime,
  initialPartySize = 2,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createBooking, isLoading } = useBookingStore();
  
  const [date, setDate] = useState<Date>(initialDate);
  const [time, setTime] = useState<string>(initialTime || (timeSlots.length > 0 ? timeSlots[0].time : '19:00'));
  const [partySize, setPartySize] = useState<number>(initialPartySize);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(
    initialTime ? timeSlots.findIndex(slot => slot.time === initialTime) : 0
  );

  // Group time slots by hour for better organization
  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    const hour = slot.time.split(':')[0];
    if (!acc[hour]) {
      acc[hour] = [];
    }
    acc[hour].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      // Save booking details to session storage
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        restaurantId: restaurant.id,
        date: date.toISOString().split('T')[0],
        time,
        partySize,
        specialRequests
      }));
      
      navigate('/login?redirect=pending-booking');
      return;
    }
    
    try {
      await createBooking({
        restaurantId: restaurant.id,
        userId: user.id,
        date: date.toISOString().split('T')[0],
        time,
        partySize,
        specialRequests: specialRequests || undefined,
      });
      
      // Redirect to confirmation page
      navigate('/booking/confirmation');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleTimeSelect = (index: number) => {
    setSelectedTimeIndex(index);
    setTime(timeSlots[index].time);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Make a Reservation</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Date
        </label>
        <div className="relative">
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Party Size
        </label>
        <div className="relative">
          <select
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'person' : 'people'}
              </option>
            ))}
          </select>
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Time
        </label>
        <div className="space-y-4">
          {Object.entries(groupedTimeSlots).map(([hour, slots]) => (
            <div key={hour} className="space-y-2">
              <h3 className="text-sm font-medium text-neutral-400">{hour}:00</h3>
              <div className="flex flex-wrap gap-2">
                {slots.map((slot, slotIndex) => {
                  const index = timeSlots.findIndex(s => s.time === slot.time);
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        index === selectedTimeIndex
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                          : slot.available
                          ? 'bg-neutral-700 text-white hover:bg-neutral-600'
                          : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50'
                      }`}
                      onClick={() => slot.available && handleTimeSelect(index)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="specialRequests" className="block text-sm font-medium text-neutral-300 mb-2">
          Special Requests (optional)
        </label>
        <div className="relative">
          <textarea
            id="specialRequests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any special requests or dietary restrictions?"
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
          />
          <MessageSquare className="absolute left-3 top-3 text-neutral-400" size={18} />
        </div>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
      >
        {user ? 'Complete Reservation' : 'Sign in to Book'}
      </Button>
    </form>
  );
};

export default BookingForm;