"use client"

import { Calendar, MapPin, Users, Building, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Campaign } from '@/types/campaign';
import Link from 'next/link';

interface CampaignCardProps {
  campaign: Campaign;
  isAuthenticated?: boolean;
  userRole?: 'school' | 'company' | 'student';
}

export default function CampaignCard({ campaign, isAuthenticated = false, userRole }: CampaignCardProps) {
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'upcoming':
        return 'À venir';
      case 'closed':
        return 'Terminée';
      default:
        return 'Inconnu';
    }
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 h-auto sm:h-[24rem] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src={campaign.createdBy.logo} alt={campaign.createdBy.name} />
              <AvatarFallback>
                {campaign.type === 'company' ? (
                  <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-base sm:text-lg font-semibold line-clamp-1">{campaign.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{campaign.createdBy.name}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(campaign.status)} text-xs sm:text-sm whitespace-nowrap`}>
            {getStatusText(campaign.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            {new Date(campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            {campaign.location}
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            {campaign.participants} / {campaign.maxParticipants} participants
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1 sm:gap-2">
          {campaign.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] sm:text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pt-4 mt-auto">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {campaign.requirements?.slice(0, 2).map((req, index) => (
            <Badge key={index} variant="secondary" className="text-[10px] sm:text-xs">
              {req}
            </Badge>
          ))}
          {campaign.requirements && campaign.requirements.length > 2 && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              +{campaign.requirements.length - 2}
            </Badge>
          )}
        </div>
        {campaign.status === 'active' && (
          <Link href={`/campaigns/${campaign.id}`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xs sm:text-sm">
              Voir la campagne
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}