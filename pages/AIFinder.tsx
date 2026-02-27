import React, { useState, useEffect } from 'react';
// Added a simple error state to handle API failures
import { getProductRecommendations, RecommendationResult } from '../services/geminiService';
import { PRODUCTS } from '../constants';
import * as ReactRouterDOM from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const { Link } = ReactRouterDOM;

const AIFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const recs = await getProductRecommendations(query);
      setResults(recs);
    } catch (err) {
      setError("I'm having trouble connecting to the catalog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // User-Friendly: Pre-filled suggestions relevant to your specific exports
  const suggestions = [
    "SDS Screws for heavy steel structures",
    "Self-tapping screws for Sri Lanka solar projects",
    "Rust-proof fasteners for outdoor furniture",
    "High-torque bolts for machinery"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-brand-yellow/20 text-orange-600 rounded-full mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">CLASSONE AI Finder</h1>
          <p className="text-gray-600 text-lg">
            Tell us about your project, and we'll find the right Durable Fastener product.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-10 border border-gray-100">
          <form onSubmit={handleSearch}>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I need a wafer head screw for thin metal sheets that doesn't slip..."
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-900 text-lg focus:border-orange-500 focus:ring-0 transition-all resize-none min-h-[120px]"
            />
            <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
               <div className="flex flex-wrap gap-2">
                 {suggestions.map((s, i) => (
                   <button 
                    key={i} 
                    type="button" 
                    onClick={() => setQuery(s)} 
                    className="text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-600 px-3 py-1 rounded-full transition-all"
                   >
                     {s}
                   </button>
                 ))}
               </div>
               <button 
                type="submit" 
                disabled={loading || !query.trim()}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {loading ? 'Consulting Catalog...' : 'Find Fastener'}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {searched && (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center text-blue-800">
                No exact match found for this application. Try describing the material or environment.
              </div>
            )}

            <div className="grid gap-6">
              {results.map((res) => {
                const product = PRODUCTS.find(p => p.id === res.productId);
                if (!product) return null;

                return (
                  <div key={res.productId} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
                    <div className="w-full md:w-56 h-48 bg-gray-200 flex-shrink-0">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                         <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                           {res.matchScore}% Confidence
                         </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">{product.category}</p>
                      
                      <div className="bg-gray-50 border-l-4 border-orange-500 p-3 rounded-r-lg mb-4">
                        <p className="text-sm text-gray-700 italic">
                          "{res.rationale}"
                        </p>
                      </div>

                      <Link to={`/product/${product.slug}`} className="mt-auto inline-flex items-center text-orange-600 font-bold hover:gap-3 transition-all">
                         View Technical Specs <ArrowRight size={18} className="ml-2" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFinder;