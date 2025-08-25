interface SvgDividerProps {
  position: 'top' | 'bottom';
  fill?: string;
  className?: string;
}

export default function SvgDivider({ 
  position, 
  fill = 'currentColor',
  className = '' 
}: SvgDividerProps) {
  const isTop = position === 'top';
  
  return (
    <div className={`relative ${isTop ? 'shape-divider-top' : 'shape-divider'} ${className}`}>
      <svg 
        data-name={`tri-asym-${position}`}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`w-full ${isTop ? '' : 'mt-3'} shape-fill`}
        style={{ height: 'var(--size-shape-divider)' }}
      >
        <path
          fill={fill}
          fillOpacity="1"
          d="M892.25 114.72L0 0 0 120 1200 120 1200 0 892.25 114.72z"
          className={isTop ? 'shape-fill' : 'feature'}
        />
      </svg>
    </div>
  );
}