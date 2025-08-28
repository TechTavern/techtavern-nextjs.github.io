import Hero from '@/components/sections/Hero';
import Mission from '@/components/sections/Mission';
import Info from '@/components/sections/Info';
import Services from '@/components/sections/Services';
import Profile from '@/components/sections/Profile';
import Contact from '@/components/sections/Contact';
import SvgDivider from '@/components/ui/SvgDivider';
import { DEFAULT_FEATURED_IMAGE, getBaseUrl, siteMeta, withBasePath } from '@/lib/site';

export const metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    type: 'website',
    siteName: siteMeta.title,
    url: getBaseUrl(),
    images: [{ url: new URL(withBasePath(DEFAULT_FEATURED_IMAGE)!, getBaseUrl()).toString(), alt: siteMeta.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMeta.title,
    description: siteMeta.description,
    images: [new URL(withBasePath(DEFAULT_FEATURED_IMAGE)!, getBaseUrl()).toString()],
  },
  alternates: {
    canonical: getBaseUrl(),
  },
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero 
        title="Tech Tavern"
        description="Empowering businesses through innovative technology solutions, cybersecurity expertise, and strategic IT leadership."
      />

      {/* Info Section with Gradient Background */}
      <section className="gradient-brand text-light pt-6 pb-0" id="Info">
        <div className="container mx-auto px-4 mt-12">
          <Info />
        </div>
        
        {/* Bottom Divider */}
        <SvgDivider position="bottom" fill="white" />
      </section>

      {/* Mission Section */}
      <Mission />

      {/* Services Section */}
      <section className="gradient-brand text-light py-0" id="Services">
        {/* Top Divider */}
        <SvgDivider position="top" fill="white" />
        
        <div className="container mx-auto px-4">
          <Services />
        </div>
        
        {/* Bottom Divider */}
        <SvgDivider position="bottom" fill="#1f1e1e" />
      </section>

      {/* About/Profile Section */}
      <section className="bg-nero text-light pt-16 pb-0" id="About">
        <div className="container mx-auto px-4">
          <Profile />
        </div>
        
        {/* Wave divider using inline SVG for custom styling */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 240" className="w-full h-[60px] block" preserveAspectRatio="none">
          <path
            fill="#f2f7ff"
            fillOpacity="1"
            d="M0,128L120,128C240,128,480,128,720,122.7C960,117,1200,107,1320,101.3L1440,96L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
          />
        </svg>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-light" id="Contact">
        <div className="container mx-auto px-4">
          <Contact />
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-brand text-light py-12">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-lg font-medium">Created by Tech Tavern</p>
          <p className="text-light/80">
            &copy; Copyright 2021-{new Date().getFullYear()}, Tech Tavern LLC
          </p>
        </div>
      </footer>
    </>
  );
}
