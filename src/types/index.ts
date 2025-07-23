import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  theme: 'light' | 'dark';
  timezone: string;
  level: number;
  totalXP: number;
  health: number;
  energy: number;
  stats: {
    discipline: number;
    consistency: number;
    resilience: number;
  };
  badges: string[];
  createdAt: Timestamp;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  type: 'boolean' | 'counter' | 'duration';
  frequency: {
    type: 'daily' | 'weekly' | 'custom';
    weekdays?: number[];
  };
  color: string;
  icon: string;
  reminderTime?: string;
  difficulty: 1 | 2 | 3;
  category: string;
  isActive: boolean;
  isCritical: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HabitChain {
  id: string;
  name: string;
  habitIds: string[];
  totalEstimatedTime: number;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface HabitLog {
  id: string;
  habitId: string;
  chainId?: string;
  date: string;
  value: boolean | number;
  xpEarned?: number;
  gracePeriodUsed?: boolean;
  createdAt: Timestamp;
}

export interface DailyMetrics {
  date: string;
  mood: number;
  energy: number;
  sleepHours?: number;
  totalXP: number;
  completedHabits: number;
  totalHabits: number;
  chainsCompleted: number;
  createdAt: Timestamp;
}

export interface StreakData {
  habitId: string;
  current: number;
  longest: number;
  lastCompleted: string;
  gracePeriodUsed: number;
  isRecovering: boolean;
  recoveryTask?: string;
}

export interface RPGStats {
  level: number;
  xp: number;
  health: number;
  energy: number;
  discipline: number;
  consistency: number;
  resilience: number;
}