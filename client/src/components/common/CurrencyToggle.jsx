import { FiDollarSign } from 'react-icons/fi';

const CurrencyToggle = () => {
  // Always show ETB, no toggle functionality
  return (
    <div className="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-dark-card">
      <FiDollarSign className="w-4 h-4" />
      <span className="text-sm font-medium">ETB</span>
      <span className="text-xs text-gray-500">Birr</span>
    </div>
  );
};

export default CurrencyToggle;