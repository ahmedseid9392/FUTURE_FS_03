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
  // Force currency to always be ETB
  const [currencyCode, setCurrencyCode] = useState('ETB');
  
  const formatPrice = (price) => {
    return currency.format(price, 'ETB');
  };
  
  const convertPrice = (price) => {
    return price; // No conversion needed, always ETB
  };
  
  const value = {
    currencyCode: 'ETB',
    setCurrencyCode: () => {}, // No-op, currency can't be changed
    formatPrice,
    convertPrice
  };
  
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};