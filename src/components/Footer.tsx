import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-24 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-church-red flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xl">G</span>
              </div>
              <span className="font-serif font-bold text-xl text-white">
                Global Gospel<br />Power Church
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {t({
                en: 'Equipping believers, spreading the Gospel, and transforming lives through the power of the Holy Spirit.',
                vi: 'Trang bị cho tín hữu, rao truyền Phúc Âm và biến đổi cuộc đời qua quyền năng của Đức Thánh Linh.'
              })}
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=100086208836511" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-church-red hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://www.youtube.com/@TheGlobalGospelPowerChurch" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-church-red hover:text-white transition-colors">
                <Youtube size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-church-red hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-6">
              {t({ en: 'Quick Links', vi: 'Liên Kết Nhanh' })}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="hover:text-church-red transition-colors">
                  {t({ en: 'About Us', vi: 'Về Chúng Tôi' })}
                </Link>
              </li>
              <li>
                <Link to="/ministries" className="hover:text-church-red transition-colors">
                  {t({ en: 'Ministries', vi: 'Các Mục Vụ' })}
                </Link>
              </li>
              <li>
                <Link to="/classes" className="hover:text-church-red transition-colors">
                  {t({ en: 'Classes', vi: 'Lớp Học' })}
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-church-red transition-colors">
                  {t({ en: 'Events', vi: 'Sự Kiện' })}
                </Link>
              </li>
              <li>
                <Link to="/giving" className="hover:text-church-red transition-colors flex items-center gap-2">
                  <Heart size={14} className="text-church-red" />
                  {t({ en: 'Give Online', vi: 'Dâng Hiến' })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-serif font-bold text-lg mb-6">
              {t({ en: 'Contact Us', vi: 'Liên Hệ' })}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-church-red shrink-0 mt-1" />
                <p className="text-slate-400">
                  14441 Brookhurst St, Suite 4<br />
                  Garden Grove, CA 92843
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-church-red shrink-0" />
                <a href="tel:+17148580000" className="text-slate-400 hover:text-white transition-colors">
                  (714) 858-0000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-church-red shrink-0" />
                <a href="mailto:info@tggpc.org" className="text-slate-400 hover:text-white transition-colors">
                  info@tggpc.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} The Global Gospel Power Church. {t({ en: 'All rights reserved.', vi: 'Đã đăng ký bản quyền.' })}
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
