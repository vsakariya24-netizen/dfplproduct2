import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
// Import * as Icons so we can pick them by string name
import * as LucideIcons from 'lucide-react'; 
import { 
  Briefcase, MapPin, IndianRupee, ChevronDown, Send, 
  Clock, Search, Filter, X, Users, User, ArrowRight, Building2, ArrowLeft
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
// --- HELPERS ---
const getBadgeStyles = (text: string) => {
  const t = text ? text.toLowerCase() : '';
  if (t.includes('engineer') || t.includes('manufactur') || t.includes('dispatch')) return 'bg-blue-50 text-blue-700 ring-blue-600/20';
  if (t.includes('sales') || t.includes('market') || t.includes('export')) return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
  if (t.includes('financ') || t.includes('account')) return 'bg-amber-50 text-amber-700 ring-amber-600/20';
  if (t.includes('admin') || t.includes('hr') || t.includes('found')) return 'bg-purple-50 text-purple-700 ring-purple-600/20';
  return 'bg-slate-100 text-slate-700 ring-slate-500/20';
};

// Helper to get Icon Component from String Name
const DynamicIcon = ({ name, size = 32, className }: { name: string; size?: number, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  // Fallback if icon not found
  if (!IconComponent) return <Briefcase size={size} className={className} />;
  return <IconComponent size={size} className={className} />;
};

// --- CONSTANTS ---
const SALARY_RANGES = [
  { label: '< 15k', min: 0, max: 15000 },
  { label: '15k - 30k', min: 15000, max: 30000 },
  { label: '30k - 50k', min: 30000, max: 50000 },
  { label: '50k - 1L', min: 50000, max: 100000 },
  { label: '1L+', min: 100000, max: 1000000 },
];

// --- COMPONENTS ---

// 1. Job Card (Same as before)
const JobCard: React.FC<{ job: any }> = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    const phoneNumber = "918758700783"; 
    const message = `Hello, I am interested in the position of *${job.title}* at Durable Fastener.`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let url = isMobile 
        ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
        : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-blue-500 shadow-lg ring-1 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'}`}>
      <div className="p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getBadgeStyles(job.department)}`}>
                {job.department}
              </span>
              {job.gender && (
                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset flex items-center gap-1 
                    ${job.gender === 'Male' ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' : job.gender === 'Female' ? 'bg-pink-50 text-pink-700 ring-pink-600/20' : 'bg-slate-100 text-slate-600 ring-slate-500/20' }`}>
                    {job.gender === 'Any' ? <Users size={10} /> : <User size={10} />}
                    {job.gender === 'Any' ? 'Male / Female' : `${job.gender} Only`}
                 </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5 text-sm text-slate-500">
                <div className="flex items-center gap-1.5"><Building2 size={14} className="text-slate-400"/><span>Durable Fastener Pvt Ltd</span></div>
                {job.location && (<div className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/><span>{job.location}</span></div>)}
                <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/><span>Full Time</span></div>
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
             {job.salary && (
               <div className="flex items-center gap-1 text-slate-900 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <IndianRupee size={16} className="text-slate-500" /> <span>{job.salary}</span>
               </div>
             )}
             <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><ChevronDown size={20} className="text-slate-400" /></div>
          </div>
        </div>
      </div>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0 border-t border-slate-100 mt-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Experience</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2"><Briefcase size={14} className="text-blue-500"/> {job.experience || 'Not Specified'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Gender</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2"><Users size={14} className="text-blue-500"/> {job.gender === 'Any' || !job.gender ? 'Male / Female' : `${job.gender} Only`}</p>
                </div>
            </div>
            <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 prose-strong:text-slate-900 prose-li:marker:text-slate-400" dangerouslySetInnerHTML={{ __html: job.description }} />
            <div className="mt-8 flex items-center justify-end pt-6 border-t border-slate-100">
              <button onClick={handleApply} className="group relative inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30">
                <span>Apply via WhatsApp</span><Send size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Filter Section (Same as before)
const FilterSection: React.FC<{ title: string; options: { label: string; count: number }[]; selected: string[]; onChange: (val: string) => void; }> = ({ title, options, selected, onChange }) => {
  if (options.length === 0) return null;
  return (
    <div className="mb-8">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{title}</h4>
        <div className="space-y-2">
            {options.map((opt) => {
                const isSelected = selected.includes(opt.label);
                return (
                    <label key={opt.label} className="flex items-center justify-between cursor-pointer group py-1">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-all border ${isSelected ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                                {isSelected && <CheckIcon />}
                                <input type="checkbox" className="hidden" checked={isSelected} onChange={() => onChange(opt.label)} />
                            </div>
                            <span className={`text-sm transition-colors ${isSelected ? 'font-semibold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{opt.label}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${isSelected ? 'bg-slate-100 text-slate-900 font-bold' : 'bg-slate-50 text-slate-400'}`}>{opt.count}</span>
                    </label>
                );
            })}
        </div>
    </div>
  );
};

// 3. Internship Card (Same as before)
const InternshipCard: React.FC = () => {
    const handleInternshipApply = () => {
      const phoneNumber = "918758700783"; 
      const message = "Hello, I am interested in the *Internship / Training Program* at Durable Fastener.";
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const url = isMobile 
        ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
        : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    };
  
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-slate-900 shadow-xl mb-6 group border border-blue-600/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-50 text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              For Freshers & Students
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Start Your Career With Us</h3>
            <p className="text-blue-100 text-sm md:text-base max-w-xl leading-relaxed opacity-90">Looking for industrial exposure? Join our <strong>Internship Program</strong> in Manufacturing, Sales, or Accounts.</p>
          </div>
          <div className="flex-shrink-0">
            <button onClick={handleInternshipApply} className="group/btn relative inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-6 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <span>Apply for Internship</span><ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    );
};

// Check Icon
const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// --- MAIN PAGE ---
const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  // Store fetched departments here
  const [departmentCategories, setDepartmentCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'departments' | 'jobs'>('departments');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedLocs, setSelectedLocs] = useState<string[]>([]);
  const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        // Fetch Jobs
        const jobsReq = supabase.from('jobs').select('*').order('created_at', { ascending: false });
        // Fetch Departments
        const deptsReq = supabase.from('departments').select('*').order('created_at', { ascending: true });

        const [jobsRes, deptsRes] = await Promise.all([jobsReq, deptsReq]);

        if (jobsRes.data) setJobs(jobsRes.data);
        if (deptsRes.data) setDepartmentCategories(deptsRes.data);
        
        setLoading(false);
    };
    fetchData();
  }, []);

  const handleDepartmentSelect = (deptName: string) => {
    setSelectedDepts([deptName]); // Filter by Name now
    setViewMode('jobs');        
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleBackToDepartments = () => {
    setViewMode('departments');
    setSelectedDepts([]); 
    setSearchQuery('');
  };

  const filterOptions = useMemo(() => {
    const depts: Record<string, number> = {};
    const locs: Record<string, number> = {};
    const salaries: Record<string, number> = {};
    const genders: Record<string, number> = {};

    jobs.forEach(job => {
        const d = job.department || 'Other';
        depts[d] = (depts[d] || 0) + 1;
        const l = job.location || 'Remote';
        locs[l] = (locs[l] || 0) + 1;
        const g = job.gender || 'Any';
        genders[g] = (genders[g] || 0) + 1;
        if (job.salary_min || job.salary_max) {
            const jobMin = job.salary_min || 0;
            const jobMax = job.salary_max || 9999999;
            SALARY_RANGES.forEach(range => {
                if (range.min < jobMax && range.max > jobMin) {
                    salaries[range.label] = (salaries[range.label] || 0) + 1;
                }
            });
        }
    });

    return {
        departments: Object.entries(depts).map(([label, count]) => ({ label, count })).sort((a,b) => b.count - a.count),
        locations: Object.entries(locs).map(([label, count]) => ({ label, count })).sort((a,b) => b.count - a.count),
        salaries: SALARY_RANGES.map(r => ({ label: r.label, count: salaries[r.label] || 0 })),
        genders: Object.entries(genders).map(([label, count]) => ({ label, count })).sort((a,b) => b.count - a.count)
    };
  }, [jobs]);

  const filteredJobs = jobs.filter(job => {
    const searchContent = `${job.title} ${job.description} ${job.department}`.toLowerCase();
    const matchesSearch = searchContent.includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(job.department);
    const matchesLoc = selectedLocs.length === 0 || selectedLocs.includes(job.location); 
    const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(job.gender || 'Any');
    
    let matchesSalary = true;
    if (selectedSalaries.length > 0) {
        if (!job.salary_min && !job.salary_max) matchesSalary = false;
        else {
            const jobMin = job.salary_min || 0;
            const jobMax = job.salary_max || 9999999;
            matchesSalary = selectedSalaries.some(label => {
                const range = SALARY_RANGES.find(r => r.label === label);
                if (!range) return false;
                return range.min < jobMax && range.max > jobMin;
            });
        }
    }
    return matchesSearch && matchesDept && matchesLoc && matchesSalary && matchesGender;
  });

  const toggleFilter = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepts([]);
    setSelectedLocs([]);
    setSelectedSalaries([]);
    setSelectedGenders([]);
  };

  const activeFiltersCount = selectedDepts.length + selectedLocs.length + selectedSalaries.length + selectedGenders.length;
const isFiltered = selectedDepts.length > 0;
  const activeDept = isFiltered ? selectedDepts[0] : '';

  // 1. Dynamic Page Title
  const pageTitle = isFiltered 
    ? `${activeDept} Jobs in Rajkot | Durable Fastener Careers`
    : 'Careers at Durable Fastener | Manufacturing Jobs in Rajkot';

  // 2. Dynamic Meta Description
  const pageDescription = isFiltered
    ? `Apply for ${filteredJobs.length} open positions in ${activeDept} at Durable Fastener Pvt Ltd. Salary: ${filteredJobs[0]?.salary || 'Best in Industry'}. Apply via WhatsApp.`
    : 'Join Durable Fastener Pvt Ltd. Hiring for Production Engineers, Sales Executives, and Back Office staff. View all current openings.';

  // 3. Dynamic Schema (Google Jobs)
  // We use "filteredJobs" here so Google sees exactly what the user sees
  const jobSchema = {
    "@context": "https://schema.org",
    "@graph": filteredJobs.map(job => ({
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description.replace(/"/g, '\\"').replace(/\n/g, ' '),
      "identifier": {
        "@type": "PropertyValue",
        "name": "Durable Fastener",
        "value": job.id
      },
      "datePosted": job.created_at,
      "validThrough": "2026-12-31",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Durable Fastener Pvt Ltd",
        "sameAs": "https://durablefastener.com",
        "logo": "https://durablefastener.com/durablefastener.png"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Plot No.16, Ravki",
          "addressLocality": job.location || "Rajkot",
          "addressRegion": "Gujarat",
          "addressCountry": "IN"
        }
      },
      "employmentType": "FULL_TIME",
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": job.salary_min || 15000,
          "maxValue": job.salary_max || 50000,
          "unitText": "MONTH"
        }
      }
    }))
  };
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
    <Helmet>
  {/* 1. Dynamic Title based on Filter */}
  <title>
    {selectedDepts.length > 0 
      ? `${selectedDepts[0]} Jobs at Durable Fastener | Apply Now`
      : 'Careers at Durable Fastener | Manufacturing Jobs in Rajkot'}
  </title>
  
  <meta 
    name="description" 
    content={`Explore ${filteredJobs.length} open positions in ${selectedDepts.length > 0 ? selectedDepts.join(', ') : 'Engineering, Sales, and Admin'}. Join Rajkot's leading fastener manufacturer.`} 
  />

  {/* 2. DYNAMIC JOB POSTING SCHEMA (Uses 'filteredJobs' instead of all 'jobs') */}
  {!loading && filteredJobs.length > 0 && (
    <script type="application/ld+json">
      {`
        {
          "@context": "https://schema.org",
          "@graph": [
            ${filteredJobs.map(job => `
              {
                "@type": "JobPosting",
                "title": "${job.title}",
                "description": "${job.description.replace(/"/g, '\\"').replace(/\n/g, ' ')}",
                "identifier": {
                  "@type": "PropertyValue",
                  "name": "Durable Fastener",
                  "value": "${job.id}"
                },
                "datePosted": "${job.created_at}",
                "validThrough": "2026-12-31",
                "hiringOrganization": {
                  "@type": "Organization",
                  "name": "Durable Fastener Pvt Ltd",
                  "sameAs": "https://durablefastener.com",
                  "logo": "https://durablefastener.com/durablefastener.png"
                },
                "jobLocation": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "${job.location || 'Rajkot'}",
                    "addressRegion": "Gujarat",
                    "addressCountry": "IN"
                  }
                },
                "employmentType": "FULL_TIME"
              }
            `).join(',')}
          ]
        }
      `}
    </script>
  )}
