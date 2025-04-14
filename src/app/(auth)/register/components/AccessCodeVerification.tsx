"use client"

import { useState } from 'react';
import { toast } from 'sonner';
import { Lock, Building, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccessCodeVerificationProps {
  onSuccess: () => void;
  type: 'company' | 'school';
}

export default function AccessCodeVerification({ onSuccess, type }: AccessCodeVerificationProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const partenairData = {
      name: type === 'company' ? 'LCL' : 'EFREI'
    };
    
    // TODO: Implémenter la vérification réelle du code d'accès avec l'API
    toast.info('Vérification du code en cours...');
    
    setTimeout(() => {
      toast.success(`Hello ${partenairData.name}, on vous a reconnu`);
      setIsLoading(false);
      onSuccess();
    }, 1000);
  };

  const getTypeInfo = () => {
    return type === 'company' 
      ? {
          icon: <Building className="w-12 h-12 text-purple-600" />,
          title: "Vérification Entreprise",
          description: "Veuillez saisir le code d'accès reçu par email pour créer votre compte entreprise."
        }
      : {
          icon: <GraduationCap className="w-12 h-12 text-green-600" />,
          title: "Vérification École", 
          description: "Veuillez saisir le code d'accès reçu par email pour créer votre compte école."
        };
  };

  const { icon, title, description } = getTypeInfo();

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 backdrop-blur-sm bg-opacity-95">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 mb-4">
              {icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
              {description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="code" className="sr-only">
                Code d'accès
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:border-purple-500 text-center text-lg tracking-[0.5em] font-mono bg-gray-50"
                  placeholder="• • • • • •"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  pattern="[A-Z0-9]{6}"
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-md text-sm font-medium text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : type === 'company'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              } transition-all duration-300 ease-in-out transform`}
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? 'Vérification...' : 'Vérifier le code'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas reçu de code ?{' '}
              <button
                onClick={() => toast.info('Un nouveau code a été envoyé à votre adresse email.')}
                className={`font-medium transition-colors duration-200 ${
                  type === 'company' ? 'text-purple-600 hover:text-purple-700' : 'text-green-600 hover:text-green-700'
                }`}
                disabled={isLoading}
              >
                Renvoyer le code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}