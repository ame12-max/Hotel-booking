import React, { useState, useEffect } from 'react';
import { Save, X, Shield, CreditCard } from 'lucide-react';

const AddPaymentMethodModal = ({ isOpen, onClose, onSave, editingPayment }) => {
  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingPayment) {
      setFormData({
        cardHolder: editingPayment.card_holder,
        cardNumber: '',
        expiryMonth: editingPayment.expiry_month,
        expiryYear: editingPayment.expiry_year,
        cvv: '',
        isDefault: editingPayment.is_default
      });
    } else {
      setFormData({
        cardHolder: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false
      });
    }
    setErrors({});
  }, [editingPayment, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Card number validation
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{13,19}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Card number must be 13-19 digits';
    }

    // Card holder validation
    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    }

    // Expiry month validation
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    } else if (!/^\d{2}$/.test(formData.expiryMonth)) {
      newErrors.expiryMonth = 'Month must be 2 digits';
    } else {
      const month = parseInt(formData.expiryMonth);
      if (month < 1 || month > 12) {
        newErrors.expiryMonth = 'Month must be between 01 and 12';
      }
    }

    // Expiry year validation
    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    } else if (!/^\d{2}$/.test(formData.expiryYear)) {
      newErrors.expiryYear = 'Year must be 2 digits';
    } else {
      const year = parseInt(formData.expiryYear);
      const currentYear = new Date().getFullYear() % 100;
      if (year < currentYear) {
        newErrors.expiryYear = 'Card has expired';
      }
    }

    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const cardData = {
        cardHolder: formData.cardHolder.trim(),
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cvv: formData.cvv,
        isDefault: formData.isDefault
      };

      await onSave(cardData);
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    const matches = cleanValue.match(/\d{1,16}/g);
    return matches ? matches.join(' ').substr(0, 19) : '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryMonth' || name === 'expiryYear') {
      formattedValue = value.replace(/\D/g, '').substr(0, 2);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">
            {editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                maxLength={19}
                disabled={isSubmitting}
              />
              {errors.cardNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>

            {/* Card Holder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Holder Name
              </label>
              <input
                type="text"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.cardHolder ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.cardHolder && (
                <p className="text-red-600 text-sm mt-1">{errors.cardHolder}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Month
                </label>
                <input
                  type="text"
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleInputChange}
                  placeholder="MM"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.expiryMonth ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={2}
                  disabled={isSubmitting}
                />
                {errors.expiryMonth && (
                  <p className="text-red-600 text-sm mt-1">{errors.expiryMonth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Year
                </label>
                <input
                  type="text"
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleInputChange}
                  placeholder="YY"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.expiryYear ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={2}
                  disabled={isSubmitting}
                />
                {errors.expiryYear && (
                  <p className="text-red-600 text-sm mt-1">{errors.expiryYear}</p>
                )}
              </div>
            </div>

            {/* CVV */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.cvv ? 'border-red-300' : 'border-gray-300'
                }`}
                maxLength={4}
                disabled={isSubmitting}
              />
              {errors.cvv && (
                <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>

            {/* Default Card */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label className="ml-2 block text-sm text-gray-700">
                Set as default payment method
              </label>
            </div>
          </div>

          <div className="mt-8 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting 
                ? 'Processing...' 
                : editingPayment 
                  ? 'Update Card' 
                  : 'Add Card'
              }
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 rounded-b-2xl">
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="h-4 w-4 mr-2 text-green-600" />
            Your payment information is secure and encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;