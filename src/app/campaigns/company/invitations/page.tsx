"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Building, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from '@/components/campaigns/StatusBadge';
import DeadlineWarning from '@/components/campaigns/DeadlineWarning';

type InvitationStatus = 'INVITED' | 'ACCEPTED' | 'REFUSED';

interface Invitation {
  id: string;
  token: string;
  status: InvitationStatus;
  invitedAt: string;
  respondedAt?: string;
  campaign: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    startDate: string;
    endDate: string;
    location: string;
    status: 'OPEN' | 'LOCKED';
    school: {
      id: string;
      name: string;
      logo: string;
    };
  };
  jobOpeningsCount?: number;
}

export default function CompanyInvitationsPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | InvitationStatus>('all');

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      // TODO: Remplacer par vrai appel API
      const response = await fetch('/api/companies/me/invitations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch invitations');
      
      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvitations = invitations.filter(inv => 
    filter === 'all' || inv.status === filter
  );

  const getStatusConfig = (status: InvitationStatus) => {
    const configs = {
      INVITED: {
        label: 'En attente',
        icon: Clock,
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
      },
      ACCEPTED: {
        label: 'Acceptée',
        icon: CheckCircle,
        className: 'bg-green-50 text-green-700 border-green-200'
      },
      REFUSED: {
        label: 'Refusée',
        icon: XCircle,
        className: 'bg-red-50 text-red-700 border-red-200'
      }
    };
    return configs[status];
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Invitations</h1>
          <p className="text-gray-600">
            Gérez les invitations aux campagnes de recrutement des écoles partenaires
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Toutes ({invitations.length})
          </Button>
          <Button
            variant={filter === 'INVITED' ? 'default' : 'outline'}
            onClick={() => setFilter('INVITED')}
            size="sm"
          >
            En attente ({invitations.filter(i => i.status === 'INVITED').length})
          </Button>
          <Button
            variant={filter === 'ACCEPTED' ? 'default' : 'outline'}
            onClick={() => setFilter('ACCEPTED')}
            size="sm"
          >
            Acceptées ({invitations.filter(i => i.status === 'ACCEPTED').length})
          </Button>
          <Button
            variant={filter === 'REFUSED' ? 'default' : 'outline'}
            onClick={() => setFilter('REFUSED')}
            size="sm"
          >
            Refusées ({invitations.filter(i => i.status === 'REFUSED').length})
          </Button>
        </div>

        {/* Invitations List */}
        {filteredInvitations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune invitation
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "Vous n'avez pas encore reçu d'invitation"
                : `Aucune invitation ${filter === 'INVITED' ? 'en attente' : filter === 'ACCEPTED' ? 'acceptée' : 'refusée'}`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvitations.map((invitation, index) => {
              const statusConfig = getStatusConfig(invitation.status);
              const StatusIcon = statusConfig.icon;
              const isDeadlinePassed = new Date(invitation.campaign.deadline) < new Date();
              const canRespond = invitation.status === 'INVITED' && !isDeadlinePassed && invitation.campaign.status === 'OPEN';

              return (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${statusConfig.className} text-xs font-medium flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </Badge>
                            <StatusBadge status={invitation.campaign.status} />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {invitation.campaign.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Invitation de <strong>{invitation.campaign.school.name}</strong>
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(invitation.campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(invitation.campaign.endDate).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{invitation.campaign.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {invitation.status === 'INVITED' && (
                      <div className="mb-4">
                        <DeadlineWarning deadline={invitation.campaign.deadline} />
                      </div>
                    )}

                    {invitation.status === 'ACCEPTED' && invitation.jobOpeningsCount !== undefined && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-green-800">
                          ✅ Vous avez proposé <strong>{invitation.jobOpeningsCount} poste{invitation.jobOpeningsCount > 1 ? 's' : ''}</strong> pour cet événement
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/campaigns/${invitation.campaign.id}`)}
                      >
                        Voir détails
                      </Button>
                      
                      {invitation.status === 'INVITED' && canRespond && (
                        <Button
                          size="sm"
                          onClick={() => router.push(`/invitation/${invitation.token}`)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                          Répondre à l'invitation
                        </Button>
                      )}
                      
                      {invitation.status === 'ACCEPTED' && invitation.campaign.status === 'OPEN' && !isDeadlinePassed && (
                        <Button
                          size="sm"
                          onClick={() => router.push(`/campaigns/company/new?invitationId=${invitation.token}&campaignId=${invitation.campaign.id}`)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter un poste
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
