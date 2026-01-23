import { toast } from 'sonner';

export function handleApiError(error: any) {
  const message = error.message || error.toString();
  
  // Messages d'erreur métier spécifiques (US-V1-16)
  if (message.includes('locked') || message.includes('LOCKED')) {
    toast.error('Campaign is locked', {
      description: 'Cette campagne est verrouillée et ne peut plus être modifiée.'
    });
  } else if (message.includes('deadline') || message.includes('Deadline passed')) {
    toast.error('Deadline passed', {
      description: 'La deadline est dépassée, vous ne pouvez plus effectuer cette action.'
    });
  } else if (message.includes('not accepted') || message.includes('NOT_ACCEPTED')) {
    toast.error('Company not accepted for this campaign', {
      description: 'Votre entreprise n\'a pas accepté l\'invitation à cette campagne.'
    });
  } else if (message.includes('Unauthorized') || message.includes('401')) {
    toast.error('Non autorisé', {
      description: 'Vous devez être connecté pour effectuer cette action.'
    });
  } else if (message.includes('Forbidden') || message.includes('403')) {
    toast.error('Accès refusé', {
      description: 'Vous n\'avez pas les permissions nécessaires.'
    });
  } else if (message.includes('Not found') || message.includes('404')) {
    toast.error('Ressource introuvable', {
      description: 'L\'élément demandé n\'existe pas ou a été supprimé.'
    });
  } else {
    toast.error('Une erreur est survenue', {
      description: message
    });
  }
}

export function handleSuccess(message: string, description?: string) {
  toast.success(message, { description });
}
