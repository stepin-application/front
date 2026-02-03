"use client"

import { useState } from 'react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, MapPin, Globe, Phone, Users, Info } from 'lucide-react';
import Link from 'next/link';

export default function SchoolForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    password: '',
    type: '',
    address: '',
    website: '',
    phone: '',
    studentCount: '',
    description: '',
    programs: ''
  });

  const tooltips = {
    schoolName: "Entrez le nom officiel complet de votre établissement",
    email: "Utilisez une adresse email professionnelle de votre établissement",
    password: "Minimum 8 caractères, incluant lettres, chiffres et caractères spéciaux",
    type: "Sélectionnez la catégorie qui correspond le mieux à votre établissement",
    address: "Adresse physique complète de votre établissement",
    website: "URL complète de votre site web (commençant par http:// ou https://)",
    phone: "Numéro de téléphone au format international ou national",
    studentCount: "Nombre total d'étudiants actuellement inscrits",
    programs: "Liste des formations, diplômes et certifications proposés",
    description: "Présentation détaillée de votre établissement, son histoire et ses valeurs"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la logique d'inscription
    console.log('Inscription école:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="schoolName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Nom de l'école
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {tooltips.schoolName}
              </div>
            </div>
          </label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GraduationCap className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="schoolName"
            name="schoolName"
            type="text"
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="Nom de votre école"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
          />
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
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="contact@ecole.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
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
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="type" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Type d'établissement
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {tooltips.type}
                </div>
              </div>
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="type"
              name="type"
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="">Sélectionnez</option>
              <option value="universite">Université</option>
              <option value="ecole_ingenieur">École d'ingénieur</option>
              <option value="ecole_commerce">École de commerce</option>
              <option value="ecole_specialisee">École spécialisée</option>
              <option value="lycee">Lycée</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="studentCount" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Nombre d'étudiants
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {tooltips.studentCount}
                </div>
              </div>
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="studentCount"
              name="studentCount"
              type="number"
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Nombre d'étudiants"
              value={formData.studentCount}
              onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Adresse
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {tooltips.address}
              </div>
            </div>
          </label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="address"
            name="address"
            type="text"
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="Adresse complète"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
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
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="website"
              name="website"
              type="url"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="https://www.ecole.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
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
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="01 23 45 67 89"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="programs" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Programmes proposés
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute left-0 w-64 px-2 py-1 mt-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {tooltips.programs}
              </div>
            </div>
          </label>
        </div>
        <textarea
          id="programs"
          name="programs"
          rows={3}
          className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="Listez vos programmes d'études..."
          value={formData.programs}
          onChange={(e) => setFormData({ ...formData, programs: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Description de l'école
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
          className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="Présentez votre école..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
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