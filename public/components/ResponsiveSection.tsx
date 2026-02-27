
import React from 'react';

export default function ResponsiveSection() {
  return (
    // OUTER CONTAINER: Padding adjust hoti hai screen ke hisab se
    // Mobile: px-4 (Kam jagah lega) | Laptop: px-12 (Jyada space dega)
    <div className="w-full bg-white px-4 py-8 xs:px-6 md:px-12 lg:px-20 overflow-hidden">
      
      {/* FLEX CONTAINER:
          Mobile: flex-col (Upar Niche)
          Laptop: flex-row (Aaju Baju) 
          gap-6: Elements ke bich space
      */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12">
        
        {/* --- LEFT SIDE: IMAGE --- */}
        {/* w-full: Mobile pe full width 
            md:w-1/2: Laptop pe aadha width */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-100 rounded-xl p-2 border border-gray-200 shadow-sm">
            {/* object-contain: Pura image dikhega, kategi nahi */}
            <img 
              src="/screw-image.png" 
              alt="Durable Fastener" 
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* --- RIGHT SIDE: CONTENT --- */}
        <div className="w-full md:w-1/2 text-left">
          
          {/* BADGE: Choti screen pe text size adjust */}
          <span className="inline-block bg-brand-yellow/20 text-brand-dark px-3 py-1 rounded-full text-xs xs:text-sm font-semibold mb-3">
            Premium Quality
          </span>

          {/* HEADING: 
              text-2xl (Mobile) -> text-4xl (Laptop) 
              break-words: Taaki text screen se bahar na jaye
          */}
          <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold text-brand-dark mb-4 leading-tight break-words">
            Precision Engineering for Heavy Industry
          </h2>

          {/* PARAGRAPH: Mobile text thoda chota (text-sm), Laptop pe bada (text-base) */}
          <p className="text-sm xs:text-base text-gray-600 mb-6 leading-relaxed">
            Humare fasteners Rajkot mein banaye jate hain aur puri duniya mein export hote hain. 
            High tensile strength aur rust-proof coating ke sath.
            <br className="hidden md:block" /> {/* Sirf laptop pe new line layega */}
            Quality jo trust banaye.
          </p>

          {/* BUTTON GROUP: Mobile pe full width buttons, Laptop pe auto width */}
          <div className="flex flex-col xs:flex-row gap-3">
            <button className="w-full xs:w-auto bg-brand-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition shadow-lg text-sm xs:text-base">
              Download Catalog
            </button>
            <button className="w-full xs:w-auto border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition text-sm xs:text-base">
              Contact Sales
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}