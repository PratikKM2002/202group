import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Menu, Home, Calendar, Settings, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { UserRole } from '../types';

const RestaurantManagerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/manager', icon: Home },
    { name: 'Bookings', href: '/manager/bookings', icon: Calendar },
    { name: 'Settings', href: '/manager/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-800 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-700">
            <h2 className="text-xl font-semibold text-white">Restaurant Manager</h2>
            <button
              type="button"
              className="text-neutral-400 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <Menu size={24} />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-primary-900/50 text-primary-400'
                      : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-neutral-700">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-lg"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

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
              <h1 className="text-xl font-semibold text-white">Restaurant Dashboard</h1>
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

export default RestaurantManagerLayout; 