import React from 'react';
import { Button } from './button';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Chargement...', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-4`}></div>
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  retryText?: string;
  size?: 'small' | 'medium' | 'large';
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  retryText = 'Réessayer',
  size = 'medium'
}) => {
  const containerSize = {
    small: 'p-4',
    medium: 'p-8',
    large: 'p-12'
  };

  return (
    <div className={`text-center bg-white rounded-xl shadow-sm border border-gray-100 ${containerSize[size]}`}>
      <div className="text-red-500 mb-4">
        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Une erreur est survenue
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {error}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="bg-purple-600 hover:bg-purple-700">
          {retryText}
        </Button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon,
  action
}) => {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
      {icon && (
        <div className="text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} className="bg-purple-600 hover:bg-purple-700">
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Hook pour gérer les états de chargement/erreur dans les composants
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface AsyncActions<T> {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (data: T) => void;
  reset: () => void;
  execute: (promise: Promise<T>) => Promise<T>;
}

export function useAsync<T>(initialData: T | null = null): AsyncState<T> & AsyncActions<T> {
  const [state, setState] = React.useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  };

  const setData = (data: T) => {
    setState(prev => ({ ...prev, data, loading: false, error: null }));
  };

  const reset = () => {
    setState({
      data: initialData,
      loading: false,
      error: null
    });
  };

  const execute = async (promise: Promise<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await promise;
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset,
    execute
  };
}