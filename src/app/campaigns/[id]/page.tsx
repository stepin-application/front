"use client"

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Building, CheckCircle2, Clock, XCircle, Share2, BookmarkPlus, MessageCircle, AlertTriangle, Briefcase, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/contexts/AuthContext';
import { campaigns, directory, invitations as invitationsApi, jobOpenings, studentApplications } from "@/lib/api";
import { Campaign, ApplicationEligibility } from "@/types/campaign";
import { campaignParticipantsPath, schoolCampaignEditPath } from "@/lib/utils";

export default function CampaignDetailsPage() {
  const { id: pathId } = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || (pathId as string);
  const { user, isAuthenticated } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [invitationStatus, setInvitationStatus] = useState<'INVITED' | 'ACCEPTED' | 'REFUSED' | null>(null);
  const [responding, setResponding] = useState(false);
  const [applicationEligibilities, setApplicationEligibilities] = useState<Record<string, ApplicationEligibility>>({});

  // Helper function to get company IDs from campaign data
  const getCompanyIdsForCampaign = (campaignData: Campaign): string[] => {
    const createdBy = campaignData.createdBy as Campaign['createdBy'];
    if (createdBy && 'industry' in createdBy) {
      return [createdBy.id];
    }
    const responded = campaignData.respondedCompanies?.map((company) => company.id) || [];
    return responded.filter(Boolean);
  };

  // Function to fetch jobs for the campaign
  const fetchJobsForCampaign = async (campaignData: Campaign) => {
    setJobsLoading(true);
    try {
      // First try to get all jobs for this campaign
      let allJobs: any[] = [];
      
      try {
        allJobs = await jobOpenings.getByCampaign(campaignData.id);
      } catch (error) {
        console.log(`No jobs found for campaign ${campaignData.id}`);
        
        // Fallback: try to get jobs by company if we have company IDs
        const companyIds = getCompanyIdsForCampaign(campaignData);
        if (companyIds.length > 0) {
          const jobLists = await Promise.all(
            companyIds.map(async (companyId) => {
              try {
                return await jobOpenings.getAll({ campaignId: campaignData.id, companyId });
              } catch (error) {
                console.log(`No jobs found for company ${companyId} in campaign ${campaignData.id}`);
                return [];
              }
            })
          );
          allJobs = jobLists.flat();
        }
      }
      
      setJobs(allJobs);
      
      // Check application eligibility for each job if user is a student
      if (user?.role === 'student' && allJobs.length > 0) {
        const eligibilityChecks = await Promise.all(
          allJobs.map(async (job) => {
            try {
              const eligibility = await studentApplications.checkEligibility(job.id);
              return { jobId: job.id, eligibility };
            } catch (error) {
              console.error(`Error checking eligibility for job ${job.id}:`, error);
              return { jobId: job.id, eligibility: null };
            }
          })
        );
        
        const eligibilityMap = eligibilityChecks.reduce((acc, { jobId, eligibility }) => {
          if (eligibility) {
            acc[jobId] = eligibility;
          }
          return acc;
        }, {} as Record<string, ApplicationEligibility>);
        
        setApplicationEligibilities(eligibilityMap);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchCampaign = async () => {
      try {
        const [campaignData, schools] = await Promise.all([
          campaigns.getById(String(id)),
          directory.getSchools().catch(() => []),
        ]);

        const schoolsMap = Array.isArray(schools)
          ? schools.reduce((acc: Record<string, string>, school: any) => {
              if (school?.id) acc[school.id] = school.name || 'École partenaire';
              return acc;
            }, {})
          : {};

        const schoolId = campaignData?.schoolId || '';
        const mapped: Campaign = {
          id: campaignData?.id,
          title: campaignData?.name ?? campaignData?.title ?? 'Campagne',
          description: campaignData?.description ?? '',
          companyDeadline: campaignData?.companyDeadline ?? '',
          studentDeadline: campaignData?.studentDeadline ?? '',
          startDate: campaignData?.createdAt ?? '',
          endDate: campaignData?.studentDeadline ?? '',
          location: campaignData?.location ?? '—',
          status: campaignData?.status ?? 'OPEN',
          maxParticipants: campaignData?.maxParticipants ?? undefined,
          participants: campaignData?.participants ?? 0,
          type: 'school',
          target: 'students',
          createdBy: {
            id: schoolId,
            name: schoolsMap[schoolId] || 'École partenaire',
            logo: ''
          },
          invitedCompanyEmails: [],
          respondedCompanies: [],
          tags: Array.isArray(campaignData?.tags) ? campaignData.tags : [],
          requirements: Array.isArray(campaignData?.requirements) ? campaignData.requirements : [],
          benefits: Array.isArray(campaignData?.benefits) ? campaignData.benefits : [],
          image: campaignData?.image
        };
        setCampaign(mapped);
        
        // Fetch jobs for this campaign
        await fetchJobsForCampaign(mapped);
        
        if (user?.role === 'company' && user.companyId) {
          const invitations = await invitationsApi.getByCompany(user.companyId).catch(() => []);
          if (Array.isArray(invitations)) {
            const found = invitations.find((inv: any) => inv.campaignId === mapped.id);
            setInvitationStatus(found?.status || null);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la campagne:', error);
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
    const styles: Record<string, string> = {
      active: 'bg-green-50 text-green-700 border-green-100',
      upcoming: 'bg-blue-50 text-blue-700 border-blue-100', 
      closed: 'bg-gray-50 text-gray-700 border-gray-100',
      OPEN: 'bg-green-50 text-green-700 border-green-100',
      LOCKED: 'bg-gray-50 text-gray-700 border-gray-100',
      CLOSED: 'bg-gray-50 text-gray-700 border-gray-100',
      completed: 'bg-gray-50 text-gray-700 border-gray-100',
      matching: 'bg-blue-50 text-blue-700 border-blue-100'
    };

    const text: Record<string, string> = {
      active: 'Active',
      upcoming: 'À venir',
      closed: 'Terminée',
      OPEN: 'Active',
      LOCKED: 'Terminée',
      CLOSED: 'Terminée',
      completed: 'Terminée',
      matching: 'En cours'
    };

    return (
      <Badge className={`${styles[status] || styles.closed} text-xs font-medium`}>
        {text[status] || 'Inconnu'}
      </Badge>
    );
  };

  // Vérifier si l'utilisateur peut candidater
  const scrollToJobs = () => {
    const jobsSection = document.getElementById('jobs-section');
    if (jobsSection) {
      jobsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const canApply = () => {
    if (!isAuthenticated || user?.role !== 'student') return false;
    if (campaign.status !== 'active' && campaign.status !== 'OPEN') return false;
    if (campaign.target !== 'students' && campaign.target !== 'both') return false;

    // Fen?tre de candidatures: apr?s deadline entreprise, avant deadline ?tudiante
    const now = new Date();
    const campaignAny = campaign as any;
    const companyDeadline = campaignAny.companyDeadline;
    const studentDeadline = campaignAny.studentDeadline || campaignAny.endDate;
    if (!companyDeadline || !studentDeadline) return false;
    const companyDate = new Date(companyDeadline);
    const studentDate = new Date(studentDeadline);
    return now >= companyDate && now <= studentDate;
  };

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
  const campaignAny = campaign as any;
  const companyDeadlineDate = campaignAny.companyDeadline ? new Date(campaignAny.companyDeadline) : null;
  const isBeforeCompanyDeadline = companyDeadlineDate ? new Date() < companyDeadlineDate : false;

  const getApplicationStatusDisplay = (jobId: string) => {
    const eligibility = applicationEligibilities[jobId];
    if (!eligibility?.hasExistingApplication) return null;
    
    const status = eligibility.applicationStatus;
    const appliedDate = eligibility.appliedAt ? new Date(eligibility.appliedAt).toLocaleDateString('fr-FR') : '';
    
    switch (status) {
      case 'submitted':
        return {
          text: 'Candidature envoyée',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircle2
        };
      case 'selected_for_interview':
        return {
          text: 'Sélectionné',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle2
        };
      case 'not_selected_for_interview':
        return {
          text: 'Non retenu',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle
        };
      case 'decision_accepted':
        return {
          text: 'Accepté',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle2
        };
      case 'decision_rejected':
        return {
          text: 'Refusé',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle
        };
      default:
        return {
          text: 'Candidature envoyée',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircle2
        };
    }
  };

  const canRespondToInvitation = () => {
    if (!user || user.role !== 'company') return false;
    if (!invitationStatus || invitationStatus !== 'INVITED') return false;
    if (campaign.status !== 'OPEN' && campaign.status !== 'active') return false;
    const deadline = new Date((campaign as any).companyDeadline || (campaign as any).endDate);
    return new Date() <= deadline;
  };

  const handleAcceptInvitation = async () => {
    if (!user?.companyId || !campaign?.id) return;
    setResponding(true);
    try {
      await invitationsApi.accept(campaign.id, user.companyId);
      setInvitationStatus('ACCEPTED');
    } finally {
      setResponding(false);
    }
  };

  const handleRefuseInvitation = async () => {
    if (!user?.companyId || !campaign?.id) return;
    setResponding(true);
    try {
      await invitationsApi.refuse(campaign.id, user.companyId);
      setInvitationStatus('REFUSED');
    } finally {
      setResponding(false);
    }
  };

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
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={scrollToJobs}
                    >
                      Voir les offres
                    </Button>
                  ) : (
                    <Button size="sm" disabled className="opacity-50">
                      {campaign.status !== 'active' && campaign.status !== 'OPEN'
                        ? 'Campagne fermée'
                        : daysUntilDeadline < 0
                          ? 'Deadline dépassée'
                          : 'Non éligible'}
                    </Button>
                  )}
                </>
              )}

              {user?.role === 'company' && invitationStatus && (
                <div className="flex gap-2">
                  {invitationStatus === 'INVITED' && canRespondToInvitation() && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={responding}
                        onClick={handleRefuseInvitation}
                      >
                        Refuser
                      </Button>
                      <Button
                        size="sm"
                        disabled={responding}
                        onClick={handleAcceptInvitation}
                      >
                        Accepter
                      </Button>
                    </>
                  )}
                  {invitationStatus === 'ACCEPTED' && (
                    <Badge variant="outline" className="text-xs">
                      Invitation acceptée
                    </Badge>
                  )}
                  {invitationStatus === 'REFUSED' && (
                    <Badge variant="outline" className="text-xs">
                      Invitation refusée
                    </Badge>
                  )}
                </div>
              )}

              {/* Boutons pour propriétaires de campagne */}
              {isOwnCampaign() && user?.role !== 'student' && (
                <div className="flex gap-2">
                  <Link
                    href={
                      campaign.type === 'school'
                        ? schoolCampaignEditPath(campaign.id, campaign.title)
                        : schoolCampaignEditPath(campaign.id, campaign.title)
                    }
                  >
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </Link>
                  <Link href={campaignParticipantsPath(campaign.id, campaign.title)}>
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

        {user?.role === 'student' && isBeforeCompanyDeadline && companyDeadlineDate && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-blue-800">
                Les candidatures ouvriront après la deadline entreprises le {companyDeadlineDate.toLocaleDateString('fr-FR')}.
              </p>
            </div>
          </div>
        )}

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
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <div className="h-24 w-24 rounded-xl bg-slate-100 border flex items-center justify-center text-2xl font-semibold text-slate-500">
                {(campaign.title?.trim()?.[0] || "C").toUpperCase()}
              </div>
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

            {/* Jobs Section */}
            <div id="jobs-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Offres d'emploi ({jobs.length})
                </h2>
              </div>
              
              {jobsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Chargement des offres...</p>
                </div>
              ) : jobs.length > 0 ? (
                <div className="grid gap-4">
                  {jobs.map((job) => {
                    const applicationStatus = getApplicationStatusDisplay(job.id);
                    const hasApplied = applicationEligibilities[job.id]?.hasExistingApplication || false;
                    
                    return (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">{job.title}</h3>
                          </Link>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {job.contractType || 'Stage'}
                            </Badge>
                            {applicationStatus && (
                              <div className={`px-2 py-1 rounded text-xs border ${applicationStatus.color} flex items-center gap-1`}>
                                <applicationStatus.icon className="w-3 h-3" />
                                {applicationStatus.text}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-gray-600 mb-3">
                          <p className="flex items-center mb-1">
                            <Building className="w-4 h-4 mr-2" />
                            {job.companyName || 'Entreprise'}
                          </p>
                          <p className="flex items-center mb-1">
                            <MapPin className="w-4 h-4 mr-2" />
                            {job.location || 'Lieu non spécifié'}
                          </p>
                          {job.duration && (
                            <p className="flex items-center mb-1">
                              <Clock className="w-4 h-4 mr-2" />
                              {job.duration}
                            </p>
                          )}
                          <p className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        {job.description && (
                          <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="flex flex-wrap gap-2">
                            {job.requiredSkills && Array.isArray(job.requiredSkills) && job.requiredSkills.slice(0, 3).map((skill: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                            {job.requiredSkills && Array.isArray(job.requiredSkills) && job.requiredSkills.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{job.requiredSkills.length - 3} autres
                              </span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {user?.role === 'student' && canApply() && !hasApplied && (
                              <Link href={`/jobs/${job.id}/apply`}>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                  Candidater
                                </Button>
                              </Link>
                            )}
                            
                            {user?.role === 'student' && hasApplied && applicationStatus && (
                              <div className={`px-3 py-1 rounded text-xs border ${applicationStatus.color} flex items-center gap-1`}>
                                <applicationStatus.icon className="w-3 h-3" />
                                <span>{applicationStatus.text}</span>
                              </div>
                            )}
                            
                            <Link href={`/jobs/${job.id}`}>
                              <Button variant="outline" size="sm">
                                Voir détails
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune offre d'emploi disponible pour cette campagne.</p>
                  {user?.role === 'company' && (
                    <p className="text-sm text-gray-500 mt-2">
                      Les entreprises peuvent ajouter des offres une fois invitées à cette campagne.
                    </p>
                  )}
                </div>
              )}
            </div>

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
