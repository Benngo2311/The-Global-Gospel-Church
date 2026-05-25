import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SEO } from '../components/SEO';
import { Globe, Clock, ChevronLeft, ChevronRight, LogIn, UserCircle, LogOut, Calendar as CalendarIcon, Trash2, Plus, X, Edit2 } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const TIMEZONES = [
  { value: Intl.DateTimeFormat().resolvedOptions().timeZone, label: `Local (${Intl.DateTimeFormat().resolvedOptions().timeZone})` },
  { value: 'Asia/Ho_Chi_Minh', label: 'Vietnam (UTC+7)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'US Eastern Time' },
  { value: 'America/Chicago', label: 'US Central Time' },
  { value: 'America/Denver', label: 'US Mountain Time' },
  { value: 'America/Los_Angeles', label: 'US Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Asia/Seoul', label: 'Seoul' },
  { value: 'Australia/Sydney', label: 'Sydney' }
].filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);

// Reliable robust computation of UTC midnight matching the selected timezone's local day boundary
const getMidnightOfZoneUTC = (date: Date, timeZone: string) => {
  const dateStr = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }).format(date);
  const [m, d, y] = dateStr.split('/');
  
  const dObj = new Date();
  dObj.setUTCFullYear(Number(y), Number(m) - 1, Number(d));
  dObj.setUTCHours(12, 0, 0, 0); // Noon UTC to avoid edge cases
  
  // Get timezone offset in hours and minutes
  const parts = new Intl.DateTimeFormat('en-US', { 
    timeZone, timeZoneName: 'longOffset' 
  }).formatToParts(dObj);
  
  const offsetPart = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+00:00';
  
  let offsetMs = 0;
  if (offsetPart.includes('+') || offsetPart.includes('-')) {
    const isNegative = offsetPart.includes('-');
    const [hours, mins] = offsetPart.split(/[+-]/)[1].split(':').map(Number);
    offsetMs = (hours * 3600000 + (mins || 0) * 60000) * (isNegative ? -1 : 1);
  }
  
  return Date.UTC(Number(y), Number(m) - 1, Number(d), 0, 0, 0) - offsetMs;
};

