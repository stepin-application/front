"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Calendar, MapPin, Users, Filter, ArrowUpDown, Briefcase, GraduationCap, Building } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { companyCampaignsData, CompanyCampaign } from '@/data/companyCampaignsData';
import { schoolCampaignsData, SchoolCampaign } from '@/data/schoolCampaignsData';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// TODO: À remplacer par l'ID de l'entreprise connectée
const COMPANY_ID = 'company_1';

export default function CompanyCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CompanyCampaign['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'participants'>('date');
  const [activeTab, setActiveTab] = useState<'my-offers' | 'invitations'>('my-offers');

  // Filtrer les campagnes de l'entreprise connectée
  const companyCampaigns = companyCampaignsData.filter(campaign => 
    campaign.company.id === COMPANY_ID
  );

  // TODO: Remplacer cette logique simulée par une vraie API
  // Pour l'instant, on simule que l'entreprise est invitée à certaines campagnes d'école
  const invitedCampaigns = schoolCampaignsData.slice(0, 2).map(campaign => ({
    ...campaign,
    // Simuler un statut d'invitation
    invitationStatus: Math.random() > 0.5 ? 'pending' : 'accepted' as 'pending' | 'accepted' | 'declined'
  }));

  // Filtrer par recherche et status pour les offres de l'entreprise
  const filteredCampaigns = companyCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filtrer par recherche pour les invitations (pas de filtre de statut ici)
  const filteredInvitations = invitedCampaigns.filter(invitation => 
    invitation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invitation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invitation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Trier les campagnes
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else {
      return (b.currentParticipants / b.maxParticipants) - (a.currentParticipants / a.maxParticipants);
    }
  });

  // Trier les invitations par date
  const sortedInvitations = [...filteredInvitations].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Statistiques pour mes offres
  const myOffersStats = {
    total: companyCampaigns.length,
    active: companyCampaigns.filter(c => c.status === 'active').length,
    draft: companyCampaigns.filter(c => c.status === 'draft').length,
    ended: companyCampaigns.filter(c => c.status === 'ended').length
  };

  // Statistiques pour les invitations
  const invitationsStats = {
    total: invitedCampaigns.length,
    pending: invitedCampaigns.filter(c => c.invitationStatus === 'pending').length,
    accepted: invitedCampaigns.filter(c => c.invitationStatus === 'accepted').length,
  };

  const getOfferStatusBadge = (status: CompanyCampaign['status']) => {
    const styles = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200',
      draft: 'bg-slate-50 text-slate-700 border-slate-200 ring-1 ring-slate-200',
      ended: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-200',
      cancelled: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-200'
    }[status];

    const text = {
      active: 'Active',
      draft: 'Brouillon',
      ended: 'Terminée',
      cancelled: 'Annulée'
    }[status];

    return (
      <Badge className={`${styles} text-xs font-medium`}>
        {text}
      </Badge>
    );
  };

  const getInvitationStatusBadge = (status: 'pending' | 'accepted' | 'declined') => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-200',
      accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200',
      declined: 'bg-slate-50 text-slate-700 border-slate-200 ring-1 ring-slate-200'
    }[status];

    const text = {
      pending: 'En attente',
      accepted: 'Acceptée',
      declined: 'Refusée'
    }[status];

    return (
      <Badge className={`${styles} text-xs font-medium`}>
        {text}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">
                Espace recrutement
              </h1>
              <p className="text-slate-500">
                Gérez vos offres et participez aux événements des écoles
              </p>
            </div>
            <Link href="/campaigns/company/new">
              <Button size="default" className="shadow-sm w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle offre
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="my-offers" onValueChange={(value) => setActiveTab(value as 'my-offers' | 'invitations')}>
            <TabsList className="mb-6 grid grid-cols-2">
              <TabsTrigger value="my-offers" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Mes offres</span>
                <Badge variant="secondary" className="ml-1">{myOffersStats.total}</Badge>
              </TabsTrigger>
              <TabsTrigger value="invitations" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>Invitations</span>
                <Badge variant="secondary" className="ml-1">{invitationsStats.total}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-offers">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{myOffersStats.total}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-600">Actives</p>
                  <p className="text-2xl font-bold text-emerald-700">{myOffersStats.active}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-500">Brouillons</p>
                  <p className="text-2xl font-bold text-slate-900">{myOffersStats.draft}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-600">Terminées</p>
                  <p className="text-2xl font-bold text-blue-700">{myOffersStats.ended}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="invitations">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{invitationsStats.total}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-600">En attente</p>
                  <p className="text-2xl font-bold text-amber-700">{invitationsStats.pending}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-600">Acceptées</p>
                  <p className="text-2xl font-bold text-emerald-700">{invitationsStats.accepted}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder={activeTab === 'my-offers' ? "Rechercher une offre..." : "Rechercher une invitation..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === 'my-offers' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => setStatusFilter(current => 
                    current === 'all' ? 'active' : 
                    current === 'active' ? 'draft' : 
                    current === 'draft' ? 'ended' : 'all'
                  )}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {statusFilter === 'all' ? 'Tous' : 
                   statusFilter === 'active' ? 'Actives' :
                   statusFilter === 'draft' ? 'Brouillons' : 'Terminées'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => setSortBy(current => current === 'date' ? 'participants' : 'date')}
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  {sortBy === 'date' ? 'Date' : 'Candidats'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal basé sur l'onglet actif */}
        {activeTab === 'my-offers' ? (
          <div className="grid gap-4">
            {sortedCampaigns.map(campaign => (
              <Link 
                key={campaign.id}
                href={`/campaigns/company/me/${campaign.id}`}
                className="group block bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:border-slate-300"
              >
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {getOfferStatusBadge(campaign.status)}
                        <Badge variant="outline" className="text-xs">
                          {campaign.tags[0]}
                        </Badge>
                        {campaign.tags.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            +{campaign.tags.length - 1}
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {campaign.title}
                      </h2>
                      <p className="text-slate-500 text-sm line-clamp-2">
                        {campaign.description}
                      </p>
                    </div>
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full md:w-32 h-24 md:h-24 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(campaign.startDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {campaign.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {campaign.maxParticipants} {campaign.maxParticipants > 1 ? 'postes' : 'poste'}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-700">Candidats</span>
                      <span className="text-blue-600">{campaign.currentParticipants} reçu(s)</span>
                    </div>
                    <Progress 
                      value={0} 
                      className="h-1.5"
                    />
                  </div>
                </div>
              </Link>
            ))}

            {sortedCampaigns.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-600 font-medium mb-1">Aucune offre trouvée</h3>
                <p className="text-slate-500 mb-4">Vous n'avez pas encore créé d'offres de recrutement</p>
                <Link href="/campaigns/company/new">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une offre
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedInvitations.map(invitation => (
              <div
                key={invitation.id}
                className="block bg-white rounded-xl shadow-sm border border-slate-200"
              >
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {getInvitationStatusBadge(invitation.invitationStatus)}
                        <Badge variant="outline" className="bg-blue-50 text-xs">
                          École
                        </Badge>
                      </div>
                      <h2 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        {invitation.title}
                      </h2>
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={invitation.school.logo} alt={invitation.school.name} />
                          <AvatarFallback>{invitation.school.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-slate-600">{invitation.school.name}</span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2">
                        {invitation.description}
                      </p>
                    </div>
                    <img
                      src={invitation.image}
                      alt={invitation.title}
                      className="w-full md:w-32 h-24 md:h-24 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(invitation.startDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {invitation.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4 text-slate-400" />
                      {invitation.currentParticipants}/{invitation.maxParticipants} entreprises
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {invitation.invitationStatus === 'pending' ? (
                      <>
                        <Button className="flex-1 sm:flex-none">
                          Accepter
                        </Button>
                        <Button variant="outline" className="flex-1 sm:flex-none">
                          Refuser
                        </Button>
                      </>
                    ) : invitation.invitationStatus === 'accepted' ? (
                      <Link href={`/campaigns/${invitation.id}`} className="w-full sm:w-auto">
                        <Button className="w-full">
                          Voir la campagne
                        </Button>
                      </Link>
                    ) : null}

                    <Link href={`/campaigns/${invitation.id}`} className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full">
                        Détails
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {sortedInvitations.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-600 font-medium mb-1">Aucune invitation</h3>
                <p className="text-slate-500 mb-4">Vous n'avez pas encore reçu d'invitations de la part d'écoles</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 