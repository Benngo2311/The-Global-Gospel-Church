import React from 'react';
import { motion } from 'motion/react';
import { Book, GraduationCap, CheckCircle2, ArrowRight, Video, Calendar, Clock, ShieldCheck, Globe, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TimeRange } from '../components/TimeRange';
import { SEO } from '../components/SEO';
import { PageNavigation } from '../components/PageNavigation';

export const GlobalGospelPowerBibleSchool: React.FC = () => {
  const { t } = useLanguage();

  const subjects = [
    { en: 'Old Testament', vi: 'Cựu Ước' },
    { en: 'New Testament', vi: 'Tân Ước' },
    { en: 'Fundamental & Advanced Theology', vi: 'Thần Học Cơ Bản & Nâng Cao' },
    { en: 'Spiritual Warfare', vi: 'Chiến Trận Thuộc Linh' },
    { en: 'Evangelism', vi: 'Truyền Giáo' },
    { en: 'Church Planting & Development', vi: 'Gây Dựng & Phát Triển Hội Thánh' }
  ];

  const classes = [
    {
      title: { en: 'Theology & Practical Ministry Training', vi: 'Đào Tạo Thần Học & Mục Vụ Thực Tiễn' },
      schedule: { en: 'Every Tuesday, Thursday, and Friday', vi: 'Thứ Ba, Thứ Năm và Thứ Sáu hàng tuần' },
      time: { en: '5:00 AM to 8:00 AM (California time)', vi: '5:00 AM đến 8:00 AM (Giờ California)' },
      ptStart: '05:00',
      ptEnd: '08:00',
      zoom: '483 700 7000',
      password: '7777',
      link: 'https://us02web.zoom.us/j/4837007000'
    },
    {
      title: { en: 'Theology & Practical Ministry Training', vi: 'Đào Tạo Thần Học & Mục Vụ Thực Tiễn' },
      schedule: { en: 'Monday to Friday', vi: 'Thứ Hai đến Thứ Sáu' },
      time: { en: '3:00 PM to 4:00 PM (California time)', vi: '3:00 PM đến 4:00 PM (Giờ California)' },
      ptStart: '15:00',
      ptEnd: '16:00',
      zoom: '483 700 7000',
      password: '7777',
      link: 'https://us02web.zoom.us/j/4837007000'
    }
  ];

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <SEO 
        title={{ en: 'Bible School', vi: 'Trường Kinh Thánh' }} 
        description={{ en: 'Equipping believers with Basic and Advanced Biblical Studies for those called by God to become His servants.', vi: 'Trang bị cho các tín hữu các nghiên cứu Kinh Thánh cơ bản và nâng cao cho những người được Chúa gọi để trở thành tôi tớ của Ngài.' }}
        url="https://tggpc.org/ministries/bible-school"
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
                <Book size={14} />
                {t({ en: 'Bible School', vi: 'Trường Kinh Thánh' })}
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                {t({ en: 'The Global Gospel', vi: 'Trường Kinh Thánh Tin Lành' })} <br/>
                <span className="text-church-red italic">{t({ en: 'Power Bible School', vi: 'Quyền Phép Toàn Cầu' })}</span>
              </h1>
              
              <div className="mb-10">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4">
                  {t({ en: 'Our Mission', vi: 'Sứ Mệnh Của Chúng Tôi' })}
                </h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  {t({ 
                    en: 'Teaching, training, and equipping believers in both basic and advanced Biblical studies for Christians whom God has called to become His servants by the guidance of the Holy Spirit.', 
                    vi: 'Giảng dạy, đào tạo và trang bị cho các tín hữu, các nghiên cứu Kinh Thánh cơ bản và nâng cao cho những Cơ Đốc nhân được Chúa gọi để trở thành tôi tớ Ngài dưới sự dẫn dắt của Thánh Linh.' 
                  })}
                </p>
              </div>

              <div className="bg-church-cream p-8 rounded-[2.5rem] border border-church-red/10 mb-12">
                <h4 className="text-lg font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-church-red" size={20} />
                  {t({ en: 'Subjects include:', vi: 'Các môn học bao gồm:' })}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjects.map((subject, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                      <CheckCircle2 size={14} className="text-church-red" />
                      {t(subject)}
                    </div>
                  ))}
                </div>
              </div>

              <motion.a
                href="#classes"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-church-red text-white rounded-2xl font-bold text-lg shadow-xl shadow-church-red/20 hover:bg-church-red/90 transition-all"
              >
                {t({ en: 'Enroll in Classes', vi: 'Ghi Danh Vào Lớp' })}
                <ArrowRight size={20} />
              </motion.a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white bg-white p-8 flex items-center justify-center">
                <img 
                  src="/images/nay-scaled.png" 
                  alt="Bible School Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating Stats */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 glass p-6 rounded-3xl border border-white/20 shadow-2xl hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-church-red flex items-center justify-center text-white">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-xl leading-none">Global</p>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Training Center</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Online Classes Section */}
      <section id="classes" className="px-6 py-32 bg-slate-100 text-slate-900 rounded-[4rem] mx-4 border border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-church-red font-bold uppercase tracking-widest text-xs mb-4">
              <Video size={16} />
              {t({ en: 'Virtual Learning Environment', vi: 'Môi Trường Học Tập Trực Tuyến' })}
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold">
              {t({ en: 'Online Classes', vi: 'Lớp Học Trực Tuyến' })}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {classes.map((cls, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 p-12 rounded-[3rem] hover:shadow-xl transition-all group"
              >
                <div className="mb-10">
                  <h3 className="text-3xl font-serif font-bold mb-4 group-hover:text-church-red transition-colors">
                    {t(cls.title)}
                  </h3>
                  <div className="w-20 h-1 bg-church-red rounded-full" />
                </div>

                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-church-red/10 flex items-center justify-center text-church-red shrink-0">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        {t({ en: 'Days', vi: 'Ngày Học' })}
                      </p>
                      <p className="text-lg font-medium">{t(cls.schedule)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-church-red/10 flex items-center justify-center text-church-red shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        {t({ en: 'Time (PT)', vi: 'Thời Gian' })}
                      </p>
                      <p className="text-lg font-medium">{t(cls.time)}</p>
                      {(cls as any).ptStart && (cls as any).ptEnd && (
                        <TimeRange 
                          ptStart={(cls as any).ptStart} 
                          ptEnd={(cls as any).ptEnd} 
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Zoom ID</p>
                      <p className="text-xl font-bold text-church-red">{cls.zoom}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Password</p>
                      <p className="text-xl font-bold text-church-red">{cls.password}</p>
                    </div>
                  </div>
                </div>

                <a 
                  href={cls.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-church-red text-white rounded-2xl font-bold text-center hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-church-red/20 flex items-center justify-center gap-3"
                >
                  <Video size={20} />
                  {t({ en: 'Join via Zoom', vi: 'Tham Gia Qua Zoom' })}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-church-cream text-church-red text-xs font-bold uppercase tracking-widest mb-8">
            <Globe size={14} />
            {t({ en: 'Global Outreach', vi: 'Lan Tỏa Toàn Cầu' })}
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8 leading-tight">
            {t({ en: 'Equipping the Next Generation of Leaders', vi: 'Trang Bị Cho Thế Hệ Lãnh Đạo Tiếp Theo' })}
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            {t({ 
              en: 'Join a community of dedicated believers committed to deepening their understanding of the Word of God and fulfilling their divine calling.', 
              vi: 'Tham gia cộng đồng những tín hữu tận hiến, cam kết trau dồi thêm sự hiểu biết về Lời Chúa và hoàn thành sự kêu gọi của mình.' 
            })}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <Users className="text-church-red" size={24} />
              <div className="text-left">
                <p className="text-slate-900 font-bold leading-none">100+</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Students</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <Globe className="text-church-red" size={24} />
              <div className="text-left">
                <p className="text-slate-900 font-bold leading-none">Global</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PageNavigation 
        prev={{ title: { en: 'Heaven Band', vi: 'Ban Nhạc Thiên Đàng' }, path: '/ministries/heaven-band' }}
        next={{ title: { en: 'Heaven Academy', vi: 'Học Viện Thiên Đàng' }, path: '/ministries/heaven-academy' }}
      />
    </div>
  );
};
