import React from 'react';

const LandingPage = ({ onTestClick }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* Header / Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-indigo-900 tracking-tight">ReportAI ✨</div>
        <button 
          onClick={onTestClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md"
        >
          Connexion
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center">
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

      {/* Section Avant / Après */}
      <section className="w-full bg-white py-24 px-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-14 text-slate-800">Fini le jargon technique. Place à la clarté.</h2>
          <div className="grid md:grid-cols-2 gap-10 text-left">
            
            {/* Carte Avant */}
            <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="absolute -top-4 left-8 bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-full">Avant (Stressant)</div>
              <p className="font-mono text-sm text-slate-700 mt-4">
                "Le CTR a baissé de 2.1% cette semaine et le CPC de la campagne Search est à 1.42€. Perte de jus de lien identifiée sur les backlinks..."
              </p>
            </div>

            {/* Carte Après */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-indigo-500 shadow-xl relative">
              <div className="absolute -top-4 left-8 bg-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full">Après (Rassurant ✨)</div>
              <p className="text-slate-200 mt-4 leading-relaxed">
                "Excellente semaine ! 📈 Votre budget est optimisé : chaque visiteur vous coûte moins cher qu'avant, et la visibilité de votre site reste très solide."
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-slate-900 py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} ReportAI. Conçu avec passion à Bruxelles.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
