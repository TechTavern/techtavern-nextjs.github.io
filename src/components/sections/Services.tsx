import Image from 'next/image';

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

const serviceAreas = [
  {
    title: "Tap into Skills",
    content: "Effective recruitment, collaborative tutorials, formal training, and development challenges are all effective ways to grow your workforce. Tech Tavern has a long history of facilitating growth and achieving real-world impact.",
    features: [
      "Designing and delivering tutorials and workshops.",
      "Fostering community engagement through technology.",
      "Running challenges, hackathons, and reverse pitches.",
      "Coordinating meetups and professional exchanges."
    ],
    image: "/assets/img/undraw_teaching_f1cm.svg",
    imageAlt: "line drawing of a person standing in front of a blackboard",
    layout: "text-first"
  },
  {
    title: "Tap into Impact", 
    content: "Tech Tavern helps you execute your strategy through experience at all levels of IT. We move you forward by collaboratively developing and managing plans, measuring and monitoring outcomes, or providing IT leadership.",
    features: [
      "Interim CIO and IT Leadership.",
      "Strategic IT planning support.",
      "Proposal and grant support.",
      "IT and data policy development."
    ],
    image: "/assets/img/undraw_Scrum_board_re_wk7v.svg",
    imageAlt: "line drawing of a person in front of a scrum board",
    layout: "image-first"
  },
  {
    title: "Tap into Code",
    content: "In addition to strategic IT leadership, Tech Tavern provides direct hands-on support for your IT needs. Be it kick-starting an initiative with best practices, prototyping, and rapid development, or consolidating and streamlining operations, Tech Tavern has the right skills and partnerships for you.",
    features: [
      "Software creation and support with a focus on Python, Go, Javascript/Typescript.",
      "Data support for standard RDBMS systems, document-based or time series databases.",
      "Data structure, simulation and processing.",
      "Cloud operations and services."
    ],
    image: "/assets/img/undraw_programming_2svr.svg",
    imageAlt: "line drawing of someone from behind working on a computer with several monitors",
    layout: "text-first"
  }
];

export default function Services() {
  return (
    <div className="space-y-16">
      {/* Technology Logos Section */}
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-light mb-12">
          Our Technology Stack
        </h2>
        
        {/* First row - Microsoft logos in first column, others individual */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 items-center justify-items-center">
          {/* Microsoft column */}
          <div className="flex flex-col gap-4 items-center">
            {technologies[0].map((tech, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
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
              <div key={`${groupIndex}-${index}`} className="bg-white/10 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
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
              <div key={`lang-${groupIndex}-${index}`} className="bg-white/10 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
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