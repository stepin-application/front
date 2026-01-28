"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from '@/components/campaigns/StatusBadge';
import { toast } from 'sonner';
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
  createdAt?: string;
  campaign?: {
    id: string;
    title: string;
    status: 'OPEN' | 'LOCKED';
    deadline: string;
  };
}

export default function CompanyJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []); // Refresh jobs when component mounts

  const fetchJobs = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const companyId = storedUser ? JSON.parse(storedUser)?.companyId : null;
      if (!companyId) {
        console.log('No company ID found');
        setJobs([]);
        return;
      }

      const data = await jobOpenings.getByCompany(companyId);
      setJobs(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.log('No jobs found or error loading jobs:', error);
      // Always treat as empty state, never show errors
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
    
    try {
      await jobOpenings.deleteById(jobId);
      
      toast.success('Offre supprimée');
      fetchJobs();
    } catch (error: any) {
      if (error.message.includes('locked')) {
        toast.error('Campaign is locked');
      } else if (error.message.includes('deadline')) {
        toast.error('Deadline passed');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Offres</h1>
            <p className="text-gray-600">Gérez vos offres de recrutement</p>
          </div>
          <Button onClick={() => router.push('/campaigns/company/invitations')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle offre
          </Button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre d'emploi</h3>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore créé d'offres d'emploi. Commencez par créer votre première offre pour attirer les meilleurs talents.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/campaigns/company/invitations')}>
                <Plus className="w-4 h-4 mr-2" />
                Créer ma première offre
              </Button>
              <p className="text-sm text-gray-500">
                💡 Astuce : Consultez d'abord vos invitations pour répondre aux campagnes des écoles
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/campaigns/company/invitations')}
              >
                Voir mes invitations
              </Button>
            </div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => {
              const canEdit = !job.campaign || (job.campaign.status === 'OPEN' && new Date(job.campaign.deadline) > new Date());
              
              return (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <Badge variant="outline">{job.contractType}</Badge>
                        <Badge variant="outline">{job.duration}</Badge>
                      </div>
                      {job.campaign && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">Campagne:</span>
                          <span className="text-sm font-medium">{job.campaign.title}</span>
                          <StatusBadge status={job.campaign.status} />
                        </div>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/jobs/${job.id}`)}>
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm" disabled={!canEdit} onClick={() => router.push(`/campaigns/company/${job.id}/edit`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Éditer
                    </Button>
                    <Button variant="outline" size="sm" disabled={!canEdit} onClick={() => handleDelete(job.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
