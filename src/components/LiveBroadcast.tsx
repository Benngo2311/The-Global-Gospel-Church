import React from 'react';
import { motion } from 'motion/react';
import { Video, ExternalLink, Radio } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LiveBroadcastProps {
  facebookPageUrl?: string;
  isLive?: boolean;
}

export const LiveBroadcast: React.FC<LiveBroadcastProps> = ({ 
  facebookPageUrl = "https://www.facebook.com/UnitedPrayerSpiritualWarfareGlobalConference",
  isLive = false 
}) => {
  const { t } = useLanguage();

  // Encode the URL for the Facebook plugin
  const encodedUrl = encodeURIComponent(facebookPageUrl);
  const embedUrl = `https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-church-red flex items-center justify-center">
                <Video size={24} />
              </div>
              {isLive && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </span>
              )}
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl">
                {t({ en: 'Facebook Live Stream', vi: 'Phát Trực Tiếp Facebook' })}
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50">
                <Radio size={12} className={isLive ? "text-red-500" : ""} />
                {isLive ? t({ en: 'Live Now', vi: 'Đang Trực Tiếp' }) : t({ en: 'Check our page for live updates', vi: 'Xem trang của chúng tôi để cập nhật' })}
              </div>
            </div>
          </div>
          <a 
            href={facebookPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ExternalLink size={20} />
          </a>
        </div>

        <div className="aspect-video bg-slate-100 relative group">
          {/* 
            Note: Facebook embedding can be tricky with specific live URLs. 
            The most reliable way to show "Live" is to embed the page timeline 
            or use the Facebook Video Player plugin if you have a specific video ID.
            For now, we'll provide a clear link and a responsive container.
          */}
          <iframe 
            src={`https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=560&t=0`} 
            width="100%" 
            height="100%" 
            style={{ border: 'none', overflow: 'hidden' }} 
            scrolling="no" 
            frameBorder="0" 
            allowFullScreen={true} 
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Facebook Live"
          ></iframe>
          
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <p className="text-white font-bold text-lg flex items-center gap-2">
              <ExternalLink size={20} />
              {t({ en: 'Watch on Facebook', vi: 'Xem trên Facebook' })}
            </p>
          </div>
        </div>

        <div className="p-8 bg-church-cream/30">
          <p className="text-slate-600 text-center text-sm leading-relaxed">
            {t({ 
              en: 'If the broadcast doesn\'t start automatically, please click the button above to watch directly on our Facebook page.', 
              vi: 'Nếu buổi phát sóng không tự động bắt đầu, vui lòng nhấp vào nút bên trên để xem trực tiếp trên trang Facebook của chúng tôi.' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
