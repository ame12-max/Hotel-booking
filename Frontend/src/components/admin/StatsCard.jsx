import React from 'react';
import { TrendingUp, Users, Hotel, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const StatsCard = ({ title, value, icon, trend, description }) => {
  const getIcon = (iconName) => {
    const icons = {
      revenue: <DollarSign className="h-6 w-6" />,
      users: <Users className="h-6 w-6" />,
      hotels: <Hotel className="h-6 w-6" />,
      bookings: <Calendar className="h-6 w-6" />,
      trend: <TrendingUp className="h-6 w-6" />
    };
    return icons[iconName] || <div className="h-6 w-6" />;
  };

  const getValueDisplay = () => {
    if (title.toLowerCase().includes('revenue')) {
      return formatCurrency(value);
    }
    return value.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {getValueDisplay()}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-4 w-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ml-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className="bg-blue-100 p-3 rounded-lg">
          <div className="text-blue-600">
            {getIcon(icon)}
          </div>
        </div>
      </div>
      {description && (
        <p className="text-xs text-gray-500 mt-3">{description}</p>
      )}
    </div>
  );
};

export default StatsCard;