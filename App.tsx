import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
// 1. ADD THIS IMPORT for the SEO Fix
import { HelmetProvider } from 'react-helmet-async'; 

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PrivacyPolicy from './components/Privacypolicy';
import TermsAndConditions from './components/TermsAndConditions';


// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetailWrapper from './pages/ProductDetailWrapper';

import Contact from './pages/Contact';
import AIFinder from './pages/AIFinder';
import About from './pages/About';
import Manufacturing from './pages/Manufacturing';
import Industrial from './pages/Industrial';
import OEMPlatform from './pages/OEMPlatform';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import BlogDetail from './pages/BlogDetail';
import AdminLifeGallery from './pages/Admin/AdminLifeGallery';
import ManageOEM from './pages/Admin/ManageOEM'; // Import the new file

// Admin Components
import AdminLogin from './pages/Admin/Login';
import AdminLayout from './components/AdminLayout';
import DashboardHome from './pages/Admin/Dashboard';
import ProductManager from './pages/Admin/ProductList';
import Enquiries from './pages/Admin/Enquiries';
import AddProduct from './pages/Admin/AddProduct';
import JobsList from './pages/Admin/JobsList';
import AddBlog from './pages/Admin/AddBlog';
import BlogList from './pages/Admin/BlogList';
import ManageCategories from './pages/Admin/ManageCategories';
import ManufacturingAdmin from './pages/Admin/ManufacturingAdmin';
import AdminSiteContent from './pages/Admin/AdminSiteContent';
import AddJob from './pages/Admin/AddJob'; 

// Contexts & Auth
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import ProtectedRoute from './components/ProtectedRoute';

const { BrowserRouter: Router, Routes, Route, Navigate } = ReactRouterDOM;

const App: React.FC = () => {
  return (
    // 2. WRAP YOUR APP WITH HELMET PROVIDER
    <HelmetProvider>
      <AuthProvider>
        <ProductProvider>
          <Router>
            <ScrollToTop />
            
            <Routes>
              {/* --- Public Website Routes --- */}
  <Route path="/" element={
  <>
    <Navbar />
    {/* 👇 YAHAN CHANGE KIYA: 'pt-28' (Mobile ke liye extra space) */}
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full pt-28 md:pt-48">
        <Home />
      </main>
      <Footer />
    </div>
  </>
} />
              <Route path="/about" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><About /></main><Footer /></div></>} />
             <Route 
  path="/products" 
  element={<><Navbar /><div className="flex flex-col min-h-screen">
    <main className="flex-grow pt-16"><Products /></main><Footer /></div></>} 
/>

{/* 2. Category Route (e.g. /products/fasteners) */}
<Route 
  path="/products/:category" 
  element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Products /></main><Footer /></div></>} 
/>

{/* 3. Sub-Category Route (e.g. /products/fasteners/bolts) */}
<Route 
  path="/products/:category/:subcategory" 
  element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Products /></main><Footer /></div></>} 
/>
              <Route 
  path="/product/:slug" 
  element={
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        {/* We remove pt-16 because the Wrapper pages handle their own padding */}
        <main className="flex-grow pt-0">
           <ProductDetailWrapper />
        </main>
        <Footer />
      </div>
    </>
  } 
/>
              <Route path="/manufacturing" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Manufacturing /></main><Footer /></div></>} />
              <Route path="/industrial" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Industrial /></main><Footer /></div></>} />
              <Route path="/contact" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Contact /></main><Footer /></div></>} />
              <Route path="/ai-finder" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><AIFinder /></main><Footer /></div></>} />
              <Route path="/oem-platform" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><OEMPlatform /></main><Footer /></div></>} />
              <Route path="/careers" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Careers /></main><Footer /></div></>} />
              <Route path="/blog" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Blog /></main><Footer /></div></>} />
              <Route path="/blog/:slug" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><BlogDetail /></main><Footer /></div></>} />

              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
             <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              {/* --- Admin Login --- */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="life-gallery" element={<AdminLifeGallery />} />
              
              {/* --- Secure Admin Panel --- */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  
                  <Route index element={<Navigate to="dashboard" replace />} />
                  
                  <Route path="dashboard" element={<DashboardHome />} />
                  <Route path="products" element={<ProductManager />} />
                  <Route path="products/new" element={<AddProduct />} />
                  <Route path="products/edit/:id" element={<AddProduct />} />
                  <Route path="categories" element={<ManageCategories />} />
                  <Route path="site-content" element={<AdminSiteContent />} />
                  <Route path="enquiries" element={<Enquiries />} />
                  <Route path="life-gallery" element={<AdminLifeGallery />} />
                  <Route path="manufacturing" element={<ManufacturingAdmin />} />
                  {/* --- JOBS ROUTES --- */}
                  <Route path="jobs" element={<JobsList />} />
                  <Route path="jobs/new" element={<AddJob />} /> 
                  <Route path="jobs/edit/:id" element={<AddJob />} />
                 
                  {/* Blog Admin Routes */}
                  <Route path="edit-blog/:id" element={<AddBlog />} />
                  <Route path="add-blog" element={<AddBlog />} />
                  <Route path="blogs" element={<BlogList />} />
                  <Route path="manage-oem" element={<ManageOEM />} />
                </Route>
              </Route>

              {/* --- 404 Fallback --- */}
              <Route path="*" element={<Navigate to="/" replace />} />
            
            </Routes>
          </Router>
        </ProductProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;