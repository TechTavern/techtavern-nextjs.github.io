'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface NavigationItem {
  href: string;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { href: '/#', label: 'Home' },
  { href: '/#Services', label: 'Services' },
  { href: '/#About', label: 'About' },
  { href: '/#Contact', label: 'Contact' },
  { href: '/articles', label: 'Articles' }
];

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Only render on the front page
  if (!isHomePage) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      {/* Full-width background mask */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a 
              href="/" 
              className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              Tech Tavern
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-300 hover:opacity-80 ${
                    isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'
                  }`}
                  onClick={handleLinkClick}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleMenuToggle}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-900 hover:text-blue-600 hover:bg-gray-100' 
                  : 'text-white hover:text-blue-200 hover:bg-white/10'
              }`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 rounded-lg mt-2 ${
              isScrolled ? 'bg-white/95 shadow-lg' : 'bg-black/20 backdrop-blur-sm'
            }`}>
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-300 hover:opacity-80 ${
                    isScrolled 
                      ? 'text-gray-900 hover:text-blue-600 hover:bg-gray-50' 
                      : 'text-white hover:text-blue-200 hover:bg-white/10'
                  } rounded-md`}
                  onClick={handleLinkClick}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}