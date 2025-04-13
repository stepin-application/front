"use client"

import { useState, useMemo, useEffect } from 'react';
import { campaignsData } from '@/data/campaignsData';
import SearchAndFilters from '@/components/campaigns/SearchAndFilters';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, Calendar, Sparkles, ChevronDown } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

// Types
type FilterType = 'all' | 'company' | 'school';
type FilterStatus = 'all' | 'active' | 'closed' | 'upcoming';
type FilterTarget = 'all' | 'students' | 'companies' | 'both';

// Composants
const StatCard = ({ title, value, icon, color }: {
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
      <div className={`p-3 bg-${color}-50 rounded-full`}>
        {icon}
      </div>
    </div>
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
  // État
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    type: FilterType;
    status: FilterStatus;
    target: FilterTarget;
  }>({
    type: 'all',
    status: 'all',
    target: 'all'
  });

  const [visibleItems, setVisibleItems] = useState(8);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  });

  // Calculs dérivés
  const filteredCampaigns = useMemo(() => {
    return campaignsData.filter(campaign => {
      const matchesSearch = searchQuery === '' || 
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filters.type === 'all' || campaign.type === filters.type;
      const matchesStatus = filters.status === 'all' || campaign.status === filters.status;
      const matchesTarget = filters.target === 'all' || campaign.target === filters.target;
      return matchesSearch && matchesType && matchesStatus && matchesTarget;
    });
  }, [searchQuery, filters]);

  const paginatedCampaigns = useMemo(() => {
    return filteredCampaigns.slice(0, visibleItems);
  }, [filteredCampaigns, visibleItems]);

  const stats = useMemo(() => ({
    active: campaignsData.filter(c => c.status === 'active').length,
    upcoming: campaignsData.filter(c => c.status === 'upcoming').length,
    total: campaignsData.length
  }), []);

  // Gestionnaires d'événements
  const handleReset = () => {
    setSearchQuery('');
    setFilters({ type: 'all', status: 'all', target: 'all' });
    setVisibleItems(8);
  };

  useEffect(() => {
    if (inView && paginatedCampaigns.length < filteredCampaigns.length) {
      setVisibleItems(prev => prev + 8);
    }
  }, [inView, paginatedCampaigns.length, filteredCampaigns.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 relative overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-56 h-56 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-8 right-20 w-56 h-56 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
        
        {/* Motifs géométriques */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-200 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-200 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-gray-200 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-gray-200 rounded-full"></div>
        
        {/* Lignes ondulées */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,128 C100,100 200,150 300,128 C400,100 500,150 600,128" stroke="currentColor" fill="none" className="text-gray-300" strokeWidth="2"></path>
          <path d="M0,96 C100,150 200,50 300,96 C400,150 500,50 600,96" stroke="currentColor" fill="none" className="text-gray-300" strokeWidth="2"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Découvrez nos dernières opportunités
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Explorez les Campagnes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Trouvez les meilleures opportunités professionnelles et académiques adaptées à votre profil
          </motion.p>
        </div>

        {/* Séparateur décoratif */}
        <div className="flex items-center justify-center mb-12">
          <div className="h-px w-24 bg-gray-200"></div>
          <ChevronDown className="w-6 h-6 text-gray-400 mx-4" />
          <div className="h-px w-24 bg-gray-200"></div>
        </div>

        {/* En-tête avec statistiques */}
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Barre de recherche et filtres */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/4"
          >
            <div className="lg:sticky lg:top-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 backdrop-blur-sm bg-opacity-90">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Affiner la recherche</h2>
              <SearchAndFilters
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
              />
            </div>
          </motion.div>

          {/* Liste des campagnes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-3/4"
          >
            <div className="h-[calc(100vh-200px)] overflow-y-auto">
              {filteredCampaigns.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {paginatedCampaigns.map((campaign, index) => (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index % 8) }}
                      >
                        <CampaignCard campaign={campaign} />
                      </motion.div>
                    ))}
                  </div>
                  {paginatedCampaigns.length < filteredCampaigns.length && (
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
