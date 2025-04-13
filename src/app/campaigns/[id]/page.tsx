"use client"

import { useParams } from 'next/navigation';
import { campaignsData } from '@/data/campaignsData';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Building, GraduationCap, CheckCircle2, Clock, XCircle, Share2, BookmarkPlus, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const campaign = campaignsData.find(c => c.id === id);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center py-8 border border-gray-200 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Campagne non trouvée</h1>
            <Link href="/campaigns" className="inline-flex items-center text-purple-600 hover:text-purple-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux campagnes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: typeof campaign.status) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'upcoming': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'closed': return <XCircle className="w-5 h-5 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusText = (status: typeof campaign.status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'upcoming': return 'À venir';
      case 'closed': return 'Terminée';
      default: return 'Inconnu';
    }
  };

  const participationProgress = campaign.maxParticipants ? (campaign.participants / campaign.maxParticipants) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex justify-between items-center mb-4 p-4 border-b border-gray-200">
            <Link href="/campaigns" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />Retour aux campagnes
            </Link>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="border border-gray-200">
                <Share2 className="w-4 h-4 mr-1" />Partager
              </Button>
              <Button variant="ghost" size="sm" className="border border-gray-200">
                <BookmarkPlus className="w-4 h-4 mr-1" />Sauvegarder
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-gray-100">
                    <AvatarImage src={campaign.createdBy.logo} alt={campaign.createdBy.name} />
                    <AvatarFallback>
                      {campaign.type === 'company' ? <Building className="h-8 w-8" /> : <GraduationCap className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <Badge className={`${campaign.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' : campaign.status === 'upcoming' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-gray-100 text-gray-800 border border-gray-200'} text-xs`}>
                      {getStatusText(campaign.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Badge variant="outline" className="bg-white mb-1 text-xs border border-gray-300">
                    {campaign.type === 'company' ? 'Entreprise' : 'École'}
                  </Badge>
                  <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{campaign.title}</h1>
                  <p className="text-sm text-gray-500">Par {campaign.createdBy.name}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {campaign.status === 'active' && (
                  <>
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border border-purple-700">
                      <MessageCircle className="w-4 h-4 mr-1" />Postuler maintenant
                    </Button>
                    <div className="text-xs text-gray-500 border-t border-gray-100 pt-2">
                      {campaign.maxParticipants ? `${campaign.maxParticipants - campaign.participants} places restantes` : 'Places illimitées'}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img src={campaign.image || '/placeholder-campaign.jpg'} alt={campaign.title} className="object-cover w-full h-full" />
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">À propos de la campagne</h2>
              <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">Informations clés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md border border-gray-100">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">Période</h3>
                      <p className="text-sm text-gray-900 font-medium">{new Date(campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(campaign.endDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md border border-gray-100">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">Localisation</h3>
                      <p className="text-sm text-gray-900 font-medium">{campaign.location}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md border border-gray-100">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">Participation</h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 font-medium">{campaign.participants} / {campaign.maxParticipants || '∞'} participants</p>
                        <Progress value={participationProgress} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md border border-gray-100">
                      {campaign.type === 'company' ? <Building className="w-5 h-5 text-purple-600" /> : <GraduationCap className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">Organisateur</h3>
                      <p className="text-sm text-gray-900 font-medium">{campaign.createdBy.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {campaign.requirements && campaign.requirements.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">Prérequis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {campaign.requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {campaign.benefits && campaign.benefits.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">Ce que nous offrons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {campaign.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2 bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">Domaines</h2>
              <div className="flex flex-wrap gap-1.5">
                {campaign.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">Public cible</h2>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <Badge variant="secondary" className="text-xs bg-white border border-gray-200">
                  {campaign.target === 'students' ? 'Étudiants' : campaign.target === 'companies' ? 'Entreprises' : 'Étudiants et Entreprises'}
                </Badge>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">Statistiques</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vues totales</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Candidatures</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taux de conversion</span>
                  <span className="font-medium">3.6%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">Contact</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">{campaign.createdBy.name}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter l'organisateur
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}