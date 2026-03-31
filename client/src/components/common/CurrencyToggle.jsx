import { useState, useRef, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useCurrencyContext } from '../../context/CurrencyContext';
import { currency } from '../../utils/currency';

const CurrencyToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currencyCode, setCurrencyCode, formatPrice } = useCurrencyContext();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', flag: '🇪🇹' }
  ];
  
  const currentCurrency = currencies.find(c => c.code === currencyCode);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
        aria-label="Select currency"
      >
        <FiDollarSign className="w-4 h-4" />
        <span className="text-sm font-medium">{currencyCode}</span>
        <FiTrendingUp className="w-3 h-3" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-md shadow-lg py-1 border border-gray-200 dark:border-dark-border z-50">
          {currencies.map((currencyItem) => (
            <button
              key={currencyItem.code}
              onClick={() => {
                setCurrencyCode(currencyItem.code);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-border transition-colors ${
                currencyCode === currencyItem.code
                  ? 'text-boutique-primary bg-gray-50 dark:bg-dark-border'
                  : 'text-gray-700 dark:text-dark-text'
              }`}
            >
              <span className="mr-2">{currencyItem.flag}</span>
              {currencyItem.symbol} - {currencyItem.name}
            </button>
          ))}
          <div className="border-t border-gray-200 dark:border-dark-border mt-1 pt-2 px-4 pb-2">
            <p className="text-xs text-gray-500 dark:text-dark-textMuted">
              Exchange Rate: 1 USD = {currency.getExchangeRate()} ETB
            </p>
            <p className="text-xs text-gray-400 dark:text-dark-textMuted mt-1">
              *Prices converted at current rate
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyToggle;