"use client"

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Users, Building, Upload, Plus, Trash2, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

function NewCompanyCampaignPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invitationId = searchParams.get('invitationId');
  const campaignId = searchParams.get('campaignId');
  const isInvitationResponse = !!invitationId;

  const [campaignInfo, setCampaignInfo] = useState<{ schoolName: string; campaignName: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contractType: '',
    duration: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
    image: null as File | null,
    requirements: [''],
    benefits: [''],
    tags: ['']
  });

  useEffect(() => {
    if (isInvitationResponse && campaignId) {
      fetchCampaignInfo();
    }
  }, [isInvitationResponse, campaignId]);

  const fetchCampaignInfo = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (!response.ok) throw new Error('Failed to fetch campaign info');
      const data = await response.json().catch(() => ({}));
      setCampaignInfo({
        schoolName: data?.school?.name || 'École',
        campaignName: data?.title || 'Campagne'
      });
    } catch (error) {
      console.error('Error fetching campaign info:', error);
    }
  };

  const tooltips = {
    title: "Le titre doit être clair et attractif, il sera la première chose que les candidats verront",
    description: "Décrivez en détail le poste, les missions, l'environnement de travail et les objectifs",
    contractType: "Type de contrat proposé (Stage, CDI, CDD, Alternance)",
    duration: "Durée du contrat (ex: 6 mois, 12 mois, Indéterminée)",
    startDate: "Date à laquelle le poste sera disponible",
    endDate: "Date limite de candidature",
    location: "Lieu de travail principal (présentiel, hybride, télétravail)",
    maxParticipants: "Nombre de postes à pourvoir pour cette campagne",
    image: "Une image représentative de votre entreprise ou du poste (format recommandé: 16:9)",
    requirements: "Compétences, expériences ou qualifications requises pour le poste",
    benefits: "Avantages proposés (salaire, RTT, tickets restaurant, mutuelle, etc.)",
    tags: "Mots-clés permettant de catégoriser et de retrouver facilement votre offre"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (isInvitationResponse && campaignId) {
        // Créer un job-opening pour une campagne école
        response = await fetch(`/api/campaigns/${campaignId}/companies/job-openings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Ajouter un poste à une campagne ouverte
        response = await fetch('/api/campaigns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create job opening');
      }

      toast.success(isInvitationResponse ? 'Poste ajouté avec succès !' : 'Poste ajouté à la campagne avec succès !');
      router.push(isInvitationResponse ? '/campaigns/company/invitations' : '/campaigns/company/me');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      // Messages d'erreur métier
      if (error.message.includes('locked')) {
        toast.error('Campaign is locked');
      } else if (error.message.includes('deadline')) {
        toast.error('Deadline passed');
      } else if (error.message.includes('not accepted')) {
        toast.error('Company not accepted for this campaign');
      } else {
        toast.error('Erreur lors de la création');
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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/campaigns" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux campagnes
        </Link>

        {isInvitationResponse && campaignInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              ℹ️ Vous répondez à l'invitation de <strong>{campaignInfo.schoolName}</strong> pour <strong>{campaignInfo.campaignName}</strong>
            </p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            {isInvitationResponse ? 'Ajouter vos postes' : 'Ajouter vos postes à la campagne'}
          </h1>
          <p className="text-gray-500">
            {isInvitationResponse 
              ? 'Proposez les postes que vous souhaitez offrir pour cet événement'
              : 'Proposez vos offres d\'emploi et de stage pour cette campagne de recrutement'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations principales */}
          <div className="space-y-4 border-2 border-dashed border-gray-300 bg-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Informations principales</h2>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                Titre du poste
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.title}
                  </div>
                </div>
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Stage développeur fullstack"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                Description
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.description}
                  </div>
                </div>
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez le poste, les missions et votre entreprise..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Type de contrat
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {tooltips.contractType}
                    </div>
                  </div>
                </label>
                <select
                  id="contractType"
                  value={formData.contractType}
                  onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="stage">Stage</option>
                  <option value="cdi">CDI</option>
                  <option value="cdd">CDD</option>
                  <option value="alternance">Alternance</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Durée
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {tooltips.duration}
                    </div>
                  </div>
                </label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Ex: 6 mois, 12 mois, Indéterminée"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Date de début
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {tooltips.startDate}
                    </div>
                  </div>
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Date de fin
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {tooltips.endDate}
                    </div>
                  </div>
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Localisation
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {tooltips.location}
                    </div>
                  </div>
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ex: Paris, France"
                  required
                />
              </div>
              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Nombre de postes
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {tooltips.maxParticipants}
                    </div>
                  </div>
                </label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                  placeholder="Ex: 2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-4 border-2 border-dashed bg-white border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                Image du poste
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.image}
                  </div>
                </div>
              </h2>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Glissez-déposez une image ou
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Parcourir
                </Button>
              </div>
            </div>
          </div>

          {/* Prérequis */}
          <div className="space-y-4 border-2 border-dashed bg-white border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                Prérequis
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.requirements}
                  </div>
                </div>
              </h2>
            </div>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  placeholder="Ex: 2 ans d'expérience en React"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('requirements', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('requirements')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un prérequis
            </Button>
          </div>

          {/* Avantages */}
          <div className="space-y-4 border-2 border-dashed bg-white border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                Avantages
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.benefits}
                  </div>
                </div>
              </h2>
            </div>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                  placeholder="Ex: Tickets restaurant"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('benefits', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('benefits')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un avantage
            </Button>
          </div>

          {/* Tags */}
          <div className="space-y-4 border-2 border-dashed bg-white border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                Domaines
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.tags}
                  </div>
                </div>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.filter(tag => tag).map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeArrayItem('tags', index)}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 ">
              <Input
                placeholder="Ex: Développement web"
                value={formData.tags[formData.tags.length - 1]}
                onChange={(e) => handleArrayChange('tags', formData.tags.length - 1, e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('tags')}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t">
            <Button type="submit" className="w-full">
              {isInvitationResponse ? 'Ajouter le poste' : 'Ajouter le poste à la campagne'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewCompanyCampaignPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewCompanyCampaignPageContent />
    </Suspense>
  );
}
