import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Package, MessageSquare, LogOut, FileText } from 'lucide-react';

const AdminShell: React.FC = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    // 👇 NEW ITEM ADDED HERE
    { name: 'Post Article', path: '/admin/add-blog', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-black tracking-tighter text-white">
            DURABLE <span className="text-yellow-500">ADMIN</span>
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive 
                    ? 'bg-yellow-500 text-black shadow-lg' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg w-full transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header (Visible only on small screens) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 md:hidden flex justify-between items-center">
           <span className="font-bold text-zinc-900">Admin Panel</span>
           <button onClick={handleLogout}><LogOut size={20} /></button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminShell;