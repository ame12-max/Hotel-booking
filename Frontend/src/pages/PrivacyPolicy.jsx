import React from 'react';
import { Shield, Eye, Lock, UserCheck, Database } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Last updated: December 2024
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to EthioStay. We are committed to protecting your privacy and ensuring
              the security of your personal information. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our services.
            </p>
            <p className="text-gray-600">
              By using EthioStay, you consent to the practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <UserCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Name, email, phone number, and identification details
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Booking Information</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Travel dates, hotel preferences, and payment details
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Technical Information</h3>
                <p className="text-sm text-gray-600 mt-2">
                  IP address, browser type, and device information
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">We collect information when you:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Create an account or make a booking</li>
                <li>Contact our customer support</li>
                <li>Participate in surveys or promotions</li>
                <li>Use our website or mobile application</li>
                <li>Interact with our marketing communications</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Service Delivery</h3>
                <p className="text-gray-600">
                  To process your bookings, manage your account, and provide customer support.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                <p className="text-gray-600">
                  To send booking confirmations, updates, and important service notifications.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Improvement</h3>
                <p className="text-gray-600">
                  To analyze usage patterns and improve our services and user experience.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                <p className="text-gray-600">
                  To protect against fraud and ensure the security of our platform.
                </p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell your personal information to third parties. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>With Hotels:</strong> Necessary booking information is shared with
                the hotels you book to facilitate your stay.
              </li>
              <li>
                <strong>Service Providers:</strong> With trusted partners who help us operate
                our platform (payment processors, customer support, etc.).
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our
                rights and the safety of our users.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition,
                or sale of assets.
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
              <Lock className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">We Protect Your Data</h3>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational security measures
                  to protect your personal information against unauthorized access,
                  alteration, disclosure, or destruction. This includes encryption,
                  access controls, and regular security assessments.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Access & Correction</h3>
                <p className="text-gray-600 text-sm">
                  You can access and update your personal information through your account settings.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Data Portability</h3>
                <p className="text-gray-600 text-sm">
                  Request a copy of your data in a machine-readable format.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Deletion</h3>
                <p className="text-gray-600 text-sm">
                  Request deletion of your personal information, subject to legal requirements.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Opt-out</h3>
                <p className="text-gray-600 text-sm">
                  Opt-out of marketing communications at any time through your preferences.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies & Tracking</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your experience, analyze
              site usage, and deliver personalized content. You can control cookie
              preferences through your browser settings.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-600 mb-2">
              If you have any questions about this Privacy Policy or our data practices,
              please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>Email: privacy@ethiostay.com</p>
              <p>Phone: +251-911-234567</p>
              <p>Address: Bole Road, Addis Ababa, Ethiopia</p>
            </div>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of
              any changes by posting the new policy on this page and updating the
              "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;