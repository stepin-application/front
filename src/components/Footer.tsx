export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                StepIn
              </span>
            </div>
            <p className="text-gray-600">
              Votre plateforme de recrutement intelligente qui connecte les talents aux meilleures opportunités.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 relative">
              Entreprises
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></span>
            </h3>
            <ul className="space-y-3">
              <li><a href="/campaign/company" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Créer une campagne</a></li>
              <li><a href="/pricing" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Tarifs</a></li>
              <li><a href="/features" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Fonctionnalités</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 relative">
              Candidats
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></span>
            </h3>
            <ul className="space-y-3">
              <li><a href="/campaigns" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Trouver un emploi</a></li>
              <li><a href="/resources" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Ressources</a></li>
              <li><a href="/blog" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 relative">
              Support
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"></span>
            </h3>
            <ul className="space-y-3">
              <li><a href="/help" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Centre d'aide</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Contact</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Confidentialité</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-gray-600">
          <p>© 2024 StepIn. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-purple-600 transition-colors duration-200">Twitter</a>
            <a href="#" className="hover:text-purple-600 transition-colors duration-200">LinkedIn</a>
            <a href="#" className="hover:text-purple-600 transition-colors duration-200">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}