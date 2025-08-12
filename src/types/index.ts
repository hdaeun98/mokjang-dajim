export interface Person {
  id: string;
  name: string;
  goal: string;
  emoji: string;
  frequencyType: 'specific' | 'count';
  specificDays?: string[];
  targetCount?: number;
  completions: Record<string, boolean>; // date string -> completed
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  isImportant: boolean;
  createdAt: Date;
}

export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';