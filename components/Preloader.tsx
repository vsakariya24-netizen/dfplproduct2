import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Package, Truck, Sparkles } from 'lucide-react';

const LOADING_STEPS = [
  { text: "Initializing Systems...", icon: Settings },
  { text: "Forging High-Tensile Steel...", icon: Sparkles },
  { text: "Calibrating Dimensions...", icon: Settings },
  { text: "Quality Assurance Check...", icon: ShieldCheck },
  { text: "Preparing Catalogue...", icon: Package },
];

const Preloader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // हर 800ms में टेक्स्ट बदलेगा, जिससे यूजर engage रहेगा
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : 0));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = LOADING_STEPS[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0F1115] flex flex-col items-center justify-center font-sans">
      
      {/* 1. ANIMATED ICON CONTAINER */}
      <div className="relative mb-8">
        {/* Spinning Outer Ring */}
        <div className="w-24 h-24 border-4 border-white/10 border-t-brand-yellow rounded-full animate-spin"></div>
        
        {/* Center Icon (Changing) */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <CurrentIcon size={32} className="animate-pulse text-brand-yellow" />
        </div>
      </div>

      {/* 2. DYNAMIC TEXT (The Distraction) */}
      <div className="h-10 text-center">
        <h3 className="text-2xl font-bold text-white tracking-widest uppercase animate-pulse">
          {LOADING_STEPS[currentStep].text}
        </h3>
      </div>

      {/* 3. PROGRESS BAR */}
      <div className="mt-8 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-brand-yellow animate-loading-bar w-full origin-left scale-x-0"></div>
      </div>

      {/* 4. BRANDING */}
      <p className="absolute bottom-10 text-gray-500 text-xs tracking-[0.3em] uppercase">
        Durable Fastener System
      </p>

      {/* CSS for custom animation defined below */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-loading-bar {
          animation: loading-bar 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Preloader;