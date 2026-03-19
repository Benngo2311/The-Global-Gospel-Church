import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
  title: { en: string; vi: string };
  description: { en: string; vi: string };
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://tggpc.org/og-image.jpg', // Replace with actual default OG image
  url = 'https://tggpc.org' 
}) => {
  const { language, t } = useLanguage();
  
  const siteName = {
    en: 'Global Gospel Power Church',
    vi: 'Hội Thánh Quyền Năng Tin Lành Toàn Cầu'
  };

  const fullTitle = `${t(title)} | ${t(siteName)}`;

  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={t(description)} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={t(description)} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={t(description)} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};
