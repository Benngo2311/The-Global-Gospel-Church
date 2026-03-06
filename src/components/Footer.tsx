import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Mail, MapPin, Phone, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE_CONTENT, NAV_ITEMS } from '../constants/content';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 flex items-center justify-center bg-white rounded-full p-1 shadow-sm border border-slate-100">
              <img 
                src="https://tggpc.org/wp-content/uploads/2024/05/cropped-TGGPC-Logo-1.png" 
                alt="TGGPC Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="logo-fallback hidden w-full h-full items-center justify-center text-church-red">
                <Globe size={28} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-tight tracking-tight text-white">
                The Global Gospel Power Church
              </span>
              <span className="text-xs uppercase tracking-widest opacity-50 font-semibold">
                United States & Worldwide
              </span>
            </div>
          </Link>
          <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
            {t(SITE_CONTENT.about.description)}
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/UnitedPrayerSpiritualWarfareGlobalConference" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-church-red transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://tggpc.org/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-church-red transition-colors">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-white text-lg font-bold mb-6">{t({ en: 'Quick Links', vi: 'Liên Kết Nhanh' })}</h4>
          <ul className="space-y-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="hover:text-church-red transition-colors">
                  {t(item.title)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-white text-lg font-bold mb-6">{t({ en: 'Contact Us', vi: 'Liên Hệ' })}</h4>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <MapPin size={20} className="text-church-red shrink-0" />
              <span className="text-sm">{SITE_CONTENT.contact.address}</span>
            </li>
            <li className="flex gap-3">
              <Mail size={20} className="text-church-red shrink-0" />
              <span className="text-sm">{SITE_CONTENT.contact.email}</span>
            </li>
            {SITE_CONTENT.contact.phone && (
              <li className="flex gap-3">
                <Phone size={20} className="text-church-red shrink-0" />
                <span className="text-sm">{SITE_CONTENT.contact.phone}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
        <p>© {new Date().getFullYear()} The Global Gospel Power Church. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};
