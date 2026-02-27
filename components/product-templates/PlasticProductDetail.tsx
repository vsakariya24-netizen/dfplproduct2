import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Magnet, Layers, Palette, Box, Globe, 
  CheckCircle2, ArrowRight, ShieldCheck, ChevronRight 
} from 'lucide-react';

// Hardcoded Data from your handwritten notes
const MAGNET_MODELS = [
  { id: 'M5', name: 'PAN', desc: 'Sleek, flat design for modern minimalism.', type: 'Premium' },
  { id: 'M6', name: 'R+F', desc: 'Round + Flower pattern. Decorative & classic.', type: 'Premium' },
  { id: 'M7', name: 'FANCY', desc: 'Intricate detailing for luxury interiors.', type: 'Premium' },
  { id: 'M10', name: 'PURE', desc: 'Minimalist geometric design.', type: 'Premium' },
  { id: 'STD', name: 'Standard', desc: 'Models M1, M2, M3, M4. The reliable standard.', type: 'Standard' },
];

const PlasticProductDetail = ({ product }: { product: any }) => {
  const [activeVariant, setActiveVariant] = useState('M5');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Custom Breadcrumb for Plastic Page */}
      <div className="pt-24 pb-4 px-6 max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-400">
        <Link to="/products" className="hover:text-blue-600">Products</Link> 
        <ChevronRight size={14} />
        <span className="text-blue-600 font-bold uppercase">{product.name}</span>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full pb-16 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold tracking-widest uppercase rounded-full">
                Classone Series
              </span>
              <span className="px-3 py-1 border border-slate-300 text-slate-500 text-xs font-bold tracking-widest uppercase rounded-full">
                Made in India
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
              Precision <br />
              <span className="text-blue-600">{product.name}</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-md leading-relaxed">
              {product.description || "Engineered with Virgin PP and ABS Plastic for superior durability. The perfect magnetic catch for doors, cupboards, and premium furniture."}
            </p>

            <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
              Download Catalog <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Right: Visualizer */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] lg:h-[500px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex items-center justify-center p-8 group"
          >
            {/* Product Image */}
            <div className="relative w-full h-full flex items-center justify-center">
               {product.images && product.images[0] ? (
                 <img src={product.images[0]} className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" alt={product.name} />
               ) : (
                 <Magnet size={120} className="text-slate-300" />
               )}
            </div>
            
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-blue-600" size={24} />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Material</p>
                  <p className="text-sm font-bold text-slate-900">ABS / PP Virgin</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- MODEL SELECTOR (INTERACTIVE) --- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
          
          {/* Left: Selector List */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-3xl font-bold mb-2">Design Variants</h2>
            <p className="text-slate-400 mb-8">Select a model to view details.</p>
            
            <div className="space-y-3">
              {MAGNET_MODELS.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setActiveVariant(variant.id)}
                  className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex justify-between items-center ${
                    activeVariant === variant.id 
                    ? 'bg-blue-600 text-white shadow-lg translate-x-2' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-mono text-lg font-bold">{variant.id}</span>
                  <span className="text-sm uppercase tracking-wider font-semibold opacity-80">{variant.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Display Panel */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVariant}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full bg-slate-800 rounded-3xl p-8 lg:p-12 border border-slate-700 relative overflow-hidden flex flex-col justify-center"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <span className="text-9xl font-black text-white">{activeVariant}</span>
                </div>

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 mb-4 rounded bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/30">
                    {MAGNET_MODELS.find(v => v.id === activeVariant)?.type} Series
                  </span>
                  
                  <h3 className="text-4xl lg:text-5xl font-bold mb-4">
                    {MAGNET_MODELS.find(v => v.id === activeVariant)?.name}
                  </h3>
                  
                  <p className="text-xl text-slate-300 mb-8 max-w-lg">
                    {MAGNET_MODELS.find(v => v.id === activeVariant)?.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- SPECIFICATIONS GRID --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Material */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
              <Layers className="text-blue-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Material Composition</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle2 size={16} className="text-green-500" /> Plastic ABS</li>
                <li className="flex items-center gap-2 text-slate-600"><CheckCircle2 size={16} className="text-green-500" /> PP Virgin</li>
              </ul>
            </div>

            {/* Colors */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
              <Palette className="text-blue-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Colors</h3>
              <div className="flex gap-3 mt-3">
                <div className="w-8 h-8 rounded-full bg-[#FFFFF0] border border-slate-300 shadow-sm" title="Ivory"></div>
                <div className="w-8 h-8 rounded-full bg-white border border-slate-300 shadow-sm" title="White"></div>
                <div className="w-8 h-8 rounded-full bg-[#8B4513] border border-slate-300 shadow-sm" title="Brown"></div>
              </div>
            </div>

            {/* Application */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
              <Box className="text-blue-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Applications</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Door Fittings, Cupboard Fittings, and General Furniture.</p>
            </div>

             {/* Branding */}
             <div className="p-6 bg-blue-600 rounded-2xl border border-blue-500 shadow-lg text-white">
              <Globe className="text-white/80 mb-4" size={32} />
              <h3 className="text-lg font-bold text-white mb-2">CLASSONE</h3>
              <p className="text-sm text-blue-100">Premium Export Quality. Made in India.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlasticProductDetail;