'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Campaign, JobOpening } from '@/types/campaign'
import { api } from '@/lib/api'
import { useRouter, useParams } from 'next/navigation'
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase
} from 'lucide-react'

interface ApplicationForm {
  jobOpeningId: string
  coverLetter: string
  cvFile: File | null
  additionalDocuments: File[]
}

export default function ApplyToCampaign() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([])
  const [hasApplied, setHasApplied] = useState(false)
  const [form, setForm] = useState<ApplicationForm>({
    jobOpeningId: '',
    coverLetter: '',
    cvFile: null,
    additionalDocuments: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login')
      return
    }

    const fetchCampaignData = async () => {
      try {
        const [campaignRes, jobOpeningsRes, applicationStatusRes] = await Promise.all([
          api.get(`/campaigns/${campaignId}`),
          api.get(`/campaigns/${campaignId}/job-openings`),
          api.get(`/campaigns/${campaignId}/application-status`)
        ])

        setCampaign(campaignRes.data)
        setJobOpenings(jobOpeningsRes.data)
        setHasApplied(applicationStatusRes.data.hasApplied)

        // Pré-sélectionner le premier job opening s'il n'y en a qu'un
        if (jobOpeningsRes.data.length === 1) {
          setForm(prev => ({ ...prev, jobOpeningId: jobOpeningsRes.data[0].id }))
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la campagne:', error)
        router.push('/campaigns')
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignData()
  }, [campaignId, user, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!form.jobOpeningId) {
      newErrors.jobOpeningId = 'Veuillez sélectionner un poste'
    }

    if (!form.coverLetter.trim()) {
      newErrors.coverLetter = 'La lettre de motivation est requise'
    } else if (form.coverLetter.trim().length < 100) {
      newErrors.coverLetter = 'La lettre de motivation doit contenir au moins 100 caractères'
    }

    if (!form.cvFile) {
      newErrors.cvFile = 'Veuillez télécharger votre CV'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'additional') => {
    const files = event.target.files
    if (!files) return

    if (type === 'cv') {
      const file = files[0]
      if (file) {
        // Vérifier le type de fichier
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!allowedTypes.includes(file.type)) {
          setErrors(prev => ({ ...prev, cvFile: 'Seuls les fichiers PDF et Word sont acceptés' }))
          return
        }

        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, cvFile: 'Le fichier ne doit pas dépasser 5MB' }))
          return
        }

        setForm(prev => ({ ...prev, cvFile: file }))
        setErrors(prev => ({ ...prev, cvFile: '' }))
      }
    } else {
      const newFiles = Array.from(files)
      setForm(prev => ({ 
        ...prev, 
        additionalDocuments: [...prev.additionalDocuments, ...newFiles] 
      }))
    }
  }

  const removeAdditionalDocument = (index: number) => {
    setForm(prev => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('campaignId', campaignId)
      formData.append('jobOpeningId', form.jobOpeningId)
      formData.append('coverLetter', form.coverLetter)
      
      if (form.cvFile) {
        formData.append('cv', form.cvFile)
      }

      form.additionalDocuments.forEach((file, index) => {
        formData.append(`additionalDocument_${index}`, file)
      })

      await api.post('/students/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Rediriger vers la page de confirmation
      router.push(`/campaigns/${campaignId}/apply/success`)
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de la candidature:', error)
      setErrors({ submit: error.response?.data?.message || 'Une erreur est survenue lors de l\'envoi' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campagne introuvable</h2>
          <p className="text-gray-600 mb-4">Cette campagne n'existe pas ou n'est plus disponible.</p>
          <button
            onClick={() => router.push('/campaigns')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux campagnes
          </button>
        </div>
      </div>
    )
  }

  if (hasApplied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidature déjà envoyée</h2>
          <p className="text-gray-600 mb-4">Vous avez déjà candidaté à cette campagne.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/students/applications')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir mes candidatures
            </button>
            <button
              onClick={() => router.push('/campaigns')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Autres opportunités
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Vérifier si la deadline est passée
  const isDeadlinePassed = new Date() > new Date(campaign.studentDeadline)

  if (isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deadline dépassée</h2>
          <p className="text-gray-600 mb-4">
            La deadline pour candidater à cette campagne était le {new Date(campaign.studentDeadline).toLocaleDateString()}.
          </p>
          <button
            onClick={() => router.push('/campaigns')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Découvrir d'autres opportunités
          </button>
        </div>
      </div>
    )
  }

  const selectedJobOpening = jobOpenings.find(job => job.id === form.jobOpeningId)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Candidater à {campaign.title}
          </h1>
          <p className="text-lg text-gray-600">
            Complétez votre candidature pour cette opportunité
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de candidature */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sélection du poste */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Sélectionner un poste
                </h2>
                {jobOpenings.length > 0 ? (
                  <div className="space-y-3">
                    {jobOpenings.map((job) => (
                      <label key={job.id} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="jobOpening"
                          value={job.id}
                          checked={form.jobOpeningId === job.id}
                          onChange={(e) => setForm(prev => ({ ...prev, jobOpeningId: e.target.value }))}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                            <span className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {job.contractType}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {job.maxParticipants} postes
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Aucun poste disponible pour cette campagne.</p>
                )}
                {errors.jobOpeningId && (
                  <p className="text-red-600 text-sm mt-2">{errors.jobOpeningId}</p>
                )}
              </div>

              {/* Upload CV */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Télécharger votre CV
                </h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="mb-4">
                    <label htmlFor="cv-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        Cliquez pour télécharger
                      </span>
                      <span className="text-gray-600"> ou glissez-déposez votre CV</span>
                    </label>
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, 'cv')}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Formats acceptés: PDF, DOC, DOCX (max 5MB)
                  </p>
                  {form.cvFile && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">{form.cvFile.name}</span>
                      </div>
                    </div>
                  )}
                </div>
                {errors.cvFile && (
                  <p className="text-red-600 text-sm mt-2">{errors.cvFile}</p>
                )}
              </div>

              {/* Lettre de motivation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Lettre de motivation
                </h2>
                <textarea
                  value={form.coverLetter}
                  onChange={(e) => setForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                  placeholder="Expliquez pourquoi vous êtes intéressé(e) par cette opportunité et ce que vous pouvez apporter à l'entreprise..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Minimum 100 caractères
                  </p>
                  <p className="text-sm text-gray-500">
                    {form.coverLetter.length} caractères
                  </p>
                </div>
                {errors.coverLetter && (
                  <p className="text-red-600 text-sm mt-2">{errors.coverLetter}</p>
                )}
              </div>

              {/* Documents supplémentaires (optionnel) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Documents supplémentaires (optionnel)
                </h2>
                <p className="text-gray-600 mb-4">
                  Vous pouvez ajouter des documents complémentaires (portfolio, certificats, etc.)
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <label htmlFor="additional-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Ajouter des documents
                    </span>
                  </label>
                  <input
                    id="additional-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, 'additional')}
                    className="hidden"
                  />
                </div>
                {form.additionalDocuments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {form.additionalDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAdditionalDocument(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Erreur de soumission */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar avec informations */}
          <div className="space-y-6">
            {/* Informations sur la campagne */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations sur la campagne
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Building className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-900">{campaign.createdBy.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-900">{campaign.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-900">
                    Deadline: {new Date(campaign.studentDeadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-900">
                    {campaign.participants} candidatures reçues
                  </span>
                </div>
              </div>
            </div>

            {/* Informations sur le poste sélectionné */}
            {selectedJobOpening && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Détails du poste
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedJobOpening.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{selectedJobOpening.description}</p>
                  </div>
                  {selectedJobOpening.requirements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Exigences:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedJobOpening.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedJobOpening.benefits.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Avantages:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedJobOpening.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Conseils */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Conseils pour votre candidature
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  Personnalisez votre lettre de motivation
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  Mettez en avant vos compétences pertinentes
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  Vérifiez l'orthographe et la grammaire
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  Assurez-vous que votre CV est à jour
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}