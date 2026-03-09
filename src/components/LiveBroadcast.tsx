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
  
  // Using the Page Plugin with timeline is more reliable for showing live streams 
  // as they appear at the top of the timeline when active.
  const embedUrl = `https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`;

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
                {t({ en: 'Facebook Live & Updates', vi: 'Trực Tiếp & Cập Nhật Facebook' })}
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50">
                <Radio size={12} className={isLive ? "text-red-500" : ""} />
                {isLive ? t({ en: 'Live Now', vi: 'Đang Trực Tiếp' }) : t({ en: 'Follow our page for live updates', vi: 'Theo dõi trang để cập nhật trực tiếp' })}
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

        <div className="aspect-square md:aspect-video bg-white relative group flex justify-center">
          <iframe 
            src={embedUrl} 
            width="500" 
            height="500" 
            style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }} 
            scrolling="no" 
            frameBorder="0" 
            allowFullScreen={true} 
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Facebook Feed"
          ></iframe>
        </div>

        <div className="p-8 bg-church-cream/30">
          <p className="text-slate-600 text-center text-sm leading-relaxed">
            {t({ 
              en: 'Our live broadcast will appear at the top of the feed above when we are live. You can also click the button in the top right to watch directly on Facebook.', 
              vi: 'Buổi phát sóng trực tiếp sẽ xuất hiện ở đầu bảng tin phía trên khi chúng tôi bắt đầu. Bạn cũng có thể nhấp vào nút ở góc trên bên phải để xem trực tiếp trên Facebook.' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
