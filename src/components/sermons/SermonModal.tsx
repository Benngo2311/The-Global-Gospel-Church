import React from 'react';
import { motion } from 'motion/react';
import { X, Calendar, User, BookOpen, Download, Link as LinkIcon, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SermonModalProps {
  sermon: any;
  onClose: () => void;
}

export const SermonModal: React.FC<SermonModalProps> = ({ sermon, onClose }) => {
  const { t } = useLanguage();

  if (!sermon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-church-red uppercase tracking-wider">
              <span>{sermon.groupName || 'Uncategorized'}</span>
              {sermon.topics && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{sermon.topics}</span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight">
              {sermon.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <User size={14} /> {sermon.preacher}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} /> {new Date(sermon.sermonDate).toLocaleDateString()}
              </div>
              {sermon.biblePassage && (
                <div className="flex items-center gap-1">
                  <BookOpen size={14} /> {sermon.biblePassage}
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">

          {sermon.documentUrl && (
            <div className="mt-4 border-t border-slate-100 pt-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText size={14} /> 
                {t({ en: 'Document', vi: 'Tài Liệu' })}
              </h3>
              <div className="aspect-[1/1.4] w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                {sermon.documentUrl.includes('docs.google.com') ? (
                  <iframe 
                    src={sermon.documentUrl.replace(/\/edit[^\/]*$/, '/preview')}
                    className="w-full h-[600px] border-0"
                    title="Document Viewer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p className="mb-4">
                      {t({ en: 'Document cannot be previewed natively.', vi: 'Tài liệu không thể xem trước.' })}
                    </p>
                    {sermon.downloadUrl && (
                      <a 
                        href={sermon.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                      >
                        <Download size={16} />
                        {t({ en: 'Download File', vi: 'Tải Xuống' })}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {!sermon.documentUrl && sermon.downloadUrl && (
            <div className="mt-4 border-t border-slate-100 pt-8 flex flex-col items-center justify-center p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider w-full mb-3 flex items-center gap-2">
                <FileText size={14} /> 
                {t({ en: 'Document Preview', vi: 'Xem Trước Tài Liệu' })}
              </h3>
              <div className="w-full max-w-3xl aspect-[1/1.4] mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 mb-6">
                {sermon.fileType === 'PDF' ? (
                  <iframe 
                    src={sermon.downloadUrl} 
                    className="w-full h-[600px] border-0" 
                    title="PDF Preview" 
                  />
                ) : (
                  <iframe 
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(sermon.downloadUrl)}&embedded=true`} 
                    className="w-full h-[600px] border-0" 
                    title="Document Preview" 
                  />
                )}
              </div>
              <a 
                href={sermon.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                <Download size={16} />
                {t({ en: 'Download File', vi: 'Tải Xuống' })}
              </a>
            </div>
          )}

          {!sermon.documentUrl && !sermon.downloadUrl && (
            <div className="mt-4 border-t border-slate-100 pt-16 pb-8 flex flex-col items-center justify-center text-center">
              <BookOpen size={48} className="mb-4 text-slate-300" />
              <p className="text-slate-500">
                {t({ en: 'No document attached to this sermon.', vi: 'Không có tài liệu đính kèm cho bài giảng này.' })}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
          {sermon.downloadUrl && (
            <a 
              href={sermon.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center gap-2 text-sm"
            >
              <Download size={16} />
              {t({ en: 'Download', vi: 'Tải Xuống' })}
            </a>
          )}
          {sermon.documentUrl && !sermon.documentUrl.includes('docs.google.com') && (
             <a 
               href={sermon.documentUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="px-5 py-2.5 bg-church-red text-white font-medium rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2 text-sm shadow-sm"
             >
               <LinkIcon size={16} />
               {t({ en: 'Open Link', vi: 'Mở Liên Kết' })}
             </a>
          )}
        </div>
      </motion.div>
    </div>
  );
};
