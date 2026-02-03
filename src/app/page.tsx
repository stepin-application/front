'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Campaign } from '@/types/campaign'
import { api } from '@/lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Users, Sparkles, ChevronDown, Star, Building, GraduationCap, Briefcase } from 'lucide-react'

// Composant StatCard
const StatCard = ({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="bg-white/80 dark:bg-white/20 p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-white/60 font-medium">{title}</p>
        <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
      </div>
      <div className={`p-3 bg-${color}-50 rounded-full`}>
        {icon}
      </div>
    </div>
  </div>
);

// Composant FeatureCard
const FeatureCard = ({ icon, title, description, step }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
}) => (
  <div className="bg-white/80 dark:bg-white/20 p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-orange-700 dark:bg-orange-600 rounded-full flex items-center justify-center mr-4">
        <span className="text-white font-medium">{step}</span>
      </div>
      <div className="p-3 bg-orange-50 dark:bg-white/10 rounded-full">
        {icon}
      </div>
    </div>
    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-600 dark:text-white/70">{description}</p>
  </div>
);

// Composant CampaignPreview
const CampaignPreview = ({ campaign }: { campaign: Campaign }) => {
  const createdBy = campaign.createdBy ?? { name: 'Organisation' };
  const tags = Array.isArray(campaign.tags) ? campaign.tags : [];

  return (
  <div className="bg-white/80 dark:bg-white/20 rounded-xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-orange-50 dark:bg-white/10 rounded-lg flex items-center justify-center mr-3">
          <span className="text-slate-600 dark:text-white/70 font-bold text-lg">
            {createdBy.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{campaign.title}</h3>
          <p className="text-sm text-slate-600 dark:text-white/70">{createdBy.name}</p>
        </div>
      </div>
      <span className="text-xs text-slate-500 dark:text-white/60 bg-orange-50 dark:bg-white/10 px-2 py-1 rounded">
        {campaign.location}
      </span>
    </div>
    
    <p className="text-slate-600 dark:text-white/70 mb-4 line-clamp-2">
      {campaign.description}
    </p>
    
    <div className="flex items-center justify-between mb-4">
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs text-slate-600 dark:text-white/70 bg-orange-50 dark:bg-white/10 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      <span className="text-xs text-slate-500 dark:text-white/60">
        Échéance: {campaign.studentDeadline ? new Date(campaign.studentDeadline).toLocaleDateString() : 'À venir'}
      </span>
    </div>

      <Link
        href="/login"
        className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-700 dark:bg-orange-600 hover:bg-orange-800 transition-colors"
      >
        Se connecter pour candidater
      </Link>
  </div>
  );
};

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Rediriger selon le rôle de l'utilisateur connecté
    if (user) {
      switch (user.role) {
        case 'student':
          router.push('/students/dashboard')
          return
        case 'school':
          router.push('/campaigns/school/me')
          return
        case 'company':
          router.push('/campaigns/company/me')
          return
        case 'platform_admin':
          router.push('/admin')
          return
      }
    }

    // Charger les campagnes mises en avant pour les visiteurs
    const fetchFeaturedCampaigns = async () => {
      try {
        const unwrap = (res: any) =>
          res && typeof res === 'object' && 'data' in res ? (res as any).data : res
        try {
          const response = await api.get('/campaigns/featured')
          const data = unwrap(response)
          setFeaturedCampaigns((Array.isArray(data) ? data : []).slice(0, 3))
        } catch {
          const response = await api.get('/campaigns/active')
          const data = unwrap(response)
          setFeaturedCampaigns((Array.isArray(data) ? data : []).slice(0, 3))
        }
      } catch (error) {
        console.error('Erreur lors du chargement des campagnes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedCampaigns()
  }, [user, router])

  if (user) {
    // Afficher un loader pendant la redirection
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Hero Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 bg-orange-50 dark:bg-white/10 rounded-full text-orange-900 dark:text-white text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Plateforme de recrutement nouvelle génération
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Connectez votre talent aux{' '}
              <span className="text-slate-600 dark:text-white/70">meilleures opportunités</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-white/70 mb-8 max-w-3xl mx-auto"
            >
              StepIn facilite la rencontre entre étudiants talentueux, écoles d'excellence et entreprises innovantes pour créer les carrières de demain.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-orange-700 dark:bg-orange-600 hover:bg-orange-800 transition-colors"
              >
                Se connecter
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/campaigns"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-orange-200 text-base font-medium rounded-md text-orange-900 dark:text-white bg-white/80 dark:bg-white/20 hover:bg-orange-50 dark:bg-white/10 dark:hover:bg-white/20 dark:bg-white/10 transition-colors"
              >
                Découvrir les offres
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Séparateur décoratif */}
      <div className="flex items-center justify-center mb-16">
        <div className="h-px w-24 bg-orange-200"></div>
        <ChevronDown className="w-6 h-6 text-slate-400 mx-4 dark:text-white/40" />
        <div className="h-px w-24 bg-orange-200"></div>
      </div>

      {/* Statistiques */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="py-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              StepIn en chiffres
            </h2>
            <p className="text-slate-600 dark:text-white/70">Une plateforme qui fait ses preuves</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard 
              title="Étudiants inscrits"
              value={500}
              icon={<Users className="w-6 h-6 text-orange-700 dark:text-orange-300" />}
              color="blue"
            />
            <StatCard 
              title="Écoles partenaires"
              value={50}
              icon={<GraduationCap className="w-6 h-6 text-green-600" />}
              color="green"
            />
            <StatCard 
              title="Entreprises"
              value={200}
              icon={<Building className="w-6 h-6 text-orange-700 dark:text-orange-300" />}
              color="purple"
            />
            <StatCard 
              title="Taux de placement"
              value={85}
              icon={<TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-300" />}
              color="orange"
            />
          </div>
        </div>
      </motion.div>

      {/* Campagnes mises en avant */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="py-16 bg-orange-50 dark:bg-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Opportunités du moment
            </h2>
            <p className="text-slate-600 dark:text-white/70">
              Découvrez quelques-unes des meilleures offres disponibles
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/80 dark:bg-white/20 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-orange-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-orange-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-orange-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-orange-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <CampaignPreview campaign={campaign} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/campaigns"
              className="inline-flex items-center text-slate-600 dark:text-white/70 hover:text-slate-900 dark:text-white font-medium"
            >
              Voir toutes les opportunités
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Comment ça marche */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="py-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-slate-600 dark:text-white/70">Un processus simple en 4 étapes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              step={1}
              icon={<Users className="w-6 h-6 text-slate-600 dark:text-white/70" />}
              title="Inscrivez-vous"
              description="Créez votre profil étudiant en quelques minutes"
            />
            <FeatureCard
              step={2}
              icon={<Star className="w-6 h-6 text-slate-600 dark:text-white/70" />}
              title="Explorez"
              description="Découvrez les offres qui correspondent à votre profil"
            />
            <FeatureCard
              step={3}
              icon={<Briefcase className="w-6 h-6 text-slate-600 dark:text-white/70" />}
              title="Candidatez"
              description="Postulez directement aux offres qui vous intéressent"
            />
            <FeatureCard
              step={4}
              icon={<TrendingUp className="w-6 h-6 text-slate-600 dark:text-white/70" />}
              title="Décrochez"
              description="Suivez vos candidatures et trouvez votre poste idéal"
            />
          </div>
        </div>
      </motion.div>

      {/* CTA Final */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="py-16 bg-orange-700 dark:bg-orange-600"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Prêt à donner un coup d'accélérateur à votre carrière ?
          </h2>
          <p className="text-orange-100/80 mb-8 text-lg">
            Rejoignez des milliers d'étudiants qui ont trouvé leur opportunité idéale sur StepIn
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-slate-900 dark:text-white bg-white/80 dark:bg-white/20 hover:bg-orange-50 dark:bg-white/10 dark:hover:bg-white/20 dark:bg-white/10 transition-colors"
          >
            Se connecter
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
