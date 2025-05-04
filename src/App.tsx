import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { testAwsConnection } from './utils/testAws';
import CursorGradient from './components/common/CursorGradient';
import AuthCallback from './components/auth/AuthCallback';
import { clearPersistedStore } from './utils/clearStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { UserRole } from './types';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import RestaurantManagerLayout from './layouts/RestaurantManagerLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SearchResultsPage from './pages/SearchResultsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantSignupPage from './pages/restaurant/RestaurantSignupPage';
import RestaurantSignupSuccessPage from './pages/restaurant/RestaurantSignupSuccessPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import AccountPage from './pages/customer/AccountPage';
import UserBookingsPage from './pages/customer/UserBookingsPage';
import RestaurantManagerPage from './pages/restaurant/RestaurantManagerPage';
import RestaurantDashboardPage from './pages/restaurant/RestaurantDashboardPage';
import RestaurantEditPage from './pages/restaurant/RestaurantEditPage';
import AddRestaurantPage from './pages/restaurant/AddRestaurantPage';
import RestaurantBookingsPage from './pages/restaurant/RestaurantBookingsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminRestaurantRequestsPage from './pages/admin/AdminRestaurantRequestsPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import RestaurantManagerEditPage from './pages/restaurant/RestaurantManagerEditPage';
import RestaurantManagerAddPage from './pages/restaurant/RestaurantManagerAddPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminRestaurantEditPage from './pages/admin/AdminRestaurantEditPage';

function App() {
  const { initialize, user, isLoading } = useAuthStore();

  useEffect(() => {
    // Clear persisted store data on app initialization
    clearPersistedStore();
    
    // TEMP: Set mock restaurant manager user for testing
    const managerUser = {
      id: '3',
      email: 'manager@italianplace.com',
      name: 'Mario Rossi',
      role: UserRole.RestaurantManager,
      restaurantId: '1' // Link to Fog City Diner from mockData
    };
    
    localStorage.setItem('admin_data', JSON.stringify(managerUser));
    localStorage.setItem('user', JSON.stringify(managerUser));

    initialize();
    // Test AWS connection
    testAwsConnection().then(success => {
      if (success) {
        console.log('AWS is properly configured!');
      } else {
        console.error('Please check your AWS configuration');
      }
    });
  }, [initialize]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <CursorGradient />
      <Routes>
        {/* Auth callback route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="search/results" element={<SearchResultsPage />} />
          <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="restaurant/signup" element={<RestaurantSignupPage />} />
          <Route path="restaurant/signup/success" element={<RestaurantSignupSuccessPage />} />
          <Route path="booking/confirmation" element={<BookingConfirmationPage />} />
          <Route path="about" element={<AboutPage />} />
          
          {/* Customer routes */}
          <Route path="account" element={
            <ProtectedRoute allowedRoles={[UserRole.Customer]}>
              <AccountPage />
            </ProtectedRoute>
          } />
          <Route path="account/bookings" element={
            <ProtectedRoute allowedRoles={[UserRole.Customer]}>
              <UserBookingsPage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Restaurant Manager Dashboard */}
        <Route path="/manager" element={
          <ProtectedRoute allowedRoles={[UserRole.RestaurantManager]}>
            <RestaurantManagerLayout />
          </ProtectedRoute>
        }>
          <Route index element={<RestaurantManagerPage />} />
          <Route path="restaurants/:id" element={<RestaurantDashboardPage />} />
          <Route path="restaurants/:id/edit" element={<RestaurantManagerEditPage />} />
          <Route path="restaurants/:id/bookings" element={<RestaurantBookingsPage />} />
          <Route path="restaurants/new" element={<RestaurantManagerAddPage />} />
        </Route>
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[UserRole.Admin]}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="restaurants" element={<AdminRestaurantsPage />} />
          <Route path="restaurants/:id/edit" element={<AdminRestaurantEditPage />} />
          <Route path="restaurant-requests" element={<AdminRestaurantRequestsPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>

        {/* Restaurant Creation */}
        <Route path="/restaurant/new" element={
          <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.RestaurantManager]}>
            <AddRestaurantPage />
          </ProtectedRoute>
        } />
        
        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;