"use client"

import { useParams } from 'next/navigation';
import { campaignsData } from '@/data/campaignsData';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Building, GraduationCap, CheckCircle2, Clock, XCircle, Share2, BookmarkPlus, MessageCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/contexts/AuthContext';

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const campaign = campaignsData.find(c => c.id === id);

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Campagne non trouvée
          </h1>
          <p className="text-gray-500 mb-6">
            Cette campagne n'existe pas ou a été supprimée.
          </p>
          <Link 
            href="/campaigns" 
            className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux campagnes
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: typeof campaign.status) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-100',
      upcoming: 'bg-blue-50 text-blue-700 border-blue-100', 
      closed: 'bg-gray-50 text-gray-700 border-gray-100'
    }[status];

    const text = {
      active: 'Active',
      upcoming: 'À venir',
      closed: 'Terminée'
    }[status];

    return (
      <Badge className={`${styles} text-xs font-medium`}>
        {text}
      </Badge>
    );
  };

  // Vérifier si l'utilisateur peut candidater
  const canApply = () => {
    if (!isAuthenticated || user?.role !== 'student') return false;
    if (campaign.status !== 'active') return false;
    if (campaign.target !== 'students' && campaign.target !== 'both') return false;
    
    // Vérifier si la deadline étudiante est passée
    const now = new Date();
    const campaignAny = campaign as any;
    const studentDeadline = campaignAny.studentDeadline || campaignAny.companyDeadline || campaignAny.endDate;
    if (!studentDeadline) return false;
    const deadline = new Date(studentDeadline);
    return now <= deadline;
  };

  // Vérifier si c'est une campagne de l'utilisateur connecté
  const isOwnCampaign = () => {
    if (!isAuthenticated) return false;
    return campaign.createdBy.id === user?.companyId || campaign.createdBy.id === user?.schoolId;
  };

  // Calculer les jours restants pour candidater
  const getDaysUntilDeadline = () => {
    const now = new Date();
    const campaignAny = campaign as any;
    const deadlineDate = campaignAny.studentDeadline || campaignAny.companyDeadline || campaignAny.endDate;
    if (!deadlineDate) return 0;
    const deadline = new Date(deadlineDate);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeadline = getDaysUntilDeadline();

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/campaigns" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={campaign.createdBy.logo} />
                <AvatarFallback>{campaign.createdBy.name[0]}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(campaign.status)}
                  <Badge variant="outline" className="text-xs">
                    {campaign.type === 'company' ? 'Entreprise' : 'École'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {campaign.target === 'students' ? 'Étudiants' : 
                     campaign.target === 'companies' ? 'Entreprises' : 'Mixte'}
                  </Badge>
                </div>
                <h1 className="text-2xl font-medium text-gray-900">{campaign.title}</h1>
                <p className="text-gray-500">{campaign.createdBy.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {/* Bouton de candidature pour étudiants */}
              {user?.role === 'student' && (
                <>
                  {canApply() ? (
                    <Link href={`/campaigns/${campaign.id}/apply`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Candidater
                      </Button>
                    </Link>
                  ) : (
                    <Button size="sm" disabled className="opacity-50">
                      {campaign.status !== 'active' ? 'Campagne fermée' :
                       daysUntilDeadline < 0 ? 'Deadline dépassée' : 'Non éligible'}
                    </Button>
                  )}
                </>
              )}

              {/* Boutons pour propriétaires de campagne */}
              {isOwnCampaign() && (
                <div className="flex gap-2">
                  <Link href={`/campaigns/${campaign.type}/${campaign.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </Link>
                  <Link href={`/campaigns/${campaign.id}/participants`}>
                    <Button size="sm">
                      Voir les candidatures
                    </Button>
                  </Link>
                </div>
              )}

              {/* CTA pour visiteurs non connectés */}
              {!isAuthenticated && (
                <div className="flex gap-2">
                  <Link href="/login">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Se connecter pour candidater
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerte deadline pour étudiants */}
        {user?.role === 'student' && campaign.status === 'active' && daysUntilDeadline <= 7 && daysUntilDeadline > 0 && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              <p className="text-orange-800">
                <strong>Attention :</strong> Plus que {daysUntilDeadline} jour{daysUntilDeadline > 1 ? 's' : ''} pour candidater !
              </p>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            
            {/* Image */}
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={campaign.image || '/placeholder.jpg'} 
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">À propos</h2>
              <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
            </div>

            {/* Requirements */}
            {campaign.requirements && campaign.requirements.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Prérequis</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {campaign.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {campaign.benefits && campaign.benefits.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Avantages</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {campaign.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Informations limitées pour visiteurs non connectés */}
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Vous voulez en savoir plus ?
                </h3>
                <p className="text-blue-700 mb-4">
                  Créez votre compte pour accéder aux détails complets de cette campagne et candidater.
                </p>
                <div className="flex gap-3">
                  <Link href="/login">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Se connecter
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline">
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Key info */}
            <div className="border rounded-lg p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Période</h3>
                <p className="text-gray-900">{new Date(campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(campaign.endDate).toLocaleDateString('fr-FR')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Localisation</h3>
                <p className="text-gray-900">{campaign.location}</p>
              </div>

              {/* Deadlines */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Deadline entreprises</h3>
                <p className="text-gray-900 text-sm">
                  {((campaign as any).companyDeadline || (campaign as any).endDate) ? 
                    new Date((campaign as any).companyDeadline || (campaign as any).endDate).toLocaleDateString('fr-FR') : 
                    'Non définie'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Deadline étudiants</h3>
                <p className="text-gray-900 text-sm">
                  {((campaign as any).studentDeadline ? 
                    new Date((campaign as any).studentDeadline).toLocaleDateString('fr-FR') : 
                    'Non définie')}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Deadline étudiants</h3>
                <p className="text-gray-900 text-sm">
                  {((campaign as any).studentDeadline ? 
                    new Date((campaign as any).studentDeadline).toLocaleDateString('fr-FR') : 
                    'Non définie')}
                </p>
                {user?.role === 'student' && daysUntilDeadline > 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    Plus que {daysUntilDeadline} jour{daysUntilDeadline > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Participants</h3>
                <p className="text-gray-900">{campaign.participants} candidatures</p>
                {campaign.maxParticipants && (
                  <Progress value={(campaign.participants / campaign.maxParticipants) * 100} className="h-1 mt-2" />
                )}
              </div>

              {((campaign as any).createdAt) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Créée le</h3>
                  <p className="text-gray-900 text-sm">{new Date((campaign as any).createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Domaines</h3>
              <div className="flex flex-wrap gap-1">
                {campaign.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Contact - seulement pour utilisateurs connectés */}
            {isAuthenticated && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Contact</h3>
                <Button variant="outline" className="w-full text-sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter
                </Button>
              </div>
            )}

            {/* CTA pour visiteurs */}
            {!isAuthenticated && (
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <h3 className="text-sm font-medium text-blue-900 mb-3">Rejoignez StepIn</h3>
                <p className="text-xs text-blue-700 mb-3">
                  Accédez à toutes les fonctionnalités et candidatez aux meilleures opportunités.
                </p>
                <Link href="/login">
                  <Button className="w-full text-sm bg-blue-600 hover:bg-blue-700">
                    Se connecter
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
