"use client"

import { Calendar, MapPin, Users, Building, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Campaign } from '@/types/campaign';
import Link from 'next/link';
import { campaignPath } from '@/lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
  isAuthenticated?: boolean;
  userRole?: 'school' | 'company' | 'student' | 'platform_admin';
}

export default function CampaignCard({ campaign, isAuthenticated = false, userRole }: CampaignCardProps) {
  const createdBy = campaign.createdBy ?? { name: "Organisation", logo: "" };
  const tags = Array.isArray(campaign.tags) ? campaign.tags : [];
  const requirements = Array.isArray(campaign.requirements) ? campaign.requirements : [];

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'OPEN':
      case 'active':
        return 'bg-green-500';
      case 'LOCKED':
      case 'upcoming':
        return 'bg-blue-500';
      case 'CLOSED':
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'OPEN':
      case 'active':
        return 'Active';
      case 'LOCKED':
      case 'upcoming':
        return 'À venir';
      case 'CLOSED':
      case 'closed':
        return 'Terminée';
      default:
        return 'Inconnu';
    }
  };

  const getDateRange = () => {
    if (campaign.startDate && campaign.endDate) {
      return `${new Date(campaign.startDate).toLocaleDateString('fr-FR')} - ${new Date(campaign.endDate).toLocaleDateString('fr-FR')}`;
    }
    if (campaign.companyDeadline || campaign.studentDeadline) {
      const deadline = campaign.companyDeadline || campaign.studentDeadline;
      return `Deadline: ${new Date(deadline).toLocaleDateString('fr-FR')}`;
    }
    return "Dates à venir";
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 h-auto sm:h-[24rem] flex flex-col bg-white dark:bg-slate-900/80 border border-gray-100 dark:border-slate-800">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarFallback>
                {campaign.type === 'company' ? (
                  <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-base sm:text-lg font-semibold line-clamp-1 text-gray-900 dark:text-gray-100">{campaign.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{createdBy.name}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(campaign.status)} text-xs sm:text-sm whitespace-nowrap`}>
            {getStatusText(campaign.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{campaign.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            {getDateRange()}
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            {campaign.location || "Lieu à confirmer"}
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            {campaign.participants ?? 0} / {campaign.maxParticipants ?? "N/A"} participants
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1 sm:gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] sm:text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pt-4 mt-auto">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {requirements.slice(0, 2).map((req, index) => (
            <Badge key={index} variant="secondary" className="text-[10px] sm:text-xs">
              {req}
            </Badge>
          ))}
          {requirements.length > 2 && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              +{requirements.length - 2}
            </Badge>
          )}
        </div>
        {(campaign.status === 'active' || campaign.status === 'OPEN') && (
          <Link href={campaignPath(campaign.id, campaign.title)} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xs sm:text-sm">
              Voir la campagne
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
