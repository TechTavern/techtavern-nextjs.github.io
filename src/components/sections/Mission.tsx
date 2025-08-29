import { mission as missionItems } from '@/data/home';

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
