import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, Move3d, X, Maximize2, ScanEye } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  altTitle: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, altTitle }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [magnifierEnabled, setMagnifierEnabled] = useState(true);

  const imgContainerRef = useRef<HTMLDivElement>(null);

  // Constants
  const MAGNIFIER_SIZE = 220; // Size of the zoom lens
  const ZOOM_LEVEL = 2.5; // How much to zoom

  // Helper to get high-res version of image (Simulated for Picsum)
  const getHighResUrl = (url: string) => {
    if (!url) return '';
    // If using picsum, double resolution
    if (url.includes('picsum.photos')) {
      return url.replace(/\/(\d+)\/(\d+)$/, (_, w, h) => `/${parseInt(w)*2}/${parseInt(h)*2}`);
    }
    return url;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current || !magnifierEnabled || window.innerWidth < 768) return;

    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Check bounds to prevent lens from getting stuck outside
    if (x < 0 || y < 0 || x > width || y > height) {
      setShowMagnifier(false);
      return;
    }

    setMousePosition({ x, y });
    setMagnifierPosition({
      x: x - MAGNIFIER_SIZE / 2,
      y: y - MAGNIFIER_SIZE / 2
    });
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // Keyboard accessibility 'Z' toggle and Escape for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'z') {
        setMagnifierEnabled(prev => !prev);
      }
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, []);

  // Update selected index if images change (e.g. variant change)
  useEffect(() => {
      setSelectedIndex(0);
  }, [images]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 select-none relative">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
              selectedIndex === idx 
                ? 'border-yellow-500 ring-2 ring-yellow-500/20 shadow-md scale-105' 
                : 'border-gray-100 hover:border-gray-300 opacity-80 hover:opacity-100'
            }`}
          >
            <img 
                src={img} 
                alt={`${altTitle} thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover" 
            />
          </button>
        ))}
      </div>

      {/* Main Display */}
      <div className="relative flex-grow bg-white rounded-xl border border-gray-100 overflow-hidden group shadow-sm">
        <div 
          ref={imgContainerRef}
          className="relative w-full h-[400px] md:h-[550px] flex items-center justify-center cursor-crosshair bg-white"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => window.innerWidth < 768 && setIsFullScreen(true)}
        >
          {/* Base Image */}
          <img 
            src={images[selectedIndex]} 
            alt={altTitle} 
            className="max-w-full max-h-full object-contain transition-transform duration-300"
          />

          {/* Magnifier Lens */}
          {showMagnifier && (
            <div 
              className="absolute pointer-events-none z-30 overflow-hidden bg-white shadow-2xl border-2 border-gray-100 rounded-full"
              style={{
                width: `${MAGNIFIER_SIZE}px`,
                height: `${MAGNIFIER_SIZE}px`,
                left: `${magnifierPosition.x}px`,
                top: `${magnifierPosition.y}px`,
                transform: 'translate3d(0,0,0)', // GPU Force
              }}
            >
                {/* Zoomed Image Layer */}
                <div 
                    style={{
                        position: 'absolute',
                        // The zoom layer matches the container size * zoom level
                        width: `${(imgContainerRef.current?.clientWidth || 0) * ZOOM_LEVEL}px`,
                        height: `${(imgContainerRef.current?.clientHeight || 0) * ZOOM_LEVEL}px`,
                        // FIX: Added quotes around the URL to handle spaces in filenames
                        backgroundImage: `url('${getHighResUrl(images[selectedIndex])}')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain', // Matches object-contain of main image
                        backgroundPosition: 'center',
                        // Calculate negative margin to align specific point
                        left: `${-(mousePosition.x * ZOOM_LEVEL - MAGNIFIER_SIZE / 2)}px`,
                        top: `${-(mousePosition.y * ZOOM_LEVEL - MAGNIFIER_SIZE / 2)}px`,
                    }}
                />
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-4 right-4 flex flex-col md:flex-row gap-2 z-20">
           <button 
             onClick={() => setMagnifierEnabled(!magnifierEnabled)}
             className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm backdrop-blur-md transition-all ${magnifierEnabled ? 'bg-yellow-500/90 text-black' : 'bg-gray-100/90 text-gray-600 hover:bg-white'}`}
             title="Toggle Hover Zoom (Press Z)"
           >
             {magnifierEnabled ? <ZoomIn size={14} /> : <ScanEye size={14} />}
             <span className="hidden md:inline">{magnifierEnabled ? 'Zoom Active' : 'Enable Zoom'}</span>
           </button>
           
           <button className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1 shadow-sm hover:bg-white border border-gray-200/50">
             <Move3d size={14} /> 360° View
           </button>

           <button 
             onClick={() => setIsFullScreen(true)}
             className="md:hidden bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1 shadow-sm"
           >
             <Maximize2 size={14} /> Full
           </button>
        </div>
      </div>

      {/* Mobile Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-200">
           <button 
             onClick={() => setIsFullScreen(false)}
             className="absolute top-6 right-6 z-10 p-2 bg-white/10 text-white rounded-full backdrop-blur-md"
           >
             <X size={24} />
           </button>
           
           <div className="w-full h-full overflow-hidden flex items-center justify-center p-4">
             <img 
               src={getHighResUrl(images[selectedIndex])}
               alt="Fullscreen view"
               className="max-w-full max-h-full object-contain"
             />
           </div>
           
           <div className="absolute bottom-10 px-4 py-2 bg-black/50 rounded-full text-white/80 text-sm pointer-events-none backdrop-blur-sm">
             Pinch to zoom supported
           </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;