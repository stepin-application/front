"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CandidateForm from './components/CandidateForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg mx-auto">
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
          
          <div className="text-center pt-6">
            <p className="text-xs sm:text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="font-medium text-gray-900 hover:text-gray-700">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}