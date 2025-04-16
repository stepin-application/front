import { Company } from './companiesData';

export interface SchoolCampaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  image: string;
  status: 'draft' | 'active' | 'ended' | 'cancelled';
  requirements: string[];
  benefits: string[];
  tags: string[];
  invitedCompanies: Company[];
  createdAt: string;
  school: {
    id: string;
    name: string;
    logo: string;
  };
}

// Données exemple pour une école spécifique (ID: school_1)
export const schoolCampaignsData: SchoolCampaign[] = [
  {
    id: '1',
    title: 'Forum Entreprises 2024',
    description: 'Grand forum annuel réunissant les entreprises leaders du secteur technologique',
    startDate: '2024-03-15',
    endDate: '2024-03-16',
    location: 'Campus Paris',
    maxParticipants: 30,
    currentParticipants: 12,
    image: '/logos/google.png',
    status: 'active',
    requirements: [
      'Entreprise de plus de 50 employés',
      'Secteur technologique',
      'Possibilité de stages'
    ],
    benefits: [
      'Stand personnalisé',
      'Accès aux CV des étudiants',
      'Présentation entreprise'
    ],
    tags: ['Tech', 'Innovation', 'Stage'],
    invitedCompanies: [],
    createdAt: '2024-01-15',
    school: {
      id: 'school_1',
      name: 'École Supérieure du Numérique',
      logo: '/logos/google.png'
    }
  },
  {
    id: '2',
    title: 'Job Dating IA & Data',
    description: 'Session de recrutement spécialisée dans les domaines de l\'IA et de la Data Science',
    startDate: '2024-04-20',
    endDate: '2024-04-20',
    location: 'Campus Paris',
    maxParticipants: 15,
    currentParticipants: 5,
    image: '/logos/microsoft.png',
    status: 'active',
    requirements: [
      'Expertise en IA/Data',
      'Projets de recrutement actifs'
    ],
    benefits: [
      'Entretiens programmés',
      'Salle privée',
      'Cocktail networking'
    ],
    tags: ['IA', 'Data Science', 'Recrutement'],
    invitedCompanies: [],
    createdAt: '2024-02-01',
    school: {
      id: 'school_1',
      name: 'École Supérieure du Numérique',
      logo: '/logos/microsoft.png'
    }
  },
  {
    id: '3',
    title: 'Hackathon Innovation Durable',
    description: 'Challenge d\'innovation autour des problématiques environnementales',
    startDate: '2024-05-10',
    endDate: '2024-05-12',
    location: 'Campus Paris',
    maxParticipants: 20,
    currentParticipants: 0,
    image: '/logos/microsoft.png',
    status: 'draft',
    requirements: [
      'Engagement RSE',
      'Mentor technique disponible'
    ],
    benefits: [
      'Jury final',
      'Présentation des projets',
      'Communication dédiée'
    ],
    tags: ['Innovation', 'Développement Durable', 'Challenge'],
    invitedCompanies: [],
    createdAt: '2024-02-10',
    school: {
      id: 'school_1',
      name: 'École Supérieure du Numérique',
      logo: '/logos/microsoft.png'
    }
  }
]; 