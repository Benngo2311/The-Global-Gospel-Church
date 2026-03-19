import React from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Video, Calendar, Clock, Shield, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TimeRange } from '../components/TimeRange';
import { SEO } from '../components/SEO';
import { PageNavigation } from '../components/PageNavigation';

export const WomensMinistry: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    { en: "Studying God's Word", vi: 'Học Lời Chúa' },
    { en: 'Witnessing', vi: 'Làm Chứng' },
    { en: 'Prayer & Intercession', vi: 'Cầu Nguyện & Cầu Thay' },
    { en: 'Supporting Spouse', vi: 'Hỗ Trợ Người Phối Ngẫu' },
    { en: 'Caring for Children', vi: 'Chăm Sóc Con Cái' },
    { en: 'Serving the Churches', vi: 'Phục Vụ Các Hội Thánh' }
  ];

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <SEO 
        title={{ en: "Women's Ministry", vi: 'Mục Vụ Nữ Giới' }} 
        description={{ en: "Through the power of the Holy Spirit, we learn God\'s Word, develop faith and love in the Lord, witness to others to God\'s salvation, pray, intercede, help our spouses and care for our children, serve the Global Gospel Power Church, and serve other churches and the human community.", vi: 'Nhờ cầy quyền phép Đức Thánh Linh học Lời Chúa, phát triển đức tin và tình yêu trong Chúa, làm chứng cho mọi người đến với sự cứu rỗi của Chúa, cầu nguyện, cầu thay, giúp đỡ người phối ngẫu và chăm sóc con cái, phục vụ Giáo Hội Tin Lành Quyền Toàn Cầu, phục vụ các Hội Thánh và cộng đồng nhân loại.' }}
        url="https://tggpc.org/ministries/womens-ministry"
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
                <Users size={14} />
                {t({ en: "Women's Ministry", vi: 'Mục Vụ Nữ Giới' })}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight text-balance">
                {t({ en: 'Equipping Women for', vi: 'Trang Bị Cho Nữ Giới' })}{' '}
                <span className="text-church-red italic">{t({ en: 'Godly Service', vi: 'Phục Vụ Thuộc Linh' })}</span>
              </h1>
              
              <div className="mb-10">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4">
                  {t({ en: 'Our Mission', vi: 'Sứ Mệnh Của Chúng Tôi' })}
                </h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  {t({ 
                    en: "Through the power of the Holy Spirit, we study God\'s Word, develop faith and love in the Lord, witness to others to God\'s salvation, pray, intercede, help our spouses and care for our children, and serve the Global Gospel Power Church and the community of churches.", 
                    vi: 'Nhờ cậy quyền phép Đức Thánh Linh học Lời Chúa, phát triển đức tin và tình yêu trong Chúa, làm chứng cho mọi người đến với sự cứu rỗi của Chúa, cầu nguyện, cầu thay, giúp đỡ người phối ngẫu và chăm sóc con cái, phục vụ Giáo Hội Tin Lành Quyền Toàn Cầu và cộng đồng các Hội Thánh.' 
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
                {t({ en: 'Join Classes', vi: 'Tham Gia Lớp Học' })}
                <ArrowRight size={20} />
              </motion.a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white bg-church-cream p-4 flex items-center justify-center relative">
                <img 
                  src={t({
                    en: '/images/4.png', // Replace with your English logo filename
                    vi: '/images/3.png'  // Replace with your Vietnamese logo filename
                  })}
                  alt="Men's Ministry Logo" 
                  className="w-full h-full object-contain scale-180"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-church-red/5 rounded-full blur-3xl -z-10" />
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
                {t({ en: 'Virtual Classes', vi: 'Lớp Học Trực Tuyến' })}
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8">
                {t({ en: 'Online Classes', vi: 'Lớp Học Trực Tuyến' })}
              </h2>
              <p className="text-2xl text-slate-600 leading-relaxed mb-10">
                {t({ 
                  en: 'Join our online classes to praise and worship God, study the Bible in the Lord\'s presence, and pray and intercede for yourself, your family, your church, and the whole world.', 
                  vi: 'Tham gia các lớp học trực tuyến của chúng tôi để ngợi khen thờ phượng Chúa, học Kinh Thánh trong sự hiện diện của Chúa và cầu nguyện, cầu thay cho cá nhân, gia đình, Hội Thánh và toàn thế giới.' 
                })}
              </p>

            </div>
            
            <div className="w-full lg:w-1/2">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white p-10 md:p-12 rounded-[3rem] text-slate-900 shadow-2xl border border-slate-100"
              >
                <h3 className="text-3xl font-serif font-bold mb-8 text-church-red">
                  {t({ en: 'Women of Global Gospel Power', vi: 'Phụ Nữ Quyền Năng Tin Lành Toàn Cầu' })}
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
                      <p className="text-xl font-bold">{t({ en: 'Every Mon, Wed, Sat', vi: 'Thứ Hai, Thứ Tư, Thứ Bảy Hàng Tuần' })}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        {t({ en: 'Time', vi: 'Thời Gian' })}
                      </p>
                      <p className="text-xl font-bold">5:00 AM to 7:00 AM (California)</p>
                      <TimeRange ptStart="05:00" ptEnd="07:00" className="mt-2" />
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
            {t({ en: 'Sisterhood In Christ', vi: 'Tình Chị Em Vững Bền Trong Đấng Christ' })}
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8">
            {t({ en: 'A Community of Sisters', vi: 'Ban Phụ Nữ Tin Lành Quyền Phép Toàn Cầu' })}
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            {t({ 
              en: 'We believe that women play a vital role in the family, the church, and the community. Join us to be encouraged and support one another in becoming women filled with God\'s grace, greatly used by God for His glorious purposes.', 
              vi: 'Chúng tôi tin rằng phụ nữ đóng một vai trò rất quan trọng trong gia đình, Hội Thánh và cộng đồng. Hãy tham gia cùng chúng tôi để được khích lệ, giúp đỡ lẫn nhau trở thành những người phụ nữ đầy dẫy ơn Chúa, được Đức Chúa Trời đại dụng cho mục đích vinh hiển của Ngài.' 
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
              <h4 className="text-xl font-serif font-bold mb-2">{t({ en: 'Faithfulness', vi: 'Sự Trung Tín' })}</h4>
              <p className="text-slate-500 text-sm">{t({ en: 'Living lives of devotion.', vi: 'Sống đời sống tận hiến.' })}</p>
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
      <PageNavigation 
        prev={{ title: { en: "Men's Ministry", vi: 'Mục Vụ Nam Giới' }, path: '/ministries/mens-ministry' }}
        next={{ title: { en: 'Ministries', vi: 'Mục Vụ' }, path: '/ministries' }}
      />
    </div>
  );
};
