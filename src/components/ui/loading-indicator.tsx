import React from 'react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function LoadingIndicator({ size = 'md', message, className = '' }: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      {message && (
        <p className={`text-gray-600 mt-2 ${textSizeClasses[size]}`}>
          {message}
        </p>
      )}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} ${className}`}></div>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Chargement...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingIndicator size="lg" message={message} />
    </div>
  );
}

interface SectionLoadingProps {
  message?: string;
  className?: string;
}

export function SectionLoading({ message = 'Chargement...', className = '' }: SectionLoadingProps) {
  return (
    <div className={`text-center py-8 ${className}`}>
      <LoadingIndicator size="md" message={message} />
    </div>
  );
}