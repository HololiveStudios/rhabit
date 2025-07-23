import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { RPGStats } from '../types';

export const useRPG = () => {
  const { currentUser, userProfile } = useAuth();
  
  const xpPerLevel = 100

  const calculateLevel = (xp: number) => Math.floor(xp / xpPerLevel) + 1

    const calculateProgress = (xp: number) => {
    const cur = xp % xpPerLevel
    return {
      current: cur,
      percent: Math.round((cur / xpPerLevel) * 100),
      nextLevelXP: xpPerLevel
    }
  }

  const calculateXPForHabit = (difficulty: number, streakBonus = 1, chainBonus = 1): number => {
    const baseXP = 10;
    return baseXP * difficulty * streakBonus * chainBonus;
  };

  const updateUserStats = async (xpGained: number, healthChange = 0, energyChange = -5) => {
    if (!currentUser || !userProfile) return;
    
    const oldXP = Number(userProfile.totalXP) || 0;
    const newTotalXP = oldXP + Number(xpGained || 0);

    const newLevel = calculateLevel(newTotalXP);
    const newHealth = Math.max(0, Math.min(100, userProfile.health + healthChange));
    const newEnergy = Math.max(0, Math.min(100, userProfile.energy + energyChange));

    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      totalXP: newTotalXP,
      level: newLevel,
      health: newHealth,
      energy: newEnergy
    });

    if (newLevel > userProfile.level) {
      await updateDoc(userRef, {
        badges: [...userProfile.badges, `level-${newLevel}`]
      });
    }
  };
  
  const recoverEnergy = async (amount = 20) => {
    if (!currentUser || !userProfile) return;

    const newEnergy = Math.min(100, userProfile.energy + amount);
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, { energy: newEnergy });
  };

  const addBadge = async (badgeId: string) => {
    if (!currentUser || !userProfile) return;

    if (!userProfile.badges.includes(badgeId)) {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        badges: [...userProfile.badges, badgeId]
      });
    }
  };

  return {
    calculateLevel,
    calculateXPForHabit,
    updateUserStats,
    recoverEnergy,
    addBadge,
    level: userProfile ? calculateLevel(userProfile.totalXP) : 1,
    progress: userProfile ? calculateProgress(userProfile.totalXP) : { current: 0, percent: 0, nextLevelXP: xpPerLevel },
    currentStats: userProfile ? {
      level: userProfile.level,
      xp: userProfile.totalXP,
      health: userProfile.health,
      energy: userProfile.energy,
      discipline: userProfile.stats?.discipline || 10,
      consistency: userProfile.stats?.consistency || 10,
      resilience: userProfile.stats?.resilience || 10
    } as RPGStats : null
  };
};
