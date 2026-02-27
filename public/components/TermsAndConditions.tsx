import React, { useState, useEffect } from 'react';
import { 
  FileText, Printer, ShieldCheck, Mail, MapPin, 
  Globe, Scale, AlertTriangle, ArrowLeft, ChevronRight,
  Copyright, Package, CreditCard, Gavel, Ban,
  Truck, CloudLightning, Users, RefreshCw, Link as LinkIcon
} from 'lucide-react';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('section-1');

  // Scroll Spy Logic
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
          if (id) setActiveSection(id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'section-1', label: '1. Intro & Acceptance', icon: FileText },
    { id: 'section-2', label: '2. Use of Website', icon: Globe },
    { id: 'section-3', label: '3. IP Rights', icon: Copyright },
    { id: 'section-4', label: '4. Product Info', icon: Package },
    { id: 'section-5', label: '5. Pricing & Quotes', icon: CreditCard },
    { id: 'section-6', label: '6. Orders', icon: FileText },
    { id: 'section-7', label: '7. Prohibited Use', icon: Ban },
    { id: 'section-8', label: '8. Liability', icon: AlertTriangle },
    { id: 'section-9', label: '9. External Links', icon: LinkIcon },
    { id: 'section-13', label: '13. Force Majeure', icon: CloudLightning },
    { id: 'section-14', label: '14. Export Compliance', icon: Truck },
    { id: 'section-17', label: '17. Governing Law', icon: Gavel },
    { id: 'section-18', label: '18. Contact Info', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans print:bg-white">
      
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-700 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Scale size={12} className="text-blue-400" /> Legal Compliance Document</span>
          </div>
          <div className="font-mono opacity-70">DOC-REF: DF-2026-TC-V2</div>
        </div>
      </div>

      {/* Header */}
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
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-slate-800 text-white p-1.5 rounded-sm">
                  <FileText size={20} />
                </div>
                <span className="uppercase tracking-widest text-xs font-bold text-slate-800">Legal Department</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Terms & Conditions</h1>
              <p className="mt-3 text-lg text-slate-600 font-light">Durable Fastener Private Limited</p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-sm shadow-sm">
                <div className="flex justify-between md:justify-start gap-8 border-b border-slate-200 pb-2 mb-2">
                  <span className="text-slate-500">Effective Date</span>
                  <span className="font-semibold text-slate-900">Jan 06, 2026</span>
                </div>
                <div className="flex justify-between md:justify-start gap-8">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="font-semibold text-slate-900">Jan 06, 2026</span>
                </div>
              </div>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded text-sm font-medium transition-colors print:hidden"
              >
                <Printer size={16} /> Print Agreement
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sticky Sidebar */}
          <aside className="lg:col-span-3 print:hidden">
            <nav className="sticky top-6 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 shrink-0">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Agreement Index</h3>
              </div>
              <ul className="py-2 overflow-y-auto custom-scrollbar">
                {sections.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 group transition-all border-l-4 ${
                        activeSection === item.id 
                          ? 'border-blue-700 bg-blue-50 text-blue-800 font-semibold' 
                          : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {activeSection === item.id && <ChevronRight size={14} className="shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="mt-6 bg-slate-800 rounded-lg p-6 text-white text-center shadow-lg hidden lg:block">
              <Gavel size={32} className="mx-auto mb-3 text-slate-400 opacity-90" />
              <h4 className="font-bold text-sm mb-1">Governing Law</h4>
              <p className="text-xs text-slate-300">Jurisdiction: Rajkot, Gujarat, India.</p>
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-9 bg-white shadow-xl shadow-slate-200/60 rounded-sm border border-slate-200 min-h-[800px] print:shadow-none print:border-none">
            
            <div className="p-8 md:p-12 lg:p-16 space-y-12">
              
              {/* 1. Introduction & Acceptance */}
              <section id="section-1" className="scroll-mt-24 border-b border-slate-200 pb-8">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">1.</span> Introduction & Acceptance
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="lead text-lg text-slate-700 leading-relaxed">
                    <strong>Welcome to https://durablefastener.com/ Website</strong> This Website is owned and operated by Durable Fastener Private Limited Company
                  </p>
                  <p className="text-slate-700 mt-4">
                    By accessing, browsing, or using this Website, you agree to be legally bound by these Terms & Conditions. If you do not agree to these Terms, you must discontinue use of the Website immediately.
                  </p>
                </div>
              </section>

              {/* 2. Use of Website */}
              <section id="section-2" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">2.</span> Use of Website
                </h2>
                <p className="text-slate-700 mb-3">This Website is intended strictly for business, commercial, and informational purposes. You agree to:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 marker:text-blue-500">
                  <li>Use the Website only for lawful purposes</li>
                  <li>Not misuse, damage, disrupt, or interfere with the Website or its servers</li>
                  <li>Not use Website content for competitive, fraudulent, or unlawful purposes</li>
                </ul>
                <div className="mt-4 p-3 bg-red-50 text-red-800 text-sm border-l-4 border-red-400">
                  Unauthorized use of this Website may give rise to civil liability and/or criminal prosecution under applicable Indian laws.
                </div>
              </section>

              {/* 3. Intellectual Property Rights */}
              <section id="section-3" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">3.</span> Intellectual Property Rights
                </h2>
                <div className="bg-slate-50 p-6 rounded border border-slate-200">
                  <p className="text-slate-700 mb-3">
                    All content available on this Website, including but not limited to Text, images, graphics, logos, Product descriptions, specifications, technical data, Drawings, layouts, videos, and icons is the intellectual property of <strong>Durable Fastener Private Limited</strong>, unless otherwise stated.
                  </p>
                  <p className="text-slate-700 mb-3">
                    This includes proprietary know-how, custom specifications, OEM drawings, trade secrets, and confidential manufacturing information, whether or not expressly marked as confidential.
                  </p>
                  <p className="text-slate-700 text-sm font-medium">
                    <Copyright size={14} className="inline mr-1"/> No material may be copied, reproduced, republished, transmitted, distributed, or exploited in any form without prior written permission from the Company.
                  </p>
                </div>
              </section>

              {/* 4. Product Information & Technical Accuracy */}
              <section id="section-4" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">4.</span> Product Information & Technical Accuracy
                </h2>
                <p className="text-slate-600 mb-3">All product specifications, dimensions, grades, standards, finishes, and technical information displayed on the Website are provided for general informational purposes only.</p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded text-sm text-blue-900">
                    <strong>Note:</strong> Website content does not constitute a technical offer, binding specification, or warranty. Product images are for representational purposes only.
                  </div>
                  <div className="bg-slate-50 p-4 rounded text-sm text-slate-700 border border-slate-200">
                    Final specifications shall be confirmed only through official quotations, approved technical datasheets, or written confirmation issued by the Company.
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">The Company does not guarantee that Website information is complete, current, or error-free.</p>
              </section>

              {/* 5. Pricing, Quotations & Inquiries */}
              <section id="section-5" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">5.</span> Pricing, Quotations & Inquiries
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 marker:text-slate-400">
                  <li>Any prices displayed on the Website are indicative and subject to change without notice.</li>
                  <li>All quotations are valid only for the period explicitly stated in the quotation.</li>
                  <li>Taxes, duties, freight, insurance, and other charges shall apply unless expressly stated otherwise.</li>
                </ul>
                <p className="mt-4 text-sm bg-yellow-50 text-yellow-800 p-3 rounded border border-yellow-200">
                  Any inquiry, RFQ, quotation, or communication (including email or WhatsApp) does not constitute a binding contract unless expressly confirmed in writing by an authorized representative of the Company. The Company reserves the right to correct any typographical, clerical, or pricing errors.
                </p>
              </section>

              {/* 6. Orders & Acceptance */}
              <section id="section-6" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">6.</span> Orders & Acceptance
                </h2>
                <p className="text-slate-700 mb-2">Submission of an inquiry or purchase order does not imply acceptance. All orders are subject to:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200">Technical feasibility</span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200">Commercial approval</span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200">Written order confirmation</span>
                </div>
                <p className="text-slate-600 text-sm">The Company reserves the absolute right to accept or reject any order without assigning reasons.</p>
              </section>

              {/* 7. Prohibited Use of Technical Data */}
              <section id="section-7" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">7.</span> Prohibited Use of Technical Data
                </h2>
                <div className="bg-red-50 border border-red-100 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Ban className="text-red-600" size={20}/>
                    <h3 className="font-semibold text-red-800 text-sm uppercase tracking-wide">Users shall not, without written authorization:</h3>
                  </div>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {['Scrape, extract, or harvest technical data', 'Use specs/drawings for reverse engineering', 'Replicate or source competing products', 'Use data for competitive misuse'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-red-700 text-sm bg-white/50 p-2 rounded">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-red-600 text-xs mt-3 font-semibold">* Violation may result in legal action.</p>
                </div>
              </section>

              {/* 8. Limitation of Liability */}
              <section id="section-8" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-700">8.</span> Limitation of Liability
                </h2>
                <p className="text-slate-600 mb-4">Website content is provided on an “as-is” and “as-available” basis. The Company shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from use of the Website, reliance on info, or technical failures.</p>
                <div className="bg-slate-50 p-4 border-l-4 border-slate-400 text-sm text-slate-700">
                  <p className="mb-2">In no event shall the Company’s total liability exceed the value of goods or services supplied under the relevant confirmed order.</p>
                  <p><strong>Exclusions:</strong> Loss of profits, business interruption, production loss, or OEM penalties are expressly excluded.</p>
                </div>
              </section>

              {/* Sections 9-12 Grouped */}
              <div className="border-t border-b border-slate-200 py-8 space-y-8">
                <section id="section-9">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><LinkIcon size={16} className="text-blue-600"/> 9. External Links</h3>
                  <p className="text-sm text-slate-600">This Website may contain links to third-party websites. The Company has no control over such websites and is not responsible for their content, policies, or practices. Accessing third-party links is at the user’s own risk.</p>
                </section>
                
                <section id="section-10">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Mail size={16} className="text-blue-600"/> 10. User Submissions</h3>
                  <p className="text-sm text-slate-600">Any information or material submitted through the Website (forms, emails, inquiries) shall be deemed non-confidential, unless expressly agreed otherwise in writing. The Company may use such information for business communication and service purposes and is under no obligation to act upon or respond to submissions.</p>
                </section>
                
                <section id="section-11">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><ShieldCheck size={16} className="text-blue-600"/> 11. Privacy & Data Protection</h3>
                  <p className="text-sm text-slate-600">Use of this Website is also governed by our Privacy Policy. Personal data shall be processed in accordance with applicable Indian laws, including the Digital Personal Data Protection Act, 2023.</p>
                </section>

                <section id="section-12">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Ban size={16} className="text-blue-600"/> 12. Termination of Access</h3>
                  <p className="text-sm text-slate-600">The Company reserves the right to suspend, restrict, or terminate access to the Website at any time, without notice, if these Terms are violated.</p>
                </section>
              </div>

              {/* 13. Force Majeure */}
              <section id="section-13" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-blue-700">13.</span> Force Majeure
                </h2>
                <div className="flex items-start gap-3">
                  <CloudLightning className="text-slate-400 mt-1" size={20} />
                  <p className="text-slate-700">The Company shall not be liable for failure or delay in performance due to events beyond its reasonable control, including but not limited to acts of God, strikes, power failures, transport disruptions, government actions, war, or natural disasters.</p>
                </div>
              </section>

              {/* 14. Export & Regulatory Compliance */}
              <section id="section-14" className="scroll-mt-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-blue-700">14.</span> Export & Regulatory Compliance
                </h2>
                <p className="text-slate-700 mb-2">Buyers and users are solely responsible for:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                  <li>Compliance with import/export laws</li>
                  <li>Customs duties, taxes, sanctions, and local regulations applicable in their jurisdiction</li>
                </ul>
                <p className="text-slate-500 text-xs mt-2">The Company shall not be liable for non-compliance by the buyer or user.</p>
              </section>

               {/* 15 & 16 */}
               <div className="grid md:grid-cols-2 gap-8 border-t border-slate-200 pt-8">
                <section id="section-15">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Users size={16} className="text-blue-600"/> 15. No Partnership or Agency</h3>
                  <p className="text-sm text-slate-600">Use of this Website does not create any partnership, agency, joint venture, or employment relationship between the user and the Company.</p>
                </section>
                <section id="section-16">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><RefreshCw size={16} className="text-blue-600"/> 16. Changes to Terms</h3>
                  <p className="text-sm text-slate-600">The Company may revise these Terms at any time without prior notice. Continued use of the Website constitutes acceptance of the updated Terms.</p>
                </section>
              </div>

              {/* 17. Governing Law */}
              <section id="section-17" className="scroll-mt-24 bg-slate-50 p-6 rounded border border-slate-200 mt-8">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-blue-700">17.</span> Governing Law & Jurisdiction
                </h2>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <p className="text-slate-700 mb-2">These Terms shall be governed by and interpreted in accordance with the laws of <strong>India</strong>.</p>
                    <p className="text-slate-700">All disputes shall be subject to the exclusive jurisdiction of courts at <strong>Rajkot, Gujarat, India</strong>.</p>
                  </div>
                  <div className="hidden sm:block border-l border-slate-300 pl-6">
                    <Scale size={32} className="text-slate-300" />
                  </div>
                </div>
              </section>

              {/* 18. Contact Information */}
              <section id="section-18" className="scroll-mt-24 mt-12 bg-slate-900 text-white p-8 rounded shadow-inner">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4">18. Contact Information</h2>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="text-blue-400 shrink-0 mt-1" size={20} />
                      <p className="text-slate-300 text-sm leading-relaxed">
                        <strong className="text-white block uppercase tracking-wide text-xs mb-1">Registered Office</strong>
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
                    <div className="bg-white/10 p-4 rounded text-center">
                      <ShieldCheck size={32} className="mx-auto mb-2 text-blue-400" />
                      <span className="text-xs text-blue-100">Official Legal Document</span>
                    </div>
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

export default TermsAndConditions;