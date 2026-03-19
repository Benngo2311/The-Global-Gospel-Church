import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Globe, Users, Shield, Zap, Star, Book } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SEO } from '../components/SEO';
import { PageNavigation } from '../components/PageNavigation';

export const Ministries: React.FC = () => {
  const { t } = useLanguage();

  const ministries = [
    {
      icon: <Globe size={40} />,
      title: { en: 'The Global Gospel Power Church', vi: 'Hội Thánh Tin Lành Quyền Phép Toàn Cầu' },
      desc: { en: 'Organize worship gatherings that foster a sense of community and spiritual growth, including: Bible teaching sessions; Regular prayer, intercession, deliverance, and healing for both personal and collective needs; Building together and sharing the vision of evangelism towards the community; Sharing the love and message of Jesus Christ with everyone.', vi: 'Tổ chức các buổi nhóm thờ phượng nhằm phát triển thuộc linh và thúc đẩy tinh thần cộng đồng bao gồm: Các buổi dạy Kinh Thánh; Cầu nguyện, cầu thay, giải cứu chữa lành thường xuyên cho các nhu cầu cá nhân và tập thể; Cùng nhau gây dựng và chia sẻ khải tượng truyền giáo hướng đến cộng đồng; Chia sẻ tình yêu và thông điệp của Đức Chúa Jêsus Christ với tất cả mọi người.' },
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
      title: { en: 'The Global Gospel Power Bible School', vi: 'Trường Kinh Thánh Tin Lành Quyền Phép Toàn Cầu' },
      desc: { en: 'Teaching, training, and equipping believers in both basic and advanced Biblical studies for Christians whom God has called to become His servants by the guidance of the Holy Spirit.', vi: 'Giảng dạy, đào tạo và trang bị cho các tín hữu, các nghiên cứu Kinh Thánh cơ bản và nâng cao cho những Cơ Đốc nhân được Chúa gọi để trở thành tôi tớ Ngài dưới sự dẫn dắt của Thánh Linh.' },
      link: '/ministries/bible-school',
      external: false
    },
    {
      icon: <Shield size={40} />,
      title: { en: 'Heaven Academy', vi: 'Học Viện Thiên Đàng' },
      desc: { en: 'Teaching in bilingual English-Vietnamese Bible classes for Vietnamese youth by the sovereign guidance of the Holy Spirit.', vi: 'Giảng dạy các lớp Kinh Thánh song ngữ Anh-Việt cho thanh thiếu niên Việt Nam và Quốc Tế dưới sự dẫn dắt tối cao của Đức Thánh Linh.' },
      link: '/ministries/heaven-academy',
      external: false
    },
    {
      icon: <Users size={40} />,
      title: { en: 'Council Of Prayers For The Global Spiritual Battle', vi: 'Hội Đồng Hiệp Nguyện Chiến Trận Thuộc Linh Toàn Cầu' },
      desc: { en: 'Through the inspired guidance of the Holy Spirit, we are committing ourselves to transformative periods of fasting and prayer, participating in night watches focused on spiritual warfare, and undertaking prayer patrol as led by His presence.', vi: 'Thông qua sự soi dẫn của Đức Thánh Linh, chúng tôi cam kết thực hiện các giai đoạn kiêng ăn và cầu nguyện mang tính biến đổi, tham gia vào các buổi thức canh tập trung vào chiến trận thuộc linh và thực hiện các cuộc tuần hành cầu nguyện theo sự dẫn dắt của Ngài.' },
      link: '/ministries/council-of-prayers',
      external: false
    },
    {
      icon: <Users size={40} />,
      title: { en: "Men's Global Power Gospel Council", vi: 'Ban Nam Giới Tin Lành Quyền Phép Toàn Cầu' },
      desc: { en: 'Training and educating adult men in faith; leading their families with exemplary holiness and integrity; and serving the community with the loving heart of Jesus Christ through communion in unity under the power of the Holy Spirit and the Word of God.', vi: 'Đào tạo, huấn luyện cho những người nam giới trưởng thành đức tin; lãnh đạo gia đình bằng sự gương mẫu, thánh khiết, chính trực; và phục vụ cộng đồng với trái tim yêu thương của Đức Chúa Jêsus Christ thông qua mối tương giao hiệp nhất trong quyền phép Đức Thánh Linh và Lời Chúa.' },
      link: '/ministries/mens-ministry',
      external: false
    },
    {
      icon: <Users size={40} />,
      title: { en: "Women's Global Power Gospel Council", vi: 'Ban Nữ Giới Tin Lành Quyền Phép Toàn Cầu' },
      desc: { en: "Through the power of the Holy Spirit, we study God's Word, develop faith and love in the Lord, witness to others to God's salvation, pray, intercede, help our spouses and care for our children, and serve the Global Gospel Power Church and the community of churches.", vi: 'Nhờ cầy quyền phép Đức Thánh Linh học Lời Chúa, phát triển đức tin và tình yêu trong Chúa, làm chứng cho mọi người đến với sự cứu rỗi của Chúa, cầu nguyện, cầu thay, giúp đỡ người phối ngẫu và chăm sóc con cái, phục vụ Giáo Hội Tin Lành Quyền Toàn Cầu và cộng đồng các Hội Thánh.' },
      link: '/ministries/womens-ministry',
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
                <p className="text-4xl font-serif font-bold text-church-red mb-2">7</p>
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
                src="/images/649465941_1269453055137354_818195905768922351_n.jpg" 
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
      <PageNavigation 
        prev={{ title: { en: 'About Us', vi: 'Về Chúng Tôi' }, path: '/about' }}
        next={{ title: { en: 'The Global Gospel Power Church', vi: 'Hội Thánh Tin Lành Quyền Phép Toàn Cầu' }, path: '/ministries/church' }}
      />
    </div>
  );
};
