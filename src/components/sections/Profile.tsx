import Image from 'next/image';
import { Linkedin } from 'lucide-react';

export default function Profile() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12">
      {/* Image Column - appears second on mobile, first on desktop */}
      <div className="order-2 lg:order-1">
        <div className="relative">
          <Image
            src="/assets/img/ScottSpeakingSCC.jpg"
            alt="Scott Turnbull speaking at an event"
            width={700}
            height={500}
            className="w-full h-auto rounded-lg shadow-xl object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content Column - appears first on mobile, second on desktop */}
      <div className="order-1 lg:order-2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-light leading-tight">
          Who We Are
        </h2>
        
        <div className="text-lg text-light/90 leading-relaxed space-y-4">
          <p>
            Tech Tavern is led by{' '}
            <a 
              href="https://www.linkedin.com/in/scott-turnbull-b2b01b8/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent-light hover:text-accent transition-colors underline decoration-2 underline-offset-2"
            >
              Scott Turnbull
            </a>
            , a seasoned IT professional with over 25 years of experience with national, regional, and local IT programs. His expertise includes work with universities, local government, non-profits, and includes partnerships with federal agencies like the National Science Foundation, NIST, and the Department of Defense.
          </p>
          
          <div className="flex items-center gap-3">
            <span>Connect with Scott:</span>
            <a
              href="https://www.linkedin.com/in/scott-turnbull-b2b01b8/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-linkedin hover:bg-linkedin/90 text-white transition-colors"
              aria-label="Scott Turnbull's LinkedIn Profile"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-heading font-semibold text-light mb-4">
            Expertise & Leadership
          </h3>
          <ul className="feature-list space-y-2 text-light">
            <li>Bold visionary in the Smart City movement.</li>
            <li>IT leader with numerous national infrastructure projects.</li>
            <li>Expert on data and software engineering.</li>
            <li>Frequent speaker on data, privacy, and economic development through technology.</li>
            <li>Start-up mentor.</li>
            <li>Community and business IT planner with proven results.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}