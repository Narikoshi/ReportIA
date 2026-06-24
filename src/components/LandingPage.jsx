import React from 'react';

const LandingPage = ({ onTestClick }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
      
      {/* Header / Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="text-2xl font-extrabold text-indigo-900 tracking-tight">ReportAI</div>
        <button 
          onClick={onTestClick}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
        >
          Espace Agence
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
          Transformez vos données brutes en e-mails clients <span className="text-indigo-600">clairs et rassurants.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
          Fini les incompréhensions du lundi matin. Collez vos exports SEO/Ads, notre outil structure l'information pour que vos clients comprennent enfin la valeur de votre travail.
        </p>
        <button 
          onClick={onTestClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-indigo-500/30"
        >
          Démarrer gratuitement
        </button>
      </main>

      {/* SECTION : Avant/Après (Version Pro) */}
      <section className="py-20 px-8 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 text-center mb-4">De la technique au langage business</h2>
        <p className="text-slate-500 text-center mb-16 max-w-xl mx-auto">Comparez un rapport d'expert brut avec une synthèse orientée résultat, conçue pour être lue et comprise par vos clients.</p>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* BLOC AVANT : L'E-MAIL MOCHE (Style Outlook technique) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                {/* Top bar de l'application mail */}
                <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                    <span className="text-xs font-medium text-slate-500 ml-4">Rapport_Mensuel_SEA.eml</span>
                </div>
                {/* Contenu du mail */}
                <div className="p-6 text-sm">
                    <div className="border-b border-slate-100 pb-4 mb-4 text-slate-500 space-y-1">
                        <p><span className="font-semibold text-slate-700">De :</span> account-manager@votre-agence.com</p>
                        <p><span className="font-semibold text-slate-700">À :</span> contact@client-artisan.fr</p>
                        <p><span className="font-semibold text-slate-700">Objet :</span> KPI de performance Campagnes Search M-1</p>
                    </div>
                    <div className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">
                        <p className="font-bold text-slate-700 mb-2">Extraction des données :</p>
                        "Bonjour, suite aux optimisations, les impressions grimpent de 12%. Le <span className="bg-slate-200 text-slate-800 font-mono px-1 rounded">CPC moyen</span> s'établit à 1,42€ pour un <span className="bg-slate-200 text-slate-800 font-mono px-1 rounded">CTR de 3,5%</span>. Le <span className="bg-slate-200 text-slate-800 font-mono px-1 rounded">ROAS global</span> est à 2,8, impacté par la baisse des conversions sur la campagne Marque à cause de la hausse du <span className="bg-slate-200 text-slate-800 font-mono px-1 rounded">taux de rebond (72%)</span>..."
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-rose-600 font-semibold bg-rose-50 px-3 py-2 rounded-md">
                        <span>Impact : Le client est confus et demande un point téléphonique urgent.</span>
                    </div>
                </div>
            </div>

            {/* BLOC APRÈS : LE RAPPORT CLAIR (Style Dashboard Épuré) */}
            <div className="bg-indigo-950 rounded-xl p-1 shadow-2xl relative transform lg:translate-x-4 lg:scale-105 transition duration-300">
                {/* Badge Format Approuvé */}
                <div className="absolute -top-4 -right-2 bg-indigo-500 text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                    Prêt à envoyer ✓
                </div>
                
                <div className="bg-indigo-950 rounded-[10px] p-8 text-white">
                    {/* En-tête pro */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xl">📊</div>
                            <div>
                                <h4 className="font-bold text-white text-base">Point Hebdomadaire</h4>
                                <p className="text-xs text-indigo-300">Synthèse simplifiée des performances</p>
                            </div>
                        </div>
                    </div>

                    {/* Les KPI visuels */}
                    <div className="space-y-4 mb-6">
                        {/* L'essentiel */}
                        <div className="bg-indigo-900/50 border border-indigo-800/50 p-4 rounded-lg flex items-start gap-4">
                            <span className="text-xl mt-0.5">💶</span>
                            <div>
                                <h5 className="font-semibold text-emerald-400 text-sm mb-0.5">Votre Rentabilité</h5>
                                <p className="text-indigo-100 text-sm">Pour <span className="text-white font-semibold">100€ investis</span>, vos campagnes ont généré <span className="text-white font-semibold">280€ net</span> de ventes directes. Le budget est parfaitement maîtrisé.</p>
                            </div>
                        </div>

                        {/* Ce qui a changé */}
                        <div className="bg-indigo-900/50 border border-indigo-800/50 p-4 rounded-lg flex items-start gap-4">
                            <span className="text-xl mt-0.5">📈</span>
                            <div>
                                <h5 className="font-semibold text-sky-400 text-sm mb-0.5">Votre Visibilité</h5>
                                <p className="text-indigo-100 text-sm">Vos publicités captent plus l'attention (+12% de clics). Les visiteurs s'intéressent concrètement à vos services.</p>
                            </div>
                        </div>

                        {/* Notre action */}
                        <div className="bg-indigo-900/50 border border-indigo-800/50 p-4 rounded-lg flex items-start gap-4">
                            <span className="text-xl mt-0.5">🎯</span>
                            <div>
                                <h5 className="font-semibold text-amber-400 text-sm mb-0.5">Notre action en cours</h5>
                                <p className="text-indigo-100 text-sm">Nous ajustons le texte de votre page d'accueil pour que ces nouveaux visiteurs vous contactent encore plus rapidement.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer rassurant */}
                    <div className="pt-4 border-t border-indigo-800/80 flex items-center justify-between text-xs text-indigo-300 font-medium">
                        <span>Objectif atteint : Valorisation de votre travail</span>
                        <span>0% de Jargon technique</span>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-slate-900 py-8 text-center text-slate-400 text-sm mt-12">
        <p>© {new Date().getFullYear()} ReportAI. Propulsez votre relation client.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
export default LandingPage;
