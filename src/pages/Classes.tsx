import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Book, Video, Clock, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TimeRange } from '../components/TimeRange';
import { SEO } from '../components/SEO';

export const Classes: React.FC = () => {
  const { t } = useLanguage();

  const classes = [
    {
      day: { en: 'Mon', vi: 'Thứ 2' },
      title: { en: 'Heaven Academy', vi: 'Học Viện Thiên Đàng' },
      desc: { en: 'Bilingual Bible study (EN–VN)', vi: 'Học Kinh Thánh song ngữ (Anh-Việt)' },
      time: '5AM-7AM CALIFORNIA',
      ptStart: '05:00',
      ptEnd: '07:00',
      link: '/ministries/heaven-academy'
    },
    {
      day: { en: 'MON, WED, SAT', vi: 'Thứ 2, 4, 7' },
      title: { en: 'Women of Global Gospel Power', vi: 'Phụ Nữ Tin Lành Quyền Phép Toàn Cầu' },
      desc: { en: 'Worship, intercession & Bible study.', vi: 'Thờ phượng, cầu thay & học Kinh Thánh.' },
      time: '5AM-7AM CALIFORNIA',
      ptStart: '05:00',
      ptEnd: '07:00',
      link: 'https://us02web.zoom.us/j/4837007000',
      isZoom: true,
      zoomDetails: 'Passcode: 7777'
    },
    {
      day: { en: 'Tue, Thur, Fri', vi: 'Thứ 3, 5, 6' },
      title: { en: 'Global Gospel Power Bible School', vi: 'Trường Kinh Thánh Tin Lành Quyền Phép Toàn Cầu' },
      desc: { en: 'Practical ministry & theological training.', vi: 'Đào tạo thần học & thực hành mục vụ.' },
      time: '5AM-8AM CALIFORNIA',
      ptStart: '05:00',
      ptEnd: '08:00',
      link: '/ministries/bible-school'
    },
    {
      day: { en: 'Weekdays', vi: 'Ngày Trong Tuần' },
      title: { en: 'Global Gospel Power Bible School', vi: 'Trường Kinh Thánh Tin Lành Quyền Phép Toàn Cầu' },
      desc: { en: 'Practical ministry & theological training.', vi: 'Đào tạo thần học & thực hành mục vụ.' },
      time: '2:30PM-3:30PM CALIFORNIA',
      ptStart: '14:30',
      ptEnd: '15:30',
      link: '/ministries/bible-school'
    },
    {
      day: { en: 'Friday', vi: 'Thứ 6' },
      title: { en: 'Heaven Academy (Youth)', vi: 'Học Viện Thiên Đàng (Giới Trẻ)' },
      desc: { en: 'Bible English for youth (ages 6–17)', vi: 'Kinh Thánh tiếng Anh cho giới trẻ (6–17 tuổi)' },
      time: '4AM - 5:30AM CALIFORNIA',
      ptStart: '04:00',
      ptEnd: '05:30',
      link: '/ministries/heaven-academy'
    },
    {
      day: { en: 'Friday', vi: 'Thứ 6' },
      title: { en: 'Men\'s Global Power Gospel Council', vi: 'Hội Đồng Tin Lành Quyền Phép Nam Giới Toàn Cầu' },
      desc: { en: 'Bilingual Bible Study For Men (EN–VN)', vi: 'Học Kinh Thánh song ngữ cho nam giới (Anh-Việt)' },
      time: '6PM - 9PM CALIFORNIA',
      ptStart: '18:00',
      ptEnd: '21:00',
      link: '/ministries/mens-ministry'
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 bg-church-cream min-h-screen">
      <SEO 
        title={{ en: 'Our Classes', vi: 'Các Lớp Học Của Chúng Tôi' }} 
        description={{ en: 'Join our online classes to deepen your understanding of the Word and equip you for ministry.', vi: 'Tham gia các lớp học trực tuyến của chúng tôi để làm sâu sắc thêm sự hiểu biết của bạn về Lời Chúa và trang bị cho mục vụ của bạn.' }}
        url="https://tggpc.org/classes"
      />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-church-red text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
          >
            {t({ en: 'SPIRITUAL GROWTH & EDUCATION', vi: 'PHÁT TRIỂN THUỘC LINH & GIÁO DỤC' })}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 text-slate-900"
          >
            {t({ en: 'Our Classes', vi: 'Các Lớp Học Của Chúng Tôi' })}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            {t({ 
              en: 'Join our online classes to deepen your understanding of the Word and equip you for ministry.', 
              vi: 'Tham gia các lớp học trực tuyến của chúng tôi để làm sâu sắc thêm sự hiểu biết của bạn về Lời Chúa và trang bị cho mục vụ của bạn.' 
            })}
          </motion.p>
        </div>

        <div className="space-y-6">
          {classes.map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex flex-col items-center justify-center min-w-[140px] border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-8">
                <span className="text-[20px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                  {t({ en: 'EVERY', vi: 'MỖI' })}
                </span>
                <span className="text-xl font-bold text-church-red uppercase text-center leading-tight">
                  {t(cls.day)}
                </span>
              </div>

              <div className="flex-grow text-center md:text-left">
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 group-hover:text-church-red transition-colors">
                  {t(cls.title)}
                </h3>
                <p className="text-slate-500 font-medium">
                  {t(cls.desc)}
                </p>
              </div>

              <div className="flex flex-col items-center md:items-end gap-4 min-w-[300px]">
                <div className="flex flex-col items-center md:items-end gap-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Clock size={14} className="text-church-red" />
                    {cls.time}
                  </div>
                  {(cls as any).ptStart && (cls as any).ptEnd && (
                    <TimeRange 
                      ptStart={(cls as any).ptStart} 
                      ptEnd={(cls as any).ptEnd} 
                      className="text-right"
                    />
                  )}
                </div>
                {cls.link.startsWith('/') ? (
                  <Link 
                    to={cls.link}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-church-red transition-all shadow-lg hover:-translate-y-1"
                  >
                    {t({ en: 'View More', vi: 'Xem Thêm' })}
                  </Link>
                ) : (
                  <div className="flex flex-col items-center md:items-end gap-2">
                    <a 
                      href={cls.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-church-red transition-all shadow-lg hover:-translate-y-1"
                    >
                      {(cls as any).isZoom ? t({ en: 'Join Zoom', vi: 'Tham Gia Zoom' }) : t({ en: 'View More', vi: 'Xem Thêm' })}
                    </a>
                    {(cls as any).zoomDetails && (
                      <span className="text-[10px] text-slate-400 font-medium text-center md:text-right">
                        {cls.link} ({(cls as any).zoomDetails})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
