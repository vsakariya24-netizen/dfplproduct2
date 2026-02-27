import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  Heart, Zap, Users, CheckCircle, XCircle, 
  Anchor, Coffee, TrendingUp, Award, ArrowRight, 
  Sun, ShieldCheck, Clock, MessageCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
// --- Helper Component: HandNote ---
const HandNote = ({ text, className }: { text: string; className?: string }) => (
  <span className={`font-serif italic text-2xl text-blue-500 inline-block rotate-[-3deg] ${className}`}>
    {text}
  </span>
);

// --- Animated Counter ---
const Counter = ({ from, to, label }: { from: number; to: number; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let start = from;
      const duration = 2000;
      const incrementTime = (duration / (to - from)) * Math.abs(1);
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === to) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [inView, from, to]);

  return (
    <div ref={ref} className="text-center p-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-5xl md:text-6xl font-black text-blue-900 font-sans mb-2">
        {count}+
      </h3>
      <p className="text-sm font-bold tracking-widest uppercase text-slate-500">{label}</p>
    </div>
  );
};

// --- Marquee Component ---
const Marquee = ({ text }: { text: string }) => {
  return (
    <div className="bg-slate-900 text-white py-3 overflow-hidden border-y border-slate-800 relative z-20">
      <motion.div 
        className="whitespace-nowrap flex gap-10 text-sm md:text-base font-bold uppercase tracking-widest"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {Array(10).fill(text).map((t, i) => (
          <span key={i} className="flex items-center gap-4 text-slate-400">
            {t} <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// --- Main Page ---

const LifeAtDurable: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  // Fetch Gallery Data
  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('life_gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setGalleryItems(data);
      } else {
        setGalleryItems([
           { title: "Diwali Puja", image_url: "https://images.unsplash.com/photo-1605218439502-861c8340d042?w=800", tag: "Tradition", size: "large" },
           { title: "Floor Action", image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800", tag: "Grit", size: "small" },
           { title: "Team Lunch", image_url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800", tag: "Bonding", size: "small" },
           { title: "Quality Check", image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800", tag: "Focus", size: "wide" },
        ]);
      }
    };
    fetchGallery();
  }, []);

  // --- TIMELINE DATA ---
  const timelineData = [
    {
      time: "09:00 AM",
      title: "The Safety Pledge",
      desc: "Before a single machine starts, we stand together. We check each other's gear. We ask about families. We promise to keep each other safe today.",
      icon: ShieldCheck,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800" 
    },
    {
      time: "01:00 PM",
      title: "Lunch is Shared, Not Served", 
      desc: "Managers and operators sit at the same table. We open food dabbas. We talk about cricket, politics, and kids' exams. No hierarchy here.",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800" 
    },
    {
      time: "04:00 PM",
      title: "The Chai Break Idea", 
      desc: "The best improvements don't come from the boardroom. They come from Raju Bhai suggesting a tweak to the feeder while sipping cutting chai.",
      icon: Coffee,
      color: "text-red-500",
      bgColor: "bg-red-100",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800" 
    },
    {
      time: "06:00 PM",
      title: "Pride in the Finish", 
      desc: "Silence returns. We wipe down the tools and look at the bins full of finished work. We leave tired, but with the satisfaction of a day well spent.",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      img: "https://images.unsplash.com/photo-1469533778471-92a68acc3633?q=80&w=800" 
    }
  ];

  return (
    <div ref={targetRef} className="bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">
<Helmet>
        {/* 1. Career-Focused Title */}
        <title>Life at Durable | Careers & Culture at Fastener Factory Rajkot</title>
        
        <meta 
          name="description" 
          content="Join the Durable Fastener family. We offer stable careers, on-time salaries, and a culture of respect. Explore manufacturing jobs in Rajkot's leading fastener unit." 
        />
        
        <meta 
          name="keywords" 
          content="jobs in rajkot, fastener industry careers, durable fastener culture, manufacturing jobs gujarat, work at durable fastener, factory jobs rajkot" 
        />

        {/* 2. CULTURE & RECRUITMENT SCHEMA */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Life at Durable Fastener",
              "url": "https://durablefastener.com/life-at-durable",
              "description": "Inside look at the culture, values, and daily life at Durable Fastener Pvt Ltd.",
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000"
              },
              "mainEntity": {
                "@type": "Organization",
                "name": "Durable Fastener Pvt Ltd",
                "alternateName": "Durable Family",
                "logo": "https://durablefastener.com/durablefastener.png",
                "slogan": "Your Second Home",
                "areaServed": "Rajkot, Gujarat",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+91 87587 00709",
                  "contactType": "HR",
                  "availableLanguage": ["English", "Gujarati", "Hindi"]
                }
              }
            }
          `}
        </script>
      </Helmet>
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <motion.div style={{ y: heroY, scale: 1.1 }} className="absolute inset-0 opacity-40">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop" alt="Durable Team Laughing" className="w-full h-full object-cover grayscale-[30%] sepia-[20%]"/>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <HandNote text="More than just a factory..." className="text-amber-400 mb-4" />
            <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8 drop-shadow-2xl">
                YOUR SECOND <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-100">HOME.</span>
            </h1>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-slate-300 font-medium text-lg mb-12">
               <span className="flex items-center gap-2"><CheckCircle className="text-green-500" size={20}/> Stable Career</span>
               <span className="flex items-center gap-2"><CheckCircle className="text-green-500" size={20}/> On-Time Salary</span>
               <span className="flex items-center gap-2"><CheckCircle className="text-green-500" size={20}/> Respect for All</span>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto">
               <Coffee size={20} /> Come Have Tea With Us
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Marquee text="Respect • Integrity • Growth • Safety • Brotherhood • Excellence • " />

      {/* 2. OUR DNA (Pillars) */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">OUR DNA</h2>
              <p className="text-slate-500 text-lg">Four pillars that hold this company together.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                 { icon: Zap, color: "text-amber-500", title: "We Value Thinking", text: "Ideas don’t need permission. If it improves quality or safety, we listen." },
                 { icon: Anchor, color: "text-blue-600", title: "We Respect Work", text: "Whether on the shop floor or the office, every role builds the same dream." },
                 { icon: TrendingUp, color: "text-green-600", title: "We Grow Together", text: "Learning is part of our daily work—not a yearly formality." },
                 { icon: Heart, color: "text-red-500", title: "We Care Beyond Work", text: "We celebrate wins. We support during tough days. We are a family." }
              ].map((item, i) => (
                 <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-slate-50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-slate-100">
                    <item.icon size={40} className={`mb-6 ${item.color}`} />
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                 </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* ----------------------------------------------------- */}
      {/* 3. NEW SECTION: CULTURE (Bro not Sir)                */}
      {/* ----------------------------------------------------- */}
      <section id="culture" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <HandNote text="The unwritten rules." className="text-blue-500 mb-2" />
             <h2 className="text-4xl md:text-5xl font-black text-slate-900">OUR CULTURE CODE</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* CARD 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Bro, not Sir.</h3>
                <p className="text-slate-600 leading-relaxed">
                  Titles are for LinkedIn. Inside our doors, everyone is an equal. 
                  Seniors don't give orders; they give perspectives. You can challenge anyone, 
                  as long as you have a reason. Respect is earned through work, not seniority.
                </p>
              </div>
              <div className="mt-8 text-slate-200 text-5xl font-black opacity-40">01</div>
            </motion.div>

            {/* CARD 2 (Highlighted) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-slate-900 text-white rounded-3xl shadow-2xl flex flex-col justify-between transform md:scale-105"
            >
              <div>
                <h3 className="text-2xl font-bold mb-4 text-amber-400">Ownership over Job.</h3>
                <p className="text-slate-300 leading-relaxed">
                  We don't give you tasks. We give you problems to solve. 
                  If you need someone to tell you what to do every hour, 
                  you'll feel lost here. But if you want to build something yours, 
                  this is your playground.
                </p>
              </div>
              <div className="mt-8 text-white text-5xl font-black opacity-10">02</div>
            </motion.div>

            {/* CARD 3 (Added to balance the grid) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Fail Fast. Fix Faster.</h3>
                <p className="text-slate-600 leading-relaxed">
                  We don't punish honest mistakes. We punish hiding them. 
                  If you try a new way and it fails, we learn. If you stay silent, we stagnate.
                  Transparency is our oxygen.
                </p>
              </div>
              <div className="mt-8 text-slate-200 text-5xl font-black opacity-40">03</div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. STORIES SECTION */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">STORIES FROM INSIDE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Story 1 */}
               <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Ramesh" className="w-full h-full object-cover"/>
                     </div>
                     <div>
                        <h4 className="font-bold text-xl">Ramesh Bhai</h4>
                        <p className="text-blue-400 text-sm">Production Team • Joined 2019</p>
                     </div>
                  </div>
                  <p className="text-lg text-slate-300 italic">"I joined as a helper. Today, I handle operations independently. Durable gave me trust before I had confidence."</p>
               </motion.div>
               {/* Story 2 */}
               <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" alt="Priya" className="w-full h-full object-cover"/>
                     </div>
                     <div>
                        <h4 className="font-bold text-xl">Priya Ben</h4>
                        <p className="text-blue-400 text-sm">Quality Control • Joined 2021</p>
                     </div>
                  </div>
                  <p className="text-lg text-slate-300 italic">"In other companies, QC is just a department. Here, it is a mindset. I am empowered to stop the production line if I see a defect."</p>
               </motion.div>
            </div>
         </div>
      </section>

      {/* 5. A DAY AT DURABLE */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-24">
            <HandNote text="Real moments, real people." className="text-blue-500 mb-2" />
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">THE RHYTHM OF OUR DAY</h2>
          </div>

          <div className="relative">
            {/* The Central Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200"></div>

            <div className="space-y-24">
              {timelineData.map((item, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row items-center justify-between group`}>
                  
                  {/* LEFT SIDE CONTENT */}
                  <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${i % 2 === 0 ? 'text-left md:text-right md:pr-12' : 'md:pl-12 order-last'}`}>
                    
                    {i % 2 === 0 ? (
                      <div>
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 ${item.bgColor} ${item.color}`}>
                           <Clock size={12}/> {item.time}
                         </div>
                         <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                         <p className="text-slate-600 text-lg leading-relaxed">{item.desc}</p>
                      </div>
                    ) : (
                      <div className="relative group-hover:scale-[1.02] transition-transform duration-500">
                         <div className={`absolute -inset-4 bg-gradient-to-r from-blue-50 to-transparent rounded-[2rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                         <img src={item.img} alt={item.title} className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg border border-slate-100"/>
                      </div>
                    )}
                  </div>

                  {/* CENTER NODE */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-4 ${item.color.replace('text-', 'border-')} shadow-md flex items-center justify-center`}>
                       <div className={`w-3 h-3 rounded-full ${item.color.replace('text-', 'bg-')}`}></div>
                    </div>
                  </div>

                  {/* RIGHT SIDE CONTENT */}
                  <div className={`w-full md:w-[45%] pl-12 md:pl-0 mt-6 md:mt-0 ${i % 2 === 0 ? 'md:pl-12' : 'text-left md:text-left md:pr-12 order-first'}`}>
                     {i % 2 === 0 ? (
                      <div className="relative group-hover:scale-[1.02] transition-transform duration-500">
                         <div className={`absolute -inset-4 bg-gradient-to-l from-blue-50 to-transparent rounded-[2rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                         <img src={item.img} alt={item.title} className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg border border-slate-100"/>
                      </div>
                    ) : (
                      <div>
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 ${item.bgColor} ${item.color}`}>
                           <Clock size={12}/> {item.time}
                         </div>
                         <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                         <p className="text-slate-600 text-lg leading-relaxed">{item.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CAREER PATH */}
      <section className="py-24 bg-blue-50">
         <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                  <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">Your Career Path</span>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-2 mb-6">GROWTH IS NOT ABOUT YEARS. <br/> IT'S ABOUT <span className="text-blue-600">WILL.</span></h2>
                  <p className="text-slate-600 text-lg mb-8">We don't believe in waiting for "your turn." If you show interest, we teach you.</p>
                  <ul className="space-y-4">
                     {["Technical training on latest CNC/Header machines", "Leadership workshops", "English and Soft-skills improvement", "Direct mentorship"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                           <Award className="text-blue-500 shrink-0" size={20} />
                           <span className="font-bold text-slate-700">{item}</span>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="grid grid-cols-1 gap-6">
                  <Counter from={0} to={85} label="Team Members" />
                  <Counter from={0} to={12} label="Promotions Last Year" />
                  <Counter from={0} to={100} label="% Support for Learning" />
               </div>
            </div>
         </div>
      </section>

      {/* 7. THE FILTER */}
      <section className="py-24 bg-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
           <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                 <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-400 flex items-center gap-2"><XCircle className="text-red-400" /> WE ARE <span className="text-red-500 underline">NOT</span> FOR YOU</h3>
                    <ul className="space-y-4">
                       {["If you prefer comfort over growth.", "If you hide mistakes.", "If you say 'That's not my job'."].map((t, i) => (
                          <li key={i} className="flex gap-3 text-slate-500"><span className="w-1.5 h-1.5 bg-red-300 rounded-full mt-2.5 shrink-0"></span> {t}</li>
                       ))}
                    </ul>
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2"><CheckCircle className="text-green-500" /> YOU BELONG <span className="text-green-500 underline">HERE</span></h3>
                    <ul className="space-y-4">
                       {["If you are obsessed with quality.", "If you are hungry to learn.", "If you treat the factory like home."].map((t, i) => (
                          <li key={i} className="flex gap-3 text-slate-800 font-bold"><CheckCircle className="text-green-500 w-5 h-5 shrink-0" /> {t}</li>
                       ))}
                    </ul>
                 </div>
             </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-blue-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
           <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-7xl font-black mb-6">THIS FEELS LIKE A PLACE <br/><span className="text-blue-300">I WANT TO GROW.</span></h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">If you just said that to yourself, we want to meet you.</p>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <button className="bg-white text-blue-900 px-10 py-5 rounded-full text-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-3">View Open Positions <ArrowRight size={20}/></button>
                <button className="text-blue-200 hover:text-white font-medium underline underline-offset-4 transition-all">Walk-in Opportunities</button>
              </div>
           </motion.div>
        </div>
      </section>

    </div>
  );
};

export default LifeAtDurable;