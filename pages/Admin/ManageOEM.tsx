import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, Loader2, LayoutTemplate, Upload, 
  Settings, Plus, Trash2, Image as ImageIcon, FileText,
  Palette, Component, Crosshair, MapPin, ShieldCheck,
  Layers, Flame, Droplets
} from 'lucide-react';

// --- INTERFACES ---
interface StyleItem {
  name: string;
  img: string;
}

interface ColorItem {
  name: string;
  color: string;
}

interface QualityItem {
  label: string;
  val: string;
}

interface QualityCardData {
  title: string;
  description: string;
  items: QualityItem[];
}

interface QualityStandardsData {
  raw_material: QualityCardData;
  heat_treatment: QualityCardData;
  surface_finish: QualityCardData;
}

// Default Data to fall back on
const DEFAULT_QUALITY: QualityStandardsData = {
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

const ManageOEM: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_video_url: '',
    spec_material: '',
    spec_diameter: '',
    spec_length: '',
    qa_cpk: '',
    qa_max_class: ''
  });

  // --- DYNAMIC LISTS STATE ---
  const [headStyles, setHeadStyles] = useState<StyleItem[]>([]);
  const [driveSystems, setDriveSystems] = useState<StyleItem[]>([]);
  const [threadingTypes, setThreadingTypes] = useState<StyleItem[]>([]);
  const [surfaceFinishes, setSurfaceFinishes] = useState<ColorItem[]>([]);
  
  // --- QUALITY STANDARDS STATE ---
  const [qualityStandards, setQualityStandards] = useState<QualityStandardsData>(DEFAULT_QUALITY);

  // --- 1. FETCH & CLEAN DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('oem_content').select('*').single();
        
        if (error) throw error;

        if (data) {
          const specs = data.technical_specs || {};

          setFormData({
            hero_title: data.hero_title || '',
            hero_subtitle: data.hero_subtitle || '',
            hero_video_url: data.hero_video_url || '',
            spec_material: specs.material || '',
            spec_diameter: specs.diameter || '',
            spec_length: specs.length || '',
            qa_cpk: data.qa_cpk || '',
            qa_max_class: data.qa_max_class || ''
          });

          // Helper to safely parse JSON or return original
          const safeJson = (input: any) => {
             if(typeof input === 'string') {
                 try { return JSON.parse(input); } catch { return input; }
             }
             return input;
          };

          // Basic Lists
          setHeadStyles(Array.isArray(data.head_styles) ? data.head_styles.map(safeJson) : []);
          setDriveSystems(Array.isArray(data.drive_systems) ? data.drive_systems.map(safeJson) : []);
          setThreadingTypes(Array.isArray(data.threading_types) ? data.threading_types.map(safeJson) : []);
          setSurfaceFinishes(Array.isArray(data.surface_finishes) ? data.surface_finishes.map(safeJson) : []);

          // Quality Standards
          if (data.quality_standards) {
             // Merge with default to ensure structure exists if DB is partial
             setQualityStandards({ ...DEFAULT_QUALITY, ...data.quality_standards });
          }
        }
      } catch (error) {
        console.error("Error fetching OEM data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. HANDLERS ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- QUALITY HANDLERS ---
  const updateQualityCard = (section: keyof QualityStandardsData, field: 'title' | 'description', value: string) => {
      setQualityStandards(prev => ({
          ...prev,
          [section]: { ...prev[section], [field]: value }
      }));
  };

  const updateQualityItem = (section: keyof QualityStandardsData, index: number, field: 'label' | 'val', value: string) => {
      const newItems = [...qualityStandards[section].items];
      newItems[index] = { ...newItems[index], [field]: value };
      setQualityStandards(prev => ({
          ...prev,
          [section]: { ...prev[section], items: newItems }
      }));
  };

  const addQualityItem = (section: keyof QualityStandardsData) => {
      setQualityStandards(prev => ({
          ...prev,
          [section]: { ...prev[section], items: [...prev[section].items, { label: '', val: '' }] }
      }));
  };

  const removeQualityItem = (section: keyof QualityStandardsData, index: number) => {
      const newItems = qualityStandards[section].items.filter((_, i) => i !== index);
      setQualityStandards(prev => ({
          ...prev,
          [section]: { ...prev[section], items: newItems }
      }));
  };

  // --- GENERIC LIST HANDLERS ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: string, index?: number) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const fileName = `oem/${Date.now()}-${file.name}`;
    setUploadingId(`${target}-${index}`);

    try {
      const { error } = await supabase.storage.from('site-assets').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('site-assets').getPublicUrl(fileName);
      
      if (target === 'hero') setFormData(prev => ({ ...prev, hero_video_url: data.publicUrl }));
      else if (target === 'head' && typeof index === 'number') {
          const list = [...headStyles]; list[index].img = data.publicUrl; setHeadStyles(list);
      }
      else if (target === 'drive' && typeof index === 'number') {
          const list = [...driveSystems]; list[index].img = data.publicUrl; setDriveSystems(list);
      }
      else if (target === 'thread' && typeof index === 'number') {
          const list = [...threadingTypes]; list[index].img = data.publicUrl; setThreadingTypes(list);
      }
    } catch (err) { alert('Upload failed'); } 
    finally { setUploadingId(null); }
  };

  const updateListItem = (listType: string, index: number, field: string, value: string) => {
    if (listType === 'head') { const l = [...headStyles]; (l[index] as any)[field] = value; setHeadStyles(l); }
    if (listType === 'drive') { const l = [...driveSystems]; (l[index] as any)[field] = value; setDriveSystems(l); }
    if (listType === 'thread') { const l = [...threadingTypes]; (l[index] as any)[field] = value; setThreadingTypes(l); }
    if (listType === 'surface') { const l = [...surfaceFinishes]; (l[index] as any)[field] = value; setSurfaceFinishes(l); }
  };

  const addItem = (type: string) => {
      if(type === 'head') setHeadStyles([...headStyles, {name:'', img:''}]);
      if(type === 'drive') setDriveSystems([...driveSystems, {name:'', img:''}]);
      if(type === 'thread') setThreadingTypes([...threadingTypes, {name:'', img:''}]);
      if(type === 'surface') setSurfaceFinishes([...surfaceFinishes, {name:'', color:'#000000'}]);
  };

  const removeItem = (type: string, idx: number) => {
      if(type === 'head') setHeadStyles(headStyles.filter((_,i)=>i!==idx));
      if(type === 'drive') setDriveSystems(driveSystems.filter((_,i)=>i!==idx));
      if(type === 'thread') setThreadingTypes(threadingTypes.filter((_,i)=>i!==idx));
      if(type === 'surface') setSurfaceFinishes(surfaceFinishes.filter((_,i)=>i!==idx));
  };

  // --- 3. SAVE FUNCTION ---
  const handleSave = async () => {
    setLoading(true);
    try {
      const technicalSpecsJson = {
        material: formData.spec_material,
        diameter: formData.spec_diameter,
        length: formData.spec_length,
        thread: "Metric & Imperial" 
      };

      const { error } = await supabase
        .from('oem_content')
        .update({
          hero_title: formData.hero_title,
          hero_subtitle: formData.hero_subtitle,
          hero_video_url: formData.hero_video_url,
          technical_specs: technicalSpecsJson,
          head_styles: headStyles, 
          drive_systems: driveSystems,
          threading_types: threadingTypes,
          surface_finishes: surfaceFinishes,
          quality_standards: qualityStandards, // <--- SAVING NEW DATA
          qa_cpk: formData.qa_cpk,
          qa_max_class: formData.qa_max_class,
          updated_at: new Date()
        })
        .eq('id', 1);

      if (error) throw error;
      alert('OEM Platform updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  // --- 4. RENDERERS ---
  
  const renderQualityCardEditor = (sectionKey: keyof QualityStandardsData, icon: any, colorClass: string) => {
      const data = qualityStandards[sectionKey];
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between ${colorClass} bg-opacity-5`}>
                <div className="flex items-center gap-2 text-slate-800">
                    {icon}
                    <h3 className="font-bold uppercase text-xs tracking-wider">{data.title} Card</h3>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Card Title</label>
                    <input 
                        value={data.title} 
                        onChange={(e) => updateQualityCard(sectionKey, 'title', e.target.value)}
                        className="w-full border-b border-slate-200 font-bold text-slate-800 focus:border-blue-500 outline-none py-1"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                    <textarea 
                        value={data.description} 
                        onChange={(e) => updateQualityCard(sectionKey, 'description', e.target.value)}
                        className="w-full border rounded p-2 text-xs text-slate-600 focus:border-blue-500 outline-none"
                        rows={2}
                    />
                </div>
                
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Specifications List</label>
                        <button onClick={() => addQualityItem(sectionKey)} className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 font-bold">+ Add Spec</button>
                    </div>
                    <div className="space-y-2">
                        {data.items.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input 
                                    placeholder="Label (e.g. METHOD)" 
                                    value={item.label}
                                    onChange={(e) => updateQualityItem(sectionKey, idx, 'label', e.target.value)}
                                    className="w-1/3 text-xs border rounded p-1.5 font-bold text-slate-500 uppercase"
                                />
                                <input 
                                    placeholder="Value (e.g. Gas Carburizing)" 
                                    value={item.val}
                                    onChange={(e) => updateQualityItem(sectionKey, idx, 'val', e.target.value)}
                                    className="flex-1 text-xs border rounded p-1.5 font-mono text-slate-800"
                                />
                                <button onClick={() => removeQualityItem(sectionKey, idx)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      );
  };

  const renderListEditor = (title: string, items: StyleItem[], listType: 'head' | 'drive' | 'thread', colorClass: string) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${colorClass} bg-opacity-5`}>
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-slate-600"/>
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">{title}</h3>
        </div>
        <button 
          onClick={() => addItem(listType)}
          className={`text-[10px] font-bold px-3 py-1.5 rounded-full text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1`}
        >
          <Plus size={12} /> ADD ITEM
        </button>
      </div>

      <div className="p-6 space-y-3 overflow-y-auto max-h-[500px]">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 p-3 rounded-lg border border-slate-200 hover:border-blue-400 transition-colors bg-slate-50/50 group">
            {/* Image Uploader */}
            <div className="relative w-16 h-16 bg-white rounded-md border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {item.img ? (
                <img src={item.img} alt={item.name} className="w-full h-full object-contain p-1" />
              ) : (
                <ImageIcon size={20} className="text-slate-300" />
              )}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity z-10">
                {uploadingId === `${listType}-${index}` ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : (
                  <Upload size={16} className="text-white" />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, listType, index)}
                />
              </label>
            </div>

            {/* Inputs */}
            <div className="flex-1 flex flex-col justify-center gap-2">
               <input 
                 type="text" 
                 placeholder="Item Name"
                 value={item.name} 
                 onChange={(e) => updateListItem(listType, index, 'name', e.target.value)}
                 className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 pb-1"
               />
               <input 
                 type="text" 
                 value={item.img}
                 readOnly
                 className="w-full bg-transparent outline-none text-[10px] font-mono text-slate-400 truncate"
               />
            </div>
            <button onClick={() => removeItem(listType, index)} className="self-center p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs italic">No items yet.</div>
        )}
      </div>
    </div>
  );

  const renderColorListEditor = (title: string, items: ColorItem[]) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-purple-50">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-purple-600"/>
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">{title}</h3>
        </div>
        <button 
          onClick={() => addItem('surface')}
          className="text-[10px] font-bold px-3 py-1.5 rounded-full text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1"
        >
          <Plus size={12} /> ADD COLOR
        </button>
      </div>

      <div className="p-6 space-y-3 overflow-y-auto max-h-[500px]">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 p-3 rounded-lg border border-slate-200 hover:border-purple-400 transition-colors bg-slate-50/50 items-center">
            
            <div className="relative w-12 h-12 flex-shrink-0">
                <input 
                  type="color" 
                  value={item.color} 
                  onChange={(e) => updateListItem('surface', index, 'color', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="w-full h-full rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: item.color }}
                ></div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-2">
               <input 
                 type="text" 
                 placeholder="Finish Name"
                 value={item.name}
                 onChange={(e) => updateListItem('surface', index, 'name', e.target.value)}
                 className="w-full bg-transparent border-b border-slate-200 focus:border-purple-500 outline-none text-sm font-bold text-slate-700 pb-1"
               />
               <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-slate-400">HEX:</span>
                   <input 
                     type="text" 
                     value={item.color}
                     onChange={(e) => updateListItem('surface', index, 'color', e.target.value)}
                     className="w-full bg-transparent outline-none text-[10px] font-mono text-slate-500 uppercase"
                   />
               </div>
            </div>

            <button onClick={() => removeItem('surface', index)} className="self-center p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
         {items.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs italic">No finishes added.</div>
        )}
      </div>
    </div>
  );
  
  if (fetching) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Settings size={20} /></div>
          <div><h1 className="text-xl font-black text-slate-900">OEM CONTROL</h1></div>
        </div>
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-blue-700">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {loading ? 'SAVING...' : 'PUBLISH'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* HERO SECTION */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <LayoutTemplate size={20} className="text-blue-500" />
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Hero Section</h2>
           </div>
           
           <div className="grid lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8 space-y-6">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Main Headline</label>
                 <input 
                   type="text" 
                   name="hero_title"
                   value={formData.hero_title}
                   onChange={handleChange}
                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-2xl font-black text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                 <textarea 
                   name="hero_subtitle"
                   value={formData.hero_subtitle}
                   onChange={handleChange}
                   rows={3}
                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                 />
               </div>
             </div>

             <div className="lg:col-span-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Background Asset</label>
                <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden group border border-slate-200">
                  {formData.hero_video_url && (
                    <div className="absolute inset-0 opacity-50">
                        {formData.hero_video_url.match(/\.(mp4|webm)$/) ? (
                          <video src={formData.hero_video_url} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={formData.hero_video_url} alt="Hero" className="w-full h-full object-cover" />
                        )}
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <label className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all">
                        {uploadingId === 'hero' ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16}/>}
                        <span className="text-xs font-bold">CHANGE ASSET</span>
                        <input type="file" onChange={(e) => handleFileUpload(e, 'hero')} className="hidden" />
                    </label>
                  </div>
                </div>
             </div>
           </div>
        </section>

        {/* TECHNICAL SPECS */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <Component size={20} className="text-blue-500" />
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Core Specifications</h2>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Component size={14} />
                    <span className="text-[10px] font-bold uppercase">Material</span>
                 </div>
                 <input 
                   type="text" 
                   name="spec_material" 
                   value={formData.spec_material} 
                   onChange={handleChange}
                   className="w-full bg-transparent font-mono text-lg font-bold text-slate-800 outline-none border-b border-transparent focus:border-blue-500"
                 />
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Crosshair size={14} />
                    <span className="text-[10px] font-bold uppercase">Diameter</span>
                 </div>
                 <input 
                   type="text" 
                   name="spec_diameter" 
                   value={formData.spec_diameter} 
                   onChange={handleChange}
                   className="w-full bg-transparent font-mono text-lg font-bold text-slate-800 outline-none border-b border-transparent focus:border-blue-500"
                 />
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <MapPin size={14} />
                    <span className="text-[10px] font-bold uppercase">Length</span>
                 </div>
                 <input 
                   type="text" 
                   name="spec_length" 
                   value={formData.spec_length} 
                   onChange={handleChange}
                   className="w-full bg-transparent font-mono text-lg font-bold text-slate-800 outline-none border-b border-transparent focus:border-blue-500"
                 />
             </div>
           </div>
        </section>

        {/* DYNAMIC SPEC LISTS */}
        <div className="grid lg:grid-cols-2 gap-8 h-auto">
           {renderListEditor('Threading Specifications', threadingTypes, 'thread', 'bg-orange-600')}
           {renderColorListEditor('Surface Engineering', surfaceFinishes)}
        </div>

        {/* CATALOG LISTS */}
        <div className="grid lg:grid-cols-2 gap-8 h-auto">
           {renderListEditor('Head Styles Catalog', headStyles, 'head', 'bg-blue-600')}
           {renderListEditor('Drive Systems Catalog', driveSystems, 'drive', 'bg-emerald-600')}
        </div>

        {/* --- NEW QUALITY STANDARDS SECTION --- */}
        <section className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                <ShieldCheck size={20} className="text-blue-500" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quality Standards Section</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
                {renderQualityCardEditor('raw_material', <Layers size={18} className="text-blue-500"/>, 'bg-blue-500')}
                {renderQualityCardEditor('heat_treatment', <Flame size={18} className="text-amber-500"/>, 'bg-amber-500')}
                {renderQualityCardEditor('surface_finish', <Droplets size={18} className="text-emerald-500"/>, 'bg-emerald-500')}
            </div>
        </section>

        {/* QA Metrics */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <FileText size={20} className="text-blue-500" />
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">QA Metrics</h2>
           </div>
           <div className="grid md:grid-cols-2 gap-8">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cpk Index</label>
               <input name="qa_cpk" value={formData.qa_cpk} onChange={handleChange} className="w-full p-2 border rounded"/>
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Max Class</label>
               <input name="qa_max_class" value={formData.qa_max_class} onChange={handleChange} className="w-full p-2 border rounded"/>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default ManageOEM;