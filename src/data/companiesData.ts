export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
}

export const companiesData: Company[] = [
  {
    id: '1',
    name: 'TechVision',
    logo: '/logos/google.png',
    industry: 'Technologies',
    size: '50-200 employés',
    location: 'Paris'
  },
  {
    id: '2',
    name: 'InnovCorp',
    logo: '/logos/google.png',
    industry: 'Conseil',
    size: '200-500 employés',
    location: 'Lyon'
  },
  {
    id: '3',
    name: 'DataSphere',
    logo: '/logos/google.png',
    industry: 'Data & IA',
    size: '100-250 employés',
    location: 'Nantes'
  },
  {
    id: '4',
    name: 'GreenTech Solutions',
    logo: '/logos/greentech.png',
    industry: 'Développement durable',
    size: '20-50 employés',
    location: 'Bordeaux'
  },
  {
    id: '5',
    name: 'FinancePlus',
    logo: '/logos/google.png',
    industry: 'Finance',
    size: '500+ employés',
    location: 'Paris'
  }
]; 