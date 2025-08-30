import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="gradient-brand text-light py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Branding/content */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-2">Created by Tech Tavern</h3>
            <p className="text-light/80">Veteran-owned | Innovation on Tap</p>
          </div>

          {/* Right: Quick navigation */}
          <div className="text-center md:text-right">
            <nav className="space-y-2">
              <Link href="/" className="block text-light/80 hover:text-light transition-colors duration-300">Home</Link>
              <Link href="/#Services" className="block text-light/80 hover:text-light transition-colors duration-300">Services</Link>
              <Link href="/#About" className="block text-light/80 hover:text-light transition-colors duration-300">About</Link>
              <Link href="/articles" className="block text-light/80 hover:text-light transition-colors duration-300">Articles</Link>
              <Link href="/#Contact" className="block text-light/80 hover:text-light transition-colors duration-300">Contact</Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-light/20 mt-8 pt-8 text-center">
          <p className="text-light/80">&copy; Copyright 2021-{new Date().getFullYear()}, Tech Tavern LLC</p>
        </div>
      </div>
    </footer>
  );
}
