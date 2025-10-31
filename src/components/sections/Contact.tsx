import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Globe, Calendar } from 'lucide-react';

const contact = {
  heading: 'Contact us:',
  intro:
    "Let's Tap Into Your Mission. Whether you're nearby or across time zones, I'm ready to help. Let's start a conversation—virtually or in person—about how AI, data, and strategy can serve your purpose.",
  city: 'Glen Allen, Virginia',
  country: 'United States',
  email: 'info@tech-tavern.com',
  bookingUrl: '/consulting/scott-turnbull',
  bookingLabel: 'Book an Appointment',
};

export default function Contact() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Contact Information */}
      <div className="space-y-6">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-dark">
          {contact.heading}
        </h2>
        
        <p className="text-lg md:text-xl text-[color:var(--color-dark-80)] leading-relaxed">
          {contact.intro}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center" aria-hidden="true">
              <MapPin className="text-primary" size={20} aria-hidden="true" />
            </div>
            <div className="text-dark">
              <p className="font-medium">{contact.city}</p>
              <p>{contact.country}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center" aria-hidden="true">
              <Globe className="text-primary" size={20} aria-hidden="true" />
            </div>
            <div className="text-dark">
              Remote-friendly | <em>Globally available</em>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center" aria-hidden="true">
              <Mail className="text-primary" size={20} aria-hidden="true" />
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="text-primary hover:text-primary-dark transition-colors font-medium underline decoration-2 underline-offset-2"
              aria-label={`Email Tech Tavern at ${contact.email}`}
            >
              {contact.email}
            </a>
          </div>
        </div>

        {/* Book Appointment Button */}
        <div className="pt-4">
          <Link
            href={contact.bookingUrl}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-light bg-primary hover:bg-primary-dark transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Calendar className="h-5 w-5" aria-hidden />
            {contact.bookingLabel}
          </Link>
        </div>
      </div>

      {/* Illustration */}
      <div className="flex justify-center">
        <Image
          src="/assets/img/undraw_contact_us_15o2_white_circles.svg"
          alt="Illustration of people collaborating around social media and communication icons"
          width={500}
          height={400}
          className="w-full h-auto max-w-md object-contain"
        />
      </div>
    </div>
  );
}
