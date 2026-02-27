import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Hammer, Grid, Armchair, Wrench, ArrowUpRight,
  ChevronRight, ShoppingCart, Loader2, Share2, Printer, 
  Ruler, Maximize2, Info, X, FileText,
  ArrowRight, Lock, Activity, FileCheck, Layers, Hash,
  ShieldCheck, Box, Tag, Settings, Component,
  ChevronDown, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicZoomClone from '../components/MagicZoomClone'; 
import { Helmet } from 'react-helmet-async';

const { useParams, Link } = ReactRouterDOM;

// --- THEME CONSTANTS ---
const THEME = {
  bg: "bg-[#dbdbdc]", 
  sectionBg: "bg-neutral-50",
  textPrimary: "text-neutral-900",     
  textSecondary: "text-neutral-700",  
  textMuted: "text-neutral-500",        
  accent: "bg-yellow-500",            
  accentHover: "hover:bg-yellow-400",
  accentText: "text-yellow-700",
  accentBorder: "border-yellow-500",
  border: "border-neutral-200",        
  surface: "bg-white shadow-sm",
};

// --- FONTS ---
const fontHeading = { fontFamily: '"Oswald", sans-serif', letterSpacing: '0.03em' };
const fontBody = { fontFamily: '"Roboto", sans-serif' };
const fontMono = { fontFamily: '"Roboto Mono", monospace' };

const blueprintGridStyleLight = {
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)',
  backgroundSize: '24px 24px'
};

const PERFORMANCE_KEYS_DISPLAY = [
  "Core Hardness", "Surface Hardness", "Tensile Strength",
  "Shear Strength", "Salt Spray Resistance", "Installation Speed", "Temperature Range"
];

const HIDDEN_SPECS = [
    'hardness', 'sst', 'torque', 'salt', 'box_qty', 'carton_qty', 
    'standard', 'seo_keywords', 'tds_url', 'mtc_url','head type', 'head_type', 'drive', 'drive type', 'drive_type', 'type',
    ...PERFORMANCE_KEYS_DISPLAY.map(s => s.toLowerCase())
];

// --- ANIMATION VARIANTS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};

const itemVar = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 20 } }
};

// --- FAQ COMPONENT ---
interface FaqProps {
  question: string;
  answer: string;
  index: number;
}

