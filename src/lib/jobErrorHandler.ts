// Job-specific error handling utilities

export enum JobErrorType {
  NETWORK_ERROR = 'network',
  VALIDATION_ERROR = 'validation',
  AUTHORIZATION_ERROR = 'authorization',
  BUSINESS_LOGIC_ERROR = 'business',
  NOT_FOUND = 'not_found',
  SERVER_ERROR = 'server'
}

export interface JobErrorResponse {
  type: JobErrorType;
  message: string;
  details?: Record<string, string>;
  retryable: boolean;
}

/**
 * Classifies and formats job-related errors for consistent user feedback
 */
export function classifyJobError(error: any): JobErrorResponse {
  // Network connectivity issues
  if (error.message?.includes('Network') || error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return {
      type: JobErrorType.NETWORK_ERROR,
      message: 'Problème de connexion. Vérifiez votre connexion internet.',
      retryable: true
    };
  }

  // 404 errors - resource not found
  if (error.status === 404 || error.message?.includes('404') || error.message?.includes('not found')) {
    return {
      type: JobErrorType.NOT_FOUND,
      message: 'Ressource non trouvée.',
      retryable: false
    };
  }

  // Authentication/Authorization errors
  if (error.status === 401 || error.status === 403 || error.message?.includes('auth')) {
    return {
      type: JobErrorType.AUTHORIZATION_ERROR,
      message: 'Erreur d\'authentification. Veuillez vous reconnecter.',
      retryable: false
    };
  }

  // Business logic errors
  if (error.message?.includes('locked') || error.message?.includes('LOCKED')) {
    return {
      type: JobErrorType.BUSINESS_LOGIC_ERROR,
      message: 'Cette campagne est verrouillée et n\'accepte plus de modifications.',
      retryable: false
    };
  }

  if (error.message?.includes('deadline') || error.message?.includes('expired')) {
    return {
      type: JobErrorType.BUSINESS_LOGIC_ERROR,
      message: 'La deadline pour cette action est dépassée.',
      retryable: false
    };
  }

  if (error.message?.includes('already applied')) {
    return {
      type: JobErrorType.BUSINESS_LOGIC_ERROR,
      message: 'Vous avez déjà candidaté à cette offre.',
      retryable: false
    };
  }

  if (error.message?.includes('not accepted') || error.message?.includes('invitation')) {
    return {
      type: JobErrorType.BUSINESS_LOGIC_ERROR,
      message: 'Votre entreprise n\'a pas accepté l\'invitation à cette campagne.',
      retryable: false
    };
  }

  // Validation errors
  if (error.status === 400 || error.message?.includes('validation') || error.message?.includes('invalid')) {
    return {
      type: JobErrorType.VALIDATION_ERROR,
      message: 'Données invalides. Veuillez vérifier vos informations.',
      details: error.details,
      retryable: false
    };
  }

  // Server errors
  if (error.status >= 500 || error.message?.includes('server') || error.message?.includes('internal')) {
    return {
      type: JobErrorType.SERVER_ERROR,
      message: 'Erreur serveur temporaire. Veuillez réessayer dans quelques instants.',
      retryable: true
    };
  }

  // Generic error fallback
  return {
    type: JobErrorType.SERVER_ERROR,
    message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    retryable: true
  };
}

/**
 * Determines if an error represents an empty state rather than a genuine error
 */
export function isEmptyStateError(error: any): boolean {
  return error.status === 404 || 
         error.message?.includes('404') || 
         error.message?.includes('not found') ||
         error.message?.includes('no jobs') ||
         error.message?.includes('empty');
}

/**
 * Gets user-friendly error message for job loading failures
 */
export function getJobLoadingErrorMessage(error: any): string | null {
  if (isEmptyStateError(error)) {
    return null; // Should show empty state instead
  }
  
  const classified = classifyJobError(error);
  return classified.message;
}

/**
 * Gets user-friendly error message for job creation failures
 */
export function getJobCreationErrorMessage(error: any): string {
  const classified = classifyJobError(error);
  
  switch (classified.type) {
    case JobErrorType.BUSINESS_LOGIC_ERROR:
      return classified.message;
    case JobErrorType.VALIDATION_ERROR:
      return 'Veuillez corriger les erreurs dans le formulaire.';
    case JobErrorType.AUTHORIZATION_ERROR:
      return 'Vous n\'êtes pas autorisé à créer cette offre.';
    case JobErrorType.NETWORK_ERROR:
      return 'Problème de connexion. Vérifiez votre connexion et réessayez.';
    default:
      return 'Erreur lors de la création de l\'offre. Veuillez réessayer.';
  }
}

/**
 * Gets user-friendly error message for job application failures
 */
export function getJobApplicationErrorMessage(error: any): string {
  const classified = classifyJobError(error);
  
  switch (classified.type) {
    case JobErrorType.BUSINESS_LOGIC_ERROR:
      return classified.message;
    case JobErrorType.AUTHORIZATION_ERROR:
      return 'Vous devez être connecté pour candidater.';
    case JobErrorType.VALIDATION_ERROR:
      return 'Votre profil est incomplet. Veuillez le compléter avant de candidater.';
    case JobErrorType.NETWORK_ERROR:
      return 'Problème de connexion. Vérifiez votre connexion et réessayez.';
    default:
      return 'Erreur lors de la candidature. Veuillez réessayer.';
  }
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  const classified = classifyJobError(error);
  return classified.retryable;
}