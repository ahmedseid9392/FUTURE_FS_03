import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX } from 'react-icons/fi';

const SizeChartModal = ({ isOpen, onClose, category }) => {
  const sizeCharts = {
    dresses: {
      title: 'Dresses Size Chart',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      measurements: [
        { size: 'XS', bust: '32"', waist: '24"', hips: '34"' },
        { size: 'S', bust: '34"', waist: '26"', hips: '36"' },
        { size: 'M', bust: '36"', waist: '28"', hips: '38"' },
        { size: 'L', bust: '38"', waist: '30"', hips: '40"' },
        { size: 'XL', bust: '40"', waist: '32"', hips: '42"' }
      ]
    },
    default: {
      title: 'Size Chart',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      measurements: [
        { size: 'XS', bust: '32"', waist: '24"', hips: '34"' },
        { size: 'S', bust: '34"', waist: '26"', hips: '36"' },
        { size: 'M', bust: '36"', waist: '28"', hips: '38"' },
        { size: 'L', bust: '38"', waist: '30"', hips: '40"' },
        { size: 'XL', bust: '40"', waist: '32"', hips: '42"' }
      ]
    }
  };
  
  const chart = sizeCharts[category] || sizeCharts.default;
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-card p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-semibold">
                    {chart.title}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Size</th>
                        <th className="text-left py-2">Bust</th>
                        <th className="text-left py-2">Waist</th>
                        <th className="text-left py-2">Hips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chart.measurements.map((m, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2 font-medium">{m.size}</td>
                          <td className="py-2">{m.bust}</td>
                          <td className="py-2">{m.waist}</td>
                          <td className="py-2">{m.hips}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  <p>💡 Tip: If you're between sizes, we recommend sizing up for a comfortable fit.</p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SizeChartModal;