"use client"

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, School, GraduationCap, Briefcase, Calendar, MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { aiMatching, jobOpenings, studentApplications, studentProfiles } from "@/lib/api";

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

interface AIMatchResult {
  id: string;
  jobId: string;
  campaignId: string;
  studentId: string;
  matchScore: number;
  reasoning?: string;
  createdAt?: string;
}

interface StudentProfile {
  studentId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  school?: string;
  degree?: string;
  graduationYear?: string;
  gpa?: string;
  skills?: string[];
  programmingLanguages?: string[];
  experience?: string;
  previousInternships?: string;
  preferredJobTypes?: string[];
  preferredLocations?: string[];
  availabilityStart?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  additionalInfo?: string;
}

const parseTextList = (value?: string) => {
  if (!value) return [];
  const byLine = value.split("\n").map((item) => item.trim()).filter(Boolean);
  if (byLine.length > 1) return byLine;
  const byComma = value.split(",").map((item) => item.trim()).filter(Boolean);
  return byComma.length > 1 ? byComma : byLine;
};

const fetchStudentProfile = async (studentId: string): Promise<StudentProfile | null> => {
  try {
    const profile = await studentProfiles.get(studentId);
    return profile || null;
  } catch {
    try {
      const batch = await studentProfiles.getByIds([studentId]);
      if (Array.isArray(batch) && batch.length > 0) {
        return batch[0] || null;
      }
    } catch {
      // Ignore fallback errors
    }
  }
  return null;
};

