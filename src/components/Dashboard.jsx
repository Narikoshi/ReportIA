import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // ÉTATS (State Management) [cite: 895]
  const [rawData, setRawData] = useState(''); // Le texte collé [cite: 895]
  const [generatedText, setGeneratedText] = useState(''); // Le résultat de l'IA [cite: 896]
  const [isLoading, setIsLoading] = useState(false); // L'état de chargement [cite: 896]
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false); // La modale [cite: 897]

  // SÉCURITÉ : Vérifier si l'utilisateur est bien connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/login');
    };
    checkUser();
  }, [navigate]);

  // DÉCONNEXION
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // LOGIQUE API (Le Moteur) [cite: 898]
const generateReport = async () => {
    if (!rawData.trim()) return;
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_AI_API_KEY;

    try {
      // Endpoint officiel pour Gemini Flash 1.5
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
      // On extrait la réponse correctement formatée par Gemini
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setGeneratedText(data.candidates[0].content.parts[0].text);
      } else {
        setGeneratedText("Erreur : Impossible de lire la réponse de l'IA.");
      }
    } catch (error) {
      setGeneratedText("Erreur de connexion à l'API Google.");
    }

    setIsLoading(false);
  };

    const apiKey = import.meta.env.VITE_AI_API_KEY; // Clé depuis l'environnement 

    // Fallback si la clé n'est pas encore configurée 
    if (!apiKey) {
      setTimeout(() => {
        setGeneratedText("Ceci est un texte de démonstration car la clé API n'est pas encore activée. \n\n• Le trafic a augmenté de 15%, une excellente nouvelle pour votre visibilité.\n• Les coûts publicitaires sont maîtrisés.\n• Votre site attire de nouveaux clients locaux !");
        setIsLoading(false);
      }, 2000);
      return;
    }

    // Vrai appel à l'API (Exemple OpenAI)
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              // Le Prompt Système Caché 
              role: "system",
              content: "Tu es un expert SEO. Prends les données techniques suivantes et résume-les en 3 points vulgarisés, sans jargon, de manière rassurante pour un client artisan."
            },
            { role: "user", content: rawData }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setGeneratedText(data.choices[0].message.content);
      } else {
        setGeneratedText("Erreur lors de la génération. Veuillez réessayer.");
      }
    } catch (error) {
      setGeneratedText("Erreur de connexion à l'IA. Vérifiez votre clé API.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-[#1A1F26]">
      
      {/* BARRE LATÉRALE */}
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

      {/* ZONE PRINCIPALE */}
      <div className="flex-1 p-10 flex flex-col relative">
        <h2 className="text-2xl font-serif text-[#1A1F26] mb-8">Nouveau Reporting</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          
          {/* COLONNE GAUCHE : LES INPUTS */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 flex flex-col">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Collez vos données brutes SEO/Ads ici</label>
              <textarea 
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="w-full flex-1 border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#C5A880] transition-colors resize-none rounded shadow-sm"
                placeholder="Ex: Le CPC a augmenté de 15% (1.42€), le CTR est en baisse à 2.1%..."
              ></textarea>
            </div>
            
            {/* TONS DU MESSAGE */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Ton du message</label>
              <select className="w-full border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors appearance-none rounded shadow-sm">
                <option>Rassurant</option>
                <option disabled>Direct 🔒</option>
                <option disabled>Enthousiaste 🔒</option>
              </select>
            </div>

            {/* TOGGLE MARQUE BLANCHE */}
            <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded shadow-sm">
              <span className="text-xs font-semibold text-gray-700">Activer la Marque Blanche (Retirer le logo)</span>
              <button 
                onClick={() => setIsPremiumModalOpen(true)}
                className="w-10 h-5 bg-gray-200 rounded-full relative transition-colors hover:bg-gray-300"
              >
                <span className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full"></span>
              </button>
            </div>

            {/* BOUTON D'ACTION */}
            <button 
              onClick={generateReport}
              disabled={isLoading || !rawData.trim()}
              className="w-full bg-[#1A1F26] text-[#FDFBF7] py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] transition-colors flex items-center justify-center gap-2 rounded shadow-md disabled:opacity-50"
            >
              {isLoading ? "Génération en cours..." : "Générer la synthèse magique ✨"}
            </button>
          </div>

          {/* COLONNE DROITE : LE RÉSULTAT */}
          <div className="bg-slate-900 rounded shadow-lg p-8 flex flex-col relative overflow-hidden">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-6 border-b border-gray-700 pb-4">Aperçu pour votre client</h3>
            
            <div className="flex-1 flex flex-col text-white whitespace-pre-wrap text-sm leading-relaxed">
              {generatedText ? (
                <p>{generatedText}</p>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 h-full">
                  <p className="font-serif italic">Votre synthèse générée par IA apparaîtra ici...</p>
                </div>
              )}
            </div>

            {/* FILIGRANE OBLIGATOIRE */}
            <div className="mt-8 pt-4 border-t border-gray-700 text-center">
              <p className="text-[10px] text-gray-500 font-semibold tracking-widest">Généré par ReportAI ✨</p>
            </div>

            {/* BOUTON D'EXPORT */}
            <button 
              onClick={() => alert("Bientôt disponible ! Pour l'instant, copiez-collez ce texte.")}
              className="mt-6 w-full bg-white text-slate-900 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded"
            >
              Télécharger en PDF
            </button>
          </div>
        </div>
      </div>

      {/* FENÊTRE MODALE (Premium Popup) */}
      {isPremiumModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 bg-[#C5A880] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              🚀
            </div>
            <h3 className="text-xl font-serif text-[#1A1F26] mb-4">Passez à la vitesse supérieure</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              La marque blanche et les tons personnalisés sont réservés au plan Agence Premium (99€/mois). Impressionnez vos clients avec des rapports à vos propres couleurs.
            </p>
            <button 
              onClick={() => setIsPremiumModalOpen(false)}
              className="w-full bg-[#1A1F26] text-white py-3 text-xs font-bold uppercase tracking-widest rounded hover:bg-gray-800 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
