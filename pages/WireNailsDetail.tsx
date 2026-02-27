import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Hammer, Grid, Wrench, ChevronRight, ShoppingCart, Loader2, Share2, Printer, 
  Ruler, Maximize2, FileCheck, Layers, ShieldCheck, Activity, ArrowUpRight, X, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicZoomClone from '../components/MagicZoomClone'; 
import { Helmet } from 'react-helmet-async';

const { useParams, Link } = ReactRouterDOM;

// --- THEME & FONTS (Matching your existing brand) ---
const THEME = {
  bg: "bg-[#dbdbdc]", 
  textPrimary: "text-neutral-900", 
  accent: "bg-yellow-500",
  border: "border-neutral-200",
};

const fontHeading = { fontFamily: '"Oswald", sans-serif', letterSpacing: '0.03em' };
const fontMono = { fontFamily: '"Roboto Mono", monospace' };

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className={`flex items-center gap-2.5 mb-5 border-b ${THEME.border} pb-3`}>
    <Icon size={20} className="text-yellow-600" />
    <span className={`text-lg font-bold uppercase tracking-wide text-neutral-900`} style={fontHeading}>
      {title}
    </span>
  </div>
);

const WireNailsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // States for Wire Nails
  const [selectedGauge, setSelectedGauge] = useState<string>('12');
  const [selectedLen, setSelectedLen] = useState<string>('1.5');
  const [headType, setHeadType] = useState<'with' | 'without'>('with');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Your specific Wire Nail Matrix
  const nailMatrix: Record<string, string[]> = {
    "8": ["2", "2.5", "3", "4", "5"],
    "10": ["2", "2.5", "3", "4"],
    "12": ["1", "1.25", "1.5", "2"],
    "14": ["1", "1.25", "1.5", "2"],
    "17": ["0.75", "1", "1.25", "1.5"],
    "18": ["0.75", "1", "1.25"],
    "19": ["0.75", "1", "1.25"],
    "20": ["0.75", "1", "1.25"]
  };

  const gauges = Object.keys(nailMatrix).sort((a, b) => parseInt(a) - parseInt(b));

  useEffect(() => {
    // Simulate fetching or actual fetch from Supabase
    setLoading(false);
    setProduct({
        name: "Premium Wire Nails",
        short_description: "Industrial grade mild steel wire nails with sharp diamond points and consistent gauge accuracy. Available in Polished and GI finishes.",
        images: [
            "https://durablefastener.com/images/wire-nails-with-head.jpg", // Photo 1: With Head
            "https://durablefastener.com/images/wire-nails-without-head.jpg" // Photo 2: Without Head
        ]
    });
  }, [slug]);

  // Update length when gauge changes
  useEffect(() => {
    if (nailMatrix[selectedGauge]) {
        setSelectedLen(nailMatrix[selectedGauge][0]);
    }
  }, [selectedGauge]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#dbdbdc]"><Loader2 className="animate-spin text-yellow-500" size={48} /></div>;

  return (
    <div className="bg-[#dbdbdc] min-h-screen pb-24 pt-[140px] md:pt-[200px]">
      <Helmet>
        <title>Wire Nails Manufacturer Rajkot | Durable Fastener</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">
        {/* --- HEADER --- */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
             <span className="px-3 py-1 rounded bg-yellow-100 border border-yellow-200 text-yellow-900 text-[12px] font-bold uppercase tracking-widest">Construction Series</span>
             <span className="text-neutral-600 text-[12px] font-mono font-bold tracking-wider px-2 py-1 bg-white rounded border border-neutral-200">IS:723 COMPLIANT</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold uppercase" style={fontHeading}>{product.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- LEFT: DUAL PHOTO VIEW --- */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-200 relative overflow-hidden group">
               {/* Visual Indicator for Head Type */}
               <div className="absolute top-6 right-6 z-20 flex gap-2">
                    <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tighter flex items-center gap-2 ${headType === 'with' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-400'}`}>
                        {headType === 'with' ? <Eye size={14}/> : <EyeOff size={14}/>} Full Head
                    </div>
               </div>

               <AnimatePresence mode="wait">
                  <motion.div 
                    key={headType}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="aspect-square flex items-center justify-center"
                  >
                    <MagicZoomClone 
                        src={headType === 'with' ? product.images[0] : product.images[1]} 
                        alt="Wire Nail Type"
                        glassSize={250}
                    />
                  </motion.div>
               </AnimatePresence>

               <div className="mt-8 grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setHeadType('with')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${headType === 'with' ? 'border-yellow-500 bg-yellow-50' : 'border-neutral-100 hover:border-neutral-300'}`}
                  >
                    <span className="font-bold text-sm uppercase" style={fontHeading}>With Head</span>
                    <span className="text-[10px] text-neutral-500 uppercase">Common Nails</span>
                  </button>
                  <button 
                    onClick={() => setHeadType('without')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${headType === 'without' ? 'border-yellow-500 bg-yellow-50' : 'border-neutral-100 hover:border-neutral-300'}`}
                  >
                    <span className="font-bold text-sm uppercase" style={fontHeading}>Without Head</span>
                    <span className="text-[10px] text-neutral-500 uppercase">Lost Head / Brad</span>
                  </button>
               </div>
            </div>
          </div>

          {/* --- RIGHT: CONFIGURATOR --- */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-neutral-200">
              
              {/* GAUGE SELECTION */}
              <div className="mb-10">
                <SectionHeader icon={Ruler} title="Select Gauge (SWG)" />
                <div className="grid grid-cols-4 gap-3">
                  {gauges.map(g => (
                    <button 
                        key={g}
                        onClick={() => setSelectedGauge(g)}
                        className={`py-3 rounded-lg border-2 font-mono font-bold transition-all ${selectedGauge === g ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-neutral-50 border-neutral-100 text-neutral-600'}`}
                    >
                        {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* LENGTH SELECTION */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4 border-b pb-2">
                    <SectionHeader icon={Maximize2} title="Length (Inches)" />
                    <span className="text-4xl font-bold text-neutral-900" style={fontHeading}>{selectedLen}"</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {nailMatrix[selectedGauge]?.map(l => (
                    <button 
                        key={l}
                        onClick={() => setSelectedLen(l)}
                        className={`px-6 py-2 rounded-full border-2 text-sm font-bold transition-all ${selectedLen === l ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-500'}`}
                    >
                        {l}"
                    </button>
                  ))}
                </div>
              </div>

              {/* BULK ACTION */}
              <div className="grid grid-cols-2 gap-4">
                  <button className="col-span-2 bg-yellow-500 h-16 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-yellow-400 transition-all" style={fontHeading}>
                    <ShoppingCart size={20} /> Request Factory Quote
                  </button>
              </div>

            </div>

            {/* QUICK SPECS TABLE */}
            <div className="bg-neutral-900 text-white p-8 rounded-3xl shadow-xl">
                <h4 className="text-yellow-500 font-bold uppercase mb-4" style={fontHeading}>Product Summary</h4>
                <div className="space-y-4 text-sm font-mono">
                    <div className="flex justify-between border-b border-neutral-800 pb-2">
                        <span className="text-neutral-500">HEAD TYPE</span>
                        <span>{headType === 'with' ? 'CHECKERED FLAT' : 'LOST HEAD'}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-800 pb-2">
                        <span className="text-neutral-500">POINT</span>
                        <span>DIAMOND SHARP</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-800 pb-2">
                        <span className="text-neutral-500">MATERIAL</span>
                        <span>LOW CARBON STEEL</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WireNailsDetail;