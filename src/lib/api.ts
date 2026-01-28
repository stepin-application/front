// Service API centralisé avec support multi-services
import { getServiceUrl, API_CONFIG } from "@/config/api.config";

function getAuthHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const error = await response.json();
        message = error?.message || message;
      } else {
        const text = await response.text();
        if (text) {
          message = text;
        }
      }
    } catch {
      // Fallback to generic status message
    }
    throw new Error(message);
  }
  if (response.status === 204) {
    return null;
  }
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

// Helper pour retry avec délai exponentiel
async function retryRequest<T>(
  fn: () => Promise<T>,
  attempts = API_CONFIG.RETRY_ATTEMPTS,
  delay = API_CONFIG.RETRY_DELAY,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(fn, attempts - 1, delay * 2);
  }
}

// API générique pour un service spécifique
function createApiClient(service: "campaign" | "job" | "auth" | "student") {
  const baseUrl = getServiceUrl(service);

  return {
    get: (url: string) =>
      retryRequest(() =>
        fetch(`${baseUrl}${url}`, {
          headers: getAuthHeaders(),
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        }).then(handleResponse),
      ),

    post: (url: string, data?: any) =>
      retryRequest(() =>
        fetch(`${baseUrl}${url}`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: data ? JSON.stringify(data) : undefined,
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        }).then(handleResponse),
      ),

    put: (url: string, data?: any) =>
      retryRequest(() =>
        fetch(`${baseUrl}${url}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: data ? JSON.stringify(data) : undefined,
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        }).then(handleResponse),
      ),

    delete: (url: string) =>
      retryRequest(() =>
        fetch(`${baseUrl}${url}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        }).then(handleResponse),
      ),

    // Support pour l'upload de fichiers
    upload: (url: string, formData: FormData) =>
      retryRequest(() =>
        fetch(`${baseUrl}${url}`, {
          method: "POST",
          headers: {
            // Ne pas spécifier Content-Type pour les fichiers FormData
            ...(getAuthHeaders().Authorization && {
              Authorization: getAuthHeaders().Authorization,
            }),
          },
          body: formData,
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT * 2), // Timeout plus long pour les uploads
        }).then(handleResponse),
      ),
  };
}

// Création des clients pour chaque service
export const campaignApi = createApiClient("campaign");
export const jobApi = createApiClient("job");
export const authApi = createApiClient("auth");
export const studentApi = createApiClient("student");

// Campagnes - Service Campaign (port 8082)
export const campaigns = {
  create: (data: any) => campaignApi.post("/campaigns", data),
  getAll: (params?: { status?: string; limit?: number; offset?: number }) =>
    campaignApi.get(
      `/campaigns${params ? "?" + new URLSearchParams(params as any).toString() : ""}`,
    ),
  getById: (id: string) => campaignApi.get(`/campaigns/${id}`),
  update: (id: string, data: any) => campaignApi.put(`/campaigns/${id}`, data),
  delete: (id: string) => campaignApi.delete(`/campaigns/${id}`),
  lock: (id: string) => campaignApi.put(`/campaigns/${id}/lock`),
  getParticipants: (id: string) =>
    campaignApi.get(`/campaigns/${id}/participants`),
  getMyCampaigns: () => campaignApi.get("/schools/me/campaigns"),
  getActiveCampaigns: () => campaignApi.get("/campaigns/active"),
};

