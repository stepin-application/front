'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Campaign } from '@/types/campaign'
import { studentProfiles, studentApplications } from '@/lib/api'
import { campaigns, directory } from '@/lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  Calendar, 
  Briefcase, 
  Search,
  ChevronRight,
  MapPin,
  Clock,
  Star,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Edit
} from 'lucide-react'

interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  selectedApplications: number
  notSelectedApplications: number
  newCampaigns: number
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    selectedApplications: 0,
    notSelectedApplications: 0,
    newCampaigns: 0
  })
  const [recommendedCampaigns, setRecommendedCampaigns] = useState<Campaign[]>([])
  const [recentApplications, setRecentApplications] = useState<any[]>([])

  // Vérifier si l'étudiant a un profil complet
  useEffect(() => {
    const checkProfile = async () => {
      try {
        await studentProfiles.get()
        setHasProfile(true)
      } catch (error) {
        setHasProfile(false)
      } finally {
        setProfileLoading(false)
      }
    }

    if (user?.role === 'student') {
      checkProfile()
    }
  }, [user])

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/')
      return
    }

    const fetchDashboardData = async () => {
      try {
        const schools = await directory.getSchools().catch(() => [])
        const schoolsMap = Array.isArray(schools)
          ? schools.reduce((acc: Record<string, string>, school: any) => {
              if (school?.id) acc[school.id] = school.name || 'École partenaire'
              return acc
            }, {})
          : {}

        let campaignsValue: any[] = []
        try {
          const active = await campaigns.getActiveCampaigns()
          campaignsValue = Array.isArray(active) ? active : []
        } catch {
          const all = await campaigns.getAll()
          campaignsValue = Array.isArray(all) ? all : []
        }

        const mappedCampaigns: Campaign[] = campaignsValue.map((campaign: any) => ({
          id: campaign.id,
          title: campaign.name ?? campaign.title ?? 'Campagne',
          description: campaign.description ?? '',
          companyDeadline: campaign.companyDeadline ?? '',
          studentDeadline: campaign.studentDeadline ?? '',
          startDate: campaign.createdAt ?? '',
          endDate: campaign.studentDeadline ?? '',
          location: campaign.location ?? '—',
          status: campaign.status ?? 'OPEN',
          participants: 0,
          type: 'school',
          target: 'students',
          createdBy: {
            id: campaign.schoolId ?? '',
            name: schoolsMap[campaign.schoolId] || 'École partenaire',
            logo: ''
          },
          invitedCompanyEmails: [],
          respondedCompanies: [],
          tags: []
        }))

        setStats({
          totalApplications: 0,
          pendingApplications: 0,
          selectedApplications: 0,
          notSelectedApplications: 0,
          newCampaigns: mappedCampaigns.length
        })
        setRecommendedCampaigns(mappedCampaigns.slice(0, 4))
        
        // Fetch recent applications and counts using the enriched API
        try {
          const applicationsResponse = await studentApplications.getMyEnrichedApplications()
          const applicationsData = Array.isArray(applicationsResponse) ? applicationsResponse : []
          setRecentApplications(applicationsData.slice(0, 3))
          
          setStats(prevStats => ({
            ...prevStats,
            totalApplications: applicationsData.length,
            pendingApplications: applicationsData.filter(app =>
              app.applicationStatus === 'submitted'
            ).length,
            selectedApplications: applicationsData.filter(app =>
              app.applicationStatus === 'selected_for_interview'
            ).length,
            notSelectedApplications: applicationsData.filter(app =>
              app.applicationStatus === 'not_selected_for_interview'
            ).length,
          }))
        } catch (error) {
          console.error('Erreur lors du chargement des candidatures:', error)
          setRecentApplications([])
        }
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, router])

  const getApplicationStatusIcon = (status?: string) => {
    switch (status) {
      case 'submitted':
        return <Send className="w-4 h-4 text-blue-500" />
      case 'selected_for_interview':
        return <Calendar className="w-4 h-4 text-purple-500" />
      case 'not_selected_for_interview':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'decision_accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'decision_rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getApplicationStatusText = (status?: string) => {
    switch (status) {
      case 'submitted':
        return 'En attente'
      case 'selected_for_interview':
        return 'Selectionnee'
      case 'not_selected_for_interview':
        return 'Non retenue'
      case 'decision_accepted':
        return 'Acceptee'
      case 'decision_rejected':
        return 'Refusee'
      default:
        return status || 'Statut inconnu'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {user?.name} 👋
          </h1>
          <p className="text-lg text-gray-600">
            Voici un aperçu de vos candidatures et des nouvelles opportunités
          </p>
        </div>

        {/* Banner de complétion du profil */}
        {!profileLoading && !hasProfile && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Complétez votre profil pour de meilleurs matches !
                  </h3>
                  <p className="text-blue-100">
                    Notre IA utilise votre profil pour vous proposer les meilleures opportunités.
                    Plus il est complet, plus les matches seront précis.
                  </p>
                </div>
              </div>
              <Link
                href="/students/profile"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
              >
                Compléter mon profil
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        )}

        {/* Banner de profil complété */}
        {!profileLoading && hasProfile && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-green-800 font-medium">
                    Profil complété ! Vous êtes prêt pour le matching AI.
                  </p>
                  <p className="text-green-600 text-sm">
                    Vous pouvez modifier votre profil à tout moment pour améliorer vos matches.
                  </p>
                </div>
              </div>
              <Link
                href="/students/profile"
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Link>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Link href="/students/applications" className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total candidatures</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </Link>

          <Link href="/students/applications?status=submitted" className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </Link>

          <Link href="/students/applications?status=selected_for_interview" className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selectionnees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.selectedApplications}</p>
              </div>
            </div>
          </Link>

          <Link href="/students/applications?status=not_selected_for_interview" className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Non retenues</p>
                <p className="text-2xl font-bold text-gray-900">{stats.notSelectedApplications}</p>
              </div>
            </div>
          </Link>

          <Link href="/campaigns" className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nouvelles offres</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newCampaigns}</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campagnes recommandées */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recommandations pour vous
                  </h2>
                  <Link
                    href="/campaigns"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                  >
                    Voir tout
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recommendedCampaigns.length > 0 ? (
                  <div className="space-y-4">
                    {recommendedCampaigns.map((campaign) => (
                      <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-bold text-sm">
                                  {campaign.createdBy.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                                <p className="text-sm text-gray-600">{campaign.createdBy.name}</p>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {campaign.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {campaign.location}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(campaign.studentDeadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Link
                              href={`/campaigns/${campaign.id}`}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                              Voir détails
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune recommandation pour le moment</p>
                    <Link
                      href="/campaigns"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 inline-block"
                    >
                      Découvrir toutes les campagnes
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Candidatures récentes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Candidatures récentes
                  </h3>
                  <Link
                    href="/students/applications"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                  >
                    Voir tout
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentApplications.length > 0 ? (
                  <div className="space-y-3">
                    {recentApplications.map((application: any) => (
                      <Link
                        key={application.id}
                        href={`/students/applications/${application.id}`}
                        className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center">
                          {getApplicationStatusIcon(application.applicationStatus)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {application.jobTitle || 'Offre d\'emploi'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {application.companyName || 'Entreprise'} • {getApplicationStatusText(application.applicationStatus)}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : '—'}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Aucune candidature</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Actions rapides
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/campaigns"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">
                    Rechercher des offres
                  </span>
                </Link>
                <Link
                  href="/students/profile"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Star className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">
                    Mettre à jour mon profil
                  </span>
                </Link>
                <Link
                  href="/students/applications"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Briefcase className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">
                    Mes candidatures
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
