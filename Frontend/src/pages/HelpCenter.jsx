import React, { useState } from 'react';
import { Search, BookOpen, CreditCard, Hotel, User, Shield, Phone, ArrowLeft, Clock, Share } from 'lucide-react';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen, count: 45 },
    { id: 'booking', name: 'Booking Help', icon: Hotel, count: 12 },
    { id: 'payment', name: 'Payments', icon: CreditCard, count: 8 },
    { id: 'account', name: 'Account', icon: User, count: 6 },
    { id: 'safety', name: 'Safety & Security', icon: Shield, count: 5 },
    { id: 'technical', name: 'Technical Support', icon: Phone, count: 7 },
  ];

  const articles = [
    {
      id: 1,
      title: 'How to Make a Booking',
      category: 'booking',
      excerpt: 'Step-by-step guide to booking a hotel through EthioStay...',
      readTime: '3 min read',
      content: `
        <h2>How to Make a Booking on EthioStay</h2>
        <p>Booking a hotel through EthioStay is simple and straightforward. Follow these steps:</p>
        
        <h3>Step 1: Search for Hotels</h3>
        <p>Enter your destination city or hotel name, select your check-in and check-out dates, and specify the number of guests. Click "Search Hotels" to see available options.</p>
        
        <h3>Step 2: Choose Your Hotel</h3>
        <p>Browse through the available hotels. You can filter results by price, rating, amenities, or location. Click on any hotel to view detailed information, photos, and room types.</p>
        
        <h3>Step 3: Select Room Type</h3>
        <p>Choose your preferred room type (Standard, Deluxe, Suite, etc.) and view the amenities included. Make sure to check the room capacity and bed configuration.</p>
        
        <h3>Step 4: Review Booking Details</h3>
        <p>Double-check your dates, number of guests, and special requests. Review the cancellation policy and any additional fees.</p>
        
        <h3>Step 5: Complete Payment</h3>
        <p>Enter your payment details securely. We accept multiple payment methods including credit cards, bank transfers, and mobile payments.</p>
        
        <h3>Step 6: Confirmation</h3>
        <p>Once payment is processed, you'll receive a confirmation email with your booking details and receipt. You can also view your booking in your account dashboard.</p>
        
        <div class="tip">
          <strong>Pro Tip:</strong> Create an EthioStay account to save your preferences and access booking history for faster future bookings.
        </div>
      `
    },
    {
      id: 2,
      title: 'Payment Methods Accepted',
      category: 'payment',
      excerpt: 'Learn about all the payment options available on our platform...',
      readTime: '2 min read',
      content: `
        <h2>Payment Methods Accepted on EthioStay</h2>
        <p>We offer multiple secure payment options to make your booking experience convenient and safe.</p>
        
        <h3>Credit and Debit Cards</h3>
        <ul>
          <li><strong>Visa</strong> - All Visa credit and debit cards</li>
          <li><strong>MasterCard</strong> - All MasterCard credit and debit cards</li>
          <li><strong>American Express</strong> - Available for international bookings</li>
        </ul>
        
        <h3>Bank Transfers</h3>
        <p>You can make direct bank transfers to our corporate account. This option is particularly popular for corporate bookings and group reservations.</p>
        <ul>
          <li>Commercial Bank of Ethiopia</li>
          <li>Awash Bank</li>
          <li>Dashen Bank</li>
          <li>Other major Ethiopian banks</li>
        </ul>
        
        <h3>Mobile Payments</h3>
        <p>For your convenience, we support popular mobile payment platforms:</p>
        <ul>
          <li><strong>HelloCash</strong> - Available for Ethiopian users</li>
          <li><strong>M-Birr</strong> - Mobile money service</li>
          <li><strong>CBE Birr</strong> - Commercial Bank of Ethiopia's mobile payment</li>
        </ul>
        
        <h3>Payment Security</h3>
        <p>All payments are processed through encrypted channels. We do not store your full payment details on our servers. Our payment partners are PCI-DSS compliant to ensure the highest level of security.</p>
        
        <h3>Currency Options</h3>
        <p>Prices are displayed in Ethiopian Birr (ETB). International cards will be charged in ETB, and your bank will handle the currency conversion based on their exchange rates.</p>
        
        <div class="note">
          <strong>Note:</strong> Some payment methods may have processing fees. These will be clearly displayed before you confirm your payment.
        </div>
      `
    },
    {
      id: 3,
      title: 'Managing Your Account',
      category: 'account',
      excerpt: 'How to update your profile, change password, and manage preferences...',
      readTime: '4 min read',
      content: `
        <h2>Managing Your EthioStay Account</h2>
        <p>Your EthioStay account gives you control over your booking preferences and personal information. Here's how to manage it effectively.</p>
        
        <h3>Accessing Your Account</h3>
        <p>Log in to your account using your email and password. Once logged in, click on your profile picture or name in the top right corner to access your account dashboard.</p>
        
        <h3>Updating Personal Information</h3>
        <p>To update your personal details:</p>
        <ol>
          <li>Go to <strong>Account Settings</strong></li>
          <li>Click on <strong>Personal Information</strong></li>
          <li>Update your name, email, phone number, or address</li>
          <li>Click <strong>Save Changes</strong></li>
        </ol>
        
        <h3>Changing Your Password</h3>
        <p>For security reasons, we recommend changing your password regularly:</p>
        <ol>
          <li>Navigate to <strong>Security Settings</strong></li>
          <li>Click <strong>Change Password</strong></li>
          <li>Enter your current password</li>
          <li>Create a new strong password</li>
          <li>Confirm the new password</li>
          <li>Click <strong>Update Password</strong></li>
        </ol>
        
        <h3>Managing Communication Preferences</h3>
        <p>Control how we communicate with you:</p>
        <ul>
          <li><strong>Email Notifications:</strong> Booking confirmations, reminders, and promotions</li>
          <li><strong>SMS Alerts:</strong> Important booking updates and security alerts</li>
          <li><strong>Push Notifications:</strong> Real-time updates on the mobile app</li>
        </ul>
        
        <h3>Booking History</h3>
        <p>View your complete booking history in the <strong>My Bookings</strong> section. You can:</p>
        <ul>
          <li>See upcoming and past bookings</li>
          <li>Download invoices and receipts</li>
          <li>View booking details</li>
          <li>Access cancellation information</li>
        </ul>
        
        <h3>Privacy Settings</h3>
        <p>Control your privacy preferences:</p>
        <ul>
          <li>Manage data sharing preferences</li>
          <li>Control visibility of your reviews</li>
          <li>Set preferences for personalized recommendations</li>
        </ul>
        
        <div class="tip">
          <strong>Security Tip:</strong> Enable two-factor authentication for added account security. This requires a verification code in addition to your password when logging in from new devices.
        </div>
      `
    },
    {
      id: 4,
      title: 'Cancellation Policy',
      category: 'booking',
      excerpt: 'Understanding our cancellation and refund policies...',
      readTime: '5 min read',
      content: `
        <h2>Cancellation Policy and Refund Process</h2>
        <p>Understanding our cancellation policy helps you make informed booking decisions and know what to expect if your plans change.</p>
        
        <h3>General Cancellation Policy</h3>
        <p>Most hotels on EthioStay offer flexible cancellation options:</p>
        <ul>
          <li><strong>Free Cancellation:</strong> Most bookings can be cancelled free of charge up to 24-48 hours before check-in</li>
          <li><strong>Non-refundable Rates:</strong> Some special offers may be non-refundable - this is clearly marked during booking</li>
          <li><strong>Long-term Stays:</strong> Different policies may apply for bookings longer than 7 days</li>
        </ul>
        
        <h3>How to Cancel a Booking</h3>
        <p>To cancel your booking:</p>
        <ol>
          <li>Log in to your EthioStay account</li>
          <li>Go to <strong>My Bookings</strong></li>
          <li>Find the booking you wish to cancel</li>
          <li>Click <strong>Cancel Booking</strong></li>
          <li>Follow the prompts to confirm cancellation</li>
          <li>You'll receive email confirmation of cancellation</li>
        </ol>
        
        <h3>Refund Processing</h3>
        <p>When you cancel an eligible booking:</p>
        <ul>
          <li>Refunds are processed automatically</li>
          <li>Processing time: 5-10 business days</li>
          <li>Refund amount depends on cancellation timing and hotel policy</li>
          <li>You'll receive refund confirmation via email</li>
        </ul>
        
        <h3>Late Cancellations and No-Shows</h3>
        <p>If you cancel after the free cancellation period or don't show up:</p>
        <ul>
          <li>You may be charged for the first night</li>
          <li>Some hotels may charge the full booking amount</li>
          <li>Specific policies are displayed during booking</li>
        </ul>
        
        <h3>Special Circumstances</h3>
        <p>We understand that sometimes unforeseen circumstances occur:</p>
        <ul>
          <li><strong>Medical Emergencies:</strong> Contact us with documentation for consideration</li>
          <li><strong>Flight Cancellations:</strong> Provide flight cancellation proof</li>
          <li><strong>Natural Disasters:</strong> Special policies may apply</li>
        </ul>
        
        <h3>Hotel-Specific Policies</h3>
        <p>Each hotel may have specific cancellation rules:</p>
        <ul>
          <li>Always check the cancellation policy during booking</li>
          <li>Policies are clearly displayed before payment</li>
          <li>Contact the hotel directly for specific questions</li>
        </ul>
        
        <div class="important">
          <strong>Important:</strong> Cancellation policies vary by hotel. Always review the specific policy for your booking before confirming.
        </div>
      `
    },
    {
      id: 5,
      title: 'Security Measures',
      category: 'safety',
      excerpt: 'How we protect your personal and payment information...',
      readTime: '3 min read',
      content: `
        <h2>Security Measures at EthioStay</h2>
        <p>Your security and privacy are our top priorities. We implement multiple layers of protection to safeguard your information.</p>
        
        <h3>Data Encryption</h3>
        <p>All data transmitted between your device and our servers is encrypted using industry-standard TLS (Transport Layer Security) encryption. This ensures that your personal and payment information remains confidential.</p>
        
        <h3>Payment Security</h3>
        <p>We partner with PCI-DSS compliant payment processors. This means:</p>
        <ul>
          <li>We never store your full credit card details</li>
          <li>All payments are processed through secure payment gateways</li>
          <li>Regular security audits are conducted</li>
          <li>We comply with international payment security standards</li>
        </ul>
        
        <h3>Account Protection</h3>
        <p>Multiple features protect your account:</p>
        <ul>
          <li><strong>Strong Password Requirements:</strong> Enforced during account creation</li>
          <li><strong>Two-Factor Authentication:</strong> Optional extra security layer</li>
          <li><strong>Session Timeout:</strong> Automatic logout after periods of inactivity</li>
          <li><strong>Login Alerts:</strong> Notifications for new device logins</li>
        </ul>
        
        <h3>System Security</h3>
        <p>Our infrastructure is secured with:</p>
        <ul>
          <li>Regular security updates and patches</li>
          <li>Firewall protection</li>
          <li>Intrusion detection systems</li>
          <li>24/7 security monitoring</li>
          <li>Regular vulnerability assessments</li>
        </ul>
        
        <h3>Privacy Protection</h3>
        <p>We respect your privacy:</p>
        <ul>
          <li>Clear privacy policy explaining data usage</li>
          <li>Control over your personal information</li>
          <li>Options to manage communication preferences</li>
          <li>Data minimization principles</li>
        </ul>
        
        <h3>What You Can Do</h3>
        <p>Help us keep your account secure:</p>
        <ul>
          <li>Use a strong, unique password</li>
          <li>Enable two-factor authentication</li>
          <li>Log out from shared devices</li>
          <li>Keep your contact information updated</li>
          <li>Report suspicious activity immediately</li>
        </ul>
        
        <div class="tip">
          <strong>Security Tip:</strong> Always look for the padlock icon in your browser address bar to ensure you're on our secure website.
        </div>
      `
    },
    {
      id: 6,
      title: 'Troubleshooting Login Issues',
      category: 'technical',
      excerpt: 'Common solutions for login problems and account access...',
      readTime: '4 min read',
      content: `
        <h2>Troubleshooting Login Issues</h2>
        <p>If you're having trouble accessing your EthioStay account, here are common solutions to get you back in quickly.</p>
        
        <h3>Common Login Problems and Solutions</h3>
        
        <h4>1. Incorrect Password</h4>
        <p><strong>Symptoms:</strong> "Invalid password" error message</p>
        <p><strong>Solutions:</strong></p>
        <ul>
          <li>Click "Forgot Password" to reset your password</li>
          <li>Check if Caps Lock is enabled</li>
          <li>Ensure you're using the correct email address</li>
          <li>Try typing your password in a text editor first to check for typos</li>
        </ul>
        
        <h4>2. Account Locked</h4>
        <p><strong>Symptoms:</strong> "Account temporarily locked" message</p>
        <p><strong>Solutions:</strong></p>
        <ul>
          <li>Wait 30 minutes and try again</li>
          <li>Use the "Forgot Password" feature</li>
          <li>Contact customer support if issue persists</li>
        </ul>
        
        <h4>3. Email Not Recognized</h4>
        <p><strong>Symptoms:</strong> "Email not found" error</p>
        <p><strong>Solutions:</strong></p>
        <ul>
          <li>Check if you're using the correct email address</li>
          <li>Try alternative email addresses you might have used</li>
          <li>Check if you need to create a new account</li>
          <li>Verify your email address for typos</li>
        </ul>
        
        <h4>4. Browser Issues</h4>
        <p><strong>Symptoms:</strong> Page not loading properly, buttons not working</p>
        <p><strong>Solutions:</strong></p>
        <ul>
          <li>Clear your browser cache and cookies</li>
          <li>Try a different web browser (Chrome, Firefox, Safari, Edge)</li>
          <li>Update your browser to the latest version</li>
          <li>Disable browser extensions temporarily</li>
        </ul>
        
        <h3>Mobile App Login Issues</h3>
        <p>If you're having trouble with the mobile app:</p>
        <ul>
          <li>Update the app to the latest version</li>
          <li>Check your internet connection</li>
          <li>Restart the app completely</li>
          <li>Reinstall the app if problems persist</li>
        </ul>
        
        <h3>Two-Factor Authentication Issues</h3>
        <p>If you're having trouble with 2FA:</p>
        <ul>
          <li>Ensure your phone has network connectivity</li>
          <li>Check that your authenticator app is synchronized</li>
          <li>Use backup codes if available</li>
          <li>Contact support to disable 2FA temporarily</li>
        </ul>
        
        <h3>When to Contact Support</h3>
        <p>Contact our support team if:</p>
        <ul>
          <li>You've tried all troubleshooting steps</li>
          <li>You suspect your account has been compromised</li>
          <li>You're not receiving password reset emails</li>
          <li>You need to update your registered email address</li>
        </ul>
        
        <div class="contact-info">
          <strong>Support Contact:</strong><br>
          Email: support@ethiostay.com<br>
          Phone: +251-911-234567<br>
          Hours: 24/7 for urgent booking issues
        </div>
      `
    },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReadArticle = (article) => {
    setSelectedArticle(article);
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  // Full Article View
  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={handleBackToList}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Help Articles
          </button>

          {/* Article Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {categories.find(cat => cat.id === selectedArticle.category)?.name}
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{selectedArticle.readTime}</span>
                </div>
                <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200">
                  <Share className="h-4 w-4 mr-1" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedArticle.title}
            </h1>

            <div className="flex items-center text-gray-600 text-sm">
              <span>Last updated: December 2024</span>
              <span className="mx-2">•</span>
              <span>EthioStay Support Team</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              style={{
                lineHeight: '1.7',
                color: '#374151'
              }}
            />
            
            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Was this article helpful?</h3>
                  <div className="flex space-x-2">
                    <button className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors duration-200">
                      Yes
                    </button>
                    <button className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200">
                      No
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Need more help? <a href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">Contact Support</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles
                .filter(article => article.category === selectedArticle.category && article.id !== selectedArticle.id)
                .slice(0, 2)
                .map(article => (
                  <div
                    key={article.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => handleReadArticle(article)}
                  >
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mb-3">
                      {categories.find(cat => cat.id === article.category)?.name}
                    </span>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{article.readTime}</span>
                      <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors duration-200">
                        Read Article →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Help Center List View
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions and get the support you need.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Contact Support */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Still Need Help?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <a
                  href="/contact"
                  className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeCategory === 'all' ? 'All Articles' : 
                   categories.find(c => c.id === activeCategory)?.name + ' Articles'}
                </h2>
                <span className="text-gray-500">
                  {filteredArticles.length} articles found
                </span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or browse different categories.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => handleReadArticle(article)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mb-2">
                            {categories.find(cat => cat.id === article.category)?.name}
                          </span>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {article.excerpt}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded ml-4 flex-shrink-0">
                          {article.readTime}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadArticle(article);
                        }}
                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                      >
                        Read Full Article →
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Popular Articles */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.slice(0, 4).map((article) => (
                    <div
                      key={article.id}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleReadArticle(article)}
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                      <p className="text-sm text-gray-500">{article.readTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;