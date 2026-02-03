"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCampaigns } from "@/hooks/useCampaigns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Building,
  Plus,
  Trash2,
  Info,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Company } from "@/data/companiesData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function NewSchoolCampaignPage() {
  const router = useRouter();
  const { createCampaign, inviteCompany, loading, error } = useCampaigns();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyDeadline: "", // Deadline pour les entreprises de répondre
    studentDeadline: "", // Deadline pour les étudiants de candidater
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
    requirements: [""],
    benefits: [""],
    tags: [""],
    invitedCompanies: [] as Company[],
  });

  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);

  const tooltips = {
    title:
      "Le titre doit être clair et attractif pour les entreprises que vous souhaitez inviter",
    description:
      "Décrivez en détail l'événement, les objectifs et les opportunités pour les entreprises",
    companyDeadline:
      "Date limite pour que les entreprises acceptent l'invitation et ajoutent leurs postes",
    studentDeadline:
      "Date limite pour que les étudiants puissent candidater aux offres",
    startDate: "Date de début de l'événement ou de la période de recrutement",
    endDate: "Date de fin de l'événement ou de la période de recrutement",
    location: "Lieu de l'événement ou zone géographique concernée",
    maxParticipants: "Nombre maximum d'entreprises pouvant participer",
    requirements:
      "Critères que les entreprises doivent remplir pour participer",
    benefits: "Avantages pour les entreprises participantes",
    tags: "Mots-clés permettant de catégoriser votre campagne",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation frontend
    if (!formData.title || formData.title.trim().length < 3) {
      toast.error("Le titre doit contenir au moins 3 caractères");
      return;
    }

    if (!formData.description || formData.description.trim().length < 10) {
      toast.error("La description doit contenir au moins 10 caractères");
      return;
    }

    if (!formData.companyDeadline) {
      toast.error("La deadline entreprises est requise");
      return;
    }

    if (!formData.studentDeadline) {
      toast.error("La deadline étudiants est requise");
      return;
    }

    const companyDeadlineDate = new Date(formData.companyDeadline);
    const studentDeadlineDate = new Date(formData.studentDeadline);

    if (companyDeadlineDate <= new Date()) {
      toast.error("La deadline entreprises doit être dans le futur");
      return;
    }

    if (studentDeadlineDate <= companyDeadlineDate) {
      toast.error(
        "La deadline étudiants doit être après la deadline entreprises",
      );
      return;
    }

    if (!user?.schoolId) {
      toast.error("Impossible d'identifier votre école. Veuillez vous reconnecter.");
      return;
    }

    // Créer la campagne avec le hook
    const campaign = await createCampaign({
      schoolId: user.schoolId,
      name: formData.title,
      description: formData.description,
      companyDeadline: new Date(formData.companyDeadline).toISOString(),
      studentDeadline: new Date(formData.studentDeadline).toISOString(),
      startDate: new Date(formData.startDate).toISOString(),
    });

    if (!campaign) {
      return; // L'erreur est déjà gérée par le hook
    }

    // Envoyer les invitations
    let successCount = 0;
    if (selectedCompanies.length > 0) {
      for (const company of selectedCompanies) {
        const success = await inviteCompany(campaign.id, company.id);
        if (success) successCount++;
      }

      if (successCount > 0) {
        toast.success(`${successCount} invitation(s) envoyée(s)`);
      }
    }

    router.push("/campaigns/school/me");
  };

  const handleArrayChange = (
    field: "requirements" | "benefits" | "tags",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (
    field: "requirements" | "benefits" | "tags",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "requirements" | "benefits" | "tags",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/campaigns"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux campagnes
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Créer une nouvelle campagne école
          </h1>
          <p className="text-gray-500">
            Créez votre événement et préparez la campagne
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations principales */}
          <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Informations principales
              </h2>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
              >
                Titre de la campagne
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.title}
                  </div>
                </div>
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ex: Forum entreprises 2024"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
              >
                Description
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.description}
                  </div>
                </div>
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Décrivez l'événement, son déroulement et les opportunités..."
                rows={6}
                required
              />
            </div>

            <div>
              <label
                htmlFor="companyDeadline"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
              >
                Deadline entreprises
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.companyDeadline}
                  </div>
                </div>
              </label>
              <Input
                id="companyDeadline"
                type="datetime-local"
                value={formData.companyDeadline}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyDeadline: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="studentDeadline"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
              >
                Deadline étudiants
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.studentDeadline}
                  </div>
                </div>
              </label>
              <Input
                id="studentDeadline"
                type="datetime-local"
                value={formData.studentDeadline}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    studentDeadline: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                >
                  Date de début
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {tooltips.startDate}
                    </div>
                  </div>
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                >
                  Date de fin
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {tooltips.endDate}
                    </div>
                  </div>
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                >
                  Localisation
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {tooltips.location}
                    </div>
                  </div>
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Ex: Campus de Paris"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="maxParticipants"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                >
                  Nombre d'entreprises max
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {tooltips.maxParticipants}
                    </div>
                  </div>
                </label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxParticipants: e.target.value,
                    }))
                  }
                  placeholder="Ex: 20"
                  required
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Apercu de l'image
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-slate-100 border flex items-center justify-center text-xl font-semibold text-slate-500">
                {(formData.title?.trim()?.[0] || "C").toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Image automatique
                </p>
                <p className="text-sm text-gray-500">
                  Base sur le titre de la campagne.
                </p>
              </div>
            </div>
          </div>

          {/* Prérequis */}
          <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                Prérequis
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.requirements}
                  </div>
                </div>
              </h2>
            </div>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) =>
                    handleArrayChange("requirements", index, e.target.value)
                  }
                  placeholder="Ex: Entreprise de plus de 50 employés"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem("requirements", index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem("requirements")}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un prérequis
            </Button>
          </div>

          {/* Avantages */}
          <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                Avantages
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.benefits}
                  </div>
                </div>
              </h2>
            </div>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) =>
                    handleArrayChange("benefits", index, e.target.value)
                  }
                  placeholder="Ex: Stand personnalisé"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem("benefits", index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem("benefits")}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un avantage
            </Button>
          </div>

          {/* Tags */}
          <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                Domaines
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.tags}
                  </div>
                </div>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags
                .filter((tag) => tag)
                .map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("tags", index)}
                      className="ml-2 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Tech"
                value={formData.tags[formData.tags.length - 1]}
                onChange={(e) =>
                  handleArrayChange(
                    "tags",
                    formData.tags.length - 1,
                    e.target.value,
                  )
                }
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("tags")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création en cours..." : "Publier la campagne"}
            </Button>
            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
