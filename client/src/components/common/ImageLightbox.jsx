import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ImageLightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
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
          <div className="fixed inset-0 bg-black/90" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-transparent text-left align-middle shadow-xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <FiX className="w-6 h-6 text-white" />
                </button>
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={onPrev}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <FiChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={onNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <FiChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}
                
                <img
                  src={images[currentIndex]?.url}
                  alt={`Product ${currentIndex + 1}`}
                  className="w-full h-auto max-h-[90vh] object-contain"
                />
                
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNext && onPrev && idx > currentIndex ? onNext() : onPrev()}
                        className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                          idx === currentIndex
                            ? 'border-boutique-primary'
                            : 'border-transparent hover:border-white/50'
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ImageLightbox;