"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Edit, Lock, Users, Eye, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StatusBadge from '@/components/campaigns/StatusBadge';
import { toast } from 'sonner';
import { getServiceUrl } from "@/config/api.config";
import { campaignParticipantsPath, schoolCampaignEditPath, schoolCampaignInvitePath } from '@/lib/utils';

interface Campaign {
  id: string;
  title: string;
  description: string;
  companyDeadline: string;
  studentDeadline: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'LOCKED';
  invitedCount: number;
  acceptedCount: number;
  createdAt: string;
  lockedAt?: string;
}

export default function SchoolCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const campaignBase = getServiceUrl("campaign");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      if (!localStorage.getItem("user")) {
        throw new Error("Utilisateur non identifié");
      }
      const raw = localStorage.getItem("user") || "{}";
      const parsed = JSON.parse(raw);
      const schoolId = parsed?.schoolId;
      if (!schoolId) {
        throw new Error("SchoolId manquant");
      }
      const response = await fetch(`${campaignBase}/campaigns/schools/${schoolId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) throw new Error('Failed');
      const data = await response.json().catch(() => []);
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
      setError("Impossible de charger les campagnes de l'école.");
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async (campaignId: string) => {
    if (!confirm('Verrouiller cette campagne ? Les entreprises ne pourront plus modifier leurs postes.')) return;
    
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/lock`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed');
      toast.success('Campagne verrouillée');
      fetchCampaigns();
    } catch (error) {
      toast.error('Erreur');
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
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Campagnes</h1>
            <p className="text-gray-600">Gérez vos événements de recrutement</p>
          </div>
          <Button onClick={() => router.push('/campaigns/school/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle campagne
          </Button>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune campagne</h3>
            <p className="text-gray-600 mb-4">Créez votre première campagne</p>
            <Button onClick={() => router.push('/campaigns/school/new')}>
              Créer une campagne
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{campaign.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        📅 {campaign.startDate || campaign.createdAt
                          ? new Date(campaign.startDate || campaign.createdAt).toLocaleDateString('fr-FR')
                          : '—'}
                      </span>
                      <span>⏰ Deadline entreprises: {new Date(campaign.companyDeadline).toLocaleDateString('fr-FR')}</span>
                      <span>Deadline etudiants: {new Date(campaign.studentDeadline).toLocaleDateString('fr-FR')}</span>
                      {campaign.lockedAt && (
                        <span>Clôture: {new Date(campaign.lockedAt).toLocaleDateString('fr-FR')}</span>
                      )}
                      <span>{campaign.invitedCount}</span>
                      <span className="text-green-600 font-medium">{campaign.acceptedCount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(schoolCampaignEditPath(campaign.id, campaign.title))}>
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm" disabled={campaign.status === 'LOCKED'} onClick={() => router.push(schoolCampaignEditPath(campaign.id, campaign.title))}>
                    <Edit className="w-4 h-4 mr-1" />
                    Éditer
                  </Button>
                  <Button variant="outline" size="sm" disabled={campaign.status === 'LOCKED'} onClick={() => router.push(schoolCampaignInvitePath(campaign.id, campaign.title))}>
                    <Users className="w-4 h-4 mr-1" />
                    Inviter
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push(campaignParticipantsPath(campaign.id, campaign.title))}>
                    <Users className="w-4 h-4 mr-1" />
                    Participants
                  </Button>
                  <Button variant="outline" size="sm" disabled={campaign.status === 'LOCKED'} onClick={() => handleLock(campaign.id)}>
                    <Lock className="w-4 h-4 mr-1" />
                    Verrouiller
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
