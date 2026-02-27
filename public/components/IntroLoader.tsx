import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- 1. UTILITY ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 2. SVG ICONS (The Screws) ---
const CustomSharpScrew1 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 5L19 5L14 10H10L5 5Z" />
    <path d="M10.5 10H13.5L12 24L10.5 10Z" />
    <path d="M10 12L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 14L10 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 18L14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 20L11 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CustomDrywallScrew = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 4H18V6C18 6 16 8 16 9H8C8 8 6 6 6 6V4Z" />
    <path d="M11 9L13 9L12 23L11 9Z" /> 
    <path d="M10 11L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 14L14 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 17L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 20L13 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CustomSharpScrew = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 5L19 5L14 10H10L5 5Z" />
    <path d="M10.5 10H13.5L12 24L10.5 10Z" />
    <path d="M10 12L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 14L10 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 18L14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 20L11 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// --- 3. MAIN LOADER COMPONENT ---
const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // 1. Show the logo immediately.
    // 2. Wait 2.5 seconds so the user can see the logo.
    const timer = setTimeout(() => {
      setExit(true); // Trigger the fade out animation
      setTimeout(onComplete, 1000); // Tell parent component loading is done
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] overflow-hidden"
      // Handle the exit fade-out
      animate={exit ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-black to-black opacity-50" />

      {/* Main Logo Animation Container */}
      <motion.div 
        className="relative z-40 flex flex-col items-center"
        initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* Glowing Background behind logo */}
        <motion.div 
            className="absolute inset-0 bg-yellow-500 blur-[100px] opacity-20 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
        />
        
        {/* The Logo Image */}
        <img 
            src="/durablefastener.png" 
            alt="Durable Logo" 
            className="w-48 h-48 md:w-80 md:h-80 object-contain relative z-50 drop-shadow-2xl" 
        />
        
        {/* Text Animation */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 text-center"
        >
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
                Durable <span className="text-yellow-500">Fasteners</span>
            </h1>
            <p className="text-xs md:text-sm text-white/50 tracking-[0.5em] mt-2 uppercase font-mono">
                Engineered for Perfection
            </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default IntroLoader;