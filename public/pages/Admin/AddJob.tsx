import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Briefcase, IndianRupee, Clock, CheckCircle, GraduationCap, Star, Globe, Code, Plus, Trash2, Settings, X, Loader } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface ListItem {
  title: string;
  detail: string;
}

interface AttributeItem {
  id: number;
  value: string;
}

// --- SUB-COMPONENT 1: Manage Options Modal (From Code 1) ---
const ManageOptionsModal: React.FC<{
  category: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ category, onClose, onSuccess }) => {
  const [items, setItems] = useState<AttributeItem[]>([]);
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch existing items for this category
  const fetchItems = async () => {
    setFetching(true);
    const { data } = await supabase
      .from('job_attributes')
      .select('id, value')
      .eq('category', category)
      .order('value');
    
    if (data) setItems(data);
    setFetching(false);
  };

  useEffect(() => {
    fetchItems();
  }, [category]);

  // Add New Item
  const handleAdd = async () => {
    if (!newValue.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('job_attributes').insert([{ category, value: newValue.trim() }]);
    
    if (error) alert('Error: ' + error.message);
    else {
      setNewValue('');
      fetchItems(); // Refresh local list
      onSuccess();  // Refresh parent dropdown
    }
    setLoading(false);
  };

  // Delete Item
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this option?')) return;
    
    const { error } = await supabase.from('job_attributes').delete().eq('id', id);
    
    if (error) alert('Error: ' + error.message);
    else {
      fetchItems(); // Refresh local list
      onSuccess();  // Refresh parent dropdown
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="bg-gray-900 p-4 flex justify-between items-center flex-shrink-0">
          <h3 className="text-white font-bold capitalize flex items-center gap-2">
            <Settings size={18} className="text-yellow-400"/> Manage {category}s
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Add Section */}
          <div className="flex gap-2 mb-6">
            <input 
              autoFocus
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
              placeholder={`Add new ${category}...`}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button 
              onClick={handleAdd} 
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 rounded-lg font-bold transition-colors"
            >
              {loading ? <Loader size={16} className="animate-spin"/> : <Plus size={20}/>}
            </button>
          </div>

          {/* List Section */}
          {fetching ? (
            <div className="text-center py-4 text-gray-400">Loading list...</div>
          ) : (
            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="text-center text-gray-400 text-sm italic">No options found. Add one above!</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg group hover:border-gray-300 transition-all">
                    <span className="font-medium text-gray-700 text-sm">{item.value}</span>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT 2: Dynamic List Input ---
const ListInputSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  items: ListItem[];
  setItems: (newItems: ListItem[]) => void;
  placeholderKey: string;
  placeholderDetail: string;
}> = ({ title, icon, items, setItems, placeholderKey, placeholderDetail }) => {
  
  const handleAddItem = () => {
    setItems([...items, { title: '', detail: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleChange = (index: number, field: 'title' | 'detail', value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-2 items-start group bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="mt-3 md:mt-3 text-xs text-gray-400 font-mono select-none px-2">{index + 1}.</span>
            
            {/* Box 1: Title */}
            <div className="w-full md:w-1/3">
              <input
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-sm font-bold placeholder:font-normal"
                placeholder={placeholderKey}
                value={item.title}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
              />
            </div>

            {/* Box 2: Detail */}
            <div className="w-full md:w-2/3">
              <textarea
                rows={1}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-sm"
                placeholder={placeholderDetail}
                value={item.detail}
                onChange={(e) => handleChange(index, 'detail', e.target.value)}
                style={{ minHeight: '38px' }}
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-center md:self-start"
              title="Remove point"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="mt-4 flex items-center gap-2 text-sm font-bold text-black hover:text-yellow-600 transition-colors px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-yellow-400 shadow-sm"
      >
        <Plus size={16} /> Add Point
      </button>
    </div>
  );
};

// --- MAIN COMPONENT ---
const AddJob: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  // Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Dropdown Options State
  const [dropdownOptions, setDropdownOptions] = useState({
    departments: [] as string[],
    locations: [] as string[],
    types: [] as string[]
  });

  // --- STATE ---
  const [formData, setFormData] = useState({
    title: '',
    department: '', // Empty by default now (dynamic)
    type: '',       // Empty by default now (dynamic)
    gender: 'Any', 
    location_short: '', // Empty by default now (dynamic)
    salary: '',      
    salary_min: '',  
    salary_max: '',  
    experience: '',
    skills: '',
    intro: '',
    working_hours: '',
    address: '',
    maps_link: '',
    commitment: '',
    responsibilities: [{ title: '', detail: '' }] as ListItem[],
    qualifications: [{ title: '', detail: '' }] as ListItem[],
    benefits: [{ title: '', detail: '' }] as ListItem[]
  });

  // --- 1. FETCH ATTRIBUTES (Dropdown Data) ---
  const fetchAttributes = async () => {
    const { data } = await supabase.from('job_attributes').select('*').order('value');
    if (data) {
      setDropdownOptions({
        departments: data.filter(i => i.category === 'department').map(i => i.value),
        locations: data.filter(i => i.category === 'location').map(i => i.value),
        types: data.filter(i => i.category === 'type').map(i => i.value),
      });
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // --- 2. FETCH JOB DATA (EDIT MODE) ---
  useEffect(() => {
    if (isEditMode && id) {
      fetchJobData(id);
    }
  }, [id, isEditMode]);

  const fetchJobData = async (jobId: string) => {
    setFetching(true);
    try {
      const { data, error } = await supabase.from('jobs').select('*').eq('id', jobId).single();
      
      if (error || !data) {
        navigate('/admin/jobs');
        return;
      }

      // --- SMART PARSING LOGIC ---
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.description || '', 'text/html');

      // Helper to handle multiple header types (h3, h4, h5, strong)
      const getTextByHeader = (keyword: string) => {
        const headers = Array.from(doc.querySelectorAll('h3, h4, h5, strong')); 
        const target = headers.find(h => h.textContent?.toLowerCase().includes(keyword.toLowerCase()));
        
        let next = target?.nextElementSibling;
        if (next && next.tagName === 'P') return next.textContent?.trim() || '';
        return target?.nextSibling?.textContent?.trim() || '';
      };

      const getListByHeader = (keyword: string): ListItem[] => {
        const headers = Array.from(doc.querySelectorAll('h3, h4, h5, strong'));
        const targetHeader = headers.find(h => h.textContent?.toLowerCase().includes(keyword.toLowerCase()));
        
        if (!targetHeader) return [{ title: '', detail: '' }];

        let nextElem = targetHeader.nextElementSibling;
        let attempts = 0;
        // Search next 5 siblings to find the UL
        while (nextElem && nextElem.tagName !== 'UL' && attempts < 5) {
          nextElem = nextElem.nextElementSibling;
          attempts++;
        }

        if (nextElem && nextElem.tagName === 'UL') {
          return Array.from(nextElem.children).map(li => {
            const strongTag = li.querySelector('strong');
            if (strongTag) {
              const title = strongTag.textContent?.replace(/:$/, '').trim() || '';
              const fullText = li.textContent || '';
              const detail = fullText.replace(strongTag.textContent || '', '').replace(/^:/, '').trim();
              return { title, detail };
            } else {
              const parts = li.textContent?.split(':') || [];
              if (parts.length > 1) {
                  return { title: parts[0].trim(), detail: parts.slice(1).join(':').trim() };
              }
              return { title: '', detail: li.textContent?.trim() || '' };
            }
          });
        }
        return [{ title: '', detail: '' }];
      };

      const linkElem = doc.querySelector('a[href*="maps"]');
      const introP = doc.querySelector('.job-intro p') || doc.querySelector('p');

      setFormData({
        title: data.title,
        department: data.department || '',
        type: data.type || '',
        gender: data.gender || 'Any', 
        location_short: data.location || '',
        salary: data.salary || '',
        salary_min: data.salary_min || '',
        salary_max: data.salary_max || '',
        experience: data.experience || '',
        skills: data.skills || '',
        intro: introP?.textContent?.trim() || '',
        
        // Smart matching
        working_hours: getTextByHeader('Working'),
        commitment: getTextByHeader('Commitment') || getTextByHeader('Bond'),
        address: getTextByHeader('Location') || getTextByHeader('Address'),
        maps_link: linkElem ? linkElem.getAttribute('href') || '' : '',
        
        // List matching
        responsibilities: getListByHeader('Responsibilities'),
        qualifications: getListByHeader('Qualifications') || getListByHeader('Qualification'),
        benefits: getListByHeader('Benefits') || getListByHeader('Benefit')
      });

    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const generateListHTML = (items: ListItem[]) => {
      const validItems = items.filter(i => i.title.trim() !== '' || i.detail.trim() !== '');
      if (validItems.length === 0) return '';
      
      return validItems.map(item => {
        const titlePart = item.title.trim() ? `<strong class="text-gray-900 font-bold">${item.title.trim()}:</strong> ` : '';
        return `
        <li class="flex items-start gap-3 mb-2">
           <span class="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></span>
           <span class="text-gray-700 leading-relaxed">${titlePart}${item.detail.trim()}</span>
        </li>`;
      }).join('');
    };

    const formattedDescription = `
      <div class="job-intro mb-8">
        <p class="text-gray-700 text-lg leading-relaxed">${formData.intro.replace(/\n/g, '<br/>')}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="bg-gray-50 p-5 rounded-xl border border-gray-100">
          <h4 class="font-bold text-gray-900 flex items-center gap-2 mb-2">⏰ Working Hours</h4>
          <p class="text-gray-700 font-medium">${formData.working_hours}</p>
        </div>
        <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
          <h4 class="font-bold text-yellow-900 flex items-center gap-2 mb-2">🤝 Commitment</h4>
          <p class="text-yellow-800 font-medium">${formData.commitment}</p>
        </div>
      </div>

      <div class="mb-10">
        <h3 class="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">📍 Office Location</h3>
        <p class="text-gray-600 whitespace-pre-line leading-relaxed">${formData.address}</p>
        ${formData.maps_link ? `<a href="${formData.maps_link}" target="_blank" class="inline-flex items-center gap-2 mt-4 text-blue-600 font-bold hover:underline bg-blue-50 px-4 py-2 rounded-lg transition-colors">👉 View on Google Maps</a>` : ''}
      </div>

      <hr class="border-gray-100 my-8"/>

      <div class="mb-10">
        <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span class="text-green-600">✅</span> Key Responsibilities</h3>
        <ul class="space-y-3">
          ${generateListHTML(formData.responsibilities)}
        </ul>
      </div>

      <div class="mb-10">
        <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span class="text-blue-600">🎓</span> Qualifications Required</h3>
        <ul class="space-y-3">
          ${generateListHTML(formData.qualifications)}
        </ul>
      </div>

      <div class="mb-10">
        <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span class="text-yellow-500">⭐</span> Benefits & Growth</h3>
        <ul class="space-y-3">
          ${generateListHTML(formData.benefits)}
        </ul>
      </div>
      
      <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 italic flex gap-3 items-start">
        <span class="text-xl">💡</span>
        <span>Note: Job responsibilities may evolve based on company requirements and candidate ability.</span>
      </div>
    `;

    const payload = {
      title: formData.title,
      department: formData.department,
      type: formData.type,
      gender: formData.gender, 
      location: formData.location_short,
      experience: formData.experience,
      salary: formData.salary,
      salary_min: formData.salary_min ? parseInt(String(formData.salary_min)) : 0,
      salary_max: formData.salary_max ? parseInt(String(formData.salary_max)) : 0,
      skills: formData.skills,
      description: formattedDescription
    };
    
    let error;
    
    if (isEditMode && id) {
      const { error: updateError } = await supabase.from('jobs').update(payload).eq('id', parseInt(id));
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('jobs').insert([payload]);
      error = insertError;
    }

    if (error) {
      console.error(error);
      alert('Error: ' + error.message);
    } else {
      navigate('/admin/jobs');
    }
    setLoading(false);
  };

  if (fetching) return <div className="p-10 text-center">Loading job data...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 relative">
      
      {/* POPUP MODAL (Condition Rendering) */}
      {activeModal && (
        <ManageOptionsModal 
            category={activeModal} 
            onClose={() => setActiveModal(null)} 
            onSuccess={fetchAttributes} 
        />
      )}

      <Link to="/admin/jobs" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black transition-colors">
        <ArrowLeft size={18} /> Back to Jobs List
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 px-8 py-6 border-b border-gray-800 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{isEditMode ? 'Edit Job' : 'Post New Job'}</h2>
            <p className="text-gray-400 mt-1">Fill in the details below.</p>
          </div>
          {isEditMode && <span className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold">EDITING</span>}
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Header Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase size={16} /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="label">Job Title</label>
                <input required className="input-field text-lg font-semibold" placeholder="e.g. Senior Accountant" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              
              {/* DYNAMIC DEPARTMENT SELECTOR */}
              <div>
                  <div className="flex justify-between items-center mb-1">
                      <label className="label mb-0">Department</label>
                      <button type="button" onClick={() => setActiveModal('department')} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline font-bold">
                        <Settings size={12} /> Manage List
                      </button>
                  </div>
                  <select className="input-field bg-white" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                    <option value="">Select Department</option>
                    {dropdownOptions.departments.map((dept, idx) => <option key={idx} value={dept}>{dept}</option>)}
                  </select>
              </div>

              {/* DYNAMIC TYPE SELECTOR */}
              <div>
                  <div className="flex justify-between items-center mb-1">
                      <label className="label mb-0">Job Type</label>
                      <button type="button" onClick={() => setActiveModal('type')} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline font-bold">
                        <Settings size={12} /> Manage List
                      </button>
                  </div>
                  <select className="input-field bg-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                     <option value="">Select Type</option>
                     {dropdownOptions.types.map((type, idx) => <option key={idx} value={type}>{type}</option>)}
                  </select>
              </div>

              <div>
                  <label className="label">Gender Preference</label>
                  <select className="input-field bg-white" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="Any">Any (Male or Female)</option>
                    <option value="Male">Male Only</option>
                    <option value="Female">Female Only</option>
                  </select>
              </div>

              {/* DYNAMIC LOCATION SELECTOR */}
              <div>
                  <div className="flex justify-between items-center mb-1">
                      <label className="label mb-0">Location (City)</label>
                      <button type="button" onClick={() => setActiveModal('location')} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline font-bold">
                        <Settings size={12} /> Manage List
                      </button>
                  </div>
                  <select className="input-field bg-white" value={formData.location_short} onChange={e => setFormData({...formData, location_short: e.target.value})}>
                    <option value="">Select Location</option>
                    {dropdownOptions.locations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
                  </select>
              </div>

              {/* SALARY SECTION */}
              <div>
                  <label className="label">Salary Display Text</label>
                  <div className="relative mb-2">
                    <IndianRupee size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input className="input-field pl-10" placeholder="e.g. ₹15,000 - ₹30,000" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div>
                        <label className="text-xs font-bold text-gray-500">Min (Number)</label>
                        <input type="number" className="w-full p-1 text-sm border rounded" placeholder="15000" value={formData.salary_min} onChange={e => setFormData({...formData, salary_min: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500">Max (Number)</label>
                        <input type="number" className="w-full p-1 text-sm border rounded" placeholder="30000" value={formData.salary_max} onChange={e => setFormData({...formData, salary_max: e.target.value})} />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Enter raw numbers for filters (e.g., 15000).</p>
              </div>

              <div>
                  <label className="label">Experience</label>
                  <input className="input-field" placeholder="e.g. Min 2 Years" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
              </div>

              <div>
                  <label className="label">Skills (Comma Separated)</label>
                  <div className="relative">
                    <Code size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input className="input-field pl-10" placeholder="e.g. Miracle, GST, Excel" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
                  </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Specifics */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe size={16} /> Job Specifics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="label">Introduction / Overview</label>
                <textarea className="input-field h-24" placeholder="e.g. Durable Fastener Private Limited is looking for..." value={formData.intro} onChange={e => setFormData({...formData, intro: e.target.value})} />
              </div>
              <div>
                <label className="label">Working Hours</label>
                <div className="relative">
                   <Clock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                   <input className="input-field pl-10" placeholder="e.g. 9:00 AM to 7:00 PM" value={formData.working_hours} onChange={e => setFormData({...formData, working_hours: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">Commitment / Bond</label>
                <input className="input-field" placeholder="e.g. Minimum tenure of two years" value={formData.commitment} onChange={e => setFormData({...formData, commitment: e.target.value})} />
              </div>
              <div className="col-span-2">
                 <label className="label">Full Office Address</label>
                 <textarea className="input-field h-20" placeholder="e.g. 1st Floor..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="col-span-2">
                 <label className="label">Google Maps Link</label>
                 <input className="input-field text-blue-600" placeholder="http://googleusercontent.com/..." value={formData.maps_link} onChange={e => setFormData({...formData, maps_link: e.target.value})} />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Dynamic Lists */}
          <div className="grid grid-cols-1 gap-8">
            <ListInputSection 
                title="Key Responsibilities" 
                icon={<CheckCircle size={16} />} 
                items={formData.responsibilities} 
                setItems={(newItems) => setFormData({...formData, responsibilities: newItems})} 
                placeholderKey="e.g. Dispatch Operations"
                placeholderDetail="e.g. Plan and execute daily dispatch schedules..." 
            />
            
            <ListInputSection 
                title="Qualifications Required" 
                icon={<GraduationCap size={16} />} 
                items={formData.qualifications} 
                setItems={(newItems) => setFormData({...formData, qualifications: newItems})} 
                placeholderKey="e.g. Education"
                placeholderDetail="e.g. Bachelor's Degree in Commerce..." 
            />
            
            <ListInputSection 
                title="Benefits & Growth" 
                icon={<Star size={16} />} 
                items={formData.benefits} 
                setItems={(newItems) => setFormData({...formData, benefits: newItems})} 
                placeholderKey="e.g. Salary"
                placeholderDetail="e.g. Competitive salary based on skills..." 
            />
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/20 active:scale-95">
              {loading ? 'Saving...' : <><Save size={20} /> {isEditMode ? 'Update Job' : 'Publish Job'}</>}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        .label { display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
        .input-field { width: 100%; padding: 0.75rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; transition: all 0.2s; }
        .input-field:focus { outline: none; border-color: #FBBF24; box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2); }
      `}</style>
    </div>
  );
};

export default AddJob;