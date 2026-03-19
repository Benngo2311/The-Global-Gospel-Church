import React from 'react';
import { motion } from 'motion/react';
import { Play, Radio } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LiveBroadcastProps {
  isLive?: boolean;
}

export const LiveBroadcast: React.FC<LiveBroadcastProps> = ({ isLive = false }) => {
  const { t } = useLanguage();

  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 aspect-video shadow-2xl group">
      {/* Placeholder Image */}
      <img 
        src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
        alt="Church Service" 
        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        {isLive ? (
          <>
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 rounded-full bg-red-600/20 flex items-center justify-center mb-6 backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/50">
                <Radio size={32} className="animate-pulse" />
              </div>
            </motion.div>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
              {t({ en: 'Live Now', vi: 'Đang Phát Trực Tiếp' })}
            </h3>
            <p className="text-white/80 text-lg max-w-lg">
              {t({ en: 'Join our Sunday Service broadcast.', vi: 'Tham gia buổi phát sóng Lễ Chúa Nhật của chúng tôi.' })}
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-colors cursor-pointer">
              <Play size={32} className="text-white ml-2" />
            </div>
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4">
              {t({ en: 'Next Broadcast', vi: 'Buổi Phát Tiếp Theo' })}
            </h3>
            <p className="text-white/80 text-lg">
              {t({ en: 'Sunday at 10:00 AM (PT)', vi: 'Chúa Nhật lúc 10:00 Sáng (PT)' })}
            </p>
          </>
        )}
      </div>

      {/* Status Badge */}
      <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-sm font-medium">
        {isLive ? (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {t({ en: 'LIVE', vi: 'TRỰC TIẾP' })}
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            {t({ en: 'OFFLINE', vi: 'NGOẠI TUYẾN' })}
          </>
        )}
      </div>
    </div>
  );
};
