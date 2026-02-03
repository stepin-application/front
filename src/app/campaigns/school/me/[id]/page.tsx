"use client"

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { schoolCampaignsData } from '@/data/schoolCampaignsData';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2, 
  Clock, 
  Share2, 
  Copy, 
  Building,
  Eye,
  MessageCircle,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { schoolCampaignInvitePath } from "@/lib/utils";

// TODO: À remplacer par l'ID de l'école connectée
const SCHOOL_ID = 'school_1';

export default function SchoolCampaignDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  // Trouver la campagne correspondante de l'école connectée
  const campaign = schoolCampaignsData.find(c => c.id === id && c.school.id === SCHOOL_ID);
  
  // Si la campagne n'existe pas ou n'appartient pas à l'école
  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Campagne non trouvée
          </h1>
          <p className="text-gray-500 mb-6">
            Cette campagne n'existe pas ou ne vous appartient pas.
          </p>
          <Link 
            href="/campaigns/school/me" 
            className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à mes campagnes
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: typeof campaign.status) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-100',
      draft: 'bg-gray-50 text-gray-700 border-gray-100',
      ended: 'bg-blue-50 text-blue-700 border-blue-100',
      cancelled: 'bg-red-50 text-red-700 border-red-100'
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

  const handleDelete = () => {
    // TODO: Implémenter la suppression via API
    console.log("Suppression de la campagne", id);
    setShowDeleteDialog(false);
    router.push('/campaigns/school/me');
  };

  const handleStatusChange = (newStatus: typeof campaign.status) => {
    // TODO: Implémenter le changement de statut via API
    console.log(`Changement de statut: ${campaign.status} -> ${newStatus}`);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Link 
            href="/campaigns/school/me" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à mes campagnes
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>{campaign.school.name[0]}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(campaign.status)}
                  <Badge variant="outline" className="text-xs">
                    École
                  </Badge>
                </div>
                <h1 className="text-2xl font-medium text-gray-900">{campaign.title}</h1>
                <p className="text-gray-500">{campaign.school.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Partager
              </Button>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Copy className="w-4 h-4" />
                Dupliquer
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => router.push(`/campaigns/school/me/${id}/edit`)}
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>

        {/* Actions contextuelles selon le statut */}
        {campaign.status === 'draft' && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-500" />
              <p className="text-blue-700">
                Cette campagne est en statut brouillon et n'est pas visible par les entreprises.
              </p>
            </div>
            <Button 
              onClick={() => handleStatusChange('active')} 
              size="sm"
              className="gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              Publier
            </Button>
          </div>
        )}

        {campaign.status === 'active' && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-green-700">
                Cette campagne est active et visible par les entreprises.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange('draft')} 
              size="sm"
              className="gap-2"
            >
              <PauseCircle className="w-4 h-4" />
              Mettre en pause
            </Button>
          </div>
        )}

        {/* Tabs navigation */}
        <Tabs defaultValue="details" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full bg-white border-b pb-0 mb-6">
            <TabsTrigger value="details" className="flex-1">Détails</TabsTrigger>
            <TabsTrigger value="companies" className="flex-1">Entreprises participantes</TabsTrigger>
            <TabsTrigger value="statistics" className="flex-1">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-6">
                
                {/* Image */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <div className="h-24 w-24 rounded-xl bg-slate-100 border flex items-center justify-center text-2xl font-semibold text-slate-500">
                      {(campaign.title?.trim()?.[0] || "C").toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">À propos</h2>
                  <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
                </div>

                {/* Requirements */}
                {campaign.requirements.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Prérequis</h2>
                    <ul className="grid grid-cols-2 gap-2">
                      {campaign.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {campaign.benefits.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Avantages</h2>
                    <ul className="grid grid-cols-2 gap-2">
                      {campaign.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Key info */}
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Période</h3>
                    <p className="text-gray-900">
                      {new Date(campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Localisation</h3>
                    <p className="text-gray-900">{campaign.location}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Participants</h3>
                    <p className="text-gray-900">{campaign.currentParticipants} / {campaign.maxParticipants}</p>
                    <Progress 
                      value={(campaign.currentParticipants / campaign.maxParticipants) * 100} 
                      className="h-1 mt-2" 
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                    <p className="text-gray-900">{new Date(campaign.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Domaines</h3>
                  <div className="flex flex-wrap gap-1">
                    {campaign.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Actions rapides</h3>
                  
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir en tant qu'entreprise
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contacter les participants
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() =>
                      router.push(schoolCampaignInvitePath(campaign.id, campaign.title))
                    }
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Inviter des entreprises
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Entreprises participantes</h2>
              
              {campaign.currentParticipants > 0 ? (
                <div className="space-y-4">
                  {/* TODO: Afficher la liste des entreprises participantes */}
                  <p className="text-gray-500">Liste des entreprises participantes à implémenter.</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-gray-600 font-medium mb-1">Aucune entreprise participante</h3>
                  <p className="text-gray-500 mb-4">Commencez par inviter des entreprises à participer à votre campagne.</p>
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(schoolCampaignInvitePath(campaign.id, campaign.title))
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Inviter des entreprises
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h2>
              
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-600 font-medium mb-1">Statistiques à venir</h3>
                <p className="text-gray-500 mb-4">Les statistiques détaillées seront disponibles une fois la campagne lancée.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog confirmation suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette campagne</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette campagne ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
