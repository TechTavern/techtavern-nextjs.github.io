import Link from 'next/link';
import styles from './Hero.module.css';

interface HeroProps {
  title: string;
  description: string;
}

export default function Hero({ title, description }: HeroProps) {
  return (
    <header
      className={`${styles.bgHero} relative min-h-screen flex items-center justify-center`}
      id="main-content"
      tabIndex={-1}
      aria-label="Main content"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-mask" />
      
      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 pt-3">
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-lg bg-seal-brown/20 rounded-lg p-8 md:p-12 text-light animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 text-light">
                {title}
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl mb-8 text-[color:var(--color-light-80)] leading-relaxed">
                {description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="#Services"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-dark bg-secondary hover:bg-secondary-dark transition-colors duration-300 rounded-lg shadow-lg hover:shadow-xl focus-ring touch-target"
                  aria-label="View our services"
                >
                  Services
                </Link>

                <Link
                  href="/articles"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-light border-2 border-secondary hover:border-secondary-light hover:bg-secondary/10 transition-all duration-300 rounded-lg focus-ring-light touch-target"
                  aria-label="Read our articles"
                >
                  Articles
                </Link>

                <Link
                  href="#Contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-light border-2 border-secondary hover:border-secondary-light hover:bg-secondary/10 transition-all duration-300 rounded-lg focus-ring-light touch-target"
                  aria-label="Contact us"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}