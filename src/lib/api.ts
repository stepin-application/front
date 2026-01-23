// Service API centralisé

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

// API générique
export const api = {
  get: (url: string) =>
    fetch(`${API_BASE_URL}${url}`, {
      headers: getAuthHeaders()
    }).then(handleResponse),

  post: (url: string, data?: any) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    }).then(handleResponse),

  put: (url: string, data?: any) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    }).then(handleResponse),

  delete: (url: string) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse)
};

// Campagnes
export const campaignApi = {
  create: (data: any) =>
    fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  getById: (id: string) =>
    fetch(`${API_BASE_URL}/campaigns/${id}`, {
      headers: getAuthHeaders()
    }).then(handleResponse),

  update: (id: string, data: any) =>
    fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  lock: (id: string) =>
    fetch(`${API_BASE_URL}/campaigns/${id}/lock`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),

  getParticipants: (id: string) =>
    fetch(`${API_BASE_URL}/campaigns/${id}/participants`, {
      headers: getAuthHeaders()
    }).then(handleResponse),

  getMyCampaigns: () =>
    fetch(`${API_BASE_URL}/schools/me/campaigns`, {
      headers: getAuthHeaders()
    }).then(handleResponse)
};

// Invitations
export const invitationApi = {
  create: (campaignId: string, companyId: string) =>
    fetch(`${API_BASE_URL}/campaigns/${campaignId}/invitations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ companyId })
    }).then(handleResponse),

  getByToken: (token: string) =>
    fetch(`${API_BASE_URL}/invitations/${token}`, {
      headers: getAuthHeaders()
    }).then(handleResponse),

  accept: (campaignId: string, token: string) =>
    fetch(`${API_BASE_URL}/campaigns/${campaignId}/companies/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ invitationToken: token })
    }).then(handleResponse),

  refuse: (campaignId: string, token: string) =>
    fetch(`${API_BASE_URL}/campaigns/${campaignId}/companies/refuse`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ invitationToken: token })
    }).then(handleResponse),

  getMyInvitations: () =>
    fetch(`${API_BASE_URL}/companies/me/invitations`, {
      headers: getAuthHeaders()
    }).then(handleResponse)
};

// Job Openings
export const jobOpeningApi = {
  create: (campaignId: string, data: any) =>
    fetch(`${API_BASE_URL}/campaigns/${campaignId}/companies/job-openings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  getById: (id: string) =>
    fetch(`${API_BASE_URL}/job-openings/${id}`, {
      headers: getAuthHeaders()
    }).then(handleResponse),

  update: (id: string, data: any) =>
    fetch(`${API_BASE_URL}/job-openings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  delete: (id: string) =>
    fetch(`${API_BASE_URL}/job-openings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse),

  getMyJobs: () =>
    fetch(`${API_BASE_URL}/companies/me/job-openings`, {
      headers: getAuthHeaders()
    }).then(handleResponse)
};

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(handleResponse),

  register: (data: any) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse)
};
