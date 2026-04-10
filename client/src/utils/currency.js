// Ethiopian Birr only - No USD conversion
export const currency = {
  // Format price in Ethiopian Birr only
  format: (price, currencyCode = 'ETB') => {
    return new Intl.NumberFormat('am-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  },
  
  // Convert USD to ETB (if needed for backend)
  toETB: (usdPrice) => {
    return usdPrice;
  },
  
  // Convert ETB to USD (if needed)
  toUSD: (etbPrice) => {
    return etbPrice;
  },
  
  // Get exchange rate (always 1 for ETB)
  getExchangeRate: () => 1
};

// Export individual functions
export const formatPrice = currency.format;
export const toETB = currency.toETB;
export const toUSD = currency.toUSD;
export const getExchangeRate = currency.getExchangeRate;