import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'customer' | 'manager' | 'admin'>('customer');

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setRole('customer')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              role === 'customer'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setRole('manager')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              role === 'manager'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Restaurant Manager
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              role === 'admin'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Admin
          </button>
        </div>

        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            {role === 'customer'
              ? 'Login to Your Account'
              : role === 'manager'
              ? 'Restaurant Manager Login'
              : 'Admin Login'}
          </h1>
          <LoginForm userRole={role} />
          
          {role === 'manager' && (
            <div className="mt-6 text-center">
              <p className="text-neutral-400">
                Want to list your restaurant?{' '}
                <Link to="/restaurant/signup" className="text-primary-400 hover:text-primary-300">
                  Apply here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;