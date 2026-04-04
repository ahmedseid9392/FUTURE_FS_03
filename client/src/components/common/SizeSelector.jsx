const SizeSelector = ({ sizes, selected, onSelect }) => {
  const sizeMap = {
    xs: 'XS',
    s: 'S',
    m: 'M',
    l: 'L',
    xl: 'XL',
    xxl: 'XXL'
  };
  
  return (
    <div className="flex flex-wrap gap-3">
      {sizes.map(size => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={`relative px-5 py-2 border-2 rounded-lg transition-all ${
            selected === size
              ? 'border-boutique-primary bg-boutique-primary/10 text-boutique-primary'
              : 'border-gray-300 hover:border-boutique-primary'
          }`}
        >
          {sizeMap[size.toLowerCase()] || size}
          {selected === size && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-boutique-primary rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;