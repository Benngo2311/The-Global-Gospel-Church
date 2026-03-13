import { Content, NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { title: { en: 'Home', vi: 'Trang Chủ' }, href: '/' },
  { title: { en: 'About', vi: 'Giới Thiệu' }, href: '/about' },
  { title: { en: 'Classes', vi: 'Lớp Học' }, href: '/classes' },
  { title: { en: 'Events', vi: 'Sự Kiện' }, href: '/events' },
  { 
    title: { en: 'Ministries', vi: 'Mục Vụ' }, 
    href: '/ministries',
    children: [
      { title: { en: 'The Global Gospel Power Church', vi: 'Hội Thánh Tin Lành Quyền Phép Toàn Cầu' }, href: '/ministries/church' },
      { title: { en: 'Global Gospel Power Bible School', vi: 'Trường Kinh Thánh Tin Lành Quyền Phép Toàn Cầu' }, href: '/ministries/bible-school' },
      { title: { en: 'Heaven Academy', vi: 'Học Viện Thiên Đàng' }, href: '/ministries/heaven-academy' },
      { title: { en: 'Heaven Band', vi: 'Ban Nhạc Thiên Đàng' }, href: '/ministries/heaven-band' },
      { title: { en: 'Men\'s Global Power Gospel Council', vi: 'Ban Nam Giới Tin lành Quyền Phép Toàn Cầu' }, href: '/ministries/mens-ministry' },
      { title: { en: 'Council Of Prayers For The Global Spiritual Warfare', vi: 'Hội Đồng Cầu Nguyện Chiến Trận Thuộc Linh Toàn Cầu' }, href: '/ministries/council-of-prayers' }
    ]
  },
  { title: { en: 'Giving', vi: 'Dâng Hiến' }, href: '/giving' },
  { title: { en: 'Live', vi: 'Trực Tiếp' }, href: '/live' },
  { title: { en: 'Contact', vi: 'Liên Hệ' }, href: '/contact' },
];

export const SITE_CONTENT: Content = {
  hero: {
    title: { 
      en: 'The Global Gospel Power Church', 
      vi: 'Hội Thánh Tin Lành Quyền Phép Toàn Cầu' 
    },
    subtitle: { 
      en: 'A community dedicated to spiritual growth, connection, and global prayer. Join us as we spread the message of The Trinity of God across the United States and beyond.', 
      vi: 'Một cộng đồng hết lòng tận hiến cho sự phát triển thuộc linh, kết nối và cầu nguyện toàn cầu. Hãy tham gia cùng chúng tôi khi chúng tôi lan tỏa thông điệp của Ba Ngôi Đức Chúa Trời khắp Hoa Kỳ và xa hơn nữa.' 
    },
    cta: { en: 'Join Us Online', vi: 'Tham Gia Trực Tuyến' },
  },
  about: {
    title: { en: 'Our Mission', vi: 'Sứ Mệnh Của Chúng Tôi' },
    description: { 
      en: 'At Global Gospel Power Church, we are dedicated to fostering a vibrant online community where individuals can grow spiritually, connect with others, and deepen their faith through virtual services and educational programs under the guidance of the Holy Spirit .', 
      vi: 'Tại Hội Thánh Tin Lành Quyền Phép Toàn Cầu, chúng tôi tận hiến để thúc đẩy một cộng đồng trực tuyến nóng cháy, nơi các cá nhân có thể phát triển thuộc linh, kết nối với những người khác và làm sâu sắc thêm đức tin của họ thông qua các dịch vụ trực tuyến và các chương trình giáo dục theo sự soi dẫn của Đức Thánh Linh.' 
    },
  },
  contact: {
    address: '437 E Mark Street, Benson AZ 85602',
    email: 'thegospelpower777@gmail.com',
    phone: '(310) 902-2647',
  },
};
