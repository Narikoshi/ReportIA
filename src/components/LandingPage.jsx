import React from 'react';

const LandingPage = ({ onTestClick }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      
      {/* Header / Navigation */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-900 tracking-wide uppercase">
            ReportAI
          </div>
          <button 
            onClick={onTestClick}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
          >
            Accès Agence
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl">
          Standardisez vos reportings clients avec des synthèses claires et actionnables.
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl leading-relaxed">
          Centralisez vos données brutes SEO et SEA. Notre outil génère instantanément des rapports structurés, prêts à être envoyés, pour valoriser votre expertise auprès de vos clients.
        </p>
        <button 
          onClick={onTestClick}
          className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-3 rounded-md font-semibold transition-colors shadow-sm"
        >
          Démarrer l'essai gratuit
        </button>
      </main>

      {/* SECTION : Avant/Après (Version Dashboard Pro) */}
      <section className="py-16 px-6 w-full max-w-6xl mx-auto border-t border-gray-200">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">De la donnée brute à l'information métier</h2>
          <p className="text-gray-500 text-sm md:text-base">Gagnez du temps sur la rédaction tout en améliorant la satisfaction client.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            
            {/* BLOC AVANT : L'E-MAIL BRUT */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm flex flex-col">
                <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Source : Données techniques</span>
                </div>
                
                <div className="p-6 text-sm flex-grow">
                    <div className="border-b border-gray-100 pb-4 mb-4 text-gray-600 space-y-2">
                        <p><span className="font-semibold text-gray-800 w-16 inline-block">De :</span> account-manager@votre-agence.com</p>
                        <p><span className="font-semibold text-gray-800 w-16 inline-block">À :</span> contact@client-artisan.fr</p>
                        <p><span className="font-semibold text-gray-800 w-16 inline-block">Objet :</span> Reporting Mensuel - Campagnes Search</p>
                    </div>
                    <div className="text-gray-600 leading-relaxed font-mono text-xs bg-gray-50 p-4 rounded border border-gray-200">
                        "Bonjour, suite aux optimisations, les impressions grimpent de 12%. Le CPC moyen s'établit à 1,42€ pour un CTR de 3,5%. Le ROAS global est à 2,8, impacté par la baisse des conversions sur la campagne Marque à cause de la hausse du taux de rebond (72%)..."
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs text-red-600 font-medium bg-red-50 px-3 py-2 border border-red-100 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Niveau de lecture : Complexe / Risque d'incompréhension
                    </div>
                </div>
            </div>

            {/* BLOC APRÈS : LE RAPPORT STRUCTURÉ */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm flex flex-col relative">
                <div className="absolute -top-3 -right-3 bg-green-100 text-green-800 border border-green-200 font-bold text-[10px] px-3 py-1 rounded-sm uppercase tracking-widest shadow-sm">
                    Prêt à envoyer
                </div>

                <div className="bg-blue-50/50 border-b border-gray-200 px-5 py-3">
                    <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Résultat : Synthèse Client</span>
                </div>
                
                <div className="p-6">
                    <h4 className="font-bold text-gray-900 text-lg mb-6 border-b border-gray-100 pb-2">Résumé des performances</h4>

                    <div className="space-y-5">
                        {/* Section 1 */}
                        <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1 uppercase tracking-wide">1. Investissement & Rentabilité</h5>
                            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-sm border border-gray-100">
                                Le budget est parfaitement maîtrisé. Pour chaque <span className="font-semibold text-gray-900">100€ investis</span> ce mois-ci, vos campagnes ont généré <span className="font-semibold text-gray-900">280€ de ventes directes</span>. 
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1 uppercase tracking-wide">2. Trafic & Visibilité</h5>
                            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-sm border border-gray-100">
                                Vos publicités suscitent plus d'intérêt (+12% de visites). L'audience qualifiée continue de croître sur votre secteur.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1 uppercase tracking-wide">3. Plan d'action</h5>
                            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-sm border border-gray-100">
                                Nous optimisons actuellement le texte de votre page d'accueil afin d'améliorer la conversion de ces nouveaux visiteurs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-xs">
        <p>© {new Date().getFullYear()} ReportAI. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
