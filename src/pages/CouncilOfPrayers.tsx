import React from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Globe, Video, Calendar, Clock, Quote, ArrowRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TimeRange } from '../components/TimeRange';
import { SEO } from '../components/SEO';

export const CouncilOfPrayers: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <SEO 
        title={{ en: 'Council Of Prayers', vi: 'Hội Đồng Cầu Nguyện' }} 
        description={{ en: 'Organizing periods of fasting and prayer, night watches for spiritual warfare, and prayer walks as led by the Holy Spirit.', vi: 'Tổ chức các giai đoạn kiêng ăn và cầu nguyện, canh đêm cho chiến trận tâm linh và đi bộ cầu nguyện dưới sự dẫn dắt của Thánh Linh.' }}
        url="https://tggpc.org/ministries/council-of-prayers"
      />
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
                <Shield size={14} />
                {t({ en: 'Spiritual Warfare', vi: 'Chiến Trận  Linh' })}
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                 {t({ en: 'United Prayer Spiritual ', vi: 'Hội Đồng Hiệp Nguyện ' })} <br/>
                <span className="text-church-red italic">{t({ en: 'Warfare Global Conference', vi: 'Chiến Trận Thuộc Linh Toàn Cầu' })}</span>
              </h1>
              
              <div className="mb-10">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Globe className="text-church-red" size={28} />
                  {t({ en: 'Our Vision', vi: 'Tầm Nhìn Của Chúng Tôi' })}
                </h3>
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed">
                  <p>
                    {t({ 
                      en: 'Through the inspired guidance of the Holy Spirit, we are committing ourselves to transformative periods of fasting and prayer, participating in night watches focused on spiritual warfare, and undertaking prayer patrol as led by His presence.', 
                      vi: 'Thông qua sự soi dẫn của Đức Thánh Linh, chúng tôi cam kết thực hiện các giai đoạn kiêng ăn và cầu nguyện mang tính biến đổi, tham gia vào các buổi canh đêm tập trung vào chiến trận thuộc linh và thực hiện các cuộc tuần hành cầu nguyện theo sự dẫn dắt của Ngài.' 
                    })}
                  </p>
                  <p>
                    {t({ 
                      en: 'Additionally, as we are empowered by the Spirit, we are forging connections among pastors, elders, and believers from various regions to fervently intercede for our cities, nations, international communities, and urgent needs, creating a powerful network of prayer and support.', 
                      vi: 'Ngoài ra, khi được Đức Thánh Linh ban quyền năng, chúng tôi đang tạo dựng mối kết nối giữa các mục sư, trưởng lão và tín hữu từ nhiều vùng khác nhau để khẩn thiết cầu thay cho các thành phố, quốc gia, cộng đồng quốc tế và các nhu cầu cấp bách, tạo nên một mạng lưới cầu nguyện và hỗ trợ mạnh mẽ.' 
                    })}
                  </p>
                </div>
              </div>

              <motion.a
                href="#conference"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-church-red transition-all"
              >
                {t({ en: 'Join the Battle', vi: 'Tham Gia Chiến Trận' })}
                <ArrowRight size={20} />
              </motion.a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white bg-white p-12 flex items-center justify-center">
                <img 
                  src="/images/logo-hoi-dong.png" 
                  alt="Council of Prayers Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-church-red/5 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.a 
            href="https://www.facebook.com/UnitedPrayerSpiritualWarfareGlobalConference"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="block relative aspect-[21/9] md:aspect-[3/1] rounded-[3rem] overflow-hidden shadow-2xl group"
          >
            <img 
              src="https://i0.wp.com/thepowergospel.com/wp-content/uploads/2025/11/header-3-scaled.jpg?fit=1024%2C400&ssl=1" 
              alt="Global Conference Banner" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full flex items-center gap-2 text-slate-900 font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={18} />
                {t({ en: 'Visit our Facebook', vi: 'Ghé thăm Facebook của chúng tôi' })}
              </div>
            </div>
          </motion.a>
        </div>
      </section>

      {/* Online Meeting Section */}
      <section id="conference" className="px-6 py-32 bg-red-50 text-slate-900 rounded-[4rem] mx-4 mt-20 border border-red-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 text-church-red font-bold uppercase tracking-widest text-xs mb-6">
                <Video size={16} />
                {t({ en: 'Global Intercession', vi: 'Cầu Thay Toàn Cầu' })}
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8">
                {t({ en: 'Online Meeting', vi: 'Nhóm Trực Tuyến' })}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-10">
                {t({ 
                  en: 'Join our global prayer network as we intercede for cities, nations, and international communities. Be part of a powerful movement of spiritual warfare and support.', 
                  vi: 'Tham gia mạng lưới cầu nguyện toàn cầu của chúng tôi khi chúng tôi cầu thay cho các thành phố, quốc gia và cộng đồng quốc tế. Hãy là một phần của phong trào chiến trận tâm linh và hỗ trợ mạnh mẽ.' 
                })}
              </p>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="bg-white p-10 md:p-12 rounded-[3rem] text-slate-900 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-church-red/5 rounded-bl-[4rem]" />
                
                <h3 className="text-3xl font-serif font-bold mb-8 text-church-red">
                  {t({ en: 'Conference', vi: 'Hội Nghị' })}
                </h3>
                
                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        {t({ en: 'Schedule', vi: 'Lịch Trình' })}
                      </p>
                      <div className="space-y-1">
                        <p className="text-lg font-bold">
                          <span className="text-church-red">From:</span> April 3, 6:00 PM (California)
                        </p>
                        <p className="text-lg font-bold">
                          <span className="text-church-red">To:</span> April 4, 6:00 PM (California)
                        </p>
                        <TimeRange ptStart="18:00" ptEnd="18:00" className="mt-2" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Video size={24} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        Zoom ID
                      </p>
                      <p className="text-3xl font-bold text-slate-900 tracking-tight">484 700 7000</p>
                    </div>
                  </div>
                </div>

                <a 
                  href="https://us02web.zoom.us/j/4847007000?pwd=aEQ3QWNCRUtsVldkaWxSRWtGZmMxdz09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-church-red text-white rounded-2xl font-bold text-center hover:bg-slate-900 transition-all shadow-xl shadow-church-red/20 flex items-center justify-center gap-3"
                >
                  <Video size={20} />
                  {t({ en: 'Join via Zoom', vi: 'Tham Gia Qua Zoom' })}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-32 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-church-red/10 rounded-3xl flex items-center justify-center text-church-red mx-auto mb-10">
            <Shield size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">
            {t({ en: 'Join the Global Prayer Network', vi: 'Tham Gia Mạng Lưới Cầu Nguyện Toàn Cầu' })}
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-12">
            {t({ 
              en: 'Connect with pastors, elders, and believers worldwide to fervently intercede for our world.', 
              vi: 'Kết nối với các mục sư, trưởng lão và tín hữu trên toàn thế giới để khẩn thiết cầu thay cho thế giới của chúng ta.' 
            })}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <Users className="text-church-red" size={24} />
              <div className="text-left">
                <p className="text-slate-900 font-bold leading-none">Global</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Network</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <Shield className="text-church-red" size={24} />
              <div className="text-left">
                <p className="text-slate-900 font-bold leading-none">24/7</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Intercession</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
