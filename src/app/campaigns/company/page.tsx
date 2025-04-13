export default function CreateCampaign() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-purple-100">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Bienvenue sur la page de création de campagne de recrutement pour les entreprises</h1>
      <div className="flex items-center justify-center">
        <a
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          href="/campaigns/company/new"
        >
          Aller à la création de campagne
        </a>
      </div>
    </div>
  );
}
