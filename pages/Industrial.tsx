import React from 'react';
import { INDUSTRIES } from '../constants';
import * as Icons from 'lucide-react';

const Industrial: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero */}
      <div className="bg-brand-blue text-white py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
           <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-wider">SECTORS</span>
           <h1 className="text-4xl md:text-5xl font-bold mb-6">Industries We Serve</h1>
           <p className="text-xl text-blue-100 max-w-3xl mx-auto">
             Our fasteners are the backbone of diverse industries, from automotive assembly lines to high-rise construction.
           </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Industry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-24">
          {INDUSTRIES.map((industry, idx) => {
            // Dynamic icon rendering
            const IconComponent = (Icons as any)[industry.iconName] || Icons.Settings;
            
            return (
              <div key={idx} className="group flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-gray-500 group-hover:text-brand-blue group-hover:scale-110 transition-transform">
                  <IconComponent size={32} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base">{industry.name}</h3>
              </div>
            );
          })}
        </div>

        {/* Refer Us Section */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Who Can Refer Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Hardware Manufacturer",
              "Hardware Wholesaler & Showroom",
              "Kitchenware Manufacturer",
              "Builder",
              "Interior Designers & Architects",
              "Merchant Exporters",
              "OEM Requirement",
              "All Industries Requirement"
            ].map((referral, idx) => (
              <div key={idx} className="flex items-start gap-3">
                 <div className="mt-1 text-brand-yellow">
                   <Icons.CheckCircle size={20} />
                 </div>
                 <span className="font-medium text-gray-700">{referral}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Industrial;