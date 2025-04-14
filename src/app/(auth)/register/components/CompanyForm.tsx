"use client"

import { useState } from 'react';
import { Building, Mail, Lock, Eye, EyeOff, Users, Globe, Phone, Info } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CompanyForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    industry: '',
    size: '',
    website: '',
    phone: '',
    address: '',
    description: ''
  });

  const tooltips = {
    companyName: "Entrez le nom légal complet de votre entreprise",
    email: "Utilisez une adresse email professionnelle de votre entreprise",
    password: "Minimum 8 caractères, incluant lettres, chiffres et caractères spéciaux",
    industry: "Secteur principal d'activité de votre entreprise",
    size: "Nombre total d'employés dans votre entreprise",
    website: "URL complète de votre site web (commençant par http:// ou https://)",
    phone: "Numéro de téléphone au format international ou national",
    description: "Brève présentation de votre entreprise, de ses activités et de sa culture"
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    delete newErrors[name];

    switch (name) {
      case 'companyName':
        if (value.length < 2) {
          newErrors[name] = 'Le nom doit contenir au moins 2 caractères';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[name] = 'Email invalide';
        }
        break;
      case 'password':
        if (value.length < 8) {
          newErrors[name] = 'Le mot de passe doit contenir au moins 8 caractères';
        }
        break;
      case 'phone':
        const phoneRegex = /^[0-9\s-+()]{10,}$/;
        if (value && !phoneRegex.test(value)) {
          newErrors[name] = 'Numéro de téléphone invalide';
        }
        break;
      case 'website':
        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
          newErrors[name] = 'URL invalide (doit commencer par http:// ou https://)';
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateForm = () => {
    const requiredFields = ['companyName', 'email', 'password', 'industry', 'size'];
    const newErrors: Record<string, string> = {};

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = 'Ce champ est obligatoire';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsLoading(true);
    toast.info('Traitement de votre demande...');
    
    try {
      // Simuler une requête d'inscription
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Remplacez ceci par votre logique d'inscription réelle
      console.log('Inscription entreprise:', JSON.stringify(formData, null, 2));
      toast.success('Votre compte entreprise a été créé avec succès ! Bienvenue sur StepIn !');
  } catch (error) {
      toast.error('Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.');
  } finally {
      setIsLoading(false);
  }
  };

  const getInputClassName = (name: string) => {
    return `block w-full pl-10 pr-3 py-2 border ${
      errors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
    } rounded-lg shadow-sm focus:ring-2 sm:text-sm transition-colors duration-200`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="companyName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Nom de l'entreprise
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {tooltips.companyName}
              </div>
            </div>
          </label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className={`h-5 w-5 ${errors.companyName ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            className={getInputClassName('companyName')}
            placeholder="Nom de votre entreprise"
            value={formData.companyName}
            onChange={handleChange}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.companyName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Email
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {tooltips.email}
              </div>
            </div>
          </label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className={`h-5 w-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={getInputClassName('email')}
            placeholder="contact@entreprise.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Mot de passe
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {tooltips.password}
              </div>
            </div>
          </label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className={`h-5 w-5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className={getInputClassName('password')}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.password}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="industry" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Secteur d'activité
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {tooltips.industry}
                </div>
              </div>
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className={`h-5 w-5 ${errors.industry ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <input
              id="industry"
              name="industry"
              type="text"
              required
              className={getInputClassName('industry')}
              placeholder="Informatique, Finance, etc."
              value={formData.industry}
              onChange={handleChange}
            />
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.industry}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="size" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Taille de l'entreprise
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {tooltips.size}
                </div>
              </div>
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className={`h-5 w-5 ${errors.size ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <select
              id="size"
              name="size"
              required
              className={getInputClassName('size')}
              value={formData.size}
              onChange={handleChange}
            >
              <option value="">Sélectionnez</option>
              <option value="1-10">1-10 employés</option>
              <option value="11-50">11-50 employés</option>
              <option value="51-200">51-200 employés</option>
              <option value="201-500">201-500 employés</option>
              <option value="501+">501+ employés</option>
            </select>
            {errors.size && (
              <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.size}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="website" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Site web
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {tooltips.website}
                </div>
              </div>
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className={`h-5 w-5 ${errors.website ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <input
              id="website"
              name="website"
              type="url"
              className={getInputClassName('website')}
              placeholder="https://www.entreprise.com"
              value={formData.website}
              onChange={handleChange}
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.website}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Téléphone
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {tooltips.phone}
                </div>
              </div>
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className={`h-5 w-5 ${errors.phone ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={getInputClassName('phone')}
              placeholder="01 23 45 67 89"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Description de l'entreprise
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {tooltips.description}
              </div>
            </div>
          </label>
        </div>
        <textarea
          id="description"
          name="description"
          rows={4}
          className={getInputClassName('description')}
          placeholder="Présentez votre entreprise..."
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.description}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          J'accepte les{' '}
          <Link href="/terms" className="font-medium text-purple-600 hover:text-purple-500">
            conditions d'utilisation
          </Link>
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
        >
          S'inscrire
        </button>
      </div>
    </form>
  );
} 