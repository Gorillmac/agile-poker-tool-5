import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Users, LogOut, UserCircle, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/ThemeToggle';
import { getInitials } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="glass sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4 shadow-nav flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold gradient-text">agile-poker</span>
              <span className="block text-xs text-gray-500 -mt-1">Planning Tool</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`nav-link font-medium ${isActive('/') ? 'text-primary-600 active' : 'text-gray-700 hover:text-primary-600'}`}>
            Home
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className={`nav-link font-medium ${isActive('/dashboard') ? 'text-primary-600 active' : 'text-gray-700 hover:text-primary-600'}`}>
                Dashboard
              </Link>
              <Link href="/sessions" className={`nav-link font-medium ${isActive('/sessions') ? 'text-primary-600 active' : 'text-gray-700 hover:text-primary-600'}`}>
                Sessions
              </Link>
              <Link href="/trello" className={`nav-link font-medium ${isActive('/trello') ? 'text-primary-600 active' : 'text-gray-700 hover:text-primary-600'}`}>
                Trello Sync
              </Link>
            </>
          ) : (
            <>
              <Link href="/features" className={`nav-link font-medium ${isActive('/features') ? 'text-primary-600 active' : 'text-gray-700 hover:text-primary-600'}`}>
                Features
              </Link>
              <Link href="/pricing" className={`nav-link font-medium ${isActive('/pricing') ? 'text-primary-600 active' : 'text-gray-700 hover:text-primary-600'}`}>
                Pricing
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary-100">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt={user.username} />
                    <AvatarFallback className="bg-primary-100 text-primary-800">
                      {getInitials(user.name || user.username)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-light" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || user.username}</p>
                    <p className="text-xs leading-none text-gray-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth" className="text-primary-700 font-medium hover:text-primary-800 transition-colors duration-300">
                Login
              </Link>
              <Link href="/auth?tab=register" className="btn-gradient text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 scale-hover">
                Sign Up
              </Link>
            </>
          )}

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

        {user && (
          <div className="mb-8 flex flex-col items-center">
            <Avatar className="h-16 w-16 mb-2 border-2 border-white/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt={user.username} />
              <AvatarFallback className="bg-primary-800 text-white text-lg">
                {getInitials(user.name || user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-white font-medium">{user.name || user.username}</h3>
              <p className="text-gray-300 text-sm">{user.email}</p>
            </div>
          </div>
        )}

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

              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`block py-2 px-4 rounded-lg ${isActive('/dashboard') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/sessions" 
                    className={`block py-2 px-4 rounded-lg ${isActive('/sessions') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                    onClick={toggleMobileMenu}
                  >
                    Sessions
                  </Link>
                  <Link 
                    href="/trello" 
                    className={`block py-2 px-4 rounded-lg ${isActive('/trello') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                    onClick={toggleMobileMenu}
                  >
                    Trello Sync
                  </Link>
                  <Link 
                    href="/profile" 
                    className={`block py-2 px-4 rounded-lg ${isActive('/profile') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                    onClick={toggleMobileMenu}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className={`block py-2 px-4 rounded-lg ${isActive('/settings') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                    onClick={toggleMobileMenu}
                  >
                    Settings
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/features" 
                    className={`block py-2 px-4 rounded-lg ${isActive('/features') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                    onClick={toggleMobileMenu}
                  >
                    Features
                  </Link>
                  <Link 
                    href="/pricing" 
                    className={`block py-2 px-4 rounded-lg ${isActive('/pricing') ? 'bg-primary-600/20 text-white' : 'text-gray-100 hover:bg-white/10'} transition-colors duration-300`} 
                    onClick={toggleMobileMenu}
                  >
                    Pricing
                  </Link>
                </>
              )}
            </div>

            <div className="w-full pt-6 flex flex-col space-y-4">
              <div className="flex justify-center mb-2">
                <ThemeToggle />
              </div>

              {user ? (
                <button 
                  onClick={handleLogout}
                  className="w-full text-center flex items-center justify-center space-x-2 bg-red-600/20 hover:bg-red-600/30 text-white border border-red-500/30 py-3 px-6 rounded-lg shadow-inner transition-colors duration-300"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link 
                    href="/auth" 
                    className="w-full text-center text-white border border-white/30 py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300"
                    onClick={toggleMobileMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth?tab=register" 
                    className="w-full text-center btn-gradient text-white font-medium py-3 px-6 rounded-lg shadow-lg"
                    onClick={toggleMobileMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};