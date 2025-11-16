import React, { useState, useEffect } from 'react';
import { 
  Save, RefreshCw, Shield, Bell, Database, Globe, CreditCard, 
  Building, Bed, Users, Mail, Phone, MapPin, DollarSign,
  Wifi, Car, Coffee, Utensils, Tv, Snowflake, Dumbbell
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'EthioStay Hotel Booking',
    siteDescription: 'Premium hotel booking platform in Ethiopia',
    supportEmail: 'support@ethiostay.com',
    supportPhone: '+251-911-234567',
    contactAddress: 'Bole Road, Addis Ababa, Ethiopia',
    
    // Business Settings
    currency: 'ETB',
    timezone: 'Africa/Addis_Ababa',
    dateFormat: 'DD/MM/YYYY',
    maxGuestsPerRoom: 4,
    checkinTime: '14:00',
    checkoutTime: '12:00',
    earlyCheckin: false,
    lateCheckout: false,
    minBookingDays: 1,
    maxBookingDays: 30,
    
    // Payment Settings
    paymentMethods: ['CREDIT_CARD', 'BANK_TRANSFER', 'CASH'],
    taxRate: 0.15,
    serviceFee: 0.05,
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    refundPolicy: 'Full refund within 24 hours of booking',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmation: true,
    bookingReminder: true,
    paymentReminder: true,
    adminAlerts: true,
    newsletterSubscriptions: true,
    
    // Security Settings
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90,
    twoFactorAuth: false,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    
    // Hotel Settings
    defaultHotelAmenities: ['WiFi', 'Parking', 'Restaurant', 'Air Conditioning', 'Swimming Pool'],
    roomCategories: ['Standard', 'Deluxe', 'Suite', 'Executive'],
    bedTypes: ['Single', 'Double', 'Queen', 'King'],
    
    // Email Templates
    bookingConfirmationTemplate: 'Dear {customer}, your booking at {hotel} is confirmed.',
    paymentReceiptTemplate: 'Thank you for your payment of {amount} for booking {booking_id}.',
    cancellationTemplate: 'Your booking {booking_id} has been cancelled as requested.',
    
    // System Settings
    maintenanceMode: false,
    allowUserRegistration: true,
    autoApproveBookings: false,
    enableReviews: true,
    enableRatings: true
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from API
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await bookingsService.getSettings();
      // setSettings(response.data.settings);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings loaded successfully');
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // TODO: Replace with actual API call
      // await bookingsService.updateSettings(settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHasChanges(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleArrayChange = (key, item, checked) => {
    setSettings(prev => ({
      ...prev,
      [key]: checked 
        ? [...prev[key], item]
        : prev[key].filter(i => i !== item)
    }));
    setHasChanges(true);
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      const defaultSettings = {
        siteName: 'EthioStay Hotel Booking',
        siteDescription: 'Premium hotel booking platform in Ethiopia',
        supportEmail: 'support@ethiostay.com',
        supportPhone: '+251-911-234567',
        contactAddress: 'Bole Road, Addis Ababa, Ethiopia',
        currency: 'ETB',
        timezone: 'Africa/Addis_Ababa',
        dateFormat: 'DD/MM/YYYY',
        maxGuestsPerRoom: 4,
        checkinTime: '14:00',
        checkoutTime: '12:00',
        earlyCheckin: false,
        lateCheckout: false,
        minBookingDays: 1,
        maxBookingDays: 30,
        paymentMethods: ['CREDIT_CARD', 'BANK_TRANSFER', 'CASH'],
        taxRate: 0.15,
        serviceFee: 0.05,
        cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
        refundPolicy: 'Full refund within 24 hours of booking',
        emailNotifications: true,
        smsNotifications: false,
        bookingConfirmation: true,
        bookingReminder: true,
        paymentReminder: true,
        adminAlerts: true,
        newsletterSubscriptions: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordExpiry: 90,
        twoFactorAuth: false,
        requireEmailVerification: true,
        requirePhoneVerification: false,
        defaultHotelAmenities: ['WiFi', 'Parking', 'Restaurant', 'Air Conditioning', 'Swimming Pool'],
        roomCategories: ['Standard', 'Deluxe', 'Suite', 'Executive'],
        bedTypes: ['Single', 'Double', 'Queen', 'King'],
        bookingConfirmationTemplate: 'Dear {customer}, your booking at {hotel} is confirmed.',
        paymentReceiptTemplate: 'Thank you for your payment of {amount} for booking {booking_id}.',
        cancellationTemplate: 'Your booking {booking_id} has been cancelled as requested.',
        maintenanceMode: false,
        allowUserRegistration: true,
        autoApproveBookings: false,
        enableReviews: true,
        enableRatings: true
      };
      
      setSettings(defaultSettings);
      setHasChanges(false);
      toast.success('Settings reset to defaults');
    }
  };

  const sections = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'business', name: 'Business Rules', icon: Building },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'hotel', name: 'Hotel Setup', icon: Bed },
    { id: 'email', name: 'Email Templates', icon: Mail },
    { id: 'system', name: 'System', icon: Database }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600 mt-1">
            Configure your hotel booking system preferences and business rules
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving || !hasChanges}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1 bg-white rounded-lg border border-gray-200 p-4">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  {section.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeSection === 'general' && (
            <GeneralSettings 
              settings={settings} 
              onChange={handleInputChange} 
            />
          )}

          {/* Business Rules */}
          {activeSection === 'business' && (
            <BusinessSettings 
              settings={settings} 
              onChange={handleInputChange} 
            />
          )}

          {/* Payment Settings */}
          {activeSection === 'payment' && (
            <PaymentSettings 
              settings={settings} 
              onChange={handleInputChange}
              onArrayChange={handleArrayChange}
            />
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <NotificationSettings 
              settings={settings} 
              onChange={handleInputChange} 
            />
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <SecuritySettings 
              settings={settings} 
              onChange={handleInputChange} 
            />
          )}

          {/* Hotel Setup */}
          {activeSection === 'hotel' && (
            <HotelSettings 
              settings={settings} 
              onChange={handleInputChange}
              onArrayChange={handleArrayChange}
            />
          )}

          {/* Email Templates */}
          {activeSection === 'email' && (
            <EmailSettings 
              settings={settings} 
              onChange={handleInputChange} 
            />
          )}

          {/* System Settings */}
          {activeSection === 'system' && (
            <SystemSettings 
              settings={settings} 
              onChange={handleInputChange} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components for each settings section
const GeneralSettings = ({ settings, onChange }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Globe className="h-5 w-5 mr-2" />
      General Settings
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Name
        </label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => onChange('siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <input
          type="text"
          value={settings.siteDescription}
          onChange={(e) => onChange('siteDescription', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Support Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) => onChange('supportEmail', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Support Phone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={settings.supportPhone}
            onChange={(e) => onChange('supportPhone', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
          <textarea
            value={settings.contactAddress}
            onChange={(e) => onChange('contactAddress', e.target.value)}
            rows={3}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
        <select
          value={settings.currency}
          onChange={(e) => onChange('currency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ETB">Ethiopian Birr (ETB)</option>
          <option value="USD">US Dollar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={settings.timezone}
          onChange={(e) => onChange('timezone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Africa/Addis_Ababa">Addis Ababa (EAT)</option>
          <option value="UTC">UTC</option>
        </select>
      </div>
    </div>
  </div>
);

const BusinessSettings = ({ settings, onChange }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Building className="h-5 w-5 mr-2" />
      Business Rules
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check-in Time
        </label>
        <input
          type="time"
          value={settings.checkinTime}
          onChange={(e) => onChange('checkinTime', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check-out Time
        </label>
        <input
          type="time"
          value={settings.checkoutTime}
          onChange={(e) => onChange('checkoutTime', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Guests per Room
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={settings.maxGuestsPerRoom}
          onChange={(e) => onChange('maxGuestsPerRoom', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Booking Days
        </label>
        <input
          type="number"
          min="1"
          value={settings.minBookingDays}
          onChange={(e) => onChange('minBookingDays', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Booking Days
        </label>
        <input
          type="number"
          min="1"
          value={settings.maxBookingDays}
          onChange={(e) => onChange('maxBookingDays', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cancellation Policy
        </label>
        <textarea
          value={settings.cancellationPolicy}
          onChange={(e) => onChange('cancellationPolicy', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Refund Policy
        </label>
        <textarea
          value={settings.refundPolicy}
          onChange={(e) => onChange('refundPolicy', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>
);

const PaymentSettings = ({ settings, onChange, onArrayChange }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <CreditCard className="h-5 w-5 mr-2" />
      Payment Settings
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tax Rate (%)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={settings.taxRate * 100}
            onChange={(e) => onChange('taxRate', parseFloat(e.target.value) / 100)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Fee (%)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={settings.serviceFee * 100}
            onChange={(e) => onChange('serviceFee', parseFloat(e.target.value) / 100)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accepted Payment Methods
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: 'CREDIT_CARD', label: 'Credit Card' },
            { value: 'DEBIT_CARD', label: 'Debit Card' },
            { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
            { value: 'CASH', label: 'Cash' },
            { value: 'MOBILE_PAYMENT', label: 'Mobile Payment' },
            { value: 'PAYPAL', label: 'PayPal' }
          ].map((method) => (
            <label key={method.value} className="flex items-center">
              <input
                type="checkbox"
                checked={settings.paymentMethods.includes(method.value)}
                onChange={(e) => onArrayChange('paymentMethods', method.value, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{method.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const NotificationSettings = ({ settings, onChange }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Bell className="h-5 w-5 mr-2" />
      Notification Settings
    </h3>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'emailNotifications', label: 'Enable Email Notifications' },
          { key: 'smsNotifications', label: 'Enable SMS Notifications' },
          { key: 'bookingConfirmation', label: 'Send Booking Confirmations' },
          { key: 'bookingReminder', label: 'Send Booking Reminders' },
          { key: 'paymentReminder', label: 'Send Payment Reminders' },
          { key: 'adminAlerts', label: 'Admin Alert Notifications' },
          { key: 'newsletterSubscriptions', label: 'Newsletter Subscriptions' }
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => onChange(key, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        ))}
      </div>
    </div>
  </div>
);

const SecuritySettings = ({ settings, onChange }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Shield className="h-5 w-5 mr-2" />
      Security Settings
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          min="5"
          max="1440"
          value={settings.sessionTimeout}
          onChange={(e) => onChange('sessionTimeout', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Login Attempts
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={settings.maxLoginAttempts}
          onChange={(e) => onChange('maxLoginAttempts', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password Expiry (days)
        </label>
        <input
          type="number"
          min="1"
          max="365"
          value={settings.passwordExpiry}
          onChange={(e) => onChange('passwordExpiry', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex items-end">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => onChange('twoFactorAuth', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Enable Two-Factor Authentication
          </span>
        </label>
      </div>
      <div className="flex items-end">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.requireEmailVerification}
            onChange={(e) => onChange('requireEmailVerification', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Require Email Verification
          </span>
        </label>
      </div>
      <div className="flex items-end">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.requirePhoneVerification}
            onChange={(e) => onChange('requirePhoneVerification', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Require Phone Verification
          </span>
        </label>
      </div>
    </div>
  </div>
);

const HotelSettings = ({ settings, onChange, onArrayChange }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Bed className="h-5 w-5 mr-2" />
      Hotel Setup
    </h3>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Hotel Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: 'WiFi', icon: Wifi },
            { value: 'Parking', icon: Car },
            { value: 'Restaurant', icon: Utensils },
            { value: 'Air Conditioning', icon: Snowflake },
            { value: 'Swimming Pool', icon: Coffee },
            { value: 'TV', icon: Tv },
            { value: 'Gym', icon: Dumbbell }
          ].map((amenity) => {
            const IconComponent = amenity.icon;
            return (
              <label key={amenity.value} className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.defaultHotelAmenities.includes(amenity.value)}
                  onChange={(e) => onArrayChange('defaultHotelAmenities', amenity.value, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <IconComponent className="h-4 w-4 ml-2 mr-2 text-gray-600" />
                <span className="text-sm text-gray-700">{amenity.value}</span>
              </label>
            );
          })}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {settings.roomCategories.map((category, index) => (
            <div key={index} className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
              <span className="text-sm text-blue-700">{category}</span>
              <button
                type="button"
                onClick={() => {
                  const newCategories = settings.roomCategories.filter((_, i) => i !== index);
                  onChange('roomCategories', newCategories);
                }}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add new category"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const value = e.target.value.trim();
                if (value && !settings.roomCategories.includes(value)) {
                  onChange('roomCategories', [...settings.roomCategories, value]);
                  e.target.value = '';
                }
                e.preventDefault();
              }
            }}
            className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bed Types
        </label>
        <div className="flex flex-wrap gap-2">
          {settings.bedTypes.map((bedType, index) => (
            <div key={index} className="flex items-center bg-green-50 px-3 py-1 rounded-full">
              <span className="text-sm text-green-700">{bedType}</span>
              <button
                type="button"
                onClick={() => {
                  const newBedTypes = settings.bedTypes.filter((_, i) => i !== index);
                  onChange('bedTypes', newBedTypes);
                }}
                className="ml-2 text-green-500 hover:text-green-700"
              >
                ×
              </button>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add new bed type"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const value = e.target.value.trim();
                if (value && !settings.bedTypes.includes(value)) {
                  onChange('bedTypes', [...settings.bedTypes, value]);
                  e.target.value = '';
                }
                e.preventDefault();
              }
            }}
            className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  </div>
);

const EmailSettings = ({ settings, onChange }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Mail className="h-5 w-5 mr-2" />
      Email Templates
    </h3>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Booking Confirmation Template
        </label>
        <textarea
          value={settings.bookingConfirmationTemplate}
          onChange={(e) => onChange('bookingConfirmationTemplate', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Available variables: {'{customer}'}, {'{hotel}'}, {'{checkin}'}, {'{checkout}'}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Receipt Template
        </label>
        <textarea
          value={settings.paymentReceiptTemplate}
          onChange={(e) => onChange('paymentReceiptTemplate', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Available variables: {'{customer}'}, {'{amount}'}, {'{booking_id}'}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cancellation Template
        </label>
        <textarea
          value={settings.cancellationTemplate}
          onChange={(e) => onChange('cancellationTemplate', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Available variables: {'{customer}'}, {'{booking_id}'}, {'{refund_amount}'}
        </p>
      </div>
    </div>
  </div>
);

const SystemSettings = ({ settings, onChange }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Database className="h-5 w-5 mr-2" />
      System Settings
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="flex items-center p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => onChange('maintenanceMode', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-3">
            <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
            <p className="text-xs text-gray-500">Put the site in maintenance mode (admins only)</p>
          </div>
        </label>
      </div>
      <div>
        <label className="flex items-center p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            checked={settings.allowUserRegistration}
            onChange={(e) => onChange('allowUserRegistration', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-3">
            <span className="text-sm font-medium text-gray-700">Allow User Registration</span>
            <p className="text-xs text-gray-500">Allow new users to create accounts</p>
          </div>
        </label>
      </div>
      <div>
        <label className="flex items-center p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            checked={settings.autoApproveBookings}
            onChange={(e) => onChange('autoApproveBookings', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-3">
            <span className="text-sm font-medium text-gray-700">Auto-approve Bookings</span>
            <p className="text-xs text-gray-500">Automatically approve new bookings</p>
          </div>
        </label>
      </div>
      <div>
        <label className="flex items-center p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            checked={settings.enableReviews}
            onChange={(e) => onChange('enableReviews', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-3">
            <span className="text-sm font-medium text-gray-700">Enable Reviews</span>
            <p className="text-xs text-gray-500">Allow users to submit reviews</p>
          </div>
        </label>
      </div>
      <div>
        <label className="flex items-center p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            checked={settings.enableRatings}
            onChange={(e) => onChange('enableRatings', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-3">
            <span className="text-sm font-medium text-gray-700">Enable Ratings</span>
            <p className="text-xs text-gray-500">Allow users to rate hotels</p>
          </div>
        </label>
      </div>
    </div>
  </div>
);

export default Settings;