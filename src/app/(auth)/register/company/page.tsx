"use client"

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CompanyForm from '../components/CompanyForm';
import AccessCodeVerification from '../components/AccessCodeVerification';

export default function CompanyRegisterPage() {
  const [isVerified, setIsVerified] = useState(false);

  if (!isVerified) {
    return <AccessCodeVerification onSuccess={() => setIsVerified(true)} type="company" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center  py-12">
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
            Créer votre compte entreprise
          </h1>
          <p className="text-gray-600">
            Rejoignez notre réseau de recruteurs et trouvez vos futurs talents
          </p>
        </div>

        <CompanyForm />

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