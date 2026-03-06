import React from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Video, Calendar, Clock, Shield, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const MensMinistry: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    { en: 'Spiritual Leadership', vi: 'Lãnh Đạo Tâm Linh' },
    { en: 'Bilingual Bible Study', vi: 'Học Kinh Thánh Song Ngữ' },
    { en: 'Accountability Groups', vi: 'Nhóm Giải Trình' },
    { en: 'Community Service', vi: 'Phục Vụ Cộng Đồng' },
    { en: 'Mentorship', vi: 'Sự Cố Vấn' },
    { en: 'Fellowship Events', vi: 'Sự Kiện Thông Công' }
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
                <Users size={14} />
                {t({ en: "Men's Ministry", vi: 'Mục Vụ Nam Giới' })}
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                Equipping Men for <br/>
                <span className="text-church-red italic">Godly Leadership</span>
              </h1>
              
              <div className="mb-10">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4">
                  {t({ en: 'Our Mission', vi: 'Sứ Mệnh Của Chúng Tôi' })}
                </h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  {t({ 
                    en: "To empower men to grow in their faith, lead their families with integrity, and serve the community with the heart of Christ through fellowship and the Word.", 
                    vi: 'Trao quyền cho nam giới phát triển đức tin, lãnh đạo gia đình bằng sự chính trực và phục vụ cộng đồng với trái tim của Chúa Kitô thông qua sự thông công và Lời Ngài.' 
                  })}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 size={18} className="text-church-red shrink-0" />
                    {t(feature)}
                  </div>
                ))}
              </div>

              <motion.a
                href="#online-meeting"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-church-red transition-all"
              >
                {t({ en: 'Join Bible Study', vi: 'Tham Gia Học Kinh Thánh' })}
                <ArrowRight size={20} />
              </motion.a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1529070538492-11a79f244044?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" 
                  alt="Men's Fellowship" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="glass p-8 rounded-3xl border border-white/20">
                    <Shield className="text-church-red mb-4" size={32} />
                    <p className="text-white text-xl font-serif italic">
                      "As iron sharpens iron, so one man sharpens another."
                    </p>
                    <p className="text-white/60 text-sm mt-2 font-bold uppercase tracking-widest">— Proverbs 27:17</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Online Meeting Section */}
      <section id="online-meeting" className="px-6 py-32 bg-church-cream rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 text-church-red font-bold uppercase tracking-widest text-xs mb-6">
                <Video size={16} />
                {t({ en: 'Virtual Bible Study', vi: 'Học Kinh Thánh Trực Tuyến' })}
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8">
                {t({ en: 'Online Meeting', vi: 'Nhóm Trực Tuyến' })}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-10">
                {t({ 
                  en: 'Join our weekly bilingual Bible study session specifically designed for men. We dive deep into the scriptures, share life experiences, and grow together in the knowledge of God.', 
                  vi: 'Tham gia buổi học Kinh Thánh song ngữ hàng tuần được thiết kế riêng cho nam giới. Chúng ta cùng đi sâu vào Kinh Thánh, chia sẻ kinh nghiệm sống và cùng nhau lớn lên trong sự hiểu biết về Đức Chúa Trời.' 
                })}
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-church-cream overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 font-medium">
                  <span className="text-slate-900 font-bold">50+</span> {t({ en: 'Men joined recently', vi: 'Anh em vừa tham gia' })}
                </p>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white p-10 md:p-12 rounded-[3rem] text-slate-900 shadow-2xl border border-slate-100"
              >
                <h3 className="text-3xl font-serif font-bold mb-8 text-church-red">
                  {t({ en: 'Bilingual Bible Study For Men (EN–VN)', vi: 'Học Kinh Thánh Song Ngữ Cho Nam Giới (ANH–VIỆT)' })}
                </h3>
                
                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        {t({ en: 'Frequency', vi: 'Tần Suất' })}
                      </p>
                      <p className="text-xl font-bold">{t({ en: 'Every Friday', vi: 'Thứ Sáu Hàng Tuần' })}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        {t({ en: 'Time', vi: 'Giờ Giấc' })}
                      </p>
                      <p className="text-xl font-bold">6:00 PM to 9:00 PM (California)</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Zoom ID</p>
                      <p className="text-xl font-bold text-church-red tracking-tight">483 700 7000</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Password</p>
                      <p className="text-xl font-bold text-church-red tracking-tight">7777</p>
                    </div>
                  </div>
                </div>

                <a 
                  href="https://us02web.zoom.us/j/4837007000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-church-red text-white rounded-2xl font-bold text-center hover:bg-slate-900 transition-all shadow-xl shadow-church-red/20 flex items-center justify-center gap-3"
                >
                  <Video size={20} />
                  {t({ en: 'Join via Zoom', vi: 'Tham Gia Qua Zoom' })}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="px-6 py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-church-red/5 text-church-red text-xs font-bold uppercase tracking-widest mb-8">
            <Heart size={14} />
            {t({ en: 'Brotherhood', vi: 'Tình Anh Em' })}
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8">
            {t({ en: 'A Community of Brothers', vi: 'Cộng Đồng Những Người Anh Em' })}
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            {t({ 
              en: 'We believe that men are called to be the spiritual pillars of their homes and communities. Join us as we support, challenge, and encourage one another to be the men God created us to be.', 
              vi: 'Chúng tôi tin rằng nam giới được gọi để trở thành những trụ cột tâm linh của gia đình và cộng đồng. Hãy tham gia cùng chúng tôi khi chúng ta hỗ trợ, thử thách và khích lệ lẫn nhau để trở thành những người nam mà Chúa đã tạo dựng.' 
            })}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-church-cream flex items-center justify-center text-church-red mx-auto mb-6">
                <BookOpen size={28} />
              </div>
              <h4 className="text-xl font-serif font-bold mb-2">{t({ en: 'Biblical Truth', vi: 'Lẽ Thật Kinh Thánh' })}</h4>
              <p className="text-slate-500 text-sm">{t({ en: 'Rooted in the Word of God.', vi: 'Bám rễ trong Lời Chúa.' })}</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-church-cream flex items-center justify-center text-church-red mx-auto mb-6">
                <Shield size={28} />
              </div>
              <h4 className="text-xl font-serif font-bold mb-2">{t({ en: 'Integrity', vi: 'Sự Chính Trực' })}</h4>
              <p className="text-slate-500 text-sm">{t({ en: 'Living lives of honor.', vi: 'Sống đời sống danh dự.' })}</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-church-cream flex items-center justify-center text-church-red mx-auto mb-6">
                <Users size={28} />
              </div>
              <h4 className="text-xl font-serif font-bold mb-2">{t({ en: 'Fellowship', vi: 'Sự Thông Công' })}</h4>
              <p className="text-slate-500 text-sm">{t({ en: 'Building lasting bonds.', vi: 'Xây dựng mối liên kết bền vững.' })}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
