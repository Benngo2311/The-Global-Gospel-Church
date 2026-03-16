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
      { title: { en: 'Women\'s Global Power Gospel Council', vi: 'Ban Nữ Giới Tin lành Quyền Phép Toàn Cầu' }, href: '/ministries/womens-ministry' },
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
      en: 'Welcome to Global Gospel Power Church—where God\’s living Word is preached in the power of the Holy Spirit, lives are transformed, faith is revived, and nations are touched by the glory of God.', 
      vi: 'Chào mừng bạn đến với Giáo Hội Tin Lành Quyền Phép Toàn Cầu—nơi Lời sự sống của Chúa được rao giảng trong quyền năng Đức Thánh Linh, đời sống được biến đổi, đức tin được phục hưng, và các dân tộc được chạm đến bởi vinh hiển của Đức Chúa Trời.' 
    },
    cta: { en: 'Join Us Online', vi: 'Tham Gia Trực Tuyến' },
  },
  about: {
    title: { en: 'Our Mission', vi: 'Sứ Mệnh Của Chúng Tôi' },
    description: { 
      en: 'The Global Gospel Power Church is given a consecrated mission by the Triune God to foster a Christian community with burning hearts, spiritually united, connected with others, and growing in faith through educational programs inspired by the Holy Spirit and based on God\'s Bible.', 
      vi: 'Giáo Hội Tin Lành Quyền Phép Toàn Cầu được Đức Chúa Trời Ba Ngôi ban cho sứ mạng tận hiến để thúc đẩy một cộng đồng Cơ Đốc với những tấm lòng rực lửa, hiệp một phát triển thuộc linh, kết nối với mọi người khác và làm tăng trưởng đức tin của họ thông qua các chương trình giáo dục bởi sự soi sáng của Đức Thánh Linh trên nền tảng kinh thánh của Đức Chúa Trời.' 
    },
  },
  contact: {
    address: '437 E Mark Street, Benson AZ 85602',
    email: 'thegospelpower777@gmail.com',
    phone: '(310) 902-2647',
  },
};
