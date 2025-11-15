import React from 'react';
import { CreditCard, Landmark, Wallet } from 'lucide-react'; // Changed Paypal to Wallet

const PaymentForm = ({ paymentMethod, onPaymentMethodChange, className = '' }) => {
  const paymentOptions = [
    {
      value: 'CREDIT_CARD',
      label: 'Credit Card',
      icon: CreditCard,
      description: 'Pay with your credit card'
    },
    {
      value: 'DEBIT_CARD',
      label: 'Debit Card',
      icon: CreditCard,
      description: 'Pay with your debit card'
    },
    {
      value: 'PAYPAL',
      label: 'PayPal',
      icon: Wallet, // Changed from Paypal to Wallet
      description: 'Pay with your PayPal account'
    },
    {
      value: 'BANK_TRANSFER',
      label: 'Bank Transfer',
      icon: Landmark,
      description: 'Direct bank transfer'
    }
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
      
      <div className="space-y-3">
        {paymentOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <label
              key={option.value}
              className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                paymentMethod === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.value}
                checked={paymentMethod === option.value}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <IconComponent className="h-6 w-6 text-gray-600" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Payment Details Form */}
      {paymentMethod !== 'PAYPAL' && paymentMethod !== 'BANK_TRANSFER' && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Card Details</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="input-field"
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="input-field"
                  maxLength={5}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="input-field"
                  maxLength={3}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input-field"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'PAYPAL' && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            You will be redirected to PayPal to complete your payment after confirming the booking.
          </p>
        </div>
      )}

      {paymentMethod === 'BANK_TRANSFER' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Bank transfer details will be provided after booking confirmation. 
            Please complete the transfer within 24 hours to secure your reservation.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;