'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { jobOpenings, studentProfiles } from '@/lib/api';
import { ArrowLeft, Briefcase, User, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

interface JobData {
  id: string;
  title: string;
  description: string;
  contractType?: string;
  duration?: string;
  location?: string;
  maxParticipants?: number;
  createdAt?: string;
  company?: {
    id: string;
    name: string;
    logo?: string;
  };
  campaign?: {
    id: string;
    name: string;
    status: string;
    deadline: string;
  };
  requirements?: string[];
  benefits?: string[];
  tags?: string[];
}

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  degree: string;
  graduationYear: number;
  skills: string[];
  experience?: string;
  projects?: string[];
  languages?: string[];
  interests?: string[];
}

export default function JobApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<JobData | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const jobId = params.id as string;

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch job details
        const jobData = await jobOpenings.getById(jobId);
        setJob(jobData);
        
        // Check if student has a profile
        try {
          const profileExists = await studentProfiles.exists();
          setHasProfile(profileExists);
          
          if (profileExists) {
            const profileData = await studentProfiles.get();
            setProfile(profileData);
          }
        } catch (profileError) {
          console.log('No profile found');
          setHasProfile(false);
        }
      } catch (err) {
        setError('Impossible de charger les détails de l\'offre');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId, user, router]);

  const handleApply = async () => {
    if (!hasProfile) {
      // Redirect to profile creation
      router.push(`/students/profile?returnTo=/jobs/${jobId}/apply`);
      return;
    }

    if (!job?.company?.id || !job?.campaign?.id) {
      setError('Informations de l\'offre incomplètes');
      return;
    }

    try {
      setApplying(true);
      setError(null);
      
      // Apply to the job using the student's profile
      await jobOpenings.apply(job.campaign.id, job.company.id, jobId, {
        candidateInfo: {
          studentId: user?.id,
          profileData: profile
        }
      });
      
      setSuccess(true);
    } catch (err: any) {
      if (err.message.includes('already applied')) {
        setError('Vous avez déjà candidaté à cette offre');
      } else if (err.message.includes('deadline')) {
        setError('La deadline pour candidater à cette offre est dépassée');
      } else {
        setError('Erreur lors de la candidature. Veuillez réessayer.');
      }
      console.error('Error applying to job:', err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidature envoyée !</h1>
          <p className="text-gray-600 mb-6">
            Votre candidature pour le poste "{job?.title}" a été envoyée avec succès.
            L'entreprise examinera votre profil et vous contactera si votre candidature est retenue.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/students/applications"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir mes candidatures
            </Link>
            <Link
              href="/campaigns"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retour aux campagnes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Candidater à cette offre</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Briefcase className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Détails de l'offre</h2>
            </div>
            
            {job && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company?.name}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{job.description}</p>
                </div>
                
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Exigences</h4>
                    <ul className="text-gray-700 space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Avantages</h4>
                    <ul className="text-gray-700 space-y-1">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Type:</span> {job.contractType || 'Stage'}
                  </div>
                  <div>
                    <span className="font-medium">Lieu:</span> {job.location}
                  </div>
                  {job.duration && (
                    <div>
                      <span className="font-medium">Durée:</span> {job.duration}
                    </div>
                  )}
                  {job.maxParticipants && (
                    <div>
                      <span className="font-medium">Postes:</span> {job.maxParticipants}
                    </div>
                  )}
                </div>

                {job.tags && job.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Domaines</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Application Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Votre candidature</h2>
            </div>
            
            {!hasProfile ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Profil requis</h3>
                <p className="text-gray-600 mb-4">
                  Vous devez compléter votre profil étudiant avant de pouvoir candidater à cette offre.
                </p>
                <Link
                  href={`/students/profile?returnTo=/jobs/${jobId}/apply`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer mon profil
                </Link>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Votre profil</h3>
                    <Link
                      href={`/students/profile?returnTo=/jobs/${jobId}/apply`}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Link>
                  </div>
                  
                  {profile && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div>
                        <span className="font-medium">{profile.firstName} {profile.lastName}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {profile.school} - {profile.degree}
                      </div>
                      <div className="text-sm text-gray-600">
                        Promotion {profile.graduationYear}
                      </div>
                      {profile.skills && profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {profile.skills.slice(0, 5).map((skill: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {profile.skills.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{profile.skills.length - 5} autres
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-4">
                    En candidatant, votre profil complet sera envoyé à l'entreprise.
                  </p>
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {applying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Candidature en cours...
                      </>
                    ) : (
                      'Envoyer ma candidature'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}