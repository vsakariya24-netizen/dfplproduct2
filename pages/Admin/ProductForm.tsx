import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash } from 'lucide-react';
import { CATEGORIES } from '../../constants'; // Fallback categories list

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Fasteners Segment',
    material: '',
    short_description: '',
    long_description: '',
    source_page: 0,
    images: [''],
    specifications: [] as { key: string; value: string }[],
    applications: [] as string[]
  });

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) {
      setFormData({
        ...data,
        images: data.images.length > 0 ? data.images : [''],
        specifications: data.specifications || [],
        applications: data.applications || []
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = val;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addSpec = () => {
    setFormData({ ...formData, specifications: [...formData.specifications, { key: '', value: '' }] });
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...formData.specifications];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Cleanup data
    const payload = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
      specifications: formData.specifications.filter(s => s.key && s.value),
    };

    let error;
    if (isEditing) {
      const { error: err } = await supabase.from('products').update(payload).eq('id', id);
      error = err;
    } else {
      const { error: err } = await supabase.from('products').insert([payload]);
      error = err;
    }

    setLoading(false);
    if (!error) {
      navigate('/admin/dashboard');
    } else {
      alert('Error saving product: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-200 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input 
              type="text" name="name" required value={formData.name} onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly)</label>
            <input 
              type="text" name="slug" required value={formData.slug} onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              name="category" value={formData.category} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
            >
              <option value="Fasteners Segment">Fasteners Segment</option>
              <option value="Door & Furniture Fittings">Door & Furniture Fittings</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <input 
              type="text" name="material" value={formData.material} onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
          <input 
            type="text" name="short_description" value={formData.short_description} onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
          <textarea 
            name="long_description" rows={4} value={formData.long_description} onChange={handleChange} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Main)</label>
          <input 
            type="text" 
            value={formData.images[0] || ''} 
            onChange={(e) => setFormData({...formData, images: [e.target.value, ...formData.images.slice(1)]})} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none mb-2"
            placeholder="https://..."
          />
        </div>

        {/* Dynamic Specifications */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Specifications</label>
            <button type="button" onClick={addSpec} className="text-xs text-brand-blue font-bold flex items-center gap-1">
              <Plus size={14} /> Add Spec
            </button>
          </div>
          <div className="space-y-2">
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  placeholder="Key (e.g. Size)" 
                  value={spec.key} 
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <input 
                  placeholder="Value (e.g. 5mm)" 
                  value={spec.value} 
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <button type="button" onClick={() => removeSpec(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-brand-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-colors flex items-center gap-2"
          >
            <Save size={18} /> {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProductForm;
