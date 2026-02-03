"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bug, X, Info, Github, Globe, Server, Database, Zap } from "lucide-react";

type NavLink = {
  title: string;
  href: string;
  category: string;
};

type PackageInfo = {
  version: string;
  nextVersion: string;
  reactVersion: string;
  buildDate: string;
};

export default function DevNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [packageInfo, setPackageInfo] = useState<PackageInfo>({
    version: "...",
    nextVersion: "...",
    reactVersion: "...",
    buildDate: new Date().toISOString()
  });

  // Récupérer dynamiquement les informations des versions
  useEffect(() => {
    // Fonction pour récupérer les versions des packages
    const fetchPackageVersions = async () => {
      try {
        // Récupérer les variables d'environnement injectées via next.config.js
        // ou les variables globales définies via webpack.DefinePlugin
        
        const appVersion = 
          process.env.NEXT_PUBLIC_APP_VERSION || 
          process.env.APP_VERSION || 
          (window as any).__APP_VERSION__ || 
          "1.0.0";
          
        const nextVersion = 
          process.env.NEXT_PUBLIC_NEXT_VERSION || 
          process.env.NEXT_VERSION || 
          (window as any).__NEXT_VERSION__ || 
          "14.0.0";
          
        const reactVersion = 
          process.env.NEXT_PUBLIC_REACT_VERSION || 
          process.env.REACT_VERSION || 
          (window as any).__REACT_VERSION__ || 
          "18.2.0";
          
        const buildDate = 
          process.env.NEXT_PUBLIC_BUILD_DATE || 
          process.env.BUILD_DATE || 
          (window as any).__BUILD_DATE__ || 
          new Date().toISOString();

        setPackageInfo({
          version: appVersion,
          nextVersion: nextVersion,
          reactVersion: reactVersion,
          buildDate: buildDate
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des versions:", error);
      }
    };

    fetchPackageVersions();
  }, []);

  const navLinks: NavLink[] = [
    // Pages principales
    { title: "Accueil", href: "/", category: "Général" },
    { title: "Campagnes", href: "/campaigns", category: "Général" },

    // Authentification
    { title: "Connexion", href: "/login", category: "Auth" },
    { title: "Connexion", href: "/login", category: "Auth" },
    { title: "Admin", href: "/admin", category: "Admin" },
    { title: "Admin Écoles", href: "/admin/schools", category: "Admin" },
    { title: "Admin Entreprises", href: "/admin/companies", category: "Admin" },
    { title: "Admin Utilisateurs", href: "/admin/users", category: "Admin" },
    { title: "Import Étudiants", href: "/admin/students/import", category: "Admin" },

    // Campagnes École
    { title: "Mes campagnes (École)", href: "/campaigns/school/me", category: "École" },
    { title: "Nouvelle campagne (École)", href: "/campaigns/school/new", category: "École" },
    { title: "Détail campagne (École)", href: "/campaigns/school/me/1", category: "École" },

    // Campagnes Entreprise
    { title: "Mes offres (Entreprise)", href: "/campaigns/company/me", category: "Entreprise" },
    { title: "Nouvelle offre (Entreprise)", href: "/campaigns/company/new", category: "Entreprise" },
    { title: "Détail offre (Entreprise)", href: "/campaigns/company/me/1", category: "Entreprise" }
  ];

  // Regrouper les liens par catégorie
  const groupedLinks = navLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, NavLink[]>);

  const categories = Object.keys(groupedLinks);

  // Fonction pour formater la date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return "Date inconnue";
    }
  };

  // Obtenir des informations sur l'environnement
  const envInfo = {
    nodeEnv: process.env.NODE_ENV || "development",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center transform hover:scale-110"
        title="Menu développeur"
      >
        {isOpen ? <X size={24} className="animate-spin-slow" /> : <Bug size={24} className="animate-bounce" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-100 p-6 w-96 max-h-[85vh] overflow-y-auto transition-all duration-300 animate-slideIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-purple-700 flex items-center gap-2">
              <Bug size={20} className="text-purple-500" />
              Navigation Dev
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Informations sur l'application */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="font-medium flex items-center gap-2">
                <Info size={16} className="text-purple-600" />
                <span className="text-purple-900">Version</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-100/80 text-purple-700 px-3 py-1 rounded-full font-medium">
                  v{packageInfo.version}
                </span>
                <span className="bg-emerald-100/80 text-emerald-700 px-3 py-1 rounded-full font-medium">
                  {envInfo.nodeEnv}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-gray-700">
              <div className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">
                <Globe size={14} className="text-blue-500" />
                <span>Next.js:</span>
                <span className="font-mono font-medium">{packageInfo.nextVersion}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">
                <Zap size={14} className="text-yellow-500" />
                <span>React:</span>
                <span className="font-mono font-medium">{packageInfo.reactVersion}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 p-2 rounded-lg col-span-2">
                <Database size={14} className="text-purple-500" />
                <span>Build:</span>
                <span className="font-mono font-medium">{formatDate(packageInfo.buildDate)}</span>
              </div>
            </div>
          </div>

          {/* Navigation par catégorie */}
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category} className="bg-white/50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-3">
                  {category}
                </h4>
                <ul className="space-y-1">
                  {groupedLinks[category].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50/50 rounded-lg px-3 py-2 transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Liens utiles et actions rapides */}
          <div className="mt-6 pt-4 border-t border-purple-100">
            <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-3">
              Liens utiles
            </h4>
            <div className="flex flex-wrap gap-2">
              <a 
                href="https://github.com/mouhounamine/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
              >
                <Github size={16} />
                GitHub
              </a>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <X size={16} />
                Clear LocalStorage
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4 italic">
              Ce menu est uniquement visible en mode développement
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 
