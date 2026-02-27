import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// IMPORT BOTH DESIGNS
import FittingDetail from './FittingDetail'; // The new file you just created
import FastenerDetail from './ProductDetail'; // Your EXISTING Fastener page

const ProductDetailWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!slug) throw new Error("No slug");
        
        // 1. Fetch Product Data
        const { data: productData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (prodError || !productData) throw prodError;

        // 2. Fetch Variants (Important for both pages)
        const { data: vData } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productData.id);

        // Combine them
        const fullProduct = {
            ...productData,
            variants: vData || []
        };
        
        setProduct(fullProduct);

      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#dbdbdc]">
        <Loader2 className="animate-spin text-yellow-600" size={48} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#dbdbdc]">
        <h2 className="text-2xl font-bold mb-4 text-zinc-900">Product Not Found</h2>
        <Link to="/products" className="text-blue-600 font-bold underline">Back to Catalog</Link>
      </div>
    );
  }

  // --- THE LOGIC SWITCH ---
  // Detect if it is a fitting based on Category or SubCategory name
  const cat = product.category?.toLowerCase() || '';
  const sub = product.sub_category?.toLowerCase() || '';
  
  const isFitting = 
    cat.includes('fitting') || 
    cat.includes('channel') || 
    cat.includes('hinge') ||
    cat.includes('handle') ||
    sub.includes('fitting') ||
    sub.includes('channel');

  return (
    <>
      <Helmet>
        <title>{product.name} | Durable Fastener Pvt Ltd</title>
        <meta name="description" content={product.short_description || `Buy ${product.name} from Durable Fastener.`} />
      </Helmet>

      {isFitting ? (
        // RENDER NEW VISUAL DESIGN FOR FITTINGS
        <FittingDetail product={product} />
      ) : (
        // RENDER EXISTING TECHNICAL DESIGN FOR FASTENERS
        // Note: Your FastenerDetail (ProductDetail.tsx) currently fetches its own data.
        // To avoid double fetching, ideally, you should pass 'product' as a prop to it.
        // But to keep it simple and not break your old code, we will just 
        // render it and let it fetch data again (it's fast enough), OR
        // if your FastenerDetail supports props, pass it here.
        // For now, we mount the component which will use the URL params.
        <FastenerDetail /> 
      )}
    </>
  );
};

export default ProductDetailWrapper;