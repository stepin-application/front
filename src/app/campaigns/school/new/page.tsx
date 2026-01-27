"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCampaigns } from "@/hooks/useCampaigns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Building,
  Upload,
  Plus,
  Trash2,
  Info,
  Search,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { companiesData, Company } from "@/data/companiesData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function NewSchoolCampaignPage() {
  const router = useRouter();
  const { createCampaign, inviteCompany, loading, error } = useCampaigns();
  const { user } = useAuth();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyDeadline: "", // Deadline pour les entreprises de répondre
    studentDeadline: "", // Deadline pour les étudiants de candidater
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
    image: null as File | null,
    requirements: [""],
    benefits: [""],
    tags: [""],
    invitedCompanies: [] as Company[],
    invitedCompanyEmails: [""], // Liste d'emails d'entreprises
  });

  const [searchCompany, setSearchCompany] = useState("");
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
    image:
      "Une image représentative de votre école ou de l'événement (format recommandé: 16:9)",
    requirements:
      "Critères que les entreprises doivent remplir pour participer",
    benefits: "Avantages pour les entreprises participantes",
    tags: "Mots-clés permettant de catégoriser votre campagne",
    companies: "Sélectionnez les entreprises à inviter à votre campagne",
    emails:
      "Ajoutez des emails d'entreprises qui recevront automatiquement une notification de création de campagne",
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
      deadline: new Date(formData.companyDeadline).toISOString(),
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
    field: "requirements" | "benefits" | "tags" | "invitedCompanyEmails",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (
    field: "requirements" | "benefits" | "tags" | "invitedCompanyEmails",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "requirements" | "benefits" | "tags" | "invitedCompanyEmails",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const filteredCompanies = companiesData.filter(
    (company) =>
      company.name.toLowerCase().includes(searchCompany.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchCompany.toLowerCase()) ||
      company.location.toLowerCase().includes(searchCompany.toLowerCase()),
  );

  const toggleCompanySelection = (company: Company) => {
    if (selectedCompanies.find((c) => c.id === company.id)) {
      setSelectedCompanies((prev) => prev.filter((c) => c.id !== company.id));
    } else {
      setSelectedCompanies((prev) => [...prev, company]);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleImageBrowse = () => {
    imageInputRef.current?.click();
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
            Créez votre événement et invitez des entreprises à participer
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
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                Image de la campagne
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.image}
                  </div>
                </div>
              </h2>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Glissez-déposez une image ou
                </p>
                <input
                  id="campaign-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={imageInputRef}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleImageBrowse}
                >
                  Parcourir
                </Button>
                {formData.image && (
                  <p className="text-xs text-gray-500 mt-2">
                    Fichier sélectionné : {formData.image.name}
                  </p>
                )}
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

          {/* Entreprises */}
          <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                Inviter des entreprises
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.companies}
                  </div>
                </div>
              </h2>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Sélectionner des entreprises
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Sélectionner des entreprises</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher une entreprise..."
                      value={searchCompany}
                      onChange={(e) => setSearchCompany(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                    {filteredCompanies.map((company) => (
                      <div
                        key={company.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          selectedCompanies.find((c) => c.id === company.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-500"
                        } cursor-pointer transition-colors duration-200`}
                        onClick={() => toggleCompanySelection(company)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={company.logo} />
                            <AvatarFallback>{company.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {company.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {company.industry} • {company.location}
                            </p>
                          </div>
                        </div>
                        {selectedCompanies.find((c) => c.id === company.id) && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {selectedCompanies.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Entreprises sélectionnées
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCompanies.map((company) => (
                    <Badge
                      key={company.id}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={company.logo} />
                        <AvatarFallback>{company.name[0]}</AvatarFallback>
                      </Avatar>
                      {company.name}
                      <button
                        type="button"
                        onClick={() => toggleCompanySelection(company)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Emails d'entreprises */}
          <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                Emails d'entreprises à notifier
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {tooltips.emails}
                  </div>
                </div>
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Ces entreprises recevront automatiquement un email de notification
              lors de la création de la campagne.
            </p>
            {formData.invitedCompanyEmails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    handleArrayChange(
                      "invitedCompanyEmails",
                      index,
                      e.target.value,
                    )
                  }
                  placeholder="Ex: recrutement@entreprise.com"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem("invitedCompanyEmails", index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem("invitedCompanyEmails")}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un email
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
