import React from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/common/SearchForm';
import { Hotel, Shield, Star, Clock, CheckCircle } from 'lucide-react';

const Home = () => {
  const handleSearch = (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    window.location.href = `/search?${queryString}`;
  };

  // Sample hotel images (using Unsplash)
  const hotelImages = [
    {
      url: '/img1.avif',
      name: 'Luxury Suite'
    },
    {
      url: '/img2.avif',
      name: 'City View Room'
    },
    {
      url: '/img3.avif',
      name: 'Modern Hotel'
    },
    {
      url: '/img4.avif',
      name: 'Resort Pool'
    }
  ];

  const features = [
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: 'Secure Booking',
      description: 'Bank-level security with transaction rollback protection'
    },
    {
      icon: <Star className="h-12 w-12 text-blue-600" />,
      title: 'Best Price Guarantee',
      description: 'Find the perfect room at the best price with no hidden fees'
    },
    {
      icon: <Clock className="h-12 w-12 text-blue-600" />,
      title: 'Instant Confirmation',
      description: 'Get immediate booking confirmation with ACID transactions'
    },
    {
      icon: <Hotel className="h-12 w-12 text-blue-600" />,
      title: 'Wide Selection',
      description: 'Choose from thousands of hotels with real-time availability'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Happy Customers' },
    { number: '5,000+', label: 'Hotels Worldwide' },
    { number: '100+', label: 'Destinations' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-gradient-to-r from-blue-900/90 to-blue-800/90 text-white py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/background.avif')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Experience seamless hotel booking with advanced transaction control, 
              real-time availability, and guaranteed no double bookings.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto mt-12">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Hotel Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Discover Amazing Hotels
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of luxury hotels and resorts worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotelImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">{image.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 my-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-yellow-400">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose HotelBook?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the most reliable hotel booking experience with cutting-edge 
              technology and enterprise-grade security features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with modern technologies to ensure reliability and performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              'ACID Transaction Compliance',
              'Pessimistic Locking for No Double-Bookings',
              'Real-time Concurrency Control',
              'MySQL InnoDB with Row-level Locks',
              'Transaction Rollback on Conflicts',
              'Audit Logging for All Operations'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Stay?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust our advanced booking system for their perfect getaway.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🏨 Start Searching Hotels
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              ✨ Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;