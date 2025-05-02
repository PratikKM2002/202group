import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ChatInterface from '../components/chat/ChatInterface';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatInterface />
    </div>
  );
};

export default MainLayout;