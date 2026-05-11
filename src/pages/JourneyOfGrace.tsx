import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Upload, Image as ImageIcon, Video, Calendar as CalendarIcon, Loader2, LogIn, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
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
  category?: string;
  timestamp: number;
  author?: string;
}

const YearCarousel = ({ year, items }: { year: number, items: JourneyMedia[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const currentItem = items[currentIndex];
  const eventDate = currentItem.date ? new Date(currentItem.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : '';

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };
  
  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="min-w-full h-full snap-center flex flex-col md:flex-row items-center justify-center p-6 md:p-20 gap-8 md:gap-16 relative">
      {/* Background Year Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden">
        <span className="text-[30vw] font-serif font-bold leading-none">{year}</span>
      </div>

      {/* Media Side */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 h-[40vh] md:h-[60vh] relative z-10 rounded-lg overflow-hidden shadow-2xl bg-[#111]"
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentItem.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full absolute inset-0 flex items-center justify-center"
          >
            {currentItem.type === 'video' ? (
              <video src={currentItem.url} className="w-full h-full object-contain" controls preload="metadata" />
            ) : (
              <img src={currentItem.url} alt={currentItem.description} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            )}
          </motion.div>
        </AnimatePresence>

        {items.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 z-20 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 z-20 transition-colors">
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {items.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-church-red' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
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
          {year}
        </h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="min-h-[150px]"
          >
            {eventDate && (
              <p className="text-xl md:text-2xl text-slate-400 mb-6 font-medium tracking-wide uppercase">
                {eventDate}
              </p>
            )}
            {currentItem.description && (
              <p className="text-lg md:text-2xl leading-relaxed text-slate-200 mb-6">
                {currentItem.description}
              </p>
            )}
            {currentItem.author && (
              <p className="text-sm text-slate-500 uppercase tracking-widest">
                — {currentItem.author}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
        
        {items.length > 1 && (
          <p className="text-xs text-slate-600 mt-8 uppercase tracking-widest">
            {currentIndex + 1} / {items.length}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export const JourneyOfGrace: React.FC = () => {
  const { t } = useLanguage();
  const [mediaList, setMediaList] = useState<JourneyMedia[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  
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
  const [category, setCategory] = useState('');

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
    setLoginError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code !== 'auth/cancelled-popup-request' && err.code !== 'auth/popup-closed-by-user') {
        console.error("Login error:", err);
        setLoginError(err.message || "Failed to login. Try opening the app in a new tab.");
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
            ...(author ? { author } : {}),
            ...(category ? { category: category.trim() } : {})
          };

          await addDoc(collection(db, 'journeyMedia'), newMedia);
          
          setFile(null);
          setDescription('');
          setAuthor('');
          setCategory('');
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

  // Sort all timeline media first
  const sortedTimelineMedia = [...timelineMedia].sort((a, b) => {
    if (a.date && b.date) return new Date(a.date).getTime() - new Date(b.date).getTime();
    return a.timestamp - b.timestamp;
  });

  // Then group by year
  const timelineByYear = sortedTimelineMedia.reduce((acc, media) => {
    const y = media.date ? new Date(media.date).getFullYear() : (media.year || new Date(media.timestamp).getFullYear());
    if (!acc[y]) acc[y] = [];
    acc[y].push(media);
    return acc;
  }, {} as Record<number, JourneyMedia[]>);

  const sortedTimelineYears = Object.keys(timelineByYear).map(Number).sort((a, b) => a - b);

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
                  {t({ en: 'Category (Optional)', vi: 'Danh Mục (Tùy chọn)' })}
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  list="categories-list"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red focus:border-transparent outline-none mb-6"
                  placeholder={t({ en: 'e.g., Sunday Service, Retreat, Youth...', vi: 'VD: Lễ Chúa Nhật, Trại Hè, Giới Trẻ...' })}
                  disabled={isUploading}
                />
                <datalist id="categories-list">
                  {Array.from(new Set(mediaList.map(m => m.category).filter(Boolean) as string[])).sort().map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
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
          {sortedTimelineYears.length === 0 ? (
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
                {sortedTimelineYears.map((year) => (
                  <YearCarousel key={year} year={year} items={timelineByYear[year]} />
                ))}
              </div>

              {/* Scrubber */}
              <div className="h-24 bg-black/80 backdrop-blur-md flex items-center px-8 relative border-t border-white/10">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/20 -translate-y-1/2" />
                <div className="flex items-center justify-between w-full max-w-6xl mx-auto relative z-10">
                  {sortedTimelineYears.map((year, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <div key={year} className="relative flex flex-col items-center group cursor-pointer p-2" onClick={() => scrollToSlide(index)}>
                        {/* Year Label */}
                        <span className={`absolute -top-8 text-xs font-bold transition-all duration-300 ${isActive ? 'text-church-red opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100 text-white/50'}`}>
                          {year}
                        </span>
                        
                        {/* Dot */}
                        <div className="p-2 flex items-center justify-center">
                          <button
                            className={`rounded-full transition-all duration-300 ${isActive ? 'w-5 h-5 bg-church-red shadow-[0_0_15px_rgba(220,38,38,0.8)]' : 'w-3 h-3 bg-white/50 group-hover:bg-white group-hover:scale-125'}`}
                            aria-label={`Go to year ${year}`}
                          />
                        </div>
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
            <div className="space-y-16">
              {Object.entries(
                galleryMedia.reduce((acc, media) => {
                  const cat = media.category || 'Uncategorized';
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(media);
                  return acc;
                }, {} as Record<string, JourneyMedia[]>)
              )
              .sort(([catA], [catB]) => {
                if (catA === 'Uncategorized') return 1;
                if (catB === 'Uncategorized') return -1;
                return catA.localeCompare(catB);
              })
              .map(([cat, items]) => (
                <div key={cat}>
                  <h3 className="text-3xl font-serif font-bold text-slate-800 mb-8 border-b border-slate-200 pb-4">
                    {cat === 'Uncategorized' ? t({ en: 'Other', vi: 'Khác' }) : cat}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((media) => (
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
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Admin Login Link (Hidden unless scrolled to bottom or explicit) */}
      {!isAdmin && (
        <div className="py-8 text-center flex flex-col items-center">
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm max-w-md">
              {loginError}
              <p className="mt-1 text-xs">Note: If you are in the preview, try opening the app in a new tab (top right icon) to allow Google Login.</p>
            </div>
          )}
          <button 
            onClick={handleLogin}
            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <LogIn size={16} /> Admin Login
          </button>
        </div>
      )}
      
      <PageNavigation next={{ title: { en: 'Home', vi: 'Trang Chủ' }, path: '/' }} />
    </div>
  );
};
