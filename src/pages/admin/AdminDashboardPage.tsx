import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  Users, 
  Calendar,
  TrendingUp,
  ClipboardCheck,
  ArrowRight,
  Plus,
  BarChart2,
  LineChart,
  Download,
  ChevronDown
} from 'lucide-react';
import Button from '../../components/common/Button';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('month');
  const [visibleDatasets, setVisibleDatasets] = useState({
    bookings: true,
    restaurants: true,
    users: true
  });

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

  // Analytics data with more datasets
  const analyticsData = {
    labels: timePeriod === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : timePeriod === 'month'
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Bookings',
        data: timePeriod === 'week' 
          ? [45, 52, 38, 45, 58, 62, 55]
          : timePeriod === 'month'
          ? [180, 210, 195, 220]
          : [65, 59, 80, 81, 56, 55, 40, 45, 50, 55, 60, 65],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        hidden: !visibleDatasets.bookings,
      },
      {
        label: 'New Restaurants',
        data: timePeriod === 'week'
          ? [12, 15, 8, 10, 13, 9, 11]
          : timePeriod === 'month'
          ? [45, 52, 48, 55]
          : [28, 48, 40, 19, 86, 27, 30, 35, 40, 45, 50, 55],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        hidden: !visibleDatasets.restaurants,
      },
      {
        label: 'New Users',
        data: timePeriod === 'week'
          ? [25, 30, 22, 28, 35, 32, 29]
          : timePeriod === 'month'
          ? [120, 135, 125, 140]
          : [45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        hidden: !visibleDatasets.users,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          usePointStyle: true,
          pointStyle: 'circle',
        },
        onClick: (e: any, legendItem: any, legend: any) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          const dataset = ci.data.datasets[index];
          const newState = { ...visibleDatasets };
          
          if (dataset.label === 'Bookings') newState.bookings = !newState.bookings;
          if (dataset.label === 'New Restaurants') newState.restaurants = !newState.restaurants;
          if (dataset.label === 'New Users') newState.users = !newState.users;
          
          setVisibleDatasets(newState);
          dataset.hidden = !dataset.hidden;
          ci.update();
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US').format(value);
          }
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics-${timePeriod}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

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

      {/* Analytics Graph */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Analytics Overview</h2>
          <div className="flex items-center gap-4">
            {/* Time Period Selector */}
            <div className="relative">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as 'week' | 'month' | 'year')}
                className="appearance-none bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            </div>

            {/* Chart Type Toggle */}
            <div className="flex gap-2">
              <Button
                variant={chartType === 'bar' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
                className="flex items-center gap-2"
              >
                <BarChart2 size={16} />
                Bar
              </Button>
              <Button
                variant={chartType === 'line' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
                className="flex items-center gap-2"
              >
                <LineChart size={16} />
                Line
              </Button>
            </div>

            {/* Download Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </Button>
          </div>
        </div>
        <div className="h-[400px]">
          {chartType === 'bar' ? (
            <Bar data={analyticsData} options={options} />
          ) : (
            <Line data={analyticsData} options={options} />
          )}
        </div>
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