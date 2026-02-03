import React from 'react';
import { Button } from './button';

interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  disabled = false,
  options,
  className = ''
}) => {
  const inputId = `${name}-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseInputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors";
  const errorInputClasses = error ? "border-red-500 focus:ring-red-500" : "";
  const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed" : "";
  
  const inputClasses = `${baseInputClasses} ${errorInputClasses} ${disabledClasses} ${className}`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={4}
            className={inputClasses}
          />
        );
        
      case 'select':
        return (
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            className={inputClasses}
          >
            <option value="">{placeholder || 'Sélectionnez...'}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      default:
        return (
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

interface FormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  disabled?: boolean;
  submitVariant?: 'primary' | 'secondary' | 'danger';
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  submitText = 'Enregistrer',
  cancelText = 'Annuler',
  loading = false,
  disabled = false,
  submitVariant = 'primary'
}) => {
  const getSubmitClasses = () => {
    switch (submitVariant) {
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-purple-600 hover:bg-purple-700';
    }
  };

  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
      )}
      {onSubmit && (
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={disabled || loading}
          className={getSubmitClasses()}
        >
          {loading ? 'En cours...' : submitText}
        </Button>
      )}
    </div>
  );
};

// Hook pour la validation de formulaires
export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>(
  data: T,
  rules: ValidationRules
) {
  const [errors, setErrors] = React.useState<FormErrors>({});

  const validateField = (name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Validation required
    if (rule.required && (!value || value === '')) {
      return rule.message || 'Ce champ est requis';
    }

    // Validation minLength
    if (rule.minLength && value && value.length < rule.minLength) {
      return rule.message || `Minimum ${rule.minLength} caractères requis`;
    }

    // Validation maxLength
    if (rule.maxLength && value && value.length > rule.maxLength) {
      return rule.message || `Maximum ${rule.maxLength} caractères autorisés`;
    }

    // Validation pattern
    if (rule.pattern && value && !rule.pattern.test(value)) {
      return rule.message || 'Format invalide';
    }

    // Validation custom
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((name) => {
      const error = validateField(name, data[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearError = (name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearError,
    hasErrors: Object.keys(errors).length > 0
  };
}