import React, { createContext, useState, useContext, useEffect } from 'react';
import { currency } from '../utils/currency';

const CurrencyContext = createContext();

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrencyContext must be used within CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState(() => {
    const saved = localStorage.getItem('currency');
    return saved || 'USD';
  });
  
  useEffect(() => {
    localStorage.setItem('currency', currencyCode);
  }, [currencyCode]);
  
  const formatPrice = (price) => {
    return currency.format(price, currencyCode);
  };
  
  const convertPrice = (price) => {
    return currencyCode === 'ETB' ? price * currency.getExchangeRate() : price;
  };
  
  const value = {
    currencyCode,
    setCurrencyCode,
    formatPrice,
    convertPrice
  };
  
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};