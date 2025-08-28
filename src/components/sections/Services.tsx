import Image from 'next/image';
import services from '@/data/services';

const technologies = [
  // First row
  [
    { src: '/assets/img/logos/Microsoft_365.svg', alt: 'Microsoft 365 Logo', title: 'Microsoft 365', width: 120 },
    { src: '/assets/img/logos/Microsoft_Azure_Logo.svg', alt: 'Microsoft Azure Logo', title: 'Microsoft Azure', width: 120 }
  ],
  [
    { src: '/assets/img/logos/Amazon_Web_Services_Logo.svg', alt: 'Amazon Web Services Logo', title: 'Amazon Web Services', width: 120 }
  ],
  [
    { src: '/assets/img/logos/Raisers-Edge-logo2_246x135.png', alt: "Raiser's Edge NXT logo", title: "Raiser's Edge NXT", width: 120 }
  ],
  [
    { src: '/assets/img/logos/Wordpress-Logo.svg', alt: 'Wordpress logo', title: 'Wordpress', width: 120 }
  ],
  // Second row
  [
    { src: '/assets/img/logos/Python-logo-notext.svg', alt: 'Python logo', title: 'Python programming language', width: 120 }
  ],
  [
    { src: '/assets/img/logos/Go_Logo_Blue.svg', alt: 'Go Logo', title: 'Go programming language', width: 120 }
  ],
  [
    { src: '/assets/img/logos/angular.svg', alt: 'Angular logo', title: 'Angular', width: 120 }
  ],
  [
    { src: '/assets/img/logos/React-icon.svg', alt: 'React logo', title: 'React', width: 120 }
  ]
];

export default function Services() {
  return (
    <div className="py-16 space-y-20">
      {/* Services Section */}
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-light mb-16">
          Our Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="group space-y-6">
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-light/10 rounded-full mb-6 transition-transform duration-300 group-hover:scale-110">
                  <IconComponent size={40} className="text-light" />
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-semibold text-light">
                  {service.title}
                </h3>
                <p className="text-base md:text-lg text-light/90 leading-relaxed max-w-sm mx-auto">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Logos Section */}
      <div className="text-center">
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-light mb-12">
          Technologies We Work With
        </h2>
        
        {/* First row - Microsoft logos in first column, others individual */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 items-center justify-items-center">
          {/* Microsoft column */}
          <div className="flex flex-col gap-4 items-center">
            {technologies[0].map((tech, index) => (
              <div key={index} className="bg-light rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={tech.src}
                  alt={tech.alt}
                  title={tech.title}
                  width={tech.width}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
          
          {/* Individual logos */}
          {technologies.slice(1, 4).map((techGroup, groupIndex) => 
            techGroup.map((tech, index) => (
              <div key={`${groupIndex}-${index}`} className="bg-light rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={tech.src}
                  alt={tech.alt}
                  title={tech.title}
                  width={tech.width}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))
          )}
        </div>

        {/* Second row - Programming languages */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          {technologies.slice(4).map((techGroup, groupIndex) => 
            techGroup.map((tech, index) => (
              <div key={`lang-${groupIndex}-${index}`} className="bg-light rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={tech.src}
                  alt={tech.alt}
                  title={tech.title}
                  width={tech.width}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
