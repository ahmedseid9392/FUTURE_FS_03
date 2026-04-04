import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  FiX, 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiMapPin, 
  FiUser, 
  FiMail, 
  FiPhone,
  FiCreditCard,
  FiDollarSign,
  FiPrinter,
  FiDownload,
  FiAlertCircle,
  FiCalendar,
  FiHash,
  FiShoppingBag,
  FiBox
} from 'react-icons/fi';
import { useCurrencyContext } from '../../context/CurrencyContext';
import { format } from 'date-fns';

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  const { formatPrice } = useCurrencyContext();
  const [activeTab, setActiveTab] = useState('items');
  
  if (!order) return null;
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-blue-500" />;
      case 'pending':
      case 'processing':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'confirmed':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'pending':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const tabs = [
    { id: 'items', label: 'Order Items', icon: FiShoppingBag },
    { id: 'customer', label: 'Customer Info', icon: FiUser },
    { id: 'timeline', label: 'Timeline', icon: FiClock }
  ];
  
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
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-card text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-dark-border bg-gradient-to-r from-boutique-primary/10 to-transparent">
                  <div>
                    <Dialog.Title as="h3" className="text-xl font-playfair font-bold text-gray-900 dark:text-white">
                      Order Details
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      Order #{order.orderNumber || order._id?.slice(-8)}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="max-h-[80vh] overflow-y-auto p-6">
                  {/* Order Summary Header */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Order Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.orderStatus)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                      <div className="flex items-center gap-2">
                        <FiCreditCard className="w-4 h-4" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-boutique-primary">
                        {formatPrice(order.totalAmount || 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Order Date</p>
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        <p className="text-sm">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="border-b border-gray-200 dark:border-dark-border mb-6">
                    <div className="flex gap-6">
                      {tabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-1 py-3 text-sm font-medium transition-all ${
                            activeTab === tab.id
                              ? 'text-boutique-primary border-b-2 border-boutique-primary'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  {/* Order Items Tab */}
                  {activeTab === 'items' && (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-dark-surface rounded-lg">
                            <tr>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Quantity</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                            {order.items?.map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors">
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.image || 'https://via.placeholder.com/50'}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                      {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                                      {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-gray-600">{formatPrice(item.price)}</td>
                                <td className="py-4 px-4 text-gray-600">x{item.quantity}</td>
                                <td className="py-4 px-4 font-medium text-boutique-primary">
                                  {formatPrice(item.price * item.quantity)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="border-t border-gray-200 dark:border-dark-border">
                            <tr>
                              <td colSpan="3" className="text-right py-3 px-4 font-medium">Subtotal:</td>
                              <td className="py-3 px-4 font-medium">{formatPrice(order.subtotal || 0)}</td>
                            </tr>
                            <tr>
                              <td colSpan="3" className="text-right py-2 px-4 text-gray-500">Shipping:</td>
                              <td className="py-2 px-4 text-gray-500">
                                {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost || 0)}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="3" className="text-right py-2 px-4 text-gray-500">Tax:</td>
                              <td className="py-2 px-4 text-gray-500">{formatPrice(order.tax || 0)}</td>
                            </tr>
                            <tr className="border-t border-gray-200 dark:border-dark-border">
                              <td colSpan="3" className="text-right py-3 px-4 font-bold text-lg">Total:</td>
                              <td className="py-3 px-4 font-bold text-lg text-boutique-primary">
                                {formatPrice(order.totalAmount || 0)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {/* Customer Info Tab */}
                  {activeTab === 'customer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Shipping Address */}
                      <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-6">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <FiMapPin className="w-5 h-5 text-boutique-primary" />
                          Shipping Address
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <FiUser className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {order.shippingAddress?.fullName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <FiMail className="w-4 h-4 text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-600 dark:text-dark-textMuted">
                              {order.shippingAddress?.email}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <FiPhone className="w-4 h-4 text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-600 dark:text-dark-textMuted">
                              {order.shippingAddress?.phone}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-600 dark:text-dark-textMuted">
                              {order.shippingAddress?.street}<br />
                              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                              {order.shippingAddress?.country}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment Information */}
                      <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-6">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <FiCreditCard className="w-5 h-5 text-boutique-primary" />
                          Payment Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-dark-textMuted">Payment Method</span>
                            <span className="font-medium capitalize">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-dark-textMuted">Payment Status</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus?.toUpperCase()}
                            </span>
                          </div>
                          {order.paymentDetails?.transactionId && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-dark-textMuted">Transaction ID</span>
                              <span className="font-mono text-xs">{order.paymentDetails.transactionId}</span>
                            </div>
                          )}
                          {order.paymentDetails?.paymentDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-dark-textMuted">Payment Date</span>
                              <span>{new Date(order.paymentDetails.paymentDate).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Order Notes */}
                      {order.notes && (
                        <div className="md:col-span-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <FiAlertCircle className="w-5 h-5 text-yellow-600" />
                            Order Notes
                          </h4>
                          <p className="text-gray-600 dark:text-dark-textMuted">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Timeline Tab */}
                  {activeTab === 'timeline' && order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="space-y-4">
                      {order.statusHistory.map((history, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === order.statusHistory.length - 1 
                                ? 'bg-boutique-primary text-white' 
                                : 'bg-gray-200 dark:bg-dark-border'
                            }`}>
                              {index === order.statusHistory.length - 1 ? (
                                <FiCheckCircle className="w-5 h-5" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              )}
                            </div>
                            {index < order.statusHistory.length - 1 && (
                              <div className="w-0.5 h-full ml-5 bg-gray-200 dark:bg-dark-border"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(history.status)}`}>
                                {history.status?.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(history.date).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-dark-textMuted">
                              {history.note || `Order ${history.status}`}
                            </p>
                            {history.updatedBy && (
                              <p className="text-xs text-gray-400 mt-1">
                                Updated by: {history.updatedBy.name || 'System'}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(!order.statusHistory || order.statusHistory.length === 0) && activeTab === 'timeline' && (
                    <div className="text-center py-8">
                      <FiClock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500">No timeline history available</p>
                    </div>
                  )}
                </div>
                
                {/* Footer Actions */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FiPrinter className="w-4 h-4" />
                    Print Order
                  </button>
                  <button
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OrderDetailModal;