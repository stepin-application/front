"use client"

import { useState } from 'react';
import { GraduationCap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import SchoolForm from '../components/SchoolForm';
import AccessCodeVerification from '../components/AccessCodeVerification';

const benefits = [
  "Accès aux meilleures opportunités pour vos étudiants",
  "Développement de programmes adaptés",
  "Réseau d'entreprises partenaires"
];

export default function SchoolRegisterPage() {
  const [isVerified, setIsVerified] = useState(false);

  if (!isVerified) {
    return <AccessCodeVerification onSuccess={() => setIsVerified(true)} type="school" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/register"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Créer votre compte école
          </h1>
          <p className="text-gray-600">
            Rejoignez notre réseau éducatif et développez vos opportunités
          </p>
        </div>

        <SchoolForm />

        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <p className="text-gray-600">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 