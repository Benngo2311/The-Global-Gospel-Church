import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Droplets, Plus, HeartHandshake, Clock, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, increment, where } from 'firebase/firestore';
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
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Repentance {
  id: string;
  text: string;
  author: string;
  email?: string;
  phone?: string;
  graceCount: number;
  timestamp: number;
}

export const RepentingCorner: React.FC = () => {
  const { t } = useLanguage();
  const [repentances, setRepentances] = useState<Repentance[]>([]);
  const [newRepentance, setNewRepentance] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [graceSet, setGraceSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('graceItems');
    if (stored) {
      try {
        setGraceSet(new Set(JSON.parse(stored)));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // Only fetch repentances from the last 24 hours
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    const q = query(
      collection(db, 'repentances'), 
      where('timestamp', '>', twentyFourHoursAgo),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Repentance[];
      setRepentances(data);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'repentances');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddRepentance = async () => {
    if (!newRepentance.trim()) return;
    try {
      const timestamp = Date.now();
      const data = {
        text: newRepentance,
        author: author.trim() || 'Anonymous',
        email: email.trim() || '',
        phone: phone.trim() || '',
        graceCount: 0,
        timestamp
      };
      
      await addDoc(collection(db, 'repentances'), data);
      
      // Send email notification
      fetch('/api/send-repentance-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(console.error);
      
      setNewRepentance('');
      setAuthor('');
      setEmail('');
      setPhone('');
      setIsAdding(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'repentances');
    }
  };

  const toggleGrace = async (id: string) => {
    const hasGivenGrace = graceSet.has(id);
    const newSet = new Set(graceSet);
    
    if (hasGivenGrace) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setGraceSet(newSet);
    localStorage.setItem('graceItems', JSON.stringify(Array.from(newSet)));

    try {
      const ref = doc(db, 'repentances', id);
      await updateDoc(ref, {
        graceCount: increment(hasGivenGrace ? -1 : 1)
      });
    } catch (error) {
      if (hasGivenGrace) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      setGraceSet(newSet);
      localStorage.setItem('graceItems', JSON.stringify(Array.from(newSet)));
      handleFirestoreError(error, OperationType.UPDATE, `repentances/${id}`);
    }
  };

  const getTimeRemaining = (timestamp: number) => {
    const expiryTime = timestamp + 24 * 60 * 60 * 1000;
    const now = Date.now();
    const diff = expiryTime - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <section className="py-24 px-6 bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-slate-800 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Droplets size={14} className="text-emerald-400" />
              {t({ en: 'Cleansing & Renewal', vi: 'Thanh Tẩy & Đổi Mới' })}
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white">
              {t({ en: 'Repenting Corner', vi: 'Góc Ăn Năn' })}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t({ 
                en: 'A safe, anonymous space to confess, repent, and receive grace. "If we confess our sins, he is faithful and just and will forgive us our sins." (1 John 1:9). Entries here gently fade away after 24 hours, symbolizing a fresh start.', 
                vi: 'Một không gian an toàn, ẩn danh để xưng tội, ăn năn và nhận ân điển. "Nếu chúng ta xưng tội mình, thì Ngài là thành tín công bình để tha tội cho chúng ta." (1 Giăng 1:9). Các bài đăng ở đây sẽ nhẹ nhàng biến mất sau 24 giờ, tượng trưng cho một khởi đầu mới.' 
              })}
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-all shadow-xl flex items-center gap-2 shrink-0"
          >
            <Plus size={20} />
            {t({ en: 'Lay Down Your Burden', vi: 'Trút Bỏ Gánh Nặng' })}
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-16 overflow-hidden"
            >
              <div className="bg-slate-800/50 backdrop-blur-md p-8 md:p-10 rounded-[2rem] border border-slate-700 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 text-emerald-400">
                  <ShieldAlert size={24} />
                  <p className="text-sm font-medium">
                    {t({ en: 'Your confession is safe. It will automatically disappear in 24 hours.', vi: 'Lời xưng tội của bạn được an toàn. Nó sẽ tự động biến mất sau 24 giờ.' })}
                  </p>
                </div>
                
                <textarea
                  value={newRepentance}
                  onChange={(e) => setNewRepentance(e.target.value)}
                  placeholder={t({ en: 'What is weighing on your heart?', vi: 'Điều gì đang đè nặng trong lòng bạn?' })}
                  className="w-full h-40 bg-slate-900/50 text-white border border-slate-700 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none resize-none mb-6 placeholder:text-slate-600"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder={t({ en: 'Name (Optional - Leave blank for Anonymous)', vi: 'Tên (Tùy chọn - Để trống nếu muốn Ẩn danh)' })}
                    className="bg-slate-900/50 text-white border border-slate-700 rounded-xl px-6 py-4 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder:text-slate-600"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t({ en: 'Email (Optional)', vi: 'Email (Tùy chọn)' })}
                    className="bg-slate-900/50 text-white border border-slate-700 rounded-xl px-6 py-4 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder:text-slate-600"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t({ en: 'Phone (Optional)', vi: 'Số điện thoại (Tùy chọn)' })}
                    className="bg-slate-900/50 text-white border border-slate-700 rounded-xl px-6 py-4 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder:text-slate-600"
                  />
                </div>
                
                <div className="flex justify-end gap-4">
                  <button onClick={() => setIsAdding(false)} className="px-6 py-3 text-slate-400 font-bold hover:text-white transition-colors">
                    {t({ en: 'Cancel', vi: 'Hủy' })}
                  </button>
                  <button 
                    onClick={handleAddRepentance} 
                    disabled={!newRepentance.trim()}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Flame size={18} />
                    {t({ en: 'Release & Repent', vi: 'Buông Bỏ & Ăn Năn' })}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-slate-400 font-medium">{t({ en: 'Loading...', vi: 'Đang tải...' })}</p>
            </div>
          ) : repentances.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-slate-800/30 rounded-[2rem] border border-slate-800 border-dashed">
              <p className="text-slate-500 font-medium">{t({ en: 'The corner is clear. No recent burdens.', vi: 'Góc này đang trống. Không có gánh nặng nào gần đây.' })}</p>
            </div>
          ) : repentances.map((rep, i) => {
            // Calculate opacity based on time remaining (fades out as it gets closer to 24h)
            const age = Date.now() - rep.timestamp;
            const maxAge = 24 * 60 * 60 * 1000;
            const ratio = Math.max(0, Math.min(1, age / maxAge));
            // Opacity goes from 1 to 0.4
            const opacity = 1 - (ratio * 0.6);

            return (
              <motion.div
                key={rep.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: opacity, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-700/50 flex flex-col justify-between hover:bg-slate-800/60 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full text-xs font-medium">
                      <Clock size={14} />
                      <span>{getTimeRemaining(rep.timestamp)} {t({ en: 'left', vi: 'còn lại' })}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {rep.author}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-8 font-serif text-lg">"{rep.text}"</p>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-slate-700/50">
                  <button
                    onClick={() => toggleGrace(rep.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all group",
                      graceSet.has(rep.id)
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-900/50 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 border border-transparent"
                    )}
                  >
                    <HeartHandshake size={18} className={cn("transition-transform", !graceSet.has(rep.id) && "group-hover:scale-110")} />
                    <span className="text-sm font-bold">
                      {graceSet.has(rep.id) 
                        ? t({ en: 'Grace Sent', vi: 'Đã Gửi Ân Điển' }) 
                        : t({ en: 'Send Grace', vi: 'Gửi Ân Điển' })}
                    </span>
                  </button>
                  
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-sm font-bold">{rep.graceCount}</span>
                    <HeartHandshake size={16} className="opacity-50" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
