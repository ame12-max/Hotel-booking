import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Edit, Shield, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AddPaymentMethodModal from './AddPaymentMethodModal';

const PaymentMethods = () => {
  const { user, API_BASE_URL } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  // Load payment methods from API
  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payment/methods`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load payment methods');
      }

      const data = await response.json();
      setPaymentMethods(data.data || []);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    }
  }, [user]);

  const handleAddPaymentMethod = async (paymentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payment/methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add payment method');
      }

      toast.success('Payment method added successfully');
      await loadPaymentMethods(); // Reload the list
      return data;
    } catch (error) {
      console.error('Add payment method error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const handleEditPaymentMethod = async (paymentId, paymentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payment/methods/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update payment method');
      }

      toast.success('Payment method updated successfully');
      await loadPaymentMethods();
      return data;
    } catch (error) {
      console.error('Update payment method error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const handleDeletePaymentMethod = async (paymentId) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payment/methods/${paymentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete payment method');
      }

      toast.success('Payment method deleted successfully');
      await loadPaymentMethods();
    } catch (error) {
      console.error('Delete payment method error:', error);
      toast.error(error.message);
    }
  };

  const handleSetDefault = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/payment/methods/${paymentId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set default payment method');
      }

      toast.success('Default payment method updated');
      await loadPaymentMethods();
    } catch (error) {
      console.error('Set default payment method error:', error);
      toast.error(error.message);
    }
  };

  const openEditModal = (payment) => {
    setEditingPayment(payment);
    setIsAddPaymentModalOpen(true);
  };

  const closeModal = () => {
    setIsAddPaymentModalOpen(false);
    setEditingPayment(null);
  };

  const handleModalSave = async (paymentData) => {
    try {
      if (editingPayment) {
        await handleEditPaymentMethod(editingPayment.id, paymentData);
      } else {
        await handleAddPaymentMethod(paymentData);
      }
      closeModal();
    } catch (error) {
      // Error is already handled in the individual functions
    }
  };

  const getCardIcon = (cardType) => {
    const type = cardType?.toLowerCase() || 'credit';
    const icons = {
      visa: '💳',
      mastercard: '💳',
      'american express': '💳',
      discover: '💳',
      'diners club': '💳',
      jcb: '💳'
    };
    return icons[type] || '💳';
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <CreditCard className="h-6 w-6 mr-2" />
        Payment Methods
      </h2>
      
      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900">Your payment information is secure</h4>
            <p className="text-blue-700 text-sm mt-1">
              We use industry-standard encryption to protect your payment details. 
              Your full card numbers are never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Saved Cards</h3>
          <button
            onClick={() => setIsAddPaymentModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Payment Method</span>
          </button>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No payment methods</h4>
            <p className="text-gray-600 mb-4">Add a payment method to make booking easier and faster.</p>
            <button
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Add Your First Card
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((payment) => (
              <div 
                key={payment.id} 
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors duration-200 ${
                  payment.is_default 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getCardIcon(payment.card_type)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {payment.card_type} •••• {payment.last_four}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {payment.expiry_month}/{payment.expiry_year} • {payment.card_holder}
                    </p>
                    {payment.is_default && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                        <Check className="h-3 w-3 mr-1" />
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!payment.is_default && (
                    <button 
                      onClick={() => handleSetDefault(payment.id)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                      title="Set as default"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => openEditModal(payment)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeletePaymentMethod(payment.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p>No recent transactions</p>
          <p className="text-sm mt-1">Your transaction history will appear here after bookings</p>
        </div>
      </div>

      <AddPaymentMethodModal
        isOpen={isAddPaymentModalOpen}
        onClose={closeModal}
        onSave={handleModalSave}
        editingPayment={editingPayment}
      />
    </div>
  );
};

export default PaymentMethods;