import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Ask Supabase to verify email/password
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Invalid credentials. Access Denied.');
      setLoading(false);
    } else {
      // 2. If success, go to Dashboard
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-yellow"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-900 shadow-inner">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">ADMIN PANEL</h1>
          <p className="text-gray-500 text-sm mt-1">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-dark focus:outline-none transition-all"
                placeholder="admin@durable.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-dark focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-dark text-white font-bold py-4 rounded-lg hover:bg-black transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Secure Login <ArrowRight size={18} /></>}
          </button>
        </form>
        
        <div className="text-center mt-6 text-xs text-gray-400">
          Protected by Supabase Authentication
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;