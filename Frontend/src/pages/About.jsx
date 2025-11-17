import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Shield, Heart, Target, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About EthioStay</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Transforming hotel booking experiences across Ethiopia with technology, 
              trust, and exceptional service.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020, EthioStay emerged from a simple vision: to make hotel 
                booking in Ethiopia seamless, transparent, and accessible to everyone. 
                What started as a small startup has grown into Ethiopia's leading hotel 
                booking platform.
              </p>
              <p className="text-gray-600 mb-4">
                We've partnered with over 500 hotels across the country, from luxury 
                resorts in Addis Ababa to cozy lodges in the historic cities of Bahir Dar 
                and Gondar. Our mission is to showcase Ethiopia's incredible hospitality 
                to the world.
              </p>
              <p className="text-gray-600">
                Today, we serve thousands of travelers monthly, helping them discover 
                the perfect accommodation for their needs while supporting local 
                businesses and communities.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <img
                src="/api/placeholder/600/400"
                alt="EthioStay Team"
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To revolutionize hotel booking in Ethiopia by providing a platform 
                that connects travelers with exceptional accommodations through 
                innovative technology and unparalleled customer service.
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the most trusted and comprehensive hotel booking platform 
                in East Africa, making travel planning effortless and memorable for 
                every traveler.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and define who we are as a company.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We listen, 
                learn, and continuously improve to exceed their expectations.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Security</h3>
              <p className="text-gray-600">
                We prioritize the security of your data and payments, ensuring 
                every transaction is safe and every booking is guaranteed.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Passion for Service</h3>
              <p className="text-gray-600">
                We're passionate about delivering exceptional service and creating 
                memorable experiences for every traveler.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Partner Hotels</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Award className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience Ethiopia?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of travelers who trust EthioStay for their accommodation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Find Your Perfect Stay
            </Link>
            <Link
              to="/contact"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;