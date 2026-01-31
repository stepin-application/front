// Configuration des URLs des services backend
export const API_CONFIG = {
  // Services principaux
  CAMPAIGN_SERVICE: process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE_URL || 'http://localhost:8082',
  JOB_SERVICE: process.env.NEXT_PUBLIC_JOB_SERVICE_URL || 'http://localhost:8081',
  AUTH_SERVICE: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8083',
  STUDENT_SERVICE: process.env.NEXT_PUBLIC_STUDENT_SERVICE_URL || 'http://localhost:8084',
  AI_MATCHING_SERVICE: process.env.NEXT_PUBLIC_AI_MATCHING_SERVICE_URL || 'http://localhost:8085',
  
  // Configuration pour développement
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Timeout configuration
  TIMEOUT: 10000,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Helper pour obtenir l'URL du bon service
export function getServiceUrl(service: 'campaign' | 'job' | 'auth' | 'student' | 'ai') {
  switch (service) {
    case 'campaign':
      return API_CONFIG.CAMPAIGN_SERVICE;
    case 'job':
      return API_CONFIG.JOB_SERVICE;
    case 'auth':
      return API_CONFIG.AUTH_SERVICE;
    case 'student':
      return API_CONFIG.STUDENT_SERVICE;
    case 'ai':
      return API_CONFIG.AI_MATCHING_SERVICE;
    default:
      throw new Error(`Unknown service: ${service}`);
  }
}

// Configuration CORS pour développement
export const CORS_CONFIG = {
  credentials: 'include',
  mode: 'cors' as RequestMode,
};
