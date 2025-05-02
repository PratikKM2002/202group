import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../common/Button';

interface SearchFormProps {
  inline?: boolean;
  className?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ inline = false, className = '' }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>('19:00');
  const [partySize, setPartySize] = useState<number>(2);
  const [location, setLocation] = useState<string>('');
  const navigate = useNavigate();

  const times = [];
  for (let hour = 11; hour <= 23; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMin = min.toString().padStart(2, '0');
      times.push(`${formattedHour}:${formattedMin}`);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedDate = date.toISOString().split('T')[0];
    const searchParams = new URLSearchParams({
      date: formattedDate,
      time,
      partySize: partySize.toString(),
      location,
    });
    
    navigate(`/search/results?${searchParams.toString()}`);
  };

  const containerClasses = inline
    ? `flex flex-wrap md:flex-nowrap gap-2 md:gap-4 ${className}`
    : `rounded-xl p-8 max-w-4xl mx-auto transform hover:scale-[1.01] transition-all duration-300 
       backdrop-blur-xl bg-[rgba(17,25,40,0.55)] border border-[rgba(255,255,255,0.1)] 
       shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${className}`;

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(17,25,40,0.75)] border border-[rgba(255,255,255,0.1)] text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-[0_2px_4px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className={containerClasses}>
      {!inline && (
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Find your table for any occasion
        </h2>
      )}
      
      <div className={`${inline ? 'flex-grow' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-white mb-2">
              Date
            </label>
            <div className="relative">
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                className={inputClasses}
                id="date"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            </div>
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-white mb-2">
              Time
            </label>
            <div className="relative">
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`${inputClasses} appearance-none`}
              >
                {times.map((timeOption) => (
                  <option key={timeOption} value={timeOption} className="bg-neutral-800">
                    {timeOption}
                  </option>
                ))}
              </select>
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="partySize" className="block text-sm font-medium text-white mb-2">
              Party Size
            </label>
            <div className="relative">
              <select
                id="partySize"
                value={partySize}
                onChange={(e) => setPartySize(parseInt(e.target.value))}
                className={`${inputClasses} appearance-none`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                  <option key={size} value={size} className="bg-neutral-800">
                    {size} {size === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-white mb-2">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State or Zip"
                className={inputClasses}
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            </div>
          </div>
        </div>
      </div>
      
      <div className={`${inline ? 'mt-0' : 'mt-8'} flex justify-center`}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          leftIcon={<Search size={18} />}
          className="w-full md:w-auto px-8 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl
                   transform hover:scale-[1.02] transition-all duration-300 
                   shadow-[0_4px_12px_rgba(24,100,255,0.45)] 
                   hover:shadow-[0_8px_20px_rgba(24,100,255,0.5)]"
        >
          Find a Table
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;