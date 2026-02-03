import { Badge } from "@/components/ui/badge";

type CampaignStatus = 'OPEN' | 'LOCKED' | 'CLOSED' | 'active' | 'upcoming' | 'closed';

interface StatusBadgeProps {
  status: CampaignStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    OPEN: { label: 'Ouverte', className: 'bg-green-50 text-green-700 border-green-200' },
    active: { label: 'Active', className: 'bg-green-50 text-green-700 border-green-200' },
    LOCKED: { label: 'Verrouillée', className: 'bg-red-50 text-red-700 border-red-200' },
    CLOSED: { label: 'Terminée', className: 'bg-gray-50 text-gray-700 border-gray-200' },
    closed: { label: 'Terminée', className: 'bg-gray-50 text-gray-700 border-gray-200' },
    upcoming: { label: 'À venir', className: 'bg-blue-50 text-blue-700 border-blue-200' }
  };

  const { label, className } = config[status] || config.OPEN;

  return (
    <Badge className={`${className} text-xs font-medium`}>
      {label}
    </Badge>
  );
}
