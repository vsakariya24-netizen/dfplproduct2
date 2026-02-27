import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Loader, Share2, Bookmark, Clock, 
  Layout, ChevronRight, Quote, CheckCircle2, Calendar
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useSpring } from 'framer-motion';

const BlogDetail: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Framer Motion Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error("Fetch error:", error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setPost(data);
        try {
          // Attempt to parse JSON content, otherwise wrap string in section format
          const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
          setSections(Array.isArray(parsed) ? parsed : [{ type: 'text', heading: '', body: data.content }]);
        } catch {
          setSections([{ type: 'text', heading: '', body: data.content }]);
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7]">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-yellow-600" size={32} />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Loading Insight</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FCFAF7] min-h-screen font-sans selection:bg-yellow-200/50">
      <Helmet>
        <title>{post?.title} | Durable Fastener</title>
      </Helmet>

      {/* PROGRESS BAR */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-yellow-500 origin-left z-[200]"
        style={{ scaleX }}
      />

      {/* TOP NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-[150] px-6 py-4 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <Link 
            to="/blog" 
            className="group flex items-center gap-3 pl-2 pr-5 py-2 bg-white/90 backdrop-blur-xl border border-zinc-200/50 rounded-full shadow-xl shadow-zinc-200/40 text-zinc-900 transition-all hover:border-yellow-500/50"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white group-hover:bg-yellow-500 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">Back</span>
          </Link>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
          <button className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-xl border border-zinc-200/50 rounded-full shadow-lg text-zinc-500 hover:text-yellow-600 transition-all">
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      <article className="relative">
        {/* HERO SECTION */}
        <header className="pt-32 pb-16 px-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
            <span className="w-8 h-[2px] bg-yellow-500"></span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-yellow-600">
              {post?.category || 'Technical Analysis'}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold text-zinc-900 leading-[1.1] tracking-tight mb-12">
            {post?.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 py-8 border-y border-zinc-200/80">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
                <img src="/durablefastener.png" alt="Logo" className="w-8 h-8 object-contain opacity-80" />
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1.5">Author</p>
                <p className="font-bold text-zinc-900">Durable Editorial Team</p>
              </div>
            </div>
            
            <div className="flex gap-8 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-yellow-600" />
                {new Date(post?.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-yellow-600" />
                5 Min Read
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <div className="max-w-4xl mx-auto px-6 pb-32">
          {sections.map((section, idx) => (
            <div key={idx} className="mb-20 last:mb-0">
              {section.type === 'table' ? (
                /* ENHANCED TABLE */
                <div className="my-16 group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600 border border-yellow-100">
                      <Layout size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-800">{section.heading}</h3>
                  </div>
                  <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/50">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-zinc-50/50 border-b border-zinc-100">
                            {section.headers?.map((h: string, i: number) => (
                              <th key={i} className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                          {section.rows?.map((row: string[], ri: number) => (
                            <tr key={ri} className="hover:bg-yellow-50/30 transition-colors">
                              {row.map((cell, ci) => (
                                <td key={ci} className={`px-8 py-5 text-sm ${ci === 0 ? 'font-bold text-zinc-900' : 'text-zinc-600'}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                /* ENHANCED TEXT RENDERING */
                <section>
                  {section.heading && (
                    <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 mb-8 mt-12 flex items-center gap-4">
                      <span className="text-yellow-500">#</span> {section.heading}
                    </h2>
                  )}
                  <div className="space-y-8">
                    {section.body.split('\n').map((para: string, pIdx: number) => {
                      if (!para.trim()) return null;

                      // Visual trick: First paragraph of the blog gets a Drop Cap
                      const isFirstPara = idx === 0 && pIdx === 0;
                      
                      return (
                        <p key={pIdx} className={`
                          text-lg md:text-xl leading-[1.8] text-zinc-700 font-serif
                          ${isFirstPara ? 'first-letter:text-7xl first-letter:font-black first-letter:text-zinc-900 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]' : ''}
                        `}>
                          {para}
                        </p>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* DYNAMIC PULL QUOTE (Randomly insert if it's a long text section) */}
              {section.type === 'text' && section.body.length > 500 && (
                <div className="my-16 py-12 px-8 border-y-2 border-yellow-500/20 bg-yellow-50/30 relative">
                  <Quote className="absolute -top-4 left-8 text-yellow-500 bg-[#FCFAF7] px-2" size={32} />
                  <p className="text-2xl md:text-3xl font-bold italic text-zinc-800 leading-snug">
                    "Precision is not just a metric in fastener manufacturing; it's the foundation of structural integrity."
                  </p>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">— Engineering Insights</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER CALL TO ACTION */}
        <footer className="max-w-5xl mx-auto px-6 mb-32">
          <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
             {/* Abstract Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#eab308_0%,transparent_20%)]"></div>
            </div>
            
            <div className="relative z-10">
              <CheckCircle2 className="mx-auto text-yellow-500 mb-8" size={48} />
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to secure your <span className="text-yellow-500 italic">next project?</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto font-serif italic">
                Get technical consultation from the experts at Durable Fastener Private Limited, Rajkot.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="tel:+918758700704" className="group bg-yellow-500 text-zinc-900 font-black px-10 py-5 rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3">
                  TALK TO AN ENGINEER <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <Link to="/contact" className="px-10 py-5 rounded-2xl border border-white/20 text-white font-black hover:bg-white/10 transition-all">
                  REQUEST BULK QUOTE
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogDetail;