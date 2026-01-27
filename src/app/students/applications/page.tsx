'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { StudentApplication, ApplicationStatus } from '@/types/campaign'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Building, 
  Clock,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Download,
  MessageSquare
} from 'lucide-react'

interface ApplicationWithDetails extends StudentApplication {
  campaign: {
    id: string
    title: string
    createdBy: {
      name: string
      logo: string
    }
    location: string
    studentDeadline: string
  }
  jobOpening: {
    title: string
    contractType: string
    location: string
  }
}

export default function StudentApplications() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [filteredApplications, setFilteredApplications] = useState<ApplicationWithDetails[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'company'>('date')

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/')
      return
    }

    const fetchApplications = async () => {
      try {
        const response = await api.get('/students/applications')
        const data =
          response && typeof response === 'object' && 'data' in response
            ? (response as any).data
            : response
        const list = Array.isArray(data) ? data : []
        setApplications(list)
        setFilteredApplications(list)
      } catch (error: any) {
        const message = error?.message || ''
        if (message.includes('No static resource') || message.includes('HTTP 404')) {
          setApplications([])
          setFilteredApplications([])
          return
        }
        console.error('Erreur lors du chargement des candidatures:', error)
        setApplications([])
        setFilteredApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [user, router])

  useEffect(() => {
    let filtered = applications

    // Filtrage par recherche
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.campaign.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobOpening.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        case 'status':
          return a.status.localeCompare(b.status)
        case 'company':
          return a.campaign.createdBy.name.localeCompare(b.campaign.createdBy.name)
        default:
          return 0
      }
    })

    setFilteredApplications(filtered)
  }, [applications, searchQuery, statusFilter, sortBy])

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return <Send className="w-5 h-5 text-blue-500" />
      case 'reviewed':
        return <Eye className="w-5 h-5 text-yellow-500" />
      case 'shortlisted':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'interview_scheduled':
        return <Calendar className="w-5 h-5 text-purple-500" />
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return 'Envoyée'
      case 'reviewed':
        return 'En cours d\'examen'
      case 'shortlisted':
        return 'Présélectionnée'
      case 'interview_scheduled':
        return 'Entretien programmé'
      case 'accepted':
        return 'Acceptée'
      case 'rejected':
        return 'Refusée'
      default:
        return 'Statut inconnu'
    }
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800'
      case 'shortlisted':
        return 'bg-orange-100 text-orange-800'
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressPercentage = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return 20
      case 'reviewed':
        return 40
      case 'shortlisted':
        return 60
      case 'interview_scheduled':
        return 80
      case 'accepted':
        return 100
      case 'rejected':
        return 100
      default:
        return 0
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
            Mes candidatures
          </h1>
          <p className="text-lg text-gray-600">
            Suivez l'évolution de toutes vos candidatures en temps réel
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par entreprise, poste ou campagne..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtre par statut */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="submitted">Envoyées</option>
                <option value="reviewed">En examen</option>
                <option value="shortlisted">Présélectionnées</option>
                <option value="interview_scheduled">Entretien programmé</option>
                <option value="accepted">Acceptées</option>
                <option value="rejected">Refusées</option>
              </select>
            </div>

            {/* Tri */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'company')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Trier par date</option>
                <option value="status">Trier par statut</option>
                <option value="company">Trier par entreprise</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des candidatures */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-lg">
                          {application.campaign.createdBy.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {application.jobOpening.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {application.campaign.createdBy.name} • {application.campaign.title}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {application.jobOpening.location}
                          </span>
                          <span className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {application.jobOpening.contractType}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Candidature envoyée le {new Date(application.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-2">{getStatusText(application.status)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progression de la candidature</span>
                      <span>{getProgressPercentage(application.status)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          application.status === 'accepted' ? 'bg-green-500' :
                          application.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${getProgressPercentage(application.status)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Timeline des étapes */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className={`flex flex-col items-center ${getProgressPercentage(application.status) >= 20 ? 'text-blue-600' : ''}`}>
                        <div className={`w-3 h-3 rounded-full ${getProgressPercentage(application.status) >= 20 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <span className="mt-1">Envoyée</span>
                      </div>
                      <div className={`flex flex-col items-center ${getProgressPercentage(application.status) >= 40 ? 'text-blue-600' : ''}`}>
                        <div className={`w-3 h-3 rounded-full ${getProgressPercentage(application.status) >= 40 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <span className="mt-1">Examinée</span>
                      </div>
                      <div className={`flex flex-col items-center ${getProgressPercentage(application.status) >= 60 ? 'text-orange-600' : ''}`}>
                        <div className={`w-3 h-3 rounded-full ${getProgressPercentage(application.status) >= 60 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                        <span className="mt-1">Présélectionnée</span>
                      </div>
                      <div className={`flex flex-col items-center ${getProgressPercentage(application.status) >= 80 ? 'text-purple-600' : ''}`}>
                        <div className={`w-3 h-3 rounded-full ${getProgressPercentage(application.status) >= 80 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                        <span className="mt-1">Entretien</span>
                      </div>
                      <div className={`flex flex-col items-center ${
                        application.status === 'accepted' ? 'text-green-600' : 
                        application.status === 'rejected' ? 'text-red-600' : ''
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          application.status === 'accepted' ? 'bg-green-500' : 
                          application.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="mt-1">Décision</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions et informations supplémentaires */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      {application.cvUrl && (
                        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          <Download className="w-4 h-4 mr-1" />
                          CV envoyé
                        </button>
                      )}
                      {application.teamsLink && (
                        <a
                          href={application.teamsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Rejoindre l'entretien
                        </a>
                      )}
                      {application.companyFeedback && (
                        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Feedback reçu
                        </button>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dernière mise à jour: {new Date(application.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Feedback de l'entreprise */}
                  {application.companyFeedback && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Feedback de l'entreprise:</h4>
                      <p className="text-sm text-gray-700">{application.companyFeedback}</p>
                    </div>
                  )}

                  {/* Date d'entretien */}
                  {application.interviewDate && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                      <h4 className="text-sm font-medium text-purple-900 mb-2">Entretien programmé:</h4>
                      <p className="text-sm text-purple-700">
                        {new Date(application.interviewDate).toLocaleDateString()} à {new Date(application.interviewDate).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune candidature trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Aucune candidature ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore envoyé de candidature.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
              <a
                href="/campaigns"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Découvrir les opportunités
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
