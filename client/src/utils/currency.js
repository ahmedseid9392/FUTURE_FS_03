// Exchange rate (1 USD = 55 ETB - approximate)
const USD_TO_ETB_RATE = 55;

export const currency = {
  // Format price based on selected currency
  format: (price, currencyCode = 'USD') => {
    const amount = currencyCode === 'ETB' ? price * USD_TO_ETB_RATE : price;
    
    return new Intl.NumberFormat(currencyCode === 'ETB' ? 'am-ET' : 'en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },
  
  // Convert USD to ETB
  toETB: (usdPrice) => {
    return usdPrice * USD_TO_ETB_RATE;
  },
  
  // Convert ETB to USD
  toUSD: (etbPrice) => {
    return etbPrice / USD_TO_ETB_RATE;
  },
  
  // Get current exchange rate
  getExchangeRate: () => USD_TO_ETB_RATE
};

// Export individual functions as well
export const formatPrice = currency.format;
export const toETB = currency.toETB;
export const toUSD = currency.toUSD;
export const getExchangeRate = currency.getExchangeRate;