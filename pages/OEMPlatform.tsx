import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  motion, useMotionValue, useTransform, useSpring, AnimatePresence 
} from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, Flame, Droplets, 
  Layers, ShieldCheck, Database, Microscope, FlaskConical, 
  Ruler, Settings, Image as ImageIcon, Download, Phone, Component, Crosshair, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// =========================================
// 1. UTILITY COMPONENTS
// =========================================

// Scroll Reveal Wrapper
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
// Custom Screw Icon based on your uploaded image
const CustomScrew: React.FC<{ size?: number; className?: string }> = ({ size = 80, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    className={className}
  >
    {/* Head: Rounded Pan Head */}
    <path d="M6 6C6 3.5 8.5 2 12 2C15.5 2 18 3.5 18 6V8H6V6Z" />
    
    {/* Body: Shaft with Pointed Tip */}
    <path d="M9 8V19L12 22L15 19V8H9ZM15 10.5L9 9V10L15 11.5V10.5ZM15 13.5L9 12V13L15 14.5V13.5ZM15 16.5L9 15V16L15 17.5V16.5Z" />
  </svg>
);

const RulerTicks = () => (
  <div className="flex justify-between w-full mt-2 px-1">
    {[...Array(21)].map((_, i) => (
      <div 
        key={i} 
        className={`w-px ${i % 5 === 0 ? 'h-4 bg-slate-400' : 'h-2 bg-slate-700'}`} 
      />
    ))}
  </div>
);

// 3D Parallax Card
const TiltedCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative h-full"
    >
      {children}
    </motion.div>
  );
};

// =========================================
// 2. REUSABLE PROTOCOL COMPONENT
// =========================================

interface ProtocolProps {
  theme: 'amber' | 'emerald' | 'blue' | 'violet';
  title: React.ReactNode;
  subtitle: string;
  icon: any;
  steps: string[];
}

const colorMap = {
  amber: {
    bg: 'bg-black',
    glow: 'from-amber-900/10 via-black to-black',
    accent: 'text-amber-500',
    border: 'border-amber-500/30',
    bgIcon: 'bg-amber-500/5',
    scanLine: 'bg-amber-500 shadow-[0_0_15px_#f59e0b]',
    stepBg: 'bg-amber-900/10 border-amber-900/30 text-amber-500/80'
  },
  emerald: { 
    bg: 'bg-[#020502]',
    glow: 'from-emerald-900/10 via-black to-black',
    accent: 'text-emerald-500',
    border: 'border-emerald-500/30',
    bgIcon: 'bg-emerald-500/5',
    scanLine: 'bg-emerald-500 shadow-[0_0_15px_#10b981]',
    stepBg: 'bg-emerald-900/10 border-emerald-900/30 text-emerald-500/80'
  },
  blue: { 
    bg: 'bg-[#020305]',
    glow: 'from-blue-900/10 via-black to-black',
    accent: 'text-blue-500',
    border: 'border-blue-500/30',
    bgIcon: 'bg-blue-500/5',
    scanLine: 'bg-blue-500 shadow-[0_0_15px_#3b82f6]',
    stepBg: 'bg-blue-900/10 border-blue-900/30 text-blue-500/80'
  },
  violet: { 
    bg: 'bg-[#050205]',
    glow: 'from-violet-900/10 via-black to-black',
    accent: 'text-violet-500',
    border: 'border-violet-500/30',
    bgIcon: 'bg-violet-500/5',
    scanLine: 'bg-violet-500 shadow-[0_0_15px_#8b5cf6]',
    stepBg: 'bg-violet-900/10 border-violet-900/30 text-violet-500/80'
  }
};