export default function MatchDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const studentId = Array.isArray(params?.studentId) ? params.studentId[0] : params?.studentId;

  const [job, setJob] = useState<JobOpening | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [match, setMatch] = useState<AIMatchResult | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [application, setApplication] = useState<{ id: string; status?: string } | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [confirmState, setConfirmState] = useState<{ open: boolean; status: "selected_for_interview" | "not_selected_for_interview" | "submitted" | null }>({ open: false, status: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || !studentId) return;
    let isMounted = true;
    setLoading(true);
    setError(null);
    setMatchError(null);

    const load = async () => {
      try {
        const [jobData, studentData] = await Promise.all([
          jobOpenings.getById(String(jobId)),
          fetchStudentProfile(String(studentId)),
        ]);

        if (!isMounted) return;
        setJob(jobData || null);
        setStudent(studentData || null);

        try {
          const apps = await studentApplications.getByJob(String(jobId));
          const foundApp = (Array.isArray(apps) ? apps : []).find((app: any) => String(app?.studentId) === String(studentId));
          setApplication(foundApp ? { id: String(foundApp.id), status: (foundApp as any)?.applicationStatus || (foundApp as any)?.status } : null);
        } catch {
          setApplication(null);
        }

        try {
          const results = await aiMatching.getResultsByJob(String(jobId));
          if (!isMounted) return;
          const safeResults = Array.isArray(results) ? results : [];
          const found = safeResults.find((item) => String(item.studentId) === String(studentId)) || null;
          setMatch(found);
        } catch (err: any) {
          if (!isMounted) return;
          setMatch(null);
          setMatchError(err?.message || "Erreur lors du chargement du matching.");
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || "Impossible de charger les details du matching.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [jobId, studentId]);

  const fullName = useMemo(() => {
    const first = student?.firstName?.trim() || "";
    const last = student?.lastName?.trim() || "";
    const full = `${first} ${last}`.trim();
    return full || student?.email || "Etudiant";
  }, [student?.firstName, student?.lastName, student?.email]);

  const mailto = useMemo(() => {
    if (!student?.email) return "#";
    const subject = `Entretien StepIn - ${job?.title || "Offre"}`;
    const body = `Bonjour ${fullName},\n\nNous souhaitons programmer une entrevue suite a votre candidature.\n\nBien cordialement,`;
    return `mailto:${student.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [student?.email, fullName, job?.title]);

  const requirements = useMemo(() => parseTextList(job?.requirements), [job?.requirements]);
  const benefits = useMemo(() => parseTextList(job?.benefits), [job?.benefits]);
  const tags = useMemo(() => parseTextList(job?.tags), [job?.tags]);

  const requestStatusChange = (status: "selected_for_interview" | "not_selected_for_interview") => {
    setConfirmState({ open: true, status });
  };

  const updateApplicationStatus = async (status: "selected_for_interview" | "not_selected_for_interview" | "submitted") => {
    if (!application?.id) {
      setSelectionError("Aucune candidature associee a cet etudiant.");
      return;
    }
    setUpdating(true);
    setSelectionError(null);
    try {
      await studentApplications.updateStatus(application.id, status);
      setApplication((prev) => (prev ? { ...prev, status } : prev));
    } catch (err: any) {
      setSelectionError(err?.message || "Erreur lors de la mise a jour de la candidature.");
    } finally {
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Details du matching introuvables
          </h1>
          <p className="text-gray-500 mb-6">{error || "Aucune donnee disponible."}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Details du matching</h1>
              <p className="text-gray-600 mt-1">
                {job.title} · {fullName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">{job.contractType || "Contrat"}</Badge>
              {job.location && <Badge variant="outline" className="text-xs">{job.location}</Badge>}
            </div>
          </div>
        </div>

        {matchError && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm mb-6">
            {matchError}
          </div>
        )}

        {selectionError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">
            {selectionError}
          </div>
        )}

        {!match && !matchError && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm mb-6">
            Aucun resultat de matching trouve pour cet etudiant.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Raisonnement</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {match?.reasoning || "Aucune explication disponible."}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profil du candidat</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {student.email && (
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {student.email}
                  </span>
                )}
                {student.phone && (
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {student.phone}
                  </span>
                )}
                {student.school && (
                  <span className="flex items-center">
                    <School className="w-4 h-4 mr-1" />
                    {student.school}
                  </span>
                )}
                {student.degree && (
                  <span className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    {student.degree}
                    {student.graduationYear ? ` (${student.graduationYear})` : ""}
                  </span>
                )}
              </div>

              {(student.skills || []).length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Competences</p>
                  <div className="flex flex-wrap gap-2">
                    {(student.skills || []).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(student.programmingLanguages || []).length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Langages</p>
                  <div className="flex flex-wrap gap-2">
                    {(student.programmingLanguages || []).map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {student.experience && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Experience</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{student.experience}</p>
                </div>
              )}

              {student.previousInternships && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Stages precedents</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{student.previousInternships}</p>
                </div>
              )}

              {student.additionalInfo && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Informations complementaires</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{student.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Offre</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                  {job.contractType || "Contrat"}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  {job.duration || "Duree non specifiee"}
                </div>
                {job.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {job.location}
                  </div>
                )}
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  {job.maxParticipants || 1} poste{(job.maxParticipants || 1) > 1 ? "s" : ""}
                </div>
                {job.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    Publie le {new Date(job.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                )}
              </div>
            </div>

            {requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Prerequis</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {requirements.map((req, index) => (
                    <li key={`${req}-${index}`} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {benefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Avantages</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {benefits.map((benefit, index) => (
                    <li key={`${benefit}-${index}`} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Domaines</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={`${tag}-${index}`} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
              {application?.status === "selected_for_interview" ? (
                <div className="space-y-2">
                  <a href={mailto}>
                    <Button className="w-full" disabled={!student.email}>
                      Programmer une entrevue
                    </Button>
                  </a>
                </div>
              ) : application?.status === "not_selected_for_interview" ? (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    Non retenu
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => requestStatusChange("selected_for_interview")}
                    disabled={!application?.id || updating}
                  >
                    Selectionner pour entretien
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => requestStatusChange("not_selected_for_interview")}
                    disabled={!application?.id || updating}
                  >
                    Non retenu
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
      {confirmState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmState({ open: false, status: null })}></div>
          <div className="relative bg-white rounded-xl shadow-xl border p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer l'action</h3>
            <p className="text-sm text-gray-600 mb-6">
              {confirmState.status === "selected_for_interview"
                ? "Confirmer la sélection de ce candidat ?"
                : "Confirmer le refus de ce candidat ?"}
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmState({ open: false, status: null })}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (confirmState.status) {
                    updateApplicationStatus(confirmState.status);
                  }
                  setConfirmState({ open: false, status: null });
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
