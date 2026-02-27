import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit, Trash2, Plus, Search, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Blogs
  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching blogs:', error);
    else setBlogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    const { error } = await supabase.from('blogs').delete().eq('id', id);

    if (error) {
      alert('Error deleting: ' + error.message);
    } else {
      // Remove from local state immediately
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  // Filter Search
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Manage Articles</h1>
          <p className="text-gray-500">Edit or delete existing blog posts.</p>
        </div>
        <Link 
          to="/admin/add-blog" 
          className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Write New
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search articles by title..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
             <Loader className="animate-spin mb-2" /> Loading articles...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-sm font-bold text-gray-600">Cover</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Title</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Category</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Date</th>
                  <th className="p-4 text-sm font-bold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">No articles found.</td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <img 
                          src={blog.image_url || 'https://via.placeholder.com/50'} 
                          alt="cover" 
                          className="w-12 h-12 rounded-lg object-cover bg-gray-200"
                        />
                      </td>
                      <td className="p-4 font-medium text-zinc-900 max-w-xs truncate">{blog.title}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-bold">
                          {blog.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <Link 
                            to={`/admin/edit-blog/${blog.id}`} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          {/* Delete Button */}
                          <button 
                            onClick={() => handleDelete(blog.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;