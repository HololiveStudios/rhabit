import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';