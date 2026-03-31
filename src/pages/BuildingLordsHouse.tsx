import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mic, Square, Upload, Image as ImageIcon, Video, Trash2, HeartHandshake, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage, auth } from '../firebase';
import { PrayerWall } from '../components/PrayerWall';
import { RepentingCorner } from '../components/RepentingCorner';

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

interface Creation {
  id: string;
  category: 'testimonies' | 'poems' | 'songs' | 'prophetic';
  title: string;
  author: string;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  timestamp: Date;
  amenCount?: number;
}

const CreationCard = ({ creation, hasAmened, onAmen }: { creation: Creation, hasAmened: boolean, onAmen: (id: string) => void }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isLongContent = creation.content.length > 300 || creation.content.split('\n').length > 5;
  const displayContent = isExpanded 
    ? creation.content 
    : (isLongContent ? creation.content.slice(0, 300) + '...' : creation.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-50 flex flex-col gap-4 w-[85vw] md:w-[400px] h-full"
    >
      <div className="flex-1">
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">{creation.title}</h3>
        <p className="text-sm font-bold text-church-red mb-4">
          {t({ en: 'By', vi: 'Bởi' })} {creation.author} • {creation.timestamp.toLocaleDateString()}
        </p>
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{displayContent}</p>
        {isLongContent && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-church-red font-bold text-sm mt-2 hover:underline"
          >
            {isExpanded ? t({ en: 'Show Less', vi: 'Thu gọn' }) : t({ en: 'Read More', vi: 'Xem thêm' })}
          </button>
        )}
      </div>

      {creation.audioUrl && (
        <div className="mt-4 shrink-0">
          <audio controls className="w-full">
            <source src={creation.audioUrl} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {creation.imageUrl && (
        <div className="mt-4 shrink-0">
          <img src={creation.imageUrl} alt={creation.title} className="rounded-xl max-h-96 object-cover w-full" />
        </div>
      )}

      {creation.videoUrl && (
        <div className="mt-4 shrink-0">
          <video controls className="w-full rounded-xl max-h-96 bg-black">
            <source src={creation.videoUrl} />
            Your browser does not support the video element.
          </video>
        </div>
      )}

      <div className="mt-4 pt-4 flex items-center justify-end border-t border-slate-100 shrink-0">
        <button
          onClick={() => onAmen(creation.id)}
          className={cn(
            "flex items-center gap-2 transition-colors group",
            hasAmened ? "text-church-red" : "text-slate-500 hover:text-church-red"
          )}
        >
          <Heart className={cn(
            "w-5 h-5 transition-colors",
            hasAmened ? "fill-church-red text-church-red" : "group-hover:fill-church-red/20"
          )} />
          <span className="font-medium">{creation.amenCount || 0} Amen</span>
        </button>
      </div>
    </motion.div>
  );
};

const HorizontalSlider = ({ title, items, renderItem, emptyMessage }: { title: string, items: any[], renderItem: (item: any) => React.ReactNode, emptyMessage: string }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-200">
        <h2 className="text-3xl font-serif font-bold text-slate-900">
          {title}
        </h2>
        {items.length > 0 && (
          <div className="flex gap-2">
            <button onClick={scrollLeft} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <button onClick={scrollRight} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
      
      {items.length === 0 ? (
        <p className="text-slate-500 italic">{emptyMessage}</p>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {items.map(item => (
            <div key={item.id} className="snap-start shrink-0 flex items-stretch">
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export const BuildingLordsHouse: React.FC = () => {
  const { t } = useLanguage();
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [amenedCreations, setAmenedCreations] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('amenedCreations');
    if (stored) {
      try {
        setAmenedCreations(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error('Failed to parse amenedCreations from localStorage', e);
      }
    }
  }, []);

  // Form State
  const [category, setCategory] = useState<'testimonies' | 'poems' | 'songs' | 'prophetic'>('testimonies');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  
  // File State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'creations'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: new Date(doc.data().timestamp)
      })) as Creation[];
      setCreations(data);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'creations');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        setAudioFile(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 240) { // 4 minutes max
            stopRecording();
            return 240;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert(t({ en: 'Could not access microphone.', vi: 'Không thể truy cập micro.' }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        }, 
        (error) => {
          console.error("Upload error:", error);
          if (error.code === 'storage/unauthorized' || error.code === 'storage/unknown') {
            alert(t({ 
              en: 'Upload failed: Unauthorized or Storage not enabled. Please ensure Firebase Storage is enabled and rules are configured to allow public uploads in your Firebase Console.', 
              vi: 'Tải lên thất bại: Không có quyền hoặc Storage chưa bật. Vui lòng đảm bảo Firebase Storage đã được bật và cấu hình quy tắc cho phép tải lên công khai trong Firebase Console.' 
            }));
          }
          reject(error);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            console.error("Error getting download URL:", err);
            reject(err);
          }
        }
      );
    });
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert(t({ en: 'Please fill in title and content.', vi: 'Vui lòng điền tiêu đề và nội dung.' }));
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      let audioUrl = '';
      let imageUrl = '';
      let videoUrl = '';

      if ((category === 'songs' || category === 'poems') && audioFile) {
        audioUrl = await handleFileUpload(audioFile, `creations/audio/${Date.now()}_${audioFile.name}`);
      }

      if (category === 'testimonies') {
        if (imageFile) {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: false
          };
          const compressedFile = await imageCompression(imageFile, options);
          imageUrl = await handleFileUpload(compressedFile, `creations/images/${Date.now()}_${compressedFile.name}`);
        }
        if (videoFile) {
          videoUrl = await handleFileUpload(videoFile, `creations/videos/${Date.now()}_${videoFile.name}`);
        }
      }

      const creationData = {
        category,
        title: title.trim(),
        author: author.trim() || 'Anonymous',
        content: content.trim(),
        audioUrl,
        imageUrl,
        videoUrl,
        timestamp: Date.now(),
        amenCount: 0
      };

      await addDoc(collection(db, 'creations'), creationData);

      // Reset form
      setTitle('');
      setAuthor('');
      setContent('');
      setAudioFile(null);
      setImageFile(null);
      setVideoFile(null);
    } catch (error) {
      alert(t({ en: 'Error submitting. Please try again.', vi: 'Lỗi khi đăng. Vui lòng thử lại.' }));
      handleFirestoreError(error, OperationType.CREATE, 'creations');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleAmen = async (creationId: string) => {
    try {
      const creationRef = doc(db, 'creations', creationId);
      const hasAmened = amenedCreations.has(creationId);
      
      if (hasAmened) {
        await updateDoc(creationRef, {
          amenCount: increment(-1)
        });
        const newSet = new Set(amenedCreations);
        newSet.delete(creationId);
        setAmenedCreations(newSet);
        localStorage.setItem('amenedCreations', JSON.stringify(Array.from(newSet)));
      } else {
        await updateDoc(creationRef, {
          amenCount: increment(1)
        });
        const newSet = new Set(amenedCreations);
        newSet.add(creationId);
        setAmenedCreations(newSet);
        localStorage.setItem('amenedCreations', JSON.stringify(Array.from(newSet)));
      }
    } catch (error) {
      console.error("Error updating amen:", error);
      handleFirestoreError(error, OperationType.UPDATE, `creations/${creationId}`);
    }
  };

  const renderCreationItem = (creation: Creation) => (
    <CreationCard 
      key={creation.id} 
      creation={creation} 
      hasAmened={amenedCreations.has(creation.id)} 
      onAmen={handleAmen} 
    />
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <section className="pt-24 pb-12 px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-slate-200">
            <HeartHandshake size={14} className="text-church-red" />
            {t({ en: 'Community & Faith', vi: 'Cộng Đồng & Đức Tin' })}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-slate-900">
            {t({ en: 'United in Christ', vi: 'Hiệp Nhất Trong Đấng Christ' })}
          </h1>
          <div className="max-w-4xl mx-auto text-center mt-10 mb-4">
            <p className="font-serif text-3xl md:text-4xl italic text-slate-800 leading-relaxed">
              {t({
                en: '"Let this mind be in you which was also in Christ Jesus,"',
                vi: '"Hãy có đồng một tâm tình như Đấng Christ Jêsus đã có,"'
              })}
            </p>
            <span className="block mt-6 text-lg text-church-red font-semibold tracking-wide uppercase">
              {t({ en: '— Philippians 2:5 (NKJV)', vi: '— Phi-líp 2:5' })}
            </span>
          </div>
        </div>
      </section>

      {/* Prayer Wall and Repenting Corner */}
      <PrayerWall />
      <RepentingCorner />

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              {t({ en: 'Building the Lord\'s House Corner', vi: 'Góc Xây Dựng Nhà Chúa' })}
            </h2>
            <p className="text-slate-600 mt-4">
              {t({ en: 'Share your testimonies, poems, songs, and prophetic revelations.', vi: 'Chia sẻ lời chứng, bài thơ, bài hát và mạc khải tiên tri của bạn.' })}
            </p>
          </div>

        {/* Submission Form */}
        <div className="mb-16">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-church-red/10 max-w-3xl mx-auto">
            <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {t({ en: 'Category', vi: 'Thể Loại' })}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { id: 'testimonies', label: { en: 'Testimonies of Miracles', vi: 'Lời Chứng Về Phép Lạ' } },
                      { id: 'poems', label: { en: 'New Poems', vi: 'Bài Thơ Mới' } },
                      { id: 'songs', label: { en: 'New Songs', vi: 'Bài Hát Mới' } },
                      { id: 'prophetic', label: { en: 'Prophetic Revelations', vi: 'Mạc Khải Tiên Tri' } }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id as any)}
                        className={cn(
                          "px-4 py-3 rounded-xl text-sm font-bold transition-all border-2",
                          category === cat.id 
                            ? "border-church-red bg-church-red/5 text-church-red" 
                            : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                        )}
                      >
                        {t(cat.label)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t({ en: 'Title', vi: 'Tiêu Đề' })} *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl px-6 py-3 focus:ring-2 focus:ring-church-red outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t({ en: 'Author (Optional)', vi: 'Tác Giả (Tùy chọn)' })}
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl px-6 py-3 focus:ring-2 focus:ring-church-red outline-none"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {t({ en: 'Content', vi: 'Nội Dung' })} *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-40 bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-church-red outline-none resize-none"
                  />
                </div>

                {/* Category Specific Inputs */}
                {(category === 'songs' || category === 'poems') && (
                  <div className="mb-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-4">
                      {t({ en: 'Audio (Max 4 minutes)', vi: 'Âm Thanh (Tối đa 4 phút)' })}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="flex items-center gap-4">
                        {!isRecording ? (
                          <button
                            onClick={startRecording}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold hover:bg-red-200 transition-colors"
                          >
                            <Mic size={18} />
                            {t({ en: 'Record', vi: 'Ghi Âm' })}
                          </button>
                        ) : (
                          <button
                            onClick={stopRecording}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors animate-pulse"
                          >
                            <Square size={18} />
                            {t({ en: 'Stop', vi: 'Dừng' })} ({formatTime(recordingTime)})
                          </button>
                        )}
                      </div>
                      <span className="text-slate-400 text-sm font-medium">{t({ en: 'OR', vi: 'HOẶC' })}</span>
                      <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-50 transition-colors cursor-pointer">
                        <Upload size={18} />
                        {t({ en: 'Upload Audio', vi: 'Tải Lên Âm Thanh' })}
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setAudioFile(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {audioFile && (
                      <div className="mt-4 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-sm text-slate-600 truncate max-w-[200px]">{audioFile.name}</span>
                        <button onClick={() => setAudioFile(null)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {category === 'testimonies' && (
                  <div className="mb-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-4">
                      {t({ en: 'Media (Optional)', vi: 'Đa Phương Tiện (Tùy chọn)' })}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex-1 flex flex-col items-center justify-center gap-2 p-6 bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-church-red hover:bg-church-red/5 transition-colors cursor-pointer">
                        <ImageIcon size={24} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-600">
                          {t({ en: 'Upload Picture', vi: 'Tải Lên Hình Ảnh' })}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                          }}
                        />
                      </label>
                      <label className="flex-1 flex flex-col items-center justify-center gap-2 p-6 bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-church-red hover:bg-church-red/5 transition-colors cursor-pointer">
                        <Video size={24} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-600">
                          {t({ en: 'Upload Video', vi: 'Tải Lên Video' })}
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) setVideoFile(e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                    {(imageFile || videoFile) && (
                      <div className="mt-4 flex flex-col gap-2">
                        {imageFile && (
                          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                            <span className="text-sm text-slate-600 truncate">🖼️ {imageFile.name}</span>
                            <button onClick={() => setImageFile(null)} className="text-red-500 hover:text-red-700">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                        {videoFile && (
                          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                            <span className="text-sm text-slate-600 truncate">🎥 {videoFile.name}</span>
                            <button onClick={() => setVideoFile(null)} className="text-red-500 hover:text-red-700">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-church-red text-white rounded-full font-bold hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {isSubmitting ? (uploadProgress > 0 && uploadProgress < 100 ? `${t({ en: 'Uploading', vi: 'Đang tải lên' })} ${uploadProgress}%` : t({ en: 'Publishing...', vi: 'Đang đăng...' })) : t({ en: 'Publish', vi: 'Đang Bài' })}
                  </button>
                </div>
              </div>
            </div>

        {/* Display Sections */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-church-red border-t-transparent rounded-full mx-auto mb-4" />
          </div>
        ) : (
          <div className="space-y-16">
            <HorizontalSlider
              title={t({ en: 'Testimonies of God\'s Miracles', vi: 'Lời Chứng Về Phép Lạ Của Chúa' })}
              items={creations.filter(c => c.category === 'testimonies')}
              renderItem={renderCreationItem}
              emptyMessage={t({ en: 'No testimonies yet.', vi: 'Chưa có lời chứng nào.' })}
            />

            <HorizontalSlider
              title={t({ en: 'New Poems', vi: 'Bài Thơ Mới' })}
              items={creations.filter(c => c.category === 'poems')}
              renderItem={renderCreationItem}
              emptyMessage={t({ en: 'No poems yet.', vi: 'Chưa có bài thơ nào.' })}
            />

            <HorizontalSlider
              title={t({ en: 'New Songs', vi: 'Bài Hát Mới' })}
              items={creations.filter(c => c.category === 'songs')}
              renderItem={renderCreationItem}
              emptyMessage={t({ en: 'No songs yet.', vi: 'Chưa có bài hát nào.' })}
            />

            <HorizontalSlider
              title={t({ en: 'Prophetic Revelations from the Lord', vi: 'Mạc Khải Tiên Tri Chúa Bày Tỏ' })}
              items={creations.filter(c => c.category === 'prophetic')}
              renderItem={renderCreationItem}
              emptyMessage={t({ en: 'No revelations yet.', vi: 'Chưa có mạc khải nào.' })}
            />
          </div>
        )}
        </div>
      </section>
    </div>
  );
};
