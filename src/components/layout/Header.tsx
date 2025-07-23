import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, LogOut, Plus, Menu, X, Target, Calendar, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useHabits } from '../../hooks/useHabits';
import { useLogs } from '../../hooks/useLogs';
import { Button } from '../ui/Button';
import { StatsCard } from '../rpg/StatsCard';

interface HeaderProps {
  onCreateHabit?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateHabit }) => {
  const { currentUser, logout, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { habits } = useHabits();
  const { logs } = useLogs();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calcular estatísticas apenas para hoje
  const today = new Date().toISOString().split('T')[0];
  const todaysLogs = logs.filter(log => log.date === today);
  const completedToday = todaysLogs.filter(log => 
    log.value === true || (typeof log.value === 'number' && log.value > 0)
  ).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Calcular maior sequência real
  const calculateLongestStreak = () => {
    if (habits.length === 0) return 0;

    let maxStreak = 0;
    
    habits.forEach(habit => {
      const habitLogs = logs
        .filter(log => log.habitId === habit.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let currentStreak = 0;
      let tempStreak = 0;
      let lastDate: Date | null = null;

      habitLogs.forEach(log => {
        const logDate = new Date(log.date);
        const isCompleted = log.value === true || (typeof log.value === 'number' && log.value > 0);

        if (isCompleted) {
          if (lastDate) {
            const diffDays = Math.floor((logDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              tempStreak++;
            } else {
              tempStreak = 1;
            }
          } else {
            tempStreak = 1;
          }
          currentStreak = Math.max(currentStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
        
        lastDate = logDate;
      });
      
      maxStreak = Math.max(maxStreak, currentStreak);
    });

    return maxStreak;
  };

  const longestStreak = calculateLongestStreak();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 18) return '☀️';
    return '🌙';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo e Saudação */}
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 sm:space-x-3"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    HabitFlow
                  </h1>
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden sm:block leading-none">
                    {getGreeting()}! {getGreetingEmoji()}
                  </span>
                </div>
              </motion.div>
              
              {/* Saudação mobile */}
              <div className="sm:hidden flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {getGreeting()}! {getGreetingEmoji()}
                </h2>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* XP Display - Desktop */}
              {userProfile && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-full border border-slate-200/50 dark:border-slate-600/50 shadow-sm"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {userProfile.level}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {userProfile.totalXP.toLocaleString()} XP
                  </span>
                </motion.div>
              )}

              {/* Quick Stats - Medium screens */}
              {totalHabits > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden md:flex lg:hidden items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-full border border-slate-200/50 dark:border-slate-600/50"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {completedToday}/{totalHabits}
                  </span>
                </motion.div>
              )}

              {/* Create Habit Button */}
              {onCreateHabit && (
                <>
                  {/* Desktop */}
                  <Button 
                    onClick={onCreateHabit}
                    className="hidden sm:flex bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-sm hover:shadow-md transition-all duration-200 px-3 sm:px-4 py-2"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden lg:inline">Novo Hábito</span>
                    <span className="lg:hidden">Novo</span>
                  </Button>

                  {/* Mobile */}
                  <Button 
                    onClick={onCreateHabit}
                    size="sm"
                    className="sm:hidden px-2 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Theme Toggle */}
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleTheme}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>

              {/* User Menu - Desktop */}
              {currentUser && (
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="hidden md:block text-sm text-slate-600 dark:text-slate-300 max-w-32 truncate font-medium">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={logout}
                    className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="sm:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 sm:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg shadow-2xl border-l border-slate-200/50 dark:border-slate-700/50"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Card */}
              <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <StatsCard />
              </div>

              {/* Progress Cards - Only show if there are habits */}
              {totalHabits > 0 && (
                <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Progresso de Hoje
                  </h3>
                  
                  {/* Progresso Hoje */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-blue-100/50 dark:border-slate-600/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Concluído Hoje
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {completedToday}/{totalHabits}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="w-full bg-slate-200/50 dark:bg-slate-600/50 rounded-full h-2.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                      {completionRate}% completo
                    </p>
                  </motion.div>

                  {/* Total de Hábitos */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-emerald-100/50 dark:border-slate-600/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Total de Hábitos
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {totalHabits}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Maior Sequência - DADOS REAIS */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-orange-100/50 dark:border-slate-600/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Maior Sequência
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {longestStreak} {longestStreak === 1 ? 'dia' : 'dias'}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* User Info and Actions */}
              {currentUser && (
                <div className="p-4 space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {(currentUser.displayName || currentUser.email)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {currentUser.displayName || 'Usuário'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </motion.div>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair da Conta
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};