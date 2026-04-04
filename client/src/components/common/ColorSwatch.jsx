import { getColorHex, getTextColor } from '../../utils/colors';

const ColorSwatch = ({ color, selected, onClick, size = 'md', showLabel = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };
  
  const hexColor = getColorHex(color);
  const textColor = getTextColor(hexColor);
  
  return (
    <button
      onClick={() => onClick?.(color)}
      className={`relative rounded-full transition-all duration-200 ${
        sizes[size]
      } ${
        selected ? 'ring-2 ring-boutique-primary ring-offset-2 scale-110' : 'hover:scale-105'
      }`}
      style={{ backgroundColor: hexColor }}
      title={color}
    >
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="w-4 h-4" style={{ color: textColor }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
      {showLabel && (
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
          {color}
        </span>
      )}
    </button>
  );
};

export default ColorSwatch;