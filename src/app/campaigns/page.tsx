"use client";

import { useState, useMemo, useEffect } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import SearchAndFilters from "@/components/campaigns/SearchAndFilters";
import CampaignCard from "@/components/campaigns/CampaignCard";
import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  ChevronDown,
  Plus,
  Filter,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import Background from "@/components/ui/Background";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

// Types
type FilterType = "all" | "company" | "school";
type FilterStatus = "all" | "active" | "closed" | "upcoming";
type FilterTarget = "all" | "students" | "companies" | "both";

// Composants
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
      </div>
      <div className={`p-3 bg-${color}-50 rounded-full`}>{icon}</div>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
    <p className="text-gray-600">Chargement des campagnes...</p>
  </div>
);

const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="text-red-500 mb-4">
      <svg
        className="w-8 h-8 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Erreur de chargement
    </h3>
    <p className="text-gray-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
    >
      Réessayer
      <ArrowRight className="w-4 h-4 ml-2" />
    </button>
  </div>
);

const NoResults = ({ onReset }: { onReset: () => void }) => (
  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Aucune campagne trouvée
    </h3>
    <p className="text-gray-600 mb-4">
      Essayez de modifier vos critères de recherche ou de filtrage.
    </p>
    <button
      onClick={onReset}
      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
    >
      Réinitialiser les filtres
      <ArrowRight className="w-4 h-4 ml-2" />
    </button>
  </div>
);

