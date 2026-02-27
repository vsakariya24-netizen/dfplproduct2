import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Factory, Anvil, Flame, Layers, Microscope, Truck, 
  ShieldCheck, CheckCircle2, Package, Settings, 
  Activity, ArrowRight, ArrowDown, ArrowLeft, FileCheck, Scale, Play, Video,
  Globe
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';

// --- REUSABLE ANIMATION COMPONENT ---
const RevealOnScroll: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ 
  children, 
  delay = 0, 
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const Manufacturing: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadContent = async () => {
      const { data, error } = await supabase
        .from('manufacturing_content')
        .select('*')
        .eq('id', 1) 
        .single();
        
      if (error) console.error("Error loading factory data:", error);
      if (data) setData(data);
    };
    loadContent();
  }, []);

  // --- PROCESS STEPS DATA ---
  const steps = [
    { id: "01", title: "Raw Material Inspection", icon: FileCheck },
    { id: "02", title: "Wire Drawing & Annealing", icon: Activity },
    { id: "03", title: "Cold Heading (Forging)", icon: Anvil },
    { id: "04", title: "Thread Rolling", icon: Settings },
    { id: "05", title: "Heat Treatment", icon: Flame },
    { id: "06", title: "Surface Coating", icon: Layers },
    { id: "07", title: "Optical Sorting", icon: Microscope },
    { id: "08", title: "Packing & Dispatch", icon: Truck },
  ];

  // --- HELPER: SNAKE LAYOUT LOGIC ---
  // This maps the steps to the "S-Shape" grid positions
  const getGridPosition = (index: number) => {
    const positions = [
      "md:col-start-1 md:row-start-1", // 01
      "md:col-start-2 md:row-start-1", // 02
      "md:col-start-3 md:row-start-1", // 03
      "md:col-start-4 md:row-start-1", // 04 (Turns Down)
      "md:col-start-4 md:row-start-2", // 05 (Starts Backwards)
      "md:col-start-3 md:row-start-2", // 06
      "md:col-start-2 md:row-start-2", // 07
      "md:col-start-1 md:row-start-2", // 08
    ];
    return positions[index];
  };

  return (
    <div className="bg-white min-h-screen pt-20 font-sans text-slate-800 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Helmet>
        <title>Fastener Manufacturing Factory in Rajkot | Durable Fastener</title>
        <meta name="description" content="Inside Durable Fastener's Rajkot factory: Explore our Cold Forging, Thread Rolling, and Heat Treatment lines." />
      </Helmet>

      {/* ================= 1. HERO SECTION ================= */}
      <div className="relative py-32 md:py-48 bg-slate-900 overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565193566173-7a641a980755?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20 transition-transform duration-[20s] group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="max-w-4xl">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold mb-8 uppercase tracking-widest">
                    <Globe size={16} /> Global Supply Chain & Quality Hub
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                    {data?.hero_title || <>PRODUCTION <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-300">EXCELLENCE</span></>}
                </h1>
              </RevealOnScroll>
              <RevealOnScroll delay={200}>
                <p className="text-xl md:text-2xl text-slate-300 mb-10 font-medium leading-relaxed border-l-4 border-blue-600 pl-8 max-w-2xl">
                    {data?.hero_subtitle || "From technical blueprints to global delivery. We manage a high-precision manufacturing ecosystem with Total Quality Supervision."}
                </p>
              </RevealOnScroll>
              <RevealOnScroll delay={300}>
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link to="/Products" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 hover:-translate-y-1">
                    View Production Standards <ArrowRight size={22} />
                  </Link>
                  <a href="/public/Durable Fastener Pvt. Ltd. Catalogue.pdf" download className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all border border-white/20 flex items-center justify-center gap-3 hover:-translate-y-1 backdrop-blur-sm">
                    Download Capability Profile
                  </a>
                </div>
              </RevealOnScroll>
            </div>
        </div>
      </div>

      {/* ================= 2. MANUFACTURING OVERVIEW ================= */}
      <section className="py-24 px-6 bg-slate-50">
        <RevealOnScroll>
           <div className="max-w-4xl mx-auto text-center">
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
                 {data?.overview_title || "Built for Scale & Precision"}
               </h2>
               <p className="text-xl md:text-2xl text-slate-600 leading-9 font-normal">
                 {data ? (
                   <span 
                     className="[&>strong]:text-blue-600 [&>strong]:font-bold [&>u]:text-slate-900 [&>u]:font-bold [&>u]:no-underline [&>u]:border-b-2 [&>u]:border-blue-700"
                     dangerouslySetInnerHTML={{ __html: data.overview_desc }} 
                   />
                 ) : ( "Loading factory details..." )}
               </p>
           </div>
        </RevealOnScroll>
      </section>

      {/* ================= 3. VIRTUAL FACTORY TOUR ================= */}
      <section className="py-24 bg-white border-y border-slate-200">
         <div className="max-w-7xl mx-auto px-6">
            <RevealOnScroll>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                   <div>
                      <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Production Floor</h2>
                      <p className="text-lg text-slate-500">See our high-speed headers in action.</p>
                   </div>
                  
                </div>
            </RevealOnScroll>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: data?.video1_title || "Cold Heading Line", sub: data?.video1_sub || "180 PPM Speed", img: data?.video1_img || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" },
                  { title: data?.video2_title || "Thread Rolling", sub: data?.video2_sub || "Precision Dies",  img: data?.video2_img || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop" },
                  { title: data?.video3_title || "Optical Sorting", sub: data?.video3_sub || "Zero Defect Check",  img: data?.video3_img || "https://plus.unsplash.com/premium_photo-1661962692059-55d5a4319814?q=80&w=2070&auto=format&fit=crop" }
                ].map((item, index) => (
                  <RevealOnScroll key={index} delay={index * 150} className="h-full">
                      <div className="group relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl cursor-pointer h-full border-4 border-white">
                          <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${item.img})` }}></div>
                          <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-transparent transition-all"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center pl-1 border border-white group-hover:bg-blue-600 group-hover:border-blue-600 transition-all shadow-xl">
                                <Play fill="currentColor" className="text-blue-600 group-hover:text-white" size={28} />
                             </div>
                          </div>
                         
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-6 pt-12">
                             <p className="text-white font-bold text-xl">{item.title}</p>
                             <p className="text-sm text-blue-300 font-medium">{item.sub}</p>
                          </div>
                      </div>
                  </RevealOnScroll>
                ))}
            </div>
         </div>
      </section>

      {/* ================= 4. COMPLETE MANUFACTURING FLOW (NEW DESIGN) ================= */}
      <section className="py-24 bg-white overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <RevealOnScroll>
                <div className="text-center mb-24">
                   <h2 className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm mb-3">The Process</h2>
                   <h3 className="text-4xl md:text-5xl font-black text-slate-900">End-to-End Production Flow</h3>
                   <div className="w-24 h-1.5 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                </div>
            </RevealOnScroll>

            {/* Grid Layout: Snake Design with BLUE VISUALS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-20 relative">
                {steps.map((step, i) => (
                  <div key={i} className={`relative ${getGridPosition(i)}`}>
                      <RevealOnScroll delay={i * 100} className="h-full z-10 relative">
                          {/* UPDATED CARD DESIGN: White bg, Blue Border, Rounded Corners */}
                          <div className="bg-white border-2 border-blue-100 p-8 rounded-3xl relative group hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] transition-all duration-300 h-full flex flex-col items-center text-center z-20">
                             
                             {/* Number Design: Large, Blue, Top Right */}
                             <span className="absolute top-5 right-6 text-4xl font-black text-blue-200 group-hover:text-blue-500 transition-colors">
                               {step.id}
                             </span>

                             {/* Icon Design: Blue text, subtle background */}
                             <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <step.icon size={36} strokeWidth={1.5} />
                             </div>

                             <h4 className="text-slate-900 font-bold text-lg leading-snug">{step.title}</h4>
                          </div>
                      </RevealOnScroll>

                      {/* === CONNECTORS (Styled Blue Arrows with QC Bubbles) === */}
                      
                      {/* 1. Right Arrows (Steps 1, 2, 3) */}
                      {[0, 1, 2].includes(i) && (
                        <div className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12">
                          {/* QC Bubble */}
                          <div className="absolute -top-3 bg-blue-500 text-white text-[10px] font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md z-20 border-2 border-white">QC</div>
                          <ArrowRight size={44} strokeWidth={1} className="text-blue-300" />
                        </div>
                      )}

                      {/* 2. Down Arrow (Step 4 -> Step 5) */}
                      {i === 3 && (
                        <div className="hidden md:flex flex-col items-center absolute -bottom-16 left-1/2 -translate-x-1/2 z-10 h-16 justify-center">
                          <div className="absolute top-2 left-4 bg-blue-500 text-white text-[10px] font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md z-20 border-2 border-white">QC</div>
                          <ArrowDown size={44} strokeWidth={1} className="text-blue-300" />
                        </div>
                      )}

                      {/* 3. Left Arrows (Steps 5, 6, 7) */}
                      {[4, 5, 6].includes(i) && (
                        <div className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12">
                          <div className="absolute -top-3 bg-blue-500 text-white text-[10px] font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md z-20 border-2 border-white">QC</div>
                          <ArrowLeft size={44} strokeWidth={1} className="text-blue-300" />
                        </div>
                      )}

                      {/* === MOBILE CONNECTORS === */}
                      {i !== steps.length - 1 && (
                        <div className="md:hidden absolute -bottom-14 left-1/2 -translate-x-1/2 text-blue-300 flex flex-col items-center z-0">
                           <div className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full mb-1">QC Check</div>
                           <ArrowDown size={24} />
                        </div>
                      )}
                  </div>
                ))}
            </div>
         </div>
      </section>

      {/* ================= 6. RAW MATERIAL ================= */}
      <section className="py-24 px-6 bg-slate-50">
         <RevealOnScroll>
             <div className="max-w-7xl mx-auto bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800">
                <div className="grid md:grid-cols-2">
                   <div className="p-12 md:p-16">
                      <h2 className="text-4xl font-black text-white mb-6">Raw Material Integrity</h2>
                      <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                          Quality starts with the wire. We source exclusively from premium mills like <span className="text-white font-bold border-b-2 border-blue-600">JSW, TATA Steel</span>.
                      </p>
                      <ul className="space-y-4">
                          {["Grade Control: C1022,C1010,C1008,C1018,SS204,SS316,SS304", "Full Chemical Traceability (Heat No.)", "Incoming Wire Testing Lab"].map((item, i) => (
                              <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                                  <CheckCircle2 className="text-blue-400 shrink-0" size={24}/> {item}
                              </li>
                          ))}
                      </ul>
                   </div>
                   <div className="relative h-80 md:h-auto min-h-[400px]">
                       <img src="/public/factoryimage.jpg" alt="Raw material wire" className="absolute inset-0 w-full h-full object-cover opacity-60"/>
                       <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
                   </div>
                </div>
             </div>
         </RevealOnScroll>
      </section>

      {/* ================= 7. HEAT TREATMENT & COATING ================= */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-12">
            <RevealOnScroll delay={0}>
                <div className="relative p-10 md:p-12 bg-white rounded-[2rem] border border-slate-200 overflow-hidden group h-full shadow-sm hover:shadow-xl transition-all">
                   <div className="relative z-10">
                       <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-blue-600 transition-colors"><Flame size={32} /></div>
                       <h3 className="text-3xl font-black text-slate-900 mb-4">Heat Treatment Facility</h3>
                       <p className="text-lg text-slate-600 mb-8 leading-relaxed">Heat treatment ensures uniform hardness and mechanical properties across every batch.</p>
                       <ul className="space-y-3 text-slate-700 font-semibold">
                          <li className="flex gap-3"><span className="text-blue-600">✔</span> Continuous Mesh Belt Furnaces</li>
                          <li className="flex gap-3"><span className="text-blue-600">✔</span> Material Range: 8.8, 10.9, 12.9 Grade</li>
                       </ul>
                   </div>
                </div>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
                <div className="relative p-10 md:p-12 bg-white rounded-[2rem] border border-slate-200 overflow-hidden group h-full shadow-sm hover:shadow-xl transition-all">
                   <div className="relative z-10">
                       <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-blue-600 transition-colors"><Layers size={32} /></div>
                       <h3 className="text-3xl font-black text-slate-900 mb-4">Surface Coating & Finishing</h3>
                       <p className="text-lg text-slate-600 mb-8 leading-relaxed">Advanced plating lines delivering aesthetic finish and high corrosion resistance.</p>
                       <ul className="space-y-3 text-slate-700 font-semibold">
                          <li className="flex gap-3"><span className="text-blue-600">✔</span> Zinc(blue,yellow,black)</li>
                          <li className="flex gap-3"><span className="text-blue-600">✔</span> Black Phosphate & Oil</li>
                       </ul>
                   </div>
                </div>
            </RevealOnScroll>
         </div>
      </section>

      {/* ================= 8. QUALITY CONTROL & CAPACITY ================= */}
      <section className="py-24 px-6 bg-slate-50">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
            <div>
               <RevealOnScroll><h2 className="text-4xl font-black text-slate-900 mb-10 border-b-4 border-blue-600 inline-block">Quality Assurance Lab</h2></RevealOnScroll>
               <div className="grid gap-6">
                   {[
                       { id: "1", title: "Incoming Check", desc: "Spectro analysis of raw wire rod." },
                       { id: "2", title: "In-Process QC", desc: "Hourly dimension checks by operators." },
                       { id: "3", title: "Final Lab Certification", desc: "Tensile, Torque, & SST before dispatch." }
                   ].map((qc, i) => (
                       <RevealOnScroll key={i} delay={i * 100}>
                           <div className="bg-white p-8 rounded-2xl border border-slate-200 flex gap-6 hover:shadow-lg transition-all">
                               <div className="h-14 w-14 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xl shrink-0 group-hover:bg-blue-600">{qc.id}</div>
                               <div><h4 className="text-slate-900 font-bold text-xl mb-2">{qc.title}</h4><p className="text-slate-500 text-base leading-relaxed">{qc.desc}</p></div>
                           </div>
                       </RevealOnScroll>
                   ))}
               </div>
            </div>
            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl">
               <RevealOnScroll><h2 className="text-4xl font-black text-white mb-10">Production Capacity</h2></RevealOnScroll>
               <div className="grid grid-cols-2 gap-6">
                  {[{l:"Monthly Output",v:"50TONS+"},{l:"Shift System",v:"24/7 Ops"},{l:"Expansion",v:"Ready Infra"},{l:"Lead Time",v:"Quick Turnaround"}].map((stat, i) => (
                      <RevealOnScroll key={i} delay={i * 100}>
                          <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700 h-full flex flex-col justify-center hover:bg-slate-800 transition-all">
                             <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">{stat.l}</p>
                             <p className="text-3xl md:text-4xl font-black text-white">{stat.v}</p>
                          </div>
                      </RevealOnScroll>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ================= 9. USP & CTA ================= */}
      <section className="py-24 px-6 bg-slate-50 text-center border-t border-slate-200">
         <div className="max-w-5xl mx-auto">
            <RevealOnScroll><h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-12">Why Durable Fasteners?</h2></RevealOnScroll>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 text-left">
                {[
                  { t: "Strategic Production", d: "Managed manufacturing ecosystem." },
                  { t: "Consistent Quality", d: "Repeatable precision." },
                  { t: "On-Time Delivery", d: "Committed to schedules." },
                  { t: "OEM Focus", d: "Industrial supply chains." }
                ].map((usp, i) => (
                  <RevealOnScroll key={i} delay={i * 100}>
                      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm h-full hover:-translate-y-2 transition-transform duration-300">
                         <h4 className="text-slate-900 font-bold text-lg mb-2">{usp.t}</h4>
                         <p className="text-slate-500 text-sm font-medium">{usp.d}</p>
                      </div>
                  </RevealOnScroll>
                ))}
            </div>
            <RevealOnScroll delay={300}>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                   <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold px-12 py-6 rounded-2xl shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                     Start OEM Manufacturing <ArrowRight />
                   </Link>
                   <button className="bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 text-xl font-bold px-12 py-6 rounded-2xl transition-all hover:-translate-y-1">
                     Request Capability Sheet
                   </button>
                </div>
            </RevealOnScroll>
         </div>
      </section>
    </div>
  );
};

export default Manufacturing;