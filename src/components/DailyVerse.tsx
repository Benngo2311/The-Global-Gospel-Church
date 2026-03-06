import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const VERSES = [
  { text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", ref: "Jeremiah 29:11" },
  { text: "I can do all things through him who strengthens me.", ref: "Philippians 4:13" },
  { text: "Trust in the Lord with all your heart, and do not lean on your own understanding.", ref: "Proverbs 3:5" },
  { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
  { text: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles.", ref: "Isaiah 40:31" }
];

export const DailyVerse: React.FC = () => {
  const { t } = useLanguage();
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
          {t({ en: 'Daily Inspiration', vi: 'Cảm Hứng Hàng Ngày' })}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={verse.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-8 italic">
              "{verse.text}"
            </h2>
            <p className="text-church-gold font-serif text-xl">— {verse.ref}</p>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handleRefresh}
          disabled={isAnimating}
          className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all mx-auto"
        >
          <RefreshCw size={20} className={cn(isAnimating && "animate-spin")} />
        </button>
      </div>
    </section>
  );
};

// Helper for cn in this file if needed, or import it
import { cn } from '../lib/utils';
