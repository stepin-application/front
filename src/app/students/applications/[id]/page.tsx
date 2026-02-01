"use client"

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { studentApplications } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
} from "lucide-react";

interface ApplicationWithDetails {
  id: string;
  studentId: string;
  campaignId: string;
  jobId: string;
  companyId: string;
  coverLetter?: string;
  cvFilePath?: string;
  applicationStatus: string;
  appliedAt: string;
  updatedAt: string;
  campaignTitle?: string;
  jobTitle?: string;
  jobLocation?: string;
  companyName?: string;
  contractType?: string;
}

export default function StudentApplicationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationWithDetails | null>(null);

  useEffect(() => {
    if (!applicationId) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const applications = await studentApplications.getMyEnrichedApplications();
        const list = Array.isArray(applications) ? applications : [];
        const found = list.find((item: any) => String(item?.id) == String(applicationId)) || null;
        if (!isMounted) return;
        setApplication(found);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || "Impossible de charger la candidature.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  const statusIcon = useMemo(() => {
    switch (application?.applicationStatus) {
      case "submitted":
        return <Send className="w-5 h-5 text-blue-500" />;
      case "selected_for_interview":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "not_selected_for_interview":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "decision_accepted":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "decision_rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  }, [application?.applicationStatus]);

  const statusText = useMemo(() => {
    switch (application?.applicationStatus) {
      case "submitted":
        return "En attente";
      case "selected_for_interview":
        return "Selectionnee";
      case "not_selected_for_interview":
        return "Non retenue";
      case "decision_accepted":
        return "Acceptee";
      case "decision_rejected":
        return "Refusee";
      default:
        return "Statut inconnu";
    }
  }, [application?.applicationStatus]);

  const statusColor = useMemo(() => {
    switch (application?.applicationStatus) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "selected_for_interview":
        return "bg-green-100 text-green-800";
      case "not_selected_for_interview":
        return "bg-red-100 text-red-800";
      case "decision_accepted":
        return "bg-green-100 text-green-800";
      case "decision_rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, [application?.applicationStatus]);

  const progressValue = useMemo(() => {
    switch (application?.applicationStatus) {
      case "submitted":
        return 50;
      case "selected_for_interview":
      case "not_selected_for_interview":
      case "decision_accepted":
      case "decision_rejected":
        return 100;
      default:
        return 50;
    }
  }, [application?.applicationStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center p-8 bg-white rounded-lg shadow-sm border">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Candidature introuvable</h1>
          <p className="text-gray-600 mb-6">{error || "Cette candidature n'existe pas."}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {application.jobTitle || "Candidature"}
              </h1>
              <p className="text-gray-600 mt-1">
                {application.companyName || "Entreprise"} - {application.campaignTitle || "Campagne"}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-3">
                {application.jobLocation && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {application.jobLocation}
                  </span>
                )}
                {application.contractType && (
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {application.contractType}
                  </span>
                )}
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Envoyee le {new Date(application.appliedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${statusColor}`}>
              {statusIcon}
              <span className="ml-2">{statusText}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Progression</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Avancement</span>
                  <span>{progressValue}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      application.applicationStatus === "not_selected_for_interview" ||
                      application.applicationStatus === "decision_rejected"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className={`flex flex-col items-center ${progressValue >= 50 ? "text-blue-600" : ""}`}>
                  <div className={`w-3 h-3 rounded-full ${progressValue >= 50 ? "bg-blue-500" : "bg-gray-300"}`}></div>
                  <span className="mt-1">En attente</span>
                </div>
                <div className={`flex flex-col items-center ${
                  application.applicationStatus === "decision_accepted"
                    ? "text-green-600"
                    : application.applicationStatus === "decision_rejected" || application.applicationStatus === "not_selected_for_interview"
                    ? "text-red-600"
                    : ""
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    application.applicationStatus === "decision_accepted"
                      ? "bg-green-500"
                      : application.applicationStatus === "decision_rejected" || application.applicationStatus === "not_selected_for_interview"
                      ? "bg-red-500"
                      : "bg-gray-300"
                  }`}></div>
                  <span className="mt-1">
                    {application.applicationStatus === "decision_rejected" || application.applicationStatus === "not_selected_for_interview"
                      ? "Non retenue"
                      : "Selectionnee"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Apercu de l'offre</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                  {application.jobTitle || "Offre"}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  {application.jobLocation || "Localisation"}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  {application.contractType || "Type de contrat"}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  Envoyee le {new Date(application.appliedAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-2">
                <Link href={application.jobId ? `/jobs/${application.jobId}` : "/campaigns"}>
                  <Button className="w-full">
                    Voir l'offre
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
