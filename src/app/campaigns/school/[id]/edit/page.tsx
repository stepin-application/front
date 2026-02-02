"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getServiceUrl } from '@/config/api.config';
import { ArrowLeft, Plus, Trash2, Info, Search, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { companiesData, Company } from '@/data/companiesData';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';

export default function EditSchoolCampaignPage() {
  const { id: pathId } = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || (pathId as string);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [campaignStatus, setCampaignStatus] = useState<'OPEN' | 'LOCKED'>('OPEN');
  const [deadline, setDeadline] = useState('');
  const campaignBase = getServiceUrl("campaign");
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
    requirements: [''],
    benefits: [''],
    tags: [''],
    invitedCompanies: [] as Company[]
  });

  const [searchCompany, setSearchCompany] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'school') {
      router.push('/');
      return;
    }
    fetchCampaign();
  }, [id, user, router]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`${campaignBase}/campaigns/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch campaign');
      
      const data = await response.json().catch(() => ({}));
      setFormData({
        title: data?.name || data?.title || '',
        description: data?.description || '',
        startDate: data?.startDate ? data.startDate.split('T')[0] : '',
        endDate: data?.endDate ? data.endDate.split('T')[0] : '',
        location: data?.location || '',
        maxParticipants: data?.maxParticipants?.toString() || '',
        requirements: Array.isArray(data?.requirements) ? data.requirements : [''],
        benefits: Array.isArray(data?.benefits) ? data.benefits : [''],
        tags: Array.isArray(data?.tags) ? data.tags : [''],
        invitedCompanies: Array.isArray(data?.invitedCompanies) ? data.invitedCompanies : []
      });
      setSelectedCompanies(Array.isArray(data?.invitedCompanies) ? data.invitedCompanies : []);
      setCampaignStatus(data?.status || 'OPEN');
      setDeadline(data?.deadline || '');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement de la campagne');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast.success('Campagne mise à jour avec succès !');
      router.push('/campaigns/school/me');
    } catch (error: any) {
      console.error('Error:', error);
      if (error.message.includes('locked')) {
        toast.error('Campaign is locked');
      } else if (error.message.includes('deadline')) {
        toast.error('Deadline passed');
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    }
  };

  const handleArrayChange = (
    field: 'requirements' | 'benefits' | 'tags',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (field: 'requirements' | 'benefits' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'benefits' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const filteredCompanies = companiesData.filter(company =>
    company.name.toLowerCase().includes(searchCompany.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchCompany.toLowerCase()) ||
    company.location.toLowerCase().includes(searchCompany.toLowerCase())
  );

  const toggleCompanySelection = (company: Company) => {
    if (selectedCompanies.find(c => c.id === company.id)) {
      setSelectedCompanies(prev => prev.filter(c => c.id !== company.id));
    } else {
      setSelectedCompanies(prev => [...prev, company]);
    }
  };

  const isLocked = campaignStatus === 'LOCKED';
  const isDeadlinePassed = new Date(deadline) < new Date();
  const canEdit = !isLocked && !isDeadlinePassed;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/campaigns/school/me" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à mes campagnes
        </Link>

        {!canEdit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-medium">
              {isLocked ? '🔒 Cette campagne est verrouillée' : '⏰ La deadline est dépassée'}
            </p>
            <p className="text-sm text-red-600 mt-1">
              Vous ne pouvez plus modifier cette campagne.
            </p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Modifier la campagne
          </h1>
          <p className="text-gray-500">
            Mettez à jour les informations de votre événement
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Même structure que le formulaire de création */}
          <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Informations principales</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre de la campagne
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Forum entreprises 2024"
                required
                disabled={!canEdit}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez l'événement..."
                rows={6}
                required
                disabled={!canEdit}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ex: Campus de Paris"
                  required
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre d'entreprises max
                </label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                  placeholder="Ex: 20"
                  required
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t">
            <Button type="submit" className="w-full" disabled={!canEdit}>
              Mettre à jour la campagne
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
