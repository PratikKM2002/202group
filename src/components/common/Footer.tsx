import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-primary-400 font-bold text-xl">DineReserve</span>
            </Link>
            <p className="text-neutral-400 text-sm">
              Book the best restaurants in your area with ease. Find new dining experiences and enjoy great food.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary-400">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-neutral-400 hover:text-primary-400 text-sm">
                  Find a Restaurant
                </Link>
              </li>
              <li>
                <Link to="/cuisines" className="text-neutral-400 hover:text-primary-400 text-sm">
                  Browse by Cuisine
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-neutral-400 hover:text-primary-400 text-sm">
                  Browse by Location
                </Link>
              </li>
              <li>
                <Link to="/restaurants/top-rated" className="text-neutral-400 hover:text-primary-400 text-sm">
                  Top Rated Restaurants
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">For Restaurants</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurant/signup" className="text-neutral-400 hover:text-primary-400 text-sm">
                  Join DineReserve
                </Link>
              </li>
              <li>
                <Link to="/restaurant/login" className="text-neutral-400 hover:text-primary-400 text-sm">
                  Restaurant Login
                </Link>
              </li>
              <li>
                <Link to="/restaurant/support" className="text-neutral-400 hover:text-primary-400 text-sm">
                  Restaurant Support
                </Link>
              </li>
              <li>
                <Link to="/restaurant/terms" className="text-neutral-400 hover:text-primary-400 text-sm">
                  Terms for Restaurants
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-neutral-400 text-sm">
                <Mail size={16} className="mr-2" />
                <span>support@dinereserve.com</span>
              </li>
              <li className="flex items-center text-neutral-400 text-sm">
                <Phone size={16} className="mr-2" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-2">Language</h3>
              <select className="bg-neutral-700 text-neutral-300 rounded px-2 py-1 text-sm w-full">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <div className="text-neutral-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} DineReserve Inc. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-neutral-400 hover:text-primary-400 text-sm">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-neutral-400 hover:text-primary-400 text-sm">
              Privacy Policy
            </Link>
            <Link to="/help" className="text-neutral-400 hover:text-primary-400 text-sm">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;