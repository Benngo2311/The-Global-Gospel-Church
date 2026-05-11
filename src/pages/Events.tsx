import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, ExternalLink, Globe, Upload, Loader2, LogIn, LogOut, FileImage, Plus, Edit, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SEO } from '../components/SEO';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { db, storage, auth } from '../firebase';
import { STATIC_EVENTS } from '../constants/events';

export const Events: React.FC = () => {
  const { t } = useLanguage();
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Admin Auth State
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loginError, setLoginError] = useState('');

  // Form State
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formZoomLink, setFormZoomLink] = useState('');
  const [formFile, setFormFile] = useState<File | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Dynamic Events State
  const [dynamicEvents, setDynamicEvents] = useState<any[]>([]);

  // UI state
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Listen for Auth status
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === 'khoatruy123@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    // Listen for events from Firestore
    const q = query(collection(db, 'events'), orderBy('timestamp', 'desc'));
    const unsubscribeDb = onSnapshot(q, (snapshot) => {
      const dbEvents: any[] = [];
      snapshot.forEach((doc) => {
        dbEvents.push({ id: doc.id, ...doc.data() });
      });
      setDynamicEvents(dbEvents);
    }, (err) => {
      console.error("Error fetching events:", err);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDb();
    };
  }, []);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try getting location from browser
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
              const data = await response.json();
              if (data.city || data.locality) {
                setDetectedLocation(`${data.city || data.locality}, ${data.countryName}`);
              }
            } catch (e) {
              console.error("Reverse geocoding failed", e);
            }
          });
        }
      } catch (error) {
        console.error("Location detection failed", error);
      }
    };

    detectLocation();
  }, []);

  // STATIC_EVENTS imported from constants
  const allEvents = [...dynamicEvents, ...STATIC_EVENTS];

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

  const resetForm = () => {
    setFormTitle('');
    setFormDesc('');
    setFormStartDate('');
    setFormEndDate('');
    setFormLocation('');
    setFormZoomLink('');
    setFormFile(null);
    setEditingId(null);
    setDeletingId(null);
    setError('');
    const fileInput = document.getElementById('poster-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const formatForInput = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleEdit = (ev: any) => {
    setEditingId(ev.id);
    setFormTitle(typeof ev.title === 'string' ? ev.title : (ev.title?.en || ''));
    setFormDesc(typeof ev.desc === 'string' ? ev.desc : (ev.desc?.en || ''));
    setFormStartDate(formatForInput(ev.startDate));
    setFormEndDate(formatForInput(ev.endDate));
    setFormLocation(ev.location || '');
    setFormZoomLink(ev.zoomLink || '');
    setShowAdminForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      setDeletingId(null);
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError(t({ en: 'File is too large. Max size is 10MB.', vi: 'Tệp quá lớn. Kích thước tối đa là 10MB.' }));
        setFormFile(null);
        return;
      }
      setFormFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formTitle || !formStartDate) {
      setError(t({ en: 'Title and Start Date/Time are required.', vi: 'Tiêu đề và Thời gian bắt đầu là bắt buộc.' }));
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      let downloadURL = null;
      
      // Upload poster if available
      if (formFile) {
        const storageRef = ref(storage, `eventPosters/${Date.now()}_${formFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, formFile);
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (err) => reject(err),
            async () => {
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Add to firestore
      const eventData: any = {
        title: { en: formTitle, vi: formTitle },
        desc: { en: formDesc, vi: formDesc },
        startDate: new Date(formStartDate).toISOString(),
        endDate: formEndDate ? new Date(formEndDate).toISOString() : new Date(formStartDate).toISOString(),
        location: formLocation || 'TBA',
        zoomLink: formZoomLink || null
      };

      if (downloadURL !== null) {
        eventData.posterUrl = downloadURL;
      }

      if (editingId) {
        await updateDoc(doc(db, 'events', editingId), eventData);
      } else {
        await addDoc(collection(db, 'events'), { ...eventData, timestamp: Date.now() });
      }
      
      // Reset form
      resetForm();
      setShowAdminForm(false);
      setIsUploading(false);
      setUploadProgress(0);

    } catch (err) {
      console.error("Error saving event:", err);
      setError(t({ en: 'An error occurred. Please try again.', vi: 'Đã xảy ra lỗi. Vui lòng thử lại.' }));
      setIsUploading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-church-cream min-h-screen">
      <SEO 
        title={{ en: 'Upcoming Events', vi: 'Sự Kiện Sắp Tới' }} 
        description={{ en: 'Stay connected with our global community through these upcoming gatherings and conferences.', vi: 'Kết nối với cộng đồng toàn cầu của chúng tôi thông qua các buổi họp mặt và hội nghị sắp tới.' }}
        url="https://tggpc.org/events"
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-church-red text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
          >
            {t({ en: 'JOIN OUR GLOBAL COMMUNITY', vi: 'THAM GIA CỘNG ĐỒNG TOÀN CẦU CỦA CHÚNG TÔI' })}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 text-slate-900"
          >
            {t({ en: 'Upcoming Events', vi: 'Sự Kiện Sắp Tới' })}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            {t({ 
              en: 'Stay connected with our global community through these upcoming gatherings and conferences.', 
              vi: 'Kết nối với cộng đồng toàn cầu của chúng tôi thông qua các buổi họp mặt và hội nghị sắp tới.' 
            })}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 inline-flex flex-col items-center gap-3 px-8 py-4 bg-white rounded-[2rem] shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3 text-church-red">
              <Globe size={20} className="animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-widest">
                {t({ en: 'Location Detected', vi: 'Đã Nhận Diện Vị Trí' })}
              </span>
            </div>
            <div className="text-slate-900 font-serif font-bold text-lg">
              {detectedLocation || t({ en: 'Detecting...', vi: 'Đang nhận diện...' })}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Clock size={14} />
              {t({ en: 'Adjusted to:', vi: 'Đã điều chỉnh theo:' })} {userTimezone}
            </div>
          </motion.div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-12 max-w-3xl mx-auto">
            {!showAdminForm ? (
              <div className="flex justify-center">
                <button 
                  onClick={() => setShowAdminForm(true)}
                  className="px-8 py-4 bg-church-red text-white flex items-center gap-2 rounded-full font-bold shadow-lg hover:-translate-y-1 transition-all"
                >
                  <Plus size={20} />
                  {t({ en: 'Post New Announcement / Event', vi: 'Đăng Thông Báo / Sự Kiện Mới' })}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative">
                <button 
                  onClick={() => {
                    setShowAdminForm(false);
                    resetForm();
                  }}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    {editingId ? t({ en: 'Edit Event/Announcement', vi: 'Sửa Sự Kiện/Thông Báo' }) : t({ en: 'Create Event/Announcement', vi: 'Tạo Sự Kiện/Thông Báo' })}
                  </h2>
                  <button onClick={handleLogout} className="mr-8 text-sm text-slate-500 hover:text-church-red flex items-center gap-1">
                    <LogOut size={16} /> Logout
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red outline-none min-h-[120px]"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        End Time (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red outline-none"
                      />
                    </div>
                  </div>

                  {/* Location & Zoom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Location / Address
                      </label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red outline-none"
                        placeholder="e.g., 123 Church St / Online"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Zoom Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={formZoomLink}
                        onChange={(e) => setFormZoomLink(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-church-red outline-none"
                        placeholder="https://zoom.us/j/..."
                      />
                    </div>
                  </div>

                  {/* Poster Upload */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Picture / Poster (Optional)
                    </label>
                    <label htmlFor="poster-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center py-4">
                        <FileImage className="w-8 h-8 mb-2 text-slate-400" />
                        <p className="text-xs text-slate-500">
                          {formFile ? formFile.name : t({ en: 'Click to upload image (Max 10MB)', vi: 'Nhấn để tải ảnh lên (Tối đa 10MB)' })}
                        </p>
                      </div>
                      <input 
                        id="poster-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUploading || !formTitle || !formStartDate}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-church-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Uploading... {Math.round(uploadProgress)}%
                      </>
                    ) : (
                      editingId ? 'Update Event' : 'Post Event'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        <div className="space-y-12">
          {allEvents.map((event, i) => (
            <motion.div
              key={event.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all relative"
            >
              {isAdmin && event.id && (
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <button 
                    onClick={() => handleEdit(event)}
                    className="w-10 h-10 bg-white shadow-md border border-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-church-red hover:text-white hover:border-church-red transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  {deletingId === event.id ? (
                    <div className="flex bg-white shadow-md border border-slate-100 rounded-full overflow-hidden h-10">
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="px-4 text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => setDeletingId(null)}
                        className="px-4 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setDeletingId(event.id)}
                      className="w-10 h-10 bg-white shadow-md border border-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}
              <div className="flex flex-col lg:flex-row">
                {/* Date Sidebar */}
                <div className="lg:w-64 bg-slate-900 p-8 flex flex-col items-center justify-center text-white shrink-0">
                  <CalendarIcon size={40} className="mb-4 text-church-red" />
                  <div className="text-center">
                    <div className="text-3xl font-serif font-bold mb-1">
                      {formatDate(event.startDate)}
                    </div>
                    {event.startDate !== event.endDate && event.endDate && !event.endDate.startsWith(event.startDate.split('T')[0]) && (
                      <>
                        <div className="text-church-red font-bold text-xs uppercase tracking-widest my-2">to</div>
                        <div className="text-3xl font-serif font-bold">
                          {formatDate(event.endDate)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow p-8 md:p-12">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div className="flex-grow">
                      <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 group-hover:text-church-red transition-colors leading-tight">
                        {t(event.title)}
                      </h3>
                      <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-church-red" />
                          {formatTime(event.startDate)} {event.endDate && event.startDate !== event.endDate && `- ${formatTime(event.endDate)}`}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-church-red" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 shrink-0">
                      {(event.zoomLink || event.zoomId) && (
                        <>
                          <a 
                            href={event.zoomLink || `https://zoom.us/j/${event.zoomId?.replace(/\s/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-church-red text-white rounded-2xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-lg hover:-translate-y-1"
                          >
                            {t({ en: 'Join Zoom', vi: 'Tham Gia Zoom' })}
                            <ExternalLink size={18} />
                          </a>
                          {event.zoomId && (
                            <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              ID: {event.zoomId} | Pass: {event.zoomPass}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-10">
                    <div className="md:col-span-2">
                      {event.posterUrl && (
                        <div className="mb-8">
                          <img 
                            src={event.posterUrl} 
                            alt={t(event.title)} 
                            className="w-full max-h-[500px] object-cover rounded-2xl shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      {event.desc && (
                        <div className="relative">
                          <AnimatePresence initial={false}>
                            <motion.div
                              key="content"
                              initial="collapsed"
                              animate={expandedEvents[event.id] ? "expanded" : "collapsed"}
                              exit="collapsed"
                              variants={{
                                expanded: { height: "auto", opacity: 1 },
                                collapsed: { height: 80, opacity: 0.8 }
                              }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                                {t(event.desc)}
                              </p>
                            </motion.div>
                          </AnimatePresence>
                          {!expandedEvents[event.id] && (
                            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                          )}
                          <button 
                            onClick={() => toggleExpand(event.id)} 
                            className="text-church-red mt-2 text-sm font-bold flex items-center gap-1 hover:text-red-800 transition-colors"
                          >
                            {expandedEvents[event.id] ? (
                              <>{t({ en: 'Show Less', vi: 'Thu Gọn' })} <ChevronUp size={16} /></>
                            ) : (
                              <>{t({ en: 'Read More', vi: 'Đọc Thêm' })} <ChevronDown size={16} /></>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {event.contact && (
                      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 h-fit">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                          {t({ en: 'Contact Info', vi: 'Thông Tin Liên Hệ' })}
                        </h4>
                        <div className="space-y-4">
                          {event.contact.phone && (
                            <div className="flex items-center gap-3 text-slate-700">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                <span className="text-church-red text-xs">📞</span>
                              </div>
                              <span className="font-medium">{event.contact.phone}</span>
                            </div>
                          )}
                          {event.contact.email && (
                            <div className="flex items-center gap-3 text-slate-700">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                <span className="text-church-red text-xs">✉️</span>
                              </div>
                              <span className="font-medium text-sm break-all">{event.contact.email}</span>
                            </div>
                          )}
                          {event.contact.facebook && (
                            <div className="flex items-center gap-3 text-slate-700">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                <span className="text-church-red text-xs">👤</span>
                              </div>
                              <span className="font-medium">{event.contact.facebook}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin Login Link (Hidden unless scrolled to bottom or explicit) */}
        {!isAdmin && (
          <div className="mt-20 py-8 text-center flex flex-col items-center">
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
      </div>
    </div>
  );
};
