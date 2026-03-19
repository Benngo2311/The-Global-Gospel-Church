import React from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TimeRangeProps {
  ptStart: string; // Format: "HH:mm" (24h)
  ptEnd?: string;  // Format: "HH:mm" (24h)
  className?: string;
}

export const TimeRange: React.FC<TimeRangeProps> = ({ ptStart, ptEnd, className = '' }) => {
  const { t } = useLanguage();

  // Helper to parse time string
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
  };

  // Helper to format time
  const formatTime = (hours: number, minutes: number, isVN: boolean = false) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours12 = hours % 12 || 12;
    const displayMins = minutes.toString().padStart(2, '0');
    
    if (isVN) {
      return `${displayHours12}:${displayMins} ${period}`;
    }
    return `${displayHours12}:${displayMins} ${period}`;
  };

  // Calculate VN time (PT + 14 hours usually, but let's just do a simple +14 for display purposes)
  // Note: Daylight saving time makes this complex in reality. 
  // For this simple component, we'll assume a fixed +14h difference (Standard Time) or +15h (Daylight Time).
  // Let's use +14h as a baseline for California to Vietnam.
  const getVnTime = (ptHours: number, ptMinutes: number) => {
    let vnHours = (ptHours + 14) % 24;
    return { hours: vnHours, minutes: ptMinutes };
  };

  const start = parseTime(ptStart);
  const vnStart = getVnTime(start.hours, start.minutes);

  let end, vnEnd;
  if (ptEnd) {
    end = parseTime(ptEnd);
    vnEnd = getVnTime(end.hours, end.minutes);
  }

  return (
    <div className={`flex flex-col gap-1 text-sm ${className}`}>
      <div className="flex items-center gap-2 text-slate-600">
        <Clock size={14} className="text-church-red" />
        <span className="font-medium">
          {formatTime(start.hours, start.minutes)}
          {end && ` - ${formatTime(end.hours, end.minutes)}`}
          {' '}PT (California)
        </span>
      </div>
      <div className="flex items-center gap-2 text-slate-500 ml-5">
        <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 px-2 py-0.5 rounded">VN</span>
        <span>
          {formatTime(vnStart.hours, vnStart.minutes, true)}
          {vnEnd && ` - ${formatTime(vnEnd.hours, vnEnd.minutes, true)}`}
          {' '}{t({ en: 'Next Day', vi: 'Ngày Hôm Sau' })}
        </span>
      </div>
    </div>
  );
};