export const Schedule: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser, userProfile, isAdmin } = useAuth();
  
  const [schedules, setSchedules] = useState<any[]>([]);
  const [offsetDays, setOffsetDays] = useState(0);
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[0].value);
  const [use24h, setUse24h] = useState(false);
  
  // Book Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBooking, setNewBooking] = useState({ name: '', hour: 12, minute: 0, ampm: 'PM', durationHours: 1 });
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  useEffect(() => {
    // Only subscribe to worshipSchedule
    const unsub = onSnapshot(query(collection(db, 'worshipSchedule')), (snap) => {
      setSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // 1. Calculate the target day in Selected Timezone
  const now = new Date();
  const todayMidnightUTC = getMidnightOfZoneUTC(now, selectedTimezone);
  const dayStartUTC = todayMidnightUTC + offsetDays * 24 * 3600 * 1000;
  const dayEndUTC = dayStartUTC + 24 * 3600 * 1000;

  const displayDate = new Intl.DateTimeFormat('en-US', { timeZone: selectedTimezone, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(dayStartUTC + 12*3600*1000));

  // 2. Filter schedules for the current day
  const dailyInstances = schedules.filter(s => {
    const end = s.startTimeUTC + s.durationHours * 3600 * 1000;
    return end > dayStartUTC && s.startTimeUTC < dayEndUTC;
  });

  // Group by userName
  const groupedUsers: Record<string, any[]> = {};
  dailyInstances.forEach(s => {
    if (!groupedUsers[s.userName]) groupedUsers[s.userName] = [];
    groupedUsers[s.userName].push({
      ...s,
      instanceEnd: s.startTimeUTC + s.durationHours * 3600 * 1000
    });
  });

  const sortedUserNames = Object.keys(groupedUsers).sort((a, b) => {
    const minA = Math.min(...groupedUsers[a].map(s => s.startTimeUTC));
    const minB = Math.min(...groupedUsers[b].map(s => s.startTimeUTC));
    return minA - minB;
  });

  const getLocalTimeStr = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', { timeZone: selectedTimezone, hour: 'numeric', minute: '2-digit', hour12: !use24h }).format(new Date(ts)).toLowerCase();
  };

  const openEditForm = (session: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get formatted hour and minute in the currently selected timezone
    const date = new Date(session.startTimeUTC);
    const hourStr = new Intl.DateTimeFormat('en-US', { timeZone: selectedTimezone, hour: 'numeric', hourCycle: 'h23' }).format(date);
    const minuteStr = new Intl.DateTimeFormat('en-US', { timeZone: selectedTimezone, minute: 'numeric' }).format(date);
    
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

    setNewBooking({
      name: session.userName || '',
      hour: editHour,
      minute: editMinute,
      ampm: ampm,
      durationHours: session.durationHours || 1
    });
    setEditingScheduleId(session.id);
    setShowAddForm(true);
  };

  const deleteSchedule = async (scheduleId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm("Are you sure you want to cancel this booking?")) {
      await deleteDoc(doc(db, 'worshipSchedule', scheduleId));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile) return;
    
    // Calculate startTimeUTC from selected time + current day
    let hh = newBooking.hour;
    if (!use24h) {
      if (newBooking.ampm === 'PM' && hh !== 12) hh += 12;
      if (newBooking.ampm === 'AM' && hh === 12) hh = 0;
    }
    const mm = newBooking.minute;

    // This assumes the user is booking for the currently viewed display day!
    // We already have `dayStartUTC` which is midnight in the selected timezone.
    // So the timestamp is just `dayStartUTC + hh hours + mm minutes`
    const startTimeUTC = dayStartUTC + (hh * 3600 * 1000) + (mm * 60 * 1000);

    const worshipperName = newBooking.name.trim() !== '' ? newBooking.name : userProfile.displayName;

    if (editingScheduleId) {
      await updateDoc(doc(db, 'worshipSchedule', editingScheduleId), {
        userName: worshipperName,
        startTimeUTC,
        durationHours: newBooking.durationHours,
        timezone: selectedTimezone,
      });
    } else {
      await addDoc(collection(db, 'worshipSchedule'), {
        userId: currentUser.uid,
        userName: worshipperName,
        startTimeUTC,
        durationHours: newBooking.durationHours,
        timezone: selectedTimezone,
        timestamp: serverTimestamp()
      });
    }
    
    setShowAddForm(false);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 flex flex-col">
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
              View and register your worship sessions.
            </p>
          </div>
          
          <div>
            {currentUser ? (
              <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <UserCircle size={18} className="text-green-600" />
                  {userProfile?.displayName}
                  {isAdmin && <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 uppercase">Admin</span>}
                </div>
                <button onClick={handleLogout} className="text-xs font-bold text-slate-500 hover:text-church-red flex items-center gap-1">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-2 text-sm font-bold bg-slate-900 text-white rounded-xl px-6 py-2.5 hover:bg-church-red transition-colors">
                <LogIn size={16} /> Login to Book
              </button>
            )}
          </div>
        </div>

        {/* Timeline Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6 relative z-30">
          <h2 className="text-xl font-bold text-slate-800 w-auto min-w-[200px]">{displayDate}</h2>
          
          <div className="flex border border-slate-200 bg-white rounded-lg overflow-hidden shadow-sm">
            <button onClick={() => setOffsetDays(0)} className="px-4 py-2 text-sm font-medium hover:bg-slate-50 border-r border-slate-200">
              <CalendarIcon size={16} className="inline mr-2" />
              Today
            </button>
            <button onClick={() => setOffsetDays(o => o - 1)} className="px-3 py-2 hover:bg-slate-50 border-r border-slate-200">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setOffsetDays(o => o + 1)} className="px-3 py-2 hover:bg-slate-50">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="ml-4 flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 mr-2">
              <button onClick={() => setUse24h(false)} className={`px-2 py-1 text-[10px] font-bold rounded-md ${!use24h ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>12h</button>
              <button onClick={() => setUse24h(true)} className={`px-2 py-1 text-[10px] font-bold rounded-md ${use24h ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>24h</button>
            </div>
            <label className="text-xs font-bold text-slate-500 uppercase">Timezone</label>
            <select 
              value={selectedTimezone} 
              onChange={e => setSelectedTimezone(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-church-red"
            >
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 ml-auto text-xs font-bold uppercase tracking-wider text-slate-500">
            {currentUser && (
              <button 
                onClick={() => {
                   setEditingScheduleId(null);
                   setNewBooking({ name: '', hour: 12, minute: 0, ampm: 'PM', durationHours: 1 });
                   setShowAddForm(true);
                }} 
                className="flex items-center gap-1 bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-church-red transition-colors mr-2"
              >
                <Plus size={14} /> Book Time
              </button>
            )}
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-500 block"></span> Worshipper</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500 block"></span> Your Booking</span>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto flex-1 flex flex-col">
            <div className="min-w-[2400px] flex-1 flex flex-col">
              
              {/* Header Row */}
              <div className="flex bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
                <div className="w-[280px] shrink-0 border-r border-slate-200 p-3 font-bold text-slate-700 font-serif flex items-center bg-slate-50 sticky left-0 z-30">
                  Worshipper
                </div>
                <div className="flex-1 relative h-12">
                  {Array.from({length: 25}).map((_, i) => (
                    <div key={i} className="absolute top-0 bottom-0 flex flex-col justify-end pb-2" style={{ left: `${(i / 24) * 100}%` }}>
                      <div className="absolute top-0 bottom-0 border-l border-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 px-1 -translate-x-1/2 relative bg-slate-50 z-10 whitespace-nowrap">
                        {use24h ? `${String(i % 24).padStart(2, '0')}:00` : (i === 0 || i === 24 ? '12:00am' : i === 12 ? '12:00pm' : i < 12 ? `${i}:00am` : `${i-12}:00pm`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div className="flex-1 overflow-y-auto relative pb-12">
                {sortedUserNames.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 italic">No worship scheduled for this day yet.</div>
                ) : (
                  sortedUserNames.map(userName => {
                    const userSessions = groupedUsers[userName];
                    
                    return (
                      <div key={userName} className="flex border-b border-slate-100 group hover:bg-slate-50/50 min-h-[60px]">
                        {/* Worshipper Name */}
                        <div className="w-[280px] shrink-0 border-r border-slate-200 p-3 bg-white group-hover:bg-slate-50/50 sticky left-0 z-10 flex flex-col justify-center">
                          <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            {userName}
                          </span>
                        </div>

                        {/* Timeline Track */}
                        <div className="flex-1 relative bg-slate-50/30">
                          {/* Grid Background */}
                          <div className="absolute inset-0 pointer-events-none">
                            {Array.from({length: 25}).map((_, i) => (
                              <div key={i} className="absolute top-0 bottom-0 border-l border-slate-100/80" style={{ left: `${(i / 24) * 100}%` }} />
                            ))}
                          </div>
                          
                          {/* Event Blocks for this User */}
                          {userSessions.map(session => {
                            const startHour = (session.startTimeUTC - dayStartUTC) / (3600 * 1000);
                            const endHour = (session.instanceEnd - dayStartUTC) / (3600 * 1000);
                            
                            const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
                            const cStart = clamp(startHour, 0, 24);
                            const cEnd = clamp(endHour, 0, 24);
                            
                            const leftPercent = (cStart / 24) * 100;
                            const widthPercent = ((cEnd - cStart) / 24) * 100;

                            const isPast = session.instanceEnd < Date.now();
                            const isMine = session.userId === currentUser?.uid;
                            const canEdit = isMine || isAdmin;

                            let colorClass = "bg-green-500 text-white shadow-sm";
                            if (isPast) {
                              colorClass = "bg-slate-200 text-slate-500";
                            } else if (isMine) {
                              colorClass = "bg-orange-500 text-white shadow-sm";
                            }

                            if (widthPercent === 0) return null;

                            return (
                              <div 
                                key={session.id}
                                className={`absolute top-1.5 bottom-1.5 rounded-md px-2.5 transition-all flex flex-col justify-center ${colorClass} group/block`}
                                style={{ left: `${leftPercent}%`, width: `${widthPercent}%`, minWidth: 'max-content' }}
                                title={`${getLocalTimeStr(session.startTimeUTC)} - ${getLocalTimeStr(session.instanceEnd)}`}
                              >
                                <div className="absolute top-1 right-1 opacity-0 group-hover/block:opacity-100 flex gap-1 bg-black/20 rounded z-10 backdrop-blur-sm">
                                  {canEdit && (
                                    <>
                                      <button 
                                        onClick={(e) => openEditForm(session, e)}
                                        className="p-1 hover:bg-black/20 rounded-l text-white"
                                      >
                                        <Edit2 size={12} />
                                      </button>
                                      <button 
                                        onClick={(e) => deleteSchedule(session.id, e)}
                                        className="p-1 hover:bg-black/20 rounded-r text-white"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </>
                                  )}
                                </div>
                                <div className="text-[10px] font-bold leading-tight whitespace-nowrap overflow-visible z-20 pointer-events-none drop-shadow-md">
                                  {getLocalTimeStr(session.startTimeUTC)} - {getLocalTimeStr(session.instanceEnd)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
              <button onClick={() => setShowAddForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
              <h3 className="font-bold text-xl mb-4 text-slate-900">{editingScheduleId ? 'Edit Worship Time' : 'Book Worship Time'}</h3>
              <p className="text-xs text-slate-500 mb-6 border-b border-slate-100 pb-4">
                Booking for <strong>{displayDate}</strong>.
              </p>
              
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Worshipper Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder={userProfile?.displayName || "Enter your name"}
                    value={newBooking.name} 
                    onChange={e => setNewBooking({...newBooking, name: e.target.value})} 
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Start Time ({TIMEZONES.find(t => t.value === selectedTimezone)?.label || 'Selected Time'})</label>
                  <div className="flex gap-2">
                    <select 
                      value={newBooking.hour} 
                      onChange={e => setNewBooking({...newBooking, hour: Number(e.target.value)})} 
                      className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red flex-1 font-medium"
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
                      className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red flex-1 font-medium"
                    >
                      {[0, 15, 30, 45].map(i => <option key={i} value={i}>{String(i).padStart(2, '0')}</option>)}
                    </select>
                    {!use24h && (
                      <select 
                        value={newBooking.ampm} 
                        onChange={e => setNewBooking({...newBooking, ampm: e.target.value})} 
                        className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red flex-1 font-medium"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                    Vietnam Time: {new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: !use24h }).format(new Date(dayStartUTC + (use24h ? newBooking.hour : (newBooking.ampm === 'PM' && newBooking.hour !== 12 ? newBooking.hour + 12 : (newBooking.ampm === 'AM' && newBooking.hour === 12 ? 0 : newBooking.hour))) * 3600000 + newBooking.minute * 60000))}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Duration (Hours)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="24" 
                    value={newBooking.durationHours} 
                    onChange={e => setNewBooking({...newBooking, durationHours: Number(e.target.value)})} 
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-church-red" 
                    required 
                  />
                </div>
                
                <button type="submit" className="w-full bg-church-red text-white font-bold py-3 pt-4 rounded-xl hover:bg-red-800 transition-colors flex items-center justify-center gap-2 shadow-lg mt-6">
                  <Plus size={18} /> {editingScheduleId ? 'Save Changes' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


