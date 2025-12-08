/**
 * Reusable Form Field Component
 * 
 * A generic form input field with label and optional helper text
 */

import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  helperText?: ReactNode;
  error?: string;
  children: ReactNode;
}

const FormField = ({ 
  label, 
  htmlFor, 
  required = false, 
  helperText, 
  error,
  children 
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label 
        htmlFor={htmlFor} 
        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center space-x-1.5 text-xs text-red-500 dark:text-red-400">
          <span>{error}</span>
        </div>
      )}
      {helperText && !error && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </div>
      )}
    </div>
  );
};

export default FormField;

