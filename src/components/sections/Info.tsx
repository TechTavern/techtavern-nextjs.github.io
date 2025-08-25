import Image from 'next/image';

export default function Info() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Image Column */}
      <div className="order-2 lg:order-1">
        <div className="relative">
          <Image
            src="/assets/img/annie-spratt-QckxruozjRg-unsplash.jpg"
            alt="5 people sitting around a wooden table working on laptops and collaborating together"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg side-notch object-cover"
          />
        </div>
      </div>

      {/* Content Column */}
      <div className="order-1 lg:order-2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-light">
          Introducing Tech Tavern
        </h2>
        
        <p className="text-lg md:text-xl text-light/90 leading-relaxed">
          Helping businesses and communities supercharge their workforce, 
          achieve undeniable impact, and leverage best-in-class coding, data, and DevOps.
        </p>
        
        <ul className="feature-list space-y-3 text-light">
          <li className="text-lg">Develop an IT workforce with cutting-edge skills.</li>
          <li className="text-lg">Plan and adopt technology for the highest impact.</li>
          <li className="text-lg">Supercharge your IT development and operations with best practice implementations.</li>
        </ul>
        
        <p className="text-lg italic text-light/80 font-medium">
          Tech Tavern is a veteran-owned business.
        </p>
      </div>
    </div>
  );
}