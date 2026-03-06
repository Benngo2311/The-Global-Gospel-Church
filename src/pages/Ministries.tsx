import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Globe, Users, Shield, Zap, Star, Book } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Ministries: React.FC = () => {
  const { t } = useLanguage();

  const ministries = [
    {
      icon: <Globe size={40} />,
      title: { en: 'The Global Gospel Power Church', vi: 'Hội Thánh Quyền Năng Tin Lành Toàn Cầu' },
      desc: { en: 'Organizing Worship Services, Bible Teachings, Water Baptisms, Baptism of the Holy Spirit, Holy Communion, Prayer, Intercession, Deliverance, Healing, and Evangelism for the Community.', vi: 'Tổ chức các buổi thờ phượng, dạy Kinh Thánh, báp-têm bằng nước, báp-têm bằng Thánh Linh, tiệc thánh, cầu nguyện, cầu thay, giải cứu, chữa lành và truyền giáo cho cộng đồng.' },
      link: '/ministries/church',
      external: false
    },
    {
      icon: <Star size={40} />,
      title: { en: 'Heaven Band', vi: 'Ban Nhạc Thiên Đàng' },
      desc: { en: 'Carrying out Worship Programs, Concerts, Livestreams, Audio Recordings, and the Composition of Sacred Music.', vi: 'Thực hiện các chương trình thờ phượng, hòa nhạc, livestream, ghi âm và sáng tác nhạc thánh.' },
      link: '/ministries/heaven-band',
      external: false
    },
    {
      icon: <Book size={40} />,
      title: { en: 'The Global Gospel Power Bible School', vi: 'Trường Kinh Thánh Quyền Năng Tin Lành Toàn Cầu' },
      desc: { en: 'By the guidance of the Holy Spirit, teaching, training, and equipping believers with Basic and Advanced Biblical Studies, for Christians who are called by God to become His servants.', vi: 'Dưới sự dẫn dắt của Thánh Linh, giảng dạy, đào tạo và trang bị cho các tín hữu các nghiên cứu Kinh Thánh cơ bản và nâng cao cho những người được Chúa gọi.' },
      link: '/ministries/bible-school',
      external: false
    },
    {
      icon: <Shield size={40} />,
      title: { en: 'Heaven Academy', vi: 'Học Viện Thiên Đàng' },
      desc: { en: 'By the guidance of the Holy Spirit, organizing periods of fasting and prayer, night watches for spiritual warfare, and prayer walks as led by the Holy Spirit.', vi: 'Dưới sự dẫn dắt của Thánh Linh, tổ chức các giai đoạn kiêng ăn và cầu nguyện, canh đêm cho chiến trận tâm linh và đi bộ cầu nguyện.' },
      link: '/ministries/heaven-academy',
      external: false
    },
    {
      icon: <Users size={40} />,
      title: { en: 'Council Of Prayers For The Global Spiritual Battle', vi: 'Hội Đồng Cầu Nguyện Cho Chiến Trận Tâm Linh Toàn Cầu' },
      desc: { en: 'By the guidance of the Holy Spirit, organizing periods of fasting and prayer, night watches for spiritual warfare, and prayer walks as led by the Holy Spirit.', vi: 'Dưới sự dẫn dắt của Thánh Linh, tổ chức các giai đoạn kiêng ăn và cầu nguyện, canh đêm cho chiến trận tâm linh và đi bộ cầu nguyện.' },
      link: '/ministries/council-of-prayers',
      external: false
    },
    {
      icon: <Users size={40} />,
      title: { en: "Men's Ministry", vi: 'Mục Vụ Nam Giới' },
      desc: { en: 'Empowering men to grow in faith, lead their families, and serve the community through bilingual Bible studies and fellowship.', vi: 'Trao quyền cho nam giới phát triển đức tin, lãnh đạo gia đình và phục vụ cộng đồng thông qua các buổi học Kinh Thánh song ngữ và thông công.' },
      link: '/ministries/mens-ministry',
      external: false
    }
  ];

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      {/* About Ministries Section */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <span className="text-church-red text-xs font-bold uppercase tracking-[0.2em] mb-6 block">
              {t({ en: 'EXPLORE OUR CHURCH MINISTRIES TODAY', vi: 'KHÁM PHÁ CÁC MỤC VỤ CỦA CHÚNG TÔI NGAY HÔM NAY' })}
            </span>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              {t({ en: 'About our Ministries', vi: 'Về Các Mục Vụ Của Chúng Tôi' })}
            </h2>
            <div className="space-y-6 text-xl text-slate-600 leading-relaxed mb-12">
              <p>
                {t({ 
                  en: 'Discover a variety of ministries designed to foster spiritual growth and community engagement. Get involved and make a difference!', 
                  vi: 'Khám phá nhiều mục vụ khác nhau được thiết kế để thúc đẩy sự phát triển tâm linh và sự tham gia của cộng đồng. Hãy tham gia và tạo nên sự khác biệt!' 
                })}
              </p>
              <p>
                {t({ 
                  en: 'From prayer groups to educational programs, there’s a place for everyone to connect and serve.', 
                  vi: 'Từ các nhóm cầu nguyện đến các chương trình giáo dục, luôn có một vị trí cho mọi người để kết nối và phục vụ.' 
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 border-t border-slate-100 pt-12">
              <div>
                <p className="text-4xl font-serif font-bold text-church-red mb-2">7+</p>
                <p className="text-slate-500 font-medium">
                  {t({ en: 'Years of Community Service', vi: 'Năm Phục Vụ Cộng Đồng' })}
                </p>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-church-red mb-2">6</p>
                <p className="text-slate-500 font-medium">
                  {t({ en: 'Active Ministry Programs', vi: 'Chương Trình Mục Vụ Hoạt Động' })}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative group">
              <img 
                src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800" 
                alt="Ministries" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-church-red/10 group-hover:bg-transparent transition-colors" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ministries Grid Section */}
      <section className="px-6 bg-church-cream py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-8xl font-serif font-bold mb-4">
              {t({ en: 'Ministries', vi: 'Mục Vụ' })}
            </h2>
            <div className="w-24 h-1 bg-church-red mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((min, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 rounded-[3rem] bg-white shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                <div className="text-church-red mb-8 bg-church-cream w-20 h-20 rounded-3xl flex items-center justify-center group-hover:bg-church-red group-hover:text-white transition-colors">
                  {min.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-slate-900">{t(min.title)}</h3>
                <div className="pl-6 border-l-4 border-church-red/20 mb-8">
                  <p className="text-slate-600 leading-relaxed">{t(min.desc)}</p>
                </div>
                
                {min.external ? (
                  <a 
                    href={min.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-church-red transition-all shadow-lg"
                  >
                    {t({ en: 'View More', vi: 'Xem Thêm' })}
                  </a>
                ) : (
                  <Link 
                    to={min.link}
                    className="mt-auto inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-church-red transition-all shadow-lg"
                  >
                    {t({ en: 'View More', vi: 'Xem Thêm' })}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
