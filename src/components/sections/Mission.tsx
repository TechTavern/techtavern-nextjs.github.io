import { Shield, Smartphone, Code } from 'lucide-react';

const missionItems = [
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "In a digital world, strong cybersecurity measures are essential to protect against cyber attacks. Our team of experts can help identify vulnerabilities and implement security measures to keep your business safe."
  },
  {
    icon: Smartphone,
    title: "Impact", 
    description: "Delivering returns on IT strategies can be difficult without the right planning. It takes talented technical leadership with the right mix of experience and expertise. We help you achieve maximum impact."
  },
  {
    icon: Code,
    title: "Technology",
    description: "Building the right solutions and avoiding technical debt is critical for long-term IT success. We supplement your IT needs through best practice coding, data, and DevOps to launch you to the next level."
  }
];

export default function Mission() {
  return (
    <section className="py-16 md:py-24" id="Mission">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {missionItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="group">
                {/* Icon with gradient background */}
                <div className="icon gradient-brand mb-6 mx-auto transition-transform duration-300 group-hover:scale-110">
                  <IconComponent size={48} className="text-light" />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-dark">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-base md:text-lg text-dark/80 leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}