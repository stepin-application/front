export interface CompanyCampaign {
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
  createdAt: string;
  company: {
    id: string;
    name: string;
    logo: string;
    industry: string;
  };
}

// Données exemple pour une entreprise spécifique (ID: company_1)
export const companyCampaignsData: CompanyCampaign[] = [
  {
    id: '1',
    title: 'Stage développeur fullstack',
    description: 'Nous recherchons un développeur fullstack pour un stage de 6 mois. Vous travaillerez sur nos projets innovants avec notre équipe technique.',
    startDate: '2024-04-01',
    endDate: '2024-09-30',
    location: 'Paris, France',
    maxParticipants: 2,
    currentParticipants: 0,
    image: '/campaigns/dev-stage.jpg',
    status: 'active',
    requirements: [
      'Étudiant en informatique Bac+4/5',
      'Connaissances en React et Node.js',
      'Autonomie et esprit d\'équipe'
    ],
    benefits: [
      'Rémunération attractive',
      'Possibilité d\'embauche',
      'Environnement de travail stimulant'
    ],
    tags: ['Développement web', 'Stage', 'Fullstack'],
    createdAt: '2024-02-10',
    company: {
      id: 'company_1',
      name: 'TechVision',
      logo: '/logos/google.png',
      industry: 'Technologies'
    }
  },
  {
    id: '2',
    title: 'Alternance Marketing Digital',
    description: 'Rejoignez notre équipe marketing pour une alternance d\'un an. Vous participerez à l\'élaboration et à la mise en œuvre de notre stratégie digitale.',
    startDate: '2024-09-01',
    endDate: '2025-08-31',
    location: 'Paris, France',
    maxParticipants: 1,
    currentParticipants: 0,
    image: '/campaigns/marketing.jpg',
    status: 'draft',
    requirements: [
      'Formation en marketing ou communication',
      'Maîtrise des outils digitaux',
      'Créativité et rigueur'
    ],
    benefits: [
      'Formation sur les derniers outils',
      'Responsabilités réelles',
      'Ambiance startup'
    ],
    tags: ['Marketing', 'Alternance', 'Digital'],
    createdAt: '2024-03-05',
    company: {
      id: 'company_1',
      name: 'TechVision',
      logo: '/logos/google.png',
      industry: 'Technologies'
    }
  },
  {
    id: '3',
    title: 'CDI Ingénieur DevOps',
    description: 'Dans le cadre de notre expansion, nous recrutons un ingénieur DevOps expérimenté pour renforcer notre équipe technique.',
    startDate: '2024-03-15',
    endDate: '2024-06-15',
    location: 'Remote / Paris',
    maxParticipants: 1,
    currentParticipants: 0,
    image: '/campaigns/devops.jpg',
    status: 'active',
    requirements: [
      'Expérience de 3+ ans en DevOps',
      'Maîtrise de Docker, Kubernetes',
      'Connaissance des environnements cloud (AWS, GCP)'
    ],
    benefits: [
      'Salaire compétitif',
      'Remote possible',
      'Technologies de pointe'
    ],
    tags: ['DevOps', 'CDI', 'Cloud'],
    createdAt: '2024-02-28',
    company: {
      id: 'company_1',
      name: 'TechVision',
      logo: '/logos/google.png',
      industry: 'Technologies'
    }
  }
]; 