const FaqAccordion: React.FC<FaqProps> = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`mb-4 border border-neutral-200 rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen ? 'ring-2 ring-yellow-500 shadow-lg bg-white' : 'bg-neutral-50 hover:bg-neutral-100'
      }`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            isOpen ? 'bg-yellow-500 text-neutral-900' : 'bg-neutral-200 text-neutral-500 group-hover:bg-neutral-300'
          }`}>
            <HelpCircle size={20} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold uppercase tracking-tight text-neutral-900" style={fontHeading}>
            {question}
          </span>
        </div>
        
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`${isOpen ? 'text-yellow-600' : 'text-neutral-400'}`}
        >
          <Settings size={24} className={isOpen ? 'animate-spin-slow' : ''} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-6 pb-8 flex gap-6 relative">
              {/* Technical Sidebar Graphic */}
              <div className="w-1 bg-yellow-500 rounded-full shrink-0" />

              <div className="flex-1">
                {/* WHITESPACE-PRE-WRAP IS THE KEY FIX HERE */}
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {answer}
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
                  <Wrench size={12} /> Tech Verified Answer
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- HEADER COMPONENT ---
const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className={`flex items-center gap-2.5 mb-5 border-b ${THEME.border} pb-3`}>
    <Icon size={20} className="text-yellow-600" />
    <span className={`text-lg font-bold uppercase tracking-wide text-neutral-900`} style={fontHeading}>
      {title}
    </span>
  </div>
);

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // States
  const [selectedDia, setSelectedDia] = useState<string>('');
  const [selectedLen, setSelectedLen] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('mm'); 
  const [selectedType, setSelectedType] = useState<string>(''); 
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeImageOverride, setActiveImageOverride] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [fullScreenAppImage, setFullScreenAppImage] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!slug) throw new Error("No product slug");
        const { data: productData, error } = await supabase.from('products').select('*').eq('slug', slug).single();
        if (error) throw error;

        const { data: vData } = await supabase.from('product_variants').select('*').eq('product_id', productData.id);
        
        const fullProduct = { 
            ...productData, 
            applications: productData.applications || [], 
            variants: vData || [], 
            specifications: productData.specifications || [], 
            dimensional_specifications: productData.dimensional_specifications || [],
            faqs: productData.faqs || []
        };
        
        setProduct(fullProduct);
        
        if (vData && vData.length > 0) {
            const dias = Array.from(new Set(vData.map((v: any) => v.diameter).filter(Boolean))).sort((a:any,b:any) => parseFloat(a)-parseFloat(b));
            if (dias.length > 0) setSelectedDia(dias[0] as string);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProduct();
  }, [slug]);

  // --- DERIVED DATA ---
  const uniqueDiameters = useMemo(() => {
    if (!product?.variants) return [];
    const dias = product.variants.map((v: any) => v.diameter?.toString().trim()).filter(Boolean);
    return Array.from(new Set(dias)).sort((a: any, b: any) => parseFloat(a) - parseFloat(b));
  }, [product]);

  const diameterTitle = useMemo(() => {
    if (!product?.variants || !selectedDia) return "Select Diameter";
    const variant = product.variants.find((v: any) => v.diameter === selectedDia);
    return variant?.diameter_unit === 'gauge' ? "Select Gauge" : "Select Diameter";
  }, [product, selectedDia]);

  const availableLengthOptions = useMemo(() => {
      if (!product?.variants || !selectedDia) return [];
      const filteredVariants = product.variants.filter((v: any) => v.diameter === selectedDia);
      const lengthMap = new Map();
      filteredVariants.forEach((v: any) => {
          if (v.length) {
              const u = v.unit || 'mm'; 
              if (v.length.includes(',')) {
                 v.length.split(',').map((l: string) => l.trim()).forEach((l: string) => {
                     const key = `${l}_${u}`;
                     if (!lengthMap.has(key)) lengthMap.set(key, { value: l, unit: u });
                 });
              } else {
                 const key = `${v.length}_${u}`;
                 if (!lengthMap.has(key)) lengthMap.set(key, { value: v.length, unit: u });
              }
          }
      });
      return Array.from(lengthMap.values()).sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
  }, [product, selectedDia]);

  useEffect(() => {
      if (availableLengthOptions.length > 0) {
          const currentIsValid = availableLengthOptions.some(opt => opt.value === selectedLen && opt.unit === selectedUnit);
          if (!currentIsValid) {
              setSelectedLen(availableLengthOptions[0].value);
              setSelectedUnit(availableLengthOptions[0].unit);
          }
      }
  }, [selectedDia, availableLengthOptions]);

  const availableFinishes = useMemo(() => {
      if (!product?.variants) return [];
      const relevantVariants = product.variants.filter((v: any) => 
         v.diameter === selectedDia && 
         (v.length === selectedLen || (v.length && v.length.includes(selectedLen))) &&
         (v.unit || 'mm') === selectedUnit 
      );
      return Array.from(new Set(relevantVariants.map((v: any) => v.finish).filter(Boolean)));
  }, [product, selectedDia, selectedLen, selectedUnit]);

  const availableTypes = useMemo(() => {
      if (!product?.variants) return [];
      const relevantVariants = product.variants.filter((v: any) => 
        v.diameter === selectedDia && 
        (v.length === selectedLen || (v.length && v.length.includes(selectedLen))) &&
        (v.unit || 'mm') === selectedUnit
      );
      return Array.from(new Set(relevantVariants.map((v: any) => v.type).filter(Boolean)));
  }, [product, selectedDia, selectedLen, selectedUnit]);

  const handleFinishClick = (finish: string) => {
      let imageToUse = null;
      if (product.finish_images && product.finish_images[finish]) {
          imageToUse = product.finish_images[finish];
      } 
      if (!imageToUse && product.variants) {
          const variantMatch = product.variants.find((v: any) => v.finish === finish && v.image);
          if (variantMatch) imageToUse = variantMatch.image;
      }
      if (imageToUse) { 
        setActiveImageOverride(imageToUse); 
        setSelectedImageIndex(0); 
      } else { 
        setActiveImageOverride(null); 
      }
  };

  const handleTypeClick = (type: string) => {
      setSelectedType(type);
      let imageToUse = null;
      if (product.type_images && product.type_images[type]) { 
        imageToUse = product.type_images[type];
      } 
      if (!imageToUse && product.variants) {
         const matchingVariant = product.variants.find((v: any) => 
             v.type === type && 
             v.diameter === selectedDia && 
             (v.image && v.image !== "")
         );
         const genericTypeMatch = !matchingVariant 
            ? product.variants.find((v: any) => v.type === type && v.image)
            : matchingVariant;
         if (genericTypeMatch) imageToUse = genericTypeMatch.image;
      }
      if (imageToUse) {
        setActiveImageOverride(imageToUse);
        setSelectedImageIndex(0);
      } else {
        setActiveImageOverride(null);
      }
  };

  const displayImages = useMemo(() => {
    let images = product?.images || ['https://via.placeholder.com/600x600?text=No+Image'];
    if (activeImageOverride) return [activeImageOverride, ...images];
    return images;
  }, [product, activeImageOverride]);

  if (loading) return <div className={`h-screen flex items-center justify-center ${THEME.bg}`}><Loader2 className="animate-spin text-yellow-500" size={48} /></div>;
  if (!product) return <div className={`min-h-screen flex flex-col items-center justify-center ${THEME.bg}`}><h2 className={`text-3xl font-bold mb-4 ${THEME.textPrimary}`} style={fontHeading}>Product Not Found</h2><Link to="/products" className={THEME.accentText}>Back to Catalog</Link></div>;

  const currentImage = displayImages[selectedImageIndex];
  const standard = product.specifications?.find((s:any) => s.key.toLowerCase() === 'standard')?.value;
  const showDimensions = product.technical_drawing || (product.dimensional_specifications && product.dimensional_specifications.length > 0);
  const displayMaterial = product.material || '';
  const displayHeadType = product.head_type ? product.head_type.replace(/Buggel/gi, 'Bugle') : '';

  return (
    <div className={`${THEME.bg} min-h-screen pb-24 pt-[170px] md:pt-[200px] selection:bg-yellow-500/30 selection:text-black`} style={fontBody}>
      <Helmet>
        <title>{product ? `${product.name} Manufacturer | Durable Fastener Rajkot` : 'Product Details'}</title>
        <meta name="description" content={product ? `Buy ${product.name} directly from factory. ISO certified ${product.category || 'Fastener'} manufacturer in Rajkot, Gujarat. Check specifications and bulk pricing.` : 'Product details'} />
      </Helmet>
      
    <div className="fixed top-[80px] md:top-[170px] left-0 w-full z-30 bg-neutral-900 border-b border-neutral-800 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-5 py-2.5"> 
        <nav className="flex items-center gap-2 text-[13px] md:text-[14px] font-medium tracking-wide">
          <Link to="/" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1">Home</Link>
          <ChevronRight size={12} className="text-neutral-600" />
          <Link to="/products" className="text-neutral-400 hover:text-white transition-colors">Products</Link>
          <ChevronRight size={12} className="text-neutral-600" />
          <span className="text-yellow-500 font-bold uppercase tracking-wider text-xs md:text-sm truncate max-w-[180px] md:max-w-none">{product.name}</span>
        </nav>
      </div>
    </div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        
        {/* --- TITLE BLOCK --- */}
        <motion.div variants={containerVar} initial="hidden" animate="visible" className="mb-10 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                    <motion.div variants={itemVar} className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded bg-yellow-100 border border-yellow-200 text-yellow-900 text-[12px] font-bold uppercase tracking-widest`}>
                            Industrial Series
                        </span>
                        {standard && <span className="text-neutral-600 text-[12px] font-mono font-bold tracking-wider px-2 py-1 bg-white rounded border border-neutral-200">{standard}</span>}
                    </motion.div>
                    
                    <motion.h1 variants={itemVar} className={`text-4xl md:text-5xl lg:text-6xl font-semibold ${THEME.textPrimary} uppercase leading-tight tracking-wide`} style={fontHeading}>
                        {product.name}
                    </motion.h1>
                </div>
                
                <motion.div variants={itemVar} className="flex gap-3">
                    <button className="p-3 bg-white rounded-lg text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 transition-all border border-neutral-200 shadow-sm hover:shadow-md">
                        <Share2 size={20} />
                    </button>
                    <button className="p-3 bg-white rounded-lg text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 transition-all border border-neutral-200 shadow-sm hover:shadow-md">
                        <Printer size={20} />
                    </button>
                </motion.div>
            </div>
            
            <motion.div variants={itemVar} className="flex items-start gap-5 mt-6 border-l-4 border-yellow-500 pl-6">
                 <p className={`${THEME.textSecondary} text-lg font-normal leading-relaxed max-w-4xl tracking-normal`}>
                    {product.short_description}
                 </p>
            </motion.div>
        </motion.div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* --- LEFT COLUMN: Visuals --- */}
          <div className="lg:col-span-7 flex flex-col gap-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col-reverse md:flex-row gap-4 h-auto md:h-[950px]">
                  
                  {/* Thumbnails */}
                  <div className="hidden md:flex flex-col gap-3 overflow-y-auto w-24 py-1 pr-1 custom-scrollbar">
                      {displayImages.map((img: string, idx: number) => (
                          <button 
                            key={idx} 
                            onClick={() => setSelectedImageIndex(idx)} 
                            className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-200 ${selectedImageIndex === idx ? 'ring-2 ring-yellow-500 opacity-100 scale-100' : 'opacity-60 hover:opacity-100 scale-90'}`}
                          >
                              <img src={img} className="w-full h-full object-contain bg-transparent" />
                          </button>
                      ))}
                  </div>

                  {/* Main Viewer */}
                  <div className="flex-1 relative flex items-center justify-center h-[400px] md:h-full overflow-visible group">
                  <AnimatePresence mode='wait'>
                    <motion.div 
                        key={currentImage} 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="w-full h-full flex items-center justify-center relative z-10 p-8"
                    >
                        <MagicZoomClone 
                            src={currentImage} 
                            zoomSrc={currentImage} 
                            alt={product.name} 
                            zoomLevel={2.5} 
                            glassSize={isMobile ? 120 : 200} 
                           className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] contrast-[1.05] brightness-[1.02] product-image-sharp" 
                        />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
          </div>
          {/* --- RIGHT COLUMN: Configurator --- */}
          <div className="lg:col-span-5 flex flex-col space-y-8 sticky top-[200px]">
              
              <motion.div variants={containerVar} initial="hidden" animate="visible" className="space-y-8">
                
                {/* 1. CONFIG PANEL */}
                <motion.div variants={itemVar} className={`bg-white border border-neutral-200 p-8 rounded-2xl shadow-lg relative overflow-hidden`}>
                    
                    {/* DIAMETER / GAUGE SELECTION */}
                    <div className="mb-8">
                      <SectionHeader icon={Ruler} title={diameterTitle} /> 
                      <div className="flex flex-wrap gap-3">
                        {uniqueDiameters.map((dia: any) => {
                            const isSelected = selectedDia === dia;
                            const displayLabel = dia.toString().replace('mm', '').trim();

                            return (
                              <button 
                                  key={dia} 
                                  onClick={() => setSelectedDia(dia)} 
                                  className={`
                                    relative px-3 h-12 min-w-[3.5rem] rounded-lg flex items-center justify-center text-lg transition-all duration-200 border-2
                                    ${isSelected 
                                      ? 'bg-yellow-500 text-neutral-900 border-yellow-500 shadow-md font-bold' 
                                      : 'bg-neutral-50 text-neutral-600 border-neutral-100 hover:border-neutral-300 hover:text-neutral-900 hover:bg-white font-medium'}
                                  `}
                                  style={fontMono}
                              >
                                  {displayLabel}
                              </button>
                            );
                        })}
                      </div>
                    </div>

                    {/* LENGTH SELECTION */}
                    <div className="mb-8">
                      <div className="flex justify-between items-end mb-4 border-b border-neutral-100 pb-2">
                        <SectionHeader icon={Maximize2} title={`Select Length (${selectedUnit})`} />
                        <span className="text-4xl font-bold text-neutral-900 tracking-tight" style={fontHeading}>
                            {selectedLen ? selectedLen : '--'}<span className="text-sm text-neutral-400 ml-1 font-sans font-medium">{selectedUnit}</span>
                        </span>
                      </div>
                      
                      <div className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-5 relative overflow-hidden">
                          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
                           backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                           backgroundSize: '12px 12px'
                          }}></div>

                          <div className="flex items-end justify-between h-32 gap-1 relative z-10 w-full px-1">
                             {availableLengthOptions.length > 0 ? availableLengthOptions.map((opt: any, idx: number) => {
                                  const isSelected = selectedLen === opt.value && selectedUnit === opt.unit;
                                  return (
                                     <button 
                                        key={idx} 
                                        onClick={() => {
                                            setSelectedLen(opt.value);
                                            setSelectedUnit(opt.unit);
                                        }} 
                                        className="group flex-1 flex flex-col items-center justify-end h-full gap-3 focus:outline-none relative"
                                     >
                                            <span className={`
                                              font-mono transition-all duration-200 whitespace-nowrap block
                                              ${isSelected 
                                                  ? 'text-base font-bold text-neutral-900 -translate-y-2 scale-110' 
                                                  : 'text-xs sm:text-sm text-neutral-500 font-medium group-hover:text-neutral-900 group-hover:font-bold'}
                                            `}>
                                                {parseFloat(opt.value)}
                                                {opt.unit !== 'mm' && <span className="text-[9px] block text-center">{opt.unit}</span>}
                                            </span>
                                            <div className={`
                                              w-1.5 sm:w-2 rounded-t-[2px] transition-all duration-300 ease-out relative
                                              ${isSelected 
                                                  ? 'h-full bg-yellow-500 shadow-md' 
                                                  : 'h-8 bg-neutral-300 group-hover:h-12 group-hover:bg-neutral-400'}
                                            `}>
                                            </div>
                                            <div className="absolute bottom-0 w-full h-[1px] bg-neutral-300 -z-10"></div>
                                     </button>
                                  )
                             }) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm italic">
                                    Select Diameter to view lengths
                                </div>
                             )}
                          </div>
                      </div>
                    </div>

                    {/* FINISH SELECTION */}
                    <div className="mb-8">
                      <SectionHeader icon={Layers} title="Surface Finish" />
                      {availableFinishes.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {availableFinishes.map((finish: any) => (
                             <button 
                                key={finish} 
                                onClick={() => handleFinishClick(finish)} 
                                className={`
                                  px-5 py-2.5 text-[14px] font-medium uppercase tracking-wide border rounded-md transition-all
                                  ${activeImageOverride === (product.finish_images?.[finish]) || (product.variants?.find((v:any) => v.finish===finish && v.image===activeImageOverride))
                                    ? 'border-yellow-500 text-neutral-900 bg-yellow-400 shadow-sm font-bold' 
                                    : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 hover:bg-white'}
                                `}
                                style={fontHeading}
                             >
                                  {finish}
                             </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-neutral-400 italic">Select Diameter & Length to see finishes</div>
                      )}
                    </div>

                    {availableTypes.length > 0 && (
                      <div>
                        <SectionHeader icon={Tag} title="Product Type" />
                        <div className="flex flex-wrap gap-2">
                            {availableTypes.map((type: any) => (
                               <button 
                                  key={type} 
                                  onClick={() => handleTypeClick(type)} 
                                  className={`
                                    px-5 py-2.5 text-[14px] font-medium uppercase tracking-wide border rounded-md transition-all
                                    ${selectedType === type 
                                      ? 'border-yellow-500 text-neutral-900 bg-yellow-400 shadow-sm font-bold' 
                                      : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 hover:bg-white'}
                                  `}
                                  style={fontHeading}
                               >
                                    {type}
                               </button>
                            ))}
                        </div>
                      </div>
                    )}

                </motion.div>
                </motion.div>

              <motion.div variants={itemVar} className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-md">
  <div className="bg-neutral-100 px-6 py-4 border-b border-neutral-200 flex items-center gap-2">
    <FileCheck size={18} className="text-yellow-600" />
    <span className="text-sm font-bold uppercase tracking-widest text-neutral-800" style={fontHeading}>Specification Details</span>
  </div>

  <div className="p-6 flex flex-col gap-0 divide-y divide-neutral-100">
    
    {displayMaterial && (
      <div className="pb-8 mb-2">
         <h4 className="text-center text-sm font-bold uppercase tracking-widest text-neutral-800 mb-5" style={fontHeading}>Material Specifications</h4>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayMaterial.split(/\|/g).map((mat, idx) => {
                const parts = mat.split('(');
                const name = parts[0].trim();
                let grade = parts.length > 1 ? parts[1].replace(')', '').trim() : '';
                grade = grade ? (grade.toLowerCase().startsWith('grade') ? "Grade " + grade.substring(5).trim() : "Grade " + grade) : 'Standard';

                return (
                  <div key={idx} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow flex flex-col">
                      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-neutral-100">
                          <Settings className="text-neutral-400" size={20} />
                          <span className="text-base font-bold text-neutral-900">{name}</span>
                      </div>
                      <div className="mt-auto">
                          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Grade:</span>
                          <span className="text-sm font-semibold text-neutral-800">{grade}</span>
                      </div>
                  </div>
                );
            })}
         </div>
      </div>
    )}

    {[
      { label: 'Head Type', value: displayHeadType },
      { label: 'Drive', value: product.drive_type },
      { label: 'Type', value: selectedType },
      ...product.specifications
        .filter(s => !HIDDEN_SPECS.includes(s.key.toLowerCase()))
        .map(s => ({ label: s.key, value: s.value }))
    ].map((item, idx) => item.value && (
      <div key={idx} className="flex flex-row justify-between py-5 items-center">
        <span className="text-neutral-500 font-bold uppercase text-xs tracking-wider min-w-[120px]">
          {item.label}
        </span>
        <span className="text-[15px] font-bold text-neutral-900 text-right">
          {item.value}
        </span>
      </div>
    ))}

  </div>
</motion.div>

                 <div className="grid grid-cols-2 gap-4 pt-4">
    {/* BULK QUOTE BUTTON */}
    <a 
        href="/Contact"
        className="col-span-1 bg-yellow-500 hover:bg-yellow-400 text-neutral-900 h-14 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all text-sm border border-yellow-600/10 hover:translate-y-[-2px]" 
        style={fontHeading}
    >
        <ShoppingCart size={20} /> Bulk Quote
    </a>

    {/* SPEC SHEET BUTTON */}
    <a 
    href="/public/Durable Fastener Pvt. Ltd. Catalogue.pdf"
    target="_blank" 
    rel="noopener noreferrer"
    className="col-span-1 bg-neutral-900 text-white h-14 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-sm hover:translate-y-[-2px]" 
    style={fontHeading}
>
    <FileText size={20} /> VIEW CATALOGUE
</a>
</div>
          </div>
        </div>
      </div>
      
      {/* --- TECHNICAL VAULT --- */}
<div className="bg-[#aaaaab] border-t border-neutral-300 relative z-20 overflow-hidden text-neutral-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    {showDimensions && (
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={containerVar}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <Activity className="text-yellow-600" size={32} />
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 uppercase tracking-wider" style={fontHeading}>
              Technical Specifications
            </h3>
          </div>

         <div className="flex flex-wrap gap-4 mt-6">
  {product.certifications && product.certifications.length > 0 ? (
    product.certifications.map((cert: any, idx: number) => (
      <div key={idx} className="bg-neutral-900 rounded-md py-2 px-3 flex items-center gap-3 border border-neutral-800 shadow-2xl self-start md:self-auto transform hover:scale-105 transition-transform duration-300">
        <div className="p-1 rounded-full border-2 border-emerald-500/30">
           <ShieldCheck className="text-emerald-500" size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col justify-center">
           <span className="text-white font-black text-sm tracking-wide leading-none font-sans">
             {cert.title}
           </span>
           <span className="text-emerald-500 text-[9px] font-bold tracking-[0.25em] uppercase leading-none mt-1.5 font-mono">
             {cert.subtitle}
           </span>
        </div>
      </div>
    ))
  ) : null}
</div>
</div>

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col lg:flex-row shadow-xl">
            <div className="lg:w-2/3 relative p-12 bg-white flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-200 group">
                <div className="absolute inset-0 opacity-100" style={blueprintGridStyleLight}></div>
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent z-10 pointer-events-none border-b border-yellow-500/20"
                    animate={{ top: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
                <div className="absolute top-6 left-6 z-20">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded bg-neutral-100 border border-neutral-300 text-[11px] font-mono uppercase text-neutral-600 font-bold tracking-wider`}>
                        ISO View
                      </span>
                </div>
                {product.technical_drawing ? (
                    <motion.img 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        whileInView={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.8 }}
                        src={product.technical_drawing} 
                        className="relative z-10 max-h-[450px] w-auto object-contain opacity-90 transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" 
                        alt="Technical Drawing"
                    />
                ) : <div className="text-neutral-500 font-mono text-sm tracking-wide border border-neutral-200 px-6 py-3 rounded bg-neutral-50">[ DRAWING DATA UNAVAILABLE ]</div>}
            </div>

            <div className="lg:w-1/3 bg-neutral-50 p-8 flex flex-col border-l border-neutral-200 relative">
                  <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-neutral-900">
                      <Activity size={140} />
                  </div>

                  <div className="mb-6 pb-4 border-b border-neutral-200 flex items-center justify-between relative z-10">
                      <h4 className="text-lg font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2" style={fontHeading}>
                           <Layers size={18} className="text-yellow-600" /> Performance Data
                      </h4>
                      <div className="flex gap-2 items-center bg-white px-3 py-1 rounded border border-neutral-200 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[15px] text-green-700 font-mono uppercase font-bold">Verified</span>
                      </div>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2">
                    {PERFORMANCE_KEYS_DISPLAY.map((key, i) => {
                        const hasSpec = product.specifications.find((s:any) => s.key.toLowerCase() === key.toLowerCase());
                        if (!hasSpec) return null;
                        return (
                            <motion.div 
                                key={i} 
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex justify-between items-center p-3.5 bg-white rounded border border-neutral-200 hover:border-neutral-400 transition-colors group shadow-sm"
                            >
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-800 transition-colors" style={fontHeading}>{key}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-neutral-900 font-mono text-sm font-bold tracking-wide">{hasSpec.value}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                    {!product.specifications.some((s:any) => PERFORMANCE_KEYS_DISPLAY.map(k=>k.toLowerCase()).includes(s.key.toLowerCase())) && (
                        <div className="text-center text-neutral-500 text-xs italic py-4 font-mono">No specific performance data listed.</div>
                    )}
                  </div>

                  <button className="w-full mt-6 flex items-center justify-center gap-2 bg-neutral-900 text-white py-3.5 rounded text-sm font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all relative z-10 border border-neutral-900 hover:border-yellow-500 shadow-md" style={fontHeading}>
                      <Lock size={14} /> Unlock Engineering Report
                  </button>
            </div>
        </div>

        <div className="w-full bg-white border border-t-0 border-neutral-200 mt-0 rounded-b-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-100">
                            <th className="py-6 pl-8 text-sm font-bold text-neutral-800 uppercase tracking-widest sticky left-0 z-10 bg-neutral-100 border-r border-neutral-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)]" style={fontHeading}>Feature</th>
                            <th className="py-6 text-center text-sm font-bold text-neutral-600 uppercase tracking-widest w-28 bg-neutral-100 border-r border-neutral-200" style={fontHeading}>Symbol</th>
                            {uniqueDiameters.map((dia: any) => (
                                <th key={dia} className={`py-6 px-6 text-center text-base font-bold uppercase tracking-widest whitespace-nowrap ${selectedDia === dia ? 'text-yellow-700 bg-yellow-50 border-b-2 border-yellow-500' : 'text-neutral-500'}`} style={fontHeading}>
                                      {dia.includes('.') && !dia.includes('mm') && !dia.includes('#') ? `${dia}mm` : dia}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-sm font-mono">
                          {product.dimensional_specifications?.map((dim: any, idx: number) => (
                            <tr key={idx} className="hover:bg-neutral-50 transition-colors group">
                                    <td className="py-5 pl-8 text-neutral-800 font-bold text-sm uppercase tracking-wider sticky left-0 bg-white group-hover:bg-neutral-50 transition-colors border-r border-neutral-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]" style={fontHeading}>
                                      {dim.label}
                                    </td>
                                    <td className="py-5 text-center text-yellow-600/90 font-serif italic font-bold bg-neutral-50/50 border-r border-neutral-200">{dim.symbol || '-'}</td>
                                  {uniqueDiameters.map((dia: any) => {
    let val: string = '-'; 
    
    if (dim.values && typeof dim.values === 'object') {
        const directValue = (dim.values as any)[dia];
        if (directValue) val = String(directValue);

        if (val === '-') {
            const rawKey = dia.toString().replace('mm', '').replace('#', '').trim();
            const rawValue = (dim.values as any)[rawKey];
            if (rawValue) val = String(rawValue);
        }

        if (val === '-') {
            const entry = Object.entries(dim.values as Record<string, any>).find(([k]) => 
                k.replace('mm', '').trim() === dia.toString().replace('mm', '').trim()
            );
            if (entry) val = String(entry[1]);
        }
    } else if (dia === selectedDia) {
        val = String(dim.value || '-');
    }

    const isActive = selectedDia === dia;
    
    return (
        <td key={dia} className={`py-5 text-center transition-all duration-300 font-medium 
            ${isActive 
                ? 'bg-yellow-50 text-neutral-900 font-bold text-base shadow-[inset_0_0_20px_rgba(234,179,8,0.15)] border-x border-yellow-200' 
                : 'text-neutral-500 border-x border-transparent'}`}>
            {val}
        </td>
    );
})}
                            </tr>
                          ))}
                    </tbody>
                </table>
            </div>
        </div>
      </motion.div>
    )}
  </div>
</div>
      {/* --- APPLICATIONS --- */}
      {product.applications && product.applications.length > 0 && (
  <section className={`py-32 ${THEME.bg} overflow-hidden border-t border-neutral-300`}>
    <div className="max-w-7xl mx-auto px-4">
      
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-yellow-500"></div>
          <span className="font-mono text-sm font-bold tracking-[0.4em] uppercase text-neutral-500">Industry Deployment</span>
        </div>
        <h3 className="text-5xl md:text-7xl font-black text-neutral-900 uppercase tracking-tighter" style={fontHeading}>
          Where Excellence <br />
          <span className="text-white drop-shadow-[2px_2px_0_#171717] [-webkit-text-stroke:1px_#171717]">Meets Integrity</span>
        </h3>
      </div>

      <div className="relative flex flex-col lg:flex-row gap-12 items-start">
        <div className="w-full lg:w-1/3 space-y-4 sticky top-[250px] z-20">
          {product.applications.map((app: any, idx: number) => {
            const appName = typeof app === 'string' ? app : app.name;
            return (
              <motion.div
                key={idx}
                onMouseEnter={() => setSelectedImageIndex(idx)} 
                className={`group flex items-center gap-6 p-6 rounded-xl border transition-all duration-500 cursor-pointer 
                  ${selectedImageIndex === idx 
                    ? 'bg-neutral-900 border-neutral-900 shadow-2xl translate-x-4' 
                    : 'bg-white border-neutral-200 hover:border-yellow-500'}`}
              >
                <span className={`font-mono text-lg font-bold ${selectedImageIndex === idx ? 'text-yellow-500' : 'text-neutral-300'}`}>
                  0{idx + 1}
                </span>
                <div className="flex-1">
                  <h4 className={`text-xl font-bold uppercase tracking-tight transition-colors 
                    ${selectedImageIndex === idx ? 'text-white' : 'text-neutral-800'}`} style={fontHeading}>
                    {appName}
                  </h4>
                  {selectedImageIndex === idx && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="text-neutral-400 text-xs mt-2 uppercase tracking-widest font-bold"
                    >
                      View Technical Case
                    </motion.p>
                  )}
                </div>
                <ChevronRight className={`${selectedImageIndex === idx ? 'text-yellow-500' : 'text-neutral-200'}`} />
              </motion.div>
            );
          })}
        </div>

        <div className="w-full lg:w-2/3 aspect-[4/3] lg:aspect-square relative group perspective-1000">
          <AnimatePresence mode="wait">
            {product.applications.map((app: any, idx: number) => {
              if (selectedImageIndex !== idx) return null;
              const appImage = typeof app === 'object' ? app.image : null;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 1.1, rotateY: 10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-neutral-800"
                >
                  <div className="relative w-full h-full overflow-hidden group">
                    <img 
                      src={appImage || 'https://via.placeholder.com/800'} 
                      className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                      alt="Application"
                    />
                    
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none mix-blend-screen"
                      style={{
                        backgroundImage: `url(${product.technical_drawing || ''})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'invert(1) brightness(2) sepia(1) hue-rotate(180deg)'
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                      <div className="space-y-1">
                          <p className="text-yellow-500 font-mono text-xs uppercase tracking-widest font-bold">Standard Optimized</p>
                          <h5 className="text-3xl font-bold text-white uppercase tracking-tight" style={fontHeading}>{typeof app === 'string' ? app : app.name}</h5>
                      </div>
                      <Link 
                        to={`/applications/${(typeof app === 'string' ? app : app.name).toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-white text-black p-4 rounded-full hover:bg-yellow-500 transition-colors shadow-xl"
                      >
                        <ArrowUpRight size={28} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </div>
  </section>
)}

{/* --- ATTRACTIVE FAQ SECTION --- */}
{product.faqs && product.faqs.length > 0 && (
  <section className="py-24 bg-neutral-900 relative overflow-hidden">
    {/* Background Graphic Decor */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

    <div className="max-w-5xl mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="text-yellow-500" size={24} />
            <span className="font-mono text-xs font-bold tracking-[0.5em] uppercase text-yellow-500/60">Fastener Support</span>
          </div>
          <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white" style={fontHeading}>
            Technical <span className="text-yellow-500">Knowledge</span> Base
          </h3>
        </div>
        <div className="hidden md:block">
           <Activity size={80} className="text-neutral-800" />
        </div>
      </div>

      <div className="space-y-4">
        {product.faqs.map((faq: any, idx: number) => (
          <FaqAccordion 
            key={idx} 
            index={idx}
            question={faq.question} 
            answer={faq.answer} 
          />
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-16 p-8 bg-neutral-800/50 border border-neutral-700 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm"
      >
        <div className="flex items-center gap-6 text-left">
          <div className="w-16 h-16 bg-neutral-700 rounded-2xl flex items-center justify-center text-yellow-500">
            <Info size={32} />
          </div>
          <div>
            <p className="text-white font-bold text-xl uppercase" style={fontHeading}>Need Custom Specifications?</p>
            <p className="text-neutral-400 text-sm">Our engineering team can assist with specific bulk requirements.</p>
          </div>
        </div>
        <Link to="/Contact" className="group bg-yellow-500 hover:bg-yellow-400 text-neutral-900 px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center gap-3 transition-all">
          GET EXPERT ADVICE
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </motion.div>
    </div>
  </section>
)}

      <AnimatePresence>
        {fullScreenAppImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setFullScreenAppImage(null)}>
                <button className="absolute top-6 right-6 z-[10000] text-neutral-500 hover:text-black bg-white border border-neutral-200 p-3 rounded-full shadow-xl" onClick={() => setFullScreenAppImage(null)}><X size={24} /></button>
                <img src={fullScreenAppImage} className="max-w-full max-h-[85vh] object-contain rounded-lg border border-neutral-200 shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;