import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Type define kiya
interface LinkMap {
  [key: string]: string; // example: { 'social_fb': 'https://facebook...' }
}

const LinkContext = createContext<LinkMap>({});

export const LinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<LinkMap>({});

  useEffect(() => {
    const fetchLinks = async () => {
      // Database se data laao
      const { data } = await supabase.from('site_links').select('key_name, url');
      
      if (data) {
        // Data ko Object mein badlo taaki fast access ho sake
        const linkObj: LinkMap = {};
        data.forEach(item => {
          linkObj[item.key_name] = item.url;
        });
        setLinks(linkObj);
      }
    };

    fetchLinks();
  }, []);

  return (
    <LinkContext.Provider value={links}>
      {children}
    </LinkContext.Provider>
  );
};

export const useSiteLinks = () => useContext(LinkContext);