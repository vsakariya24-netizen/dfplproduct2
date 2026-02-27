import React, { useState, useEffect } from 'react';
import { 
  FileText, Printer, ShieldCheck, Mail, MapPin, 
  Globe, Lock, CheckCircle, Scale, AlertCircle, ChevronRight,
  ArrowLeft, Info, Gavel, Server, AlertTriangle
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('section-1');

  // Handle scroll spy to update active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 150;

      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        const top = htmlSection.offsetTop;
        const height = htmlSection.offsetHeight;
        
        if (scrollPosition >= top && scrollPosition < top + height) {
          const id = htmlSection.getAttribute('id');
          if (id) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'section-1', label: '1. Introduction' },
    { id: 'section-2', label: '2. Legal Compliance' },
    { id: 'section-3', label: '3. Scope' },
    { id: 'section-4', label: '4. Data Categories' },
    { id: 'section-5', label: '5. Purpose' },
    { id: 'section-6', label: '6. Cookies' },
    { id: 'section-7', label: '7. Sharing & Disclosure' },
    { id: 'section-8', label: '8. International Data' },
    { id: 'section-9', label: '9. Security' },
    { id: 'section-10', label: '10. Retention' },
    { id: 'section-11', label: '11. Your Rights' },
    { id: 'section-12', label: '12. Internal Disclaimer' },
    { id: 'section-13', label: '13. Breach Limitation' },
    { id: 'section-14', label: '14. Third-Party' },
    { id: 'section-15', label: '15. Updates' },
    { id: 'section-16', label: '16. Jurisdiction' },
    { id: 'section-17', label: '17. Contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans print:bg-white">
      
      {/* Top Bar - Trust Indicators */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-700 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Lock size={12} className="text-green-400" /> SSL Encrypted Connection</span>
            <span className="hidden sm:flex items-center gap-1"><CheckCircle size={12} className="text-blue-400" /> DPDP Act 2023 Compliant</span>
          </div>
          <div className="font-mono opacity-70">DOC-REF: DF-2026-PP-V3</div>
        </div>
      </div>

      {/* Official Header */}
      <header className="bg-white shadow-sm border-b border-gray-300 relative overflow-hidden pb-8 pt-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back to Home Navigation */}
          <div className="mb-6 print:hidden">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all text-sm font-medium group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            
            {/* Title Area */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-900 text-white p-1.5 rounded-sm">
                  <Scale size={20} />
                </div>
                <span className="uppercase tracking-widest text-xs font-bold text-blue-900">Legal Department</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
              <p className="mt-3 text-lg text-slate-600 font-light">Durable Fastener Private Limited</p>
            </div>

            {/* Meta Data Box */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-sm shadow-sm">
                <div className="flex justify-between md:justify-start gap-8 border-b border-slate-200 pb-2 mb-2">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-green-700 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div> Active
                  </span>
                </div>
                <div className="flex justify-between md:justify-start gap-8">
                  <span className="text-slate-500">Effective</span>
                  <span className="font-semibold text-slate-900">Jan 06, 2026</span>
                </div>
              </div>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded text-sm font-medium transition-colors print:hidden"
              >
                <Printer size={16} /> Print Official Copy
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation - Sticky */}
          <aside className="lg:col-span-3 print:hidden">
            <nav className="sticky top-6 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 shrink-0">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Document Index</h3>
              </div>
              <ul className="py-2 overflow-y-auto custom-scrollbar">
                {sections.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between group transition-all border-l-4 ${
                        activeSection === item.id 
                          ? 'border-blue-700 bg-blue-50 text-blue-800' 
                          : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="truncate mr-2">{item.label}</span>
                      {activeSection === item.id && <ChevronRight size={12} className="shrink-0" />}
                    </button>
                  </li>
                ))}
              </ul>
              
              {/* Trust Badge Widget */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0">
                 <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck size={14} className="text-blue-600" />
                    <span>Updated: 06 Jan 2026</span>
                 </div>
              </div>
            </nav>
          </aside>

          {/* Main Content - Paper Style */}
          <article className="lg:col-span-9 bg-white shadow-xl shadow-slate-200/60 rounded-sm border border-slate-200 min-h-[800px] print:shadow-none print:border-none">
            
            <div className="p-8 md:p-12 lg:p-16 space-y-12">
              
              {/* Introduction / Section 1 */}
              <section id="section-1" className="scroll-mt-32 border-b border-slate-200 pb-8">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="text-blue-900 font-bold text-lg">1.</span>
                    <h2 className="text-2xl font-serif font-bold text-slate-900">Introduction</h2>
                 </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Durable Fastener Private Limited</strong>Company is committed to protecting personal data collected in the course of its business-to-business (B2B) operations. This Privacy Policy explains what data we collect, why we collect it, how it is used, stored, and protected, and the rights available to data principals under applicable law.
                  </p>
                  <p className="mt-4 text-slate-600 italic">
                    This Policy applies to all digital interactions with the Company, including use of https://durablefastener.com/.
                  </p>
                </div>
              </section>

              {/* Section 2: Legal Compliance */}
              <section id="section-2" className="scroll-mt-32">
                 <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Gavel size={20} className="text-blue-700" /> 2. Legal & Regulatory Compliance
                 </h2>
                 <div className="bg-blue-50 border-l-4 border-blue-700 p-5 rounded-r">
                    <p className="text-sm text-slate-700 mb-3">This Privacy Policy is issued in accordance with applicable Indian laws, including but not limited to:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm font-medium text-slate-800">
                        <li>Digital Personal Data Protection Act, 2023 (DPDP Act)</li>
                        <li>Information Technology Act, 2000</li>
                        <li>Applicable rules, regulations, and amendments thereunder</li>
                    </ul>
                    <p className="text-xs text-slate-500 mt-3">Where required, statutory obligations shall prevail over this Policy.</p>
                 </div>
              </section>

              {/* Section 3: Scope */}
              <section id="section-3" className="scroll-mt-32">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">3. Scope of Application</h2>
                <p className="text-slate-600 mb-3">This Policy applies to personal data collected through:</p>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div> Website visits and online interactions</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div> Business inquiries, RFQs, and OEM communications</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div> Distributors, vendors, logistics partners</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div> Digital correspondence (email/forms)</li>
                </ul>
                <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Note: This Website is not intended for consumer or personal use.</p>
              </section>

              {/* Section 4: Categories */}
              <section id="section-4" className="scroll-mt-32">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">4. Categories of Data Collected</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">4.1</span> Personal & Business Data
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li>• Name, designation, company name</li>
                        <li>• Official email address and phone number</li>
                        <li>• Business address, shipping address</li>
                        <li>• Information shared in RFQs/Inquiries</li>
                    </ul>
                  </div>
                  <div className="bg-white p-5 rounded border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">4.2</span> Technical & Usage Data
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li>• IP address</li>
                        <li>• Browser and device type</li>
                        <li>• Access timestamps and interaction logs</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5: Purpose */}
              <section id="section-5" className="scroll-mt-32">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">5. Purpose of Data Processing</h2>
                <p className="text-slate-600 mb-4">Personal data is processed strictly for legitimate business purposes:</p>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                    <ul className="space-y-3 text-slate-700 text-sm">
                        <li className="flex items-start gap-3">
                            <CheckCircle size={16} className="text-green-600 mt-0.5" />
                            Responding to inquiries and RFQs
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle size={16} className="text-green-600 mt-0.5" />
                            Processing orders, invoices, and dispatch documentation
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle size={16} className="text-green-600 mt-0.5" />
                            Issuing certifications, compliance documents, and test reports
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle size={16} className="text-green-600 mt-0.5" />
                            Verifying business identity and preventing fraud
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle size={16} className="text-green-600 mt-0.5" />
                            Meeting statutory, tax, audit, and regulatory obligations
                        </li>
                    </ul>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-800">We do not process data for consumer profiling or advertising.</p>
              </section>

              {/* Section 6: Cookies */}
              <section id="section-6" className="scroll-mt-32">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-3">6. Cookies & Tracking Technologies</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  The Website uses Essential cookies for core functionality and Performance cookies for aggregated traffic analysis.
                </p>
                <p className="text-slate-800 text-sm font-semibold mb-2">We do not use advertising or cross-site tracking cookies.</p>
                <p className="text-slate-500 text-xs">Users may disable cookies via browser settings; however, certain features may not function optimally.</p>
              </section>

              {/* Section 7 & 8 */}
              <div className="grid md:grid-cols-2 gap-8">
                <section id="section-7" className="scroll-mt-32">
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-3">7. Data Sharing & Disclosure</h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-2">We strictly <strong>do not sell</strong> personal data. Data is shared only with:</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                      <li>Logistics partners for order fulfillment</li>
                      <li>Statutory authorities (when mandated)</li>
                      <li>Authorized IT providers (under NDA)</li>
                  </ul>
                </section>
                <section id="section-8" className="scroll-mt-32">
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-3 flex items-center gap-2"><Globe size={18}/> 8. International Data</h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-2">For export inquiries:</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                      <li>Data may be processed outside India for business execution.</li>
                      <li>Processing is subject to reasonable safeguards.</li>
                      <li>Compliance with foreign regimes is not guaranteed unless expressly agreed.</li>
                  </ul>
                </section>
              </div>

              {/* Section 9 & 10 */}
              <div className="grid md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                <section id="section-9" className="scroll-mt-32">
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-3 flex items-center gap-2"><ShieldCheck size={18}/> 9. Data Security</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We implement reasonable technical and organizational safeguards to protect data. However, no system is completely secure, and we do not warrant absolute security of transmission or storage.
                  </p>
                </section>
                <section id="section-10" className="scroll-mt-32">
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-3 flex items-center gap-2"><Server size={18}/> 10. Data Retention</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Data is retained as long as necessary for the collected purpose or to comply with legal/tax obligations. Thereafter, it is securely deleted, anonymized, or archived.
                  </p>
                </section>
              </div>

              {/* Section 11: Rights */}
              <section id="section-11" className="scroll-mt-32 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">11. Data Principal Rights (DPDP Act, 2023)</h2>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h4 className="font-bold text-sm text-blue-800 mb-2 uppercase">Your Rights</h4>
                        <ul className="space-y-2 text-sm text-slate-700">
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> Request access to personal data</li>
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> Request correction of inaccurate data</li>
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> Request deletion (where permissible)</li>
                        </ul>
                    </div>
                    <div className="flex-1 border-l border-slate-200 pl-0 md:pl-8">
                        <h4 className="font-bold text-sm text-slate-600 mb-2 uppercase">Limitations</h4>
                        <p className="text-xs text-slate-500 mb-2">Requests may be denied where:</p>
                        <ul className="space-y-1 text-xs text-slate-500">
                            <li>• Retention is required by law</li>
                            <li>• Data is necessary for ongoing business/compliance</li>
                        </ul>
                        <p className="text-xs text-slate-400 mt-2 italic">We reserve the right to verify identity before acting.</p>
                    </div>
                </div>
              </section>

              {/* Legal Disclaimers (Sections 12, 13, 14, 15) */}
              <div className="border-t border-slate-200 pt-8">
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                    <section id="section-12" className="scroll-mt-32">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">12. Internal Data Handling Disclaimer</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                        Unauthorized access by employees contrary to policy is a violation. The Company takes corrective action but is not liable for actions outside authorized scope to the extent permitted by law.
                        </p>
                    </section>
                    <section id="section-13" className="scroll-mt-32">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">13. Data Breach Limitation</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                        In case of breach, we will mitigate impact and notify where required. We are not liable for indirect or consequential losses to the max extent permitted by law.
                        </p>
                    </section>
                    <section id="section-14" className="scroll-mt-32">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">14. Third-Party Websites</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                        We are not responsible for privacy practices of linked third-party sites. Users access them at their own risk.
                        </p>
                    </section>
                    <section id="section-15" className="scroll-mt-32">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">15. Policy Updates</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                        We may update this policy without notice. Continued use constitutes acceptance.
                        </p>
                    </section>
                </div>
              </div>

              {/* Section 16: Jurisdiction */}
              <section id="section-16" className="scroll-mt-32 bg-slate-100 p-4 rounded text-center">
                 <h2 className="text-sm font-bold text-slate-800">16. Governing Law & Jurisdiction</h2>
                 <p className="text-xs text-slate-600 mt-1">
                    Governed by the laws of India. All disputes subject to exclusive jurisdiction of courts at <strong>Rajkot, Gujarat, India</strong>.
                 </p>
              </section>

              {/* Section 17: Contact */}
              <section id="section-17" className="scroll-mt-32 mt-8 bg-slate-900 text-white p-8 rounded shadow-inner">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4">17. Contact Information</h2>
                    <div className="flex items-start gap-3">
                      <MapPin className="text-blue-400 shrink-0" size={20} />
                      <p className="text-slate-300 text-sm leading-relaxed">
                        <strong className="text-white block">Registered Office:</strong>
                        Durable Fastener Private Limited<br />
                        Plot No. 16, Survey No. 660,<br />
                        Surbhi Ind Zone-D, Ravki,<br />
                        Rajkot – 360004, Gujarat, India
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="text-blue-400 shrink-0" size={20} />
                      <a href="mailto:info@durablefastener.com" className="text-slate-300 text-sm hover:text-white transition-colors">info@durablefastener.com</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="text-blue-400 shrink-0" size={20} />
                      <a href="https://durablefastener.com" className="text-slate-300 text-sm hover:text-white transition-colors">www.durablefastener.com</a>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end items-start md:items-end">
                    <div className="flex gap-2 mb-4">
                      <div className="bg-white/10 p-2 rounded text-xs text-center min-w-[80px]">
                        <ShieldCheck size={24} className="mx-auto mb-1 text-green-400" />
                        <span>Secured</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded text-xs text-center min-w-[80px]">
                        <FileText size={24} className="mx-auto mb-1 text-blue-400" />
                        <span>IT Act 2000</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">
                       © 2026 Durable Fastener Private Limited.<br/>All Rights Reserved.
                    </p>
                  </div>
                </div>
              </section>

            </div>
          </article>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 mb-2">&copy; {new Date().getFullYear()} Durable Fastener Private Limited. All Rights Reserved.</p>
          <p className="text-xs text-slate-400">Unauthorized reproduction or distribution of this legal document is strictly prohibited.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;