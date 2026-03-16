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
    { en: 'Prayer & Intercession', vi: 'Cầu Nguyện & Cầu Thay' },
    { en: 'Witnessing', vi: 'Làm Chứng' },
    { en: "Studying God's Word", vi: 'Học Lời Chúa' },
    { en: 'Supporting Spouse', vi: 'Hỗ Trợ Người Phối Ngẫu' },
    { en: 'Caring for Children', vi: 'Chăm Sóc Con Cái' },
    { en: 'Fellowship', vi: 'Sự Thông Công' }
  ];

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <SEO 
        title={{ en: "Women's Ministry", vi: 'Mục Vụ Nữ Giới' }} 
        description={{ en: "Empowering women to grow in faith, pray, intercede, witness, study God's word, support their spouses, and care for their children.", vi: 'Trao quyền cho phụ nữ phát triển đức tin, cầu nguyện, cầu thay, làm chứng, học Lời Chúa, hỗ trợ người phối ngẫu và chăm sóc con cái.' }}
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
                    en: "To empower women to grow in their faith, pray, intercede, witness, study God's word, support their spouses, and care for their children.", 
                    vi: 'Trao quyền cho phụ nữ phát triển đức tin, cầu nguyện, cầu thay, làm chứng, học Lời Chúa, hỗ trợ người phối ngẫu và chăm sóc con cái.' 
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
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Women's Ministry" 
                  className="w-full h-full object-cover rounded-[3rem]"
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
                  en: 'Join our online classes for worship, intercession, and Bible study. We gather to seek God\'s presence and grow together in His Word.', 
                  vi: 'Tham gia các lớp học trực tuyến của chúng tôi để thờ phượng, cầu thay và học Kinh Thánh. Chúng ta cùng nhau tìm kiếm sự hiện diện của Chúa và lớn lên trong Lời Ngài.' 
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
                        {t({ en: 'Time', vi: 'Giờ Giấc' })}
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
            {t({ en: 'Sisterhood In Christ', vi: 'Tình Chị Em Trong Đấng Christ' })}
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8">
            {t({ en: 'A Community of Sisters', vi: 'Cộng Đồng Nữ Giới' })}
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            {t({ 
              en: 'We believe that women play a vital role in their families and communities. Join us as we support, challenge, and encourage one another to be the women God created us to be.', 
              vi: 'Chúng tôi tin rằng phụ nữ đóng một vai trò quan trọng trong gia đình và cộng đồng. Hãy tham gia cùng chúng tôi để được hỗ trợ, khích lệ lẫn nhau trở thành những người nữ mà Chúa đã tạo dựng.' 
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
