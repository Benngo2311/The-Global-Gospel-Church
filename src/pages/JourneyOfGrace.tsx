import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Upload, Image as ImageIcon, Video, Calendar as CalendarIcon, Loader2, LogIn, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { db, storage, auth } from '../firebase';
import { SEO } from '../components/SEO';
import { PageNavigation } from '../components/PageNavigation';

interface JourneyMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  description?: string;
  year?: number;
  date?: string;
  isTimeline?: boolean;
  timestamp: number;
  author?: string;
}

export const JourneyOfGrace: React.FC = () => {
  const { t } = useLanguage();
  const [mediaList, setMediaList] = useState<JourneyMedia[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<'timeline' | 'gallery'>('timeline');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isTimeline, setIsTimeline] = useState(false);
  const [date, setDate] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [author, setAuthor] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === 'khoatruy123@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    const q = query(collection(db, 'journeyMedia'), orderBy('timestamp', 'asc'));
    const unsubscribeDb = onSnapshot(q, (snapshot) => {
      const mediaData: JourneyMedia[] = [];
      snapshot.forEach((doc) => {
        mediaData.push({ id: doc.id, ...doc.data() } as JourneyMedia);
      });
      setMediaList(mediaData);
    }, (err) => {
      console.error("Error fetching media:", err);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDb();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code !== 'auth/cancelled-popup-request' && err.code !== 'auth/popup-closed-by-user') {
        console.error("Login error:", err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const isVideo = selectedFile.type.startsWith('video/');
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      
      if (selectedFile.size > maxSize) {
        setError(t({ 
          en: `File is too large. Max size is ${isVideo ? '50MB' : '10MB'}.`, 
          vi: `Tệp quá lớn. Kích thước tối đa là ${isVideo ? '50MB' : '10MB'}.` 
        }));
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError(t({ en: 'Please select a file to upload.', vi: 'Vui lòng chọn một tệp để tải lên.' }));
      return;
    }
    if (!isAdmin) {
      setError(t({ en: 'Only administrators can upload media.', vi: 'Chỉ quản trị viên mới có thể tải lên phương tiện.' }));
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      const storageRef = ref(storage, `journeyMedia/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (err) => {
          console.error("Upload error:", err);
          setError(t({ en: 'Failed to upload file. Please try again.', vi: 'Tải lên thất bại. Vui lòng thử lại.' }));
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          const newMedia = {
            url: downloadURL,
            type: fileType,
            timestamp: Date.now(),
            ...(description ? { description } : {}),
            ...(isTimeline ? { isTimeline: true, date } : { year }),
            ...(author ? { author } : {})
          };

          await addDoc(collection(db, 'journeyMedia'), newMedia);
          
          setFile(null);
          setDescription('');
          setAuthor('');
          setYear(new Date().getFullYear());
          setDate('');
          setIsTimeline(false);
          setIsUploading(false);
          setUploadProgress(0);
          
          const fileInput = document.getElementById('media-upload') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        }
      );
    } catch (err) {
      console.error("Error saving media data:", err);
      setError(t({ en: 'An error occurred. Please try again.', vi: 'Đã xảy ra lỗi. Vui lòng thử lại.' }));
      setIsUploading(false);
    }
  };

  // Group timeline media by year
  const timelineMedia = mediaList.filter(m => m.isTimeline);
  const galleryMedia = mediaList.filter(m => !m.isTimeline);

  const sortedTimelineMedia = [...timelineMedia].sort((a, b) => {
    if (a.date && b.date) return new Date(a.date).getTime() - new Date(b.date).getTime();
    return a.timestamp - b.timestamp;
  });

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const width = scrollContainerRef.current.clientWidth;
    const index = Math.round(scrollLeft / width);
    if (index !== activeIndex) setActiveIndex(index);
  };

  const scrollToSlide = (index: number) => {
    if (!scrollContainerRef.current) return;
    const width = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 overflow-hidden">
      <SEO 
        title={{ en: 'The Journey of Grace', vi: 'Chặng Đường Ân Điển' }} 
        description={{ en: 'Explore the timeline, photos, and videos of our church\'s journey.', vi: 'Khám phá dòng thời gian, hình ảnh và video về chặng đường của hội thánh chúng tôi.' }}
      />

      {/* Hero Section */}
      <section className="bg-church-cream py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6">
            {t({ en: 'The Journey of Grace', vi: 'Chặng Đường Ân Điển' })}
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            {t({ 
              en: 'A timeline of God\'s faithfulness through photos and videos.', 
              vi: 'Dòng thời gian về sự thành tín của Chúa qua hình ảnh và video.' 
            })}
          </p>
        </div>
      </section>

      {/* Admin Upload Section */}
      {isAdmin && (
        <section className="py-16 px-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                <Upload className="text-church-red" />
                {t({ en: 'Admin Upload', vi: 'Tải Lên (Quản Trị Viên)' })}
              </h2>
              <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-church-red flex items-center gap-1">
                <LogOut size={16} /> Logout
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t({ en: 'Select Image or Video', vi: 'Chọn Hình Ảnh hoặc Video' })}
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="media-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-500">
                        <span className="font-semibold">{t({ en: 'Click to upload', vi: 'Nhấn để tải lên' })}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        {file ? file.name : t({ en: 'PNG, JPG, MP4 (Max 50MB)', vi: 'PNG, JPG, MP4 (Tối đa 50MB)' })}
                      </p>
                    </div>
                    <input 
                      id="media-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="isTimeline"
                  checked={isTimeline}
                  onChange={(e) => setIsTimeline(e.target.checked)}
                  className="w-5 h-5 text-church-red rounded focus:ring-church-red"
                  disabled={isUploading}
                />
                <label htmlFor="isTimeline" className="text-sm font-bold text-slate-700 cursor-pointer">
                  {t({ en: 'Add to Timeline (Requires specific date)', vi: 'Thêm vào Dòng thời gian (Cần ngày cụ thể)' })}
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isTimeline ? (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t({ en: 'Specific Date', vi: 'Ngày Cụ Thể' })}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red focus:border-transparent outline-none"
                      disabled={isUploading}
                      required={isTimeline}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t({ en: 'Year', vi: 'Năm' })}
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red focus:border-transparent outline-none"
                      min="1900"
                      max="2100"
                      disabled={isUploading}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {t({ en: 'Author Name (Optional)', vi: 'Tên Tác Giả (Tùy chọn)' })}
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red focus:border-transparent outline-none"
                    placeholder={t({ en: 'John Doe', vi: 'Nguyễn Văn A' })}
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t({ en: 'Description (Optional)', vi: 'Mô Tả (Tùy chọn)' })}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red focus:border-transparent outline-none resize-none h-24"
                  placeholder={t({ en: 'Tell us about this memory...', vi: 'Hãy kể cho chúng tôi về kỷ niệm này...' })}
                  disabled={isUploading}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {isUploading && (
                <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4 overflow-hidden">
                  <div className="bg-church-red h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading || !file}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-church-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {t({ en: 'Uploading...', vi: 'Đang tải lên...' })} {Math.round(uploadProgress)}%
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    {t({ en: 'Upload Media', vi: 'Tải Lên Phương Tiện' })}
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8 px-6">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'timeline' ? 'bg-church-red text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          {t({ en: 'Timeline', vi: 'Dòng Thời Gian' })}
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'gallery' ? 'bg-church-red text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          {t({ en: 'All Pictures', vi: 'Tất Cả Hình Ảnh' })}
        </button>
      </div>

      {/* Timeline Section */}
      {activeTab === 'timeline' && (
        <section className="relative w-full bg-[#0a0a0a] text-white min-h-[80vh] flex flex-col overflow-hidden">
          {sortedTimelineMedia.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              {t({ en: 'No timeline events yet.', vi: 'Chưa có sự kiện dòng thời gian nào.' })}
            </div>
          ) : (
            <>
              {/* Slides */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {sortedTimelineMedia.map((media, index) => {
                  const eventYear = media.date ? new Date(media.date).getFullYear() : media.year;
                  const eventDate = media.date ? new Date(media.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : '';
                  
                  return (
                    <div key={media.id} className="min-w-full h-full snap-center flex flex-col md:flex-row items-center justify-center p-6 md:p-20 gap-8 md:gap-16 relative">
                      {/* Background Year Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden">
                        <span className="text-[30vw] font-serif font-bold leading-none">{eventYear}</span>
                      </div>

                      {/* Media Side */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2 h-[40vh] md:h-[60vh] relative z-10 rounded-lg overflow-hidden shadow-2xl"
                      >
                        {media.type === 'video' ? (
                          <video src={media.url} className="w-full h-full object-cover" controls preload="metadata" />
                        ) : (
                          <img src={media.url} alt={media.description} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        )}
                      </motion.div>

                      {/* Text Side */}
                      <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full md:w-1/2 flex flex-col justify-center z-10"
                      >
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-church-red mb-2">
                          {eventYear}
                        </h2>
                        {eventDate && (
                          <p className="text-xl md:text-2xl text-slate-400 mb-6 font-medium tracking-wide uppercase">
                            {eventDate}
                          </p>
                        )}
                        {media.description && (
                          <p className="text-lg md:text-2xl leading-relaxed text-slate-200 mb-6">
                            {media.description}
                          </p>
                        )}
                        {media.author && (
                          <p className="text-sm text-slate-500 uppercase tracking-widest">
                            — {media.author}
                          </p>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Scrubber */}
              <div className="h-24 bg-black/80 backdrop-blur-md flex items-center px-8 relative border-t border-white/10">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/20 -translate-y-1/2" />
                <div className="flex items-center justify-between w-full max-w-6xl mx-auto relative z-10">
                  {sortedTimelineMedia.map((media, index) => {
                    const isActive = index === activeIndex;
                    const eventYear = media.date ? new Date(media.date).getFullYear() : media.year;
                    const isFirstOfYear = index === 0 || (
                      (media.date ? new Date(media.date).getFullYear() : media.year) !== 
                      (sortedTimelineMedia[index-1].date ? new Date(sortedTimelineMedia[index-1].date!).getFullYear() : sortedTimelineMedia[index-1].year)
                    );

                    return (
                      <div key={media.id} className="relative flex flex-col items-center group cursor-pointer" onClick={() => scrollToSlide(index)}>
                        {/* Year Label */}
                        <span className={`absolute -top-8 text-xs font-bold transition-all duration-300 ${isActive ? 'text-church-red opacity-100 scale-110' : isFirstOfYear ? 'text-white/50 opacity-100' : 'opacity-0 group-hover:opacity-100 text-white/50'}`}>
                          {eventYear}
                        </span>
                        
                        {/* Dot */}
                        <button
                          className={`rounded-full transition-all duration-300 ${isActive ? 'w-4 h-4 bg-church-red shadow-[0_0_15px_rgba(220,38,38,0.8)]' : 'w-2 h-2 bg-white/50 hover:bg-white hover:scale-150'}`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* Gallery Section */}
      {activeTab === 'gallery' && (
        <section className="py-8 px-6 max-w-7xl mx-auto min-h-[50vh]">
          {galleryMedia.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              {t({ en: 'No pictures uploaded yet.', vi: 'Chưa có hình ảnh nào được tải lên.' })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryMedia.map((media) => (
                <motion.div 
                  key={media.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md group border border-slate-100"
                >
                  <div className="aspect-square relative bg-slate-100 overflow-hidden">
                    {media.type === 'video' ? (
                      <>
                        <video 
                          src={media.url} 
                          className="w-full h-full object-cover"
                          controls
                          preload="metadata"
                        />
                        <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full text-white backdrop-blur-sm pointer-events-none">
                          <Video size={14} />
                        </div>
                      </>
                    ) : (
                      <>
                        <img 
                          src={media.url} 
                          alt={media.description || 'Gallery image'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full text-white backdrop-blur-sm pointer-events-none">
                          <ImageIcon size={14} />
                        </div>
                      </>
                    )}
                  </div>
                  {(media.description || media.author || media.year) && (
                    <div className="p-4">
                      {media.year && <p className="text-xs font-bold text-church-red mb-1">{media.year}</p>}
                      {media.description && <p className="text-sm text-slate-700 line-clamp-2 mb-2">{media.description}</p>}
                      {media.author && <p className="text-xs text-slate-400">{media.author}</p>}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Admin Login Link (Hidden unless scrolled to bottom or explicit) */}
      {!isAdmin && (
        <div className="py-8 text-center">
          <button 
            onClick={handleLogin}
            className="text-xs text-slate-300 hover:text-slate-500 transition-colors flex items-center justify-center gap-1 mx-auto"
          >
            <LogIn size={12} /> Admin Login
          </button>
        </div>
      )}
      
      <PageNavigation next={{ title: { en: 'Home', vi: 'Trang Chủ' }, path: '/' }} />
    </div>
  );
};
