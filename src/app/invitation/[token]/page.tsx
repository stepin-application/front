"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Calendar, MapPin, Users, Building } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import StatusBadge from '@/components/campaigns/StatusBadge';
import DeadlineWarning from '@/components/campaigns/DeadlineWarning';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  title: string;
  description: string;
  companyDeadline: string;
  studentDeadline: string;
  startDate: string;
  endDate?: string;
  location: string;
  status: 'OPEN' | 'LOCKED';
  school: {
    id: string;
    name: string;
    logo: string;
  };
  benefits: string[];
  requirements: string[];
}

export default function InvitationPage() {
  const { token } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    fetchInvitationDetails();
  }, [token]);

  const fetchInvitationDetails = async () => {
    try {
      // TODO: Remplacer par vrai appel API
      const response = await fetch(`/api/invitations/${token}`);
      if (!response.ok) throw new Error('Invitation not found');
      
      const data = await response.json();
      setCampaign(data.campaign);
    } catch (error) {
      console.error('Error fetching invitation:', error);
      toast.error('Invitation introuvable ou expirée');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!campaign) return;
    
    setResponding(true);
    try {
      // Appel API pour accepter l'invitation
      const response = await fetch(`/api/campaigns/${campaign.id}/companies/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ invitationToken: token })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to accept invitation');
      }

      toast.success('Invitation acceptée ! Ajoutez maintenant vos postes');
      
      // Redirect vers formulaire avec invitationId
      router.push(`/campaigns/company/new?invitationId=${token}&campaignId=${campaign.id}`);
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      
      // Messages d'erreur métier
      if (error.message.includes('locked')) {
        toast.error('Campaign is locked');
      } else if (error.message.includes('deadline')) {
        toast.error('Deadline passed');
      } else {
        toast.error('Erreur lors de l\'acceptation de l\'invitation');
      }
    } finally {
      setResponding(false);
    }
  };

  const handleRefuse = async () => {
    if (!campaign) return;
    
    setResponding(true);
    try {
      // Appel API pour refuser l'invitation
      const response = await fetch(`/api/campaigns/${campaign.id}/companies/refuse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ invitationToken: token })
      });

      if (!response.ok) throw new Error('Failed to refuse invitation');

      toast.success('Invitation refusée');
      router.push('/campaigns/company/invitations');
    } catch (error) {
      console.error('Error refusing invitation:', error);
      toast.error('Erreur lors du refus de l\'invitation');
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Invitation introuvable
          </h1>
          <p className="text-gray-500 mb-6">
            Cette invitation n'existe pas ou a expiré.
          </p>
          <Link href="/campaigns">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux campagnes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = new Date(campaign.companyDeadline) < new Date();
  const isLocked = campaign.status === 'LOCKED';
  const canRespond = !isDeadlinePassed && !isLocked;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/campaigns/company/invitations" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à mes invitations
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Building className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-purple-100 text-sm">Invitation de</p>
                <h2 className="text-2xl font-bold">{campaign.school.name}</h2>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
            <div className="flex items-center gap-4 text-purple-100">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(campaign.studentDeadline).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{campaign.location}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Status & Deadline */}
            <div className="flex items-center gap-4">
              <StatusBadge status={campaign.status} />
              <div className="flex-1">
                <DeadlineWarning deadline={campaign.companyDeadline} />
              </div>
            </div>

            {!canRespond && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">
                  {isLocked ? '🔒 Cette campagne est verrouillée' : '⏰ La deadline est dépassée'}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Vous ne pouvez plus répondre à cette invitation.
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">À propos de l'événement</h3>
              <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
            </div>

            {/* Benefits */}
            {campaign.benefits && campaign.benefits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Avantages pour votre entreprise</h3>
                <ul className="grid grid-cols-2 gap-3">
                  {campaign.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {campaign.requirements && campaign.requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Prérequis</h3>
                <ul className="space-y-2">
                  {campaign.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Users className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deadline info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Deadline de participation :</strong> {new Date(campaign.companyDeadline).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Vous devez accepter l'invitation et ajouter vos postes avant cette date.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleRefuse}
                disabled={responding || !canRespond}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Refuser l'invitation
              </Button>
              <Button
                onClick={handleAccept}
                disabled={responding || !canRespond}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accepter et proposer des postes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
