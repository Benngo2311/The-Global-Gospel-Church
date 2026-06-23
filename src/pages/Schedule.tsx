import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, serverTimestamp, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SEO } from '../components/SEO';
import { Globe, ChevronLeft, ChevronRight, LogIn, UserCircle, LogOut, Calendar as CalendarIcon, Trash2, Plus, X, Edit2, Printer } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong' },
  { value: 'Europe/Prague', label: 'Prague' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'America/Chicago', label: 'Texas / Chicago' },
  { value: 'America/Los_Angeles', label: 'California' },
  { value: 'America/Phoenix', label: 'Arizona' },
  { value: 'America/New_York', label: 'Florida / DC' },
  { value: 'Asia/Seoul', label: 'Seoul' },
  { value: 'Australia/Sydney', label: 'Sydney' },
  { value: 'UTC', label: 'UTC' }
].filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);

export const getTimeZoneOffsetMs = (timeZone: string, date: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', { 
    timeZone, timeZoneName: 'shortOffset'
  }).formatToParts(date);
  const offsetPart = parts.find(p => p.type === 'timeZoneName')?.value;
  if (!offsetPart || offsetPart === 'GMT') return 0;
  const match = offsetPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  return sign * (hours * 3600 * 1000 + minutes * 60 * 1000);
};

const getZoneMidnightUTC = (date: Date, timeZone: string) => {
  const dateStr = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }).format(date);
  const [m, d, y] = dateStr.split('/');
  const offsetMs = getTimeZoneOffsetMs(timeZone, date);
  return Date.UTC(Number(y), Number(m) - 1, Number(d)) - offsetMs;
};

const getZoneMondayZeroUTC = (date: Date, timeZone: string) => {
  const dateStr = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(date);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = days.indexOf(dateStr);
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const midnightUTC = getZoneMidnightUTC(date, timeZone);
  return midnightUTC + (diffToMonday * 24 * 3600 * 1000);
};

