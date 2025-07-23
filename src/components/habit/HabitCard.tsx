import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Timer, Target, Flame } from 'lucide-react';
import { Habit, HabitLog, StreakData } from '../../types';

interface HabitCardProps {
  habit: Habit;
  log?: HabitLog;
  streak?: StreakData;
  onToggle: (habitId: string, value: boolean | number) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  log,
  streak,
  onToggle
}) => {
  const isCompleted = log?.value === true || (typeof log?.value === 'number' && log?.value > 0);
  
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'from-green-400 to-green-500';
      case 2: return 'from-yellow-400 to-orange-500';
      case 3: return 'from-red-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Fácil';
      case 2: return 'Médio';
      case 3: return 'Difícil';
      default: return 'Normal';
    }
  };

  const handleClick = () => {
    if (habit.type === 'boolean') {
      onToggle(habit.id, !isCompleted);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer touch-target ${
        isCompleted 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 active:border-blue-400'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-1">
            {habit.type === 'boolean' ? (
              isCompleted ? (
                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
              )
            ) : (
              <Target className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-base sm:text-lg leading-tight ${
              isCompleted 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {habit.description}
              </p>
            )}
            
            <div className="flex items-center flex-wrap gap-2 mt-3">
              <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(habit.difficulty)} text-white`}>
                {getDifficultyText(habit.difficulty)}
              </div>
              
              {habit.category && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                  {habit.category}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2 flex-shrink-0">
          {streak && streak.current > 0 && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
              <span className="text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300">
                {streak.current}
              </span>
            </div>
          )}
          
          {habit.reminderTime && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Timer className="w-3 h-3" />
              <span>{habit.reminderTime}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};