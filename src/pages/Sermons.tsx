import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PublicSermonView } from '../components/sermons/PublicSermonView';
import { AdminSermonDashboard } from '../components/sermons/AdminSermonDashboard';

export const Sermons: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  
  const [sermons, setSermons] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'public' | 'admin'>('public');

  // Loading states
  const [loading, setLoading] = useState(true);

  // Read data
  useEffect(() => {
    const unsubSermons = onSnapshot(query(collection(db, 'sermons')), (snap) => {
      setSermons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    const unsubGroups = onSnapshot(query(collection(db, 'sermonGroups'), orderBy('customOrder')), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubSermons();
      unsubGroups();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="absolute top-0 inset-x-0 h-[400px] overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-church-red/5 to-slate-100" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
              {t({ en: 'Sermon Library', vi: 'Thư Viện Bài Giảng' })}
            </h1>
            <p className="text-slate-500 max-w-2xl">
              {t({ en: 'Explore our collection of sermons and teachings to grow in your faith.', vi: 'Khám phá bộ sưu tập bài giảng và lời dạy để trưởng thành trong đức tin.' })}
            </p>
          </div>
          
          {isAdmin && (
            <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setActiveTab('public')}
                className={`px-6 py-2 text-sm font-medium transition-colors ${activeTab === 'public' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                {t({ en: 'Public View', vi: 'Xem Công Khai' })}
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-6 py-2 text-sm font-medium transition-colors ${activeTab === 'admin' ? 'bg-church-red text-white' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                {t({ en: 'Admin Dashboard', vi: 'Bảng Điều Khiển' })}
              </button>
            </div>
          )}
        </div>

        {activeTab === 'public' ? (
          <PublicSermonView sermons={sermons} groups={groups} loading={loading} />
        ) : (
          <AdminSermonDashboard sermons={sermons} groups={groups} />
        )}
      </div>
    </div>
  );
};

