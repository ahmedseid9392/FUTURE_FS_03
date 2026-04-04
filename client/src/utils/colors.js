// Color name to hex mapping for consistent display
export const colorMap = {
  red: '#FF4444',
  blue: '#4444FF',
  green: '#44FF44',
  yellow: '#FFD700',
  black: '#000000',
  white: '#FFFFFF',
  gold: '#D4AF37',
  silver: '#C0C0C0',
  pink: '#FF69B4',
  purple: '#800080',
  orange: '#FFA500',
  brown: '#8B4513',
  gray: '#808080',
  navy: '#000080',
  teal: '#008080',
  maroon: '#800000',
  olive: '#808000',
  lime: '#00FF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  coral: '#FF7F50',
  lavender: '#E6E6FA',
  beige: '#F5F5DC',
  turquoise: '#40E0D0',
  indigo: '#4B0082',
  violet: '#EE82EE',
  salmon: '#FA8072',
  khaki: '#F0E68C',
  plum: '#DDA0DD',
  orchid: '#DA70D6',
  chocolate: '#D2691E',
  tomato: '#FF6347',
};

export const getColorHex = (colorName) => {
  return colorMap[colorName.toLowerCase()] || '#CCCCCC';
};

export const getTextColor = (bgColor) => {
  // Simple contrast checker
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};