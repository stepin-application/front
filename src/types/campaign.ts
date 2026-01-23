// Types partagés pour les campagnes

export type CampaignStatus = 'OPEN' | 'LOCKED' | 'CLOSED' | 'active' | 'upcoming' | 'closed' | 'matching' | 'completed';
export type InvitationStatus = 'INVITED' | 'ACCEPTED' | 'REFUSED';
export type UserRole = 'school' | 'company' | 'student';
export type ContractType = 'stage' | 'cdi' | 'cdd' | 'alternance';
export type ApplicationStatus = 'submitted' | 'reviewed' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected';

export interface School {
  id: string;
  name: string;
  logo: string;
  location?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  // Deux deadlines distinctes
  companyDeadline: string; // Deadline pour les entreprises de répondre aux invitations
  studentDeadline: string; // Deadline pour les étudiants de candidater
  startDate: string;
  endDate: string;
  location: string;
  status: CampaignStatus;
  maxParticipants?: number;
  participants: number;
  type: 'school' | 'company';
  target: 'students' | 'companies' | 'both';
  createdBy: School | Company;
  // Liste d'emails d'entreprises à notifier lors de la création
  invitedCompanyEmails: string[];
  // Entreprises qui ont répondu à l'invitation
  respondedCompanies: Company[];
  createdAt?: string;
  updatedAt?: string;
  requirements?: string[];
  benefits?: string[];
  tags: string[];
  image?: string;
  // Informations pour le matching ML
  matchingCompleted?: boolean;
  matchingResults?: MatchingResult[];
}

export interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  school: {
    id: string;
    name: string;
  };
  profile: {
    skills: string[];
    experience: string[];
    education: string;
    cv?: string;
    portfolio?: string;
  };
  preferences: {
    jobTypes: ContractType[];
    locations: string[];
    salaryRange?: {
      min: number;
      max: number;
    };
  };
}

export interface StudentApplication {
  id: string;
  campaignId: string;
  jobOpeningId: string;
  studentId: string;
  status: ApplicationStatus;
  cvUrl: string;
  coverLetter: string;
  submittedAt: string;
  lastUpdated: string;
  companyFeedback?: string;
  interviewDate?: string;
  matchScore?: number; // Score ML pour le matching
  teamsLink?: string; // Lien Teams pour l'entretien
}

export interface Invitation {
  id: string;
  token: string;
  status: InvitationStatus;
  invitedAt: string;
  respondedAt?: string;
  campaign: Campaign;
  company: Company;
  jobOpeningsCount?: number;
}

export interface JobOpening {
  id: string;
  title: string;
  description: string;
  contractType: ContractType;
  duration: string;
  location: string;
  maxParticipants: number;
  startDate?: string;
  endDate?: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  campaign?: {
    id: string;
    title: string;
    status: CampaignStatus;
    companyDeadline: string;
    studentDeadline: string;
  };
  company: Company;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  schoolId?: string;
}
// Interface pour les résultats de matching ML
export interface MatchingResult {
  studentId: string;
  jobOpeningId: string;
  matchScore: number;
  reasons: string[];
  teamsLink?: string;
  interviewScheduled?: boolean;
}

// Interface pour les filtres de recherche étudiants
export interface StudentFilters {
  location?: string[];
  contractType?: ContractType[];
  industry?: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  companySize?: string[];
}

// Interface pour les notifications
export interface Notification {
  id: string;
  userId: string;
  type: 'application_status' | 'new_campaign' | 'interview_scheduled' | 'campaign_deadline' | 'matching_result';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}