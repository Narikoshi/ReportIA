import React, { useState } from 'react';

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowResult(false);
    
    // Simulation du temps de calcul de l'IA (Magicien d'Oz)
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-6">
      
      {/* Navigation simplifiée */}
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <div className="text-xl font-extrabold text-indigo-900">ReportAI ✨</div>
        <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          Espace Agence
        </div>
      </header>

      <main className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold mb-8 text-slate-800">Générer un rapport client</h2>

        <div className="space-y-6">
          {/* Input Data Brutes */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Collez vos données brutes SEO/Ads ici
            </label>
            <textarea 
              className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-mono text-sm resize-none"
              placeholder="Ex: Clics: 450, Impressions: 12000, CTR: 3.75%, CPC: 0.85€..."
            ></textarea>
          </div>

          {/* Select Tone */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Ton du message
            </label>
            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium cursor-pointer appearance-none">
              <option value="rassurant">Rassurant & Pédagogue</option>
              <option value="enthousiaste">Enthousiaste & Dynamique</option>
              <option value="direct">Direct & Orienté Résultats</option>
            </select>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-lg py-4 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2"
          >
            {isGenerating ? 'Analyse en cours...' : 'Générer la synthèse magique ✨'}
          </button>
        </div>

        {/* Fake Result Zone */}
        {showResult && (
          <div className="mt-10 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl animate-fade-in-up">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-3">E-mail généré pour le client</h3>
            <div className="text-slate-800 leading-relaxed text-sm bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
              <p className="mb-3">Bonjour !</p>
              <p className="mb-3">Voici un point rapide sur vos résultats de la semaine. Tout est au vert ! 🟢</p>
              <ul className="list-disc pl-5 mb-3 space-y-1">
                <li><strong>Plus de visibilité :</strong> Vos annonces ont été vues par beaucoup plus de monde.</li>
                <li><strong>Budget maîtrisé :</strong> Chaque visite sur votre site nous a coûté moins cher que prévu.</li>
              </ul>
              <p>On continue sur cette excellente lancée. Passez un très bon week-end !</p>
            </div>
            <button className="mt-4 text-indigo-600 text-sm font-bold hover:underline">
              Copier le texte
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
