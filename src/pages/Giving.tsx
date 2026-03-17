import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, DollarSign, ArrowRight, CheckCircle2, Send, Phone, Mail, User, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SEO } from '../components/SEO';

export const Giving: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/give', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
        setFormData({ name: '', email: '', phone: '', amount: '', message: '' });
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-32 pb-20 px-6 overflow-hidden">
      <SEO 
        title={{ en: 'Giving', vi: 'Dâng Hiến' }} 
        description={{ en: 'Support the ministry of Global Gospel Power Church through your tithes and offerings.', vi: 'Hỗ trợ mục vụ của Hội Thánh Tin Lành Quyền Phép Toàn Cầu thông qua phần mười và dâng hiến của bạn.' }}
        url="https://tggpc.org/giving"
      />
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-church-red/10 text-church-red text-xs font-bold uppercase tracking-widest mb-8">
            <Heart size={14} />
            {t({ en: 'Tithes & Offerings', vi: 'Dâng Hiến & Phần Mười' })}
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-slate-900 mb-8 leading-tight">
            Tithes & <span className="text-church-red italic">Offerings</span>
          </h1>
          <div className="max-w-3xl mx-auto space-y-6 text-xl text-slate-600 leading-relaxed">
            <p>
              {t({ 
                en: 'If you would like to give your tithes and offerings, you may send them through Zelle or Venmo to:', 
                vi: 'Nếu bạn muốn dâng phần thập phân và dâng hiến của mình, bạn có thể gửi qua Zelle hoặc Venmo đến:' 
              })}
            </p>
            <p className="text-2xl font-bold text-slate-900 break-all">
              globalgospelpowerchurchusa@gmail.com
            </p>
            <p>
              {t({ 
                en: 'Thank you for giving faithfully and supporting the work of the Lord.', 
                vi: 'Cảm ơn bạn đã dâng hiến một cách trung tín và hỗ trợ công việc của Chúa.' 
              })}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Giving Methods */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-church-red/5 rounded-bl-[4rem] -z-10 group-hover:bg-church-red/10 transition-colors" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-church-red text-white rounded-2xl flex items-center justify-center shadow-lg shadow-church-red/20">
                  <DollarSign size={32} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900">Zelle</h2>
              </div>
              <a 
                href="https://enroll.zellepay.com/qr-codes?data=eyJhY3Rpb24iOiJwYXltZW50IiwibmFtZSI6IlRIRSBHTE9CQUwgR09TUEVMIFBPV0VSIENIVVJDSCBBY2NvdW50cyIsInFyQ29kZU5hbWUiOiJUSEUgR0xPQkFMIEdPU1BFTCBQT1dFUiBDSFVSQ0giLCJ0b2tlbiI6IjMxMDkwMjI2NDcifQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-church-red transition-all shadow-lg"
              >
                {t({ en: 'Give via Zelle', vi: 'Dâng qua Zelle' })}
                <ArrowRight size={20} />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900 p-10 rounded-[3rem] shadow-xl text-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem] -z-10 group-hover:bg-white/10 transition-colors" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <CreditCard size={32} />
                </div>
                <h2 className="text-3xl font-serif font-bold">Venmo</h2>
              </div>
              <a 
                href="https://l.messenger.com/l.php?u=https%3A%2F%2Fwww.paypal.com%2Fqrcodes%2Fvenmocs%2Fcd02710f-5313-4dd8-93fc-b4361ccf408c%3Fcreated%3D1772607581&h=AT5Njn9yRJbkl2GfxcUJU881S2_N19bETS9Q_YhGSJhOD58XcHp_9E0utH7CTFp-5NahJ1LQQ6VzUTExarm-_6JL7HRPd8f3iVt-9Ney4Hse-ULSTD8Zr620pQFywqc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-church-red hover:text-white transition-all shadow-lg"
              >
                {t({ en: 'Give via Venmo', vi: 'Dâng qua Venmo' })}
                <ArrowRight size={20} />
              </a>
            </motion.div>

            <div className="p-8 rounded-[2.5rem] bg-church-cream border border-church-gold/20">
              <p className="text-slate-700 font-medium leading-relaxed">
                {t({ 
                  en: 'Please also fill out the giving form so our team can know who gave and how the offering was sent, and can record it properly.', 
                  vi: 'Vui lòng điền vào mẫu dâng hiến để đội ngũ của chúng tôi biết ai đã dâng và lễ vật đã được gửi như thế nào, để có thể ghi chép chính xác.' 
                })}
              </p>
            </div>
          </div>

          {/* Giving Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100"
          >
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">
              {t({ en: 'Giving Form', vi: 'Mẫu Dâng Hiến' })}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">
                  {t({ en: 'Full Name', vi: 'Họ và Tên' })} *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-church-red focus:border-transparent outline-none transition-all"
                    placeholder={t({ en: 'Your Name', vi: 'Tên của bạn' })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">
                    {t({ en: 'Email Address', vi: 'Địa Chỉ Email' })} *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-church-red focus:border-transparent outline-none transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">
                    {t({ en: 'Phone Number', vi: 'Số Điện Thoại' })} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-church-red focus:border-transparent outline-none transition-all"
                      placeholder="(000) 000-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">
                  {t({ en: 'Amount', vi: 'Số Tiền' })} *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    required
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-church-red focus:border-transparent outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">
                  {t({ en: 'Message / Note', vi: 'Tin Nhắn / Ghi Chú' })}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-church-red focus:border-transparent outline-none transition-all resize-none"
                  placeholder={t({ en: 'How was the offering sent? (e.g. Zelle, Venmo)', vi: 'Lễ vật đã được gửi như thế nào? (vd: Zelle, Venmo)' })}
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-church-red text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl shadow-church-red/20 flex items-center justify-center gap-3 group"
              >
                <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                {t({ en: 'Submit Giving Record', vi: 'Gửi Bản Ghi Dâng Hiến' })}
              </button>

              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-3 border border-emerald-100"
                  >
                    <CheckCircle2 size={20} />
                    <p className="text-sm font-medium">
                      {t({ 
                        en: 'Thank you for your faithful giving. May the Lord bless you abundantly.', 
                        vi: 'Cảm ơn bạn đã dâng hiến một cách trung tín. Nguyện Chúa ban phước dồi dào cho bạn.' 
                      })}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
