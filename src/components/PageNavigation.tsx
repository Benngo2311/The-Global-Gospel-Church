import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavLink {
  title: { en: string; vi: string };
  path: string;
}

interface PageNavigationProps {
  prev?: NavLink;
  next?: NavLink;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({ prev, next }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-200/60 pt-12">
        {prev ? (
          <Link to={prev.path} className="group flex items-center gap-4 text-slate-600 hover:text-church-red transition-colors w-full sm:w-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-church-red/10 group-hover:text-church-red transition-colors shrink-0">
              <ArrowLeft size={20} />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{t({ en: 'Previous', vi: 'Trang Trước' })}</p>
              <p className="font-serif font-bold text-lg text-slate-900 group-hover:text-church-red transition-colors">{t(prev.title)}</p>
            </div>
          </Link>
        ) : <div className="hidden sm:block" />}

        {next ? (
          <Link to={next.path} className="group flex items-center gap-4 text-slate-600 hover:text-church-red transition-colors w-full sm:w-auto justify-end text-right">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{t({ en: 'Next', vi: 'Trang Tiếp' })}</p>
              <p className="font-serif font-bold text-lg text-slate-900 group-hover:text-church-red transition-colors">{t(next.title)}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-church-red/10 group-hover:text-church-red transition-colors shrink-0">
              <ArrowRight size={20} />
            </div>
          </Link>
        ) : <div className="hidden sm:block" />}
      </div>
    </div>
  );
};
