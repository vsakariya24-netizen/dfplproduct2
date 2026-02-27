import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Briefcase, MapPin, Clock, Edit, Layers, X, Save, ArrowDownCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react'; 

const ICON_OPTIONS = ['Briefcase', 'Factory', 'Calculator', 'FlaskConical', 'Users', 'Building2', 'Award', 'Globe', 'Truck', 'Wrench'];
const COLOR_OPTIONS = ['blue', 'emerald', 'amber', 'purple', 'cyan', 'rose', 'indigo'];

const JobsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'departments'>('jobs');
  
  // --- JOBS STATE ---
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // --- DEPARTMENTS STATE ---
  const [departments, setDepartments] = useState<any[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  
  const [deptForm, setDeptForm] = useState({ name: '', description: '', icon: 'Briefcase', color: 'blue' });

  // --- FETCH DATA ---
  useEffect(() => {
    fetchJobs();
    fetchDepartments();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (!error && data) setJobs(data);
    setLoadingJobs(false);
  };

  const fetchDepartments = async () => {
    const { data, error } = await supabase.from('departments').select('*').order('created_at', { ascending: true });
    if (!error && data) setDepartments(data);
    setLoadingDepts(false);
  };

  // --- HELPER: GET UNIQUE DEPARTMENTS FROM JOBS ---
  // Yeh function jobs data mein se unique department names nikalega
  const getExistingJobDepartments = () => {
    const allDepts = jobs.map(job => job.department);
    // Remove duplicates and empty values
    return Array.from(new Set(allDepts)).filter(d => d);
  };

  // --- JOB HANDLERS ---
  const handleDeleteJob = async (id: number) => {
    if(!window.confirm("Are you sure?")) return;
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (!error) { setJobs(jobs.filter(job => job.id !== id)); alert("Job deleted!"); }
  };

  // --- DEPARTMENT HANDLERS ---
  const handleOpenDeptModal = (dept: any = null) => {
    if (dept) {
      setEditingDept(dept);
      setDeptForm({ name: dept.name, description: dept.description, icon: dept.icon, color: dept.color });
    } else {
      setEditingDept(null);
      setDeptForm({ name: '', description: '', icon: 'Briefcase', color: 'blue' });
    }
    setIsDeptModalOpen(true);
  };

  const handleSaveDepartment = async () => {
    if (!deptForm.name || !deptForm.description) return alert("Fill all fields");

    if (editingDept) {
      const { error } = await supabase.from('departments').update(deptForm).eq('id', editingDept.id);
      if (!error) fetchDepartments();
    } else {
      const { error } = await supabase.from('departments').insert([deptForm]);
      if (!error) fetchDepartments();
    }
    setIsDeptModalOpen(false);
  };

  const handleDeleteDept = async (id: string) => {
    if(!window.confirm("Delete this department? Jobs linked to it might display incorrectly.")) return;
    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (!error) setDepartments(departments.filter(d => d.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your website content</p>
        </div>
        
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'jobs' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Job Listings
          </button>
          <button 
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'departments' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Departments (Categories)
          </button>
        </div>
      </div>

      {/* --- JOBS TAB --- */}
      {activeTab === 'jobs' && (
        <>
          <div className="flex justify-end mb-4">
            <Link to="/admin/jobs/new" className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80">
              <Plus size={18} /> Post New Job
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loadingJobs ? (
               <div className="p-8 text-center text-gray-500">Loading jobs...</div>
            ) : jobs.length === 0 ? (
               <div className="p-8 text-center text-gray-500">No active jobs.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <div key={job.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Briefcase size={14}/> {job.department}</span>
                        <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/admin/jobs/edit/${job.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={20} /></Link>
                      <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* --- DEPARTMENTS TAB --- */}
      {activeTab === 'departments' && (
        <>
          <div className="flex justify-between items-center mb-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
             <p className="text-sm text-blue-700"><strong>Note:</strong> These categories appear on the main careers page. <br/>Link these to the exact department names used in your Job Listings.</p>
             <button onClick={() => handleOpenDeptModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm">
               <Plus size={18} /> Add Category
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loadingDepts ? <p>Loading...</p> : departments.map((dept) => {
              const IconComp = (LucideIcons as any)[dept.icon] || LucideIcons.Briefcase;
              return (
                <div key={dept.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start group hover:border-blue-300 transition-all">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${dept.color}-50 text-${dept.color}-600`}>
                      <IconComp size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{dept.description}</p>
                      <span className="inline-block mt-2 text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Icon: {dept.icon} | Color: {dept.color}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenDeptModal(dept)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteDept(dept.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* --- DEPARTMENT MODAL --- */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingDept ? 'Edit Department' : 'New Department'}</h2>
              <button onClick={() => setIsDeptModalOpen(false)}><X className="text-gray-400 hover:text-gray-900" /></button>
            </div>
            
            <div className="space-y-4">
              {/* UPDATED: Department Name with Datalist/Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                
                {/* Agar new create kar rahe hain, toh dropdown dikhao */}
                {!editingDept && (
                  <div className="mb-2">
                     <select 
                        onChange={(e) => setDeptForm({...deptForm, name: e.target.value})}
                        className="w-full p-2 border border-blue-200 bg-blue-50 rounded-lg text-sm text-blue-800 focus:ring-2 focus:ring-blue-500"
                        value="" // Always reset to prompt user selection
                     >
                        <option value="" disabled>Select from Active Jobs...</option>
                        {getExistingJobDepartments().map((deptName, idx) => (
                           <option key={idx} value={deptName}>{deptName}</option>
                        ))}
                     </select>
                     <p className="text-xs text-gray-500 mt-1">Select from existing jobs OR type a new name below.</p>
                  </div>
                )}

                <input 
                  value={deptForm.name} 
                  onChange={e => setDeptForm({...deptForm, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. Sales & Marketing"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={deptForm.description} 
                  onChange={e => setDeptForm({...deptForm, description: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="Short description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                   <select 
                     value={deptForm.icon} 
                     onChange={e => setDeptForm({...deptForm, icon: e.target.value})}
                     className="w-full p-2 border rounded-lg"
                   >
                     {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                   <select 
                     value={deptForm.color} 
                     onChange={e => setDeptForm({...deptForm, color: e.target.value})}
                     className="w-full p-2 border rounded-lg"
                   >
                     {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                   </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                 <button onClick={() => setIsDeptModalOpen(false)} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
                 <button onClick={handleSaveDepartment} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 flex justify-center items-center gap-2">
                   <Save size={18} /> Save Changes
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobsList;