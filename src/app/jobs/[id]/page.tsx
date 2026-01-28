"use client"

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Building, Clock, Briefcase, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { jobOpenings } from "@/lib/api";

interface JobOpening {
  id: string;
  campaignId?: string;
  companyId?: string;
  title: string;
  description: string;
  contractType?: string;
  duration?: string;
  location?: string;
  maxParticipants?: number;
  requirements?: string;
  benefits?: string;
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchJob = async () => {
      try {
        const jobData = await jobOpenings.getById(String(id));
        setJob(jobData);
      } catch (error: any) {
        console.error('Error fetching job:', error);
        setError('Offre d\'emploi non trouvée');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Offre non trouvée
          </h1>
          <p className="text-gray-500 mb-6">
            Cette offre d'emploi n'existe pas ou a été supprimée.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const requirements = job.requirements ? job.requirements.split('\n').filter(Boolean) : [];
  const benefits = job.benefits ? job.benefits.split('\n').filter(Boolean) : [];
  const tags = job.tags ? job.tags.split(',').filter(Boolean) : [];

  const canApply = user?.role === 'student';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{job.contractType || 'Stage'}</Badge>
                  {job.duration && <Badge variant="outline">{job.duration}</Badge>}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    <span>Entreprise</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {canApply && (
                <Link href={`/jobs/${job.id}/apply`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Candidater
                  </Button>
                </Link>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 text-gray-500 mr-1" />
                </div>
                <p className="text-sm font-medium text-gray-900">{job.contractType || 'Stage'}</p>
                <p className="text-xs text-gray-500">Type de contrat</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="w-4 h-4 text-gray-500 mr-1" />
                </div>
                <p className="text-sm font-medium text-gray-900">{job.duration || 'Non spécifiée'}</p>
                <p className="text-xs text-gray-500">Durée</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-gray-500 mr-1" />
                </div>
                <p className="text-sm font-medium text-gray-900">{job.maxParticipants || 1} poste{(job.maxParticipants || 1) > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-500">À pourvoir</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du poste</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Prérequis</h2>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Avantages</h2>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Apply Card */}
            {canApply && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidater</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Intéressé par cette offre ? Postulez dès maintenant !
                </p>
                <Link href={`/jobs/${job.id}/apply`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Candidater maintenant
                  </Button>
                </Link>
              </div>
            )}

            {/* Job Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Type de contrat</p>
                  <p className="text-gray-900">{job.contractType || 'Stage'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Durée</p>
                  <p className="text-gray-900">{job.duration || 'Non spécifiée'}</p>
                </div>
                {job.location && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Localisation</p>
                    <p className="text-gray-900">{job.location}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Postes à pourvoir</p>
                  <p className="text-gray-900">{job.maxParticipants || 1}</p>
                </div>
                {job.createdAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Publié le</p>
                    <p className="text-gray-900">{new Date(job.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Domaines</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign Link */}
            {job.campaignId && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campagne</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Cette offre fait partie d'une campagne de recrutement.
                </p>
                <Link href={`/campaigns/${job.campaignId}`}>
                  <Button variant="outline" className="w-full">
                    Voir la campagne
                  </Button>
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}