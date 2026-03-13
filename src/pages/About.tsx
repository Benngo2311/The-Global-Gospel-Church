import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE_CONTENT } from '../constants/content';
import { SEO } from '../components/SEO';

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
                  en: 'Our mission is to empower believers to live out their faith in everyday life, providing resources and support for spiritual growth and community engagement.',
                  vi: 'Sứ mệnh của chúng tôi là trao quyền cho các tín hữu sống đức tin của họ trong cuộc sống hàng ngày, cung cấp các nguồn lực và hỗ trợ cho sự phát triển tâm linh và sự tham gia cộng đồng.'
                })}
              </p>
              <p>
                {t({
                  en: 'We are committed to reaching the unreached and building a global family of believers who are equipped to spread the Gospel of Jesus Christ.',
                  vi: 'Chúng tôi cam kết tiếp cận những người chưa được tiếp cận và xây dựng một gia đình tín hữu toàn cầu được trang bị để truyền bá Tin Lành của Đức Chúa Jêsus Christ.'
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
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-church-red rounded-[3rem] z-10 flex items-center justify-center p-8 text-white shadow-2xl">
              <p className="text-xl font-serif italic text-center">
                "{t({ en: 'Go into all the world and preach the gospel to all creation.', vi: 'Hãy đi khắp thế gian, giảng Tin Lành cho mọi người.' })}"
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              title: { en: 'Our Vision', vi: 'Tầm Nhìn' },
              desc: { en: 'To see a world transformed by the power of the Gospel and the love of Christ.', vi: 'Thấy một thế giới được biến đổi bởi quyền năng của Tin Lành và tình yêu của Đức Chúa Jêsus Christ.' },
              icon: '🌟'
            },
            {
              title: { en: 'Our Values', vi: 'Giá Trị' },
              desc: { en: 'Faith, Community, Integrity, and Compassion are at the core of everything we do.', vi: 'Đức tin, Cộng đồng, Chính trực và Lòng trắc ẩn là cốt lõi của mọi việc chúng tôi làm.' },
              icon: '🤝'
            },
            {
              title: { en: 'Our Goal', vi: 'Mục Tiêu' },
              desc: { en: 'To equip every believer to be a light in their community and beyond.', vi: 'Trang bị cho mỗi tín hữu trở thành ánh sáng trong cộng đồng của họ và xa hơn nữa.' },
              icon: '🎯'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-12 rounded-[3rem] bg-white shadow-xl border border-slate-100 text-center hover:shadow-2xl transition-all"
            >
              <div className="text-5xl mb-6">{item.icon}</div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-slate-900">{t(item.title)}</h3>
              <p className="text-slate-600 leading-relaxed">{t(item.desc)}</p>
            </motion.div>
          ))}
        </div>

        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900 p-16 md:p-24 rounded-[4rem] text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-church-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">
              {t({ en: 'Our History', vi: 'Lịch Sử Của Chúng Tôi' })}
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-12">
              {t({
                en: 'Founded in 2020, Global Gospel Power Church emerged from a desire to create a welcoming online space for Christians seeking connection and spiritual growth. Since then, we have grown into a global family, reaching thousands with the message of hope.',
                vi: 'Được thành lập vào năm 2020, Hội Thánh Quyền Năng Tin Lành Toàn Cầu nảy sinh từ mong muốn tạo ra một không gian trực tuyến chào đón cho những Cơ Đốc nhân đang tìm kiếm sự kết nối và phát triển tâm linh. Kể từ đó, chúng tôi đã phát triển thành một gia đình toàn cầu, tiếp cận hàng ngàn người với thông điệp hy vọng.'
              })}
            </p>
            <div className="flex flex-wrap justify-center gap-12">
              <div>
                <p className="text-5xl font-serif font-bold text-church-red mb-2">2020</p>
                <p className="text-slate-400 uppercase tracking-widest text-sm">{t({ en: 'Founded', vi: 'Thành Lập' })}</p>
              </div>
              <div>
                <p className="text-5xl font-serif font-bold text-church-red mb-2">100+</p>
                <p className="text-slate-400 uppercase tracking-widest text-sm">{t({ en: 'Members', vi: 'Thành Viên' })}</p>
              </div>
              <div>
                <p className="text-5xl font-serif font-bold text-church-red mb-2">5+</p>
                <p className="text-slate-400 uppercase tracking-widest text-sm">{t({ en: 'Countries', vi: 'Quốc Gia' })}</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
