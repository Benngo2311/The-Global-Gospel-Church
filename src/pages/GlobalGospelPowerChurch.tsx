import React from 'react';
import { motion } from 'motion/react';
import { Church, Users, Heart, Video, Calendar, Clock, Quote, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const GlobalGospelPowerChurch: React.FC = () => {
  const { t } = useLanguage();

  const activities = [
    { en: 'Worship Gatherings', vi: 'Nhóm Thờ Phượng' },
    { en: 'Bible Teaching', vi: 'Giảng Dạy Kinh Thánh' },
    { en: 'Water Baptism', vi: 'Báp-têm Bằng Nước' },
    { en: 'Communion', vi: 'Tiệc Thánh' },
    { en: 'Prayer & Intercession', vi: 'Cầu Nguyện & Thay Cho' },
    { en: 'Deliverance', vi: 'Giải Cứu' },
    { en: 'Healing Sessions', vi: 'Chữa Lành' },
    { en: 'Evangelism Initiatives', vi: 'Truyền Giáo' }
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
                <Church size={14} />
                {t({ en: 'Main Ministry', vi: 'Mục Vụ Chính' })}
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                The Global Gospel <br/>
                <span className="text-church-red italic">Power Church</span>
              </h1>
              
              <div className="mb-10">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4">
                  {t({ en: 'Our Objective', vi: 'Mục Tiêu Của Chúng Tôi' })}
                </h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  {t({ 
                    en: 'To build up faith and proclaim the powerful Gospel of the Lord Jesus Christ.', 
                    vi: 'Để gây dựng đức tin và công bố Tin Lành quyền năng của Chúa Cứu Thế Giê-xu.' 
                  })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12">
                {activities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <CheckCircle2 size={16} className="text-church-red shrink-0" />
                    {t(activity)}
                  </div>
                ))}
              </div>

              <motion.a
                href="#online-meeting"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-church-red transition-all"
              >
                {t({ en: 'Join Our Service', vi: 'Tham Gia Buổi Nhóm' })}
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
                  src="https://tggpc.org/wp-content/uploads/2025/10/Untitled_design-removebg-preview.webp" 
                  alt="TGGPC Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-church-red/5 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scriptural Basis */}
      <section className="px-6 py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-xl border border-slate-100 relative">
            <Quote className="absolute top-10 left-10 text-church-red/10 w-24 h-24 -z-0" />
            <div className="relative z-10">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">
                {t({ en: 'Scriptural Basis', vi: 'Cơ Sở Kinh Thánh' })} — Matthew 28:18–20
              </p>
              <p className="text-2xl md:text-3xl font-serif italic text-slate-800 leading-relaxed mb-8">
                "And Jesus came and spoke to them, saying, 'All authority has been given to Me in heaven and on earth. Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age.' Amen."
              </p>
              <div className="w-20 h-1 bg-church-red rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Activities Detail */}
      <section className="px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1585770536735-27993a080586?q=80&auto=format&fit=crop&ixlib=rb-4.1.0&w=800&h=800&crop=" 
                  alt="Church Activities" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8">
                {t({ en: 'Our Activities', vi: 'Các Hoạt Động Của Chúng Tôi' })}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-8 italic">
                {t({ 
                  en: 'Organize worship gatherings that foster a sense of community and spiritual growth, including Bible teaching sessions that help deepen understanding of scripture; water baptism as a public declaration of faith; Communion as a sacred ritual that commemorates Christ\'s sacrifice; regular prayer and intercession for both personal needs and collective concerns; deliverance from spiritual bondage; healing sessions where individuals can seek physical and emotional restoration; and evangelism initiatives that reach out to the community, sharing the love and message of Christ with all.', 
                  vi: 'Tổ chức các buổi nhóm thờ phượng nhằm thúc đẩy tinh thần cộng đồng và sự phát triển tâm linh, bao gồm các buổi dạy Kinh Thánh giúp hiểu sâu hơn về lời Chúa; báp-têm bằng nước như một sự tuyên xưng đức tin công khai; Tiệc Thánh như một nghi lễ thiêng liêng kỷ niệm sự hy sinh của Chúa Kitô; cầu nguyện và thay cho thường xuyên cho các nhu cầu cá nhân và tập thể; giải cứu khỏi sự trói buộc tâm linh; các buổi chữa lằnh nơi các cá nhân có thể tìm kiếm sự phục hồi về thể chất và cảm xúc; và các sáng kiến truyền giáo vươn tới cộng đồng, chia sẻ tình yêu và thông điệp của Chúa Kitô với tất cả mọi người.' 
                })}
              </p>
              <div className="flex items-center gap-4 p-6 bg-church-cream rounded-3xl border border-church-red/10">
                <Heart className="text-church-red shrink-0" size={32} />
                <div>
                  <p className="text-slate-900 font-bold">{t({ en: 'Community & Growth', vi: 'Cộng Đồng & Phát Triển' })}</p>
                  <p className="text-slate-500 text-sm">{t({ en: 'Fostering spiritual maturity together.', vi: 'Cùng nhau nuôi dưỡng sự trưởng thành tâm linh.' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Meeting Section */}
      <section id="online-meeting" className="px-6 py-32 bg-church-red text-white rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-xs mb-6">
                <Video size={16} />
                {t({ en: 'Global Worship', vi: 'Thờ Phượng Toàn Cầu' })}
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8">
                {t({ en: 'Online Meeting', vi: 'Nhóm Trực Tuyến' })}
              </h2>
              <p className="text-xl text-white/80 leading-relaxed mb-10">
                {t({ 
                  en: 'Join our weekly Worship & Praise Service from anywhere in the world. Experience powerful singing, praises, and the preaching of the Word of God.', 
                  vi: 'Tham gia buổi Thờ Phượng & Ca Ngợi hàng tuần của chúng tôi từ bất cứ đâu trên thế giới. Trải nghiệm sự ca hát quyền năng, ngợi khen và giảng dạy Lời Đức Chúa Trời.' 
                })}
              </p>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="bg-white p-10 md:p-12 rounded-[3rem] text-slate-900 shadow-2xl">
                <h3 className="text-3xl font-serif font-bold mb-8 text-church-red">
                  {t({ en: 'Worship & Praise Service', vi: 'Buổi Nhóm Thờ Phượng & Ca Ngợi' })}
                </h3>
                
                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        {t({ en: 'Next Service', vi: 'Buổi Nhóm Tiếp Theo' })}
                      </p>
                      <p className="text-lg font-bold">Sunday, November 23</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        {t({ en: 'Time', vi: 'Giờ Giấc' })}
                      </p>
                      <p className="text-lg font-bold">5:00 AM to 10:00 AM (California)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Video size={20} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        Zoom ID
                      </p>
                      <p className="text-2xl font-bold text-slate-900 tracking-tight">484 700 7000</p>
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

      {/* Footer CTA */}
      <section className="px-6 py-32 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-church-red/10 rounded-3xl flex items-center justify-center text-church-red mx-auto mb-10">
            <Users size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">
            {t({ en: 'Become Part of Our Family', vi: 'Trở Thành Một Phần Của Gia Đình Chúng Tôi' })}
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-12">
            {t({ 
              en: 'Whether you are joining us in person or online, there is a place for you at The Global Gospel Power Church.', 
              vi: 'Cho dù bạn tham gia trực tiếp hay trực tuyến, luôn có một chỗ dành cho bạn tại Hội Thánh Quyền Năng Tin Lành Toàn Cầu.' 
            })}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-church-red text-white rounded-full font-bold shadow-2xl shadow-church-red/20"
          >
            {t({ en: 'Contact Us for More Info', vi: 'Liên Hệ Để Biết Thêm Thông Tin' })}
          </motion.button>
        </div>
      </section>
    </div>
  );
};
