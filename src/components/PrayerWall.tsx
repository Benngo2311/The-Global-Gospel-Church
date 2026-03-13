import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageSquare, Plus, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Prayer {
  id: string;
  text: string;
  author: string;
  email?: string;
  phone?: string;
  prayedCount: number;
  timestamp: Date;
}

export const PrayerWall: React.FC = () => {
  const { t } = useLanguage();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newPrayer, setNewPrayer] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'prayers'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prayersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: new Date(doc.data().timestamp)
      })) as Prayer[];
      setPrayers(prayersData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'prayers');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddPrayer = async () => {
    if (!newPrayer.trim()) return;
    try {
      const timestamp = Date.now();
      const prayerData = {
        text: newPrayer,
        author: author.trim() || 'Anonymous',
        email: email.trim() || '',
        phone: phone.trim() || '',
        prayedCount: 0,
        timestamp
      };
      
      // Save to Firestore
      await addDoc(collection(db, 'prayers'), prayerData);
      
      // Send email notification
      fetch('/api/send-prayer-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prayerData)
      }).catch(console.error);

      setNewPrayer('');
      setAuthor('');
      setEmail('');
      setPhone('');
      setIsAdding(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'prayers');
    }
  };

  const handlePrayed = async (id: string) => {
    try {
      const prayerRef = doc(db, 'prayers', id);
      await updateDoc(prayerRef, {
        prayedCount: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `prayers/${id}`);
    }
  };

  return (
    <section className="py-24 px-6 bg-church-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              {t({ en: 'Prayer Corner', vi: 'Góc Cầu Thay' })}
            </h2>
            <p className="text-slate-600 text-lg">
              {t({ 
                en: 'Share your prayer requests and join others in intercession. "Bear one another’s burdens, and so fulfill the law of Christ." (Galatians 6:2)', 
                vi: 'Chia sẻ các yêu cầu cầu nguyện của bạn và cùng những người khác cầu thay. "Hãy mang lấy gánh nặng cho nhau, như vậy anh em sẽ làm trọn luật pháp của Đấng Christ." (Ga-la-ti 6:2)' 
              })}
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="px-8 py-4 bg-church-red text-white rounded-full font-bold hover:bg-red-800 transition-all shadow-xl flex items-center gap-2"
          >
            <Plus size={20} />
            {t({ en: 'Post a Request', vi: 'Đăng Yêu Cầu' })}
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-church-red/10">
                <textarea
                  value={newPrayer}
                  onChange={(e) => setNewPrayer(e.target.value)}
                  placeholder={t({ en: 'Type your prayer request here...', vi: 'Nhập yêu cầu cầu nguyện của bạn tại đây...' })}
                  className="w-full h-32 bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-church-red outline-none resize-none mb-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder={t({ en: 'Your Name (Optional)', vi: 'Tên của bạn (Tùy chọn)' })}
                    className="bg-slate-50 border-none rounded-xl px-6 py-3 focus:ring-2 focus:ring-church-red outline-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t({ en: 'Email (Optional)', vi: 'Email (Tùy chọn)' })}
                    className="bg-slate-50 border-none rounded-xl px-6 py-3 focus:ring-2 focus:ring-church-red outline-none"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t({ en: 'Phone (Optional)', vi: 'Số điện thoại (Tùy chọn)' })}
                    className="bg-slate-50 border-none rounded-xl px-6 py-3 focus:ring-2 focus:ring-church-red outline-none"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setIsAdding(false)} className="px-6 py-2 text-slate-500 font-bold hover:text-slate-700">
                    {t({ en: 'Cancel', vi: 'Hủy' })}
                  </button>
                  <button onClick={handleAddPrayer} className="px-8 py-2 bg-church-red text-white rounded-full font-bold hover:bg-red-800 transition-colors">
                    {t({ en: 'Post Request', vi: 'Đăng Yêu Cầu' })}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-church-red border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-slate-400 font-medium">{t({ en: 'Loading prayers...', vi: 'Đang tải các lời cầu nguyện...' })}</p>
            </div>
          ) : prayers.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-slate-100">
              <p className="text-slate-400 font-medium">{t({ en: 'No prayer requests yet. Be the first to post!', vi: 'Chưa có yêu cầu cầu nguyện nào. Hãy là người đầu tiên đăng!' })}</p>
            </div>
          ) : prayers.map((prayer, i) => (
            <motion.div
              key={prayer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-50 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-church-red/10 flex items-center justify-center text-church-red">
                    <Heart size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    {prayer.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic">"{prayer.text}"</p>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-400">{prayer.author}</span>
                <button
                  onClick={() => handlePrayed(prayer.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-church-red/5 text-church-red hover:bg-church-red hover:text-white transition-all group"
                >
                  <Check size={14} className="group-hover:scale-125 transition-transform" />
                  <span className="text-xs font-bold">{prayer.prayedCount} {t({ en: 'Prayed', vi: 'Đã cầu nguyện' })}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
