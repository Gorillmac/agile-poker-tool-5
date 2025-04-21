import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Users } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const isActive = (path: string) => location === path;

  return (
    <>
      <nav className="glass sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-semibold text-primary-900">Agile Poker</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`nav-link font-medium ${isActive('/') ? 'text-primary-800 active' : 'text-gray-800'}`}>
            Home
          </Link>
          <Link href="/sessions" className={`nav-link font-medium ${isActive('/sessions') ? 'text-primary-800 active' : 'text-gray-800'}`}>
            Sessions
          </Link>
          <Link href="/whiteboard" className={`nav-link font-medium ${isActive('/whiteboard') ? 'text-primary-800 active' : 'text-gray-800'}`}>
            Whiteboard
          </Link>
          <Link href="/trello" className={`nav-link font-medium ${isActive('/trello') ? 'text-primary-800 active' : 'text-gray-800'}`}>
            Trello Sync
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-primary-700 font-medium hover:text-primary-800 transition-colors duration-300">
            Login
          </Link>
          <Link href="/register" className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300">
            Sign Up
          </Link>
          <button 
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 glass-dark z-50 flex flex-col items-center justify-center transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button 
          className="absolute top-4 right-4 text-white"
          onClick={toggleMobileMenu}
          aria-label="Close mobile menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col items-center space-y-8 text-xl">
          <Link href="/" className="text-white font-medium" onClick={toggleMobileMenu}>Home</Link>
          <Link href="/sessions" className="text-white font-medium" onClick={toggleMobileMenu}>Sessions</Link>
          <Link href="/whiteboard" className="text-white font-medium" onClick={toggleMobileMenu}>Whiteboard</Link>
          <Link href="/trello" className="text-white font-medium" onClick={toggleMobileMenu}>Trello Sync</Link>
          <Link href="/login" className="text-white font-medium mt-8" onClick={toggleMobileMenu}>Login</Link>
          <Link 
            href="/register" 
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
            onClick={toggleMobileMenu}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
};
