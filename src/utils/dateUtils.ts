import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (date: Date, pattern: string = 'PPP') => {
  return format(date, pattern, { locale: ko });
};

export const formatDateTime = (date: Date) => {
  return format(date, 'M월 d일, yyyy년 HH:mm', { locale: ko });
};

export const getWeekDays = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getDateString = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

export const isDateToday = (date: Date) => {
  return isToday(date);
};

export const calculateStreak = (completions: Record<string, boolean>) => {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  while (true) {
    const dateStr = getDateString(currentDate);
    if (completions[dateStr]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

export const calculateWeeklyProgress = (
  completions: Record<string, boolean>,
  frequencyType: 'specific' | 'count',
  specificDays?: string[],
  targetCount?: number
) => {
  const weekDays = getWeekDays();
  const weekCompletions = weekDays.filter(day => {
    const dateStr = getDateString(day);
    return completions[dateStr];
  }).length;

  if (frequencyType === 'specific' && specificDays) {
    return {
      completed: weekCompletions,
      target: specificDays.length,
      percentage: Math.round((weekCompletions / specificDays.length) * 100)
    };
  } else if (frequencyType === 'count' && targetCount) {
    return {
      completed: weekCompletions,
      target: targetCount,
      percentage: Math.round((weekCompletions / targetCount) * 100)
    };
  }

  return { completed: 0, target: 0, percentage: 0 };
};