</Helmet>
      {/* PROFESSIONAL HEADER */}
      <div className="relative bg-slate-900 pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-5xl mx-auto text-center z-10">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                We are hiring now
             </div>
             <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
               Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Durable Fastener</span>
             </h1>
             <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
               Discover your next role in Engineering, Manufacturing, Finance, or Sales. Build the future with us.
             </p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 -mt-10 relative z-20">
        
        {viewMode === 'departments' ? (
          /* ================================
             VIEW 1: DEPARTMENT CATEGORIES (Dynamic)
             ================================ */
          <div className="space-y-12 animate-fadeIn">
            <InternshipCard />

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Select a Department</h2>
              <p className="text-slate-500 mt-2">Choose a category to explore open positions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                 // Skeleton loading
                 [1,2,3,4].map(i => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse"></div>)
              ) : departmentCategories.map((dept) => {
                 const count = jobs.filter(j => j.department === dept.name).length;
                 
                 // Dynamic color class construction is tricky in Tailwind if not safelisted.
                 // We rely on standard pattern: bg-{color}-50 text-{color}-600
                 // NOTE: Ensure your tailwind.config includes these colors in safelist or use style attribute if issues arise.
                 // For now, using inline style for bg/text color is safer for dynamic values without complex safelisting
                 
                 return (
                  <div 
                    key={dept.id} 
                    onClick={() => handleDepartmentSelect(dept.name)}
                    className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all cursor-pointer group"
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-${dept.color}-50 text-${dept.color}-600`}>
                      <DynamicIcon name={dept.icon} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{dept.name}</h3>
                    <p className="text-slate-500 text-sm mb-6 h-10 line-clamp-2">{dept.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Openings</span>
                      <span className="bg-slate-100 text-slate-900 font-bold px-3 py-1 rounded-full text-sm">
                        {count} Jobs
                      </span>
                    </div>
                  </div>
                 );
              })}
            </div>
          </div>

        ) : (

          /* ================================
             VIEW 2: JOB LISTING & FILTERS
             ================================ */
          <div className="animate-fadeIn">
            
            {/* Back Button */}
            <button 
              onClick={handleBackToDepartments}
              className="mb-6 inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              <ArrowLeft size={18} /> Back to Departments
            </button>

            {/* MOBILE FILTER TOGGLE & SEARCH */}
            <div className="lg:hidden mb-6">
                <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-200 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search for roles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 font-medium"
                        />
                    </div>
                    <button 
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className={`p-3 rounded-lg flex items-center justify-center transition-colors ${activeFiltersCount > 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        <Filter size={20} />
                        {activeFiltersCount > 0 && <span className="ml-2 text-xs font-bold bg-white text-slate-900 px-1.5 py-0.5 rounded-full">{activeFiltersCount}</span>}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* SIDEBAR */}
                <aside className={`
                    lg:w-72 w-full flex-shrink-0
                    ${showMobileFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto animate-fadeIn' : 'hidden lg:block'}
                    lg:sticky lg:top-24 lg:z-auto
                `}>                
                    <div className="lg:hidden flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Filters</h2>
                        <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Keyword search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                            />
                        </div>

                        {activeFiltersCount > 0 && (
                            <div className="pb-6 border-b border-slate-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-slate-900">Active Filters ({activeFiltersCount})</span>
                                    <button onClick={clearFilters} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Clear All</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[...selectedDepts, ...selectedLocs, ...selectedSalaries, ...selectedGenders].map(f => (
                                        <span key={f} className="inline-flex items-center gap-1 text-[10px] uppercase font-bold bg-slate-900 text-white px-2 py-1 rounded">
                                            {f} <X size={10} className="cursor-pointer opacity-75 hover:opacity-100" onClick={() => {
                                                if(selectedDepts.includes(f)) toggleFilter(f, selectedDepts, setSelectedDepts);
                                                else if(selectedLocs.includes(f)) toggleFilter(f, selectedLocs, setSelectedLocs);
                                                else if(selectedGenders.includes(f)) toggleFilter(f, selectedGenders, setSelectedGenders);
                                                else toggleFilter(f, selectedSalaries, setSelectedSalaries);
                                            }}/>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <FilterSection title="Department" options={filterOptions.departments} selected={selectedDepts} onChange={(val) => toggleFilter(val, selectedDepts, setSelectedDepts)} />
                        <FilterSection title="Location" options={filterOptions.locations} selected={selectedLocs} onChange={(val) => toggleFilter(val, selectedLocs, setSelectedLocs)} />
                        <FilterSection title="Gender" options={filterOptions.genders} selected={selectedGenders} onChange={(val) => toggleFilter(val, selectedGenders, setSelectedGenders)} />
                        <FilterSection title="Monthly Salary" options={filterOptions.salaries} selected={selectedSalaries} onChange={(val) => toggleFilter(val, selectedSalaries, setSelectedSalaries)} />

                        <div className="lg:hidden mt-8">
                            <button onClick={() => setShowMobileFilters(false)} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg">
                                Show {filteredJobs.length} Jobs
                            </button>
                        </div>
                    </div>
                </aside>

                {/* JOB LIST AREA */}
                <main className="flex-1 w-full min-h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            Open Positions 
                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{filteredJobs.length}</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="bg-white h-40 rounded-2xl border border-slate-200 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map(job => <JobCard key={job.id} job={job} />)
                            ) : (
                                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
                                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="text-slate-400" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">No jobs found</h3>
                                    <p className="text-slate-500 max-w-xs mx-auto mt-2">We couldn't find any positions matching your filters.</p>
                                    <button onClick={clearFilters} className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto">
                                        Clear all filters <ArrowRight size={14}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Careers;