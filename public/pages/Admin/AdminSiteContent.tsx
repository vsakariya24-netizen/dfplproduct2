import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, Loader, Image as ImageIcon, FileText, RefreshCw, 
  Hash, Phone, Video, Plus, Trash2, LayoutTemplate, Briefcase, Users,
  Settings, ArrowRight,
  BookOpen
} from 'lucide-react';

const AdminSiteContent = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
const [blogs, setBlogs] = useState<any[]>([]);
const [newBlog, setNewBlog] = useState({ title: '', category: '', read_time: '', image_url: '' });
  // --- STATE: HERO ---
  const [heroText, setHeroText] = useState({ line1: '', line2: '', line3: '' });
  const [heroImages, setHeroImages] = useState<string[]>([]);

  // --- STATE: GENERAL CONTENT ---
  const [formData, setFormData] = useState({
    // Assets
    logo_url: '', 
    culture_img: '', 
    career_img: '', 
    
    // Categories (Matched to Home Page Fetch Logic)
    cat_fasteners: '',  // Displayed as "Industrial" in Home
    cat_automotive: '', // Displayed as "Automotive" in Home
    cat_fittings: '',   // Displayed as "Fittings" in Home
    cat_oem: '',        // Displayed as "OEM/Custom" in Home
    
    // Stats
    stat_dealers: 0,
    stat_years: 0,
    stat_products: 0,
    
    // Footer & Docs
    catalogue_pdf: '',
    showreel_url: '',
    contact_address: '',
    contact_email: '',
    contact_phone: ''
  });

  // --- FETCH DATA ---
  async function fetchContent() {
    setFetching(true);
    try {
      const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();
const { data: blogData } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (blogData) setBlogs(blogData);


      if (data) {
        // Hero
        setHeroText({
          line1: data.hero_title_1 || '',
          line2: data.hero_title_2 || '',
          line3: data.hero_title_3 || '',
        });
        setHeroImages(Array.isArray(data.hero_images) ? data.hero_images : []);

        // General Fields
        setFormData({
          logo_url: data.logo_url || '',
          culture_img: data.culture_img || '',
          career_img: data.career_img || '',
          
          cat_fasteners: data.cat_fasteners || '',
          cat_automotive: data.cat_automotive || '',
          cat_fittings: data.cat_fittings || '',
          cat_oem: data.cat_oem || '',
          
          stat_dealers: data.stat_dealers || 0,
          stat_years: data.stat_years || 0,
          stat_products: data.stat_products || 0,
          
          catalogue_pdf: data.catalogue_pdf || '',
          showreel_url: data.showreel_url || '',
          contact_address: data.contact_address || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || ''
        });
      } else if (error && error.code === 'PGRST116') {
        // Create row if not exists
        await supabase.from('site_content').insert([{ id: 1 }]);
        fetchContent();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => { fetchContent(); }, []);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  const handleHeroTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeroText({ ...heroText, [e.target.name]: e.target.value });
  };
const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files[0] == null) return;
  const file = e.target.files[0];
  setUploading('blog-image');
  
  const fileExt = file.name.split('.').pop();
  const fileName = `blogs/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage.from('site-assets').upload(fileName, file);
  if (!error) {
    const { data } = supabase.storage.from('site-assets').getPublicUrl(fileName);
    setNewBlog({ ...newBlog, image_url: data.publicUrl });
  }
  setUploading(null);
};
// 3. Add Blog to Database
const addBlog = async () => {
  if (!newBlog.title || !newBlog.image_url) return alert("Fill all fields");
  const { error } = await supabase.from('blogs').insert([newBlog]);
  if (!error) {
    setNewBlog({ title: '', category: '', read_time: '', image_url: '' });
    fetchContent(); // Refresh list
  }
};

// 4. Delete Blog
const deleteBlog = async (id: string) => {
  if (window.confirm("Delete this post?")) {
    await supabase.from('blogs').delete().eq('id', id);
    fetchContent();
  }
};
  // --- UPLOAD LOGIC ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string, isHeroSlide = false) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const uniqueId = isHeroSlide ? 'hero-slide' : fieldName;
    setUploading(uniqueId);

    try {
      const fileExt = file.name.split('.').pop();
      const folder = fieldName === 'catalogue_pdf' ? 'docs' : 'home-images';
      const fileName = `${folder}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('site-assets').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-assets').getPublicUrl(fileName);
      
      if (isHeroSlide) {
        setHeroImages(prev => [...prev, data.publicUrl]);
      } else {
        setFormData(prev => ({ ...prev, [fieldName]: data.publicUrl }));
      }
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  const removeHeroImage = (index: number) => {
    setHeroImages(prev => prev.filter((_, i) => i !== index));
  };

  // --- SAVE ---
  const handleSave = async () => {
    setLoading(true);
    const updates = {
      ...formData,
      hero_title_1: heroText.line1,
      hero_title_2: heroText.line2,
      hero_title_3: heroText.line3,
      hero_images: heroImages,
      updated_at: new Date()
    };

    const { error } = await supabase.from('site_content').update(updates).eq('id', 1);
    
    if (error) alert("Error: " + error.message);
    else alert("Website Content Updated Successfully!");
    setLoading(false);
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center text-slate-500 gap-2"><Loader className="animate-spin"/> Loading Config...</div>;

  // Helper Component for Image Inputs
  const ImageUploadField = ({ label, name, value, icon: Icon, note }: any) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                {Icon && <Icon size={16} className="text-blue-500"/>} {label}
            </label>
            {value && <div className="w-2 h-2 rounded-full bg-green-500" title="Image Set"></div>}
        </div>
        
        <div className="flex-1 mb-3 bg-white rounded-lg overflow-hidden relative border border-gray-300 group flex items-center justify-center min-h-[120px]">
           {value ? (
             <img src={value} className="w-full h-full object-cover absolute inset-0"/>
           ) : (
             <div className="text-gray-300 flex flex-col items-center gap-2">
               <ImageIcon size={24}/>
               <span className="text-[10px] uppercase font-bold">No Image</span>
             </div>
           )}
           {uploading === name && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white z-10"><Loader className="animate-spin"/></div>}
        </div>

        <div className="relative">
            <input type="file" id={`f-${name}`} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, name)} disabled={uploading !== null}/>
            <label htmlFor={`f-${name}`} className="block text-center cursor-pointer bg-white border border-gray-300 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm">
               {uploading === name ? 'Uploading...' : (value ? 'Replace Image' : 'Upload Image')}
            </label>
        </div>
        {note && <p className="text-[10px] text-gray-400 mt-2 text-center">{note}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-40 space-y-8 p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b pb-6 bg-white p-6 rounded-2xl shadow-sm gap-4">
        <div>
            <div className="flex items-center gap-3 mb-1">
                <Settings className="text-yellow-500" />
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">PAGE BUILDER</h1>
            </div>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest pl-9">Control Panel: Home Page</p>
        </div>
        <div className="flex gap-3">
            <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 text-xs font-bold border rounded-full hover:bg-gray-50 transition-colors">
                Live Preview <ArrowRight size={14}/>
            </a>
            <button onClick={fetchContent} className="p-2 bg-slate-100 border rounded-full hover:bg-slate-200 transition-colors" title="Reload Data">
                <RefreshCw size={20}/>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: VISUALS */}
        <div className="xl:col-span-2 space-y-8">
            
            {/* 1. HERO SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                    <LayoutTemplate className="text-blue-600" size={20} />
                    <h2 className="font-bold text-gray-800">Hero Section (Above Fold)</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 mb-1 block">Title Line 1</label>
                            <input name="line1" value={heroText.line1} onChange={handleHeroTextChange} className="w-full p-3 font-black border rounded-lg text-sm bg-gray-50" placeholder="e.g. WHERE DESIRE"/>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 mb-1 block">Title Line 2</label>
                            <input name="line2" value={heroText.line2} onChange={handleHeroTextChange} className="w-full p-3 font-black border rounded-lg text-sm bg-gray-50" placeholder="e.g. MEETS"/>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 mb-1 block">Title Line 3 (Yellow)</label>
                            <input name="line3" value={heroText.line3} onChange={handleHeroTextChange} className="w-full p-3 font-black border rounded-lg text-sm bg-yellow-50 text-yellow-700 border-yellow-200" placeholder="e.g. VALUE"/>
                        </div>
                    </div>
                    
                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-bold text-gray-800 uppercase flex items-center gap-2">
                                <ImageIcon size={14}/> Slideshow Backgrounds
                            </label>
                            <label className="cursor-pointer flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg">
                                {uploading === 'hero-slide' ? <Loader size={12} className="animate-spin"/> : <Plus size={12}/>} ADD SLIDE
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_images', true)} disabled={uploading !== null} />
                            </label>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {heroImages.map((img, i) => (
                                <div key={i} className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"/>
                                    <button onClick={() => removeHeroImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-red-600 shadow-lg">
                                        <Trash2 size={12}/>
                                    </button>
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-[10px] rounded font-mono backdrop-blur-sm">
                                        #{i + 1}
                                    </div>
                                </div>
                            ))}
                            {heroImages.length === 0 && (
                                <div className="col-span-full py-8 text-center text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-2">
                                    <ImageIcon size={24} className="opacity-20"/>
                                    No slides uploaded. The site will show a black screen.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. CATEGORY IMAGES */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-4"><ImageIcon className="text-purple-600" size={20}/> Product Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ImageUploadField label="Industrial" name="cat_fasteners" value={formData.cat_fasteners} note="Displays as 'Industrial'" />
                    <ImageUploadField label="Automotive" name="cat_automotive" value={formData.cat_automotive} />
                    <ImageUploadField label="Fittings" name="cat_fittings" value={formData.cat_fittings} />
                    <ImageUploadField label="OEM / Custom" name="cat_oem" value={formData.cat_oem} />
                </div>
            </div>

            {/* 3. SECTION & ASSETS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-4"><Briefcase className="text-emerald-600" size={20}/> Site Assets & Banners</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <ImageUploadField label="Loader Logo" name="logo_url" value={formData.logo_url} icon={Hash} note="PNG with Transparent BG" />
                    <ImageUploadField label="Culture Section" name="culture_img" value={formData.culture_img} icon={Users} note="Dark image preferred" />
                    <ImageUploadField label="Career Section" name="career_img" value={formData.career_img} icon={Briefcase} note="Dark image preferred" />
                </div>
            </div>

        </div>
<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-4">
        <BookOpen className="text-yellow-600" size={20}/> The Journal (Blog Posts)
    </h2>
    
    {/* Form to add new */}
    <div className="grid md:grid-cols-4 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
        <div className="md:col-span-2">
            <label className="text-[10px] font-bold uppercase text-slate-400">Post Title</label>
            <input value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} className="w-full p-2 border rounded text-sm" placeholder="The Future of Fasteners..." />
        </div>
        <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
            <input value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} className="w-full p-2 border rounded text-sm" placeholder="Innovation" />
        </div>
        <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Read Time</label>
            <input value={newBlog.read_time} onChange={e => setNewBlog({...newBlog, read_time: e.target.value})} className="w-full p-2 border rounded text-sm" placeholder="5 min read" />
        </div>
        <div className="md:col-span-3">
             <label className="text-[10px] font-bold uppercase text-slate-400">Cover Image URL</label>
             <div className="flex gap-2">
                <input value={newBlog.image_url} readOnly className="flex-1 p-2 border rounded text-xs bg-white" placeholder="Upload an image..." />
                <label className="bg-black text-white px-4 py-2 rounded text-xs font-bold cursor-pointer">
                    {uploading === 'blog-image' ? <Loader className="animate-spin" size={14}/> : 'Upload'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleBlogImageUpload} />
                </label>
             </div>
        </div>
        <div className="flex items-end">
            <button onClick={addBlog} className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg text-sm hover:bg-yellow-400">
                Add Post
            </button>
        </div>
    </div>

    {/* List of existing blogs */}
    <div className="space-y-3">
        {blogs.map(blog => (
            <div key={blog.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                    <img src={blog.image_url} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">{blog.title}</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-mono">{blog.category} • {blog.read_time}</p>
                    </div>
                </div>
                <button onClick={() => deleteBlog(blog.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                    <Trash2 size={16} />
                </button>
            </div>
        ))}
    </div>
</div>
        {/* RIGHT COLUMN: DATA */}
        <div className="space-y-8">
            
            {/* STATS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Hash className="text-green-600" size={20}/> Live Counters</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-500">Global Dealers</label>
                        <input type="number" name="stat_dealers" value={formData.stat_dealers} onChange={handleNumberChange} className="w-full p-3 border rounded-lg font-mono text-sm font-bold"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-500">Years of Experience</label>
                        <input type="number" name="stat_years" value={formData.stat_years} onChange={handleNumberChange} className="w-full p-3 border rounded-lg font-mono text-sm font-bold"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-500">Total Products (SKU)</label>
                        <input type="number" name="stat_products" value={formData.stat_products} onChange={handleNumberChange} className="w-full p-3 border rounded-lg font-mono text-sm font-bold"/>
                    </div>
                </div>
            </div>

            {/* FILES & LINKS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText className="text-red-600" size={20}/> Resources</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-500">PDF Catalogue</label>
                        <div className="flex gap-2">
                             <label className="flex-1 cursor-pointer bg-slate-50 border border-dashed border-slate-300 text-slate-500 text-xs font-bold py-3 rounded-lg text-center hover:bg-slate-100 transition-colors">
                                {uploading === 'catalogue_pdf' ? 'Uploading...' : (formData.catalogue_pdf ? 'Replace PDF' : 'Upload PDF')}
                                <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'catalogue_pdf')} />
                             </label>
                             {formData.catalogue_pdf && (
                                <a href={formData.catalogue_pdf} target="_blank" className="px-4 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100">
                                    View
                                </a>
                             )}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold block mb-1 text-gray-500">YouTube Showreel</label>
                        <input type="text" name="showreel_url" value={formData.showreel_url} onChange={handleChange} placeholder="https://youtube.com/..." className="w-full p-3 border rounded-lg text-xs"/>
                    </div>
                </div>
            </div>

            {/* CONTACT */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Phone className="text-orange-600" size={20}/> Contact Info</h2>
                <div className="space-y-3">
                    <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border rounded-lg text-sm bg-gray-50"/>
                    <input type="text" name="contact_email" value={formData.contact_email} onChange={handleChange} placeholder="Email Address" className="w-full p-3 border rounded-lg text-sm bg-gray-50"/>
                    <textarea rows={3} name="contact_address" value={formData.contact_address} onChange={handleChange} placeholder="Physical Address" className="w-full p-3 border rounded-lg text-sm bg-gray-50 resize-none"/>
                </div>
            </div>

        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
          <button onClick={handleSave} disabled={loading} className="bg-yellow-500 text-black px-10 py-4 rounded-full font-black text-lg shadow-[0_10px_40px_-10px_rgba(234,179,8,0.5)] flex items-center gap-3 hover:scale-105 transition-transform hover:bg-yellow-400 disabled:opacity-50 disabled:scale-100">
              {loading ? <Loader className="animate-spin"/> : <Save/>} PUBLISH LIVE
          </button>
      </div>
    </div>
  );
};

export default AdminSiteContent;