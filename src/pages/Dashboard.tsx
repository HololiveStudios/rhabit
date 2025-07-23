import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, ChevronUp} from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { useLogs } from '../hooks/useLogs';
import { useRPG } from '../hooks/useRPG';
import { HabitCard } from '../components/habit/HabitCard';
import { HabitForm } from '../components/habit/HabitForm';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Habit } from '../types';
import toast from 'react-hot-toast';

interface DashboardProps {
  onCreateHabit?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateHabit }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const { habits, createHabit } = useHabits();
  const { logs, logHabit } = useLogs();
  const { calculateXPForHabit, updateUserStats } = useRPG();

  useEffect(() => {
    if (habits.length === 0) return;
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [habits.length]);

  const handleCreateHabit = async (data: Partial<Habit>) => {
    setLoading(true);
    try {
      await createHabit(data);
      setIsCreateModalOpen(false);
      toast.success('Hábito criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar hábito');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string, value: boolean | number) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      const xpEarned = value ? calculateXPForHabit(habit.difficulty) : 0;
      
      await logHabit(habitId, value, xpEarned);
      
      if (value) {
        await updateUserStats(xpEarned, 0, -5);
        toast.success(`+${xpEarned} XP ganho!`, {
          duration: 2000,
          position: 'top-center',
        });
      }
    } catch (error) {
      toast.error('Erro ao atualizar hábito');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="">
      <div className="container mx-auto px-4 py-6 pb-4 lg:pb-8 max-w-6xl" style={{ minHeight: habits.length === 0 ? 'calc(100vh - 4rem)' : 'auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
              {habits.length > 0 ? 'Seus Hábitos' : 'Comece Sua Jornada'}
            </h2>
          </div>
          
          {habits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20 dark:border-slate-700/50 shadow-lg text-center"
            >
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 lg:w-12 lg:h-12 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Transforme sua vida, um hábito por vez
              </h3>
              
              <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                Crie seu primeiro hábito e comece a construir a versão melhor de você mesmo. 
                Pequenas ações, grandes resultados!
              </p>
              
              <Button 
                onClick={onCreateHabit || (() => setIsCreateModalOpen(true))}
                variant="primary"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Meu Primeiro Hábito
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4 lg:gap-5">
              {habits.map((habit, index) => {
                const log = logs.find(l => l.habitId === habit.id);
                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.1 * index,
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    className="transform transition-all duration-200"
                  >
                    <HabitCard
                      habit={habit}
                      log={log}
                      onToggle={handleToggleHabit}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {habits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-6 right-4 z-10 sm:hidden"
          >
            <motion.button
              onClick={onCreateHabit || (() => setIsCreateModalOpen(true))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
            >
              <Plus className="w-7 h-7" />
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {showScrollTop && habits.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-26 right-4 z-30 w-14 h-14 bg-slate-800/90 hover:bg-slate-800 dark:bg-slate-200/90 dark:hover:bg-slate-200 backdrop-blur-sm text-white dark:text-slate-900 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center sm:hidden"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Criar Novo Hábito"
          size="lg"
        >
          <HabitForm
            onSubmit={handleCreateHabit}
            loading={loading}
          />
        </Modal>
      </div>
    </div>
  );
};