import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe, ChevronDown, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { NAV_ITEMS } from '../constants/content';
import { cn } from '../lib/utils';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'glass py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-1 shadow-sm border border-slate-100">
            <img 
              src="/images/logo-edited.jpg" 
              alt="TGGPC Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // If the image fails, hide it and show the icon fallback
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                if (fallback) (fallback as HTMLElement).style.display = 'flex';
              }}
            />
            <div className="logo-fallback hidden w-full h-full items-center justify-center text-church-red">
              <Globe size={24} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl leading-tight tracking-tight text-church-red">
              TGGPC
            </span>
            <span className="text-[10px] uppercase tracking-widest opacity-70 font-bold text-slate-900">
              Global Gospel Power
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <div key={item.href} className="relative group">
              <Link
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-church-red relative py-1 flex items-center gap-1',
                  location.pathname === item.href || location.pathname.startsWith(item.href + '/') ? 'text-church-red' : 'text-slate-600'
                )}
              >
                {t(item.title)}
                {item.children && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
                {(location.pathname === item.href || location.pathname.startsWith(item.href + '/')) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-church-red"
                  />
                )}
              </Link>
              
              {item.children && (
                <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="w-64 glass rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={cn(
                          'block px-6 py-4 text-sm font-medium hover:bg-church-red/10 transition-colors',
                          location.pathname === child.href ? 'text-church-red' : 'text-slate-600'
                        )}
                      >
                        {t(child.title)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Support Button */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-church-red/10 text-church-red text-xs font-bold hover:bg-church-red hover:text-white transition-all"
          >
            <MessageSquare size={14} />
            {t({ en: 'Support & Prayer', vi: 'Hỗ Trợ & Cầu Nguyện' })}
          </button>

          {/* Language Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-church-red transition-colors">
              <Globe size={16} />
              <span className="uppercase">{language}</span>
              <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 glass rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl">
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-church-red/10 transition-colors',
                  language === 'en' && 'text-church-red font-bold'
                )}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('vi')}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-church-red/10 transition-colors',
                  language === 'vi' && 'text-church-red font-bold'
                )}
              >
                Tiếng Việt
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-600 hover:text-church-red transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white/100 backdrop-blur-md border-t border-white/20 p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <div key={item.href} className="flex flex-col gap-2">
                  <Link
                    to={item.href}
                    onClick={() => !item.children && setIsOpen(false)}
                    className={cn(
                      'text-lg font-serif font-medium transition-colors flex items-center justify-between',
                      location.pathname === item.href || location.pathname.startsWith(item.href + '/') ? 'text-church-red' : 'text-slate-600'
                    )}
                  >
                    {t(item.title)}
                  </Link>
                  {item.children && (
                    <div className="pl-4 flex flex-col gap-2 border-l border-church-red/20 ml-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'text-base font-medium transition-colors',
                            location.pathname === child.href ? 'text-church-red' : 'text-slate-400'
                          )}
                        >
                          {t(child.title)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
