import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [rawData, setRawData] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/login');
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const generateReport = async () => {
    if (!rawData.trim()) return;
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_AI_API_KEY;

    try {
      // URL CORRECTE ET À JOUR POUR GEMINI 1.5 FLASH
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Tu es un expert SEO. Résume ces données en 3 points vulgarisés pour un client artisan : ${rawData}` }]
          }]
        })
      });

      const data = await response.json();
      
      // Extraction sécurisée
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setGeneratedText(data.candidates[0].content.parts[0].text);
      } else {
        console.error("Réponse reçue:", data);
        setGeneratedText("Erreur : La structure de réponse de Google est inattendue. Vérifiez votre console (F12).");
      }
    } catch (error) {
      setGeneratedText("Erreur critique : Impossible de contacter Google Gemini.");
    }

    setIsLoading(false);
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
        <button onClick={handleLogout} className="text-left text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">
          Se déconnecter
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10 flex flex-col relative">
        <h2 className="text-2xl font-serif text-[#1A1F26] mb-8">Nouveau Reporting</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          <div className="flex flex-col gap-6">
            <textarea 
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              className="w-full flex-1 border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#C5A880] transition-colors resize-none rounded shadow-sm"
              placeholder="Ex: Le CPC a augmenté de 15% (1.42€)..."
            ></textarea>
            
            <button 
              onClick={generateReport}
              disabled={isLoading || !rawData.trim()}
              className="w-full bg-[#1A1F26] text-[#FDFBF7] py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] transition-colors rounded shadow-md disabled:opacity-50"
            >
              {isLoading ? "Génération en cours..." : "Générer la synthèse magique ✨"}
            </button>
          </div>

          <div className="bg-slate-900 rounded shadow-lg p-8 text-white">
            {generatedText ? <p>{generatedText}</p> : <p className="text-gray-500 italic">En attente des données...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
