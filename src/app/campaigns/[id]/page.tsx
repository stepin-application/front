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

  return (
    <div className="min-h-screen bg-white">
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
                </div>
                <h1 className="text-2xl font-medium text-gray-900">{campaign.title}</h1>
                <p className="text-gray-500">{campaign.createdBy.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <BookmarkPlus className="w-4 h-4" />
              </Button>
              {campaign.status === 'active' && (
                <Button size="sm">
                  Postuler
                </Button>
              )}
            </div>
          </div>
        </div>

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

              <div>
                <h3 className="text-sm font-medium text-gray-500">Participants</h3>
                <p className="text-gray-900">{campaign.participants} / {campaign.maxParticipants || '∞'}</p>
                <Progress value={(campaign.participants / (campaign.maxParticipants || 100)) * 100} className="h-1 mt-2" />
              </div>
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

            {/* Contact */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Contact</h3>
              <Button variant="outline" className="w-full text-sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacter
              </Button>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}