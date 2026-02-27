import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn } from 'lucide-react';

// Inside ../components/MagicZoomClone.tsx

interface MagicZoomProps {
  src: string;
  zoomSrc: string;
  alt: string;
  zoomLevel: number;
  glassSize: number;
  className?: string; // Add this line
}
const MagicZoomClone: React.FC<MagicZoomProps> = ({ 
  src, 
  zoomSrc, 
  alt = "", 
  zoomLevel = 2.5, 
  glassSize = 200 
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  const imgRef = useRef<HTMLDivElement>(null);

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set the "floating" distance for mobile (pixels above finger)
  const MOBILE_OFFSET = 100; 

  const processMovement = (clientX: number, clientY: number) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    
    const x = clientX - left;
    const y = clientY - top;

    // Boundary check
    if (x < 0 || y < 0 || x > width || y > height) {
      setShowMagnifier(false);
      return;
    }

    setCursorPos({ x, y });
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => processMovement(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent) => processMovement(e.touches[0].clientX, e.touches[0].clientY);
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    processMovement(clientX, clientY);
  };

  const activeZoomSrc = zoomSrc || src;

  return (
    <div 
      ref={imgRef}
      className="relative overflow-hidden cursor-crosshair group select-none w-full h-full flex items-center justify-center bg-[#dbdbdc]"
      style={{ touchAction: 'none' }} // Prevents scrolling on mobile
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={handleStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setShowMagnifier(false)}
    >
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full max-h-full w-auto h-auto object-contain pointer-events-none"
      />

      {/* Mobile Hint */}
      <div className={`absolute bottom-4 right-4 bg-black/60 text-white text-[10px] px-3 py-1 rounded-full pointer-events-none transition-opacity duration-300 flex items-center gap-2 ${showMagnifier ? 'opacity-0' : 'opacity-100'}`}>
         <ZoomIn size={12} /> {isMobile ? "Touch & Drag" : "Hover to Zoom"}
      </div>

      {showMagnifier && (
        <div 
          className="absolute z-50 bg-white border-2 border-yellow-500 rounded-full shadow-2xl pointer-events-none"
          style={{
            // 1. SIZE
            width: `${glassSize}px`,
            height: `${glassSize}px`,

            // 2. POSITION THE GLASS BOX
            // On mobile, we subtract MOBILE_OFFSET to move the glass UP above your finger
            left: `${cursorPos.x - glassSize / 2}px`,
            top: `${cursorPos.y - glassSize / 2 - (isMobile ? MOBILE_OFFSET : 0)}px`,

            // 3. BACKGROUND IMAGE
            backgroundImage: `url('${activeZoomSrc}')`,
            backgroundRepeat: 'no-repeat',
            
            // 4. BACKGROUND SIZE
            backgroundSize: `${(imgRef.current?.offsetWidth || 0) * zoomLevel}px ${(imgRef.current?.offsetHeight || 0) * zoomLevel}px`,
            
            // 5. BACKGROUND POSITION (The Fix)
            // Even though the Glass moved UP, we want the image inside to show the point at `cursorPos`.
            // So we DO NOT add the offset here. The math remains standard.
            backgroundPositionX: `${-cursorPos.x * zoomLevel + glassSize / 2}px`,
            backgroundPositionY: `${-cursorPos.y * zoomLevel + glassSize / 2}px` 
          }}
        />
      )}
    </div>
  );
};

export default MagicZoomClone;