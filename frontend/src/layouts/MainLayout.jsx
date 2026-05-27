import React from 'react';
import LuxuryNavbar from '../components/landing/LuxuryNavbar';
import LuxuryFooter from '../components/landing/LuxuryFooter';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-text">
      <LuxuryNavbar />
      <main className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
      <LuxuryFooter />
    </div>
  );
};

export default MainLayout;
