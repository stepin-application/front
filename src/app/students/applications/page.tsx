'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ApplicationStatus } from '@/types/campaign'
import { studentApplications } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, 
  Calendar, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  MessageSquare
} from 'lucide-react'

interface ApplicationWithDetails {
  id: string
  studentId: string
  campaignId: string
  jobId: string
  companyId: string
  coverLetter?: string
  cvFilePath?: string
  applicationStatus: string
  appliedAt: string
  updatedAt: string
  // Enriched data from backend
  campaignTitle?: string
  jobTitle?: string
  jobLocation?: string
  companyName?: string
  contractType?: string
}

export default function StudentApplications() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [filteredApplications, setFilteredApplications] = useState<ApplicationWithDetails[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all' | 'pending'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'company'>('date')

  // Handle URL parameters for initial filtering
  useEffect(() => {
    const statusParam = searchParams.get('status')
    if (statusParam === 'pending') {
      setStatusFilter('submitted') // Default to submitted for pending
    } else if (statusParam === 'accepted') {
      setStatusFilter('decision_accepted')
    } else if (statusParam && ['submitted', 'selected_for_interview', 'not_selected_for_interview', 'decision_accepted', 'decision_rejected'].includes(statusParam)) {
      setStatusFilter(statusParam as ApplicationStatus)
    }
  }, [searchParams])

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/')
      return
    }

    const fetchApplications = async () => {
      try {
        const applications = await studentApplications.getMyEnrichedApplications()
        const list = Array.isArray(applications) ? applications : []
        
        setApplications(list)
        setFilteredApplications(list)
      } catch (error: any) {
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
        app.campaignTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.campaignId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.companyId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        // Special case for pending: includes submitted and selected_for_interview
        filtered = filtered.filter(app => 
          app.applicationStatus === 'submitted' || 
          app.applicationStatus === 'selected_for_interview'
        )
      } else {
        filtered = filtered.filter(app => app.applicationStatus === statusFilter)
      }
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        case 'status':
          return a.applicationStatus.localeCompare(b.applicationStatus)
        case 'company':
          return (a.companyName || a.companyId).localeCompare(b.companyName || b.companyId)
        default:
          return 0
      }
    })

    setFilteredApplications(filtered)
  }, [applications, searchQuery, statusFilter, sortBy])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Send className="w-5 h-5 text-blue-500" />
      case 'selected_for_interview':
        return <Calendar className="w-5 h-5 text-purple-500" />
      case 'not_selected_for_interview':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'decision_accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'decision_rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Envoyée'
      case 'selected_for_interview':
        return 'Sélectionnée pour entretien'
      case 'not_selected_for_interview':
        return 'Non retenue'
      case 'decision_accepted':
        return 'Acceptée'
      case 'decision_rejected':
        return 'Refusée'
      default:
        return status || 'Statut inconnu'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'selected_for_interview':
        return 'bg-purple-100 text-purple-800'
      case 'not_selected_for_interview':
        return 'bg-red-100 text-red-800'
      case 'decision_accepted':
        return 'bg-green-100 text-green-800'
      case 'decision_rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'submitted':
        return 33 // Envoyée
      case 'selected_for_interview':
        return 66 // Sélectionnée
      case 'not_selected_for_interview':
      case 'decision_accepted':
      case 'decision_rejected':
        return 100 // Décision
      default:
        return 33
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
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all' | 'pending')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="submitted">Envoyées</option>
                <option value="selected_for_interview">Sélectionnées pour entretien</option>
                <option value="not_selected_for_interview">Non retenues</option>
                <option value="decision_accepted">Acceptées</option>
                <option value="decision_rejected">Refusées</option>
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
                          {(application.companyName || application.companyId).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {application.jobTitle || `Offre d'emploi`}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {application.companyName || `Entreprise`} • {application.campaignTitle || `Campagne`}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          {application.jobLocation && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {application.jobLocation}
                            </span>
                          )}
                          {application.contractType && (
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {application.contractType}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Candidature envoyée le {new Date(application.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.applicationStatus)}`}>
                        {getStatusIcon(application.applicationStatus)}
                        <span className="ml-2">{getStatusText(application.applicationStatus)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progression de la candidature</span>
                      <span>{getProgressPercentage(application.applicationStatus)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          application.applicationStatus === 'decision_accepted' ? 'bg-green-500' :
                          application.applicationStatus === 'decision_rejected' || application.applicationStatus === 'not_selected_for_interview' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${getProgressPercentage(application.applicationStatus)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Timeline des étapes */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className={`flex flex-col items-center ${getProgressPercentage(application.applicationStatus) >= 33 ? 'text-blue-600' : ''}`}>
                        <div className={`w-3 h-3 rounded-full ${getProgressPercentage(application.applicationStatus) >= 33 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <span className="mt-1">Envoyée</span>
                      </div>
                      <div className={`flex flex-col items-center ${getProgressPercentage(application.applicationStatus) >= 66 ? 'text-orange-600' : ''}`}>
                        <div className={`w-3 h-3 rounded-full ${getProgressPercentage(application.applicationStatus) >= 66 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                        <span className="mt-1">Sélectionnée</span>
                      </div>
                      <div className={`flex flex-col items-center ${
                        application.applicationStatus === 'decision_accepted' ? 'text-green-600' : 
                        application.applicationStatus === 'decision_rejected' || application.applicationStatus === 'not_selected_for_interview' ? 'text-red-600' : ''
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          application.applicationStatus === 'decision_accepted' ? 'bg-green-500' : 
                          application.applicationStatus === 'decision_rejected' || application.applicationStatus === 'not_selected_for_interview' ? 'bg-red-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="mt-1">Décision</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions et informations supplémentaires */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      {application.cvFilePath && (
                        <span className="flex items-center text-sm text-gray-600">
                          <Download className="w-4 h-4 mr-1" />
                          CV envoyé
                        </span>
                      )}
                      {application.coverLetter && (
                        <span className="flex items-center text-sm text-gray-600">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Lettre de motivation
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dernière mise à jour: {new Date(application.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
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
