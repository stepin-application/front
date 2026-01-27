'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Campaign, StudentApplication, Notification } from '@/types/campaign'
import { campaigns, directory } from '@/lib/api'
import { campaignPath } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  Calendar, 
  Briefcase, 
  Bell, 
  Search, 
  Filter,
  ChevronRight,
  MapPin,
  Clock,
  Star,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  acceptedApplications: number
  rejectedApplications: number
  newCampaigns: number
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    newCampaigns: 0
  })
  const [recommendedCampaigns, setRecommendedCampaigns] = useState<Campaign[]>([])
  const [recentApplications, setRecentApplications] = useState<StudentApplication[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

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
          companyDeadline: campaign.deadline ?? '',
          studentDeadline: campaign.deadline ?? '',
          startDate: campaign.createdAt ?? '',
          endDate: campaign.deadline ?? '',
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
          acceptedApplications: 0,
          rejectedApplications: 0,
          newCampaigns: mappedCampaigns.length
        })
        setRecommendedCampaigns(mappedCampaigns.slice(0, 4))
        setRecentApplications([])
        setNotifications([])
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, router])

  const getApplicationStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Send className="w-4 h-4 text-blue-500" />
      case 'reviewed':
        return <Eye className="w-4 h-4 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'interview_scheduled':
        return <Calendar className="w-4 h-4 text-purple-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Envoyée'
      case 'reviewed':
        return 'En cours d\'examen'
      case 'accepted':
        return 'Acceptée'
      case 'rejected':
        return 'Refusée'
      case 'interview_scheduled':
        return 'Entretien programmé'
      default:
        return 'Statut inconnu'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
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

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total candidatures</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.acceptedApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nouvelles offres</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newCampaigns}</p>
              </div>
            </div>
          </div>
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
                              href={campaignPath(campaign.id, campaign.title)}
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
                    {recentApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          {getApplicationStatusIcon(application.status)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {application.jobOpeningId}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getApplicationStatusText(application.status)}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(application.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
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

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </h3>
              </div>
              <div className="p-6">
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Aucune notification</p>
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
