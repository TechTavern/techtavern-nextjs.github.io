import Image from 'next/image';
import { technologyGroups, serviceAreas } from '@/data/services';

export default function Services() {
  return (
    <div className="space-y-16">
      {/* Technology Logos Section */}
      <div className="text-center max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-light mb-12">
          Our Technology Stack
        </h2>
        
        {/* Technology Groups - 3 Equal Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {technologyGroups.map((group, groupIndex) => (
            <div 
              key={groupIndex} 
              className="tech-group-container"
            >
              {/* Group Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-heading font-semibold text-light/90 mb-4">
                  {group.title}
                </h3>
              </div>
              
              {/* Group Background Container */}
              <div className="bg-white/10 rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 h-[240px] md:h-[280px]">
                {/* Individual Logos Grid */}
                <div className={
                  group.logos.length === 3 
                    ? "grid grid-cols-1 gap-3 sm:gap-4 h-full" 
                    : "grid grid-cols-2 gap-2 sm:gap-3 h-full"
                }>
                  {group.logos.map((logo, logoIndex) => (
                    <div 
                      key={logoIndex} 
                      className="flex justify-center items-center"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        title={logo.title}
                        width={200}
                        height={150}
                        className="h-10 sm:h-12 md:h-14 w-auto object-contain max-w-full hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Areas */}
      <div className="space-y-16 pt-12">
        {serviceAreas.map((service, index) => (
          <div 
            key={index}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
              service.layout === 'image-first' ? 'lg:grid-flow-col-dense' : ''
            }`}
          >
            {/* Content */}
            <div className={`space-y-6 ${service.layout === 'image-first' ? 'lg:col-start-2' : ''}`}>
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-light">
                {service.title}
              </h3>
              
              <p className="text-lg text-light/90 leading-relaxed">
                {service.content}
              </p>
              
              <ul className="feature-list space-y-2 text-light">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-base">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Image */}
            <div className={`${service.layout === 'image-first' ? 'lg:col-start-1' : ''}`}>
              <Image
                src={service.image}
                alt={service.imageAlt}
                width={500}
                height={400}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
