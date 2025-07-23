import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { HabitLog } from '../types';
import { format } from 'date-fns';

export const useLogs = (date?: string) => {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const targetDate = date || format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', currentUser.uid, 'logs'),
      where('date', '==', targetDate),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as HabitLog[];
      setLogs(logsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, targetDate]);

  const logHabit = async (habitId: string, value: boolean | number, xpEarned?: number) => {
    if (!currentUser) throw new Error('User not authenticated');

    // Check if log already exists for today
    const existingLog = logs.find(log => log.habitId === habitId && log.date === targetDate);

    if (existingLog) {
      // Update existing log
      const logRef = doc(db, 'users', currentUser.uid, 'logs', existingLog.id);
      await updateDoc(logRef, { value, xpEarned });
    } else {
      // Create new log
      const logData: Omit<HabitLog, 'id'> = {
        habitId,
        date: targetDate,
        value,
        xpEarned: xpEarned || 0,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'users', currentUser.uid, 'logs'), logData);
    }
  };

  const getHabitLogs = async (habitId: string, days = 30): Promise<HabitLog[]> => {
    if (!currentUser) return [];

    const q = query(
      collection(db, 'users', currentUser.uid, 'logs'),
      where('habitId', '==', habitId),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, days).map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as HabitLog[];
  };

  return {
    logs,
    loading,
    logHabit,
    getHabitLogs
  };
};