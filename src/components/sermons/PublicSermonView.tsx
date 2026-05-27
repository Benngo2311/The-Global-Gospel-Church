import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, User, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SermonModal } from './SermonModal';
import { AnimatePresence, motion } from 'motion/react';

interface PublicSermonViewProps {
  sermons: any[];
  groups: any[];
  loading: boolean;
}

export const PublicSermonView: React.FC<PublicSermonViewProps> = ({ sermons, groups, loading }) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedSermon, setSelectedSermon] = useState<any | null>(null);

  // Filter published only
  const publishedSermons = useMemo(() => {
    return sermons.filter(s => s.status === 'published');
  }, [sermons]);

  // Handle filtering
  const filteredSermons = useMemo(() => {
    let result = publishedSermons;
    
    if (search.trim()) {
      const qs = search.toLowerCase();
      result = result.filter(s => 
        s.title?.toLowerCase().includes(qs) || 
        s.preacher?.toLowerCase().includes(qs) ||
        s.biblePassage?.toLowerCase().includes(qs)
      );
    }

    if (selectedGroup !== 'all') {
      result = result.filter(s => s.groupId === selectedGroup);
    }

    // Sort by date (newest first)
    return result.sort((a, b) => new Date(b.sermonDate).getTime() - new Date(a.sermonDate).getTime());
  }, [publishedSermons, search, selectedGroup]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-church-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t({ en: 'Search sermons, preachers, passages...', vi: 'Tìm kiếm bài giảng, diễn giả...' })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-church-red/20 focus:border-church-red transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            className="w-full md:w-64 pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-church-red/20 focus:border-church-red transition-all text-slate-700"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="all">{t({ en: 'All Series/Groups', vi: 'Tất cả chủ đề' })}</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredSermons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center p-16 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {t({ en: 'No sermons found', vi: 'Không tìm thấy bài giảng' })}
          </h3>
          <p className="text-slate-500">
            {t({ en: 'Try adjusting your search or filters.', vi: 'Vui lòng thử điều chỉnh tìm kiếm hoặc bộ lọc.' })}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon, index) => (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedSermon(sermon)}
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-church-red/10 text-church-red text-xs font-bold uppercase tracking-wider rounded-full">
                    {sermon.groupName || 'Uncategorized'}
                  </span>
                </div>
                
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 group-hover:text-church-red transition-colors line-clamp-2">
                  {sermon.title}
                </h3>
                
                <div className="space-y-2 mb-4 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <User size={15} />
                    <span>{sermon.preacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={15} />
                    <span>{new Date(sermon.sermonDate).toLocaleDateString()}</span>
                  </div>
                  {sermon.biblePassage && (
                    <div className="flex items-center gap-2">
                      <BookOpen size={15} />
                      <span className="line-clamp-1">{sermon.biblePassage}</span>
                    </div>
                  )}
                </div>

                {sermon.description && (
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4 mt-auto">
                    {sermon.description}
                  </p>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 group-hover:bg-church-red transition-colors flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 group-hover:text-white transition-colors flex items-center gap-2">
                  {sermon.fileType === 'Document' ? <FileText size={16} /> : <BookOpen size={16} />}
                  {t({ en: 'Read Sermon', vi: 'Đọc Bài Giảng' })}
                </span>
                <span className="text-slate-400 group-hover:text-white/80 transition-colors">
                  &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedSermon && (
          <SermonModal sermon={selectedSermon} onClose={() => setSelectedSermon(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
