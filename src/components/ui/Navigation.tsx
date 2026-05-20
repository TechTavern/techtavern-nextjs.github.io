'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { siteMeta } from '@/lib/site';

export default function Navigation() {
  const navigationItems = [
    { href: '/#', label: 'Home' },
    { href: '/#Services', label: 'Services' },
    { href: '/#About', label: 'About' },
    { href: '/#Contact', label: 'Contact' },
    { href: '/articles', label: 'Articles' },
  ];
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Only render on the front page
  if (!isHomePage) {
    return null;
  }

  return (
    <nav
      className={`site-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
        }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Full-width background mask */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />

      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="skip-link focus-ring"
      >
        Skip to main content
      </a>

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center transition-opacity duration-300 hover:opacity-80"
              aria-label={`${siteMeta.title} - Home`}
            >
              <Image
                src={isScrolled ? "/assets/img/logos/TechTavern_Logo_Horizontal_X.svg" : "/assets/img/logos/TechTavern_Logo_Inverted_Horizontal_X.svg"}
                alt={siteMeta.title}
                width={180}
                height={40}
                className="h-10 w-auto"
                style={{ width: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8" role="menubar" aria-label="Desktop navigation menu">
              {navigationItems.map((item) => {
                // Use regular anchor tags for hash links, Link for page navigation
                const isHashLink = item.href.startsWith('/#');

                if (isHashLink) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium transition-colors duration-300 hover:opacity-80 touch-target ${isScrolled
                        ? 'text-gray-900 hover:text-blue-600 focus-ring'
                        : 'text-white hover:text-blue-200 focus-ring-light'
                        }`}
                      onClick={handleLinkClick}
                      role="menuitem"
                      aria-label={`Navigate to ${item.label} section`}
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-300 hover:opacity-80 touch-target ${isScrolled
                      ? 'text-gray-900 hover:text-blue-600 focus-ring'
                      : 'text-white hover:text-blue-200 focus-ring-light'
                      }`}
                    onClick={handleLinkClick}
                    role="menuitem"
                    aria-label={`Navigate to ${item.label} page`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleMenuToggle}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 touch-target ${isScrolled
                ? 'text-gray-900 hover:text-blue-600 hover:bg-gray-100 focus-ring'
                : 'text-white hover:text-blue-200 hover:bg-white/10 focus-ring-light'
                }`}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            >
              <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
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
          <div className="md:hidden" id="mobile-menu">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 rounded-lg mt-2 ${isScrolled ? 'bg-white/95 shadow-lg' : 'bg-black/20 backdrop-blur-sm'
                }`}
              role="menu"
              aria-label="Mobile navigation menu"
            >
              {navigationItems.map((item) => {
                // Use regular anchor tags for hash links, Link for page navigation
                const isHashLink = item.href.startsWith('/#');

                if (isHashLink) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2 text-base font-medium transition-colors duration-300 hover:opacity-80 touch-target ${isScrolled
                        ? 'text-gray-900 hover:text-blue-600 hover:bg-gray-50 focus-ring'
                        : 'text-white hover:text-blue-200 hover:bg-white/10 focus-ring-light'
                        } rounded-md`}
                      onClick={handleLinkClick}
                      role="menuitem"
                      aria-label={`Navigate to ${item.label} section`}
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium transition-colors duration-300 hover:opacity-80 touch-target ${isScrolled
                      ? 'text-gray-900 hover:text-blue-600 hover:bg-gray-50 focus-ring'
                      : 'text-white hover:text-blue-200 hover:bg-white/10 focus-ring-light'
                      } rounded-md`}
                    onClick={handleLinkClick}
                    role="menuitem"
                    aria-label={`Navigate to ${item.label} page`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
