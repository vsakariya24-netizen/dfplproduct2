import React, { useState, useEffect } from 'react';
import { Settings, Zap, CheckCircle2 } from 'lucide-react';

// --- CONFIGURATION ---
// We explicitly type this as 'string' to stop the TypeScript error
const LOADER_STYLE: string = 'IMPACT_DRIVER'; 

const CreativeLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const loadingTexts = [
    "Initializing Production Line...",
    "Calibrating Dimensions...",
    "Forging High-Tensile Steel...",
    "Applying Zinc Coating...",
    "Quality Assurance Check...",
    "Ready for Dispatch."
  ];

  // Simulation Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1; 
      });
    }, 30); 

    return () => clearInterval(timer);
  }, []);

  // Text Rotation Logic
  useEffect(() => {
    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 600);
    return () => clearInterval(textTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0F1115] flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* 1. IMPACT DRIVER STYLE */}
      {LOADER_STYLE === 'IMPACT_DRIVER' && (
        <div className="relative mb-12 scale-125">
          {/* Torque Ring */}
          <div className="w-32 h-32 rounded-full border-4 border-gray-800 flex items-center justify-center relative shadow-[0_0_40px_rgba(250,204,21,0.2)]">
            <svg className="absolute inset-0 transform -rotate-90 w-full h-full p-1">
              <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
              <circle cx="60" cy="60" r="54" stroke="#FACC15" strokeWidth="4" fill="transparent"
                strokeDasharray={340} strokeDashoffset={340 - (340 * progress) / 100}
                strokeLinecap="round" className="transition-all duration-75 ease-out" />
            </svg>
            
            {/* Spinning Screw Head */}
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center animate-spin-impact shadow-inner">
               <div className="relative w-full h-full">
                  {/* Phillips Head Cross */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-2 bg-[#0F1115]/80 shadow-inner rounded-sm"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-10 bg-[#0F1115]/80 shadow-inner rounded-sm"></div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LASER SCAN STYLE */}
      {LOADER_STYLE === 'LASER_SCAN' && (
        <div className="relative mb-10 w-64 h-64 flex items-center justify-center border border-gray-800 bg-gray-900/50 rounded-xl overflow-hidden">
           {/* Grid Background */}
           <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(250,204,21,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(250,204,21,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
           
           {/* The Screw SVG */}
           <svg width="60" height="120" viewBox="0 0 60 120" className="drop-shadow-2xl z-10">
              <path d="M10 10 L 50 10 L 50 30 L 10 30 Z" fill="#4B5563" />
              <rect x="20" y="30" width="20" height="80" fill="#6B7280" />
              <path d="M20 40 L 40 50 M20 60 L 40 70 M20 80 L 40 90" stroke="#374151" strokeWidth="2" />
           </svg>

           {/* Laser Line */}
           <div className="absolute top-0 w-full h-0.5 bg-yellow-400 shadow-[0_0_15px_#FACC15] animate-laser-scan z-20"></div>
           
           {/* Scan Data Text */}
           <div className="absolute bottom-2 left-2 text-[10px] text-yellow-500 font-mono">
             DIMS: {(progress * 0.45).toFixed(2)}mm <br/>
             TOL: ±0.01
           </div>
        </div>
      )}

      {/* 3. TEXT & DATA DISPLAY */}
      <div className="z-10 flex flex-col items-center space-y-4">
        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tighter tabular-nums">
          {Math.round(progress)}<span className="text-yellow-400 text-3xl">%</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-400 h-8">
          <Settings size={18} className="text-yellow-400 animate-spin-slow" />
          <span className="uppercase tracking-[0.2em] text-xs font-bold text-yellow-100/80 w-64 text-center">
            {loadingTexts[textIndex]}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin-impact {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(90deg); }
          40% { transform: rotate(90deg); } 
          60% { transform: rotate(180deg); }
          80% { transform: rotate(270deg); } 
          100% { transform: rotate(360deg); }
        }
        .animate-spin-impact {
          animation: spin-impact 1s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }
        
        @keyframes laser-scan {
          0%, 100% { top: 10%; opacity: 0.5; }
          50% { top: 90%; opacity: 1; }
        }
        .animate-laser-scan {
          animation: laser-scan 1.5s linear infinite;
        }

        .animate-spin-slow {
            animation: spin 3s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CreativeLoader;