import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { UserRole } from '../../types';

const AdminAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  React.useEffect(() => {
    if (!user || user.role !== UserRole.Admin) {
      navigate('/login');
    }
  }, [user, navigate]);

  const stats = [
    {
      name: 'Total Users',
      value: '1,234',
      icon: Users,
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Total Bookings',
      value: '5,678',
      icon: Calendar,
      change: '+8%',
      changeType: 'increase'
    },
    {
      name: 'Active Restaurants',
      value: '89',
      icon: BarChart3,
      change: '+5%',
      changeType: 'increase'
    },
    {
      name: 'Revenue',
      value: '$12,345',
      icon: TrendingUp,
      change: '+15%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">{stat.name}</p>
                <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-primary-900/50 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary-400" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-success-400' : 'text-error-400'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-neutral-400 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Booking Trends</h2>
          <div className="h-64 flex items-center justify-center text-neutral-400">
            Chart placeholder
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center text-neutral-400">
            Chart placeholder
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b border-neutral-700 last:border-0">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <div>
                  <p className="text-sm font-medium text-white">New booking at Restaurant {item}</p>
                  <p className="text-xs text-neutral-400">2 hours ago</p>
                </div>
              </div>
              <span className="text-sm text-neutral-400">$120</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage; 