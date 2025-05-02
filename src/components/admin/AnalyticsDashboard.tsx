import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AnalyticsData } from '../../types';

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const COLORS = ['#1A73E8', '#FF9800', '#F44336', '#4CAF50', '#9C27B0'];

  // Format bookings by day data
  const formattedBookingsByDay = data.bookingsByDay.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  // Prepare data for the status pie chart
  const statusData = [
    { name: 'Completed', value: data.completedBookings },
    { name: 'Cancelled', value: data.cancelledBookings },
    { name: 'Pending/Confirmed', value: data.totalBookings - data.completedBookings - data.cancelledBookings },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-neutral-500 text-sm font-medium mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-neutral-900">{data.totalBookings}</p>
          <div className="mt-2 text-xs font-medium text-primary-600">Last 30 days</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-neutral-500 text-sm font-medium mb-2">Completed Bookings</h3>
          <p className="text-3xl font-bold text-accent-600">{data.completedBookings}</p>
          <div className="mt-2 text-xs font-medium text-primary-600">
            {Math.round((data.completedBookings / data.totalBookings) * 100)}% of total
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-neutral-500 text-sm font-medium mb-2">Cancelled Bookings</h3>
          <p className="text-3xl font-bold text-error-600">{data.cancelledBookings}</p>
          <div className="mt-2 text-xs font-medium text-primary-600">
            {Math.round((data.cancelledBookings / data.totalBookings) * 100)}% of total
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-neutral-500 text-sm font-medium mb-2">Avg. Party Size</h3>
          <p className="text-3xl font-bold text-secondary-600">{data.averagePartySize.toFixed(1)}</p>
          <div className="mt-2 text-xs font-medium text-primary-600">People per booking</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Bookings Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedBookingsByDay}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Bookings"
                  stroke="#1A73E8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Booking Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Top Restaurants</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.topRestaurants}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Bookings" fill="#FF9800" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;