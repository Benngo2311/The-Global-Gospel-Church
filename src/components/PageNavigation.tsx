import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PageLink {
  title: { en: string; vi: string };
  path: string;
}

interface PageNavigationProps {
  prev?: PageLink;
  next?: PageLink;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({ prev, next }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-6 mt-20 border-t border-slate-100 pt-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        {prev ? (
          <Link 
            to={prev.path}
            className="group flex items-center gap-4 text-slate-500 hover:text-church-red transition-colors w-full sm:w-auto"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-church-red/10 flex items-center justify-center transition-colors shrink-0">
              <ArrowLeft size={20} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1">{t({ en: 'Previous', vi: 'Trang Trước' })}</div>
              <div className="font-serif font-bold text-lg text-slate-900 group-hover:text-church-red transition-colors">
                {t(prev.title)}
              </div>
            </div>
          </Link>
        ) : <div />}

        {next ? (
          <Link 
            to={next.path}
            className="group flex items-center gap-4 text-slate-500 hover:text-church-red transition-colors w-full sm:w-auto sm:text-right justify-end"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1">{t({ en: 'Next', vi: 'Trang Tiếp' })}</div>
              <div className="font-serif font-bold text-lg text-slate-900 group-hover:text-church-red transition-colors">
                {t(next.title)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-church-red/10 flex items-center justify-center transition-colors shrink-0">
              <ArrowRight size={20} />
            </div>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};
