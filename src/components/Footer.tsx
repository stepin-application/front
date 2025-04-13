export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">StepIn</h3>
            <p className="text-gray-600">
              Votre plateforme de recrutement intelligente
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Entreprises</h3>
            <ul className="space-y-2">
              <li><a href="/campaign/company" className="text-gray-600 hover:text-purple-600">Créer une campagne</a></li>
              <li><a href="/pricing" className="text-gray-600 hover:text-purple-600">Tarifs</a></li>
              <li><a href="/features" className="text-gray-600 hover:text-purple-600">Fonctionnalités</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidats</h3>
            <ul className="space-y-2">
              <li><a href="/campaigns" className="text-gray-600 hover:text-purple-600">Trouver un emploi</a></li>
              <li><a href="/resources" className="text-gray-600 hover:text-purple-600">Ressources</a></li>
              <li><a href="/blog" className="text-gray-600 hover:text-purple-600">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-600 hover:text-purple-600">Centre d'aide</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-purple-600">Contact</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-purple-600">Confidentialité</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>© 2024 StepIn. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
} 