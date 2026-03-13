import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Languages, Calendar, Video, CheckCircle2, ArrowRight, Clock, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TimeRange } from '../components/TimeRange';
import { SEO } from '../components/SEO';

export const HeavenAcademy: React.FC = () => {
  const { t } = useLanguage();

  const classes = [
    {
      title: { en: 'Bilingual Bible Study', vi: 'Học Kinh Thánh Song Ngữ' },
      subtitle: { en: '(English–Vietnamese)', vi: '(Anh–Việt)' },
      schedule: { en: 'Every Monday and Wednesday', vi: 'Thứ Hai và Thứ Tư hàng tuần' },
      time: { en: '6:00 AM to 8:00 AM (California time)', vi: '6:00 AM đến 8:00 AM (Giờ California)' },
      ptStart: '06:00',
      ptEnd: '08:00',
      zoom: '484 700 7000',
      link: 'https://us02web.zoom.us/j/4847007000?pwd=aEQ3QWNCRUtsVldkaWxSRWtGZmMxdz09'
    },
    {
      title: { en: 'Bible English Program', vi: 'Chương Trình Tiếng Anh Kinh Thánh' },
      subtitle: { en: 'For Youth (ages 6–17)', vi: 'Cho Thanh Thiếu Niên (6–17 tuổi)' },
      schedule: { en: 'Every Friday', vi: 'Thứ Sáu hàng tuần' },
      time: { en: '4:00 PM to 7:30 PM (California time)', vi: '5:00 PM đến 6:30 PM (Giờ California)' },
      ptStart: '17:00',
      ptEnd: '18:30',
      zoom: '487 700 7000',
      link: 'https://us02web.zoom.us/j/4877007000'
    }
  ];

  const highlights = [
    { en: 'LED BY THE HOLY SPIRIT', vi: 'DƯỚI SỰ DẪN DẮT CỦA THÁNH LINH' },
    { en: 'GROWING IN FAITH AND LANGUAGE', vi: 'PHÁT TRIỂN ĐỨC TIN & NGÔN NGỮ' },
    { en: 'EQUIPPED THROUGH THE WORD', vi: 'TRANG BỊ QUA LỜI CHÚA' }
  ];

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <SEO 
        title={{ en: 'Heaven Academy', vi: 'Học Viện Thiên Đàng' }} 
        description={{ en: 'Teaching in bilingual English-Vietnamese Bible classes for Vietnamese youth under the guidance of the Holy Spirit.', vi: 'Giảng dạy các lớp Kinh Thánh song ngữ Anh-Việt cho thanh thiếu niên Việt Nam dưới sự dẫn dắt của Đức Thánh Linh.' }}
        url="https://tggpc.org/ministries/heaven-academy"
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
                <GraduationCap size={14} />
                {t({ en: 'Education Ministry', vi: 'Mục Vụ Giáo Dục' })}
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                {t({ en: 'Heaven', vi: 'Học Viện' })} <span className="text-church-red italic">{t({ en: 'Academy', vi: 'Thiên Đàng' })}</span>
              </h1>
              <p className="text-2xl text-slate-600 leading-relaxed mb-10 font-medium">
                {t({ 
                  en: 'By the sovereign guidance of the Holy Spirit, teaching in bilingual English-Vietnamese Bible classes for Vietnamese youth.', 
                  vi: 'Dưới sự dẫn dắt tối cao của Đức Thánh Linh, giảng dạy các lớp Kinh Thánh song ngữ Anh-Việt cho thanh thiếu niên Việt Nam và Quốc Tế.' 
                })}
              </p>
              
              <div className="space-y-4 mb-12">
                {highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-church-red font-bold tracking-wider text-sm">
                    <CheckCircle2 size={18} />
                    {t(item)}
                  </div>
                ))}
              </div>

              <p className="text-slate-500 text-lg leading-relaxed mb-12 border-l-4 border-church-red/20 pl-6 italic">
                {t({ 
                  en: 'Helping them become familiar with the Vietnamese language through the Word of God.', 
                  vi: 'Giúp các em làm quen với tiếng Anh thông qua Lời Chúa.' 
                })}
              </p>

              <motion.a
                href="#classes"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-church-red transition-all"
              >
                {t({ en: 'View Online Classes', vi: 'Xem Các Lớp Trực Tuyến' })}
                <ArrowRight size={20} />
              </motion.a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white bg-church-cream p-12 flex items-center justify-center">
                <img 
                  src="/images/heaven-academy.png" 
                  alt="Heaven Academy" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-church-red/5 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-church-gold/5 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Online Classes Section */}
      <section id="classes" className="px-6 py-32 bg-church-cream rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-church-red font-bold uppercase tracking-widest text-xs mb-4">
              <Video size={16} />
              {t({ en: 'Live via Zoom', vi: 'Trực Tiếp Qua Zoom' })}
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900">
              {t({ en: 'Online Classes', vi: 'Lớp Học Trực Tuyến' })}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {classes.map((cls, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col"
              >
                <div className="mb-8">
                  <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                    {t(cls.title)}
                  </h3>
                  <p className="text-church-red font-bold uppercase tracking-widest text-xs">
                    {t(cls.subtitle)}
                  </p>
                </div>

                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                        {t({ en: 'Schedule', vi: 'Lịch Học' })}
                      </p>
                      <p className="text-slate-700 font-medium">{t(cls.schedule)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                        {t({ en: 'Time', vi: 'Thời Gian ' })}
                      </p>
                      <p className="text-slate-700 font-medium">{t(cls.time)}</p>
                      {(cls as any).ptStart && (cls as any).ptEnd && (
                        <TimeRange 
                          ptStart={(cls as any).ptStart} 
                          ptEnd={(cls as any).ptEnd} 
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Video size={20} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                        Zoom ID
                      </p>
                      <p className="text-slate-900 font-bold text-xl">{cls.zoom}</p>
                    </div>
                  </div>
                </div>

                <a 
                  href={cls.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full py-5 bg-church-red text-white rounded-2xl font-bold text-center hover:bg-red-800 transition-all shadow-lg shadow-church-red/20 flex items-center justify-center gap-3"
                >
                  <Play size={18} fill="currentColor" />
                  {t({ en: 'Join Class Now', vi: 'Tham Gia Lớp Ngay' })}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-church-red/10 rounded-3xl flex items-center justify-center text-church-red mx-auto mb-10">
            <BookOpen size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">
            {t({ en: 'Our Vision for the Youth', vi: 'Tầm Nhìn Của Chúng Tôi Cho Giới Trẻ' })}
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            {t({ 
              en: 'We believe that equipping the next generation with both spiritual wisdom and practical language skills is essential for their growth as global citizens of the Kingdom of God.', 
              vi: 'Chúng tôi tin rằng việc trang bị cho thế hệ mai sau cả sự khôn ngoan tâm linh và kỹ năng ngôn ngữ thực tế là điều cần thiết cho sự phát triển của các em với tư cách là những công dân toàn cầu của Vương quốc Đức Chúa Trời.' 
            })}
          </p>
        </div>
      </section>
    </div>
  );
};
