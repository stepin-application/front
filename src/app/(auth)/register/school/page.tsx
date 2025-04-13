"use client"

import { GraduationCap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import SchoolForm from '../components/SchoolForm';

const benefits = [
  "Accès aux meilleures opportunités pour vos étudiants",
  "Développement de programmes adaptés",
  "Réseau d'entreprises partenaires"
];

export default function SchoolRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-6xl w-full mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Form */}
          <div>
            <div className="mb-6">
              <Link
                href="/register"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
            </div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Créer votre compte école
              </h1>
              <p className="text-gray-600">
                Rejoignez notre réseau éducatif
              </p>
            </div>
            <SchoolForm />
          </div>

          {/* Right side - Benefits */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Pourquoi rejoindre StepIn ?
              </h2>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link href="/login" className="font-medium text-gray-900 hover:text-gray-700">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 