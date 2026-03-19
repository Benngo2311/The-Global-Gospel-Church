import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SEO } from '../components/SEO';

export const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <SEO 
        title={{ en: 'Contact Us', vi: 'Liên Hệ' }} 
        description={{ en: 'Get in touch with The Global Gospel Power Church. We are here to pray with you and answer any questions.', vi: 'Liên hệ với Hội Thánh Quyền Năng Tin Lành Toàn Cầu. Chúng tôi ở đây để cầu nguyện cùng bạn và trả lời bất kỳ câu hỏi nào.' }}
        url="https://tggpc.org/contact"
      />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-church-red/10 text-church-red text-xs font-bold uppercase tracking-widest mb-6">
            <MessageSquare size={14} />
            {t({ en: 'Get in Touch', vi: 'Giữ Liên Lạc' })}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-slate-900">
            {t({ en: 'Contact Us', vi: 'Liên Hệ' })}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t({ 
              en: 'We would love to hear from you. Whether you have a question about our ministries, need prayer, or want to get involved.', 
              vi: 'Chúng tôi rất mong nhận được phản hồi từ bạn. Dù bạn có câu hỏi về các mục vụ của chúng tôi, cần cầu nguyện, hoặc muốn tham gia.' 
            })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-serif font-bold mb-8 text-slate-900">
              {t({ en: 'Our Information', vi: 'Thông Tin Của Chúng Tôi' })}
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{t({ en: 'Address', vi: 'Địa Chỉ' })}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    14441 Brookhurst St, Suite 4<br />
                    Garden Grove, CA 92843
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{t({ en: 'Phone', vi: 'Điện Thoại' })}</h3>
                  <a href="tel:+17148580000" className="text-slate-600 hover:text-church-red transition-colors">
                    (714) 858-0000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-church-cream flex items-center justify-center text-church-red shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <a href="mailto:info@tggpc.org" className="text-slate-600 hover:text-church-red transition-colors">
                    info@tggpc.org
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100"
          >
            <h2 className="text-3xl font-serif font-bold mb-8 text-slate-900">
              {t({ en: 'Send a Message', vi: 'Gửi Tin Nhắn' })}
            </h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {t({ en: 'First Name', vi: 'Tên' })}
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-church-red focus:ring-2 focus:ring-church-red/20 outline-none transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    {t({ en: 'Last Name', vi: 'Họ' })}
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-church-red focus:ring-2 focus:ring-church-red/20 outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Email
                </label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-church-red focus:ring-2 focus:ring-church-red/20 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  {t({ en: 'Subject', vi: 'Chủ Đề' })}
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-church-red focus:ring-2 focus:ring-church-red/20 outline-none transition-all"
                  placeholder={t({ en: 'How can we help?', vi: 'Chúng tôi có thể giúp gì?' })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  {t({ en: 'Message', vi: 'Tin Nhắn' })}
                </label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-church-red focus:ring-2 focus:ring-church-red/20 outline-none transition-all resize-none"
                  placeholder={t({ en: 'Your message here...', vi: 'Tin nhắn của bạn...' })}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-church-red text-white rounded-xl font-bold text-lg hover:bg-red-800 transition-colors shadow-lg shadow-church-red/20 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {t({ en: 'Send Message', vi: 'Gửi Tin Nhắn' })}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