// Job Openings - Service Job (port 8081)
export const jobOpenings = {
  create: (campaignId: string, companyId: string, data: any) =>
    jobApi.post(
      `/campaigns/${campaignId}/companies/${companyId}/job-openings`,
      data,
    ),
  getByCompany: (companyId: string) =>
    jobApi.get(`/companies/${companyId}/job-openings`),
  getByCampaign: (campaignId: string) =>
    jobApi.get(`/campaigns/${campaignId}/job-openings`),
  getById: (jobId: string) => jobApi.get(`/job-openings/${jobId}`),
  getAll: (params?: {
    campaignId?: string;
    companyId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    if (!params?.campaignId || !params?.companyId) {
      throw new Error("campaignId and companyId are required for job openings");
    }
    return jobApi.get(
      `/campaigns/${params.campaignId}/companies/${params.companyId}/job-openings${
        params.status || params.limit || params.offset
          ? "?" +
            new URLSearchParams({
              ...(params.status && { status: params.status }),
              ...(params.limit && { limit: params.limit.toString() }),
              ...(params.offset && { offset: params.offset.toString() }),
            } as any).toString()
          : ""
      }`,
    );
  },
  updateById: (jobId: string, data: any) =>
    jobApi.put(`/job-openings/${jobId}`, data),
  update: (campaignId: string, companyId: string, jobId: string, data: any) =>
    jobApi.put(
      `/campaigns/${campaignId}/companies/${companyId}/job-openings/${jobId}`,
      data,
    ),
  deleteById: (jobId: string) => jobApi.delete(`/job-openings/${jobId}`),
  delete: (campaignId: string, companyId: string, jobId: string) =>
    jobApi.delete(
      `/campaigns/${campaignId}/companies/${companyId}/job-openings/${jobId}`,
    ),
  // getMyJobs: () => jobApi.get('/api/companies/me/job-openings'), // Commenté - endpoint n'existe pas
  apply: (
    campaignId: string,
    companyId: string,
    jobId: string,
    data: { candidateInfo: any; cv?: File },
  ) => {
    const formData = new FormData();
    formData.append("candidateInfo", JSON.stringify(data.candidateInfo));
    if (data.cv) {
      formData.append("cv", data.cv);
    }
    return jobApi.upload(
      `/campaigns/${campaignId}/companies/${companyId}/job-openings/${jobId}/applications`,
      formData,
    );
  },
  getApplications: (jobId: string) =>
    jobApi.get(`/api/job-openings/${jobId}/applications`),
};

// Invitations
export const invitations = {
  create: (campaignId: string, companyId: string) =>
    campaignApi.post(`/campaigns/${campaignId}/invitations`, { companyId }),
  listByCampaign: (campaignId: string) =>
    campaignApi.get(`/campaigns/${campaignId}/invitations`),
  getByToken: (token: string) => campaignApi.get(`/invitations/${token}`),
  getByCompany: (companyId: string) =>
    campaignApi.get(`/companies/${companyId}/invitations`),
  accept: (campaignId: string, companyId: string) =>
    campaignApi.post(
      `/campaigns/${campaignId}/companies/${companyId}/accept`,
      {},
    ),
  refuse: (campaignId: string, companyId: string) =>
    campaignApi.post(
      `/campaigns/${campaignId}/companies/${companyId}/refuse`,
      {},
    ),
};

export const directory = {
  getSchools: () => campaignApi.get("/admin/schools"),
  getCompanies: () => campaignApi.get("/admin/companies"),
};

// Authentication - Service Auth (port 8083) - À implémenter
export const auth = {
  login: (email: string, password: string) =>
    authApi.post("/auth/login", { email, password }),
  register: (data: any) => authApi.post("/auth/register", data),
  logout: () => authApi.post("/auth/logout"),
  refreshToken: (refreshToken: string) =>
    authApi.post("/auth/refresh", { refreshToken }),
  forgotPassword: (email: string) =>
    authApi.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    authApi.post("/auth/reset-password", { token, password }),
  verifyEmail: (token: string) => authApi.post("/auth/verify-email", { token }),
  getProfile: () => authApi.get("/auth/profile"),
};

// Student Profiles - Service Student (port 8084)
export const studentProfiles = {
  create: (data: any) => studentApi.post("/api/students/profile", data),
  get: (studentId?: string) => 
    studentApi.get(studentId ? `/api/students/${studentId}/profile` : "/api/students/me/profile"),
  update: (data: any, studentId?: string) => 
    studentApi.put(studentId ? `/api/students/${studentId}/profile` : "/api/students/me/profile", data),
  delete: (studentId?: string) => 
    studentApi.delete(studentId ? `/api/students/${studentId}/profile` : "/api/students/me/profile"),
  exists: () => studentApi.get("/api/students/me/profile/exists"),
  // Pour le matching AI - récupérer tous les profils d'une campagne
  getByCampaign: (campaignId: string) => 
    studentApi.get(`/api/campaigns/${campaignId}/students/profiles`),
  // Récupérer tous les profils complétés pour l'AI matching
  getCompleted: () => studentApi.get("/api/students/profiles/completed"),
  // Récupérer profils par batch d'IDs (pour AI matching)
  getByIds: (studentIds: string[]) => 
    studentApi.post("/api/students/profiles/batch", studentIds),
  // Recherche de profils avec filtres
  search: (filters?: {
    skill?: string;
    location?: string;
    jobType?: string;
    graduationYear?: string;
    school?: string;
    completedOnly?: boolean;
  }) => {
    const params = filters ? "?" + new URLSearchParams(filters as any).toString() : "";
    return studentApi.get(`/api/students/profiles/search${params}`);
  },
  // Statistiques des profils
  getStats: () => studentApi.get("/api/students/profiles/stats"),
};

// Export pour compatibilité avec le code existant
export const api = {
  get: (url: string) => campaignApi.get(url), // Par défaut, utilise campaign service
  post: (url: string, data?: any) => campaignApi.post(url, data),
  put: (url: string, data?: any) => campaignApi.put(url, data),
  delete: (url: string) => campaignApi.delete(url),
};

// Legacy exports pour compatibilité
export const campaignApiLegacy = {
  create: campaigns.create,
  getById: campaigns.getById,
  update: campaigns.update,
  lock: campaigns.lock,
  getParticipants: campaigns.getParticipants,
  getMyCampaigns: campaigns.getMyCampaigns,
};

export const invitationApi = invitations;
export const jobOpeningApi = jobOpenings;
export const authApiLegacy = auth;
