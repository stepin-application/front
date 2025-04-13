export default function NewCampaignPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <h1 className="text-4xl font-bold text-purple-800 mb-6">Créer une Campagne de Recrutement</h1>
      <p className="text-lg text-gray-700 mb-4">Remplissez le formulaire ci-dessous pour lancer votre campagne de recrutement.</p>
      
      <form className="w-full max-w-lg bg-purple-50 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="campaignName">
            Nom de la Campagne
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="campaignName"
            type="text"
            placeholder="Entrez le nom de votre campagne"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobPosition">
            Poste à Pourvoir
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="jobPosition"
            type="text"
            placeholder="Entrez le poste à pourvoir"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description de la Campagne
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Décrivez votre campagne ici"
            rows={4}
          ></textarea>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Créer la Campagne
          </button>
        </div>
      </form>
    </div>
  );
}
