import Image from 'next/image';

const technologyGroups = [
  {
    title: 'Cloud',
    logos: [
      { src: '/assets/img/logos/Microsoft_Azure_Logo.svg', alt: 'Microsoft Azure Logo', title: 'Microsoft Azure' },
      { src: '/assets/img/logos/Amazon_Web_Services_Logo.svg', alt: 'Amazon Web Services Logo', title: 'Amazon Web Services' },
      { src: '/assets/img/logos/Google_Cloud_Logo.svg', alt: 'Google Cloud Logo', title: 'Google Cloud Platform' },
    ],
  },
  {
    title: 'AI',
    logos: [
      { src: '/assets/img/logos/OpenAI_Logo.svg', alt: 'OpenAI ChatGPT Logo', title: 'OpenAI ChatGPT' },
      { src: '/assets/img/logos/Anthropic_Claude_Logo.svg', alt: 'Anthropic Claude Logo', title: 'Anthropic Claude' },
      { src: '/assets/img/logos/Google_Gemini_Logo.svg', alt: 'Google Gemini Logo', title: 'Google Gemini' },
      { src: '/assets/img/logos/Grok-2025-logo.svg', alt: 'Grok Logo', title: 'Grok AI' },
    ],
  },
  {
    title: 'Code',
    logos: [
      { src: '/assets/img/logos/Python-logo-notext.svg', alt: 'Python logo', title: 'Python programming language' },
      { src: '/assets/img/logos/Go_Logo_Blue.svg', alt: 'Go Logo', title: 'Go programming language' },
      { src: '/assets/img/logos/React-icon.svg', alt: 'React logo', title: 'React' },
      { src: '/assets/img/logos/angular.svg', alt: 'Angular logo', title: 'Angular' },
    ],
  },
];

const serviceAreas = [
  {
    title: 'Tap into Insights',
    content:
      'Effective recruitment, collaborative tutorials, formal training, and development challenges are all effective ways to grow your workforce. Tech Tavern has a long history of facilitating growth and achieving real-world impact.',
    features: [
      'AI readiness assessments and ethical AI workshops.',
      'Data governance and compliance frameworks (NIST, ISO).',
      'Facilitation of community-driven technology discussions and hackathons',
    ],
    image: '/assets/img/undraw_teaching_f1cm.svg',
    imageAlt: 'line drawing of a person standing in front of a blackboard',
    layout: 'text-first',
  },
  {
    title: 'Tap into Impact',
    content:
      'Tech Tavern helps you execute your strategy through experience at all levels of IT. We move you forward by collaboratively developing and managing plans, measuring and monitoring outcomes, or providing IT leadership.',
    features: [
      'Interim AI/Data leadership and public sector/nonprofit transformation.',
      'Strategic planning for AI, digital transformation, and grant-funded projects.',
      'Development of AI governance policies and data compliance plans.',
    ],
    image: '/assets/img/undraw_Scrum_board_re_wk7v.svg',
    imageAlt: 'line drawing of a person in front of a scrum board',
    layout: 'image-first',
  },
  {
    title: 'Tap into Solutions',
    content:
      'In addition to strategic IT leadership, Tech Tavern provides direct hands-on support for your IT needs. Be it kick-starting an initiative with best practices, prototyping, and rapid development, or consolidating and streamlining operations, Tech Tavern has the right skills and partnerships for you.',
    features: [
      'Prototyping and MVP development with Python, Go, JavaScript/TypeScript.',
      'Data engineering and analytics systems (cloud-based pipelines, RDBMS, time-series)',
      'Cloud-native deployments and infrastructure for mission-driven applications',
    ],
    image: '/assets/img/undraw_programming_2svr.svg',
    imageAlt:
      'line drawing of someone from behind working on a computer with several monitors',
    layout: 'text-first',
  },
];

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
