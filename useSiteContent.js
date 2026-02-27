import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useSiteContent = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase.from('site_assets').select('*');
      
      if (data) {
        // Data ko ek simple object mein badal rahe hain: { key_name: value }
        const formattedData = data.reduce((acc, item) => {
          acc[item.key_name] = item.asset_value;
          return acc;
        }, {});
        setContent(formattedData);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  return { content, loading };
};