// Page principale
export default function CampaignsPage() {
  const { user, isAuthenticated } = useAuth();
  const {
    campaigns: campaignsList,
    loading,
    error,
    loadCampaigns,
    loadActiveCampaigns,
  } = useCampaigns();

  // État
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    type: FilterType;
    status: FilterStatus;
    target: FilterTarget;
  }>({
    type: "all",
    status: "all",
    target: "all",
  });

  const [visibleItems, setVisibleItems] = useState(8);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // Charger les campagnes au montage
  useEffect(() => {
    if (isAuthenticated) {
      loadCampaigns();
    } else {
      // Pour les visiteurs, charger seulement les campagnes actives
      loadActiveCampaigns();
    }
  }, [isAuthenticated, loadCampaigns, loadActiveCampaigns]);

  // Calculs dérivés
  const filteredCampaigns = useMemo(() => {
    let campaigns = [...campaignsList];

    // Pour les visiteurs non connectés, limiter l'affichage
    if (!isAuthenticated) {
      campaigns = campaigns.slice(0, 6); // Limiter à 6 campagnes
    }

    return campaigns.filter((campaign) => {
      const matchesSearch =
        searchQuery === "" ||
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        campaign.createdBy?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesType =
        filters.type === "all" || campaign.type === filters.type;
      const matchesStatus =
        filters.status === "all" || campaign.status === filters.status;
      const matchesTarget =
        filters.target === "all" || campaign.target === filters.target;

      // Pour les étudiants, ne montrer que les campagnes ouvertes aux étudiants
      if (user?.role === "student") {
        return (
          matchesSearch &&
          matchesType &&
          matchesStatus &&
          (campaign.target === "students" || campaign.target === "both") &&
          campaign.status === "active"
        );
      }

      return matchesSearch && matchesType && matchesStatus && matchesTarget;
    });
  }, [searchQuery, filters, isAuthenticated, user, campaignsList]);

  const paginatedCampaigns = useMemo(() => {
    return filteredCampaigns.slice(0, visibleItems);
  }, [filteredCampaigns, visibleItems]);

  const stats = useMemo(
    () => ({
      active: campaignsList.filter((c) => c.status === "active").length,
      upcoming: campaignsList.filter((c) => c.status === "upcoming").length,
      total: campaignsList.length,
    }),
    [campaignsList],
  );

  // Gestionnaires d'événements
  const handleReset = () => {
    setSearchQuery("");
    setFilters({ type: "all", status: "all", target: "all" });
    setVisibleItems(8);
  };

  useEffect(() => {
    if (inView && paginatedCampaigns.length < filteredCampaigns.length) {
      setVisibleItems((prev) => prev + 8);
    }
  }, [inView, paginatedCampaigns.length, filteredCampaigns.length]);

  // Titre et description selon le rôle
  const getPageTitle = () => {
    if (!isAuthenticated) return "Découvrez nos opportunités";
    switch (user?.role) {
      case "student":
        return "Opportunités pour vous";
      case "school":
        return "Gérer vos campagnes";
      case "company":
        return "Participez aux campagnes";
      default:
        return "Explorez les Campagnes";
    }
  };

  const getPageDescription = () => {
    if (!isAuthenticated)
      return "Créez un compte pour accéder à toutes les fonctionnalités et candidater aux offres";
    switch (user?.role) {
      case "student":
        return "Trouvez les meilleures opportunités de stage et d'emploi adaptées à votre profil";
      case "school":
        return "Créez et gérez vos campagnes de recrutement pour vos étudiants";
      case "company":
        return "Découvrez les campagnes auxquelles vous pouvez participer et gérez vos invitations";
      default:
        return "Trouvez les meilleures opportunités professionnelles et académiques";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 relative overflow-hidden">
      <Background />

      <div className="container mx-auto px-4 relative">
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {!isAuthenticated
              ? "Inscription gratuite"
              : "Découvrez nos dernières opportunités"}
          </motion.div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900"
            >
              {getPageTitle()}
            </motion.h1>
            {user?.role === "school" && (
              <Link href="/campaigns/school/new">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une campagne
                </Button>
              </Link>
            )}
            {user?.role === "company" && (
              <Link href="/campaigns/company/invitations">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Voir mes invitations
                </Button>
              </Link>
            )}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {getPageDescription()}
          </motion.p>

          {/* CTA pour visiteurs non connectés */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Créer un compte étudiant
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-base font-medium rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Se connecter
              </Link>
            </motion.div>
          )}
        </div>

        {/* Séparateur décoratif */}
        <div className="flex items-center justify-center mb-12">
          <div className="h-px w-24 bg-gray-200"></div>
          <ChevronDown className="w-6 h-6 text-gray-400 mx-4" />
          <div className="h-px w-24 bg-gray-200"></div>
        </div>

        {/* Statistiques - seulement pour les utilisateurs connectés */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <StatCard
                title="Campagnes Actives"
                value={stats.active}
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                color="green"
              />
              <StatCard
                title="À Venir"
                value={stats.upcoming}
                icon={<Calendar className="w-6 h-6 text-blue-600" />}
                color="blue"
              />
              <StatCard
                title="Total des Opportunités"
                value={stats.total}
                icon={<Users className="w-6 h-6 text-purple-600" />}
                color="purple"
              />
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Barre de recherche et filtres - seulement pour les utilisateurs connectés */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-1/4"
            >
              <SearchAndFilters
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
                userRole={user?.role}
              />
            </motion.div>
          )}

          {/* Liste des campagnes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`w-full ${isAuthenticated ? "lg:w-3/4" : ""}`}
          >
            {/* Filtres simplifiés pour visiteurs */}
            {!isAuthenticated && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  Aperçu des opportunités disponibles
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Filter className="w-4 h-4 mr-1" />
                  Connectez-vous pour plus de filtres
                </div>
              </div>
            )}

            <div
              className={
                isAuthenticated ? "h-[calc(100vh-200px)] overflow-y-auto" : ""
              }
            >
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState
                  error={error}
                  onRetry={() => {
                    // Recharger les données
                    if (isAuthenticated) {
                      loadCampaigns();
                    } else {
                      loadActiveCampaigns();
                    }
                  }}
                />
              ) : filteredCampaigns.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {paginatedCampaigns.map((campaign, index) => (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index % 8) }}
                      >
                        <CampaignCard
                          campaign={campaign}
                          isAuthenticated={isAuthenticated}
                          userRole={user?.role || undefined}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Message pour visiteurs non connectés */}
                  {!isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-12 text-center bg-blue-50 rounded-lg p-8 border border-blue-200"
                    >
                      <h3 className="text-xl font-semibold text-blue-900 mb-2">
                        Vous voulez voir plus d'opportunités ?
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Créez votre compte pour accéder à toutes les campagnes,
                        utiliser les filtres avancés et candidater directement.
                      </p>
                      <Link
                        href="/register"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Créer mon compte gratuitement
                      </Link>
                    </motion.div>
                  )}

                  {/* Pagination pour utilisateurs connectés */}
                  {isAuthenticated &&
                    paginatedCampaigns.length < filteredCampaigns.length && (
                      <div ref={ref} className="h-10 mt-8 flex justify-center">
                        <div className="animate-bounce">
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                    )}
                </>
              ) : (
                <NoResults onReset={handleReset} />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
