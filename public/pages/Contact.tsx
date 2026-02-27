import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, Loader2, 
  Globe, CheckCircle2, X, Paperclip, 
  Image as ImageIcon, UploadCloud
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// REPLACE THIS with your new Web App URL from the script above
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzR2Tv85F-MNNePk32-FuWH4zE14LQtCt_O2Wxk5dKktqUmJpFq7kzWUqReYH2ih9xC/exec';

// YOUR SPECIFIC PROJECT URL
const SUPABASE_PROJECT_URL = 'https://wterhjmgsgyqgbwviomo.supabase.co'; 

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [attachments, setAttachments] = useState<{
    document: File | null;
    image: File | null;
  }>({
    document: null,
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [error, setError] = useState('');

  // --- HELPERS ---

  const generateEnquiryId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `DF-${year}${month}-${randomStr}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setAttachments(prev => ({ ...prev, [name]: files[0] }));
    }
  }

  // --- THE MAGIC FUNCTION ---
  // Uploads to Supabase and returns the "Public URL" string
  const uploadToSupabaseAndGetUrl = async (file: File, folder: string, enquiryId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${enquiryId}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // 1. Upload
    const { error: uploadError, data } = await supabase.storage
      .from('enquiry-attachments') // Ensure this bucket exists in Supabase
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Create the exact URL format you wanted
    const { data: urlData } = supabase.storage
  .from('enquiry-attachments')
  .getPublicUrl(data.path);

const fullUrl = urlData.publicUrl;
    
    // Return both path (for admin) and fullUrl (for Google Sheet)
    return { path: data.path, fullUrl: fullUrl };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newId = generateEnquiryId();
    setGeneratedId(newId);

    try {
      let docData = { path: null as string | null, fullUrl: '' };
      let imgData = { path: null as string | null, fullUrl: '' };

      // 1. Upload Files to Supabase & Generate Links
      if (attachments.document) {
        docData = await uploadToSupabaseAndGetUrl(attachments.document, 'docs', newId);
      }
      if (attachments.image) {
        imgData = await uploadToSupabaseAndGetUrl(attachments.image, 'images', newId);
      }

      // 2. Insert into Supabase DB (For Admin Panel)
      // We store just the 'path' here to keep the DB clean
      const { error: supabaseError } = await supabase
        .from('enquiries')
        .insert([{
          enquiry_id: newId,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          document_path: docData.path,
          image_path: imgData.path,
          status: 'new'
        }]);

      if (supabaseError) throw new Error("Database insert failed");

      // 3. Send to Google Sheets (We send the FULL CLICKABLE URL)
   const googlePayload = {
  enquiry_id: newId,
  timestamp: new Date().toLocaleString(),
  first_name: formData.first_name,
  last_name: formData.last_name,
  email: formData.email,
  phone: formData.phone,
  subject: formData.subject,
  message: formData.message,
  document_url: docData.fullUrl || "No Document", // Make sure these keys match GAS
  image_url: imgData.fullUrl || "No Image"    
};

try {
  // We use text/plain to avoid CORS "pre-flight" blocks from Google
  await fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    mode: 'no-cors', 
    headers: { 'Content-Type': 'text/plain' }, 
    body: JSON.stringify(googlePayload)
  });
  console.log("Payload sent to Google:", googlePayload);
} catch (googleErr) {
  console.error("Google Sheet Sync Error:", googleErr);
}

      // 4. Success UI
      setShowPopup(true);
      setFormData({
        first_name: '', last_name: '', email: '',
        phone: '', subject: 'General Inquiry', message: ''
      });
      setAttachments({ document: null, image: null });

    } catch (err: any) {
      console.error("Submission Error:", err);
      setError('Technical glitch! Please call us at +91 87587 00709.');
    } finally {
      setLoading(false);
    }
  };

  const cardSlideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans relative">
      <Helmet>
        <title>Contact Durable Fastener | Top Screw Manufacturer in Rajkot</title>
        <meta name="description" content="Contact Durable Fastener Private Limited, Rajkot. MS screw manufacturer and global exporter." />
      </Helmet>

      {/* --- SUCCESS POPUP MODAL --- */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
            >
              <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Enquiry Submitted!</h3>
                <p className="text-slate-500 mb-6 text-sm">Our team will contact you shortly. Please note your Ticket ID.</p>
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 mb-8">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Your Ticket ID</span>
                  <span className="text-2xl font-mono font-bold text-blue-600">{generatedId}</span>
                </div>
                <div className="space-y-3">
                  <a href="tel:+918758700709" className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                    <Phone size={18} /> Call: +91 87587 00709
                  </a>
                  <button onClick={() => setShowPopup(false)} className="text-slate-500 text-sm font-medium hover:text-blue-600">Close</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Hero Header --- */}
      <div className="relative bg-slate-900 text-white pb-32 pt-20 lg:pt-32 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} className="absolute top-0 left-0 w-full h-full">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
          </svg>
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Globe size={14} className="animate-pulse" /> Global Fastener Supply
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Let's Engineer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Excellence</span>
          </motion.h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Looking for a manufacturing partner in Rajkot? Our engineering team is ready to provide custom quotes.
          </p>
        </div>
      </div>

      {/* --- Main Interface --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <motion.div variants={cardSlideUp} initial="hidden" animate="visible" className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
          
          {/* LEFT SIDE: Contact Info */}
          <div className="lg:w-2/5 bg-slate-800 text-white p-10 md:p-12 flex flex-col justify-between relative">
            <div>
              <h3 className="text-2xl font-bold mb-2">Contact Details</h3>
              <p className="text-slate-400 mb-10 text-sm">We typically respond within 24 hours.</p>
              <div className="space-y-8">
                <InfoItem icon={<MapPin size={22} />} colorClass="bg-blue-500/10 text-blue-400" title="Factory Address" content={<>Plot No.16, Surbhi Ind Zone-D, <br/>Ravki, Rajkot-360004, Gujarat</>} />
                <InfoItem icon={<Phone size={22} />} colorClass="bg-emerald-500/10 text-emerald-400" title="Call Us" content={<a href="tel:+918758700709" className="hover:text-emerald-400 transition-colors">+91 87587 00709</a>} subContent="Mon-Sat, 9:00 AM - 7:00 PM" />
                
                <InfoItem 
                    icon={<Send size={22} />} 
                    colorClass="bg-[#25D366]/10 text-[#25D366]"
                    title="WhatsApp Support"
                    content={
                        <div className="flex flex-col gap-2 mt-2">
                            {[
                                { label: "Sales Representative 1", num: "918758700704" },
                                { label: "Sales Representative 2", num: "918758700709" }
                            ].map((contact, idx) => (
                                <a 
                                    key={idx}
                                    href={`https://wa.me/${contact.num}?text=Hi%20Durable%20Fastener...`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between gap-4 px-4 py-2.5 bg-slate-700/40 border border-slate-600/50 rounded-xl hover:bg-[#25D366]/20 hover:border-[#25D366]/40 transition-all group"
                                >
                                    <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                                        {contact.label}
                                    </span>
                                    <span className="text-[10px] bg-slate-600/50 px-2 py-0.5 rounded text-slate-400 group-hover:text-[#25D366]">
                                        {contact.num.slice(-4)}
                                    </span>
                                </a>
                            ))}
                        </div>
                    }
                />
                <InfoItem icon={<Mail size={22} />} colorClass="bg-amber-500/10 text-amber-400" title="Email Us" content="durablefastener@outlook.com" />
              </div>
            </div>
            <div className="mt-12 p-4 bg-slate-700/50 rounded-2xl border border-slate-600/50 flex justify-between text-sm">
                <span className="text-slate-300">Mon - Sat</span>
                <span className="text-white font-semibold">09:00 - 19:00</span>
            </div>
          </div>

          {/* RIGHT SIDE: The Form */}
          <div className="lg:w-3/5 p-10 md:p-14 bg-white">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Send an Enquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Rahul" />
                <InputGroup label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Patel" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" />
                <InputGroup label="Contact Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" />
              </div>

              {/* --- File Upload Row --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Paperclip size={14} /> Drawing / PDF
                  </label>
                  <input type="file" name="document" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" id="doc-upload" />
                  <label htmlFor="doc-upload" className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium text-slate-600">
                    {attachments.document ? attachments.document.name.slice(0, 15) + '...' : 'Choose Doc'}
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <ImageIcon size={14} /> Product Image
                  </label>
                  <input type="file" name="image" onChange={handleFileChange} accept="image/*" className="hidden" id="img-upload" />
                  <label htmlFor="img-upload" className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm font-medium text-slate-600">
                    {attachments.image ? attachments.image.name.slice(0, 15) + '...' : 'Choose Image'}
                  </label>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                  <option>Export Inquiry</option>
                  <option>Custom Fastener / OEM Requirement</option>
                  <option>Product Inquiry – Standard Items</option>
                  <option>Bulk Purchase / Dealership Inquiry</option>
                   <option>Existing Order / Customer Support</option>
                    <option>Direct Complaint / Feedback to Management</option>
                     <option>Vendor / Raw Material / Service Proposal</option>
                      <option>Career / Job Application</option>
                       <option>Marketing / Business Collaboration</option>
                       <option>General Inquiry</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message / Requirements</label>
                <textarea name="message" rows={4} required value={formData.message} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium resize-none" placeholder="Specify screw type, size, or quantity..." />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70">
                {loading ? <Loader2 className="animate-spin" /> : <>Send Message <UploadCloud size={20} /></>}
              </button>
              <p className="text-center text-slate-400 text-xs mt-4 italic">Data synced to ERP and Sales Dashboard.</p>
            </form>
          </div>
        </motion.div>

        {/* --- MAP SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 mb-20 bg-white p-4 rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="text-red-600" fill="currentColor" fillOpacity={0.2} size={24} /> 
                Visit Our Factory
              </h3>
              <p className="text-slate-500 text-sm font-medium">Plot No.16, Surbhi Industrial Zone-D, Ravki, Rajkot</p>
            </div>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=22.203102,70.750531" 
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all border border-red-100 flex items-center gap-2"
            >
              <Send size={16} /> Get Directions
            </a>
          </div>
          
          <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-inner border border-slate-100 relative">
            <iframe 
              src="https://maps.google.com/maps?q=Durable%20Fastener%20Private%20Limited%20Ravki%20Rajkot&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Durable Fastener Factory Location"
              className="relative z-10"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, colorClass, title, content, subContent }: any) => (
  <div className="flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>{icon}</div>
    <div>
      <h4 className="font-semibold text-lg leading-tight">{title}</h4>
      <div className="text-slate-400 text-sm mt-1 leading-relaxed">{content}</div>
      {subContent && <p className="text-slate-500 text-xs mt-1">{subContent}</p>}
    </div>
  </div>
);

const InputGroup = ({ label, name, type = "text", value, onChange, placeholder }: any) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    <input type={type} name={name} required value={value} onChange={onChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 placeholder-gray-300" placeholder={placeholder} />
  </div>
);

export default Contact;