import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Video } from 'lucide-react';

export const Videos: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-6 flex items-center justify-center">
      <div className="text-center max-w-md">
        <Video className="w-16 h-16 text-church-red mx-auto mb-6 opacity-80" />
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t({ en: 'Videos', vi: 'Video' })}</h1>
        <p className="text-slate-500">
          {t({ en: 'This section is currently under construction. Please check back later.', vi: 'Phần này đang được xây dựng. Vui lòng quay lại sau.' })}
        </p>
      </div>
    </div>
  );
};
