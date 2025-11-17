import React from 'react';
import { FileText, Scale, AlertTriangle, BookOpen, Shield } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Scale className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Last updated: December 2024
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <p className="text-yellow-700 text-sm">
                  Please read these terms carefully before using EthioStay. By accessing
                  or using our services, you agree to be bound by these terms and our
                  Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 mb-4">
              These Terms of Service ("Terms") govern your access to and use of EthioStay's
              website, mobile application, and services (collectively, the "Services").
            </p>
            <p className="text-gray-600">
              By creating an account or using our Services, you acknowledge that you have
              read, understood, and agree to be bound by these Terms.
            </p>
          </section>

          {/* Eligibility */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
            <div className="space-y-3 text-gray-600">
              <p>To use our Services, you must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be at least 18 years old</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Provide accurate and complete information</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          {/* Account Registration */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Account Security</h3>
                <p className="text-gray-600 text-sm">
                  You are responsible for maintaining the confidentiality of your account
                  credentials and for all activities that occur under your account.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Accurate Information</h3>
                <p className="text-gray-600 text-sm">
                  You must provide accurate, current, and complete information during
                  registration and keep it updated.
                </p>
              </div>
            </div>
          </section>

          {/* Booking and Payments */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Booking and Payments</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Booking Process</h3>
                <p className="text-gray-600 mb-3">
                  When you make a booking through EthioStay, you enter into a direct contract
                  with the hotel. We act as an intermediary to facilitate the transaction.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pricing and Taxes</h3>
                <p className="text-gray-600 mb-3">
                  All prices displayed include applicable taxes and service fees unless
                  otherwise stated. Prices are subject to change until booking confirmation.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Terms</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Payment is required at the time of booking unless otherwise specified</li>
                  <li>We accept various payment methods as displayed during checkout</li>
                  <li>All payments are processed securely through encrypted channels</li>
                  <li>Currency conversion rates are determined by your payment provider</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cancellation and Refunds */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cancellation and Refunds</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                <p className="text-gray-600 text-sm">
                  Cancellation policies vary by hotel and are clearly displayed during
                  the booking process. You are responsible for reviewing and understanding
                  these policies.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Refund Processing</h3>
                <p className="text-gray-600 text-sm">
                  Refunds, when applicable, are processed within 5-10 business days.
                  The timing of refund receipt depends on your payment method and bank.
                </p>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Responsibilities</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Prohibited Activities</h3>
                <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                  <li>Fraudulent or misleading bookings</li>
                  <li>Unauthorized commercial use of our Services</li>
                  <li>Attempting to circumvent our security measures</li>
                  <li>Posting false or defamatory reviews</li>
                  <li>Violating any applicable laws or regulations</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Expected Conduct</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                  <li>Respect hotel policies and property</li>
                  <li>Provide accurate information during booking</li>
                  <li>Communicate respectfully with hotel staff and our team</li>
                  <li>Report any issues or concerns promptly</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-600">
                  All content on our platform, including text, graphics, logos, and software,
                  is the property of EthioStay or our licensors and is protected by
                  intellectual property laws. You may not use our content without explicit
                  permission.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                EthioStay acts as an intermediary between you and hotels. We are not
                responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hotel services, facilities, or accommodations</li>
                <li>Any injuries, losses, or damages incurred during your stay</li>
                <li>Hotel's failure to provide booked services</li>
                <li>Force majeure events affecting your travel</li>
              </ul>
              <p className="mt-4">
                Our total liability to you for any claims shall not exceed the total
                commission we received for your booking.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Dispute Resolution</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Informal Resolution</h3>
                <p className="text-gray-600 text-sm">
                  We encourage you to contact us first to resolve any disputes informally
                  through our customer support team.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Governing Law</h3>
                <p className="text-gray-600 text-sm">
                  These Terms are governed by the laws of Ethiopia. Any disputes shall be
                  resolved in the courts of Addis Ababa.
                </p>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these Terms at any time. We will notify you
              of significant changes through email or platform notifications. Continued
              use of our Services after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">EthioStay</h3>
              <div className="space-y-2 text-gray-600">
                <p>Email: legal@ethiostay.com</p>
                <p>Phone: +251-911-234567</p>
                <p>Address: Bole Road, Addis Ababa, Ethiopia</p>
                <p>Business Hours: Monday - Friday, 8:00 AM - 6:00 PM EAT</p>
              </div>
            </div>
          </section>
        </div>

        {/* Acceptance */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Shield className="h-5 w-5" />
            <span>By using our Services, you acknowledge that you have read and agree to these Terms.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;