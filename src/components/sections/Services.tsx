import Image from 'next/image';

interface TechLogo {
  src: string;
  alt: string;
  title: string;
}

interface TechGroup {
  type: 'group';
  logos: TechLogo[];
}

interface TechSingle {
  type: 'single';
  src: string;
  alt: string;
  title: string;
}

type Technology = TechGroup | TechSingle;

const technologies: Technology[] = [
  // Microsoft (grouped together)
  {
    type: 'group',
    logos: [
      { src: '/assets/img/logos/Microsoft_365.svg', alt: 'Microsoft 365 Logo', title: 'Microsoft 365' },
      { src: '/assets/img/logos/Microsoft_Azure_Logo.svg', alt: 'Microsoft Azure Logo', title: 'Microsoft Azure' }
    ]
  },
  // Cloud Services
  { 
    type: 'single',
    src: '/assets/img/logos/Amazon_Web_Services_Logo.svg', 
    alt: 'Amazon Web Services Logo', 
    title: 'Amazon Web Services' 
  },
  { 
    type: 'single',
    src: '/assets/img/logos/Google_Cloud_Logo.svg', 
    alt: 'Google Cloud Logo', 
    title: 'Google Cloud Platform' 
  },
  // AI Technologies
  { 
    type: 'single',
    src: '/assets/img/logos/OpenAI_Logo.svg', 
    alt: 'OpenAI ChatGPT Logo', 
    title: 'OpenAI ChatGPT' 
  },
  { 
    type: 'single',
    src: '/assets/img/logos/Anthropic_Claude_Logo.svg', 
    alt: 'Anthropic Claude Logo', 
    title: 'Anthropic Claude' 
  },
  { 
    type: 'single',
    src: '/assets/img/logos/Google_Gemini_Logo.svg', 
    alt: 'Google Gemini Logo', 
    title: 'Google Gemini' 
  },
  // Programming Languages & Frameworks
  { 
    type: 'single',
    src: '/assets/img/logos/Python-logo-notext.svg', 
    alt: 'Python logo', 
    title: 'Python programming language' 
  },
  { 
    type: 'single',
    src: '/assets/img/logos/Go_Logo_Blue.svg', 
    alt: 'Go Logo', 
    title: 'Go programming language' 
  },
  { 
    type: 'single',
    src: '/assets/img/logos/angular.svg', 
    alt: 'Angular logo', 
    title: 'Angular' 
  },
  { 
    type: 'single',
    src: '/assets/img/logos/React-icon.svg', 
    alt: 'React logo', 
    title: 'React' 
  }
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
      <div className="text-center max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-light mb-12">
          Our Technology Stack
        </h2>
        
        {/* Technology Grid - Responsive layout with equal-width boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 justify-items-center max-w-4xl mx-auto">
          {technologies.map((tech, index) => (
            <div key={index} className="tech-logo-container w-full">
              {tech.type === 'group' ? (
                // Microsoft grouped logos
                <div className="bg-white/10 rounded-lg p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 h-full flex flex-col justify-center items-center space-y-2 md:space-y-3 aspect-square">
                  {tech.logos.map((logo, logoIndex) => (
                    <div key={logoIndex} className="flex justify-center items-center flex-1 w-full">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        title={logo.title}
                        width={200}
                        height={100}
                        className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain max-w-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // Individual logos
                <div className="bg-white/10 rounded-lg p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 h-full flex justify-center items-center aspect-square">
                  <Image
                    src={tech.src}
                    alt={tech.alt}
                    title={tech.title}
                    width={200}
                    height={150}
                    className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain max-w-full"
                  />
                </div>
              )}
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