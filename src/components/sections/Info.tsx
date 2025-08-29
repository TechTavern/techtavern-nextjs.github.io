import Image from 'next/image';
import { info } from '@/data/home';

export default function Info() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Image Column */}
      <div className="order-2 lg:order-1">
        <div className="relative">
          <Image
            src={info.image.src}
            alt={info.image.alt}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg side-notch object-cover"
          />
        </div>
      </div>

      {/* Content Column */}
      <div className="order-1 lg:order-2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-light">
          {info.title}
        </h2>
        
        <p className="text-lg md:text-xl text-light/90 leading-relaxed">
          {info.intro}
        </p>
        
        <ul className="feature-list space-y-3 text-light">
          {info.bullets.map((b, i) => (
            <li key={i} className="text-lg">{b}</li>
          ))}
        </ul>
        
        <p className="text-lg italic text-light/80 font-medium">
          {info.note}
        </p>
      </div>
    </div>
  );
}
