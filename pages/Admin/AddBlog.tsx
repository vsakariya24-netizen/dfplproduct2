import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Trash2, ArrowLeft, Upload, X, Layout, Table as TableIcon, Type } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const AddBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Updated state: Default section now has a type
  const [sections, setSections] = useState<any[]>([{ type: 'text', heading: '', body: '' }]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical Guide',
    excerpt: '',
    author: 'Durable Editorial',
    image_url: ''
  });

  useEffect(() => {
    if (isEditing) {
      const fetchBlog = async () => {
        const { data } = await supabase.from('blogs').select('*').eq('id', id).single(); 
        if (data) {
          setFormData(data);
          setImagePreview(data.image_url);
          try { 
            const savedSections = JSON.parse(data.content);
            setSections(savedSections);
          } catch (err) {
            setSections([{ type: 'text', heading: '', body: data.content }]); 
          }
        }
      };
      fetchBlog();
    }
  }, [id, isEditing]);

  // Handler for adding different types of sections
  const addTextSection = () => setSections([...sections, { type: 'text', heading: '', body: '' }]);
  
  const addTableSection = () => setSections([...sections, { 
    type: 'table', 
    heading: '', 
    headers: ['Feature', 'Option A', 'Option B'],
    rows: [['Property', '', '']] 
  }]);

  const removeSection = (index: number) => setSections(sections.filter((_, i) => i !== index));

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        await supabase.storage.from('blog-images').upload(fileName, imageFile);
        finalImageUrl = supabase.storage.from('blog-images').getPublicUrl(fileName).data.publicUrl;
      }

      const payload = { 
        ...formData, 
        image_url: finalImageUrl,
        content: JSON.stringify(sections) 
      };

      const { error } = isEditing 
        ? await supabase.from('blogs').update(payload).eq('id', id) 
        : await supabase.from('blogs').insert([payload]);

      if (error) throw error;
      navigate('/admin/blogs');
    } catch (err: any) { 
      alert(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen bg-[#F9F9F9]">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* STICKY HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm sticky top-4 z-50">
          <Link to="/admin/blogs" className="text-zinc-400 hover:text-black flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
            <ArrowLeft size={16}/> BACK
          </Link>
          <button disabled={loading} className="bg-zinc-900 text-yellow-500 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-black transition-all">
            <Save size={18}/> {loading ? 'SAVING...' : 'PUBLISH BLOG'}
          </button>
        </div>

        {/* TITLE & IMAGE SECTION */}
        <div className="bg-white p-10 rounded-[3rem] border border-zinc-200 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block text-center">ARTICLE TITLE</label>
                    <textarea 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full text-3xl font-black border-none focus:ring-0 bg-zinc-50 rounded-2xl p-6 text-center"
                        placeholder="e.g. Drywall Screws vs Nails"
                    />
                </div>
                <div className="relative group aspect-video bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center cursor-pointer">
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview"/>
                            <button type="button" onClick={() => {setImagePreview(null); setImageFile(null);}} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg"><X size={16}/></button>
                        </>
                    ) : (
                        <div className="text-center">
                            <Upload className="text-zinc-300 mx-auto mb-2" size={32}/>
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Upload Cover</p>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                if(e.target.files?.[0]) {
                                    setImageFile(e.target.files[0]);
                                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                                }
                            }}/>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* DYNAMIC CONTENT BUILDER */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <Layout size={20} className="text-yellow-500"/> BUILD CONTENT SECTIONS
          </h3>

          {sections.map((section, index) => (
            <div key={index} className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm relative group hover:border-yellow-400 transition-all">
                <button type="button" onClick={() => removeSection(index)} className="absolute top-6 right-6 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18}/>
                </button>

                {section.type === 'table' ? (
                  /* TABLE EDITOR VIEW */
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <TableIcon size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Table Section</span>
                    </div>
                    <input 
                      type="text" 
                      value={section.heading} 
                      onChange={(e) => updateSection(index, 'heading', e.target.value)}
                      className="w-full text-xl font-black border-none bg-zinc-50 rounded-xl p-4 focus:ring-2 focus:ring-yellow-500/20"
                      placeholder="Table Title (e.g., Coarse vs Fine Threads)"
                    />
                    <div className="overflow-x-auto border border-zinc-200 rounded-xl">
                       <table className="w-full text-sm">
                         <thead>
                           <tr className="bg-zinc-100">
                             {section.headers.map((h: string, i: number) => (
                               <th key={i} className="p-3 border-r border-zinc-200 last:border-0">
                                 <input 
                                   className="bg-transparent font-bold w-full focus:outline-none text-zinc-700" 
                                   value={h} 
                                   onChange={(e) => {
                                     const newHeaders = [...section.headers];
                                     newHeaders[i] = e.target.value;
                                     updateSection(index, 'headers', newHeaders);
                                   }}
                                 />
                               </th>
                             ))}
                             <th className="w-10"></th>
                           </tr>
                         </thead>
                         <tbody>
                           {section.rows.map((row: string[], rowIndex: number) => (
                             <tr key={rowIndex} className="border-t border-zinc-200">
                               {row.map((cell: string, cellIndex: number) => (
                                 <td key={cellIndex} className="p-3 border-r border-zinc-200 last:border-0">
                                    <input 
                                      className="w-full focus:outline-none bg-transparent" 
                                      value={cell} 
                                      onChange={(e) => {
                                        const newRows = [...section.rows];
                                        newRows[rowIndex][cellIndex] = e.target.value;
                                        updateSection(index, 'rows', newRows);
                                      }}
                                    />
                                 </td>
                               ))}
                               <td className="p-2 text-center">
                                 <button type="button" onClick={() => {
                                   const newRows = section.rows.filter((_: any, i: number) => i !== rowIndex);
                                   updateSection(index, 'rows', newRows);
                                 }} className="text-red-300 hover:text-red-500"><X size={14}/></button>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                    </div>
                    <div className="flex gap-4">
                        <button 
                          type="button"
                          onClick={() => updateSection(index, 'rows', [...section.rows, Array(section.headers.length).fill('')])}
                          className="text-[10px] font-black text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                        >
                          <Plus size={12}/> ADD ROW
                        </button>
                    </div>
                  </div>
                ) : (
                  /* TEXT EDITOR VIEW */
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <Type size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Text Section</span>
                    </div>
                    <input 
                      type="text" 
                      value={section.heading} 
                      onChange={(e) => updateSection(index, 'heading', e.target.value)}
                      placeholder="Section Heading (e.g. Why Confusion Exists)"
                      className="w-full text-xl font-black border-none focus:ring-2 focus:ring-yellow-500/20 bg-zinc-50 rounded-xl p-4"
                    />
                    <textarea 
                      value={section.body} 
                      onChange={(e) => updateSection(index, 'body', e.target.value)}
                      placeholder="Detailed content for this section..."
                      rows={5}
                      className="w-full text-lg border-none focus:ring-2 focus:ring-yellow-500/20 bg-zinc-50 rounded-xl p-4 font-serif leading-relaxed"
                    />
                  </div>
                )}
            </div>
          ))}

          {/* ADD SECTION BUTTONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
                type="button" 
                onClick={addTextSection}
                className="py-6 border-2 border-dashed border-zinc-200 rounded-[2rem] text-zinc-400 font-black flex items-center justify-center gap-2 hover:bg-zinc-100 hover:border-zinc-300 transition-all"
            >
                <Plus size={20}/> ADD TEXT SECTION
            </button>
            <button 
                type="button" 
                onClick={addTableSection}
                className="py-6 border-2 border-dashed border-zinc-200 rounded-[2rem] text-zinc-400 font-black flex items-center justify-center gap-2 hover:bg-zinc-100 hover:border-zinc-300 transition-all"
            >
                <TableIcon size={20}/> ADD COMPARISON TABLE
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;