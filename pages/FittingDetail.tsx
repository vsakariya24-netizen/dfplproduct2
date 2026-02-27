import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, ChevronRight, Maximize2, X, 
  Palette, Tag, Share2, Printer, Hash, 
  FileCheck, Activity, Check, CheckCircle2, 
  MousePointer2, Sparkles, AlertCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const THEME = {
  bg: "bg-[#dbdbdc]", 
  textPrimary: "text-neutral-900",      
  textSecondary: "text-neutral-700",   
};

const fontHeading = { fontFamily: '"Oswald", sans-serif', letterSpacing: '0.05em' };
const fontBody = { fontFamily: '"Roboto", sans-serif' };

// Helper to get CSS classes for finish colors
const getColorClass = (colorName: string) => {
  const c = colorName.toLowerCase().trim();
  if (c.includes('ivory')) return 'bg-[#FFFFF0] border-neutral-300';
  if (c.includes('white')) return 'bg-white border-neutral-200';
  if (c.includes('black')) return 'bg-neutral-900 border-neutral-900';
  if (c.includes('brown')) return 'bg-[#5D4037] border-[#3E2723]';
  if (c.includes('brass') || c.includes('gold') || c.includes('antique')) return 'bg-amber-400 border-amber-500';
  if (c.includes('zinc') || c.includes('silver') || c.includes('chrome') || c.includes('ss')) return 'bg-neutral-300 border-neutral-400';
  return 'bg-neutral-200 border-neutral-300';
};

const FittingDetail = ({ product }: { product: any }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [displayImage, setDisplayImage] = useState('');
  
  // Selection State
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);

  // --- DATA PARSING ---
  const images = useMemo(() => product?.images?.length > 0 ? product.images : ['https://via.placeholder.com/600x600?text=No+Image'], [product?.images]);
  const specs = product?.specifications || [];
  const packing = specs.find((s: any) => s.key === 'Standard Packing')?.value || 'Standard Export';
  const generalNames = specs.find((s: any) => s.key === 'General Names')?.value?.split(',').map((s:string) => s.trim()) || [];
  const materials = product?.material ? product.material.split(/\|/).map((s: string) => s.trim()) : ['Standard'];

  // 1. Get All Sizes available
  const availableSizes = useMemo(() => {
    if (!product?.variants) return [];
    // Extract unique diameters/lengths
    const sizes = new Set(product.variants.map((v:any) => v.diameter || v.length).filter(Boolean));
    return Array.from(sizes);
  }, [product]);

  // 2. Get Finishes SPECIFIC to the selected size
  const availableFinishesForSize = useMemo(() => {
    if (!product?.variants || !selectedSizeLabel) return [];
    
    // Return unique finish names for this size
    const finishes = new Set(
        product.variants
        .filter((v: any) => (v.diameter === selectedSizeLabel || v.length === selectedSizeLabel) && v.finish)
        .map((v: any) => v.finish)
    );
    return Array.from(finishes);
  }, [product, selectedSizeLabel]);

  // --- AUTO-SELECT LOGIC ---
  useEffect(() => {
    if (product) {
        // Initial load: Set main image
        if (images.length > 0 && !displayImage) {
            setDisplayImage(images[0]);
        }

        // Auto-Select First Size if none selected
        if (availableSizes.length > 0 && !selectedSizeLabel) {
            const firstSize = availableSizes[0] as string;
            setSelectedSizeLabel(firstSize);
        }
    }
  }, [product, availableSizes, images]);

  // --- IMAGE UPDATE LOGIC (CRITICAL FIX) ---
  useEffect(() => {
      if (selectedSizeLabel && selectedFinish) {
          // Find the SPECIFIC variant object that matches both size and finish
          const specificVariant = product?.variants?.find((v: any) => 
              (v.diameter === selectedSizeLabel || v.length === selectedSizeLabel) && 
              v.finish === selectedFinish
          );

          if (specificVariant && specificVariant.image) {
              // 1. Priority: Variant Specific Image
              setDisplayImage(specificVariant.image);
          } else if (product.finish_images?.[selectedFinish]) {
              // 2. Fallback: Global Finish Map (Old Logic)
              setDisplayImage(product.finish_images[selectedFinish]);
          }
      }
  }, [selectedSizeLabel, selectedFinish, product]);

  // When Size changes, validate current finish
  useEffect(() => {
      if (selectedSizeLabel && availableFinishesForSize.length > 0) {
          // If previously selected finish is not valid for this new size, switch to first valid finish
          // OR if no finish is selected yet, pick the first one
          if (!selectedFinish || !availableFinishesForSize.includes(selectedFinish)) {
              const newDefaultFinish = availableFinishesForSize[0] as string;
              setSelectedFinish(newDefaultFinish);
          }
      } else if (selectedSizeLabel && availableFinishesForSize.length === 0) {
          // Size exists but no specific finishes listed (Generic)
          setSelectedFinish(null);
      }
  }, [selectedSizeLabel, availableFinishesForSize]);


  // --- HANDLERS ---
  const handleSizeClick = (label: string) => {
    setSelectedSizeLabel(label);
  };

  const handleFinishClick = (finish: string) => {
    setSelectedFinish(finish);
    setActiveImageIndex(-1); // Reset gallery selection highlight
  };

  const containerVar = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVar = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className={`${THEME.bg} min-h-screen pb-24 pt-[110px] md:pt-[150px] font-sans`} style={fontBody}>
      <Helmet><title>{product ? `${product.name} | CLASSONE` : 'Product Details'}</title></Helmet>

      {/* --- BREADCRUMB --- */}
     <div className="fixed top-[80px] md:top-[140px] left-0 w-full z-30 bg-neutral-900 border-b border-neutral-800 shadow-md transition-all duration-300">
       <div className="max-w-7xl mx-auto px-5 py-10"> {/* Reduced py-3 to py-2.5 for sleek look */}
         <nav className="flex items-center gap-2 text-[13px] md:text-[14px] font-medium tracking-wide">
           {/* Home Link */}
           <Link to="/" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
             Home
           </Link>
           
           <ChevronRight size={12} className="text-neutral-600" />
           
           {/* Products Link */}
           <Link to="/products" className="text-neutral-400 hover:text-white transition-colors">
             Products
           </Link>
           
           <ChevronRight size={12} className="text-neutral-600" />
           
           {/* Active Page Name */}
           <span className="text-yellow-500 font-bold uppercase tracking-wider text-xs md:text-sm truncate max-w-[180px] md:max-w-none">
             {product.name}
           </span>
         </nav>
       </div>
       </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* --- HEADER --- */}
        <motion.div variants={containerVar} initial="hidden" animate="visible" className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                    <motion.div variants={itemVar} className="flex items-center gap-3 mb-16">
                        {generalNames.slice(0, 3).map((tag: string, i: number) => (
                            <span key={i} className="text-neutral-600 text-[11px] font-bold tracking-wider px-2 py-1 bg-white rounded border border-neutral-200 uppercase">{tag}</span>
                        ))}
                    </motion.div>
                    <motion.h1 variants={itemVar} className={`text-4xl md:text-5xl lg:text-6xl font-semibold ${THEME.textPrimary} uppercase`} style={fontHeading}>
                        {product?.name}
                    </motion.h1>
                </div>
                <motion.div variants={itemVar} className="flex gap-3">
                    <button className="p-3 bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50 shadow-sm"><Share2 size={20} /></button>
                    <button onClick={() => window.print()} className="p-3 bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50 shadow-sm"><Printer size={20} /></button>
                </motion.div>
            </div>
            <motion.div variants={itemVar} className="flex items-start gap-5 mt-6 border-l-4 border-yellow-500 pl-6">
                 <p className={`${THEME.textSecondary} text-lg font-normal leading-relaxed max-w-4xl`}>
                    {product?.short_description || "High-performance hardware solutions engineered for precision and durability."}
                 </p>
            </motion.div>
        </motion.div>

        <div className="flex flex-col-reverse md:flex-row gap-6 items-start justify-center">
            {/* THUMBNAILS (Gallery) */}
            <div className="hidden md:flex flex-col gap-3 sticky top-40 w-24">
                {images.map((img: string, idx: number) => (
                    <button key={idx} 
                        onClick={() => { setActiveImageIndex(idx); setDisplayImage(img); }} 
                        className={`relative w-full aspect-square rounded-xl overflow-hidden bg-white border transition-all ${activeImageIndex === idx ? 'ring-2 ring-yellow-500 shadow-md' : 'opacity-60 border-neutral-200'}`}
                    >
                        <img src={img} className="w-full h-full object-contain p-1" alt="" />
                    </button>
                ))}
            </div>

            {/* MAIN IMAGE DISPLAY */}
            <div className="flex-1 w-full max-w-5xl flex flex-col gap-8">
                <div className="relative bg-white border border-neutral-200 rounded-3xl p-10 min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden group shadow-sm">
                      <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-yellow-500/10 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-500/20 animate-pulse">
                          <Sparkles size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Interactive Preview</span>
                      </div>
                      <div className="absolute top-4 right-4 z-20">
                          <button onClick={() => setShowFullScreen(true)} className="p-2 bg-white/50 backdrop-blur rounded-full border border-neutral-200/50 hover:bg-white transition-all"><Maximize2 size={20} /></button>
                      </div>
                      <motion.img 
                        key={displayImage} // Key triggers animation on change
                        initial={{ opacity: 0.8, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.4 }} 
                        src={displayImage} 
                        className="max-h-full max-w-full object-contain drop-shadow-lg" 
                      />
                </div>

                {/* CONFIGURATOR CONTROLS */}
                <div className="flex flex-col gap-8 px-1">
                    
                    {/* 1. SIZE SELECTION (Primary) */}
                    {availableSizes.length > 0 && (
                      <div className="bg-[#e8e8e8] p-6 rounded-sm border border-neutral-200/50">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2">
                            <Tag size={16} className="text-[#8b7e6d]"/> 
                            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#8b7e6d]">1. Select Size</h3>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2.5">
                          {availableSizes.map((label: any) => {
                            const isSelected = selectedSizeLabel === label;
                            return (
                                <div key={label} className="relative">
                                    <button 
                                        onClick={() => handleSizeClick(label)} 
                                        className={`relative min-w-[105px] py-4 px-6 text-sm font-black transition-all duration-200 border ${
                                            isSelected 
                                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xl transform -translate-y-1' 
                                            : 'bg-white text-neutral-800 border-transparent hover:bg-neutral-50'
                                        }`} 
                                        style={fontHeading}
                                    >
                                        {label}
                                    </button>
                                    {isSelected && (
                                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-neutral-900"></div>
                                    )}
                                </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 2. FINISH SELECTION (Dependent on Size) */}
                    {selectedSizeLabel && (
                        <div className="relative animate-in fade-in slide-in-from-top-4 duration-500">
                            {availableFinishesForSize.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Palette size={18} className="text-yellow-600"/> 
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-800" style={fontHeading}>2. Select Finish (For {selectedSizeLabel})</h3>
                                        </div>
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase italic flex items-center gap-1">
                                            <MousePointer2 size={10} /> Updates Preview
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {availableFinishesForSize.map((f: any) => (
                                            <button 
                                                key={f} 
                                                onClick={() => handleFinishClick(f)} 
                                                className={`group relative flex items-center gap-3 p-3 rounded-xl border bg-white transition-all ${selectedFinish === f ? 'border-yellow-500 ring-2 ring-yellow-500 shadow-lg scale-[1.02]' : 'border-neutral-200 hover:border-neutral-300'}`}
                                            >
                                                <span className={`w-8 h-8 rounded-full border shadow-inner ${getColorClass(f)}`}></span>
                                                <div className="text-left">
                                                    <span className={`block text-xs font-bold uppercase ${selectedFinish === f ? 'text-neutral-900' : 'text-neutral-500'}`}>{f}</span>
                                                    {selectedFinish === f && <span className="text-[9px] text-yellow-600 font-bold">Active</span>}
                                                </div>
                                                {selectedFinish === f && <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1 shadow-sm"><CheckCircle2 size={14} /></div>}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800">
                                    <AlertCircle size={20}/>
                                    <span className="text-sm font-bold">Standard Finish only for size {selectedSizeLabel}.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* --- TECH SPECS TABLE --- */}
      <section className="bg-neutral-50 border-t border-neutral-200 py-16 mt-20">
          <div className="max-w-7xl mx-auto px-4">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               {/* Material Box */}
               <div className="lg:col-span-4">
                 <div className="bg-neutral-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                        <FileCheck className="text-yellow-500" size={20} />
                        <h4 className="text-sm font-bold uppercase tracking-widest" style={fontHeading}>Material Spec</h4>
                    </div>
                    <div className="space-y-6">
                        {materials.map((m, i) => (
                             <div key={i} className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Material</span>
                                <span className="text-lg font-bold text-white">{m}</span>
                             </div>
                        ))}
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Packing</span>
                            <span className="text-lg font-bold text-white">{packing}</span>
                         </div>
                    </div>
                 </div>
               </div>

               {/* Table */}
               <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
                   <table className="w-full text-left">
                       <thead>
                           <tr className="bg-neutral-50">
                               <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest">Size</th>
                               <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest">Finish</th>
                               
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-neutral-50">
                           {product?.variants?.map((v:any, i:number) => (
                               <tr key={i} className={selectedSizeLabel === (v.length || v.diameter) ? "bg-yellow-50" : ""}>
                                   <td className="px-8 py-4 font-bold text-neutral-700">{v.length || v.diameter}</td>
                                   <td className="px-8 py-4 text-neutral-600">{v.finish || "Standard"}</td>
                                  
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
             </div>
          </div>
      </section>

      <AnimatePresence>
        {showFullScreen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setShowFullScreen(false)}>
              <button className="absolute top-6 right-6 p-4 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"><X size={24}/></button>
              <img src={displayImage} className="max-h-[85vh] max-w-[90vw] object-contain drop-shadow-2xl" alt="Product enlarged" />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FittingDetail;