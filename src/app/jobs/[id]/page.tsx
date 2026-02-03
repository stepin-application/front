"use client"

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Building, Clock, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { aiMatching, campaigns, jobOpenings, studentApplications, studentProfiles } from "@/lib/api";
import { ApplicationEligibility } from '@/types/campaign';

interface JobOpening {
  id: string;
  campaignId?: string;
  companyId?: string;
  title: string;
  description: string;
  contractType?: string;
  duration?: string;
  location?: string;
  maxParticipants?: number;
  requirements?: string;
  benefits?: string;
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CampaignResponse {
  id: string;
  status?: string;
  companyDeadline?: string;
  studentDeadline?: string;
  startDate?: string;
}

interface AIMatchResult {
  id: string;
  jobId: string;
  campaignId: string;
  studentId: string;
  matchScore: number;
  reasoning: string;
}

interface StudentProfileSummary {
  studentId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  skills?: string[];
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<ApplicationEligibility | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchingError, setMatchingError] = useState<string | null>(null);
  const [matchingResults, setMatchingResults] = useState<AIMatchResult[]>([]);
  const [studentsById, setStudentsById] = useState<Record<string, StudentProfileSummary>>({});
  const [applicationsByStudentId, setApplicationsByStudentId] = useState<Record<string, { id: string; status?: string }>>({});
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);
  const [selectionSending, setSelectionSending] = useState(false);
  const [updatingStudentIds, setUpdatingStudentIds] = useState<string[]>([]);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    studentId: string | null;
    status: "selected_for_interview" | "not_selected_for_interview" | "submitted" | null;
  }>({ open: false, studentId: null, status: null });

  useEffect(() => {
    if (!id) return;
    
    const fetchJob = async () => {
      try {
        const jobData = await jobOpenings.getById(String(id));
        setJob(jobData);
      } catch (error: any) {
        console.error('Error fetching job:', error);
        setError('Offre d\'emploi non trouvée');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!job?.campaignId) {
      setCampaignData(null);
      return;
    }

    let isMounted = true;
    campaigns.getById(job.campaignId)
      .then((data: CampaignResponse) => {
        if (!isMounted) return;
        setCampaignData(data || null);
      })
      .catch(() => {
        if (!isMounted) return;
        setCampaignData(null);
      });

    return () => {
      isMounted = false;
    };
  }, [job?.campaignId]);

  const isCampaignLocked = useMemo(() => {
    if (!campaignData) return false;
    const status = (campaignData.status || '').toUpperCase();
    if (status === 'LOCKED') return true;
    if (campaignData.studentDeadline) {
      const deadline = new Date(campaignData.studentDeadline);
      if (!Number.isNaN(deadline.getTime())) {
        return deadline.getTime() < Date.now();
      }
    }
    return false;
  }, [campaignData]);

  useEffect(() => {
    if (!job?.id || !user || user.role !== 'company' || !isCampaignLocked) {
      return;
    }

    let isMounted = true;
    setMatchingLoading(true);
    setMatchingError(null);
    setSelectionError(null);
    setSelectionMessage(null);

    const loadMatching = async () => {
      try {
        const results = await aiMatching.getResultsByJob(job.id);
        if (!isMounted) return;
        const safeResults = Array.isArray(results) ? results : [];
        setMatchingResults(safeResults);
        setSelectedStudentIds([]);

        const studentIds = Array.from(new Set(safeResults.map((r) => r.studentId))).filter(Boolean);
        const profilePromise = studentIds.length > 0
          ? studentProfiles.getByIds(studentIds)
          : Promise.resolve([]);

        const [profilesResult, applicationsResult] = await Promise.allSettled([
          profilePromise,
          studentApplications.getByJob(job.id),
        ]);

        if (!isMounted) return;

        if (profilesResult.status === 'fulfilled') {
          const map: Record<string, StudentProfileSummary> = {};
          for (const profile of profilesResult.value || []) {
            if (profile?.studentId) {
              map[profile.studentId] = profile;
            }
          }
          setStudentsById(map);
        } else {
          setStudentsById({});
        }

        if (applicationsResult.status === 'fulfilled') {
          const appMap: Record<string, { id: string; status?: string }> = {};
          const apps = Array.isArray(applicationsResult.value) ? applicationsResult.value : [];
          for (const app of apps) {
            const studentId = (app as any)?.studentId;
            const appId = (app as any)?.id;
            if (studentId && appId) {
              appMap[String(studentId)] = {
                id: String(appId),
                status: (app as any)?.applicationStatus || (app as any)?.status,
              };
            }
          }
          setApplicationsByStudentId(appMap);
        } else {
          setApplicationsByStudentId({});
        }
      } catch (err: any) {
        if (!isMounted) return;
        setMatchingError(err?.message || "Erreur lors du chargement du matching.");
        setMatchingResults([]);
        setStudentsById({});
        setApplicationsByStudentId({});
      } finally {
        if (!isMounted) return;
        setMatchingLoading(false);
      }
    };

    const handleFocus = () => {
      loadMatching();
    };

    const handleVisibility = () => {
      if (document.visibilityState == "visible") {
        loadMatching();
      }
    };

    loadMatching();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("popstate", handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("popstate", handleFocus);
    };
  }, [job?.id, user, isCampaignLocked]);

  useEffect(() => {
    if (!id || !user || user.role !== 'student') return;
    
    const checkEligibility = async () => {
      setCheckingEligibility(true);
      try {
        const eligibilityData = await studentApplications.checkEligibility(String(id));
        setEligibility(eligibilityData);
      } catch (error: any) {
        console.error('Error checking eligibility:', error);
        // Don't set error state for eligibility check failures
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkEligibility();
  }, [id, user]);

  const sortedMatches = useMemo(() => {
    return [...matchingResults].sort((a, b) => b.matchScore - a.matchScore);
  }, [matchingResults]);


  const requirements = useMemo(() => {
    return (job?.requirements || '').split('\n').map((item) => item.trim()).filter(Boolean);
  }, [job?.requirements]);

  const benefits = useMemo(() => {
    return (job?.benefits || '').split('\n').map((item) => item.trim()).filter(Boolean);
  }, [job?.benefits]);

  const tags = useMemo(() => {
    return (job?.tags || '').split(',').map((item) => item.trim()).filter(Boolean);
  }, [job?.tags]);

  const isApplicationWindowOpen = useMemo(() => {
    if (!campaignData) return false;
    const now = new Date();
    if (campaignData.companyDeadline) {
      const companyDate = new Date(campaignData.companyDeadline);
      if (now < companyDate) return false;
    }
    if (campaignData.studentDeadline) {
      const studentDate = new Date(campaignData.studentDeadline);
      if (now > studentDate) return false;
    }
    return true;
  }, [campaignData]);

  const canApply = user?.role === 'student' && isApplicationWindowOpen && !isCampaignLocked;
  const hasApplied = eligibility?.hasExistingApplication || false;

  const getStudentName = (profile?: StudentProfileSummary) => {
    const first = profile?.firstName?.trim() || "";
    const last = profile?.lastName?.trim() || "";
    const full = `${first} ${last}`.trim();
    return full || profile?.email || "Étudiant";
  };

  const getInterviewMailto = (email?: string, studentName?: string) => {
    if (!email) return "#";
    const subject = `Entretien StepIn - ${job?.title || "Offre"}`;
    const greeting = studentName ? `Bonjour ${studentName},` : "Bonjour,";
    const body = `${greeting}\n\nNous souhaitons programmer une entrevue suite à votre candidature.\n\nBien cordialement,`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const selectedCount = selectedStudentIds.length;

  const requestStatusChange = (studentId: string, status: "selected_for_interview" | "not_selected_for_interview") => {
    setConfirmState({ open: true, studentId, status });
  };

  const updateApplicationStatus = async (studentId: string, status: "selected_for_interview" | "not_selected_for_interview" | "submitted") => {
    const applicationId = applicationsByStudentId[studentId]?.id;
    if (!applicationId) {
      setSelectionError("Aucune candidature associee a cet etudiant.");
      return;
    }
    setUpdatingStudentIds((prev) => (prev.includes(studentId) ? prev : [...prev, studentId]));
    setSelectionError(null);
    try {
      await studentApplications.updateStatus(applicationId, status);
      setApplicationsByStudentId((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], status },
      }));
      if (status == "selected_for_interview") {
        setSelectedStudentIds((prev) => (prev.includes(studentId) ? prev : [...prev, studentId]));
      } else {
        setSelectedStudentIds((prev) => prev.filter((id) => id != studentId));
      }
    } catch (err: any) {
      setSelectionError(err?.message || "Erreur lors de la mise a jour de la candidature.");
    } finally {
      setUpdatingStudentIds((prev) => prev.filter((id) => id != studentId));
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handleSendSelection = async () => {
    if (!job?.id || selectedStudentIds.length === 0) return;
    setSelectionSending(true);
    setSelectionError(null);
    setSelectionMessage(null);

    const selectedApplications = selectedStudentIds
      .map((studentId) => applicationsByStudentId[studentId]?.id)
      .filter(Boolean) as string[];

    const missingCount = selectedStudentIds.length - selectedApplications.length;
    if (selectedApplications.length === 0) {
      setSelectionError("Aucune candidature associee aux etudiants selectionnes.");
      setSelectionSending(false);
      return;
    }

    try {
      await Promise.all(
        selectedApplications.map((applicationId) =>
          studentApplications.updateStatus(applicationId, "selected_for_interview"),
        ),
      );

      setApplicationsByStudentId((prev) => {
        const next = { ...prev };
        for (const studentId of selectedStudentIds) {
          if (next[studentId]) {
            next[studentId] = { ...next[studentId], status: "selected_for_interview" };
          }
        }
        return next;
      });

      const emails = selectedStudentIds
        .map((studentId) => studentsById[studentId]?.email)
        .filter(Boolean) as string[];

      const updatedText = `${selectedApplications.length} candidature${selectedApplications.length > 1 ? "s" : ""} mise${selectedApplications.length > 1 ? "s" : ""} a jour.`;
      const missingText = missingCount > 0
        ? ` ${missingCount} candidat${missingCount > 1 ? "s" : ""} sans candidature associee.`
        : "";
      let emailText = " Aucun email disponible pour ces candidats.";

      if (emails.length > 0) {
        const subject = `Entretien StepIn - ${job?.title || "Offre"}`;
        const body = "Bonjour,\n\nNous souhaitons programmer une entrevue suite a votre candidature.\n\nBien cordialement,";
        const mailto = `mailto:${emails.join(";")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        emailText = " Email pret a envoyer dans votre client.";
      }

      setSelectionMessage(`${updatedText}${missingText}${emailText}`);

      setSelectedStudentIds([]);
    } catch (err: any) {
      setSelectionError(err?.message || "Erreur lors de la mise a jour des candidatures.");
    } finally {
      setSelectionSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Offre non trouvée
          </h1>
          <p className="text-gray-500 mb-6">
            Cette offre d'emploi n'existe pas ou a été supprimée.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }
  
  const getApplicationStatusDisplay = () => {
    if (!eligibility?.hasExistingApplication) return null;
    
    const status = eligibility.applicationStatus;
    const appliedDate = eligibility.appliedAt ? new Date(eligibility.appliedAt).toLocaleDateString('fr-FR') : '';
    
    switch (status) {
      case 'submitted':
        return {
          text: 'Candidature envoyée',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle2
        };
      case 'selected_for_interview':
        return {
          text: 'Sélectionné pour entretien',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle2
        };
      case 'not_selected_for_interview':
        return {
          text: 'Non retenu',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle
        };
      case 'decision_accepted':
        return {
          text: 'Candidature acceptée',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle2
        };
      case 'decision_rejected':
        return {
          text: 'Candidature refusée',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle
        };
      default:
        return {
          text: 'Candidature envoyée',
          subtext: `Postulé le ${appliedDate}`,
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle2
        };
    }
  };

  const applicationStatus = getApplicationStatusDisplay();

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{job.contractType || 'Stage'}</Badge>
                  {job.duration && <Badge variant="outline">{job.duration}</Badge>}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    <span>Entreprise</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {canApply && !hasApplied && !checkingEligibility && (
                <Link href={`/jobs/${job.id}/apply`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Candidater
                  </Button>
                </Link>
              )}
              
              {canApply && hasApplied && applicationStatus && (
                <div className={`px-4 py-2 rounded-lg ${applicationStatus.color} flex items-center gap-2`}>
                  <applicationStatus.icon className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{applicationStatus.text}</p>
                    <p className="text-sm opacity-75">{applicationStatus.subtext}</p>
                  </div>
                </div>
              )}
              
              {canApply && checkingEligibility && (
                <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Vérification...</span>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 text-gray-500 mr-1" />
                </div>
                <p className="text-sm font-medium text-gray-900">{job.contractType || 'Stage'}</p>
                <p className="text-xs text-gray-500">Type de contrat</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="w-4 h-4 text-gray-500 mr-1" />
                </div>
                <p className="text-sm font-medium text-gray-900">{job.duration || 'Non spécifiée'}</p>
                <p className="text-xs text-gray-500">Durée</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-gray-500 mr-1" />
                </div>
                <p className="text-sm font-medium text-gray-900">{job.maxParticipants || 1} poste{(job.maxParticipants || 1) > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-500">À pourvoir</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du poste</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Best Candidates (matching) */}
            {user?.role === 'company' && job.campaignId && isCampaignLocked && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">Meilleurs candidats</h2>
                    <Badge variant="outline" className="text-xs">
                      {sortedMatches.length} candidat{sortedMatches.length > 1 ? 's' : ''}
                    </Badge>
                  </div>                </div>


                {selectionError && (
                  <p className="text-red-600 text-sm mb-3">{selectionError}</p>
                )}

                {matchingLoading && (
                  <p className="text-gray-600 text-sm">Chargement des résultats de matching...</p>
                )}

                {!matchingLoading && matchingError && (
                  <p className="text-red-600 text-sm">{matchingError}</p>
                )}

                {!matchingLoading && !matchingError && sortedMatches.length === 0 && (
                  <p className="text-gray-600 text-sm">
                    Le matching n'a pas encore été effectué pour cette offre.
                  </p>
                )}

                {!matchingLoading && !matchingError && sortedMatches.length > 0 && (
                  <div className="space-y-3">
                    {sortedMatches.map((result, index) => {
                      const profile = studentsById[result.studentId];
                      const name = getStudentName(profile);
                      const application = applicationsByStudentId[result.studentId];
                      const alreadySelected = application?.status === "selected_for_interview";
                      const notSelected = application?.status === "not_selected_for_interview";
                      const hasApplication = Boolean(application?.id);
                      const isSelected = selectedStudentIds.includes(result.studentId);
                      const rowKey = result.id || `${result.studentId}-${result.jobId}`;
                      const mailto = getInterviewMailto(profile?.email, name);

                      return (
                        <div
                          key={rowKey}
                          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg p-4 ${
                            isSelected ? "border-blue-200 bg-blue-50/30" : "border-gray-200"
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              #{index + 1} {name}
                            </p>
                            {profile?.email && (
                              <p className="text-xs text-gray-500">{profile.email}</p>
                            )}
                            {!hasApplication && (
                              <p className="text-xs text-amber-600 mt-1">
                                Aucune candidature associée à cet étudiant.
                              </p>
                            )}
                            {alreadySelected && (
                              <p className="text-xs text-emerald-600 mt-1">
                                Selectionnee.
                              </p>
                            )}
                            {notSelected && (
                              <p className="text-xs text-red-600 mt-1">
                                Non retenue.
                              </p>
                            )}
                            {result.reasoning && (
                              <p className="text-xs text-gray-500 mt-1">{result.reasoning}</p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 justify-end">
                            <Link href={`/jobs/${job.id}/matches/${result.studentId}`}>
                              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                Détails
                              </Button>
                            </Link>
                            {alreadySelected || isSelected ? (
                              <a href={mailto}>
                                <Button size="sm" className="w-full sm:w-auto" disabled={!profile?.email}>
                                  Programmer une entrevue
                                </Button>
                              </a>
                            ) : notSelected ? (
                              <Button variant="outline" size="sm" className="w-full sm:w-auto" disabled>
                                Non retenu
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => requestStatusChange(result.studentId, "selected_for_interview")}
                                  disabled={!hasApplication || updatingStudentIds.includes(result.studentId)}
                                  className="w-full sm:w-auto"
                                >
                                  Selectionner pour entretien
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => requestStatusChange(result.studentId, "not_selected_for_interview")}
                                  disabled={!hasApplication || updatingStudentIds.includes(result.studentId)}
                                  className="w-full sm:w-auto"
                                >
                                  Non retenu
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Prérequis</h2>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Avantages</h2>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Apply Card */}
            {user?.role === 'student' && campaignData && !isApplicationWindowOpen && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Candidatures fermées</h3>
                <p className="text-blue-800 text-sm">
                  {campaignData.companyDeadline && new Date() < new Date(campaignData.companyDeadline)
                    ? `Les candidatures ouvrent après la deadline entreprises le ${new Date(campaignData.companyDeadline).toLocaleDateString('fr-FR')}.`
                    : campaignData.studentDeadline
                      ? `La deadline étudiants est passée depuis le ${new Date(campaignData.studentDeadline).toLocaleDateString('fr-FR')}.`
                      : "La période de candidature n'est pas ouverte."}
                </p>
              </div>
            )}

            {canApply && !hasApplied && !checkingEligibility && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidater</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Intéressé par cette offre ? Postulez dès maintenant !
                </p>
                <Link href={`/jobs/${job.id}/apply`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Candidater maintenant
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Application Status Card */}
            {canApply && hasApplied && applicationStatus && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre candidature</h3>
                <div className={`p-4 rounded-lg ${applicationStatus.color} flex items-start gap-3`}>
                  <applicationStatus.icon className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-medium">{applicationStatus.text}</p>
                    <p className="text-sm opacity-75 mt-1">{applicationStatus.subtext}</p>
                  </div>
                </div>
                <p className="text-gray-600 mt-4 text-sm">
                  Vous avez déjà postulé à cette offre. Une seule candidature par offre est autorisée.
                </p>
              </div>
            )}
            
            {/* Loading Card */}
            {canApply && checkingEligibility && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidater</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Vérification de votre éligibilité...</span>
                </div>
              </div>
            )}

            {/* Job Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Type de contrat</p>
                  <p className="text-gray-900">{job.contractType || 'Stage'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Durée</p>
                  <p className="text-gray-900">{job.duration || 'Non spécifiée'}</p>
                </div>
                {job.location && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Localisation</p>
                    <p className="text-gray-900">{job.location}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Postes à pourvoir</p>
                  <p className="text-gray-900">{job.maxParticipants || 1}</p>
                </div>
                {job.createdAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Publié le</p>
                    <p className="text-gray-900">{new Date(job.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Domaines</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign Link */}
            {job.campaignId && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campagne</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Cette offre fait partie d'une campagne de recrutement.
                </p>
                <Link href={`/campaigns/${job.campaignId}`}>
                  <Button variant="outline" className="w-full">
                    Voir la campagne
                  </Button>
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
      {confirmState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmState({ open: false, studentId: null, status: null })}></div>
          <div className="relative bg-white rounded-xl shadow-xl border p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer l'action</h3>
            <p className="text-sm text-gray-600 mb-6">
              {confirmState.status === "selected_for_interview"
                ? "Confirmer la sélection de ce candidat ?"
                : "Confirmer le refus de ce candidat ?"}
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmState({ open: false, studentId: null, status: null })}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (confirmState.studentId && confirmState.status) {
                    updateApplicationStatus(confirmState.studentId, confirmState.status);
                  }
                  setConfirmState({ open: false, studentId: null, status: null });
                }}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
