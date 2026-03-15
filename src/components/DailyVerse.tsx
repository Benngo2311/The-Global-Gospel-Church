import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const VERSES = [
  { 
    en: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", 
    vi: "Vì ta biết ý tưởng ta nghĩ đối cùng các ngươi, là ý tưởng bình an, không phải tai họa, để cho các ngươi được sự trông cậy trong lúc cuối cùng của mình.",
    ref: { en: "Jeremiah 29:11", vi: "Giê-rê-mi 29:11" }
  },
  { 
    en: "I can do all things through him who strengthens me.", 
    vi: "Tôi làm được mọi sự nhờ Đấng ban thêm sức cho tôi.",
    ref: { en: "Philippians 4:13", vi: "Phi-líp 4:13" }
  },
  { 
    en: "Trust in the Lord with all your heart, and do not lean on your own understanding.", 
    vi: "Hãy hết lòng tin cậy Đức Giê-hô-va, chớ nương cậy nơi sự thông sáng của con.",
    ref: { en: "Proverbs 3:5", vi: "Châm-ngôn 3:5" }
  },
  { 
    en: "The Lord is my shepherd; I shall not want.", 
    vi: "Đức Giê-hô-va là Đấng chăn giữ tôi; tôi sẽ chẳng thiếu thốn gì.",
    ref: { en: "Psalm 23:1", vi: "Thi-thiên 23:1" }
  },
  { 
    en: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles.", 
    vi: "Nhưng ai trông đợi Đức Giê-hô-va thì chắc được sức mới, cất cánh bay cao như chim ưng.",
    ref: { en: "Isaiah 40:31", vi: "Ê-sai 40:31" }
  },
  {
    en: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.",
    vi: "Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con một của Ngài, hầu cho hễ ai tin Con ấy không bị hư mất mà được sự sống đời đời.",
    ref: { en: "John 3:16", vi: "Giăng 3:16" }
  },
  {
    en: "But seek first the kingdom of God and His righteousness, and all these things shall be added to you.",
    vi: "Nhưng trước hết, hãy tìm kiếm nước Đức Chúa Trời và sự công bình của Ngài, thì Ngài sẽ cho thêm các ngươi mọi điều ấy nữa.",
    ref: { en: "Matthew 6:33", vi: "Ma-thi-ơ 6:33" }
  },
  {
    en: "And we know that all things work together for good to those who love God, to those who are the called according to His purpose.",
    vi: "Vả, chúng ta biết rằng mọi sự hiệp lại làm ích cho kẻ yêu mến Đức Chúa Trời, tức là cho kẻ được gọi theo ý muốn Ngài đã định.",
    ref: { en: "Romans 8:28", vi: "Rô-ma 8:28" }
  },
  {
    en: "Have I not commanded you? Be strong and of good courage; do not be afraid, nor be dismayed, for the Lord your God is with you wherever you go.",
    vi: "Ta há chẳng có phán dặn ngươi sao? Hãy vững lòng bền chí, chớ run sợ, chớ kinh khủng; vì Giê-hô-va Đức Chúa Trời ngươi vẫn ở cùng ngươi trong mọi nơi ngươi đi.",
    ref: { en: "Joshua 1:9", vi: "Giô-suê 1:9" }
  },
  {
    en: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
    vi: "Vì Đức Chúa Trời chẳng ban cho chúng ta tâm thần nhút nhát, bèn là tâm thần mạnh mẽ, có tình thương yêu và dè giữ.",
    ref: { en: "2 Timothy 1:7", vi: "2 Ti-mô-thê 1:7" }
  }
];

export const DailyVerse: React.FC = () => {
  const { t, language } = useLanguage();
  const [verse, setVerse] = useState(VERSES[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
    setVerse(randomVerse);
  }, []);

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
      setVerse(randomVerse);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <section className="py-20 px-6 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-church-red rounded-full blur-[120px]" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-[10px] uppercase tracking-widest font-bold mb-8">
          <Quote size={12} />
          {t({ en: 'Daily Verses', vi: 'Câu Gốc Hằng Ngày' })}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={verse.en}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12"
          >
            <div className="space-y-6">
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight italic">
                "{language === 'en' ? verse.en : verse.vi}"
              </h2>
            </div>
            <p className="text-church-gold font-serif text-xl mt-8">— {t(verse.ref)}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center gap-8">
          <button
            onClick={handleRefresh}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <RefreshCw size={20} className={cn(isAnimating && "animate-spin")} />
          </button>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {language === 'en' ? (
              <a 
                href="https://kinhthanh.httlvn.org/?v=NKJV" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white transition-colors underline underline-offset-4"
              >
                Read in English (NKJV)
              </a>
            ) : (
              <a 
                href="https://kinhthanh.httlvn.org/?v=VN1925" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white transition-colors underline underline-offset-4"
              >
                Đọc bằng Tiếng Việt (VN1925)
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper for cn in this file if needed, or import it
import { cn } from '../lib/utils';
