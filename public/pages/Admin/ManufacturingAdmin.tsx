import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, Loader2, LayoutTemplate, FileText, 
  Globe, Video, Image as ImageIcon, Upload, PlayCircle
} from 'lucide-react';

const ManufacturingAdmin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    overview_title: '',
    overview_desc: '',
    // These fields can now store Image OR Video URLs
    video1_title: '', video1_sub: '', video1_img: '',
    video2_title: '', video2_sub: '', video2_img: '',
    video3_title: '', video3_sub: '', video3_img: ''
  });

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('manufacturing_content')
          .select('*')
          .eq('id', 1) 
          .single();
        
        if (error) throw error;

        if (data) {
          setFormData({
            hero_title: data.hero_title || '',
            hero_subtitle: data.hero_subtitle || '',
            overview_title: data.overview_title || '',
            overview_desc: data.overview_desc || '',
            video1_title: data.video1_title || '', video1_sub: data.video1_sub || '', video1_img: data.video1_img || '',
            video2_title: data.video2_title || '', video2_sub: data.video2_sub || '', video2_img: data.video2_img || '',
            video3_title: data.video3_title || '', video3_sub: data.video3_sub || '', video3_img: data.video3_img || ''
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. HANDLE TEXT INPUT CHANGE ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. HANDLE FILE UPLOAD (Images OR Videos) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `factory-assets/${fileName}`; // Clean folder name

    // Allow Images AND Videos
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert("Please upload a valid Image or Video file.");
        return;
    }

    setUploading(true);
    try {
      // Upload to 'images' bucket (works for videos too if bucket is public)
      const { error: uploadError } = await supabase.storage
        .from('images') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, [fieldName]: data.publicUrl }));
      
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error uploading file. Check your Supabase Storage settings.');
    } finally {
      setUploading(false);
    }
  };

  // --- 4. SAVE TO DATABASE ---
  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('manufacturing_content')
        .update({
          hero_title: formData.hero_title,
          hero_subtitle: formData.hero_subtitle,
          overview_title: formData.overview_title,
          overview_desc: formData.overview_desc,
          
          video1_title: formData.video1_title, video1_sub: formData.video1_sub, video1_img: formData.video1_img,
          video2_title: formData.video2_title, video2_sub: formData.video2_sub, video2_img: formData.video2_img,
          video3_title: formData.video3_title, video3_sub: formData.video3_sub, video3_img: formData.video3_img,
          
          updated_at: new Date()
        })
        .eq('id', 1);

      if (error) throw error;
      alert('Website Updated Successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if URL is a video for preview
  const isVideo = (url: string) => {
      if (!url) return false;
      return url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans">
      
      {/* --- HEADER --- */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <Globe size={20} />
          </div>
          <h1 className="text-xl font-black text-slate-900 uppercase">Factory Page Admin</h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading || uploading} 
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          {loading ? 'SAVING...' : 'PUBLISH CHANGES'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        
        {/* --- SECTION 1: HERO --- */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <LayoutTemplate size={20} className="text-blue-500" />
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Top Hero Section</h2>
           </div>
           <div className="grid gap-6">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Main Title</label>
               <input type="text" name="hero_title" value={formData.hero_title} onChange={handleChange}
                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"/>
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
               <textarea name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} rows={2}
                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"/>
             </div>
           </div>
        </section>

        {/* --- SECTION 2: OVERVIEW --- */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <FileText size={20} className="text-blue-500" />
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Factory Overview (Design)</h2>
           </div>
           <div className="space-y-6">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Section Title</label>
                  <input name="overview_title" value={formData.overview_title} onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg font-bold text-slate-800"/>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description (HTML Supported)</label>
                  <textarea name="overview_desc" value={formData.overview_desc} onChange={handleChange}
                    className="w-full p-4 border border-slate-300 rounded-lg h-32 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
                  <p className="text-[10px] text-slate-400 mt-2">Use &lt;strong&gt;text&lt;/strong&gt; for Blue Bold.</p>
               </div>
           </div>
        </section>

        {/* --- SECTION 3: LIVE PRODUCTION FLOOR (VIDEO/IMAGE) --- */}
        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <Video size={20} className="text-blue-500" />
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Live Production Floor (3 Cards)</h2>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
              
              {/* === CARD 1 === */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                 <h3 className="font-bold text-slate-900 border-b pb-2">Card 1 (Left)</h3>
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                    <input name="video1_title" value={formData.video1_title} onChange={handleChange} className="w-full p-2 text-sm border rounded"/>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Subtitle</label>
                    <input name="video1_sub" value={formData.video1_sub} onChange={handleChange} className="w-full p-2 text-sm border rounded"/>
                 </div>
                 
                 {/* UPLOAD SECTION 1 */}
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><PlayCircle size={10}/> Media (Image or Video)</label>
                    <div className="flex gap-2 items-center mb-2">
                         <input name="video1_img" value={formData.video1_img} onChange={handleChange} placeholder="Media URL" className="flex-1 p-2 text-xs border rounded text-slate-500"/>
                         <label className="bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700">
                             {uploading ? <Loader2 size={14} className="animate-spin"/> : <Upload size={14} />}
                             <input type="file" hidden accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'video1_img')} />
                         </label>
                    </div>
                    {/* SMART PREVIEW: Checks if it's a video or image */}
                    {formData.video1_img && (
                      <div className="h-24 w-full rounded-md overflow-hidden border border-slate-300 relative bg-slate-900">
                        {isVideo(formData.video1_img) ? (
                            <video src={formData.video1_img} className="h-full w-full object-cover" muted loop autoPlay playsInline />
                        ) : (
                            <img src={formData.video1_img} alt="Preview" className="h-full w-full object-cover"/>
                        )}
                      </div>
                    )}
                 </div>
              </div>

              {/* === CARD 2 === */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                 <h3 className="font-bold text-slate-900 border-b pb-2">Card 2 (Middle)</h3>
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                    <input name="video2_title" value={formData.video2_title} onChange={handleChange} className="w-full p-2 text-sm border rounded"/>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Subtitle</label>
                    <input name="video2_sub" value={formData.video2_sub} onChange={handleChange} className="w-full p-2 text-sm border rounded"/>
                 </div>

                 {/* UPLOAD SECTION 2 */}
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><PlayCircle size={10}/> Media (Image or Video)</label>
                    <div className="flex gap-2 items-center mb-2">
                         <input name="video2_img" value={formData.video2_img} onChange={handleChange} placeholder="Media URL" className="flex-1 p-2 text-xs border rounded text-slate-500"/>
                         <label className="bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700">
                             {uploading ? <Loader2 size={14} className="animate-spin"/> : <Upload size={14} />}
                             <input type="file" hidden accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'video2_img')} />
                         </label>
                    </div>
                    {/* SMART PREVIEW */}
                    {formData.video2_img && (
                      <div className="h-24 w-full rounded-md overflow-hidden border border-slate-300 relative bg-slate-900">
                        {isVideo(formData.video2_img) ? (
                            <video src={formData.video2_img} className="h-full w-full object-cover" muted loop autoPlay playsInline />
                        ) : (
                            <img src={formData.video2_img} alt="Preview" className="h-full w-full object-cover"/>
                        )}
                      </div>
                    )}
                 </div>
              </div>

              {/* === CARD 3 === */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                 <h3 className="font-bold text-slate-900 border-b pb-2">Card 3 (Right)</h3>
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                    <input name="video3_title" value={formData.video3_title} onChange={handleChange} className="w-full p-2 text-sm border rounded"/>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Subtitle</label>
                    <input name="video3_sub" value={formData.video3_sub} onChange={handleChange} className="w-full p-2 text-sm border rounded"/>
                 </div>
                 
                 {/* UPLOAD SECTION 3 */}
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><PlayCircle size={10}/> Media (Image or Video)</label>
                    <div className="flex gap-2 items-center mb-2">
                         <input name="video3_img" value={formData.video3_img} onChange={handleChange} placeholder="Media URL" className="flex-1 p-2 text-xs border rounded text-slate-500"/>
                         <label className="bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700">
                             {uploading ? <Loader2 size={14} className="animate-spin"/> : <Upload size={14} />}
                             <input type="file" hidden accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'video3_img')} />
                         </label>
                    </div>
                    {/* SMART PREVIEW */}
                    {formData.video3_img && (
                      <div className="h-24 w-full rounded-md overflow-hidden border border-slate-300 relative bg-slate-900">
                        {isVideo(formData.video3_img) ? (
                            <video src={formData.video3_img} className="h-full w-full object-cover" muted loop autoPlay playsInline />
                        ) : (
                            <img src={formData.video3_img} alt="Preview" className="h-full w-full object-cover"/>
                        )}
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default ManufacturingAdmin;