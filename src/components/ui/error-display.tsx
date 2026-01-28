import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorDisplay({ 
  title = 'Erreur', 
  message, 
  onRetry, 
  retryLabel = 'Réessayer',
  className = '' 
}: ErrorDisplayProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRetry}
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {retryLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className = '' }: InlineErrorProps) {
  return (
    <p className={`text-red-600 text-sm ${className}`}>
      {message}
    </p>
  );
}

interface PageErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  retryLabel?: string;
  backLabel?: string;
}

export function PageError({ 
  title = 'Erreur', 
  message, 
  onRetry, 
  onGoBack,
  retryLabel = 'Réessayer',
  backLabel = 'Retour'
}: PageErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-4 justify-center">
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {retryLabel}
            </Button>
          )}
          {onGoBack && (
            <Button variant="outline" onClick={onGoBack}>
              {backLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}