import React from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white focus:ring-blue-500 border-0',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-gray-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white focus:ring-red-500 border-0',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white focus:ring-green-500 border-0'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm h-9',
    md: 'px-4 py-2.5 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </motion.button>
  );
};