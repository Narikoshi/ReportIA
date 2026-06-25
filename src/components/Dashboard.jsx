import React, { useState } from 'react';

export default function Dashboard() {
  const [result, setResult] = useState(null);

  const handleGenerate = () => {
    // Simulation de l'IA
    setResult("Bonjour ! Votre campagne SEA a généré 280€ de revenus pour 100€ investis. Tout est au vert.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <aside className="w-64 bg-[#1A1F26] text-white p-8 hidden md:block">
        <h2 className="text-sm font-semibold tracking-widest uppercase mb-12">ReportAI</h2>
        <nav className="space-y-6 text-xs uppercase tracking-widest text-gray-400">
          <p className="text-white font-medium">Tableau de bord</p>
          <p>Paramètres</p>
        </nav>
      </aside>
      
      <main className="flex-1 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-[#1A1F26] mb-8 uppercase tracking-widest">Nouveau Reporting</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Colonne Gauche : Input */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Données brutes SEO/Ads</label>
              <textarea className="w-full h-64 p-4 border border-gray-300 bg-white text-sm focus:border-[#C5A880] outline-none" placeholder="CPC, CTR, Backlinks..."></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ton du message</label>
              <select className="w-full p-3 border border-gray-300 bg-white text-sm">
                <option>Rassurant</option>
                <option>Direct</option>
              </select>
            </div>
            <button onClick={handleGenerate} className="w-full bg-[#1A1F26] text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#C5A880] transition-colors">
              Générer la synthèse magique ✨
            </button>
          </div>

          {/* Colonne Droite : Résultat */}
          <div className="bg-white border border-gray-200 p-8 min-h-[400px]">
             <h3 className="text-xs font-bold text-gray-400 uppercase mb-6">Synthèse générée</h3>
             {result ? (
               <div className="text-gray-800 leading-relaxed font-serif text-lg">{result}</div>
             ) : (
               <div className="text-gray-400 italic text-sm">Votre synthèse apparaîtra ici...</div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
