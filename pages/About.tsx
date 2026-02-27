import React, { useEffect, useRef, useState } from 'react';
import { Target, Eye, Heart, TrendingUp, Award, MapPin, Users, Calendar, ArrowUpRight, CheckCircle2, Factory, Crown, Star, Sparkles, MoveRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async'; // 👈 Add this
// --- Helper Components for Animation ---

const RevealSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  // Note: Ensure your global CSS has .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s; } .reveal.active { opacity: 1; transform: translateY(0); }
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
};

const useCounter = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) setHasStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration, start]);

  return { count, ref };
};

const About: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const statOfficeStart = useCounter(35, 1500);
  const statOfficeNow = useCounter(7000, 2500);
  const statSuppliers = useCounter(350, 2000);

  return (
    <div className="bg-[#fcfcfc] min-h-screen overflow-x-hidden font-sans text-gray-900">
      <Helmet>
        {/* 1. Story & Trust-Building Title */}
        <title>About Durable Fastener | 15+ Years of Manufacturing Excellence in Rajkot</title>
        
        <meta 
          name="description" 
          content="Founded in 2018, Durable Fastener Pvt Ltd has grown from a small workshop to a massive 7000 sq. ft. manufacturing hub in Rajkot. ISO 9001:2015 Certified." 
        />
        
        <meta 
          name="keywords" 
          content="durable fastener history, about durable fastener pvt ltd, screw manufacturer rajkot, fastener factory india, industrial hardware company profile" 
        />

        {/* 2. ABOUT PAGE SCHEMA (Entity Identity) */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "mainEntity": {
                "@type": "Organization",
                "name": "Durable Fastener Pvt Ltd",
                "alternateName": "Durable Enterprise",
                "foundingDate": "2018",
                "description": "Leading manufacturer of high-tensile industrial fasteners and architectural hardware.",
                "logo": "https://durablefastener.com/durablefastener.png",
                "founder": {
                  "@type": "Person",
                  "name": "Khushi Chovatiya"
                },
                "location": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Rajkot",
                    "addressRegion": "Gujarat",
                    "addressCountry": "IN"
                  }
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+91 87587 00709",
                  "contactType": "sales",
                  "areaServed": "IN"
                },
                "sameAs": [
                  "https://www.facebook.com/durablefastener",
                  "https://www.linkedin.com/company/durablefastener"
                ]
              }
            }
          `}
        </script>
      </Helmet>
      {/* 1. POWER HERO SECTION */}
      <div className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-[#0a0f1a] text-white">
        <div 
          className="absolute inset-0 opacity-30 z-0 grayscale"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${1 + offsetY * 0.0005}) translateY(${offsetY * 0.2}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-black/60 z-10" />
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 z-10 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <RevealSection>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-xs font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-xl shadow-2xl">
               Engineering Trust Since 2018
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              THE ART OF <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-600">
                STRENGTH
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              We started in a 35 sq. ft. room with a big dream. Today, we anchor the infrastructure of a nation through <span className="text-white font-medium">Precision Fastening solutions.</span>
            </p>
          </RevealSection>
        </div>
      </div>

      {/* 2. SCALE DASHBOARD (Animated Stats) */}
      <section className="relative z-30 -mt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col items-center group transition-all duration-500 hover:border-amber-500/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 group-hover:text-amber-500 transition-colors">Foundation</div>
              <div className="text-5xl font-black text-slate-900 mb-2" ref={statOfficeStart.ref}>
                {statOfficeStart.count}<span className="text-lg text-slate-300 ml-1">SQ FT</span>
              </div>
              <div className="h-1 w-8 bg-slate-100 rounded-full group-hover:w-16 transition-all"></div>
              <p className="mt-4 text-slate-500 text-sm font-medium">Initial Office (2018)</p>
            </div>

            <div className="bg-[#111827] p-10 rounded-[2.5rem] shadow-2xl border-t-4 border-amber-500 flex flex-col items-center transform scale-105 z-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-16 bg-amber-500/10 blur-[80px] rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4">Current Hub</div>
              <div className="relative z-10 text-7xl font-black text-white mb-2" ref={statOfficeNow.ref}>
                {statOfficeNow.count}<span className="text-xl text-amber-500 ml-1">FT²</span>
              </div>
              <p className="relative z-10 mt-4 text-slate-400 text-sm font-light tracking-wide uppercase">Industrial Powerhouse</p>
            </div>

            <div className="bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col items-center group transition-all duration-500 hover:border-blue-500/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 group-hover:text-blue-500 transition-colors">Market Presence</div>
              <div className="text-5xl font-black text-slate-900 mb-2" ref={statSuppliers.ref}>
                {statSuppliers.count}<span className="text-amber-500 ml-1">+</span>
              </div>
              <div className="h-1 w-8 bg-slate-100 rounded-full group-hover:w-16 transition-all"></div>
              <p className="mt-4 text-slate-500 text-sm font-medium">B2B Network Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVOLUTION TIMELINE (High-End Industrial Design) */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">The Evolution</h2>
            <div className="h-2 w-24 bg-gradient-to-r from-amber-500 to-yellow-200 rounded-full"></div>
          </div>

          <div className="relative">
            {/* Timeline Center Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-slate-800/50 hidden md:block"></div>

            {/* Timeline Item 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between mb-32 group">
              <div className="md:w-[45%] text-right pr-0 md:pr-12">
                <span className="text-amber-600 font-black text-xs tracking-widest uppercase">Aug 2018</span>
                <h3 className="text-3xl font-black text-slate-900 mt-2 mb-4">Durable Enterprise</h3>
                <p className="text-slate-500 font-light leading-relaxed">
                  The journey began as a proprietorship with one machine and a vision to fix the inconsistencies in the architectural hardware market.
                </p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-[6px] border-slate-100 rounded-full z-10 hidden md:flex items-center justify-center group-hover:border-amber-500 transition-colors">
                <Sparkles size={16} className="text-amber-500" />
              </div>
              <div className="md:w-[45%] pl-0 md:pl-12 mt-8 md:mt-0">
                <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-xl border border-white group-hover:scale-105 transition-all duration-500">
                  <img src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Origin" />
                </div>
              </div>
            </div>

            {/* Timeline Item 2 - Reverse */}
            <div className="relative flex flex-col md:flex-row items-center justify-between mb-32 group">
              <div className="md:w-[45%] order-2 md:order-1 pr-0 md:pr-12 mt-8 md:mt-0">
                <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-xl border border-white group-hover:scale-105 transition-all duration-500">
                  <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Scale" />
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-[6px] border-slate-100 rounded-full z-10 hidden md:flex items-center justify-center group-hover:border-blue-500 transition-colors">
                <TrendingUp size={16} className="text-blue-500" />
              </div>
              <div className="md:w-[45%] order-1 md:order-2 pl-0 md:pl-12 text-left">
                <span className="text-blue-600 font-black text-xs tracking-widest uppercase">Transition Era</span>
                <h3 className="text-3xl font-black text-slate-900 mt-2 mb-4">Pvt. Ltd. Incorporation</h3>
                <p className="text-slate-500 font-light leading-relaxed">
                  Expanding our horizons, we formalized as Durable Fastener Pvt. Ltd. This shift allowed us to handle bulk OEM contracts and global quality standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BRAND ASPIRATION (Luxury Highlight) - UPDATED WITH IMAGE */}
      <section className="py-32 bg-[#0a0f1a] relative overflow-hidden">
        <div className="absol0ute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-amber-500 text-xs font-black tracking-[0.5em] uppercase mb-4">Our Flagship Jewel</h2>
            <div className="flex justify-center mb-8">
               <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            </div>
          </div>

          <div className="relative group cursor-default">
            {/* LOGO IMAGE REPLACEMENT */}
            <div className="text-center">
                {/* IMPORTANT: 'filter invert brightness-0' turns the black logo white.
                    Adjust 'max-w-[500px]' to change the size of the logo.
                */}
                <img s
                  src="classone.png" 
                  alt="Classone Logo" 
                  className="mx-auto w-full max-w-[600px] h-auto filter invert brightness-0 opacity-90 mb-8"
                />

                <p className="text-amber-500/60 tracking-[1em] uppercase text-sm md:text-lg font-black">Architectural Hardware</p>
            </div>

            {/* Glowing Backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-32 bg-amber-500/10 blur-[100px] -z-10"></div>
          </div>

        <div className="grid md:grid-cols-3 gap-12 mt-32">
  {[
    { icon: Crown, title: "No.1 Aspiration", text: "Leading the industry forward with cutting-edge technology and unparalleled quality, aiming for global excellence in every fastener produced." },
    { icon: Users, title: "Customer First", text: "Dedicated to exceeding customer expectations by providing tailored solutions, reliable support, and products that meet the highest standards of satisfaction." },
    { icon: Heart, title: "Legacy Built", text: "Decades of expertise within our fastener manufacturing facility, producing international-grade hardware." }
  ].map((item, i) => (
    <div key={i} className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
      <item.icon className="mx-auto text-amber-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
      <h4 className="text-white font-black mb-3">{item.title}</h4>
      
      {/* Change this part below */}
      <p className="text-slate-400 text-lg font-light leading-relaxed max-w-sm">
        {item.text}
      </p>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* 5. BENTO ADVANTAGE GRID */}
      <section className="py-32 px-6">  
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-amber-600 font-black text-xs tracking-widest uppercase">The Durable Edge</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-2 tracking-tighter italic">Why Choose Us?</h2>
            </div>
            <div className="hidden md:block">
               <div className="flex items-center gap-2 text-slate-400 text-sm italic">
                 Scroll for more <MoveRight size={16} />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 bg-slate-900 p-12 rounded-[3rem] text-white relative overflow-hidden group">
               <div className="relative z-10">
                <Calendar size={48} className="text-amber-500 mb-8" />
                <h3 className="text-5xl font-black mb-4 tracking-tighter">13+ Years</h3>
                <p className="text-slate-400 text-lg font-light leading-relaxed max-w-sm">
                  Decades of metallurgical expertise combined into every single fastener we produce.
                </p>
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Factory size={300} />
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
              <CheckCircle2 size={40} className="text-green-500 mb-6" />
              <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tighter ">Quality 1ˢᵗ</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Multi-stage testing ensuring zero-defect delivery for critical OEM lines.</p>
            </div>

            <div className="bg-amber-500 p-10 rounded-[3rem] shadow-xl hover:scale-[1.02] transition-all group">
              <Target size={40} className="text-black mb-6" />
              <h4 className="text-2xl font-black text-black mb-3 tracking-tighter ">Factory Direct</h4>
              <p className="text-black/70 text-sm leading-relaxed font-bold italic">Unbeatable pricing by eliminating every middleman from the supply chain.</p>
            </div>

            {/* Bottom Row */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
              <Users size={32} className="text-blue-500 mb-6" />
              <h4 className="text-xl font-black text-slate-900 mb-2  tracking-tighter">Expert Team</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Skilled engineers managing high-precision threading and heading.</p>
            </div>

            <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl">
              <div className="p-6 bg-white/10 rounded-3xl backdrop-blur-md">
                <MapPin size={40} className="text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2  tracking-tighter italic">Pan-India Mission</h4>
                <p className="text-white/80 text-sm font-light leading-relaxed">Our goal is to be present in every district of India through our vast dealer network by 2030.</p>
              </div>
            </div>

            <div className="bg-slate-100 p-10 rounded-[3rem] border-2 border-dashed border-slate-300 flex flex-col justify-center items-center text-center group hover:bg-white hover:border-amber-500 transition-all">
               <ArrowUpRight size={40} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
               <h4 className="mt-4 text-slate-900 font-black uppercase tracking-tighter">Full Support</h4>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default About;