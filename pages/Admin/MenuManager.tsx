import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Link as LinkIcon, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // ⚠️ Apne Database client ka path yaha lagaye

// Icons ki list jo Admin select kar sakega
const AVAILABLE_ICONS = ['Cpu', 'Factory', 'Users', 'BookOpen', 'Heart', 'Briefcase', 'Home', 'Settings'];

interface MenuItem {
  id: number;
  label: string;
  path: string;
  icon_key: string;
}

const MenuManager = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Item State
  const [newItem, setNewItem] = useState({ label: '', path: '', icon_key: 'Cpu' });

  // 1. Fetch Links
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*').order('id');
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add Link
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.label || !newItem.path) return;

    try {
      const { error } = await supabase.from('menu_items').insert([newItem]);
      if (error) throw error;
      
      setNewItem({ label: '', path: '', icon_key: 'Cpu' }); // Reset form
      fetchMenuItems(); // Refresh list
      alert('Link added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // 3. Delete Link
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this link?')) return;
    
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Website Menu Manager</h2>

      {/* --- ADD NEW FORM --- */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Plus size={20} className="text-blue-600" /> Add New Menu Link
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Label Name</label>
            <input 
              type="text" 
              placeholder="e.g. Services" 
              className="w-full border rounded-lg p-2"
              value={newItem.label}
              onChange={e => setNewItem({...newItem, label: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link Path</label>
            <input 
              type="text" 
              placeholder="e.g. /services" 
              className="w-full border rounded-lg p-2"
              value={newItem.path}
              onChange={e => setNewItem({...newItem, path: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
            <select 
              className="w-full border rounded-lg p-2"
              value={newItem.icon_key}
              onChange={e => setNewItem({...newItem, icon_key: e.target.value})}
            >
              {AVAILABLE_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>

          <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2 font-bold">
            <Save size={18} /> Add to Menu
          </button>
        </form>
      </div>

      {/* --- LIST EXISTING LINKS --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
          Current Active Links
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading menu items...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No links found. Add one above!</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {item.icon_key}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.label}</h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded border">
                      {item.path}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Link"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManager;