import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
  title?: { en: string; vi: string } | string;
  description?: { en: string; vi: string } | string;
  image?: string;
  url?: string;
  keywords?: { en: string; vi: string } | string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = '/images/logo-edited.jpg',
  url = 'https://tggpc.org', // Replace with your actual domain
  keywords
}) => {
  const { language } = useLanguage();
  
  const siteName = 'Global Gospel Power Church';
  
  const getLocalized = (content: any) => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    return content[language] || content.en;
  };

  const currentTitle = title ? `${getLocalized(title)} | ${siteName}` : siteName;
  
  const currentDesc = description 
    ? getLocalized(description) 
    : getLocalized({
        en: 'A community dedicated to spiritual growth, connection, and global prayer. Join us as we spread the message of The Trinity of God.',
        vi: 'Một cộng đồng tận hiến cho sự phát triển thuộc linh, kết nối và cầu nguyện toàn cầu. Hãy tham gia cùng chúng tôi khi chúng tôi lan tỏa thông điệp của Ba Ngôi Đức Chúa Trời.'
      });

  const currentKeywords = keywords 
    ? getLocalized(keywords)
    : getLocalized({
        en: 'church, global gospel power church, christian, prayer, bible school, heaven band, benson az church',
        vi: 'hội thánh, hội thánh tin lành quyền phép toàn cầu, cơ đốc giáo, cầu nguyện, trường kinh thánh, ban nhạc thiên đàng, nhà thờ benson az'
      });

  return (
    <Helmet>
      <html lang={language} />
      <title>{currentTitle}</title>
      <meta name="description" content={currentDesc} />
      <meta name="keywords" content={currentKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDesc} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={currentTitle} />
      <meta property="twitter:description" content={currentDesc} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};
