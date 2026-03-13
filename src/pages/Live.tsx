import React from 'react';
import { motion } from 'motion/react';
import { Radio, Share2, MessageCircle, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LiveBroadcast } from '../components/LiveBroadcast';
import { SEO } from '../components/SEO';

export const Live: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      <SEO 
        title={{ en: 'Watch Live', vi: 'Xem Trực Tiếp' }} 
        description={{ en: 'Join our global community in real-time. Experience worship, teaching, and prayer as it happens.', vi: 'Tham gia cộng đồng toàn cầu của chúng tôi trong thời gian thực. Trải nghiệm sự thờ phượng, giảng dạy và cầu nguyện khi nó đang diễn ra.' }}
        url="https://tggpc.org/live"
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Radio size={14} className="animate-pulse" />
            {t({ en: 'Live Broadcast', vi: 'Phát Trực Tiếp' })}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-slate-900">
            {t({ en: 'Watch Live', vi: 'Xem Trực Tiếp' })}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t({ 
              en: 'Join our global community in real-time. Experience worship, teaching, and prayer as it happens.', 
              vi: 'Tham gia cộng đồng toàn cầu của chúng tôi trong thời gian thực. Trải nghiệm sự thờ phượng, giảng dạy và cầu nguyện khi nó đang diễn ra.' 
            })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-24"
        >
          <LiveBroadcast isLive={false} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-church-cream flex items-center justify-center text-church-red mx-auto mb-6">
              <MessageCircle size={28} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-3">{t({ en: 'Interactive Chat', vi: 'Trò Chuyện Tương Tác' })}</h3>
            <p className="text-slate-500 text-sm">
              {t({ en: 'Engage with other believers in the Facebook comments section.', vi: 'Tương tác với các tín hữu khác trong phần bình luận trên Facebook.' })}
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-church-cream flex items-center justify-center text-church-red mx-auto mb-6">
              <Share2 size={28} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-3">{t({ en: 'Share the Word', vi: 'Chia Sẻ Lời Chúa' })}</h3>
            <p className="text-slate-500 text-sm">
              {t({ en: 'Invite your friends and family to join the livestream.', vi: 'Mời bạn bè và gia đình của bạn tham gia buổi phát trực tiếp.' })}
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-church-cream flex items-center justify-center text-church-red mx-auto mb-6">
              <Heart size={28} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-3">{t({ en: 'Prayer Requests', vi: 'Yêu Cầu Cầu Nguyện' })}</h3>
            <p className="text-slate-500 text-sm">
              {t({ en: 'Submit your prayer needs during the live session.', vi: 'Gửi nhu cầu cầu nguyện của bạn trong buổi trực tiếp.' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
