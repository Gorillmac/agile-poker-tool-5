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
      <nav className="glass sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4 shadow-nav flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold gradient-text">Agile Poker</span>
              <span className="block text-xs text-gray-500 -mt-1">Planning Tool</span>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`nav-link font-medium ${isActive('/') ? 'text-primary-600 active' : 'text-gray-700 hover:text-primary-600'}`}>
            Home
          </Link>
          <Link href="/sessions" className={`nav-link font-medium ${isActive('/sessions') ? 'text-primary-600 active' : 'text-gray-700 hover:text-primary-600'}`}>
            Sessions
          </Link>
          <Link href="/whiteboard" className={`nav-link font-medium ${isActive('/whiteboard') ? 'text-primary-600 active' : 'text-gray-700 hover:text-primary-600'}`}>
            Whiteboard
          </Link>
          <Link href="/trello" className={`nav-link font-medium ${isActive('/trello') ? 'text-primary-600 active' : 'text-gray-700 hover:text-primary-600'}`}>
            Trello Sync
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-primary-700 font-medium hover:text-primary-800 transition-colors duration-300">
            Login
          </Link>
          <Link href="/register" className="btn-gradient text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 scale-hover">
            Sign Up
          </Link>
          <button 
            className="md:hidden glass-light p-2 rounded-md"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 glass-dark z-50 backdrop-blur-lg flex flex-col items-center justify-center transform transition-all duration-500 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      >
        <button 
          className="absolute top-6 right-6 text-white bg-primary-600/80 p-2 rounded-full hover:bg-primary-700/80 transition-colors duration-300"
          onClick={toggleMobileMenu}
          aria-label="Close mobile menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center">
          <div className="mb-12 flex items-center">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-2xl font-bold text-white">Agile Poker</span>
              <span className="block text-sm text-gray-300">Planning Tool</span>
            </div>
          </div>
        </div>
        
        <div className="glass-primary/30 p-8 rounded-2xl shadow-card max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-6 text-xl divide-y divide-white/10">
            <div className="w-full py-2">
              <Link 
                href="/" 
                className={`block py-2 px-4 rounded-lg ${isActive('/') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link 
                href="/sessions" 
                className={`block py-2 px-4 rounded-lg ${isActive('/sessions') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                onClick={toggleMobileMenu}
              >
                Sessions
              </Link>
              <Link 
                href="/whiteboard" 
                className={`block py-2 px-4 rounded-lg ${isActive('/whiteboard') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                onClick={toggleMobileMenu}
              >
                Whiteboard
              </Link>
              <Link 
                href="/trello" 
                className={`block py-2 px-4 rounded-lg ${isActive('/trello') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                onClick={toggleMobileMenu}
              >
                Trello Sync
              </Link>
            </div>
            
            <div className="w-full pt-6 flex flex-col space-y-4">
              <Link 
                href="/login" 
                className="w-full text-center text-white border border-white/30 py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="w-full text-center btn-gradient text-white font-medium py-3 px-6 rounded-lg shadow-lg"
                onClick={toggleMobileMenu}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
