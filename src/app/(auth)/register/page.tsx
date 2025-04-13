"use client"

import { Building, GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CandidateForm from './components/CandidateForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Right side - Options (moved to top) */}
          <div className="lg:order-2 w-full space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-200">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0">
                  <Building className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Vous êtes une entreprise ?</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    Rejoignez notre réseau de recruteurs
                  </p>
                  <Link 
                    href="/register/company"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Créer un compte entreprise
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 hover:border-green-500 transition-colors duration-200">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Vous êtes une école ?</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    Connectez vos étudiants aux meilleures opportunités
                  </p>
                  <Link 
                    href="/register/school"
                    className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    Créer un compte école
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center pt-2 sm:pt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link href="/login" className="font-medium text-gray-900 hover:text-gray-700">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          {/* Left side - Form */}
          <div className="lg:order-1 w-full">
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
            </div>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Créer votre compte
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Commencez votre parcours professionnel
              </p>
            </div>
            <CandidateForm />
          </div>
        </div>
      </div>
    </div>
  );
}