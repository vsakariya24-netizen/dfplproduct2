import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Mail, Calendar, Trash2, CheckCircle, Loader2, 
  MessageSquare, Phone, Eye, FileText, Image as ImageIcon, ExternalLink 
} from 'lucide-react';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzR2Tv85F-MNNePk32-FuWH4zE14LQtCt_O2Wxk5dKktqUmJpFq7kzWUqReYH2ih9xC/exec';

// --- INTERFACE ---
interface Enquiry {
  id: string;
  enquiry_id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'contacted';
  document_path?: string;
  image_path?: string;
}

const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  // --- NEW: State for deleting ---
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Helper to get public URL from Supabase Storage
  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage
      .from('enquiry-attachments')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching enquiries:', error);
    else setEnquiries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: 'read' | 'contacted') => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('enquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setEnquiries(prev => 
        prev.map(enq => enq.id === id ? { ...enq, status: newStatus } : enq)
      );
    }
    setUpdatingId(null);
  };

  // --- NEW: Handle Delete Function ---
 const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      // We ask Supabase to delete and tell us how many rows were affected
      const { error, count } = await supabase
        .from('enquiries')
        .delete({ count: 'exact' }) 
        .eq('id', id);

      if (error) throw error;

      // If count is 0, it means the database ignored us (RLS issue)
      // Note: count might be null in some configurations, but this helps debug
      
      setEnquiries(prev => prev.filter(enq => enq.id !== id));
      
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
      // If it failed, refresh the list to show the item again
      fetchEnquiries();
    } finally {
      setDeletingId(null);
    }
  };

  const syncToSheet = async (enquiry: Enquiry) => {
  setSyncingId(enquiry.id);
  try {
    // Generate the public Supabase URLs so the Google Script can "see" them to download them
    const docUrl = enquiry.document_path ? getPublicUrl(enquiry.document_path) : "No Document";
    const imgUrl = enquiry.image_path ? getPublicUrl(enquiry.image_path) : "No Image";

    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        ...enquiry,
        timestamp: new Date(enquiry.created_at).toLocaleString(),
        document_url: docUrl, // Added this
        image_url: imgUrl,    // Added this
      })
    });

    alert('Synced to Google Sheet! Files are now being backed up to Drive.');
    handleStatusUpdate(enquiry.id, 'read');
  } catch (err) {
    alert('Sync failed.');
  } finally {
    setSyncingId(null);
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Customer Enquiries</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
          Total: {enquiries.length}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
          <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No Enquiries Yet</h3>
        </div>
      ) : (
        <div className="grid gap-6">
          {enquiries.map((enquiry) => (
            <div 
              key={enquiry.id} 
              className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                enquiry.status === 'new' 
                ? 'border-l-8 border-l-yellow-500 border-gray-200 shadow-md' 
                : 'border-gray-200 opacity-80'
              }`}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
                    enquiry.status === 'new' ? 'bg-blue-600' : 'bg-slate-400'
                  }`}>
                    {enquiry.first_name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 text-lg">{enquiry.first_name} {enquiry.last_name}</h3>
                      {enquiry.status === 'new' && (
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">New</span>
                      )}
                    </div>
                    
                    <p className="text-xs font-mono text-blue-600 font-semibold mb-2">ID: {enquiry.enquiry_id || 'N/A'}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1 hover:text-blue-600"><Mail size={14} /> {enquiry.email}</a>
                      <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1 text-emerald-600 font-medium hover:underline">
                        <Phone size={14} /> {enquiry.phone}
                      </a>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(enquiry.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {enquiry.status === 'new' && (
                    <button 
                      onClick={() => handleStatusUpdate(enquiry.id, 'read')}
                      disabled={updatingId === enquiry.id}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-semibold"
                    >
                      {updatingId === enquiry.id ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                      Mark Read
                    </button>
                  )}

                  <button 
                    onClick={() => syncToSheet(enquiry)}
                    disabled={syncingId === enquiry.id}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
                  >
                    {syncingId === enquiry.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Sync to Sheet
                  </button>

                  {/* --- NEW: Delete Button --- */}
                  <button 
                    onClick={() => handleDelete(enquiry.id)}
                    disabled={deletingId === enquiry.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                  >
                    {deletingId === enquiry.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wider">Subject: {enquiry.subject}</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
                
                {/* --- ATTACHMENTS SECTION --- */}
                {(enquiry.document_path || enquiry.image_path) && (
                  <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-4">
                    {enquiry.document_path && (
                      <a 
                        href={getPublicUrl(enquiry.document_path)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-600 hover:shadow-md transition-all"
                      >
                        <FileText size={16} /> View Document <ExternalLink size={12} />
                      </a>
                    )}
                    {enquiry.image_path && (
                      <div className="relative group">
                        <a href={getPublicUrl(enquiry.image_path)} target="_blank" rel="noreferrer">
                          <img 
                            src={getPublicUrl(enquiry.image_path)} 
                            alt="Inquiry" 
                            className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm hover:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg">
                            <ImageIcon size={16} className="text-white" />
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Enquiries;