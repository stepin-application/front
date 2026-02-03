'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import StudentProfileForm from '@/components/students/StudentProfileForm'
import { studentProfiles } from '@/lib/api'
import { User, CheckCircle, AlertCircle } from 'lucide-react'

interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  degree: string;
  graduationYear: string;
  gpa?: string;
  skills: string[];
  programmingLanguages: string[];
  experience: string;
  previousInternships: string;
  preferredJobTypes: string[];
  preferredLocations: string[];
  availabilityStart: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  additionalInfo?: string;
}

export default function StudentProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [hasProfile, setHasProfile] = useState(false)
  
  const returnTo = searchParams.get('returnTo')

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login')
      return
    }

    // Charger le profil existant depuis l'API
    const loadProfile = async () => {
      try {
        console.log('🔍 Tentative de chargement du profil pour:', user.email)
        const profileData = await studentProfiles.get()
        console.log('✅ Profil chargé:', profileData)
        setProfile(profileData)
        setHasProfile(true)
      } catch (error: any) {
        console.log('❌ Erreur lors du chargement du profil:', error.message)
        // Si le profil n'existe pas (404), créer un nouveau profil vide
        if (error.message.includes('404') || error.message.includes('not found')) {
          console.log('📝 Création d\'un nouveau profil vide')
          setProfile({
            firstName: '',
            lastName: '',
            email: user.email,
            phone: '',
            school: '',
            degree: '',
            graduationYear: '',
            gpa: '',
            skills: [],
            programmingLanguages: [],
            experience: '',
            previousInternships: '',
            preferredJobTypes: [],
            preferredLocations: [],
            availabilityStart: '',
            portfolio: '',
            github: '',
            linkedin: '',
            additionalInfo: ''
          })
          setHasProfile(false)
        } else {
          console.error('🚨 Erreur réseau ou serveur:', error)
          // En cas d'erreur réseau, utiliser localStorage comme fallback
          const existingProfile = localStorage.getItem(`student_profile_${user.id}`)
          if (existingProfile) {
            console.log('💾 Utilisation du profil en cache')
            const profileData = JSON.parse(existingProfile)
            setProfile(profileData)
            setHasProfile(true)
          } else {
            console.log('📝 Aucun profil en cache, création d\'un nouveau')
            // Créer un profil vide même en cas d'erreur
            setProfile({
              firstName: '',
              lastName: '',
              email: user.email,
              phone: '',
              school: '',
              degree: '',
              graduationYear: '',
              gpa: '',
              skills: [],
              programmingLanguages: [],
              experience: '',
              previousInternships: '',
              preferredJobTypes: [],
              preferredLocations: [],
              availabilityStart: '',
              portfolio: '',
              github: '',
              linkedin: '',
              additionalInfo: ''
            })
            setHasProfile(false)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user, router])

  const handleSubmit = async (profileData: StudentProfile) => {
    try {
      console.log('💾 Tentative de sauvegarde du profil:', profileData)
      
      if (hasProfile) {
        // Mettre à jour le profil existant
        console.log('🔄 Mise à jour du profil existant')
        await studentProfiles.update(profileData)
      } else {
        // Créer un nouveau profil
        console.log('➕ Création d\'un nouveau profil')
        await studentProfiles.create(profileData)
      }
      
      console.log('✅ Profil sauvegardé avec succès')
      setProfile(profileData)
      setHasProfile(true)
      
      // Rediriger vers l'URL de retour ou le dashboard
      if (returnTo) {
        router.push(returnTo)
      } else {
        router.push('/students/dashboard')
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde:', error)
      
      // Fallback: sauvegarder en localStorage si l'API échoue
      console.log('💾 Sauvegarde de secours en localStorage')
      localStorage.setItem(`student_profile_${user?.id}`, JSON.stringify(profileData))
      
      setProfile(profileData)
      setHasProfile(true)
      
      // Afficher un message d'avertissement mais continuer
      throw new Error('Profil sauvegardé localement. Synchronisation avec le serveur en attente.')
    }
  }

  const handleCancel = () => {
    if (returnTo) {
      router.push(returnTo)
    } else {
      router.push('/students/dashboard')
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hasProfile ? 'Modifier mon profil' : 'Compléter mon profil'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {hasProfile 
              ? 'Mettez à jour vos informations pour améliorer vos chances de matching'
              : 'Complétez votre profil pour que notre IA puisse vous proposer les meilleures opportunités'
            }
          </p>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Pourquoi compléter votre profil ?
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Notre IA utilise ces informations pour vous matcher avec les meilleures opportunités</li>
                <li>• Plus votre profil est complet, plus les matches seront précis</li>
                <li>• Les entreprises pourront mieux évaluer votre profil</li>
                <li>• Vous recevrez des recommandations personnalisées</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Profile completion status */}
        {hasProfile && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Profil complété ! Vous pouvez le modifier à tout moment.
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {profile && (
            <StudentProfileForm
              initialData={profile}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={hasProfile}
            />
          )}
        </div>

        {/* Help section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Besoin d'aide ?
              </h3>
              <p className="text-gray-600 mb-3">
                Si vous avez des questions sur la façon de remplir votre profil ou sur le processus de matching, n'hésitez pas à nous contacter.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:support@stepin.com"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@stepin.com
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="/help"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Centre d'aide
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
