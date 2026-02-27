import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteLinks } from '../contexts/LinkContext';

interface Props {
  linkKey: string;      // Database wali key (e.g., 'btn_quote')
  className?: string;
  children: React.ReactNode;
  fallback?: string;    // Agar DB mein link na mile
}

const SmartLink: React.FC<Props> = ({ linkKey, className, children, fallback = '#' }) => {
  const allLinks = useSiteLinks();
  const finalUrl = allLinks[linkKey] || fallback; // DB se URL lo ya fallback use karo
  
  // Check: Kya ye external link hai (http/mailto/tel)?
  const isExternal = finalUrl.startsWith('http') || finalUrl.startsWith('mailto') || finalUrl.startsWith('tel');

  if (isExternal) {
    return (
      <a href={finalUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return <Link to={finalUrl} className={className}>{children}</Link>;
};

export default SmartLink;