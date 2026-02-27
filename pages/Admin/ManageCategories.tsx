import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, Plus, Trash2, Layers, 
  ChevronRight, Loader2, AlertCircle, CornerDownRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Types ---
type Category = {
  id: string;
  name: string;
};

type SubCategory = {
  id: string;
  category_id: string;
  name: string;
};

type ChildCategory = {
  id: string;
  sub_category_id: string;
  name: string;
};

const ManageCategories: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [childCategories, setChildCategories] = useState<ChildCategory[]>([]); // Level 3 Data
  
  // Selection States
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null); // Level 2 Selection

  // Input States
  const [newCatName, setNewCatName] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newChildName, setNewChildName] = useState(''); // Level 3 Input
  
  const [actionLoading, setActionLoading] = useState(false);

  // --- 1. Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    const { data: subs } = await supabase.from('sub_categories').select('*').order('name');
    const { data: childs } = await supabase.from('child_categories').select('*').order('name'); // Fetch Level 3
    
    if (cats) setCategories(cats);
    if (subs) setSubCategories(subs);
    if (childs) setChildCategories(childs);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. Add Functions ---

  // Level 1: Main Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    setActionLoading(true);
    // Error ko destructure karke check karein
    const { data, error } = await supabase.from('categories').insert([{ name: newCatName }]).select();
    
    if (error) {
        console.error("Supabase Error:", error.message);
        alert("Error adding category: " + error.message); // User ko error dikhayein
    } else {
        setNewCatName(''); 
        fetchData(); 
    }
    setActionLoading(false);
  };

  // Level 2: Sub Category (Updated)
  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !selectedCatId) return;

    setActionLoading(true);
    const { error } = await supabase.from('sub_categories').insert([
      { name: newSubName, category_id: selectedCatId }
    ]);

    if (error) {
        console.error("Supabase Error:", error.message);
        alert("Error adding sub-category: " + error.message);
    } else {
        setNewSubName(''); 
        fetchData(); 
    }
    setActionLoading(false);
  };

  // Level 3: Child Category
  const handleAddChildCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim() || !selectedSubId) return;
    setActionLoading(true);
    const { error } = await supabase.from('child_categories').insert([
      { name: newChildName, sub_category_id: selectedSubId }
    ]);
    if (!error) { setNewChildName(''); fetchData(); }
    setActionLoading(false);
  };

  // --- 3. Delete Functions ---

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this segment? All sub-categories inside will be lost!')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
       if (selectedCatId === id) { setSelectedCatId(null); setSelectedSubId(null); }
       fetchData();
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    if (!window.confirm('Delete this sub-category?')) return;
    const { error } = await supabase.from('sub_categories').delete().eq('id', id);
    if (!error) {
        if (selectedSubId === id) setSelectedSubId(null);
        fetchData();
    }
  };

  const handleDeleteChildCategory = async (id: string) => {
    if (!window.confirm('Delete this item?')) return;
    const { error } = await supabase.from('child_categories').delete().eq('id', id);
    if (!error) fetchData();
  };

  // --- 4. Filtering Logic ---
  const activeSubList = subCategories.filter(s => s.category_id === selectedCatId);
  const activeChildList = childCategories.filter(c => c.sub_category_id === selectedSubId);

  const selectedCatName = categories.find(c => c.id === selectedCatId)?.name;
  const selectedSubName = subCategories.find(s => s.id === selectedSubId)?.name;

  return (
    <div className="max-w-[1400px] mx-auto pb-20 px-4">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Layers className="text-blue-600" /> Manage Categories
            </h1>
            <p className="text-gray-500 text-sm">Manage your 3-level hierarchy (Main {'>'} Sub {'>'} Child).</p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : (
        // CHANGED: grid-cols-3 for 3 levels
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* COLUMN 1: Main Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
                <div className="p-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded flex items-center justify-center text-xs">1</span>
                        Segments
                    </h3>
                    <form onSubmit={handleAddCategory} className="flex gap-2 mt-3">
                        <input 
                            type="text" placeholder="New Segment..." 
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                            value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                        />
                        <button disabled={actionLoading} type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                            <Plus size={18} />
                        </button>
                    </form>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {categories.map(cat => (
                        <div 
                            key={cat.id} 
                            onClick={() => { setSelectedCatId(cat.id); setSelectedSubId(null); }} // Reset sub selection
                            className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all ${
                                selectedCatId === cat.id ? 'bg-blue-50 border-blue-500 border' : 'bg-white hover:bg-gray-50 border border-transparent'
                            }`}
                        >
                            <span className={`font-medium text-sm ${selectedCatId === cat.id ? 'text-blue-700' : 'text-gray-700'}`}>{cat.name}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                <ChevronRight size={16} className={selectedCatId === cat.id ? 'text-blue-500' : 'text-gray-300'} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMN 2: Sub Categories */}
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px] transition-opacity ${!selectedCatId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                 <div className="p-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 w-6 h-6 rounded flex items-center justify-center text-xs">2</span>
                        Sub-Categories
                    </h3>
                    {selectedCatId && <p className="text-[10px] text-gray-500 mt-1">Inside: <b>{selectedCatName}</b></p>}
                    
                    <form onSubmit={handleAddSubCategory} className="flex gap-2 mt-3">
                        <input 
                            type="text" placeholder="New Sub..." 
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                            value={newSubName} onChange={(e) => setNewSubName(e.target.value)}
                        />
                        <button disabled={actionLoading} type="submit" className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
                            <Plus size={18} />
                        </button>
                    </form>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {activeSubList.length === 0 && <div className="text-center py-10 text-gray-400 text-xs">Empty</div>}
                    {activeSubList.map(sub => (
                        <div 
                            key={sub.id} 
                            onClick={() => setSelectedSubId(sub.id)}
                            className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all ${
                                selectedSubId === sub.id ? 'bg-green-50 border-green-500 border' : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                            }`}
                        >
                             <span className={`font-medium text-sm ${selectedSubId === sub.id ? 'text-green-700' : 'text-gray-700'}`}>{sub.name}</span>
                             <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteSubCategory(sub.id); }} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                <ChevronRight size={16} className={selectedSubId === sub.id ? 'text-green-500' : 'text-gray-300'} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMN 3: Child Categories (New Level) */}
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px] transition-opacity ${!selectedSubId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="p-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded flex items-center justify-center text-xs">3</span>
                        Child Categories
                    </h3>
                    {selectedSubId ? (
                        <p className="text-[10px] text-gray-500 mt-1">Inside: <b>{selectedSubName}</b></p>
                    ) : (
                        <p className="text-[10px] text-gray-400 mt-1">Select a sub-category...</p>
                    )}

                    <form onSubmit={handleAddChildCategory} className="flex gap-2 mt-3">
                        <input 
                            type="text" placeholder="New Child Item..." 
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                            value={newChildName} onChange={(e) => setNewChildName(e.target.value)}
                        />
                        <button disabled={actionLoading} type="submit" className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700">
                            <Plus size={18} />
                        </button>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                     {!selectedSubId ? (
                         <div className="flex flex-col items-center justify-center h-full text-gray-300">
                             <CornerDownRight size={32} className="mb-2"/>
                             <span className="text-xs">Select Level 2 first</span>
                         </div>
                     ) : activeChildList.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-xs">No child items yet.</div>
                     ) : (
                         activeChildList.map(child => (
                            <div key={child.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-sm text-gray-700">{child.name}</span>
                                <button 
                                    onClick={() => handleDeleteChildCategory(child.id)}
                                    className="text-gray-300 hover:text-red-500 p-1"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                         ))
                     )}
                </div>
            </div>

        </div>
      )}
    </div>
  );
};

export default ManageCategories;