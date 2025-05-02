import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  Users, 
  Calendar,
  TrendingUp,
  ClipboardCheck,
  ArrowRight,
  Plus
} from 'lucide-react';
import Button from '../../components/common/Button';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Restaurants', value: '156', change: '+12%', trend: 'up' },
    { label: 'Active Bookings', value: '1,248', change: '+23%', trend: 'up' },
    { label: 'Total Users', value: '5,732', change: '+8%', trend: 'up' },
    { label: 'Restaurant Requests', value: '24', change: 'New', trend: 'neutral' },
  ];

  const quickActions = [
    {
      title: 'Restaurant Management',
      description: 'View and manage approved restaurants',
      icon: <Utensils className="h-6 w-6" />,
      path: '/admin/restaurants',
      color: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Restaurant Requests',
      description: 'Review and approve new restaurant applications',
      icon: <ClipboardCheck className="h-6 w-6" />,
      path: '/admin/restaurant-requests',
      color: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Booking Management',
      description: 'Monitor and manage restaurant bookings',
      icon: <Calendar className="h-6 w-6" />,
      path: '/admin/bookings',
      color: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-neutral-400">Welcome back! Here's what's happening today.</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => navigate('/restaurant/new')}
        >
          Add Restaurant
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-neutral-400">{stat.label}</p>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-success-500/20 text-success-400' : 'bg-primary-500/20 text-primary-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="glass-card p-6 text-left transition-transform hover:scale-[1.02] hover:ring-1 hover:ring-white/10"
          >
            <div className={`w-12 h-12 rounded-lg ${action.color} ${action.iconColor} flex items-center justify-center mb-4`}>
              {action.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
            <p className="text-sm text-neutral-400 mb-4">{action.description}</p>
            <div className="flex items-center text-primary-400 text-sm font-medium">
              View Details
              <ArrowRight size={16} className="ml-2" />
            </div>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b border-neutral-700/50 last:border-0">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white">New restaurant request</p>
                  <p className="text-xs text-neutral-400">Italian Delight submitted a new application</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;