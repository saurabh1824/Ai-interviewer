import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <Hero />
      <Footer />
    </div>
  );
};

export default HomePage;