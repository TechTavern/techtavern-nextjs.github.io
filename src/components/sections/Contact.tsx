import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Contact Information */}
      <div className="space-y-6">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-dark">
          Contact us:
        </h2>
        
        <p className="text-lg md:text-xl text-dark/80 leading-relaxed">
          To reach out with questions, talk about how we might be able to work together, or anything else...
        </p>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <MapPin className="text-primary" size={20} />
            </div>
            <div className="text-dark">
              <p className="font-medium">Glen Allen, Virginia</p>
              <p>United States</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <Phone className="text-primary" size={20} />
            </div>
            <a 
              href="tel:+16788224200" 
              className="text-dark hover:text-primary transition-colors font-medium"
            >
              +1 (678) 822 4200
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <Mail className="text-primary" size={20} />
            </div>
            <a 
              href="mailto:info@tech-tavern.com" 
              className="text-primary hover:text-primary-dark transition-colors font-medium underline decoration-2 underline-offset-2"
            >
              info@tech-tavern.com
            </a>
          </div>
        </div>
      </div>

      {/* Illustration */}
      <div className="flex justify-center">
        <Image
          src="/assets/img/undraw_contact_us_15o2.svg"
          alt="line art of people sitting around social media icons"
          width={500}
          height={400}
          className="w-full h-auto max-w-md object-contain"
        />
      </div>
    </div>
  );
}