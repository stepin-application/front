"use client";

import { useState } from "react";
import { toast } from "sonner";

interface StudentProfile {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Education
  school: string;
  degree: string;
  graduationYear: string;
  gpa?: string;
  
  // Skills & Experience
  skills: string[];
  programmingLanguages: string[];
  experience: string;
  previousInternships: string;
  
  // Preferences
  preferredJobTypes: string[];
  preferredLocations: string[];
  availabilityStart: string;
  
  // Additional Info for AI
  portfolio?: string;
  github?: string;
  linkedin?: string;
  additionalInfo?: string;
}

interface StudentProfileFormProps {
  initialData?: Partial<StudentProfile>;
  onSubmit: (data: StudentProfile) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

const SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "React", "Vue.js", "Angular",
  "Node.js", "Express", "Spring Boot", "Django", "Flask", "SQL", "MongoDB", "PostgreSQL",
  "Git", "Docker", "AWS", "Azure", "Machine Learning", "Data Analysis", "UI/UX Design",
  "Project Management", "Agile", "Scrum", "Marketing", "Sales", "Communication"
];

const JOB_TYPE_OPTIONS = [
  "Stage", "CDI", "CDD", "Alternance", "Freelance", "Temps partiel"
];

export default function StudentProfileForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isEditing = false 
}: StudentProfileFormProps) {
  const [formData, setFormData] = useState<StudentProfile>({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    school: initialData.school || "",
    degree: initialData.degree || "",
    graduationYear: initialData.graduationYear || "",
    gpa: initialData.gpa || "",
    skills: initialData.skills || [],
    programmingLanguages: initialData.programmingLanguages || [],
    experience: initialData.experience || "",
    previousInternships: initialData.previousInternships || "",
    preferredJobTypes: initialData.preferredJobTypes || [],
    preferredLocations: initialData.preferredLocations || [],
    availabilityStart: initialData.availabilityStart || "",
    portfolio: initialData.portfolio || "",
    github: initialData.github || "",
    linkedin: initialData.linkedin || "",
    additionalInfo: initialData.additionalInfo || ""
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleSkillToggle = (skill: string, type: 'skills' | 'programmingLanguages') => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(skill)
        ? prev[type].filter(s => s !== skill)
        : [...prev[type], skill]
    }));
  };

  const handleJobTypeToggle = (jobType: string) => {
    setFormData(prev => ({
      ...prev,
      preferredJobTypes: prev.preferredJobTypes.includes(jobType)
        ? prev.preferredJobTypes.filter(t => t !== jobType)
        : [...prev.preferredJobTypes, jobType]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      toast.success(isEditing ? "Profil mis à jour avec succès !" : "Profil créé avec succès !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jean"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="jean.dupont@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Formation</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                École/Université *
              </label>
              <input
                type="text"
                required
                value={formData.school}
                onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Université de Paris"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diplôme/Formation *
              </label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Master en Informatique"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année de diplôme *
                </label>
                <input
                  type="number"
                  required
                  min="2020"
                  max="2030"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moyenne (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="15.5/20"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Compétences et expérience</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétences techniques
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleSkillToggle(skill, 'skills')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langages de programmation
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "PHP", "Go", "Rust", "Swift"].map((lang) => (
                  <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.programmingLanguages.includes(lang)}
                      onChange={() => handleSkillToggle(lang, 'programmingLanguages')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expérience professionnelle
              </label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez vos expériences professionnelles, projets, stages..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stages précédents
              </label>
              <textarea
                value={formData.previousInternships}
                onChange={(e) => setFormData(prev => ({ ...prev, previousInternships: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Listez vos stages précédents avec entreprises et missions..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Préférences et liens</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Types de postes recherchés
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {JOB_TYPE_OPTIONS.map((jobType) => (
                  <label key={jobType} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferredJobTypes.includes(jobType)}
                      onChange={() => handleJobTypeToggle(jobType)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{jobType}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Villes préférées (séparées par des virgules)
              </label>
              <input
                type="text"
                value={formData.preferredLocations.join(", ")}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  preferredLocations: e.target.value.split(",").map(s => s.trim()).filter(s => s) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paris, Lyon, Marseille"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilité à partir du
              </label>
              <input
                type="date"
                value={formData.availabilityStart}
                onChange={(e) => setFormData(prev => ({ ...prev, availabilityStart: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio (URL)
                </label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://monportfolio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub (URL)
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/monprofil"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn (URL)
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/monprofil"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informations supplémentaires
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ajoutez toute information qui pourrait être utile pour le matching (projets personnels, certifications, langues parlées, etc.)"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Étape {currentStep} sur {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% complété
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={currentStep === 1 ? onCancel : prevStep}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {currentStep === 1 ? "Annuler" : "Précédent"}
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextStep();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Sauvegarde..." : (isEditing ? "Mettre à jour" : "Créer le profil")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}