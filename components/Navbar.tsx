import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Sparkles, ChevronDown, Package, Settings, 
  Home, Cpu, Factory, Users, BookOpen, Briefcase, 
  ArrowRight, Headset
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'OEM Platform', path: '/oem-platform', icon: <Cpu size={18} /> },
    { name: 'Manufacturing', path: '/manufacturing', icon: <Factory size={18} /> },
    { name: 'About Us', path: '/about', icon: <Users size={18} /> },
    { name: 'Blog', path: '/blog', icon: <BookOpen size={18} /> },
    { name: 'Careers', path: '/careers', icon: <Briefcase size={18} /> },
    { name: 'Contact Us', path:'/contact', icon: <Headset size={18} /> }
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 font-sans border-b ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-200 py-2' 
            : 'bg-white border-transparent py-2 md:py-4' 
        }`}
      >
        <div className="w-full px-4 xs:px-6 lg:px-10">
          
          {/* ADDED: flex-nowrap to prevent stacking into 3 lines */}
          <div className="flex flex-nowrap justify-between items-center h-24 md:h-[140px] transition-all duration-300">
          
            {/* LOGO SECTION - ADDED: flex-shrink-0 */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <img 
                  src="/durablelogo.png"
                  alt="Durable Fasteners" 
                  className="h-16 xs:h-18 md:h-[80px] w-auto object-contain transition-transform duration-300" 
                />
                <div className="h-12 xs:h-14 md:h-20 w-px bg-gray-300 mx-2"></div>
                <img 
                  src="/classone.png" 
                  alt="Classone" 
                  className="h-9 xs:h-16 md:h-[20px] w-auto object-contain mt-1"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </Link>
            </div>

            {/* DESKTOP MENU 
                CHANGED: 'xl:flex' to '2xl:flex' 
                Reason: Your menu is too long for standard xl screens. It will now only show on very large screens.
                On laptops (xl), it will remain hidden and show the hamburger instead.
            */}
            <div className="hidden 2xl:flex flex-1 justify-center items-center gap-2">
              <Link to="/" className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                 <Home size={18} /> <span className="whitespace-nowrap">Home</span>
              </Link>

              {/* Products Dropdown */}
              <div className="relative group px-1">
                <Link to="/products" className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${isActive('/products') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Package size={18} /> <span className="whitespace-nowrap">Products</span> <ChevronDown size={14} />
                </Link>
                
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[400px] bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
                    <div className="p-4 grid grid-cols-1 gap-2">
                     <Link to="/products/fasteners-segment" className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg">
                          <div className="bg-blue-100 p-2 rounded text-blue-600"><Settings size={18}/></div>
                          <div><h4 className="font-bold text-sm">Fasteners</h4><p className="text-xs text-gray-500">Screws & Bolts</p></div>
                      </Link>
                      <Link to="/products/fittings-segment" className="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-lg">
                          <div className="bg-orange-100 p-2 rounded text-orange-600"><Package size={18}/></div>
                          <div><h4 className="font-bold text-sm">Fittings</h4><p className="text-xs text-gray-500">Hardware Parts</p></div>
                      </Link>
                    </div>
                </div>
              </div>

              {navItems.map((item) => (
                 <Link key={item.name} to={item.path} className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                   {item.icon} <span className="whitespace-nowrap">{item.name}</span>
                 </Link>
              ))}
            </div>

            {/* ACTION BUTTONS & MOBILE HAMBURGER 
                ADDED: flex-shrink-0 to ensure these buttons NEVER get cut off 
            */}
            <div className="flex items-center space-x-2 xs:space-x-4 flex-shrink-0">
               {/* AI Finder */}
               <Link to="/ai-finder" className="hidden md:flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase text-white bg-slate-900 hover:bg-black whitespace-nowrap">
                 <Sparkles size={14} className="text-yellow-400" /> <span>AI Finder</span>
               </Link>
               
               {/* Quote Button */}
               <Link to="/contact" className="hidden sm:flex items-center gap-2 bg-[#fbbf24] text-black px-6 py-3 rounded-full text-xs font-bold uppercase hover:bg-yellow-300 whitespace-nowrap">
                 <span>Quote</span> <ArrowRight size={14} />
               </Link>

               {/* Mobile Menu Button 
                   CHANGED: 'xl:hidden' to '2xl:hidden'
                   It now shows on laptops (xl) too, preventing the menu from breaking.
               */}
               <div className="2xl:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-700 hover:bg-slate-100 rounded-full focus:outline-none">
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`2xl:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)}></div>
      
      <div className={`2xl:hidden fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-50 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="flex flex-col h-full overflow-y-auto p-5 pt-28 space-y-2">
             <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-600">
                <X size={24} />
             </button>

             <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl font-bold text-gray-700"><Home size={20}/> Home</Link>
             <Link to="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl font-bold text-gray-700"><Package size={20}/> Products</Link>
             
             {navItems.map((item) => (
                 <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl font-bold text-gray-600 transition">
                     {item.icon} {item.name}
                 </Link>
             ))}

             <div className="mt-8 flex flex-col gap-4">
                 <Link to="/contact" onClick={() => setIsOpen(false)} className="w-full py-4 bg-[#fbbf24] text-center font-bold rounded-xl text-black shadow-sm text-lg">Get Quote</Link>
                 <Link to="/ai-finder" onClick={() => setIsOpen(false)} className="w-full py-4 bg-slate-900 text-center font-bold rounded-xl text-white shadow-sm flex justify-center gap-2 text-lg">
                    <Sparkles size={20} className="text-yellow-400" /> AI Finder
                 </Link>
             </div>
         </div>
      </div>
    </>
  );
}

export default Navbar;