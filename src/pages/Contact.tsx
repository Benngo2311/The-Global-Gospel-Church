import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Mail, Phone, Send, Facebook, Youtube, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE_CONTENT } from '../constants/content';
import { SEO } from '../components/SEO';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <SEO 
        title={{ en: 'Contact Us', vi: 'Liên Hệ' }} 
        description={{ en: 'Get in touch with Global Gospel Power Church. We would love to hear from you.', vi: 'Liên hệ với Hội Thánh Tin Lành Quyền Phép Toàn Cầu. Chúng tôi rất mong nhận được tin từ bạn.' }}
        url="https://tggpc.org/contact"
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-church-red text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
              {t({ en: 'GET IN TOUCH', vi: 'LIÊN HỆ VỚI CHÚNG TÔI' })}
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-bold mb-8 text-slate-900">
              {t({ en: 'Contact Us', vi: 'Liên Hệ' })}
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-xl">
              {t({ 
                en: 'Have questions or need prayer? We are here for you. Reach out to our team and we will get back to you as soon as possible.', 
                vi: 'Bạn có câu hỏi hoặc cần cầu nguyện? Chúng tôi ở đây vì bạn. Hãy liên hệ với nhóm của chúng tôi và chúng tôi sẽ phản hồi sớm nhất có thể.' 
              })}
            </p>

            <div className="space-y-10">
              <div className="flex gap-8 group">
                <div className="w-16 h-16 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0 group-hover:bg-church-red group-hover:text-white transition-all duration-500 shadow-sm">
                  <MapPin size={32} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-2xl mb-2 text-slate-900">{t({ en: 'Location', vi: 'Địa Điểm' })}</h4>
                  <p className="text-lg text-slate-500 leading-relaxed">{SITE_CONTENT.contact.address}</p>
                </div>
              </div>
              <div className="flex gap-8 group">
                <div className="w-16 h-16 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0 group-hover:bg-church-red group-hover:text-white transition-all duration-500 shadow-sm">
                  <Mail size={32} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-2xl mb-2 text-slate-900">{t({ en: 'Email', vi: 'Email' })}</h4>
                  <p className="text-lg text-slate-500 leading-relaxed break-all">{SITE_CONTENT.contact.email}</p>
                </div>
              </div>
              <div className="flex gap-8 group">
                <div className="w-16 h-16 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0 group-hover:bg-church-red group-hover:text-white transition-all duration-500 shadow-sm">
                  <Phone size={32} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-2xl mb-2 text-slate-900">{t({ en: 'Phone', vi: 'Điện Thoại' })}</h4>
                  <p className="text-lg text-slate-500 leading-relaxed">{SITE_CONTENT.contact.phone}</p>
                </div>
              </div>
              <div className="flex gap-8 group">
                <div className="w-16 h-16 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0 group-hover:bg-church-red group-hover:text-white transition-all duration-500 shadow-sm">
                  <Facebook size={32} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-2xl mb-2 text-slate-900">Facebook</h4>
                  <a 
                    href="https://www.facebook.com/UnitedPrayerSpiritualWarfareGlobalConference" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-lg text-church-red hover:underline font-medium"
                  >
                    {t({ en: 'Join our Community', vi: 'Tham Gia Cộng Đồng' })}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl border border-slate-100 relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-church-red rounded-3xl flex items-center justify-center text-white shadow-xl">
              <Send size={40} />
            </div>
            <h3 className="text-3xl font-serif font-bold mb-10 text-center text-slate-900">{t({ en: 'Send a Message', vi: 'Gửi Tin Nhắn' })}</h3>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">{t({ en: 'Name', vi: 'Họ Tên' })}</label>
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 focus:ring-2 focus:ring-church-red outline-none transition-all" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">Email</label>
                  <input 
                    required
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 focus:ring-2 focus:ring-church-red outline-none transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">{t({ en: 'Subject', vi: 'Chủ Đề' })}</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 focus:ring-2 focus:ring-church-red outline-none appearance-none transition-all cursor-pointer"
                >
                  <option value="General Inquiry">{t({ en: 'General Inquiry', vi: 'Yêu Cầu Chung' })}</option>
                  <option value="Prayer Request">{t({ en: 'Prayer Request', vi: 'Yêu Cầu Cầu Nguyện' })}</option>
                  <option value="Class Information">{t({ en: 'Class Information', vi: 'Thông Tin Lớp Học' })}</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">{t({ en: 'Message', vi: 'Tin Nhắn' })}</label>
                <textarea 
                  required
                  rows={5} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 focus:ring-2 focus:ring-church-red outline-none resize-none transition-all" 
                />
              </div>
              <button 
                type="submit"
                className="w-full py-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-church-red transition-all shadow-xl flex items-center justify-center gap-3 text-lg hover:-translate-y-1"
              >
                {t({ en: 'Send Message', vi: 'Gửi Tin Nhắn' })}
                <Send size={20} />
              </button>

              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-3 border border-emerald-100 mt-4"
                  >
                    <CheckCircle2 size={20} />
                    <p className="text-sm font-medium">
                      {t({ 
                        en: 'Your message has been sent successfully. We will get back to you soon.', 
                        vi: 'Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.' 
                      })}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>

        <div className="mt-40">
          <div className="text-center mb-20">
            <span className="text-church-red text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
              {t({ en: 'COMMON QUESTIONS', vi: 'CÂU HỎI THƯỜNG GẶP' })}
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900">{t({ en: 'Frequently Asked Questions', vi: 'Câu Hỏi Thường Gặp' })}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: { en: 'How can I join online services?', vi: 'Làm thế nào để tham gia các buổi nhóm trực tuyến?' },
                a: { en: 'You can join our online services and classes by registering on our website. We offer various spiritual growth opportunities through Zoom and livestreaming.', vi: 'Bạn có thể tham gia các buổi nhóm và lớp học trực tuyến bằng cách đăng ký trên trang web của chúng tôi. Chúng tôi cung cấp nhiều cơ hội phát triển tâm linh thông qua Zoom và livestream.' }
              },
              {
                q: { en: 'What ministries do you offer?', vi: 'Hội thánh có những mục vụ nào?' },
                a: { en: 'We offer a variety of ministries including Bible studies, prayer groups, and spiritual warfare training, all designed to support your faith journey.', vi: 'Chúng tôi cung cấp nhiều mục vụ bao gồm học Kinh Thánh, các nhóm cầu nguyện và đào tạo chiến trận tâm linh, tất cả đều được thiết kế để hỗ trợ hành trình đức tin của bạn.' }
              },
              {
                q: { en: 'How can I participate in events?', vi: 'Làm thế nào để tham gia các sự kiện?' },
                a: { en: 'Please check our events page for upcoming activities. You can register online and receive updates about future events and classes.', vi: 'Vui lòng kiểm tra trang sự kiện của chúng tôi để biết các hoạt động sắp tới. Bạn có thể đăng ký trực tuyến và nhận cập nhật về các sự kiện và lớp học trong tương lai.' }
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <h4 className="font-serif font-bold text-2xl mb-6 text-church-red leading-tight">{t(item.q)}</h4>
                <p className="text-lg text-slate-500 leading-relaxed">{t(item.a)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