export const Schedule: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser, userProfile, isAdmin } = useAuth();
  
  const [isTempAdmin, setIsTempAdmin] = useState(false);
  const effectiveIsAdmin = isAdmin || isTempAdmin;
  
  const [schedules, setSchedules] = useState<any[]>([]);
  const [offsetWeeks, setOffsetWeeks] = useState(0);
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[0].value);
  const [use24h, setUse24h] = useState(false);
  
  // Book Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBooking, setNewBooking] = useState({ 
    name: '', 
    selectedDays: [] as string[], // array of "YYYY-MM-DD" in selected timezone
    hour: 12, 
    minute: 0, 
    ampm: 'PM', 
    durationHours: 1 
  });
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [calendars, setCalendars] = useState<any[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('default');
  const [showAddCalendarForm, setShowAddCalendarForm] = useState(false);
  const [editingCalendarId, setEditingCalendarId] = useState<string | null>(null);
  const [newCalendar, setNewCalendar] = useState({ 
    name: '', 
    timezone: TIMEZONES[0].value,
    description: '',
    zoomId: '',
    zoomPassword: ''
  });

  useEffect(() => {
    const unsubSchedules = onSnapshot(query(collection(db, 'worshipSchedule')), (snap) => {
      setSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    const unsubCalendars = onSnapshot(query(collection(db, 'worshipCalendars')), (snap) => {
      const cals = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCalendars(cals);
    });

    return () => {
      unsubSchedules();
      unsubCalendars();
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
    await signOut(auth);
  };

  const currentSpaceTz = calendars.find(c => c.id === selectedCalendarId)?.timezone || 'Asia/Ho_Chi_Minh';

  const currentSpaceTzLabel = TIMEZONES.find(t => t.value === currentSpaceTz)?.label || currentSpaceTz;

  const filteredSchedules = schedules.filter(s => {
    if (selectedCalendarId === 'default') {
      return !s.calendarId || s.calendarId === 'default';
    }
    return s.calendarId === selectedCalendarId;
  });

  // 1. Calculate the current week in the Selected Calendar Timezone
  const now = new Date();
  const currentViewMondayUTC = getZoneMondayZeroUTC(now, currentSpaceTz) + offsetWeeks * 7 * 24 * 3600 * 1000;
  
  const weekDaysUTC = Array.from({length: 7}).map((_, i) => currentViewMondayUTC + i * 24 * 3600 * 1000);
  
  const displayDates = weekDaysUTC.map(ts => {
    return new Intl.DateTimeFormat('en-US', { timeZone: currentSpaceTz, weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(ts));
  });

  const displayWeekLabel = `${displayDates[0]} - ${displayDates[6]}`;

  // Form helpers
  // Generate date options for the booking form explicitly locked to Timezone for uniform scheduling
  const formDateOptions = weekDaysUTC.map(ts => {
    const dt = new Date(ts + 12*3600*1000); // sample midday
    const localDateStr = new Intl.DateTimeFormat('en-US', { timeZone: currentSpaceTz, year: 'numeric', month: 'numeric', day: 'numeric' }).format(dt);
    const [m, d, y] = localDateStr.split('/');
    const dateKey = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    const displayStr = new Intl.DateTimeFormat('en-US', { timeZone: currentSpaceTz, weekday: 'long', month: 'short', day: 'numeric' }).format(dt);
    return { key: dateKey, label: displayStr };
  });

  const getLocalTimeStr = (ts: number, tz: string) => {
    return new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: !use24h }).format(new Date(ts)).toLowerCase();
  };

  const openFormForNewBooking = () => {
    setEditingScheduleId(null);
    setNewBooking({
      name: '',
      selectedDays: [formDateOptions[0].key],
      hour: 12,
      minute: 0,
      ampm: 'PM',
      durationHours: 1
    });
    setShowAddForm(true);
  };

  const openEditForm = (session: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const date = new Date(session.startTimeUTC);
    const tz = session.timezone || selectedTimezone;
    
    // Get formatted hour and minute in VIETNAM timezone for the form
    const hourStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour: 'numeric', hourCycle: 'h23' }).format(date);
    const minuteStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', minute: 'numeric' }).format(date);
    
    let editHour = Number(hourStr);
    let editMinute = Number(minuteStr) || 0;

    let ampm = 'AM';
    if (!use24h) {
      if (editHour >= 12) {
        ampm = 'PM';
        if (editHour > 12) editHour -= 12;
      } else {
         if (editHour === 0) editHour = 12;
      }
    }

    const localDateStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: 'numeric', day: 'numeric' }).format(date);
    const [m, d, y] = localDateStr.split('/');
    const dateKey = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;

    setSelectedTimezone(tz);

    setNewBooking({
      name: session.userName || '',
      selectedDays: [dateKey],
      hour: editHour,
      minute: editMinute,
      ampm: ampm,
      durationHours: session.durationHours || 1
    });
    setEditingScheduleId(session.id);
    setShowAddForm(true);
  };

  const deleteSchedule = (scheduleId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeletingId(scheduleId);
  };

  const parseBookingDateKey = (dateKey: string, hour: number, minute: number, ampm: string, use24: boolean, tz: string) => {
    const [y, m, d] = dateKey.split('-');
    
    let hh = hour;
    if (!use24) {
      if (ampm === 'PM' && hh !== 12) hh += 12;
      if (ampm === 'AM' && hh === 12) hh = 0;
    }

    const testDate = new Date();
    const offsetMs = getTimeZoneOffsetMs(tz, testDate);
    
    return Date.UTC(Number(y), Number(m) - 1, Number(d), hh, minute, 0) - offsetMs;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile) return;
    if (newBooking.selectedDays.length === 0) {
      alert(t({ en: 'Please select at least one day.', vi: 'Vui lòng chọn ít nhất một ngày.' }));
      return;
    }

    const worshipperName = newBooking.name.trim() !== '' ? newBooking.name : userProfile.displayName;

    if (editingScheduleId) {
      // If editing, we ignore multiple days and only update the first selected one, or we could delete and recreate.
      // Assuming editing just updates the single document.
      const startTimeUTC = parseBookingDateKey(newBooking.selectedDays[0], newBooking.hour, newBooking.minute, newBooking.ampm, use24h, currentSpaceTz);
      
      await updateDoc(doc(db, 'worshipSchedule', editingScheduleId), {
        userName: worshipperName,
        startTimeUTC,
        durationHours: newBooking.durationHours,
        timezone: selectedTimezone,
        calendarId: selectedCalendarId,
      });
    } else {
      // create multiple entries for each day
      for (const dateKey of newBooking.selectedDays) {
        const startTimeUTC = parseBookingDateKey(dateKey, newBooking.hour, newBooking.minute, newBooking.ampm, use24h, currentSpaceTz);
        
        await addDoc(collection(db, 'worshipSchedule'), {
          userId: currentUser.uid,
          userName: worshipperName,
          startTimeUTC,
          durationHours: newBooking.durationHours,
          timezone: selectedTimezone,
          calendarId: selectedCalendarId,
          timestamp: serverTimestamp()
        });
      }
    }
    
    setShowAddForm(false);
  };

  const handleAddCalendarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const calName = newCalendar.name.trim() !== '' ? newCalendar.name : 'Untitled Space';
    
    if (editingCalendarId) {
      if (editingCalendarId === 'default') {
        await setDoc(doc(db, 'worshipCalendars', 'default'), {
          name: calName,
          timezone: newCalendar.timezone,
          description: newCalendar.description,
          zoomId: newCalendar.zoomId,
          zoomPassword: newCalendar.zoomPassword,
          createdBy: currentUser.uid,
          timestamp: serverTimestamp()
        }, { merge: true });
      } else {
        await updateDoc(doc(db, 'worshipCalendars', editingCalendarId), {
          name: calName,
          timezone: newCalendar.timezone,
          description: newCalendar.description,
          zoomId: newCalendar.zoomId,
          zoomPassword: newCalendar.zoomPassword,
        });
      }
      setSelectedCalendarId(editingCalendarId);
    } else {
      const docRef = await addDoc(collection(db, 'worshipCalendars'), {
        name: calName,
        timezone: newCalendar.timezone,
        description: newCalendar.description,
        zoomId: newCalendar.zoomId,
        zoomPassword: newCalendar.zoomPassword,
        createdBy: currentUser.uid,
        timestamp: serverTimestamp()
      });
      setSelectedCalendarId(docRef.id);
    }
    
    setShowAddCalendarForm(false);
    setEditingCalendarId(null);
    setNewCalendar({ name: '', timezone: TIMEZONES[0].value, description: '', zoomId: '', zoomPassword: '' });
  };

  const deleteCalendar = async (id: string) => {
    if (confirm(t({ en: 'Are you sure you want to delete this schedule?', vi: 'Bạn có chắc chắn muốn xóa lịch này?' }))) {
      await deleteDoc(doc(db, 'worshipCalendars', id));
      if (selectedCalendarId === id) {
        setSelectedCalendarId('default');
      }
    }
  };

  const openFormForNewCalendar = () => {
    setEditingCalendarId(null);
    setNewCalendar({ name: '', timezone: TIMEZONES[0].value, description: '', zoomId: '', zoomPassword: '' });
    setShowAddCalendarForm(true);
  };

  const openFormForEditCalendar = () => {
    if (selectedCalendarId === 'default') {
      const cal = calendars.find(c => c.id === 'default');
      setEditingCalendarId('default');
      setNewCalendar({ 
        name: cal?.name || 'Main Space', 
        timezone: cal?.timezone || 'Asia/Ho_Chi_Minh',
        description: cal?.description || '',
        zoomId: cal?.zoomId || '',
        zoomPassword: cal?.zoomPassword || ''
      });
      setShowAddCalendarForm(true);
    } else {
      const cal = calendars.find(c => c.id === selectedCalendarId);
      if (cal) {
        setEditingCalendarId(cal.id);
        setNewCalendar({ 
          name: cal.name, 
          timezone: cal.timezone,
          description: cal.description || '',
          zoomId: cal.zoomId || '',
          zoomPassword: cal.zoomPassword || ''
        });
        setShowAddCalendarForm(true);
      }
    }
  };

  const toggleDaySelection = (key: string) => {
    if (newBooking.selectedDays.includes(key)) {
      setNewBooking({...newBooking, selectedDays: newBooking.selectedDays.filter(d => d !== key)});
    } else {
      setNewBooking({...newBooking, selectedDays: [...newBooking.selectedDays, key]});
    }
  };

  return (
    <>
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 flex flex-col print:hidden">
      <SEO 
        title={{ en: 'Global Worship Schedule', vi: 'Lịch Trình Thờ Phượng Toàn Cầu' }} 
        description={{ en: 'Join the global 24/7 continuous worship schedule.', vi: 'Tham gia lịch trình thờ phượng liên tục 24/7 toàn cầu.' }} 
      />
      
      <div className="max-w-[1400px] mx-auto px-6 w-full flex-1 flex flex-col">
        {/* Header & Auth */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
              {t({ en: 'Global Worship Schedule', vi: 'Lịch Trình Thờ Phượng Toàn Cầu' })}
            </h1>
            <p className="text-slate-500 flex items-center gap-2">
              <Globe size={16} /> 
              {t({ en: `View and register your worship sessions. (Currently showing ${currentSpaceTzLabel} Time)`, vi: `Xem và đăng ký lịch thờ phượng. (Hiện đang hiển thị giờ ${currentSpaceTzLabel})` })}
            </p>
          </div>
          
          <div>
            {currentUser ? (
              <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <UserCircle size={18} className="text-green-600" />
                  {userProfile?.displayName}
                  {effectiveIsAdmin ? (
                    <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 uppercase">Admin</span>
                  ) : (
                    <button 
                      onClick={async () => {
                        const pwd = prompt(t({ en: 'Enter admin password:', vi: 'Nhập mật khẩu quản trị:' }));
                        if (pwd === import.meta.env.VITE_ADMIN_PASSWORD || pwd === 'tggpc2026') {
                          setIsTempAdmin(true);
                        } else if (pwd !== null) {
                          alert(t({ en: 'Incorrect password.', vi: 'Mật khẩu sai.' }));
                        }
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 uppercase border border-slate-200 text-slate-400 hover:text-church-red transition-colors"
                    >
                      Admin
                    </button>
                  )}
                </div>
                <button onClick={handleLogout} className="text-xs font-bold text-slate-500 hover:text-church-red flex items-center gap-1">
                  <LogOut size={14} /> {t({ en: 'Logout', vi: 'Đăng Xuất' })}
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-2 text-sm font-bold bg-slate-900 text-white rounded-xl px-6 py-2.5 hover:bg-church-red transition-colors">
                <LogIn size={16} /> {t({ en: 'Login to Book', vi: 'Đăng Nhập để Đặt Lịch' })}
              </button>
            )}
          </div>
        </div>

        {/* Calendar Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-2 border-b border-slate-200 pb-2">
          <button 
            onClick={() => setSelectedCalendarId('default')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${selectedCalendarId === 'default' ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            {calendars.find(c => c.id === 'default')?.name || t({ en: 'Main Space', vi: 'Không Gian Chính' })}
          </button>
          {calendars.filter(cal => cal.id !== 'default').map(cal => (
            <button 
              key={cal.id}
              onClick={() => setSelectedCalendarId(cal.id)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${selectedCalendarId === cal.id ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              {cal.name}
            </button>
          ))}
          {effectiveIsAdmin && (
            <button 
              onClick={openFormForNewCalendar}
              className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 rounded-lg flex items-center gap-1 border border-dashed border-slate-300 hover:border-slate-500 transition-colors"
            >
              <Plus size={14} /> {t({ en: 'Add Space', vi: 'Thêm Không Gian' })}
            </button>
          )}
          {effectiveIsAdmin && (
            <div className="flex gap-2 ml-4 border-l border-slate-200 pl-4 border-dashed">
              <button onClick={openFormForEditCalendar} className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 rounded-lg flex items-center gap-1 transition-colors">
                <Edit2 size={14} /> {t({ en: 'Edit Space', vi: 'Sửa Không Gian' })}
              </button>
              {selectedCalendarId !== 'default' && (
                <button onClick={() => deleteCalendar(selectedCalendarId)} className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-red-600 rounded-lg flex items-center gap-1 transition-colors">
                  <Trash2 size={14} /> {t({ en: 'Delete Space', vi: 'Xóa Không Gian' })}
                </button>
              )}
            </div>
          )}
        </div>

        {(() => {
          const activeCal = calendars.find(c => c.id === (selectedCalendarId === 'default' ? 'default' : selectedCalendarId));
          if (activeCal && (activeCal.description || activeCal.zoomId)) {
            return (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-sm">
                {activeCal.description && (
                  <p className="text-slate-700 mb-2">{activeCal.description}</p>
                )}
                {activeCal.zoomId && (
                  <div className="flex flex-wrap gap-4 text-slate-600">
                    <p><span className="font-bold">{t({ en: 'Zoom ID:', vi: 'Phòng Zoom ID:' })}</span> {activeCal.zoomId}</p>
                    {activeCal.zoomPassword && (
                      <p><span className="font-bold">{t({ en: 'Password:', vi: 'Mật Khẩu:' })}</span> {activeCal.zoomPassword}</p>
                    )}
                  </div>
                )}
              </div>
            );
          }
          return <div className="mb-6"></div>;
        })()}

        {/* Timeline Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6 relative z-30">
          <h2 className="text-xl font-bold text-slate-800 w-auto min-w-[250px]">{displayWeekLabel}</h2>
          
          <div className="flex border border-slate-200 bg-white rounded-lg overflow-hidden shadow-sm">
            <button onClick={() => setOffsetWeeks(0)} className="px-4 py-2 text-sm font-medium hover:bg-slate-50 border-r border-slate-200">
              <CalendarIcon size={16} className="inline mr-2" />
              {t({ en: 'This Week', vi: 'Tuần Này' })}
            </button>
            <button onClick={() => setOffsetWeeks(o => o - 1)} className="px-3 py-2 hover:bg-slate-50 border-r border-slate-200">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setOffsetWeeks(o => o + 1)} className="px-3 py-2 hover:bg-slate-50">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="ml-4 flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 mr-2">
              <button onClick={() => setUse24h(false)} className={`px-2 py-1 text-[10px] font-bold rounded-md ${!use24h ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>12h</button>
              <button onClick={() => setUse24h(true)} className={`px-2 py-1 text-[10px] font-bold rounded-md ${use24h ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>24h</button>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto text-xs font-bold uppercase tracking-wider text-slate-500">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors mr-2"
            >
              <Printer size={14} /> {t({ en: 'Export PDF', vi: 'Xuất PDF' })}
            </button>
            {currentUser && (
              <button 
                onClick={openFormForNewBooking} 
                className="flex items-center gap-1 bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-church-red transition-colors mr-2"
              >
                <Plus size={14} /> {t({ en: 'Create Schedule', vi: 'Tạo Lịch' })}
              </button>
            )}
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 block"></span> {t({ en: 'Booked', vi: 'Đã Đặt' })}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500 block"></span> {t({ en: 'Yours', vi: 'Của Bạn' })}</span>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex min-h-[1440px] md:min-h-[1800px]">
          
          {/* Time scale column */}
          <div className="w-20 shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col relative z-20">
            <div className="h-14 border-b border-slate-200 bg-slate-50 sticky top-0 md:h-12 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase text-center leading-tight">
                {currentSpaceTzLabel}
              </span>
            </div>
            <div className="flex-1 relative">
              {Array.from({length: 24}).map((_, i) => (
                <div key={i} className="absolute w-full border-b border-slate-200/50 flex items-start justify-center pr-2 pt-1 z-10" style={{ top: `${(i / 24) * 100}%`, height: `${100/24}%` }}>
                  <span className="text-[11px] font-bold text-slate-400 relative -top-3">
                    {use24h ? `${String(i).padStart(2, '0')}:00` : (i === 0 ? '12 AM' : i === 12 ? '12 PM' : i < 12 ? `${i} AM` : `${i-12} PM`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Days Columns */}
          <div className="flex-1 flex overflow-x-auto custom-scrollbar relative z-10">
            {weekDaysUTC.map((dayStartUTC, i) => {
              const dayEndUTC = dayStartUTC + 24 * 3600 * 1000;
              const dateName = displayDates[i];
              
              // Filter sessions for this day
              const daySessions = filteredSchedules.filter(s => {
                const sEnd = s.startTimeUTC + s.durationHours * 3600 * 1000;
                return sEnd > dayStartUTC && s.startTimeUTC < dayEndUTC;
              });

              return (
                <div key={dayStartUTC} className="flex-1 min-w-[140px] relative border-r border-slate-200 last:border-r-0 flex flex-col">
                  {/* Day header */}
                  <div className="h-14 border-b border-slate-200 bg-slate-50 sticky top-0 flex flex-col items-center justify-center px-2 z-20 md:h-12 md:flex-row md:gap-2">
                    <span className="font-bold text-slate-700 text-sm whitespace-nowrap">{dateName.split(',')[0]}</span>
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{dateName.split(',')[1]}</span>
                  </div>
                  
                  {/* Day grid */}
                  <div className="flex-1 relative bg-white">
                    {/* Hour Lines */}
                    {Array.from({length: 24}).map((_, j) => (
                      <div key={j} className="absolute w-full border-b border-slate-100 left-0 right-0 pointer-events-none" style={{ top: `${(j / 24) * 100}%`, height: `${100/24}%` }} />
                    ))}
                    
                    {/* Events */}
                    {(() => {
                      const sortedSessions = [...daySessions].sort((a, b) => a.startTimeUTC - b.startTimeUTC);
                      
                      const groups: typeof sortedSessions[] = [];
                      let currentGroup: typeof sortedSessions = [];
                      let groupEnd = 0;
                      
                      sortedSessions.forEach(session => {
                        const start = session.startTimeUTC;
                        const end = session.startTimeUTC + session.durationHours * 3600 * 1000;
                        if (currentGroup.length === 0) {
                          currentGroup.push(session);
                          groupEnd = end;
                        } else if (start < groupEnd) {
                          currentGroup.push(session);
                          groupEnd = Math.max(groupEnd, end);
                        } else {
                          groups.push(currentGroup);
                          currentGroup = [session];
                          groupEnd = end;
                        }
                      });
                      if (currentGroup.length > 0) {
                        groups.push(currentGroup);
                      }

                      return groups.flatMap(group => {
                        const columns: typeof sortedSessions[] = [];
                        const sessionPos = new Map<string, {col: number, totalCols: number}>();
                        
                        group.forEach(session => {
                          const start = session.startTimeUTC;
                          let placed = false;
                          for (let k = 0; k < columns.length; k++) {
                            const col = columns[k];
                            const lastSession = col[col.length - 1];
                            const lastSessionEnd = lastSession.startTimeUTC + lastSession.durationHours * 3600 * 1000;
                            // Add a small buffer (e.g. 1ms) so events ending EXACTLY at the same hour start don't get misplaced. 
                            // Actually, if it ends at 9:00 and next starts at 9:00, they shouldn't overlap.
                            if (lastSessionEnd <= start) {
                              col.push(session);
                              sessionPos.set(session.id, { col: k, totalCols: 0 });
                              placed = true;
                              break;
                            }
                          }
                          if (!placed) {
                            columns.push([session]);
                            sessionPos.set(session.id, { col: columns.length - 1, totalCols: 0 });
                          }
                        });
                        
                        const totalCols = columns.length;
                        
                        return group.map(session => {
                          const sessionEndUTC = session.startTimeUTC + session.durationHours * 3600 * 1000;
                          
                          const visibleStart = Math.max(dayStartUTC, session.startTimeUTC);
                          const visibleEnd = Math.min(dayEndUTC, sessionEndUTC);
                          
                          const startOffset = visibleStart - dayStartUTC;
                          const duration = visibleEnd - visibleStart;
                          
                          const topPercent = (startOffset / (24 * 3600 * 1000)) * 100;
                          const heightPercent = (duration / (24 * 3600 * 1000)) * 100;
                          
                          const pos = sessionPos.get(session.id);
                          const col = pos?.col || 0;
                          
                          const leftPercent = (col / totalCols) * 100;
                          const widthPercent = (1 / totalCols) * 100;
                          
                          const isPast = sessionEndUTC < Date.now();
                          const isMine = session.userId === currentUser?.uid;
                          const canEdit = isMine || effectiveIsAdmin;
                          
                          let colorClass = "bg-green-100 border-green-200 text-green-800";
                          if (isPast) {
                            colorClass = "bg-slate-100 border-slate-200 text-slate-600";
                          } else if (isMine) {
                            colorClass = "bg-orange-100 border-orange-300 text-orange-900";
                          }
                          
                          const localTimeStrStart = getLocalTimeStr(session.startTimeUTC, session.timezone || TIMEZONES[0].value);
                          const localTimeStrEnd = getLocalTimeStr(sessionEndUTC, session.timezone || TIMEZONES[0].value);
                          
                          return (
                            <div 
                              key={session.id + i}
                              className={`absolute rounded border shadow-sm px-2 py-1.5 group/block z-10 hover:!z-50 hover:!h-auto hover:!min-h-max-content hover:shadow-lg transition-all duration-200 ${colorClass} overflow-hidden`}
                              style={{ 
                                top: `${topPercent}%`, 
                                height: `calc(${heightPercent}% - 4px)`, 
                                left: `calc(${leftPercent}% + 4px)`,
                                width: `calc(${widthPercent}% - 8px)`
                              }}
                            >
                          <div className="absolute top-1 right-1 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/block:opacity-100 flex gap-1 z-10 bg-white/80 rounded backdrop-blur-sm shadow-sm border border-slate-200/50">
                            {canEdit && (
                              <>
                                <button 
                                  onClick={(e) => openEditForm(session, e)}
                                  className="p-1 hover:bg-slate-100 rounded-l cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 size={12} className="text-slate-600" />
                                </button>
                                <button 
                                  onClick={(e) => deleteSchedule(session.id, e)}
                                  className="p-1 hover:bg-slate-100 rounded-r cursor-pointer"
                                  title="Cancel"
                                >
                                  <Trash2 size={12} className="text-red-500" />
                                </button>
                              </>
                            )}
                          </div>
                          
                          <div className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">
                            {session.userName}
                          </div>
                          <div className="text-[10px] opacity-80 font-medium leading-tight">
                            {localTimeStrStart} - {localTimeStrEnd}
                            <br />
                            <span className="uppercase text-[9px] font-bold mt-0.5 block opacity-75">
                              {TIMEZONES.find(t => t.value === (session.timezone || TIMEZONES[0].value))?.label || (session.timezone ? session.timezone.split('/').pop()?.replace('_', ' ') : 'Local')}
                            </span>
                          </div>
                        </div>
                      )
                    });
                  });
                })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showAddCalendarForm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
              <button type="button" onClick={() => setShowAddCalendarForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
              <h3 className="font-bold text-xl mb-4 text-slate-900">{editingCalendarId ? t({ en: 'Edit SSchedule', vi: 'Sửa Lịch' }) : t({ en: 'Create New SpSchedule', vi: 'Tạo Lịch Mới' })}</h3>
              
              <form onSubmit={handleAddCalendarSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{t({ en: 'Schedule Name', vi: 'Tên Lịch' })}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Youth Room"
                    value={newCalendar.name} 
                    onChange={e => setNewCalendar({...newCalendar, name: e.target.value})} 
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{t({ en: 'Primary Timezone', vi: 'Múi Giờ Chính' })}</label>
                  <select 
                    value={newCalendar.timezone} 
                    onChange={e => setNewCalendar({...newCalendar, timezone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-church-red"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{t({ en: 'Description (Optional)', vi: 'Mô Tả (Tùy Chọn)' })}</label>
                  <textarea 
                    placeholder="e.g. For weekly gatherings"
                    value={newCalendar.description} 
                    onChange={e => setNewCalendar({...newCalendar, description: e.target.value})} 
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red min-h-[80px]" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t({ en: 'Zoom ID (Optional)', vi: 'ID Zoom (Tùy Chọn)' })}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 484 700 7000"
                      value={newCalendar.zoomId} 
                      onChange={e => setNewCalendar({...newCalendar, zoomId: e.target.value})} 
                      className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t({ en: 'Zoom Password (Optional)', vi: 'Mật Khẩu Zoom (Tùy Chọn)' })}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 7777"
                      value={newCalendar.zoomPassword} 
                      onChange={e => setNewCalendar({...newCalendar, zoomPassword: e.target.value})} 
                      className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red" 
                    />
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-2">
                  {editingCalendarId ? <Edit2 size={18} /> : <Plus size={18} />} {editingCalendarId ? t({ en: 'Save Schedule', vi: 'Lưu Lịch' }) : t({ en: 'Create Schedule', vi: 'Tạo Lịch' })}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button type="button" onClick={() => setShowAddForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
              <h3 className="font-bold text-xl mb-4 text-slate-900">{editingScheduleId ? t({ en: 'Edit Schedule', vi: 'Chỉnh Sửa Lịch' }) : t({ en: 'Worship Sign Up', vi: 'Đăng Ký Thờ Phượng' })}</h3>
              
              <form onSubmit={handleAddSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{t({ en: 'Display Timezone (City on schedule)', vi: 'Múi Giờ Hiển Thị' })}</label>
                  <select 
                    value={selectedTimezone} 
                    onChange={e => setSelectedTimezone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-church-red"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{t({ en: 'Worshipper Name', vi: 'Tên Người Thờ Phượng' })}</label>
                  <input 
                    type="text" 
                    placeholder={userProfile?.displayName || "e.g. MS Thu"}
                    value={newBooking.name} 
                    onChange={e => setNewBooking({...newBooking, name: e.target.value})} 
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Days {editingScheduleId && '(Edit applies to current block)'}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {formDateOptions.map(opt => (
                      <label key={opt.key} className={`flex flex-col items-center justify-center p-2 rounded-lg border cursor-pointer transition-colors ${newBooking.selectedDays.includes(opt.key) ? 'bg-red-50 border-church-red/50 text-church-red' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={newBooking.selectedDays.includes(opt.key)}
                          onChange={() => toggleDaySelection(opt.key)}
                        />
                        <span className="text-xs font-bold">{opt.label.split(',')[0]}</span>
                        <span className="text-[10px] opacity-80">{opt.label.split(',')[1]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t({ en: `Time (${currentSpaceTzLabel})`, vi: `Thời gian (${currentSpaceTzLabel})` })}</label>
                    <div className="flex gap-1">
                      <select 
                        value={newBooking.hour} 
                        onChange={e => setNewBooking({...newBooking, hour: Number(e.target.value)})} 
                        className="px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red flex-1 font-medium text-center"
                      >
                        {use24h 
                          ? Array.from({length: 24}).map((_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}</option>)
                          : Array.from({length: 12}).map((_, i) => <option key={i} value={i === 0 ? 12 : i}>{i === 0 ? 12 : i}</option>)
                        }
                      </select>
                      <span className="font-bold text-slate-400 self-center">:</span>
                      <select 
                        value={newBooking.minute} 
                        onChange={e => setNewBooking({...newBooking, minute: Number(e.target.value)})} 
                        className="px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red flex-1 font-medium text-center"
                      >
                        {[0, 15, 30, 45].map(i => <option key={i} value={i}>{String(i).padStart(2, '0')}</option>)}
                      </select>
                      {!use24h && (
                        <select 
                          value={newBooking.ampm} 
                          onChange={e => setNewBooking({...newBooking, ampm: e.target.value})} 
                          className="px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red text-xs font-medium"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t({ en: 'Duration (Hours)', vi: 'Thời Lượng (Giờ)' })}</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="24" 
                      value={newBooking.durationHours} 
                      onChange={e => setNewBooking({...newBooking, durationHours: Number(e.target.value)})} 
                      className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red text-center font-medium" 
                      required 
                    />
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-church-red text-white font-bold py-3 rounded-xl hover:bg-red-800 transition-colors flex items-center justify-center gap-2 shadow-sm mt-2">
                  <Plus size={18} /> {editingScheduleId ? t({ en: 'Save Changes', vi: 'Lưu Thay Đổi' }) : t({ en: 'Create Schedule', vi: 'Tạo Lịch' })}
                </button>
              </form>
            </div>
          </div>
        )}

        {deletingId && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
              <h3 className="font-bold text-lg mb-2">{t({ en: 'Cancel Booking', vi: 'Hủy Lịch Đặt' })}</h3>
              <p className="text-slate-600 mb-6 font-medium text-sm">{t({ en: 'Are you sure you want to cancel this booking?', vi: 'Bạn có chắc chắn muốn hủy lịch đặt này không?' })}</p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setDeletingId(null)} 
                  className="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100"
                >
                  {t({ en: 'Keep It', vi: 'Giữ Lại' })}
                </button>
                <button 
                  onClick={async () => {
                    if (deletingId) {
                      await deleteDoc(doc(db, 'worshipSchedule', deletingId));
                      setDeletingId(null);
                    }
                  }} 
                  className="px-4 py-2 rounded-lg font-bold bg-red-500 text-white hover:bg-red-600"
                >
                  {t({ en: 'Cancel Booking', vi: 'Hủy Lịch Đặt' })}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Print Layout */}
    <div className="hidden print:block bg-white text-black p-4 font-sans max-w-full">
      <div className="text-center mb-6 flex flex-col items-center">
        <div className="w-16 h-16 mb-2">
          <img 
            src="/images/logo-edited.jpg" 
            alt="The Global Gospel Power Church Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold font-serif mb-1">The Global Gospel Power Church</h1>
        <h2 className="text-xl font-bold mt-2">{t({ en: 'Worship Schedule:', vi: 'Lịch Trình Thờ Phượng:' })} {calendars.find(c => c.id === selectedCalendarId)?.name || (selectedCalendarId === 'default' ? t({ en: 'Main Space', vi: 'Không Gian Chính' }) : '')}</h2>
        <p className="text-lg font-medium">{displayWeekLabel}</p>
        <p className="text-xs mt-1">{t({ en: `${currentSpaceTzLabel} Time`, vi: `Giờ ${currentSpaceTzLabel}` })}</p>
      </div>
      
      {/* Printable Grid Table */}
      <table className="w-full border-collapse border border-slate-300 text-xs text-left p-[1px]">
        <thead>
          <tr>
            <th className="border border-slate-300 p-1 text-center bg-slate-100 w-[10%]">Time</th>
            {displayDates.map(date => (
              <th key={date} className="border border-slate-300 p-1 font-bold text-center bg-slate-50 w-[12.8%]">
                <div className="whitespace-nowrap">{date.split(',')[0]}</div>
                <div className="font-normal opacity-80 whitespace-nowrap">{date.split(',')[1]}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({length: 24}).map((_, i) => (
            <tr key={i}>
              <td className="border border-slate-300 p-1 font-bold text-center bg-slate-100 align-top">
                {`${String(i).padStart(2, '0')}:00`}
              </td>
              {weekDaysUTC.map(dayStartUTC => {
                const hourStart = dayStartUTC + i * 3600 * 1000;
                const hourEnd = hourStart + 3600 * 1000;
                
                // Find sessions overlapping this hour
                const overlappingSessions = filteredSchedules.filter(s => {
                  const sEnd = s.startTimeUTC + s.durationHours * 3600 * 1000;
                  return s.startTimeUTC < hourEnd && sEnd > hourStart;
                });
                
                return (
                  <td key={dayStartUTC} className="border border-slate-300 p-1 align-top text-center text-wrap break-words">
                    {overlappingSessions.map(session => (
                      <div key={session.id} className="mb-1 last:mb-0 border p-0.5 border-slate-800 bg-slate-50 text-[10px] leading-tight w-full box-border rounded">
                        <div className="font-bold break-words">{session.userName}</div>
                        <div className="opacity-80">
                         {getLocalTimeStr(session.startTimeUTC, session.timezone || TIMEZONES[0].value)} - {session.durationHours}h
                         <br />
                         <span className="uppercase text-[8px] font-bold">
                           {TIMEZONES.find(t => t.value === (session.timezone || TIMEZONES[0].value))?.label || (session.timezone ? session.timezone.split('/').pop()?.replace('_', ' ') : 'Local')}
                         </span>
                        </div>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};



