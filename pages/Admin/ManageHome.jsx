import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, Upload, Trash2, LayoutTemplate, Image as ImageIcon, Plus } from 'lucide-react';

const ManageHome = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  // State for content
  const [heroText, setHeroText] = useState({ line1: '', line2: '', line3: '' });
  const [heroImages, setHeroImages] = useState([]);

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('home_content').select('*').single();
        if (error) throw error;
        if (data) {
          setHeroText({
            line1: data.hero_title_1 || '',
            line2: data.hero_title_2 || '',
            line3: data.hero_title_3 || '',
          });
          // Ensure hero_images is an array
          setHeroImages(Array.isArray(data.hero_images) ? data.hero_images : []);
        }
      } catch (error) {
        console.error('Error fetching Home data:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  // 2. Handlers
  const handleTextChange = (e) => {
    setHeroText({ ...heroText, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    
    const file = e.target.files[0];
    const fileName = `home-hero/${Date.now()}-${file.name}`;

    try {
      const { error: uploadError } = await supabase.storage.from('site-assets').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-assets').getPublicUrl(fileName);
      
      // Add new image URL to state
      setHeroImages(prev => [...prev, data.publicUrl]);
    } catch (error) {
      alert('Upload failed');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setHeroImages(prev => prev.filter((_, i) => i !== index));
  };

  // 3. Save Data
  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('home_content')
        .update({
          hero_title_1: heroText.line1,
          hero_title_2: heroText.line2,
          hero_title_3: heroText.line3,
          hero_images: heroImages,
          updated_at: new Date()
        })
        .eq('id', 1);

      if (error) throw error;
      alert('Home Page updated successfully!');
    } catch (error) {
      alert('Error saving data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-black">
            <LayoutTemplate size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">HOME MANAGER</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Manage Hero Slideshow & Texts</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-neutral-800 disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {loading ? 'SAVING...' : 'PUBLISH'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        
        {/* HERO TEXT SECTION */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Hero Text Overlay</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Line 1 (Top)</label>
              <input name="line1" value={heroText.line1} onChange={handleTextChange} className="w-full p-3 bg-slate-50 border rounded-lg font-bold" placeholder="WHERE DESIRE" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Line 2 (Middle)</label>
              <input name="line2" value={heroText.line2} onChange={handleTextChange} className="w-full p-3 bg-slate-50 border rounded-lg font-bold" placeholder="MEETS" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Line 3 (Gradient)</label>
              <input name="line3" value={heroText.line3} onChange={handleTextChange} className="w-full p-3 bg-slate-50 border rounded-lg font-bold text-yellow-600" placeholder="VALUE" />
            </div>
          </div>
        </section>

        {/* HERO SLIDESHOW MANAGER */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Hero Slideshow Images</h2>
            <label className="cursor-pointer flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-yellow-400 transition-colors">
              {uploading ? <Loader2 size={14} className="animate-spin"/> : <Plus size={14} />} 
              ADD IMAGE
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {heroImages.map((img, index) => (
              <div key={index} className="group relative aspect-[9/16] md:aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <span className="text-white font-mono text-xs">Slide {index + 1}</span>
                  <button 
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {heroImages.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                <ImageIcon size={48} className="mb-4 opacity-50" />
                <p className="text-sm">No images in slideshow. Add some to start.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ManageHome;