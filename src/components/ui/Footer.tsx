import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-seal-brown to-maroon text-light py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Branding/content */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-2">Created by Tech Tavern</h3>
            <p className="text-[color:var(--color-light-80)]">Veteran-owned | Innovation on Tap</p>
          </div>

          {/* Right: Quick navigation */}
          <div className="text-center md:text-right">
            <nav className="flex flex-col md:flex-row md:flex-wrap md:justify-end gap-2 md:gap-x-6 md:gap-y-2" aria-label="Footer navigation">
              <Link href="/" className="text-[color:var(--color-light-80)] hover:text-light transition-colors duration-300 focus-ring-light touch-target" aria-label="Navigate to Home">Home</Link>
              <Link href="/#Services" className="text-[color:var(--color-light-80)] hover:text-light transition-colors duration-300 focus-ring-light touch-target" aria-label="Navigate to Services section">Services</Link>
              <Link href="/#About" className="text-[color:var(--color-light-80)] hover:text-light transition-colors duration-300 focus-ring-light touch-target" aria-label="Navigate to About section">About</Link>
              <Link href="/articles" className="text-[color:var(--color-light-80)] hover:text-light transition-colors duration-300 focus-ring-light touch-target" aria-label="Navigate to Articles page">Articles</Link>
              <Link href="/#Contact" className="text-[color:var(--color-light-80)] hover:text-light transition-colors duration-300 focus-ring-light touch-target" aria-label="Navigate to Contact section">Contact</Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-light/20 mt-8 pt-8 text-center">
          <p className="text-[color:var(--color-light-80)]">&copy; Copyright 2021-{new Date().getFullYear()}, Tech Tavern LLC</p>
        </div>
      </div>
    </footer>
  );
}
