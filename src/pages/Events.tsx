import React from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Events: React.FC = () => {
  const { t } = useLanguage();

  const events = [
    {
      title: { 
        en: 'Global Gospel Power Church: Praise, Worship, and Bible Study', 
        vi: 'Toàn thể Giáo Hội Tin Lành Quyền Phép Toàn Cầu ngợi khen, thờ phượng, học Lời Chúa' 
      },
      startDate: '2026-03-08T07:00:00-05:00', // CDT (DST starts Mar 8)
      endDate: '2026-03-08T11:00:00-05:00',
      location: 'Zoom Online',
      zoomId: '484 700 7000',
      zoomPass: '7777',
      desc: { 
        en: 'The gathering begins with an opening prayer, followed by hymns of praise and worship led by various ministries. The Pastor will preach the Word of God, followed by a time of prayer in response to the message. This is followed by Holy Communion, then more praise and worship. At the end, the congregation enters a time of fellowship, testifying to God\'s blessings, and intercessory prayer; a closing prayer, followed by the Lord\'s Prayer, and the Pastor\'s benediction for the entire church.', 
        vi: 'Chương trình nhóm lại sẽ bắt đầu bằng cầu nguyện khai lễ, tiếp theo là thánh ca ngợi khen – thờ phượng Chúa qua các ban/chức vụ phục vụ. Mục sư rao giảng sứ điệp Lời Chúa, và Hội Thánh sẽ có thì giờ cầu nguyện đáp ứng sứ điệp. Sau đó là Tiệc Thánh, rồi tiếp tục thánh ca ngợi khen – thờ phượng. Cuối chương trình, Hội Thánh bước vào thì giờ thông công, làm chứng về ơn phước Chúa, cầu nguyện cầu thay; một người sẽ cầu nguyện kết thúc, tiếp đến cầu nguyện chung, và Mục sư cầu nguyện chúc phước cho toàn thể Hội Thánh.' 
      }
    },
    {
      title: { 
        en: 'Prayer Program for America & The World: Revival in the Storm of God\'s Glory', 
        vi: 'Chương Trình Cầu Nguyện Cho Nước Mỹ & Thế Giới: Phục Hưng Trong Bão Lửa Vinh Hiển Chúa' 
      },
      startDate: '2026-03-04T05:00:00-06:00', // CST
      endDate: '2026-04-13T17:00:00-05:00', // CDT
      location: 'Global / Washington, D.C.',
      zoomId: '483 700 7000',
      zoomPass: '7777',
      contact: {
        phone: '(832) 231 2501',
        email: 'xuanlam.my@hotmail.com',
        facebook: 'Swanie Lam'
      },
      desc: { 
        en: 'Global Spiritual Warfare Prayer Council. Jesus Christ said: "I have come to bring fire on the earth, and how I wish it were already kindled!" (Luke 12:49). Join us in humbling ourselves, fasting, and uniting in the name of JESUS CHRIST, praying for a 24/7 storm of glory to transform and sanctify Christians and redeem humanity. This 40-day journey includes spiritual warfare missions to Egypt, Israel, Turkey, Greece, Italy, France, Germany, Switzerland, and a special gathering in Washington, D.C. from April 6-13, 2026. On May 17, 2026, we will join the "Rededicate 250: National Jubilee of Prayer, Praise, and Thanksgiving" at the National Mall.', 
        vi: 'Hội Đồng Hiệp Nguyện Chiến Trận Thuộc Linh Toàn Cầu. Đức Chúa Giê-xu Christ phán: "Ta đã đến quăng lửa xuống đất; nếu cháy lên rồi, ta còn ước-ao chi nữa!" (Lu-ca 12:49). Hãy hạ mình xuống, kiêng ăn kiêng uống, hiệp một trong danh ĐỨC CHÚA GIÊ-XU CHRIST, cầu nguyện để Ngài giáng bão lửa vinh hiển 24/7 tiêu diệt tội lỗi và thánh hoá Cơ Đốc Nhân. Hành trình 40 ngày bao gồm các chuyến đi chiến trận thuộc linh đến Ai Cập, Do Thái, Thổ Nhĩ Kỳ, Hy Lạp, Ý, Pháp, Đức, Thụy Sĩ và kỳ hiệp nguyện tại Washington, D.C. từ ngày 6-13 tháng 4, 2026. Ngày 17 tháng 5, 2026, chúng ta sẽ tham gia chương trình "Rededicate 250" tại National Mall.' 
      }
    }
  ];

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimezoneName = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-church-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-church-red text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
          >
            {t({ en: 'JOIN OUR GLOBAL COMMUNITY', vi: 'THAM GIA CỘNG ĐỒNG TOÀN CẦU CỦA CHÚNG TÔI' })}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 text-slate-900"
          >
            {t({ en: 'Upcoming Events', vi: 'Sự Kiện Sắp Tới' })}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            {t({ 
              en: 'Stay connected with our global community through these upcoming gatherings and conferences.', 
              vi: 'Luôn kết nối với cộng đồng toàn cầu của chúng tôi thông qua các buổi họp mặt và hội nghị sắp tới này.' 
            })}
          </motion.p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Clock size={14} />
            {t({ en: 'Times adjusted to your timezone:', vi: 'Thời gian đã điều chỉnh theo múi giờ của bạn:' })} {getTimezoneName()}
          </div>
        </div>

        <div className="space-y-12">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Date Sidebar */}
                <div className="lg:w-64 bg-slate-900 p-8 flex flex-col items-center justify-center text-white shrink-0">
                  <CalendarIcon size={40} className="mb-4 text-church-red" />
                  <div className="text-center">
                    <div className="text-3xl font-serif font-bold mb-1">
                      {formatDate(event.startDate)}
                    </div>
                    {event.startDate !== event.endDate && !event.endDate.startsWith(event.startDate.split('T')[0]) && (
                      <>
                        <div className="text-church-red font-bold text-xs uppercase tracking-widest my-2">to</div>
                        <div className="text-3xl font-serif font-bold">
                          {formatDate(event.endDate)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow p-8 md:p-12">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 group-hover:text-church-red transition-colors leading-tight">
                        {t(event.title)}
                      </h3>
                      <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-church-red" />
                          {formatTime(event.startDate)} - {formatTime(event.endDate)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={18} className="text-church-red" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <a 
                        href={`https://zoom.us/j/${event.zoomId.replace(/\s/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-church-red text-white rounded-2xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-lg hover:-translate-y-1"
                      >
                        {t({ en: 'Join Zoom', vi: 'Tham Gia Zoom' })}
                        <ExternalLink size={18} />
                      </a>
                      <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        ID: {event.zoomId} | Pass: {event.zoomPass}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-10">
                    <div className="md:col-span-2">
                      <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                        {t(event.desc)}
                      </p>
                    </div>
                    
                    {event.contact && (
                      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                          {t({ en: 'Contact Info', vi: 'Thông Tin Liên Hệ' })}
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-slate-700">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <span className="text-church-red text-xs">📞</span>
                            </div>
                            <span className="font-medium">{event.contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-700">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <span className="text-church-red text-xs">✉️</span>
                            </div>
                            <span className="font-medium text-sm break-all">{event.contact.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-700">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <span className="text-church-red text-xs">👤</span>
                            </div>
                            <span className="font-medium">{event.contact.facebook}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
