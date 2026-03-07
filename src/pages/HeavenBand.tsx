import React from 'react';
import { motion } from 'motion/react';
import { Music, Mic2, Radio, Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const HeavenBand: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    { en: 'Worship Concerts', vi: 'Hòa Nhạc Thờ Phượng' },
    { en: 'Livestream Production', vi: 'Sản Xuất Livestream' },
    { en: 'Gospel Music Creation', vi: 'Sáng Tác Nhạc Thánh' }
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1732465286852-a0b95393a90d?q=80&auto=format&fit=crop&w=800",
    "https://images.unsplash.com/photo-1732466285965-87c9caa258a0?q=80&auto=format&fit=crop&w=800",
    "https://images.unsplash.com/photo-1731902062588-4dce45ccc0cb?q=80&auto=format&fit=crop&w=800"
  ];

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="px-6 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-church-red/10 text-church-red text-xs font-bold uppercase tracking-widest mb-8">
                <Music size={14} />
                {t({ en: 'Music Ministry', vi: 'Mục Vụ Âm Nhạc' })}
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                Heaven <span className="text-church-red italic">Band</span>
              </h1>
              <p className="text-2xl text-slate-600 leading-relaxed mb-10 font-medium">
                {t({ 
                  en: 'The Music Ministry coordinates several member bands located in the United States, Europe, and Vietnam.', 
                  vi: 'Mục vụ Âm nhạc điều phối nhiều ban nhạc thành viên tại Hoa Kỳ, Châu Âu và Việt Nam.' 
                })}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="p-6 rounded-3xl bg-church-cream border border-church-red/10">
                  <p className="text-slate-700 font-medium leading-relaxed">
                    <strong>{t({ en: 'Organizes and produces', vi: 'Tổ chức và sản xuất' })}</strong> {t({ 
                      en: 'worship programs, concerts, livestreams, audio recordings, and the composition of sacred music.', 
                      vi: 'các chương trình thờ phượng, hòa nhạc, livestream, ghi âm và sáng tác nhạc thánh.' 
                    })}
                  </p>
                </div>
                <div className="p-6 rounded-3xl bg-church-cream border border-church-red/10">
                  <p className="text-slate-700 font-medium leading-relaxed">
                    <strong>{t({ en: 'Utilizes media platforms', vi: 'Sử dụng các nền tảng truyền thông' })}</strong> {t({ 
                      en: 'to expand the message of the powerful Gospel.', 
                      vi: 'để mở rộng thông điệp của Tin Lành đầy quyền năng.' 
                    })}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-church-red text-white rounded-2xl font-bold text-lg shadow-xl shadow-church-red/20 hover:bg-church-red/90 transition-all"
              >
                {t({ en: 'Join the Ministry', vi: 'Tham Gia Mục Vụ' })}
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="/images/heaven-band.jpeg" 
                  alt="Heaven Band" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="glass p-8 rounded-3xl border border-white/20">
                    <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2">
                      {t({ en: 'Established', vi: 'Thành Lập' })}
                    </p>
                    <p className="text-white text-4xl font-serif font-bold italic">Since 2022</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full shadow-2xl flex items-center justify-center p-4 border border-slate-100 hidden md:flex"
              >
                <div className="text-center">
                  <p className="text-church-red font-serif font-bold text-3xl leading-none">100%</p>
                  <p className="text-[10px] uppercase font-bold tracking-tighter text-slate-500 mt-1">
                    {t({ en: 'Spirit Led', vi: 'Thánh Linh Dẫn Dắt' })}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-24 bg-slate-900 text-white rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-church-red text-xs font-bold uppercase tracking-[0.2em] mb-6 block">
                {t({ en: 'Worship & Media Outreach', vi: 'Thờ Phượng & Truyền Thông' })}
              </span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                {t({ en: 'Guiding Beliefs & Purpose', vi: 'Niềm Tin & Mục Đích Dẫn Dắt' })}
              </h2>
            </div>
            <p className="text-slate-400 text-xl max-w-md leading-relaxed">
              {t({ 
                en: 'Empower your future with exciting challenges and a supportive environment. Join us!', 
                vi: 'Trao quyền cho tương lai của bạn với những thử thách thú vị và một môi trường hỗ trợ. Hãy tham gia cùng chúng tôi!' 
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-church-red/20 flex items-center justify-center text-church-red mb-8 group-hover:scale-110 transition-transform">
                  {i === 0 ? <Mic2 size={32} /> : i === 1 ? <Radio size={32} /> : <Play size={32} />}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">{t(feature)}</h3>
                <div className="flex items-center gap-2 text-church-red font-bold text-sm">
                  <CheckCircle2 size={16} />
                  {t({ en: 'Active Ministry', vi: 'Mục Vụ Đang Hoạt Động' })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-church-red/10 text-church-red text-xs font-bold uppercase tracking-widest mb-4">
              {t({ en: 'Our Journey', vi: 'Hành Trình Của Chúng Tôi' })}
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900">
              {t({ en: 'Ministry Gallery', vi: 'Thư Viện Mục Vụ' })}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-xl group"
              >
                <img 
                  src={img} 
                  alt={`Gallery ${i + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
