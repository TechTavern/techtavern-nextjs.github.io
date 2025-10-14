import Link from "next/link";
import Navigation from "@/components/ui/Navigation";

type HeaderProps = {
  variant: "home" | "interior";
};

export default function Header({ variant }: HeaderProps) {
  if (variant === "home") {
    // Home page header uses the existing client Navigation with scroll behavior
    return <Navigation />;
  }

  // Interior header for articles and other inner pages
  return (
    <header className="bg-gradient-to-br from-seal-brown to-maroon text-light">
      <nav className="container mx-auto px-4 py-4" aria-label="Interior navigation">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-heading font-bold text-light hover:text-secondary-light transition-colors duration-300 focus-ring-light"
            aria-label="Tech Tavern - Return to homepage"
          >
            Tech Tavern
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-light/90 hover:text-light transition-colors duration-300 focus-ring-light"
              aria-label="Navigate to Home page"
            >
              Home
            </Link>
            <Link
              href="/articles"
              className="text-light hover:text-secondary-light transition-colors duration-300 font-medium focus-ring-light"
              aria-label="Navigate to Articles page"
            >
              Articles
            </Link>
            <Link
              href="/#Contact"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-dark bg-secondary hover:bg-secondary-dark transition-colors duration-300 rounded-lg focus-ring touch-target"
              aria-label="Navigate to Contact section"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

