import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">About Us</h1>
      
      <div className="glass-card p-8 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Our Story</h2>
        <p className="text-neutral-300 mb-4">
          Welcome to our restaurant booking platform! We're dedicated to connecting food lovers with their 
          perfect dining experiences. Our platform makes it easy to discover, book, and enjoy 
          the best restaurants in your area.
        </p>
        <p className="text-neutral-300 mb-4">
          Founded in 2023, we've grown from a small startup to a comprehensive booking service 
          that partners with hundreds of restaurants nationwide.
        </p>
      </div>
      
      <div className="glass-card p-8 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
        <p className="text-neutral-300 mb-4">
          We believe that finding and booking the perfect restaurant should be a seamless experience. 
          Our mission is to simplify the restaurant discovery and booking process while helping 
          restaurants connect with new customers.
        </p>
      </div>
      
      <div className="glass-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
        <p className="text-neutral-300 mb-4">
          Have questions or feedback? We'd love to hear from you!
        </p>
        <div className="text-neutral-300">
          <p className="mb-2">
            <span className="text-primary-400">Email:</span> contact@dinereserve.com
          </p>
          <p className="mb-2">
            <span className="text-primary-400">Phone:</span> (555) 123-4567
          </p>
          <p>
            <span className="text-primary-400">Address:</span> 123 Main Street, Foodie City, FC 12345
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;