import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Upload, Plus, Loader, Image as ImageIcon } from 'lucide-react';

// Types define karte hain
type GalleryItem = {
  id: number;
  title: string;
  tag: string;
  image_url: string;
};

const AdminLifeGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // New Item State
  const [newItem, setNewItem] = useState({ title: '', tag: '' });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. Fetch Existing Gallery Items
  const fetchGallery = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('life_gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setItems(data);
    setFetching(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // 2. Handle Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileName = `gallery-${Date.now()}.${file.name.split('.').pop()}`;
    const filePath = `life-events/${fileName}`;

    try {
      const { error } = await supabase.storage.from('site-assets').upload(filePath, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      setPreviewUrl(data.publicUrl);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. Save New Item to Database
  const handleAddItem = async () => {
    if (!newItem.title || !newItem.tag || !previewUrl) {
      alert("Please fill all fields and upload an image.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('life_gallery').insert([
      { title: newItem.title, tag: newItem.tag, image_url: previewUrl }
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      // Reset form
      setNewItem({ title: '', tag: '' });
      setPreviewUrl(null);
      fetchGallery(); // Refresh list
    }
    setLoading(false);
  };

  // 4. Delete Item
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this memory?")) return;
    await supabase.from('life_gallery').delete().eq('id', id);
    fetchGallery();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Life at Durable Gallery</h1>
        <p className="text-gray-500">Add photos of events, trips, and celebrations.</p>
      </div>

      {/* --- ADD NEW SECTION --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Plus className="bg-black text-white rounded-full p-1" size={24}/> Add New Event
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          {/* Image Upload */}
          <div className="md:col-span-1">
            <label className="block text-sm font-bold mb-2">Event Photo</label>
            <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
              {previewUrl ? (
                <img src={previewUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                   {uploading ? <Loader className="animate-spin"/> : <ImageIcon />}
                   <span className="text-xs mt-1">Select Photo</span>
                </div>
              )}
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileUpload}
                accept="image/*"
              />
            </div>
          </div>

          {/* Inputs */}
          <div className="md:col-span-2 space-y-4">
             <div>
               <label className="block text-sm font-bold mb-1">Event Title</label>
               <input 
                 type="text" 
                 placeholder="e.g. Diwali Bash 2024"
                 className="w-full p-2 border rounded-lg"
                 value={newItem.title}
                 onChange={(e) => setNewItem({...newItem, title: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-sm font-bold mb-1">Tag / Category</label>
               <input 
                 type="text" 
                 placeholder="e.g. Culture, Trip, Sports"
                 className="w-full p-2 border rounded-lg"
                 value={newItem.tag}
                 onChange={(e) => setNewItem({...newItem, tag: e.target.value})}
               />
             </div>
          </div>

          {/* Add Button */}
          <div className="md:col-span-1">
             <button 
               onClick={handleAddItem}
               disabled={loading || uploading}
               className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
             >
               {loading ? "Saving..." : "Add to Gallery"}
             </button>
          </div>
        </div>
      </div>

      {/* --- EXISTING GALLERY LIST --- */}
      <div>
        <h3 className="font-bold text-xl mb-4">Current Gallery ({items.length})</h3>
        {fetching ? <p>Loading...</p> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border group relative">
                 <div className="h-40 rounded-lg overflow-hidden mb-3 bg-gray-100">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                 </div>
                 <h4 className="font-bold text-sm truncate">{item.title}</h4>
                 <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item.tag}</span>
                 
                 <button 
                   onClick={() => handleDelete(item.id)}
                   className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                 >
                   <Trash2 size={14} />
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLifeGallery;