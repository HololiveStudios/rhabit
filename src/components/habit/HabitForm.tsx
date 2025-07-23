import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Habit } from '../../types';

const habitSchema = z.object({
  title: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome deve ter menos de 50 caracteres'),
  description: z.string().optional(),
  type: z.enum(['boolean', 'counter', 'duration']),
  category: z.string().min(1, 'Categoria é obrigatória'),
  difficulty: z.coerce.number().min(1).max(3),
  color: z.string().min(1, 'Cor é obrigatória'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  reminderTime: z.string().optional(),
  isCritical: z.boolean().default(false)
});

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitFormProps {
  onSubmit: (data: Partial<Habit>) => void;
  initialData?: Partial<Habit>;
  loading?: boolean;
}

export const HabitForm: React.FC<HabitFormProps> = ({
  onSubmit,
  initialData,
  loading = false
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'boolean',
      category: initialData?.category || '',
      difficulty: initialData?.difficulty || 1,
      color: initialData?.color || '#3B82F6',
      icon: initialData?.icon || 'target',
      reminderTime: initialData?.reminderTime || '',
      isCritical: initialData?.isCritical || false
    }
  });

  const selectedType = watch('type');

  const categories = ['Saúde', 'Produtividade', 'Aprendizado', 'Social', 'Autocuidado', 'Outros'];
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'];

  const typeOptions = [
    { value: 'boolean', label: 'Sim/Não', description: 'Feito ou não feito' },
    { value: 'counter', label: 'Contador', description: 'Quantas vezes' },
    { value: 'duration', label: 'Duração', description: 'Tempo gasto' }
  ];

  const difficultyOptions = [
    { value: 1, label: 'Fácil', xp: '1x XP', color: 'text-green-600' },
    { value: 2, label: 'Médio', xp: '2x XP', color: 'text-yellow-600' },
    { value: 3, label: 'Difícil', xp: '3x XP', color: 'text-red-600' }
  ];

  return (
    <div className="max-h-[80vh] flex flex-col">
      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            {/* Nome do Hábito */}
            <div>
              <Input
                label="Nome do Hábito"
                {...register('title')}
                error={errors.title?.message}
                placeholder="ex: Meditação matinal"
                className="text-base py-3 rounded-xl"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição (Opcional)
              </label>
              <textarea
                {...register('description')}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                rows={3}
                placeholder="Descreva seu hábito..."
              />
            </div>

            {/* Tipo - Cards visuais para mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tipo
              </label>
              <div className="space-y-2">
                {typeOptions.map(option => (
                  <label key={option.value} className="block cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      {...register('type')}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedType === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          selectedType === option.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedType === option.value && (
                            <div className="w-full h-full rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none bg-white dark:bg-gray-700"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', 
                  backgroundRepeat: 'no-repeat', 
                  backgroundPosition: 'right 0.75rem center', 
                  backgroundSize: '1.25em' 
                }}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Dificuldade - Cards visuais */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Dificuldade
              </label>
              <div className="grid grid-cols-3 gap-2">
                {difficultyOptions.map(option => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      {...register('difficulty')}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                      watch('difficulty') === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}>
                      <div className={`font-medium text-sm ${option.color} dark:text-white`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {option.xp}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Horário do Lembrete */}
            <div>
              <Input
                label="Horário do Lembrete (Opcional)"
                type="time"
                {...register('reminderTime')}
                className="text-base py-3 rounded-xl"
              />
            </div>

            {/* Cor - Grid otimizado para modal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Cor
              </label>
              <div className="grid grid-cols-4 gap-3">
                {colors.map(color => (
                  <label key={color} className="cursor-pointer">
                    <input
                      type="radio"
                      value={color}
                      {...register('color')}
                      className="sr-only"
                    />
                    <div
                      className={`w-12 h-12 rounded-xl border-3 transition-all duration-200 ${
                        watch('color') === color
                          ? 'border-gray-800 dark:border-white scale-105'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {watch('color') === color && (
                        <div className="w-full h-full rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full opacity-90 flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-800 rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Hábito Crítico */}
            <div>
              <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-xl border border-gray-300 dark:border-gray-600 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="checkbox"
                  {...register('isCritical')}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    Hábito Crítico
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Afeta a saúde no sistema RPG quando não completado
                  </div>
                </div>
              </label>
            </div>

          </div>

          {/* Botão de submit */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="submit" 
              loading={loading} 
              className="w-full py-3 text-base rounded-xl font-medium"
            >
              {initialData ? 'Atualizar Hábito' : 'Criar Hábito'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};