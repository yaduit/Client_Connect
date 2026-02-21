import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageCarousel = ({ images = [], title = "Gallery" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[currentIndex];

  return (
    <>
      <section className="py-12 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>

        {/* Main Carousel */}
        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
          {/* Image */}
          <div className="relative aspect-video bg-gray-200 flex items-center justify-center group">
            <img
              src={currentImage.url}
              alt={`Gallery ${currentIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowModal(true)}
            />

            {/* Image Counter */}
            <div className="absolute top-3 right-3 bg-gray-900/60 text-white px-3 py-1.5 rounded-full text-xs font-medium">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-900/60 hover:bg-gray-900 text-white p-2 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-900/60 hover:bg-gray-900 text-white p-2 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 bg-white overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? 'border-green-500 ring-2 ring-green-500/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <img
            src={currentImage.url}
            alt={`Full screen ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Counter in fullscreen */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/70 text-white px-4 py-2 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
