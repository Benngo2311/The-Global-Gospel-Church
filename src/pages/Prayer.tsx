import React from 'react';
import { PrayerWall } from '../components/PrayerWall';
import { RepentingCorner } from '../components/RepentingCorner';
import { SEO } from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

export const Prayer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-20">
      <SEO 
        title={{ en: 'Prayer & Repentance', vi: 'Cầu Nguyện & Ăn Năn' }} 
        description={{ en: 'Join our community in prayer and find a safe space for repentance.', vi: 'Tham gia cộng đồng cầu nguyện của chúng tôi và tìm một không gian an toàn để ăn năn.' }}
        url="https://tggpc.org/prayer"
      />
      <PrayerWall />
      <RepentingCorner />
    </div>
  );
};
