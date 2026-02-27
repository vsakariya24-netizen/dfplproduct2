import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { Plus, Search, Edit, Trash2, Loader2, Eye, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Check if user is searching
  const isSearching = searchTerm.trim().length > 0;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('position', { ascending: true });
    
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

 const onDragEnd = async (result: DropResult) => {
  if (!result.destination || isSearching) return;

  const items: Product[] = Array.from(products);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  setProducts(items);

  // Use Promise.all to update positions one by one safely
  try {
    const updatePromises = items.map((product, index) =>
      supabase
        .from('products')
        .update({ position: index }) // ONLY update position
        .eq('id', product.id)
    );

    const results = await Promise.all(updatePromises);
    
    // Check if any update failed
    const error = results.find(r => r.error);
    if (error) throw error.error;

  } catch (error: any) {
    console.error('Reorder Error:', error);
    alert(`Update failed: ${error.message}`);
    fetchProducts(); // Rollback UI if DB fails
  }
};

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) setProducts(products.filter(p => p.id !== id));
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            {isSearching ? 'Clear search to reorder' : 'Drag handle to reorder inventory'}
          </p>
        </div>
        <Link to="/admin/products/new" className="bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-blue" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <DragDropContext onDragEnd={onDragEnd}>
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 w-10"></th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              
              <Droppable droppableId="products-table-body" isDropDisabled={isSearching}>
                {(provided) => (
                  <tbody 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    className="divide-y divide-gray-100"
                  >
                    {filtered.map((p, index) => (
                      <Draggable 
                        key={p.id} 
                        draggableId={String(p.id)} 
                        index={index}
                        isDragDisabled={isSearching} // Disable drag when searching
                      >
                        {(provided, snapshot) => (
                          <tr 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'bg-blue-50 shadow-lg z-50 relative' : 'hover:bg-gray-50'}`}
                          >
                            <td className="px-6 py-3">
                              {/* Drag handle only works if NOT searching */}
                              {!isSearching ? (
                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-500">
                                  <GripVertical size={20} />
                                </div>
                              ) : (
                                <div className="text-gray-200"><GripVertical size={20} /></div>
                              )}
                            </td>
                            <td className="px-6 py-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border">
                                {p.images?.[0] ? (
                                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                ) : <div className="text-xs text-gray-400 text-center pt-4">No Img</div>}
                              </div>
                            </td>
                            <td className="px-6 py-3 font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Link to={`/product/${p.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600"><Eye size={18} /></Link>
                                <Link to={`/admin/products/edit/${p.id}`} className="p-2 text-gray-400 hover:text-orange-600"><Edit size={18} /></Link>
                                <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </table>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default ProductList;