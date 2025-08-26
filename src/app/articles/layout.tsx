import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: {
    template: "%s | Tech Tavern Articles",
    default: "Articles | Tech Tavern",
  },
  description: "Insights and expertise on technology, cybersecurity, and IT solutions from Tech Tavern LLC.",
};

interface ArticlesLayoutProps {
  children: ReactNode;
}

export default function ArticlesLayout({ children }: ArticlesLayoutProps) {
  return (
    <>
      {/* Header Navigation */}
      <header className="gradient-brand text-light">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="text-2xl font-heading font-bold text-light hover:text-secondary-light transition-colors duration-300"
            >
              Tech Tavern
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link 
                href="/"
                className="text-light/90 hover:text-light transition-colors duration-300"
              >
                Home
              </Link>
              <Link 
                href="/articles"
                className="text-light hover:text-secondary-light transition-colors duration-300 font-medium"
              >
                Articles
              </Link>
              <Link 
                href="/#Contact"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-dark bg-secondary hover:bg-secondary-dark transition-colors duration-300 rounded-lg"
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-light">
        {children}
      </main>

      {/* Footer */}
      <footer className="gradient-brand text-light py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-heading font-bold mb-2">Tech Tavern</h3>
              <p className="text-light/80">
                Empowering businesses through innovative technology solutions, cybersecurity expertise, and strategic IT leadership.
              </p>
            </div>
            <div className="text-center md:text-right">
              <div className="space-y-2">
                <Link 
                  href="/"
                  className="block text-light/80 hover:text-light transition-colors duration-300"
                >
                  Home
                </Link>
                <Link 
                  href="/articles"
                  className="block text-light/80 hover:text-light transition-colors duration-300"
                >
                  Articles
                </Link>
                <Link 
                  href="/#Contact"
                  className="block text-light/80 hover:text-light transition-colors duration-300"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-light/20 mt-8 pt-8 text-center">
            <p className="text-light/80">
              &copy; Copyright 2021-{new Date().getFullYear()}, Tech Tavern LLC
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}