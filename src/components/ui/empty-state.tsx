import React from 'react';
import { Button } from './button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  tip?: string;
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  secondaryAction, 
  tip,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-12 text-center ${className}`}>
      <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {(action || secondaryAction) && (
        <div className="space-y-3">
          {action && (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          
          {tip && (
            <p className="text-sm text-gray-500">
              {tip}
            </p>
          )}
          
          {secondaryAction && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

interface SectionEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function SectionEmptyState({ 
  icon, 
  title, 
  description, 
  className = '' 
}: SectionEmptyStateProps) {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
        {icon}
      </div>
      <p className="text-gray-600">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
}