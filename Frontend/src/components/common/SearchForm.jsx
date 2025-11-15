import React, { useState } from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchForm = ({ onSearch, initialValues = {}, className = '' }) => {
  const [searchParams, setSearchParams] = useState({
    city: initialValues.city || '',
    checkinDate: initialValues.checkinDate ? new Date(initialValues.checkinDate) : null,
    checkoutDate: initialValues.checkoutDate ? new Date(initialValues.checkoutDate) : null,
    guests: initialValues.guests || 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchParams.city.trim()) {
      alert('Please enter a destination');
      return;
    }

    if (!searchParams.checkinDate || !searchParams.checkoutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (searchParams.checkinDate >= searchParams.checkoutDate) {
      alert('Check-out date must be after check-in date');
      return;
    }

    onSearch({
      ...searchParams,
      checkinDate: searchParams.checkinDate.toISOString().split('T')[0],
      checkoutDate: searchParams.checkoutDate.toISOString().split('T')[0]
    });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            📍 Destination
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              value={searchParams.city}
              onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white text-lg font-medium transition-all duration-300 hover:border-blue-300"
              placeholder="Where are you going?"
              required
            />
          </div>
        </div>

        {/* Check-in Date */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            📅 Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <DatePicker
              selected={searchParams.checkinDate}
              onChange={(date) => setSearchParams({ ...searchParams, checkinDate: date })}
              minDate={new Date()}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white text-lg font-medium transition-all duration-300 hover:border-blue-300"
              placeholderText="Check-in date"
              required
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            📅 Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <DatePicker
              selected={searchParams.checkoutDate}
              onChange={(date) => setSearchParams({ ...searchParams, checkoutDate: date })}
              minDate={searchParams.checkinDate || new Date()}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white text-lg font-medium transition-all duration-300 hover:border-blue-300"
              placeholderText="Check-out date"
              required
            />
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            👥 Guests
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <select
              value={searchParams.guests}
              onChange={(e) => setSearchParams({ ...searchParams, guests: parseInt(e.target.value) })}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white text-lg font-medium appearance-none transition-all duration-300 hover:border-blue-300"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-5 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg"
        >
          🔍 Search Hotels
        </button>
      </div>
    </form>
  );
};

export default SearchForm;