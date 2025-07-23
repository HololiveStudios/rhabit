import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Battery, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRPG } from '../../hooks/useRPG';

export const StatsCard: React.FC = () => {
  const { userProfile } = useAuth();
  const { level, progress } = useRPG();   // <— novo hook

  if (!userProfile) return null;

  const stats = [
    {
      label: 'Saúde',
      value: userProfile.health,
      max: 100,
      icon: Heart,
      color: 'from-red-400 to-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      label: 'Energia',
      value: userProfile.energy,
      max: 100,
      icon: Battery,
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      label: `Nível ${level}`,
      value: progress.current,               // XP atual dentro do nível
      max: progress.nextLevelXP,             // XP necessário para subir
      icon: Award,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      footer: `${progress.percent}% para o nível ${level + 1}` // texto extra
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-3 sm:p-4 rounded-2xl ${stat.bgColor} border border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                {stat.label}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
              {stat.value}/{stat.max}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stat.value / stat.max) * 100}%` }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
            />
          </div>

          {stat.footer && (
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
              {stat.footer}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};
