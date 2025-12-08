/**
 * Form Field with Icon Component
 * 
 * A form input field with a left-aligned icon
 * Supports password visibility toggle when type is "password"
 */

import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import FormField from './FormField';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface FormFieldWithIconProps {
  label: string;
  htmlFor: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  helperText?: string | React.ReactNode;
  readOnlyMessage?: string;
  className?: string;
}

const FormFieldWithIcon = ({
  label,
  htmlFor,
  icon: Icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  readOnly = false,
  disabled = false,
  minLength,
  maxLength,
  helperText,
  readOnlyMessage,
  className = '',
}: FormFieldWithIconProps) => {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = isPassword && showPassword ? 'text' : type;
  const rightPadding = isPassword ? 'pr-11' : 'pr-4';
  
  const inputClasses = `input pl-11 ${rightPadding} w-full h-11 text-sm ${
    readOnly || disabled 
      ? 'bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed' 
      : ''
  } ${className}`;

  return (
    <FormField
      label={label}
      htmlFor={htmlFor}
      required={required}
      helperText={helperText}
    >
      <div className="relative">
        {/* Left Icon */}
        <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center pointer-events-none z-10">
          <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
        </div>
        
        {/* Input Field */}
        <input
          id={htmlFor}
          name={htmlFor}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          className={inputClasses}
          title={readOnly ? readOnlyMessage : undefined}
        />
        
        {/* Password Visibility Toggle */}
        {isPassword && !readOnly && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95 z-10"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 flex-shrink-0" />
            ) : (
              <Eye className="h-4 w-4 flex-shrink-0" />
            )}
          </button>
        )}
      </div>
      {readOnly && readOnlyMessage && (
        <div className="mt-2 flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{readOnlyMessage}</span>
        </div>
      )}
    </FormField>
  );
};

export default FormFieldWithIcon;