const ProtocolVisualization: React.FC<ProtocolProps> = ({ theme, title, subtitle, icon: Icon, steps }) => {
  const colors = colorMap[theme];

  return (
    <section className={`py-32 relative overflow-hidden ${colors.bg}`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${colors.glow}`}></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <ScrollReveal>
          <div className="inline-block relative mb-8">
            {/* Laser Scanner Animation */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className={`absolute left-0 w-full h-[2px] z-20 ${colors.scanLine}`}
            />
            {/* Central Icon Box */}
            <div className={`w-24 h-24 border ${colors.border} ${colors.bgIcon} rounded-2xl flex items-center justify-center relative overflow-hidden backdrop-blur-sm`}>
               <Icon className={colors.accent} size={40} />
            </div>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={0.2}>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            {title}
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={0.4}>
          <p className="text-xl text-slate-400 leading-relaxed mb-12 font-light max-w-2xl mx-auto">
            {subtitle}
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="flex flex-wrap gap-4 justify-center">
           {steps.map((step, i) => (
             <ScrollReveal key={i} delay={0.4 + (i * 0.1)}>
               <div className={`flex items-center gap-2 text-xs font-mono px-4 py-2 rounded border uppercase tracking-wide ${colors.stepBg}`}>
                 <CheckCircle2 size={12} /> {step}
               </div>
             </ScrollReveal>
           ))}
        </div>
      </div>
    </section>
  );
};


// =========================================
// 3. MAIN OEM PLATFORM PAGE
// =========================================

// --- DEFAULT QUALITY FALLBACK ---
const DEFAULT_QUALITY_STANDARDS = {
  raw_material: {
    title: "Raw Material",
    description: "Zero-scrap policy. 100% sourced from Tata/JSW primary mills.",
    items: [
      { label: "STEEL GRADES", val: "SAE 1010, 1022, 10B21" },
      { label: "STAINLESS", val: "AISI 304, 316L" },
      { label: "WIRE ORIGIN", val: "Primary Mills Only" },
      { label: "STRUCTURE", val: "Spheroidized Annealed" }
    ]
  },
  heat_treatment: {
    title: "Heat Treatment",
    description: "Continuous Mesh Belt Furnace for uniform core hardening.",
    items: [
      { label: "METHOD", val: "Gas Carburizing" },
      { label: "CASE DEPTH", val: "0.05mm - 0.40mm" },
      { label: "CORE HARDNESS", val: "32 - 39 HRC" },
      { label: "SURFACE HARDNESS", val: "Min 550 HV" }
    ]
  },
  surface_finish: {
    title: "Surface Finish",
    description: "High-performance coatings for extreme environment protection.",
    items: [
      { label: "PLATING", val: "Zinc (Blue/Yel/Blk)" },
      { label: "HIGH PERF.", val: "Ruspert / Geomet" },
      { label: "SST LIFE", val: "72Hrs - 1000Hrs" },
      { label: "HYDROGEN", val: "De-Embrittled" }
    ]
  }
};

const OEMPlatform: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // --- ISO & TECHNICAL STANDARDS MAPPING ---
  const TECHNICAL_STANDARDS: Record<string, { std: string; label: string }> = {
    // HEAD STYLES
    "HEXAGON": { std: "ISO 4014 / 4017", label: "STRUCTURAL" },
    "PAN HEAD": { std: "ISO 7045", label: "GENERAL PURPOSE" },
    "COUNTERSUNK": { std: "ISO 7046", label: "FLUSH MOUNT" },
    "TRUSS": { std: "JIS B 1111", label: "WIDE BEARING" }, 
    "BUTTON": { std: "ISO 7380", label: "SAFETY PROFILE" },
    "SOCKET CAP": { std: "ISO 4762", label: "HIGH TENSILE" },
    "FLANGE": { std: "ISO 4161", label: "NON-SLIP" },
    "BUGLE": { std: "ISO 15481", label: "DRYWALL/WOOD" },
    
    // DRIVE SYSTEMS
    "PHILLIPS": { std: "ISO 7045-H", label: "TYPE H" },
    "TORX / STAR": { std: "ISO 10664", label: "HIGH TORQUE" },
    "ALLEN / HEX": { std: "ISO 2936", label: "INTERNAL DRV" },
    "SLOTTED": { std: "ISO 1207", label: "TRADITIONAL" },
    "SQUARE": { std: "ASME B18.6", label: "NO CAM-OUT" },
    "POZI": { std: "ISO 7048-Z", label: "TYPE Z" },
    "TRI-WING": { std: "NAS 4000", label: "AEROSPACE" },
    "ONE-WAY": { std: "SECURITY", label: "TAMPER PROOF" }
  };

  const getStandard = (name: string, type: 'head' | 'drive') => {
    const key = name ? name.toUpperCase().trim() : "";
    return TECHNICAL_STANDARDS[key] || { 
      std: type === 'head' ? "ISO STD" : "HIGH TORQUE", 
      label: "STANDARD" 
    };
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data } = await supabase.from('oem_content').select('*').single();
      if (data) setContent(data);
    } catch (error) {
      console.error("Error fetching OEM content", error);
    } finally {
      setLoading(false);
    }
  };

  // --- DATA CLEANING UTILS ---
  const getCleanData = (input: any) => {
    let clean = { name: '', img: '' };
    const unwrap = (val: any): any => {
      if (typeof val === 'string' && val.trim().startsWith('{')) {
        try { return unwrap(JSON.parse(val)); } catch { return val; }
      }
      return val;
    };
    const unwrappedInput = unwrap(input);
    if (typeof unwrappedInput === 'object' && unwrappedInput !== null) {
      clean.name = unwrappedInput.name || '';
      clean.img = unwrappedInput.img || '';
      // Also handle nested structure if needed
      if (typeof clean.name === 'string' && clean.name.startsWith('{')) {
          const nested = unwrap(clean.name);
          if (nested.name) clean.name = nested.name;
          if (nested.img) clean.img = nested.img;
      }
    } else {
      clean.name = String(unwrappedInput);
    }
    return clean;
  };

  const specs = content?.technical_specs || {};
  const liveHeadStyles = content?.head_styles || [];
  const liveDriveSystems = content?.drive_systems || [];
  const liveThreading = content?.threading_types || [];
  const liveSurfaces = content?.surface_finishes || [];
  const quality = content?.quality_standards || DEFAULT_QUALITY_STANDARDS;

  if (loading) return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center">
       <div className="relative">
         <div className="w-20 h-20 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center font-mono text-blue-500 text-xs animate-pulse">LOADING</div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030305] text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      <Helmet>
  {/* Primary SEO */}
  <title>OEM Fastener Manufacturer in India | Automotive & Industrial Screws – Durable Fastener</title>
  <meta
    name="description"
    content="Durable Fastener is an ISO 9001:2015 certified OEM fastener manufacturer in Rajkot, India. We specialize in custom automotive, industrial, and precision fasteners with global export standards."
  />

  {/* GEO SEO */}
  <meta name="geo.region" content="IN-GJ" />
  <meta name="geo.placename" content="Rajkot, Gujarat, India" />
  <meta name="geo.position" content="22.3039;70.8022" />
  <meta name="ICBM" content="22.3039, 70.8022" />

  {/* AEO / AI Search */}
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow" />

  {/* Open Graph */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="OEM Fastener Manufacturer in India – Durable Fastener" />
  <meta
    property="og:description"
    content="Custom OEM fasteners engineered for automotive, construction, and industrial supply chains. Manufactured in India, supplied globally."
  />
  <meta property="og:url" content="https://durablefastener.com/oem" />
  <meta property="og:site_name" content="Durable Fastener" />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="OEM Fastener Manufacturer | Durable Fastener" />
  <meta name="twitter:description" content="Precision engineered OEM fasteners from India for global industries." />

   <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Manufacturer",
      "@id": "https://durablefastener.com/#manufacturer",
      "name": "Durable Fastener",
      "url": "https://durablefastener.com",
      "logo": "https://durablefastener.com/logo.png",
      "description":
        "Durable Fastener is an ISO certified OEM manufacturer of automotive and industrial fasteners based in Rajkot, India.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Rajkot",
        "addressRegion": "Gujarat",
        "addressCountry": "IN"
      },
      "areaServed": [
        { "@type": "Country", "name": "India" },
        { "@type": "Continent", "name": "Europe" },
        { "@type": "Continent", "name": "Africa" },
        { "@type": "Place", "name": "Middle East" }
      ],
      "knowsAbout": [
        "OEM Fasteners",
        "Automotive Screws",
        "Industrial Bolts",
        "Precision Fasteners",
        "Surface Coating",
        "Heat Treatment"
      ]
    })}
  </script>
  <script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://durablefastener.com/oem#webpage",
  "url": "https://durablefastener.com/oem",
  "name": "OEM Fastener Manufacturer in India",
  "about": {
    "@id": "https://durablefastener.com/#manufacturer"
  }
})}
</script>
</Helmet>

      {/* 1. HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.07]"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030305]/80 to-[#030305]"></div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500/20 bg-blue-500/5 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-mono text-blue-400 tracking-[0.2em] uppercase">
                Rajkot Manufacturing Hub
              </span>
            </div>
          </ScrollReveal>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 leading-none"
          >
            PRECISION <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-white to-blue-500 bg-[length:200%_auto] animate-gradient">
              ENGINEERED.
            </span>
          </motion.h1>

          <ScrollReveal delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light">
             We don't just manufacture fasteners. We engineer reliability for high-precision OEM supply chains across every industry.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/rfq" className="group relative px-8 py-4 bg-blue-600 text-white font-bold rounded-sm overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-shadow">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-2">
                  INITIATE RFQ <ArrowRight size={18} />
                </span>
              </Link>
              <button className="px-8 py-4 border border-white/10 text-slate-300 font-mono text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
                <Download size={18} /> DOWNLOAD BROCHURE
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. TECHNICAL SPECS */}
      <section className="py-32 px-6 relative bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-blue-500"></div>
                <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">
                  Production Capabilities
                </span>
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                TECHNICAL <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-600">
                  BASELINE.
                </span>
              </h3>
            </div>
            
            <div className="flex items-center gap-4 border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-sm">
              <ShieldCheck className="text-emerald-500" size={24} />
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm tracking-wide">ISO 9001:2015</span>
                <span className="text-emerald-500 text-[10px] font-mono uppercase tracking-wider">Certified Facility</span>
              </div>
            </div>
          </div>

          {/* BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* MATERIAL */}
            <div className="md:col-span-5 bg-[#0A0A0C] border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all">
               <div className="flex justify-between items-start mb-6">
                 <div>
                    <span className="text-blue-500 font-mono text-[20px] uppercase tracking-widest mb-1 block">Raw Material</span>
                    <h4 className="text-3xl text-white font-bold font-mono">{specs.material || "Steel & SS"}</h4>
                 </div>
                 <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                    <FlaskConical size={24} />
                 </div>
               </div>
               <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/5">
                     <span className="text-slate-400 text-xs font-mono">GRADE FAMILY</span>
                     <span className="text-white text-xs font-mono font-bold bg-blue-600/20 px-2 py-1 rounded text-blue-300">
                        {specs.material?.includes('SS') ? 'AUSTENITIC' : 'CARBON STEEL'}
                     </span>
                  </div>
                  <div className="space-y-3">
                     <div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                           <span>Fe (Iron)</span>
                           <span>Balance</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-slate-600 w-[85%]"></div>
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                           <span>C (Carbon)</span>
                           <span>0.18 - 0.23%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 w-[35%]"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* DIAMETER */}
            <div className="md:col-span-3 bg-[#0A0A0C] border border-white/10 rounded-xl p-8 flex flex-col justify-between group hover:border-blue-500/30 transition-all relative overflow-hidden">
               <div>
                  <span className="text-blue-500 font-mono text-[20px] uppercase tracking-widest mb-1 block">Cross Section</span>
                  <h4 className="text-3xl text-white font-bold font-mono">{specs.diameter || "M2 - M8"}</h4>
               </div>
               <div className="relative h-32 w-full flex items-center justify-center mt-4">
                  <div className="absolute w-28 h-28 border border-dashed border-slate-600 rounded-full flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                     <span className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-[9px] text-slate-500 font-mono pl-2">M8</span>
                  </div>
                  <div className="absolute w-20 h-20 border border-blue-500/30 bg-blue-500/5 rounded-full flex items-center justify-center"></div>
                  <div className="absolute w-8 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]">
                     <span className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full text-[9px] text-white font-mono pr-2">M2</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                     <div className="w-full h-px bg-blue-400"></div>
                     <div className="h-full w-px bg-blue-400 absolute"></div>
                  </div>
               </div>
            </div>

            {/* LENGTH */}
            <div className="md:col-span-4 bg-[#0A0A0C] border border-white/10 rounded-xl p-8 flex flex-col justify-between group hover:border-blue-500/30 transition-all">
               <div className="flex justify-between items-start">
                  <div>
                     <span className="text-blue-500 font-mono text-[20px] uppercase tracking-widest mb-1 block">Linear Scale</span>
                     <h4 className="text-3xl text-white font-bold font-mono">{specs.length || "4mm - 125mm"}</h4>
                  </div>
                  <Ruler className="text-slate-600 group-hover:text-blue-500 transition-colors" />
               </div>
               <div className="mt-8 relative">
                  <div className="h-1 w-full bg-slate-800 rounded relative">
                     <div className="absolute left-[10%] right-[10%] h-full bg-blue-600 shadow-[0_0_10px_#2563eb]"></div>
                     <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-blue-600 transform -translate-x-1/2">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono">4mm</span>
                     </div>
                     <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-blue-600 transform translate-x-1/2">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono">125mm</span>
                     </div>
                  </div>
                  <RulerTicks />
                  <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-2 px-1">
                     <span>0</span><span>50</span><span>100</span><span>150+</span>
                  </div>
               </div>
            </div>

            {/* THREADS */}
            <div className="md:col-span-5 bg-[#0A0A0C] p-6 group hover:bg-[#0F1115] transition-colors border-t md:border-t-0 border-white/10 relative overflow-hidden">
               <div className="flex items-start justify-between mb-6 relative z-10">
                 <span className="text-blue-500 font-mono text-[20px] uppercase tracking-widest">Threading Spec</span>
                 <Settings className="text-blue-500/50 group-hover:rotate-90 transition-transform duration-700" size={20} />
               </div>
               
               <h4 className="text-2xl font-mono text-white font-medium mb-6 relative z-10">{specs.thread || "Fine, Coarse & Metric"}</h4>
               
               <div className="grid grid-cols-4 gap-2 relative z-10">
                 {liveThreading.length > 0 ? (
                    liveThreading.map((item: any, i: number) => {
                      const { name, img } = getCleanData(item);
                      return (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-lg py-4 px-1 hover:border-blue-500/50 hover:bg-white/10 transition-all group/thread cursor-default relative flex flex-col items-center gap-3">
                           <div className="h-24 w-full flex items-center justify-center overflow-hidden">
                              {img ? (
                                <img src={img} alt={name} className="h-full w-auto object-contain drop-shadow-lg opacity-80 group-hover/thread:opacity-100 transition-opacity" />
                              ) : (
                                <Settings className="text-slate-700 h-10 w-10" />
                              )}
                           </div>
                           <div className="flex flex-col items-center text-center relative z-10">
                             <span className="text-[10px] font-bold text-slate-300 group-hover/thread:text-blue-400 transition-colors tracking-tighter uppercase">{name}</span>
                           </div>
                        </div>
                      )
                    })
                 ) : (
                    <div className="col-span-4 text-center text-slate-500 text-xs py-10">No Thread Data Loaded</div>
                 )}
               </div>
            </div>

            {/* SURFACE */}
            <div className="md:col-span-7 bg-[#0A0A0C] p-8 group border-t md:border-t-0 border-l md:border-l-0 border-white/10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 shadow-[0_0_15px_#2563eb]"></div>
               
               <div className="flex flex-col h-full justify-between relative z-10">
                 <div className="flex items-center justify-between mb-6">
                   <span className="text-blue-500 font-mono text-[20px] uppercase tracking-widest">Surface Engineering</span>
                   <div className="text-right">
                     <span className="text-[10px] text-slate-500 font-mono block">SST LIFE (SALT SPRAY)</span>
                     <span className="text-emerald-400 font-bold font-mono text-lg text-shadow-glow">48-120 HRS</span>
                   </div>
                 </div>

                 <div className="flex flex-wrap gap-3 content-start">
                   {liveSurfaces.length > 0 ? (
                       liveSurfaces.map((finish: any, i: number) => {
                         return (
                           <div key={i} className="group/chip flex items-center gap-3 bg-[#13161C] border border-white/10 rounded-full pl-1.5 pr-5 py-1.5 hover:border-blue-500/40 hover:bg-white/5 transition-all cursor-default">
                             <div 
                               style={{ background: finish.color }}
                               className="w-5 h-5 rounded-full shadow-lg shrink-0 border border-white/10"
                             ></div>
                             <span className="text-slate-300 text-xs font-bold uppercase tracking-wide group-hover/chip:text-white transition-colors">
                               {finish.name}
                             </span>
                           </div>
                         );
                       })
                   ) : (
                       <div className="text-slate-500 text-xs">Loading finishes...</div>
                   )}
                   
                   <div className="flex items-center gap-2 px-4 py-1.5 border border-dashed border-white/20 rounded-full">
                      <span className="text-[10px] text-slate-500 uppercase font-mono">+ Custom Coatings</span>
                   </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
                    <span className="text-[10px] text-slate-600 font-mono">COMPLIANCE:</span>
                    <div className="flex gap-2">
                       <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded flex items-center gap-1">
                         <CheckCircle2 size={10} /> ROHS
                       </span>
                       <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold rounded flex items-center gap-1">
                         <CheckCircle2 size={10} /> REACH
                       </span>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 opacity-50">
             <div className="flex gap-4">
               <span className="text-[10px] text-slate-600 font-mono">REF: MFG-2025-A</span>
             </div>
             <div className="h-px w-32 bg-white/20"></div>
          </div>

          <div className="flex justify-end items-center mt-4 opacity-40">
             <span className="text-[10px] text-slate-500 font-mono mr-2">TOLERANCE SPEC: ISO 4759-1</span>
          </div>

        </div>
     </section>

     {/* 3. CATALOGUE */}
     <section className="py-32 px-6 bg-[#030304] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#030304_70%)] opacity-30"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
               <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.3em] font-bold">Catalogue</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-2">Engineering <span className="text-blue-500">Inventory.</span></h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-20">
            {/* Head Styles */}
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-8 pl-2 border-l-4 border-blue-500">
                  <Database className="text-blue-500" size={24} />
                  <h4 className="text-xl font-bold text-white tracking-widest uppercase">Head Styles</h4>
                </div>
              </ScrollReveal>
              <div className="grid grid-cols-3 gap-8">
                {liveHeadStyles.map((item: any, i: number) => {
                  const { name, img } = getCleanData(item);
                  const info = getStandard(name, 'head');
                  return (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className="h-64 perspective-1000 group">
                        <TiltedCard>
                          <div className="relative h-full w-full bg-[#0B0F17] rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center gap-4 overflow-hidden transition-all duration-500 group-hover:border-blue-500/40 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>
                            <div className="relative z-20 w-32 h-32 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110" style={{ transform: "translateZ(40px)" }}>
                              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                                {img ? <img src={img} alt={name} className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_20px_20px_rgba(59,130,246,0.3)] transition-all duration-300" /> : <Component size={48} className="text-slate-700" />}
                              </motion.div>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-white/5 backdrop-blur-md border-t border-white/5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
                              <div className="text-white font-bold text-sm uppercase tracking-wider">{name}</div>
                              <div className="flex items-center gap-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase scale-0 group-hover:scale-100 transition-transform delay-75">{info.label}</span>
                              </div>
                            </div>
                          </div>
                        </TiltedCard>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>

            {/* Drive Systems */}
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-8 pl-2 border-l-4 border-emerald-500">
                  <Microscope className="text-emerald-500" size={24} />
                  <h4 className="text-xl font-bold text-white tracking-widest uppercase">Drive Systems</h4>
                </div>
              </ScrollReveal>
              <div className="grid grid-cols-3 gap-8">
                {liveDriveSystems.map((item: any, i: number) => {
                  const { name, img } = getCleanData(item);
                  const info = getStandard(name, 'drive');
                  return (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className="h-64 perspective-1000 group">
                        <TiltedCard>
                           <div className="relative h-full w-full bg-[#0B0F17] rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center gap-4 overflow-hidden transition-all duration-500 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>
                            <div className="relative z-20 w-32 h-32 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110" style={{ transform: "translateZ(40px)" }}>
                               <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                                {img ? <img src={img} alt={name} className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_20px_20px_rgba(16,185,129,0.3)] transition-all duration-300" /> : <Microscope size={48} className="text-slate-700" />}
                              </motion.div>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-white/5 backdrop-blur-md border-t border-white/5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
                              <div className="text-white font-bold text-sm uppercase tracking-wider">{name}</div>
                              <div className="flex flex-col items-center mt-1 gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase scale-0 group-hover:scale-100 transition-transform delay-75">{info.label}</span>
                              </div>
                            </div>
                          </div>
                        </TiltedCard>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
     </section>

     {/* =========================================
         4. QUALITY STANDARDS (DYNAMICALLY LOADED)
     ========================================= */}
     <section className="py-32 px-6 bg-[#050505] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <ScrollReveal>
            <div className="mb-20">
              <span className="text-blue-500 font-mono text-sm uppercase tracking-[0.3em] font-bold block mb-4">
                Specification Breakdown
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
                Quality <span className="text-white/40">Standards.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CARD 1: RAW MATERIAL (Blue Theme) */}
            <ScrollReveal delay={0.1}>
              <div className="group h-full bg-[#0A0A0C] border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-white/[0.02] transition-all duration-500 relative overflow-hidden">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                    <Layers size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-white tracking-tight">{quality.raw_material.title}</h3>
                </div>
                <p className="text-slate-200 text-lg leading-relaxed mb-10 border-l-4 border-blue-500 pl-5 font-medium">
                  {quality.raw_material.description}
                </p>
                <div className="space-y-2">
                  {quality.raw_material.items.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 py-4 group/item hover:border-blue-500/50 transition-colors">
                      <span className="text-sm text-slate-400 font-bold tracking-widest uppercase mb-1 sm:mb-0 group-hover/item:text-white transition-colors">{item.label}</span>
                      <span className="text-base text-white font-mono font-bold text-right bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* CARD 2: HEAT TREATMENT (Amber Theme) */}
            <ScrollReveal delay={0.2}>
              <div className="group h-full bg-[#0A0A0C] border border-white/10 rounded-2xl p-8 hover:border-amber-500/50 hover:bg-white/[0.02] transition-all duration-500 relative overflow-hidden">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                    <Flame size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-white tracking-tight">{quality.heat_treatment.title}</h3>
                </div>
                <p className="text-slate-200 text-lg leading-relaxed mb-10 border-l-4 border-amber-500 pl-5 font-medium">
                  {quality.heat_treatment.description}
                </p>
                <div className="space-y-2">
                  {quality.heat_treatment.items.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 py-4 group/item hover:border-amber-500/50 transition-colors">
                      <span className="text-sm text-slate-400 font-bold tracking-widest uppercase mb-1 sm:mb-0 group-hover/item:text-white transition-colors">{item.label}</span>
                      <span className="text-base text-white font-mono font-bold text-right bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* CARD 3: SURFACE FINISH (Emerald Theme) */}
            <ScrollReveal delay={0.3}>
              <div className="group h-full bg-[#0A0A0C] border border-white/10 rounded-2xl p-8 hover:border-emerald-500/50 hover:bg-white/[0.02] transition-all duration-500 relative overflow-hidden">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                    <Droplets size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-white tracking-tight">{quality.surface_finish.title}</h3>
                </div>
                <p className="text-slate-200 text-lg leading-relaxed mb-10 border-l-4 border-emerald-500 pl-5 font-medium">
                  {quality.surface_finish.description}
                </p>
                <div className="space-y-2">
                  {quality.surface_finish.items.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 py-4 group/item hover:border-emerald-500/50 transition-colors">
                      <span className="text-sm text-slate-400 font-bold tracking-widest uppercase mb-1 sm:mb-0 group-hover/item:text-white transition-colors">{item.label}</span>
                      <span className="text-base text-white font-mono font-bold text-right bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
     </section>
     
     {/* 7. THE GOLDEN SAMPLE */}
     <ProtocolVisualization 
        theme="amber" 
        icon={CustomScrew} 
        title={<>The <span className="text-amber-500">Golden Sample</span> Protocol.</>}
        subtitle="We eliminate import risk. You receive a lab-verified pre-production sample. Mass production only starts when you say 'GO'."
        steps={["Drawing Approval", "Lab Testing", "Sample Dispatch", "Mass Production"]}
     />

     {/* 8. FOOTER CTA */}
     <section className="py-24 bg-white text-black relative">
       <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">READY TO <span className="text-blue-600">SCALE?</span></h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <a href="mailto:info@durablefastener.com" className="px-10 py-5 bg-black text-white font-bold rounded-sm hover:scale-105 transition-transform inline-flex items-center gap-3 text-lg shadow-2xl">
               <Phone size={22} /> BOOK ENGINEERING CALL
            </a>
          </ScrollReveal>
       </div>
     </section>

    </div>
  );
};

export default OEMPlatform;