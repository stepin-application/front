"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { jobOpenings } from "@/lib/api";

export default function EditCompanyJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [campaignStatus, setCampaignStatus] = useState<'OPEN' | 'LOCKED' | null>(null);
  const [companyDeadline, setCompanyDeadline] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contractType: '',
    duration: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
    requirements: [''],
    benefits: [''],
    tags: ['']
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const data = await jobOpenings.getById(String(id));
      setFormData({
        title: data.title || '',
        description: data.description || '',
        contractType: data.contractType || '',
        duration: data.duration || '',
        startDate: data.startDate?.split('T')[0] || '',
        endDate: data.endDate?.split('T')[0] || '',
        location: data.location || '',
        maxParticipants: data.maxParticipants?.toString() || '',
        requirements: data.requirements ? [data.requirements] : [''],
        benefits: data.benefits || [''],
        tags: data.tags || ['']
      });
      
      if (data.campaign) {
        setCampaignStatus(data.campaign.status);
        setCompanyDeadline(data.campaign.companyDeadline);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await jobOpenings.updateById(String(id), {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements.filter(Boolean).join('\n')
      });

      toast.success('Offre mise à jour !');
      router.push('/campaigns/company/me');
    } catch (error: any) {
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

  const isLocked = campaignStatus === 'LOCKED';
  const isDeadlinePassed = companyDeadline ? new Date(companyDeadline) < new Date() : false;
  const canEdit = !isLocked && !isDeadlinePassed;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/campaigns/company/me" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à mes offres
        </Link>

        {!canEdit && campaignStatus && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-medium">
              {isLocked ? '🔒 La campagne est verrouillée' : '⏰ La deadline est dépassée'}
            </p>
            <p className="text-sm text-red-600 mt-1">
              Vous ne pouvez plus modifier cette offre.
            </p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Modifier l'offre
          </h1>
          <p className="text-gray-500">
            Mettez à jour les informations de votre offre
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4 border-2 border-dashed border-gray-300 bg-white rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Informations principales</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre du poste
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                rows={6}
                required
                disabled={!canEdit}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type de contrat
                </label>
                <select
                  id="contractType"
                  value={formData.contractType}
                  onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                  disabled={!canEdit}
                >
                  <option value="">Sélectionner</option>
                  <option value="stage">Stage</option>
                  <option value="cdi">CDI</option>
                  <option value="cdd">CDD</option>
                  <option value="alternance">Alternance</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Durée
                </label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Ex: 6 mois"
                  required
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button type="submit" className="w-full" disabled={!canEdit}>
              Mettre à jour l'offre
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
