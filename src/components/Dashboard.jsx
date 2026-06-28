import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Fonction pour mettre en gras le texte entouré de **
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

// Fonction pour extraire automatiquement le nom du client depuis les données brutes
const extractClientName = (text) => {
  if (!text) return 'Unknown';
  
  const regexes = [
    /(?:client|société|entreprise|nom|compte)\s*[:=-]\s*([^\n\r,]+)/i,
    /(?:pour|de)\s+([A-Z][a-zA-Z0-9\s]{2,20})\s*(?:-|:|\n)/,
    /^[A-Z][a-zA-Z0-9\s]{2,20}$/m
  ];

  for (let regex of regexes) {
    const match = text.match(regex);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 1 && name.length < 50) return name;
    }
  }

  return 'Unknown';
};

// Fonction pour parser la réponse de l'IA
const parseGeneratedText = (text) => {
  if (!text) return { isParsed: false };
  try {
    const rentabiliteMatch = text.match(/💰.*?RENTABILITÉ[^\n]*\n([\s\S]*?)(?=👁️|$)/i);
    const traficMatch = text.match(/👁️.*?VISIBILITÉ[^\n]*\n([\s\S]*?)(?=🚀|$)/i);
    const actionMatch = text.match(/🚀.*?PLAN D'ACTION[^\n]*\n([\s\S]*?)$/i);

    const rentabilite = rentabiliteMatch ? rentabiliteMatch[1].trim() : '';
    const trafic = traficMatch ? traficMatch[1].trim() : '';
    const action = actionMatch ? actionMatch[1].trim() : '';

    return { rentabilite, trafic, action, isParsed: !!(rentabilite && trafic && action), raw: text };
  } catch (e) {
    return { isParsed: false, raw: text };
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new');
  const [rawData, setRawData] = useState('');
  const [tone, setTone] = useState('Rassurant');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  
  // États pour l'historique
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  useEffect(() => {
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
  }, [navigate]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error(error);
    } days {
      // Juste au cas où, cette fonction n'utilise pas de finally complexe
    }
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
      setSelectedHistoryItem(null);
    }
  }, [activeTab]);

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

      const detectedClient = extractClientName(rawData);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('reports').insert([
          {
            user_id: session.user.id,
            raw_data: rawData,
            tone: tone,
            generated_text: data.text,
            client_name: detectedClient
          }
        ]);
      }
    } catch (error) {
      setGeneratedText(`Erreur : ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClientName = async (e, item) => {
    e.stopPropagation();
    const newName = prompt("Entrez le nouveau nom du client :", item.client_name);
    if (newName === null || newName.trim() === "") return;

    try {
      const { error } = await supabase
        .from('reports')
        .update({ client_name: newName.trim() })
        .eq('id', item.id);

      if (error) throw error;

      setHistory(history.map(h => h.id === item.id ? { ...h, client_name: newName.trim() } : h));
      if (selectedHistoryItem?.id === item.id) {
        setSelectedHistoryItem({ ...selectedHistoryItem, client_name: newName.trim() });
      }
    } catch (error) {
      alert("Erreur lors de la modification du nom.");
    }
  };

  const textToParse = activeTab === 'history' && selectedHistoryItem ? selectedHistoryItem.generated_text : generatedText;
  const parsedData = parseGeneratedText(textToParse);

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
            <button onClick={() => setActiveTab('new')} className={`block text-left text-xs font-bold uppercase tracking-widest w-full ${activeTab === 'new' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-[#1A1F26]'}`}>
              Nouveau Reporting
            </button>
            <button onClick={() => setActiveTab('history')} className={`block text-left text-xs font-bold uppercase tracking-widest w-full ${activeTab === 'history' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-[#1A1F26]'}`}>
              Historique
            </button>
          </nav>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }} className="text-left text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">Se déconnecter</button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10 flex flex-col">
        <h2 className="text-2xl font-serif text-[#1A1F26] mb-8 text-left">
          {activeTab === 'new' ? 'Nouveau Reporting' : 'Mon Historique'}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          {activeTab === 'new' ? (
            <div className="flex flex-col gap-6">
              <textarea 
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="w-full flex-1 border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#C5A880] transition-colors resize-none rounded shadow-sm"
                placeholder="Collez vos données brutes SEO/SEA ici... Exemple: Ajoutez la ligne 'Client: NomDuClient' pour l'extraction automatique !"
              ></textarea>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Ton du message</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:border-[#C5A880] rounded">
                  <option value="Rassurant">Rassurant</option>
                </select>
              </div>
              <button onClick={generateReport} disabled={isLoading} className="w-full bg-[#1A1F26] text-[#FDFBF7] py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] transition-colors rounded">
                {isLoading ? "Génération en cours..." : "Générer la synthèse magique ✨"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
              {isLoadingHistory ? (
                <p className="text-sm text-gray-400 text-left">Chargement...</p>
              ) : history.length === 0 ? (
                <p className="text-sm text-gray-400 text-left">Aucun rapport généré.</p>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedHistoryItem(item)}
                    className={`p-4 border rounded cursor-pointer transition shadow-sm text-left relative ${selectedHistoryItem?.id === item.id ? 'border-[#C5A880] bg-white' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          👤 {item.client_name || 'Unknown'}
                          <button 
                            onClick={(e) => handleEditClientName(e, item)} 
                            className="text-[10px] font-normal text-blue-500 hover:underline bg-blue-50 px-1.5 py-0.5 rounded transition"
                          >
                            Modifier
                          </button>
                        </h4>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 mt-1 inline-block">{item.tone}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(item.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute:'2-digit' })}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 italic mt-1">
                      "{item.raw_data}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* RENDU DROITE */}
          <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl relative w-full h-full">
            {textToParse && (
                <div className="absolute -top-4 -right-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-black text-[10px] px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider z-10">
                    {activeTab === 'new' ? 'Généré par IA ✨' : `Client : ${selectedHistoryItem?.client_name || 'Unknown'} 📁`}
                </div>
            )}
            
            <div className="bg-slate-900 rounded-[22px] p-8 text-white h-full flex flex-col text-left">
              <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-900 text-lg">🚀</div>
                      <div>
                          <h4 className="font-bold text-white text-base">Point Météo</h4>
                          <p className="text-xs text-slate-400">Le résumé en 15 secondes</p>
                      </div>
                  </div>
              </div>

              {!textToParse ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                    <span className="text-4xl mb-4">🪄</span>
                    <p className="text-slate-400 text-sm">
                      {activeTab === 'new' ? 'En attente des données...' : 'Sélectionnez un rapport dans l\'historique...'}
                    </p>
                </div>
              ) : parsedData.isParsed ? (
                <>
                  <div className="space-y-4 mb-6 flex-1 overflow-y-auto">
                      <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4">
                          <span className="text-2xl">💰</span>
                          <div>
                              <h5 className="font-semibold text-emerald-400 text-sm mb-0.5">Investissement & Rentabilité</h5>
                              <p className="text-slate-300 text-sm leading-relaxed">{formatText(parsedData.rentabilite)}</p>
                          </div>
                      </div>
                      <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4">
                          <span className="text-2xl">👁️</span>
                          <div>
                              <h5 className="font-semibold text-sky-400 text-sm mb-0.5">Trafic & Visibilité</h5>
                              <p className="text-slate-300 text-sm leading-relaxed">{formatText(parsedData.trafic)}</p>
                          </div>
                      </div>
                      <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4">
                          <span className="text-2xl">🛠️</span>
                          <div>
                              <h5 className="font-semibold text-amber-400 text-sm mb-0.5">Plan d'Action</h5>
                              <p className="text-slate-300 text-sm leading-relaxed">{formatText(parsedData.action)}</p>
                          </div>
                      </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-medium mt-auto">
                      <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Zéro Jargon garanti
                      </span>
                      <button onClick={() => navigator.clipboard.writeText(textToParse)} className="text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                        Copier le message
                      </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-auto text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {textToParse}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
