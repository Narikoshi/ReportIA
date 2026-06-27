import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Fonction pour mettre en gras le texte entouré de ** (Markdown généré par Gemini)
const formatText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={i} className="text-white font-bold">{part.slice(2, -2)}</span>;
    }
    return part;
  });
};

// Fonction pour parser intelligemment la réponse stricte de l'IA
const parseGeneratedText = (text) => {
  if (!text) return { isParsed: false };
  
  try {
    // Regex pour récupérer le contenu de chaque section
    const rentabiliteMatch = text.match(/💰.*?RENTABILITÉ[^\n]*\n([\s\S]*?)(?=👁️|$)/i);
    const traficMatch = text.match(/👁️.*?VISIBILITÉ[^\n]*\n([\s\S]*?)(?=🚀|$)/i);
    const actionMatch = text.match(/🚀.*?PLAN D'ACTION[^\n]*\n([\s\S]*?)$/i);

    const rentabilite = rentabiliteMatch ? rentabiliteMatch[1].trim() : '';
    const trafic = traficMatch ? traficMatch[1].trim() : '';
    const action = actionMatch ? actionMatch[1].trim() : '';

    const isParsed = !!(rentabilite && trafic && action);
    return { rentabilite, trafic, action, isParsed, raw: text };
  } catch (e) {
    return { isParsed: false, raw: text };
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [rawData, setRawData] = useState('');
  const [tone, setTone] = useState('Rassurant');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  useEffect(() => {
    // [VOTRE LOGIQUE SUPABASE EXISTANTE RESTÉE INTACTE]
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError || !refreshData?.session) return navigate('/login');
        }
      } catch (err) {
        navigate('/login');
      }
    };
    
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) navigate('/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const generateReport = async () => { 
    if (!rawData.trim()) return; 
    
    setIsLoading(true); 
    setGeneratedText(''); 
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawData, tone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la génération');
      
      setGeneratedText(data.text);
    } catch (error) {
      console.error("Erreur Fetch:", error);
      setGeneratedText(`Erreur : ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // On parse le résultat en temps réel
  const parsedData = parseGeneratedText(generatedText);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-[#1A1F26]">
      {/* SIDEBAR INTACTE */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-[#1A1F26] flex items-center justify-center text-[#FDFBF7] text-xs font-serif rounded">R</div>
            <h1 className="text-sm font-semibold tracking-widest uppercase">ReportAI</h1>
          </div>
          <nav className="space-y-4">
            <a href="#" className="block text-xs font-bold text-[#C5A880] uppercase tracking-widest">Nouveau Reporting</a>
            <a href="#" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-[#1A1F26] transition-colors">Historique</a>
          </nav>
        </div>
        <button onClick={handleLogout} className="text-left text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">Se déconnecter</button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10 flex flex-col">
        <h2 className="text-2xl font-serif text-[#1A1F26] mb-8">Nouveau Reporting</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          {/* COLONNE GAUCHE (INPUT) */}
          <div className="flex flex-col gap-6">
            <textarea 
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              className="w-full flex-1 border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#C5A880] transition-colors resize-none rounded shadow-sm"
              placeholder="Collez vos données brutes SEO/SEA ici..."
            ></textarea>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Ton du message</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:border-[#C5A880] rounded"
              >
                <option value="Rassurant">Rassurant</option>
                <option disabled>Direct 🔒</option>
                <option disabled>Enthousiaste 🔒</option>
              </select>
            </div>

            <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded">
              <span className="text-xs font-semibold text-gray-700">Activer la Marque Blanche 🔒</span>
              <button onClick={() => setIsPremiumModalOpen(true)} className="w-10 h-5 bg-gray-200 rounded-full"></button>
            </div>

            <button onClick={generateReport} disabled={isLoading} className="w-full bg-[#1A1F26] text-[#FDFBF7] py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] transition-colors rounded">
              {isLoading ? "Génération en cours..." : "Générer la synthèse magique ✨"}
            </button>
          </div>

          {/* COLONNE DROITE (RÉSULTAT FAÇON DÉMO LANDING PAGE) */}
          <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl relative w-full h-full transform transition-all duration-300">
            {generatedText && (
                <div className="absolute -top-4 -right-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-black text-[10px] px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider animate-bounce z-10">
                    Généré par IA ✨
                </div>
            )}
            
            <div className="bg-slate-900 rounded-[22px] p-8 text-white h-full flex flex-col">
              
              {/* En-tête du Dashboard */}
              <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-900 text-lg shadow-md shadow-emerald-500/20">🚀</div>
                      <div>
                          <h4 className="font-bold text-white text-base">Point Météo</h4>
                          <p className="text-xs text-slate-400">Le résumé en 15 secondes</p>
                      </div>
                  </div>
                  {generatedText && <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">Brouillon</span>}
              </div>

              {!generatedText ? (
                // État vide
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                    <span className="text-4xl mb-4">🪄</span>
                    <p className="text-slate-400 text-sm">En attente des données...</p>
                </div>
              ) : parsedData.isParsed ? (
                // État généré et formaté !
                <>
                  <div className="space-y-4 mb-6 flex-1 animate-fade-in-up">
                      
                      <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-800 transition">
                          <span className="text-2xl mt-0.5">💰</span>
                          <div>
                              <h5 className="font-semibold text-emerald-400 text-sm mb-0.5">Investissement & Rentabilité</h5>
                              <p className="text-slate-300 text-sm leading-relaxed">{formatText(parsedData.rentabilite)}</p>
                          </div>
                      </div>

                      <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-800 transition">
                          <span className="text-2xl mt-0.5">👁️</span>
                          <div>
                              <h5 className="font-semibold text-sky-400 text-sm mb-0.5">Trafic & Visibilité</h5>
                              <p className="text-slate-300 text-sm leading-relaxed">{formatText(parsedData.trafic)}</p>
                          </div>
                      </div>

                      <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-800 transition">
                          <span className="text-2xl mt-0.5">🛠️</span>
                          <div>
                              <h5 className="font-semibold text-amber-400 text-sm mb-0.5">Plan d'Action</h5>
                              <p className="text-slate-300 text-sm leading-relaxed">{formatText(parsedData.action)}</p>
                          </div>
                      </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-medium mt-auto">
                      <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Statut : Zéro Jargon garanti
                      </span>
                      <button className="text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Copier le message</button>
                  </div>
                </>
              ) : (
                // Fallback de sécurité si l'IA modifie trop la structure
                <div className="flex-1 overflow-auto text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {generatedText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isPremiumModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded max-w-sm w-full mx-4 text-center">
            <h3 className="text-xl font-serif mb-4">Passer au Premium 🚀</h3>
            <p className="text-sm text-gray-600 mb-8">La marque blanche est réservée au plan Agence.</p>
            <button onClick={() => setIsPremiumModalOpen(false)} className="w-full bg-[#1A1F26] text-white py-3 text-xs uppercase rounded">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
