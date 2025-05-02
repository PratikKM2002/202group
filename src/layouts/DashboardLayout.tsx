import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  Settings,
  LogOut,
  Database,
  BarChart3,
  Utensils,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { UserRole } from '../types';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Different navigation links based on user role
  const getNavLinks = () => {
    if (user?.role === UserRole.RestaurantManager) {
      return [
        { icon: <Home size={20} />, text: 'Dashboard', to: '/manager' },
        { icon: <Utensils size={20} />, text: 'My Restaurants', to: '/manager' },
        { icon: <Calendar size={20} />, text: 'Bookings', to: '/manager/bookings' },
        { icon: <Settings size={20} />, text: 'Settings', to: '/manager/settings' },
      ];
    } else if (user?.role === UserRole.Admin) {
      return [
        { icon: <BarChart3 size={20} />, text: 'Dashboard', to: '/admin/dashboard' },
        { icon: <Utensils size={20} />, text: 'Restaurant Management', to: '/admin/restaurants' },
        { icon: <ClipboardCheck size={20} />, text: 'Restaurant Requests', to: '/admin/restaurant-requests' },
        { icon: <Calendar size={20} />, text: 'Bookings', to: '/admin/bookings' },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex h-screen bg-neutral-900">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'w-20' : 'w-72'}
          fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-neutral-800 to-neutral-900 border-r border-neutral-700/50 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        `}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center px-6 border-b border-neutral-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            {!collapsed && (
              <div className="text-white font-bold text-xl">
                {user?.role === UserRole.RestaurantManager ? 'Restaurant' : 'Admin'} Portal
              </div>
            )}
          </div>
          {/* Collapse/Expand Button */}
          <button
            type="button"
            className="ml-auto text-neutral-400 hover:text-white hidden lg:block"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
          <button
            type="button"
            className="ml-auto text-neutral-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-6">
            <div className={`flex items-center p-4 mb-6 rounded-lg bg-neutral-800/50 border border-neutral-700/50 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {!collapsed && (
                <div className="ml-3">
                  <div className="text-sm font-medium text-white">{user?.name}</div>
                  <div className="text-xs text-neutral-400">{user?.email}</div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    // Always navigate to /admin/dashboard for Dashboard link
                    if (user?.role === UserRole.Admin && link.text === 'Dashboard') {
                      navigate('/admin/dashboard');
                    }
                  }}
                  children={({ isActive }) => (
                    <div
                      className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20'
                          : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50 hover:shadow-md'
                      }`}
                      title={link.text}
                    >
                      <span
                        className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''} ${collapsed ? '' : 'mr-3'} group-hover:scale-110`}
                      >
                        {link.icon}
                      </span>
                      <span
                        className={`transition-all duration-300 origin-left inline-block whitespace-nowrap
                          ${collapsed ? 'opacity-0 scale-x-75 translate-x-[-8px] w-0 overflow-hidden' : 'opacity-100 scale-x-100 translate-x-0 w-auto ml-2'}
                        `}
                        style={{ minWidth: collapsed ? 0 : undefined, maxWidth: collapsed ? 0 : undefined }}
                      >
                        {link.text}
                      </span>
                    </div>
                  )}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t border-neutral-700/50">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-200 hover:shadow-md ${collapsed ? 'justify-center px-0' : ''}`}
            title="Sign Out"
          >
            <LogOut size={20} className={`${collapsed ? '' : 'mr-3'} transition-transform duration-200 group-hover:scale-110`} />
            <span
              className={`transition-all duration-300 origin-left inline-block whitespace-nowrap
                ${collapsed ? 'opacity-0 scale-x-75 translate-x-[-8px] w-0 overflow-hidden' : 'opacity-100 scale-x-100 translate-x-0 w-auto ml-2'}
              `}
              style={{ minWidth: collapsed ? 0 : undefined, maxWidth: collapsed ? 0 : undefined }}
            >
              {!collapsed && 'Sign Out'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-neutral-800/50 backdrop-blur-xl border-b border-neutral-700/50 shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              type="button"
              className="text-neutral-400 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl font-semibold text-white">
                {user?.role === UserRole.RestaurantManager ? 'Restaurant Dashboard' : 'Admin Dashboard'}
              </h1>
            </div>
            <NavLink
              to="/"
              className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
            >
              Back to DineReserve
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-neutral-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;