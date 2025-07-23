import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Habit } from '../types';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', currentUser.uid, 'habits'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Habit[];
      setHabits(habitsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const createHabit = async (habitData: Partial<Habit>) => {
    if (!currentUser) throw new Error('User not authenticated');

    const habit: Omit<Habit, 'id'> = {
      ...habitData,
      frequency: { type: 'daily' },
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    } as Omit<Habit, 'id'>;

    await addDoc(collection(db, 'users', currentUser.uid, 'habits'), habit);
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    if (!currentUser) throw new Error('User not authenticated');

    const habitRef = doc(db, 'users', currentUser.uid, 'habits', habitId);
    await updateDoc(habitRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  };

  const deleteHabit = async (habitId: string) => {
    if (!currentUser) throw new Error('User not authenticated');

    const habitRef = doc(db, 'users', currentUser.uid, 'habits', habitId);
    await updateDoc(habitRef, {
      isActive: false,
      updatedAt: Timestamp.now()
    });
  };

  return {
    habits,
    loading,
    createHabit,
    updateHabit,
    deleteHabit
  };
};