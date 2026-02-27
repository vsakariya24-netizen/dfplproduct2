import React, { useState } from 'react';
// Go up two levels (../../) to find the contexts folder
import { useProducts } from '../../contexts/ProductContext'; 
// Go up two levels (../../) to find the types file
import { Product, Specification, Variant } from '../../types'; 
import { Plus, Trash2, Save, Lock } from 'lucide-react';

// ... rest of your code ...

const Admin: React.FC = () => {
  const { products, addProduct, deleteProduct } = useProducts();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    id: `new-${Date.now()}`,
    name: '',
    category: 'Fasteners Segment',
    material: '',
    shortDescription: '',
    longDescription: '',
    images: ['https://picsum.photos/id/1/800/800'], // Default placeholder
    specifications: [],
    applications: [],
    variants: []
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('Invalid Password');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return alert('Name and Slug required');
    
    // Create minimal valid product
    const newProduct: Product = {
      ...formData as Product,
      id: `p-${Date.now()}`,
      slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-'),
      specifications: formData.specifications || [],
      applications: formData.applications || [],
      variants: formData.variants || [{ id: 'v1', sku: 'DEFAULT', diameter: 'Standard', length: 'Standard', finish: 'Standard', stock: 100 }]
    };

    addProduct(newProduct);
    alert('Product Added Successfully!');
    // Reset Name to avoid duplicates
    setFormData({ ...formData, name: '', slug: '' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
          <div className="flex justify-center mb-6 text-brand-dark"><Lock size={48} /></div>
          <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>
          <input 
            type="password" 
            placeholder="Enter Password (admin123)" 
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="w-full bg-brand-dark text-white py-3 rounded font-bold">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={20}/> Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Product Name</label>
              <input 
                className="w-full p-2 border rounded" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold mb-1">Slug (URL)</label>
                  <input className="w-full p-2 border rounded" placeholder="e.g. drywall-screw" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
               </div>
               <div>
                  <label className="block text-sm font-bold mb-1">Category</label>
                  <select className="w-full p-2 border rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Fasteners Segment</option>
                    <option>Door & Furniture Fittings</option>
                  </select>
               </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Description</label>
              <textarea className="w-full p-2 border rounded" rows={3} value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Material</label>
              <input className="w-full p-2 border rounded" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} />
            </div>
            
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded font-bold flex items-center justify-center gap-2 hover:bg-green-700">
              <Save size={18} /> Save Product
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-6">Existing Products ({products.length})</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {products.map(p => (
              <div key={p.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded" />
                  <div>
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.category}</div>
                  </div>
                </div>
                <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;