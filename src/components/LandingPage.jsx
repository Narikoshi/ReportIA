import React from 'react';

const LandingPage = ({ onTestClick }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
      
      {/* Header / Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="text-2xl font-extrabold text-indigo-900 tracking-tight">ReportAI ✨</div>
        <button 
          onClick={onTestClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md"
        >
          Connexion
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
          Traduisez vos rapports SEO/Ads en e-mails que vos clients <span className="text-indigo-600">comprennent vraiment.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
          Divisez par 3 les e-mails de panique de vos clients le lundi matin. Collez vos données brutes, notre outil génère une synthèse claire et rassurante en 2 clics.
        </p>
        <button 
          onClick={onTestClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1"
        >
          Tester gratuitement
        </button>
      </main>

      {/* NOUVELLE SECTION : Avant/Après injectée ici */}
      <section className="py-20 px-8 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 text-center mb-4">L'IA traduit la technique en langage business</h2>
        <p className="text-slate-500 text-center mb-16 max-w-xl mx-auto">Découvrez comment l'intelligence artificielle transforme un rapport indigeste en une synthèse qui rassure le client en 10 secondes.</p>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* BLOC AVANT : L'E-MAIL MOCHE (Style Outlook technique) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden transform -rotate-1 hover:rotate-0 transition duration-300">
                {/* Top bar de l'application mail */}
                <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-medium text-slate-400 ml-4">Rapport Mensuel SEA - Performance.eml</span>
                </div>
                {/* Contenu du mail */}
                <div className="p-6 text-sm">
                    <div className="border-b border-slate-100 pb-4 mb-4 text-slate-500 space-y-1">
                        <p><span className="font-semibold text-slate-700">De :</span> account-manager@votre-agence.com</p>
                        <p><span className="font-semibold text-slate-700">À :</span> contact@garage-artisan.fr</p>
                        <p><span className="font-semibold text-slate-700">Objet :</span> KPI de performance Campagnes Search M-1</p>
                    </div>
                    <div className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">
                        <p className="font-bold text-rose-600 mb-2">⚠️ Données techniques brutes :</p>
                        "Bonjour, suite aux optimisations sur la Search Console, les impressions grimpent de 12%. Le <span className="bg-rose-100 text-rose-800 font-mono px-1 rounded">CPC moyen</span> s'établit à 1,42€ pour un <span className="bg-rose-100 text-rose-800 font-mono px-1 rounded">CTR de 3,5%</span>. Le <span className="bg-rose-100 text-rose-800 font-mono px-1 rounded">ROAS global</span> est à 2,8, impacté par la baisse des conversions sur la campagne Marque à cause de la hausse du <span className="bg-rose-100 text-rose-800 font-mono px-1 rounded">taux de rebond (72%)</span>..."
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-rose-500 font-semibold bg-rose-50 px-3 py-2 rounded-md">
                        <span>❌ Résultat : Client perdu, incompréhension, 3 appels de panique.</span>
                    </div>
                </div>
            </div>

            {/* BLOC APRÈS : L'EFFET IA WOW (Style Dashboard Épuré) */}
            <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl relative transform lg:translate-x-4 lg:scale-105 transition duration-300">
                {/* Petit badge IA stylé animé */}
                <div className="absolute -top-4 -right-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-black text-xs px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider animate-bounce">
                    Généré par IA ✨
                </div>
                
                <div className="bg-slate-900 rounded-[22px] p-8 text-white">
                    {/* En-tête pro */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-900 text-lg shadow-md shadow-emerald-500/20">🚀</div>
                            <div>
                                <h4 className="font-bold text-white text-base">Point Météo Google</h4>
                                <p className="text-xs text-slate-400">Le résumé hebdo en 15 secondes</p>
                            </div>
                        </div>
                        <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">Semaine Active</span>
                    </div>

                    {/* Les KPI visuels */}
                    <div className="space-y-4 mb-6">
                        {/* L'essentiel */}
                        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-800 transition">
                            <span className="text-2xl mt-0.5">💰</span>
                            <div>
                                <h5 className="font-semibold text-emerald-400 text-sm mb-0.5">Votre Rentabilité</h5>
                                <p className="text-slate-300 text-sm">Pour <span className="text-white font-bold underline decoration-emerald-400">100€ investis</span>, vos campagnes ont généré <span className="text-white font-bold bg-slate-700 px-1.5 py-0.5 rounded">280€ net</span> de ventes directes. Le système est très sain.</p>
                            </div>
                        </div>

                        {/* Ce qui a changé */}
                        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-800 transition">
                            <span className="text-2xl mt-0.5">📈</span>
                            <div>
                                <h5 className="font-semibold text-sky-400 text-sm mb-0.5">Votre Visibilité</h5>
                                <p className="text-slate-300 text-sm">Vos publicités captent l'attention (+12%). Seul point à surveiller : les visiteurs quittent le site un peu trop vite une fois arrivés.</p>
                            </div>
                        </div>

                        {/* Notre action */}
                        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-800 transition">
                            <span className="text-2xl mt-0.5">🛠️</span>
                            <div>
                                <h5 className="font-semibold text-amber-400 text-sm mb-0.5">Notre Action de la Semaine</h5>
                                <p className="text-slate-300 text-sm">Nous modifions l'accroche de votre page d'accueil pour que les clients trouvent tout de suite ce qu'ils cherchent et achètent plus vite.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer rassurant */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-medium">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Statut : Client autonome et rassuré
                        </span>
                        <span className="text-slate-500">Zéro Jargon</span>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-slate-900 py-8 text-center text-slate-400 text-sm mt-12">
        <p>© {new Date().getFullYear()} ReportAI. Conçu avec passion.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
