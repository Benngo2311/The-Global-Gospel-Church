import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Users, Calendar, Heart, Globe, MessageSquare, Radio } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE_CONTENT } from '../constants/content';
import { Link } from 'react-router-dom';
import { DailyVerse } from '../components/DailyVerse';
import { LiveBroadcast } from '../components/LiveBroadcast';
import { SEO } from '../components/SEO';
import { PageNavigation } from '../components/PageNavigation';

export const Home: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="overflow-hidden">
      <SEO 
        title={{ en: 'Home', vi: 'Trang Chủ' }} 
        description={{ en: 'Welcome to The Global Gospel Power Church.', vi: 'Chào mừng bạn đến với Hội Thánh Tin Lành Quyền Phép Toàn Cầu.' }}
        url="https://tggpc.org/"
      />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/IMG_6495.webp"
            alt="Worship"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-church-cream/50 via-church-cream to-church-cream" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-church-red/10 text-church-red text-xs font-bold uppercase tracking-widest mb-6">
              {t({ en: 'Welcome to our Church', vi: 'Chào mừng bạn đến với Hội Thánh' })}
            </span>
            <h1 className={`text-6xl md:text-8xl font-serif font-bold text-slate-900 mb-8 tracking-tighter ${language === 'vi' ? 'leading-tight' : 'leading-[0.9]'}`}>
              {t(SITE_CONTENT.hero.title)}
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              {t(SITE_CONTENT.hero.subtitle)}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/ministries"
                className="px-8 py-4 bg-church-red text-white rounded-full font-bold hover:bg-red-800 transition-all shadow-xl hover:shadow-church-red/20 flex items-center gap-2 group"
              >
                {t({ en: 'Explore Ministries', vi: 'Khám Phá Mục Vụ' })}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/classes"
                className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center gap-2 group"
              >
                {t({ en: 'Learn About Our Classes', vi: 'Tìm Hiểu Về Lớp Học' })}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-church-red" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-church-gold/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-church-red/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-church-red/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-church-red text-white text-[10px] font-bold uppercase tracking-widest rounded-md">
                    {t({ en: 'Events', vi: 'Sự Kiện' })}
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    — {t({ en: 'For ALL', vi: 'Dành Cho TẤT CẢ' })}
                  </span>
                </div>
                
                <h3 className="text-3xl font-serif font-bold mb-4">
                  {t({ en: 'Upcoming Gatherings', vi: 'Các Buổi Nhóm Sắp Tới' })}
                </h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  {t({ 
                    en: 'Join us worldwide via Zoom for upcoming events to inspire, connect, and grow faith in the eternal love of Jesus Christ.', 
                    vi: 'Hãy tham gia cùng chúng tôi với toàn thế giới qua Zoom trong các sự kiện sắp tới để truyền cảm hứng, kết nối và phát triển đức tin trong tình yêu đời đời của Đức Chúa Jêsus Christ.' 
                  })}
                </p>

                <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-slate-100">
                  <img 
                    src="/images/5E0DCA19-8208-4D97-846F-ACCE88B80112-1024x768.jpg" 
                    alt="Event" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <Link
                  to="/events"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-church-red transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {t({ en: 'View More', vi: 'Tìm Hiểu Thêm' })}
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Stream Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                <Radio size={12} className="animate-pulse" />
                {t({ en: 'Live Broadcast', vi: 'Phát Trực Tiếp' })}
              </div>
              <h2 className="text-4xl font-serif font-bold text-slate-900">
                {t({ en: 'Join Our Online Meeting', vi: 'Tham Gia Buổi Nhóm Trực Tuyến' })}
              </h2>
            </div>
            <Link
              to="/live"
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-church-red transition-all flex items-center gap-2 shadow-lg"
            >
              {t({ en: 'Watch Now', vi: 'Xem Ngay' })}
              <Radio size={20} />
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <LiveBroadcast isLive={false} />
          </motion.div>
        </div>
      </section>

      {/* Unified Ministries Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              {t({ en: 'Our Ministries', vi: 'Các Mục Vụ Của Chúng Tôi' })}
            </h2>
            <p className="text-slate-500 uppercase tracking-widest font-bold text-xs">— {t({ en: 'All Share The Purpose Of Helping The Lord\'s Servants And Children Fulfill The Lord\'s Great Commission.', vi: 'Đều Có Mục Đích Giúp Đỡ Các Quý Tôi Tớ, Con Cái Chúa Hoàn Thành Đại Mạng Lệnh Của Chúa' })}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-church-cream p-8 md:p-16 rounded-[4rem] border-2 border-slate-100 overflow-hidden shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="mb-10">
                  <p className="text-church-red font-serif italic text-2xl md:text-3xl leading-relaxed mb-8">
                    {t({
                      en: '"Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit: teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age."',
                      vi: '"Vậy, hãy đi dạy dỗ muôn dân, hãy nhân danh Đức Cha, Đức Con, và Đức Thánh Linh mà làm phép báp-tem cho họ, và dạy họ giữ hết cả mọi điều mà Ta đã truyền cho các ngươi. Và nầy, Ta thường ở cùng các ngươi luôn cho đến tận thế."'
                    })}
                  </p>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400">— {t({ en: 'Matthew 28:19-20', vi: 'Ma-thi-ơ 28:19-20' })}</p>
                </div>
                
                <Link
                  to="/ministries"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-church-red text-white rounded-full font-bold hover:bg-red-800 transition-all shadow-xl hover:shadow-church-red/20 group"
                >
                  {t({ en: 'Explore Our Ministries', vi: 'Khám Phá Các Mục Vụ' })}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
                    <img 
                      src="/images/IMG_3825-1024x768.webp" 
                      alt="Ministry" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                    <img 
                      src="/images/24A0B688-5AA4-4DE8-AD92-336671EEE727-1024x768.webp" 
                      alt="Ministry" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                </div>
                <div className="pt-12">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
                    <img 
                      src="/images/Photo-30-3-25-09-32-50-1024x768.webp" 
                      alt="Commission" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <DailyVerse />

      {/* Photo Gallery / Slideshow Section */}
      <section className="py-32 px-6 bg-church-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">{t({ en: 'The Journey of Grace', vi: 'Chặng Đường Ân Điển' })}</h2>
            <div className="w-24 h-1 bg-church-gold mx-auto rounded-full mb-8" />
            <Link
              to="/journey-of-grace"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-church-red transition-all shadow-xl hover:shadow-church-red/20 group"
            >
              {t({ en: 'View Full Timeline & Gallery', vi: 'Xem Toàn Bộ Dòng Thời Gian & Thư Viện' })}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 aspect-video rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/images/IMG_6495.webp" alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="aspect-square rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/images/5E0DCA19-8208-4D97-846F-ACCE88B80112-1024x768.jpg" alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="aspect-square rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/images/IMG_3825-1024x768.webp" alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="md:col-span-2 aspect-video rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/images/24A0B688-5AA4-4DE8-AD92-336671EEE727-1024x768.webp" alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <img
              src="/images/IMG_6495.webp"
              alt="Background"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">
              {t({ en: 'Ready to start your journey?', vi: 'Sẵn sàng bắt đầu hành trình của bạn?' })}
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              {t({ 
                en: 'Join our global community today and experience the power of the Gospel.', 
                vi: 'Tham gia cộng đồng toàn cầu của chúng tôi ngay hôm nay và trải nghiệm quyền năng của Tin Lành.' 
              })}
            </p>
            <Link
              to="/contact"
              className="px-10 py-5 bg-church-red text-white rounded-full font-bold hover:bg-red-800 transition-all shadow-2xl hover:shadow-church-red/40 inline-block"
            >
              {t({ en: 'Get in Touch Today', vi: 'Liên Hệ Ngay Hôm Nay' })}
            </Link>
          </div>
        </div>
      </section>
      <PageNavigation next={{ title: { en: 'About Us', vi: 'Về Chúng Tôi' }, path: '/about' }} />
    </div>
  );
};
