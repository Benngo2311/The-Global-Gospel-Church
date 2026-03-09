import React, { useState, useEffect } from 'react';

interface TimeRangeProps {
  ptStart: string; // e.g. "05:00" (24h format)
  ptEnd: string;   // e.g. "07:00" (24h format)
  className?: string;
}

export const TimeRange: React.FC<TimeRangeProps> = ({ ptStart, ptEnd, className }) => {
  const [localRange, setLocalRange] = useState<string>('');
  const [userTimezone, setUserTimezone] = useState<string>('');

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(tz);

      const convert = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        // Create a date object for "today" in PT
        // We use a fixed date to avoid DST issues during transition, 
        // but ideally we want the current DST state of PT.
        // California is America/Los_Angeles
        
        const now = new Date();
        const ptDateStr = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        const ptNow = new Date(ptDateStr);
        
        const ptTarget = new Date(ptNow);
        ptTarget.setHours(hours, minutes, 0, 0);
        
        // Now we need to find the offset difference between PT and Local
        // A simpler way: 
        // 1. Create a date object that represents the PT time
        // 2. Format it in the user's local time
        
        // To do this accurately, we need to know the offset of PT at that specific time.
        const formatter = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        // This is a bit tricky without a library like luxon or date-fns-tz.
        // But we can use the "offset" trick.
        
        const getOffset = (date: Date, tz: string) => {
          const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            timeZoneName: 'shortOffset',
          }).formatToParts(date);
          const offsetPart = parts.find(p => p.type === 'timeZoneName')?.value || '';
          // offsetPart is like "GMT-7" or "GMT+7"
          if (offsetPart === 'GMT') return 0;
          const match = offsetPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
          if (!match) return 0;
          const [_, sign, h, m] = match;
          const totalMinutes = parseInt(h) * 60 + (m ? parseInt(m) : 0);
          return sign === '+' ? totalMinutes : -totalMinutes;
        };

        const ptOffset = getOffset(now, 'America/Los_Angeles');
        const localOffset = -now.getTimezoneOffset(); // minutes from UTC
        
        const diffMinutes = localOffset - ptOffset;
        
        const localDate = new Date(ptTarget.getTime() + diffMinutes * 60000);
        return formatter.format(localDate);
      };

      const start = convert(ptStart);
      const end = convert(ptEnd);
      setLocalRange(`${start} - ${end}`);
    } catch (e) {
      console.error("Time conversion error", e);
    }
  }, [ptStart, ptEnd]);

  if (!localRange) return null;

  return (
    <div className={className}>
      <p className="text-church-red font-bold">{localRange}</p>
      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
        Your Local Time ({userTimezone.split('/').pop()?.replace('_', ' ')})
      </p>
    </div>
  );
};
