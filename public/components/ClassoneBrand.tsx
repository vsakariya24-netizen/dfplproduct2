import React from 'react';

// Replace this with the actual path to your uploaded logo image
// For example: '/images/classone-logo.png' or update the import if it's in src/assets
const classoneLogoPath = "/classone.png";

const ClassoneBrand: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Dark Brand Card */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] shadow-2xl">
          {/* Subtle Background Texture/Gradient (Optional) */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center p-16 text-center">
            {/* Logo Image 
              - We use `filter invert` to turn the black logo white for the dark background.
              - Adjust `h-20` (height) as needed.
            */}
            <img
              src={classoneLogoPath}
              alt="Classone"
              className="h-20 w-auto mb-8 filter invert brightness-200 contrast-125"
            />

            {/* Brand Tagline */}
            <h3 className="text-white text-sm md:text-base uppercase tracking-[0.25em] font-medium opacity-80">
              Premium Architectural Hardware
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassoneBrand;