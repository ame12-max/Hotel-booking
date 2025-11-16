// components/admin/TransactionLogs.jsx
import React, { useState, useEffect } from 'react';
import { bookingsService } from '../../services/bookings';
import LoadingSpinner from '../common/LoadingSpinner';
import { Search, Filter, Calendar, User, FileText, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    dateRange: '',
    page: 1,
    limit: 50
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0
  });

  useEffect(() => {
    loadTransactionLogs();
  }, [filters.page, filters.limit]);

  const loadTransactionLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit
      };

      const response = await bookingsService.getTransactionLogs(params);
      setLogs(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Failed to load transaction logs:', error);
      toast.error('Failed to load transaction logs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = () => {
    loadTransactionLogs();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      action: '',
      dateRange: '',
      page: 1,
      limit: 50
    });
  };

  const getActionColor = (action) => {
    const colors = {
      'BOOKING_CREATED': 'bg-green-100 text-green-800 border-green-200',
      'BOOKING_CANCELLED': 'bg-red-100 text-red-800 border-red-200',
      'BOOKING_UPDATED': 'bg-blue-100 text-blue-800 border-blue-200',
      'PAYMENT_SUCCESS': 'bg-green-100 text-green-800 border-green-200',
      'PAYMENT_FAILED': 'bg-red-100 text-red-800 border-red-200',
      'ROOM_CREATED': 'bg-purple-100 text-purple-800 border-purple-200',
      'ROOM_UPDATED': 'bg-blue-100 text-blue-800 border-blue-200',
      'ROOM_DELETED': 'bg-red-100 text-red-800 border-red-200',
      'HOTEL_CREATED': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'HOTEL_UPDATED': 'bg-blue-100 text-blue-800 border-blue-200',
      'HOTEL_DELETED': 'bg-red-100 text-red-800 border-red-200',
      'USER_REGISTERED': 'bg-teal-100 text-teal-800 border-teal-200',
      'USER_LOGIN': 'bg-cyan-100 text-cyan-800 border-cyan-200'
    };
    return colors[action] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getActionIcon = (action) => {
    const icons = {
      'BOOKING_CREATED': CheckCircle,
      'BOOKING_CANCELLED': XCircle,
      'BOOKING_UPDATED': Info,
      'PAYMENT_SUCCESS': CheckCircle,
      'PAYMENT_FAILED': XCircle,
      'ROOM_CREATED': CheckCircle,
      'ROOM_UPDATED': Info,
      'ROOM_DELETED': XCircle,
      'HOTEL_CREATED': CheckCircle,
      'HOTEL_UPDATED': Info,
      'HOTEL_DELETED': XCircle,
      'USER_REGISTERED': CheckCircle,
      'USER_LOGIN': Info
    };
    return icons[action] || AlertCircle;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const actionOptions = [
    'BOOKING_CREATED',
    'BOOKING_CANCELLED',
    'BOOKING_UPDATED',
    'PAYMENT_SUCCESS',
    'PAYMENT_FAILED',
    'ROOM_CREATED',
    'ROOM_UPDATED',
    'ROOM_DELETED',
    'HOTEL_CREATED',
    'HOTEL_UPDATED',
    'HOTEL_DELETED',
    'USER_REGISTERED',
    'USER_LOGIN'
  ];

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Transaction Logs</h3>
          <p className="text-sm text-gray-600">Monitor all system activities and transactions</p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FileText className="h-4 w-4" />
          <span>Total Records: {pagination.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search logs..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Type
            </label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Actions</option>
              {actionOptions.map(action => (
                <option key={action} value={action}>
                  {action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Items per page
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={handleSearch}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Filter className="h-4 w-4 inline mr-1" />
              Apply
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8">
            <LoadingSpinner text="Loading transaction logs..." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => {
                    const ActionIcon = getActionIcon(log.action);
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ActionIcon className={`h-5 w-5 mr-2 ${getActionColor(log.action).includes('green') ? 'text-green-600' : getActionColor(log.action).includes('red') ? 'text-red-600' : getActionColor(log.action).includes('blue') ? 'text-blue-600' : 'text-gray-600'}`} />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                              {log.action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {log.user_name || 'System'}
                              </div>
                              {log.booking_id && (
                                <div className="text-xs text-gray-500">
                                  Booking #{log.booking_id}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md">
                            {log.details ? truncateText(log.details, 120) : 'No details available'}
                          </div>
                          {log.table_name && (
                            <div className="text-xs text-gray-500 mt-1">
                              Table: {log.table_name} {log.record_id && `(ID: ${log.record_id})`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.ip_address || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDateTime(log.created_at)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {logs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transaction logs found</h3>
                <p className="text-gray-600">
                  {filters.search || filters.action ? 'Try adjusting your filters' : 'No transaction logs have been recorded yet'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {!loading && logs.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handleFilterChange('page', filters.page - 1)}
              disabled={filters.page <= 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handleFilterChange('page', filters.page + 1)}
              disabled={filters.page >= totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(filters.page * filters.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                  disabled={filters.page <= 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (filters.page <= 3) {
                    pageNum = i + 1;
                  } else if (filters.page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = filters.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handleFilterChange('page', pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        filters.page === pageNum
                          ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={filters.page >= totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionLogs;