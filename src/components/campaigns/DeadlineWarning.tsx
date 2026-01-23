import { AlertCircle, Clock } from 'lucide-react';

interface DeadlineWarningProps {
  deadline: string;
}

export default function DeadlineWarning({ deadline }: DeadlineWarningProps) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffMs < 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-sm text-red-800 font-medium">
          Deadline dépassée
        </p>
      </div>
    );
  }

  if (diffHours < 24) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-red-600" />
        <p className="text-sm text-red-800 font-medium">
          ⚠️ Deadline dans {diffHours} heure{diffHours > 1 ? 's' : ''} !
        </p>
      </div>
    );
  }

  if (diffDays < 7) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-orange-600" />
        <p className="text-sm text-orange-800 font-medium">
          Deadline dans {diffDays} jour{diffDays > 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  return null;
}
