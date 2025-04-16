"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Calendar, MapPin, Users, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { schoolCampaignsData, SchoolCampaign } from '@/data/schoolCampaignsData';
import { Progress } from "@/components/ui/progress";

// TODO: À remplacer par l'ID de l'école connectée
const SCHOOL_ID = 'school_1';

export default function SchoolCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SchoolCampaign['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'participants'>('date');

  // Filtrer les campagnes de l'école connectée
  const schoolCampaigns = schoolCampaignsData.filter(campaign => 
    campaign.school.id === SCHOOL_ID
  );

  // Filtrer par recherche et status
  const filteredCampaigns = schoolCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Trier les campagnes
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else {
      return (b.currentParticipants / b.maxParticipants) - (a.currentParticipants / a.maxParticipants);
    }
  });

  // Statistiques
  const stats = {
    total: schoolCampaigns.length,
    active: schoolCampaigns.filter(c => c.status === 'active').length,
    draft: schoolCampaigns.filter(c => c.status === 'draft').length,
    ended: schoolCampaigns.filter(c => c.status === 'ended').length
  };

  const getStatusBadge = (status: SchoolCampaign['status']) => {
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

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">
                Mes campagnes
              </h1>
              <p className="text-slate-500">
                Gérez vos campagnes de recrutement et événements
              </p>
            </div>
            <Link href="/campaigns/school/new">
              <Button size="default" className="shadow-sm w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle campagne
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Total</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm font-medium text-emerald-600">Actives</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.active}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Brouillons</p>
              <p className="text-2xl font-bold text-slate-900">{stats.draft}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-600">Terminées</p>
              <p className="text-2xl font-bold text-blue-700">{stats.ended}</p>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une campagne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
                {sortBy === 'date' ? 'Date' : 'Participants'}
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des campagnes */}
        <div className="grid gap-4">
          {sortedCampaigns.map(campaign => (
            <Link 
              key={campaign.id}
              href={`/campaigns/school/me/${campaign.id}`}
              className="group block bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:border-slate-300"
            >
              <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {getStatusBadge(campaign.status)}
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
                    <Users className="w-4 h-4 text-slate-400" />
                    {campaign.currentParticipants}/{campaign.maxParticipants}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-700">Progression</span>
                    <span className="text-blue-600">{Math.round((campaign.currentParticipants / campaign.maxParticipants) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(campaign.currentParticipants / campaign.maxParticipants) * 100}
                    className="h-1.5"
                  />
                </div>
              </div>
            </Link>
          ))}

          {sortedCampaigns.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500">Aucune campagne ne correspond à vos critères</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 