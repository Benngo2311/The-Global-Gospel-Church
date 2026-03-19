import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE_CONTENT } from '../constants/content';
import { SEO } from '../components/SEO';
import { PageNavigation } from '../components/PageNavigation';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <SEO 
        title={{ en: 'About Us', vi: 'Về Chúng Tôi' }} 
        description={{ en: 'Discover the history, mission, and heart behind The Global Gospel Power Church.', vi: 'Khám phá lịch sử, sứ mệnh và trái tim đằng sau Hội Thánh Tin Lành Quyền Phép Toàn Cầu.' }}
        url="https://tggpc.org/about"
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="text-church-red text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
            {t({ en: 'OUR STORY & MISSION', vi: 'CÂU CHUYỆN & SỨ MỆNH CỦA CHÚNG TÔI' })}
          </span>
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-8 text-slate-900">
            {t({ en: 'About Us', vi: 'Về Chúng Tôi' })}
          </h1>
          <p className="text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light whitespace-pre-line">
            {t({ 
              en: 'Discover the history, mission, and heart behind The Global Gospel Power Church.', 
              vi: 'Khám phá lịch sử, sứ mệnh và trái tim đằng sau \n Hội Thánh Tin Lành Quyền Phép Toàn Cầu.'
            })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-slate-900">
              {t(SITE_CONTENT.about.title)}
            </h2>
            <div className="space-y-6 text-xl text-slate-600 leading-relaxed">
              <p>{t(SITE_CONTENT.about.description)}</p>
              <p>
                {t({
                  en: 'Together we will build a powerful Global Gospel family and proclaim the name of Jesus Christ to all humanity so that they may receive His salvation and eternal life in the glorious kingdom of heaven.',
                  vi: 'Chúng ta cùng nhau xây dựng một đại gia đình Tin Lành Quyền Phép Toàn Cầu và rao truyền danh Đức Chúa Jêsus Christ cho toàn nhân loại được tiếp nhận sự cứu rỗi của Ngài và được sự sống đời đời trên Vương Quốc Thiên Đàng Vinh Hiển.'
                })}
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src="/images/IMG_3825-1024x768.webp" 
                alt="Church Mission" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-church-red rounded-[3rem] z-10 flex flex-col items-center justify-center p-8 text-white shadow-2xl">
              <p className="text-xl font-serif italic text-center mb-4">
                "{t({ en: 'Go into all the world and preach the gospel to every creature.', vi: 'Hãy đi khắp thế gian, giảng Tin Lành cho mọi người.' })}"
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/80 text-center">
                — {t({ en: 'Mark 16:15', vi: 'Mác 16:15' })}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32">
          {/* Vision - Takes up 8 columns (2/3 width) on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 p-12 md:p-16 rounded-[3rem] bg-church-cream shadow-xl border border-church-gold/20 hover:shadow-2xl transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-church-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-church-gold/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm text-church-red">
                🌟
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-slate-900">
                {t({ en: 'Our Vision', vi: 'Tầm Nhìn' })}
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                {t({ 
                  en: 'Through the illumination of the Holy Spirit, we see a world being transformed according to God\'s will by the Power Gospel and the eternal love of Jesus Christ.', 
                  vi: 'Nhờ Đức Thánh Linh soi sáng mắt tâm linh, thấy được một thế giới đang biến đổi theo ý muốn của Đức Chúa Trời bởi Tin Lành Quyền Phép và tình yêu đời đời của Đức Chúa Jêsus Christ.' 
                })}
              </p>
            </div>
          </motion.div>

          {/* Goal - Takes up 4 columns (1/3 width) on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 p-12 rounded-[3rem] bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
          >
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-church-red/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-church-red/30 transition-colors" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-8 backdrop-blur-sm">
                🎯
              </div>
              <h3 className="text-3xl font-serif font-bold mb-6">
                {t({ en: 'Our Goal', vi: 'Mục Tiêu' })}
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed mt-auto">
                {t({ 
                  en: 'To equip every Christian to be a light in their community and beyond.', 
                  vi: 'Trang bị cho mỗi Cơ Đốc nhân trở thành ánh sáng trong cộng đồng của họ và xa hơn nữa.' 
                })}
              </p>
            </div>
          </motion.div>

          {/* Values - Takes up full width below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-12 p-12 md:p-16 rounded-[3rem] bg-white shadow-xl border border-slate-100 hover:shadow-2xl transition-all flex flex-col md:flex-row items-center gap-12"
          >
            <div className="w-24 h-24 bg-church-red/5 rounded-[2rem] flex items-center justify-center text-5xl shrink-0">
              🤝
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-slate-900">
                {t({ en: 'Our Values', vi: 'Giá Trị' })}
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed">
                {t({ 
                  en: 'Complete faith in the Lord, absolute trust in the Lord, and unconditional love in the Lord—these are the three core values ​​that we are upholding in our mission. (1 Corinthians 13:13)', 
                  vi: 'Đức tin trọn vẹn trong Chúa, sự tin cậy tuyệt đối trong Chúa, tình yêu thương vô điều kiện trong Chúa. Đó là ba giá trị cốt lỗi mà chúng tôi đang thực thi sứ mạng. (I Cô-rinh-tô 13:13)' 
                })}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900 p-16 md:p-24 rounded-[4rem] text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-church-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-church-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-red-400 text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
              {t({ en: 'Since 2020', vi: 'Từ Năm 2020' })}
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-12">
              {t({ en: 'Our History', vi: 'Lịch Sử Của Chúng Tôi' })}
            </h2>
            <div className="relative px-8 md:px-16">
              <div className="absolute -top-8 left-0 text-red-400/60 text-8xl font-serif leading-none">"</div>
              <p className="text-2xl md:text-3xl text-white leading-relaxed font-serif italic relative z-10">
                {t({
                  en: 'Established by the Holy Trinity in 2020, the Global Gospel Power Church has been fulfilling the Lord\’s vision of holding global spiritual battle prayer conferences, growing online churches and churches in many countries around the world.',
                  vi: 'Được Đức Chúa Trời Ba Ngôi thiết lập vào năm 2020, Giáo Hội Tin Lành Quyền Phép Toàn Cầu đã và đang thực hiện khải tượng của Chúa, mở các kỳ hội đồng hiệp nguyện chiến trận thuộc linh toàn cầu, phát triển các Hội Thánh trực tuyến và các Hội Thánh tại nhiều quốc gia trên thế giới.'
                })}
              </p>
              <div className="absolute -bottom-16 right-0 text-red-400/60 text-8xl font-serif leading-none">"</div>
            </div>
          </div>
        </motion.section>
      </div>
      <PageNavigation 
        prev={{ title: { en: 'Home', vi: 'Trang Chủ' }, path: '/' }}
        next={{ title: { en: 'Ministries', vi: 'Mục Vụ' }, path: '/ministries' }}
      />
    </div>
  );
};
