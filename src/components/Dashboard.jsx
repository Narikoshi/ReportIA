import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [rawData, setRawData] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // 1. GESTION ROBUSTE DE LA SESSION
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          // Tentative de secours automatique
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError || !refreshData?.session) {
            return navigate('/login');
          }
        }
      } catch (err) {
        console.warn("Clock Skew détecté. Tentative de rafraîchissement forcé...");
        try {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError || !refreshData?.session) {
            navigate('/login');
          }
        } catch (retryErr) {
          navigate('/login');
        }
      }
    };
    
    checkUser();

    // Écouteur en arrière-plan pour intercepter les expirations de token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // 2. APPEL API PROTÉGÉ
  const generateReport = async () => { 
    if (!rawData.trim()) return; 
    setIsLoading(true); 
    setGeneratedText('');

    try {
      // On s'assure d'avoir la session la plus fraîche possible
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // SÉCURITÉ : Bloquer immédiatement si l'horloge ou la session est en panne
      if (!token) {
        throw new Error("Votre session d'authentification est invalide. Veuillez recharger la page.");
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Jeton garanti valide
        },
        body: JSON.stringify({ rawData }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
        }
        throw new Error(`Erreur serveur (${response.status}).`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // CORRECTION de la syntaxe de l'arbre Gemini (?.[0]?. réintégré)
      if (data && data.text) {
        setGeneratedText(data.text);
      } else if (data && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setGeneratedText(data.candidates[0].content.parts[0].text);
      } else if (data && data.output) {
        setGeneratedText(data.output);
      } else {
        setGeneratedText(typeof data === 'string' ? data : JSON.stringify(data));
      }

    } catch (error) {
      console.error("Erreur API:", error);
      setGeneratedText(error.message || "Erreur : Impossible de contacter l'IA. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-[#1A1F26]">
      {/* SIDEBAR */}
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
          <div className="flex flex-col gap-6">
            <textarea 
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              className="w-full flex-1 border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#C5A880] transition-colors resize-none rounded shadow-sm"
              placeholder="Ex: Le CPC a augmenté de 15%..."
            ></textarea>
            
            {/* OPTIONS PREMIUM */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Ton du message</label>
              <select className="w-full border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:border-[#C5A880] rounded">
                <option>Rassurant</option>
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

          <div className="bg-slate-900 rounded shadow-lg p-8 text-white whitespace-pre-wrap">
            {generatedText ? <p className="text-sm leading-relaxed">{generatedText}</p> : <p className="text-gray-500 italic">En attente...</p>}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isPremiumModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded max-w-sm w-full mx-4 text-center">
            <h3 className="text-xl font-serif mb-4">Passer au Premium 🚀</h3>
            <p className="text-sm text-gray-600 mb-8">La marque blanche est réservée au plan Agence (99€/mois).</p>
            <button onClick={() => setIsPremiumModalOpen(false)} className="w-full bg-[#1A1F26] text-white py-3 text-xs uppercase rounded">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
