import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// 👇 1. Yahan 'Camera' icon add karein
import { LayoutDashboard, Package, Briefcase, MessageSquare, LogOut, FileText, Image, Camera, Layers, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const menuItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Overview', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      path: '/admin/products', 
      label: 'Product Manager', 
      icon: <Package size={20} /> 
    },
    { 
      path: '/admin/categories', 
      label: 'Categories', 
      icon: <Layers size={20} /> 
    },
    { 
      path: '/admin/site-content', 
      label: 'Home Page Images', 
      icon: <Image size={20} /> 
    },
    // 👇 2. YEH NAYA LINK ADD KAREIN (Yahan se sidebar mein dikhega)
    { 
      path: '/admin/life-gallery', 
      label: 'Life @ Durable', 
      icon: <Camera size={20} /> 
    },
    { 
      path: '/admin/blogs', 
      label: 'Blog Manager', 
      icon: <FileText size={20} /> 
    },
    { 
      path: '/admin/jobs', 
      label: 'Hiring & Jobs', 
      icon: <Briefcase size={20} /> 
    },
    // menuItems array mein ye add karein:

{ 
  path: '/admin/manage-oem', label: 'OEM Specs & Logistics', icon: <Settings size={20} /> 
},
    { 
      path: '/admin/enquiries', 
      label: 'Enquiries', 
      icon: <MessageSquare size={20} /> 
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0F172A] text-white fixed h-full z-10 hidden md:flex flex-col">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-black tracking-tight text-white">
            DURABLE<span className="text-yellow-500">ADMIN</span>
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto"> {/* Added overflow-y-auto incase list is long */}
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 md:ml-64 p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;