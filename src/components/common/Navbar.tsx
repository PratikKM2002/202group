import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { UserRole } from '../../types';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const navElement = document.querySelector('.glass-nav');
      if (navElement) {
        const rect = navElement.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        if (y >= 0 && y <= 100) {
          setPosition({ x, y });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case UserRole.Admin:
        return '/admin';
      case UserRole.RestaurantManager:
        return '/restaurant/dashboard';
      case UserRole.Customer:
      default:
        return '/account';
    }
  };

  return (
    <nav 
      className="glass-nav sticky top-0 z-50"
      style={{
        background: `
          radial-gradient(
            600px circle at ${position.x}% ${position.y}%,
            rgba(29, 78, 216, 0.15),
            transparent 40%
          ),
          radial-gradient(
            400px circle at ${position.x}% ${position.y}%,
            rgba(124, 58, 237, 0.1),
            transparent 40%
          ),
          rgba(17, 25, 40, 0.75)
        `,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-400 font-bold text-xl">DineReserve</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-neutral-300 hover:text-primary-400 px-3 py-2 font-medium">
              Home
            </Link>
            <Link to="/search" className="text-neutral-300 hover:text-primary-400 px-3 py-2 font-medium">
              Find a Table
            </Link>
            <Link to="/about" className="text-neutral-300 hover:text-primary-400 px-3 py-2 font-medium">
              About
            </Link>
            
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center text-neutral-300 hover:text-primary-400 px-3 py-2 font-medium"
                  onClick={toggleProfile}
                >
                  <span className="mr-1">{user?.name}</span>
                  <ChevronDown size={16} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card py-1">
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700/50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/account/bookings"
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700/50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700/50"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <div className="relative group flex items-center">
                  <Link
                    to="/login"
                    className="text-neutral-300 hover:text-primary-400 px-3 py-2 font-medium transition-all duration-200 group-hover:scale-105 group-active:scale-95 h-full flex items-center"
                  >
                    Login
                  </Link>
                  <div
                    className="absolute right-0 mt-2 w-48 glass-card py-1 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50 shadow-xl border border-neutral-700/40 backdrop-blur-lg"
                    style={{ minWidth: '12rem' }}
                  >
                    <Link
                      to="/login?role=manager"
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700/50 transition-colors duration-150 cursor-pointer"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Restaurant Manager
                    </Link>
                    <Link
                      to="/login?role=admin"
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700/50 transition-colors duration-150 cursor-pointer"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Admin
                    </Link>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-lg font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              type="button"
              className="text-neutral-400 hover:text-primary-400"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block text-neutral-300 hover:bg-neutral-700/50 px-3 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block text-neutral-300 hover:bg-neutral-700/50 px-3 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Find a Table
            </Link>
            <Link
              to="/about"
              className="block text-neutral-300 hover:bg-neutral-700/50 px-3 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
          
          <div className="border-t border-neutral-700/50 pt-4 pb-3">
            {user ? (
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <User className="h-10 w-10 text-neutral-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-neutral-200">{user?.name}</div>
                    <div className="text-sm font-medium text-neutral-400">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to={getDashboardLink()}
                    className="block px-4 py-2 text-base font-medium text-neutral-300 hover:bg-neutral-700/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/account/bookings"
                    className="block px-4 py-2 text-base font-medium text-neutral-300 hover:bg-neutral-700/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <button
                    className="flex w-full items-center px-4 py-2 text-base font-medium text-neutral-300 hover:bg-neutral-700/50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 px-4">
                <Link
                  to="/login"
                  className="text-neutral-300 hover:bg-neutral-700/50 px-3 py-2 rounded-lg font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/login?role=manager"
                  className="text-neutral-300 hover:bg-neutral-700/50 px-3 py-2 rounded-lg font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Restaurant Manager Login
                </Link>
                <Link
                  to="/login?role=admin"
                  className="text-neutral-300 hover:bg-neutral-700/50 px-3 py-2 rounded-lg font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 text-white hover:bg-primary-600 px-3 py-2 rounded-lg font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;