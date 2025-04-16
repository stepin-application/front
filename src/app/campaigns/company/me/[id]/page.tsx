"use client"

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { companyCampaignsData } from '@/data/companyCampaignsData';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2, 
  Clock, 
  Share2, 
  Copy, 
  Eye,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  Download,
  UserPlus,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// TODO: À remplacer par l'ID de l'entreprise connectée
const COMPANY_ID = 'company_1';

export default function CompanyCampaignDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  // Trouver la campagne correspondante de l'entreprise connectée
  const campaign = companyCampaignsData.find(c => c.id === id && c.company.id === COMPANY_ID);
  
  // Si la campagne n'existe pas ou n'appartient pas à l'entreprise
  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <XCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Offre non trouvée
          </h1>
          <p className="text-slate-500 mb-6">
            Cette offre n'existe pas ou ne vous appartient pas.
          </p>
          <Link 
            href="/campaigns/company/me" 
            className="inline-flex items-center px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à mes offres
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: typeof campaign.status) => {
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

  const handleDelete = () => {
    // TODO: Implémenter la suppression via API
    console.log("Suppression de l'offre", id);
    setShowDeleteDialog(false);
    router.push('/campaigns/company/me');
  };

  const handleStatusChange = (newStatus: typeof campaign.status) => {
    // TODO: Implémenter le changement de statut via API
    console.log(`Changement de statut: ${campaign.status} -> ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <Link 
            href="/campaigns/company/me" 
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à mes offres
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={campaign.company.logo} alt={campaign.company.name} />
                <AvatarFallback>{campaign.company.name[0]}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(campaign.status)}
                  <Badge variant="outline" className="text-xs">
                    {campaign.company.industry}
                  </Badge>
                </div>
                <h1 className="text-2xl font-semibold text-slate-900">{campaign.title}</h1>
                <p className="text-slate-500">{campaign.company.name}</p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="gap-2 sm:w-auto w-full">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
              </Button>
              
              <Button variant="outline" size="sm" className="gap-2 sm:w-auto w-full">
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Dupliquer</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 sm:w-auto w-full"
                onClick={() => router.push(`/campaigns/company/me/${id}/edit`)}
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Modifier</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 gap-2 sm:w-auto w-full"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Supprimer</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Actions contextuelles selon le statut */}
        {campaign.status === 'draft' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <p className="text-blue-700">
                Cette offre est en statut brouillon et n'est pas visible par les candidats.
              </p>
            </div>
            <Button 
              onClick={() => handleStatusChange('active')} 
              size="sm"
              className="gap-2 w-full sm:w-auto"
            >
              <PlayCircle className="w-4 h-4" />
              Publier
            </Button>
          </div>
        )}

        {campaign.status === 'active' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-emerald-700">
                Cette offre est active et visible par les candidats potentiels.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange('draft')} 
              size="sm"
              className="gap-2 w-full sm:w-auto"
            >
              <PauseCircle className="w-4 h-4" />
              Mettre en pause
            </Button>
          </div>
        )}

        {/* Tabs navigation */}
        <Tabs defaultValue="details" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full bg-white border-b pb-0 mb-6 rounded-t-xl overflow-hidden">
            <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-slate-50">Détails</TabsTrigger>
            <TabsTrigger value="applications" className="flex-1 data-[state=active]:bg-slate-50">Candidatures</TabsTrigger>
            <TabsTrigger value="statistics" className="flex-1 data-[state=active]:bg-slate-50">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                
                {/* Image */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="aspect-video bg-slate-100">
                    <img 
                      src={campaign.image || '/placeholder.jpg'} 
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-medium text-slate-900 mb-4">Description du poste</h2>
                  <p className="text-slate-600 leading-relaxed">{campaign.description}</p>
                </div>

                {/* Requirements */}
                {campaign.requirements.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-medium text-slate-900 mb-4">Profil recherché</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {campaign.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {campaign.benefits.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-medium text-slate-900 mb-4">Ce que nous offrons</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {campaign.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
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
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Période</h3>
                    <p className="text-slate-900">
                      {new Date(campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Localisation</h3>
                    <p className="text-slate-900">{campaign.location}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Postes disponibles</h3>
                    <p className="text-slate-900">{campaign.maxParticipants} {campaign.maxParticipants > 1 ? 'postes' : 'poste'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Date de publication</h3>
                    <p className="text-slate-900">{new Date(campaign.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Domaines</h3>
                  <div className="flex flex-wrap gap-1">
                    {campaign.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-2">
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Actions rapides</h3>
                  
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir en tant que candidat
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter les candidatures
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Ajouter un candidat
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-medium text-slate-900 mb-4">Candidatures reçues</h2>
              
              {campaign.currentParticipants > 0 ? (
                <div className="space-y-4">
                  {/* TODO: Afficher la liste des candidatures */}
                  <p className="text-slate-500">Liste des candidatures à implémenter.</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-slate-600 font-medium mb-1">Aucune candidature reçue</h3>
                  <p className="text-slate-500 mb-4">Les candidatures s'afficheront ici lorsque vous en recevrez.</p>
                  <Button size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager l'offre
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-medium text-slate-900 mb-4">Statistiques</h2>
              
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-600 font-medium mb-1">Statistiques à venir</h3>
                <p className="text-slate-500 mb-4">Les statistiques détaillées seront disponibles une fois que votre offre recevra des candidatures.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog confirmation suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette offre</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette offre ? Cette action ne peut pas être annulée.
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