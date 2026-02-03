"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Mail, Phone, School, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studentProfiles } from "@/lib/api";

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

export default function StudentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    studentProfiles.get(String(id))
      .then((data: StudentProfile) => {
        if (!isMounted) return;
        setStudent(data || null);
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        setStudent(null);
        setError(err?.message || "Profil étudiant introuvable.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const fullName = useMemo(() => {
    const first = student?.firstName?.trim() || "";
    const last = student?.lastName?.trim() || "";
    return `${first} ${last}`.trim() || student?.email || "Étudiant";
  }, [student?.firstName, student?.lastName, student?.email]);

  const mailto = useMemo(() => {
    if (!student?.email) return "#";
    const subject = "Entretien StepIn";
    const body = `Bonjour ${fullName},\n\nNous souhaitons programmer une entrevue suite à votre candidature.\n\nBien cordialement,`;
    return `mailto:${student.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [student?.email, fullName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Profil étudiant introuvable
          </h1>
          <p className="text-gray-500 mb-6">{error || "Aucune donnée disponible."}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{fullName}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
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
              </div>
            </div>
            <a href={mailto}>
              <Button disabled={!student.email}>
                Programmer une entrevue
              </Button>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Parcours</h2>
              <div className="space-y-2 text-sm text-gray-700">
                {student.school && (
                  <p className="flex items-center">
                    <School className="w-4 h-4 mr-2" />
                    {student.school}
                  </p>
                )}
                {student.degree && (
                  <p className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {student.degree} {student.graduationYear ? `(${student.graduationYear})` : ""}
                  </p>
                )}
                {student.gpa && <p>GPA: {student.gpa}</p>}
              </div>
            </div>

            {student.experience && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Expérience</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{student.experience}</p>
              </div>
            )}

            {student.previousInternships && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Stages précédents</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{student.previousInternships}</p>
              </div>
            )}

            {student.additionalInfo && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Informations complémentaires</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{student.additionalInfo}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {(student.skills || []).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Langages</h2>
              <div className="flex flex-wrap gap-2">
                {(student.programmingLanguages || []).map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            {(student.preferredJobTypes || student.preferredLocations) && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Préférences</h2>
                {student.preferredJobTypes && student.preferredJobTypes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-2">Types de contrat</p>
                    <div className="flex flex-wrap gap-2">
                      {student.preferredJobTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {student.preferredLocations && student.preferredLocations.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Localisations</p>
                    <div className="flex flex-wrap gap-2">
                      {student.preferredLocations.map((loc) => (
                        <Badge key={loc} variant="outline" className="text-xs">
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Liens</h2>
              <div className="space-y-2 text-sm text-gray-700">
                {student.portfolio && <p>Portfolio: {student.portfolio}</p>}
                {student.github && <p>GitHub: {student.github}</p>}
                {student.linkedin && <p>LinkedIn: {student.linkedin}</p>}
              </div>
            </div>

            {student.availabilityStart && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Disponibilité</h2>
                <p className="text-sm text-gray-700">
                  À partir du {new Date(student.availabilityStart).toLocaleDateString("fr-FR")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
