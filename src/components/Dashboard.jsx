import React, { useEffect, useState, useRef } from 'react';
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

// Fonction pour extraire le nom du client
const extractClientName = (text) => {
  if (!text) return 'Unknown';
  const regexes = [
    /(?:client|société|entreprise|nom|compte|account)\s*[:=-]\s*([^\n\r,;|]+)/i,
    /(?:pour|de|for|of)\s+([A-Z][a-zA-Z0-9\s._-]{2,25})\s*(?:-|:|\n|$)/,
    /^[A-Z][a-zA-Z0-9\s._-]{2,25}$/m
  ];
  for (let regex of regexes) {
    const match = text.match(regex);
    if (match && match[1]) {
      const name = match[1].trim();
      const lowerName = name.toLowerCase();
      if (name.length > 1 && name.length < 40 && !lowerName.includes('http') && !lowerName.includes('audit') && !lowerName.includes('rapport')) {
        return name;
      }
    }
  }
  return 'Unknown';
};

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
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('new');
  const [rawData, setRawData] = useState('');
  const [tone, setTone] = useState('Rassurant');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulation du statut de l'utilisateur (false = gratuit, true = payant)
  const [isPremium, setIsPremium] = useState(false); 
  
  // États de l'historique et des modales
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [importedFileName, setImportedFileName] = useState('');

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
    } finally {
      setIsLoadingHistory(false);
    }
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

      let detectedClient = extractClientName(rawData);
      if (detectedClient === 'Unknown') {
        const iaClientMatch = data.text.match(/(?:client|pour|société)\s*[:=-]\s*([^\n\r*]+)/i);
        if (iaClientMatch && iaClientMatch[1]) detectedClient = iaClientMatch[1].trim();
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('reports').insert([
          { user_id: session.user.id, raw_data: rawData, tone: tone, generated_text: data.text, client_name: detectedClient }
        ]);
      }
    } catch (error) {
      setGeneratedText(`Erreur : ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de l'import de fichier PDF / Excel
  const handleFileImportClick = () => {
    if (!isPremium) {
      setShowUpsellModal(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportedFileName(file.name);
    setIsLoading(true);

    // Ici se fera l'appel à votre future route API d'extraction de texte (pdf/xlsx)
    // Pour l'instant, on simule une extraction de texte après 1.5s
    setTimeout(() => {
      setRawData(`[Données extraites du fichier : ${file.name}]\n\nClient: Entreprise Exemple\nBudget dépensé: 1450€\nConversions: 42 ventes\nClics SEO: +15%\nMots-clés en hausse: "achat chaussures éco", "boutique mode durable".`);
      setIsLoading(false);
    }, 1500);
  };

  const handleEditClientName = async (e, item) => {
    e.stopPropagation();
    const newName = prompt("Entrez le nouveau nom du client :", item.client_name);
    if (newName === null || newName.trim() === "") return;
    try {
      const { error } = await supabase.from('reports').update({ client_name: newName.trim() }).eq('id', item.id);
      if (error) throw error;
      setHistory(history.map(h => h.id === item.id ? { ...h, client_name: newName.trim() } : h));
      if (selectedHistoryItem?.id === item.id) setSelectedHistoryItem({ ...selectedHistoryItem, client_name: newName.trim() });
    } catch (error) {
      alert("Erreur lors de la modification du nom.");
    }
  };

  const triggerDeleteModal = (e, item) => {
    e.stopPropagation();
    setReportToDelete(item);
  };

  const confirmDeleteReport = async () => {
    if (!reportToDelete) return;
    try {
      const { error } = await supabase.from('reports').delete().eq('id', reportToDelete.id);
      if (error) throw error;
      setHistory(history.filter(h => h.id !== reportToDelete.id));
      if (selectedHistoryItem?.id === reportToDelete.id) setSelectedHistoryItem(null);
    } catch (error) {
      alert("Erreur lors de la suppression du rapport.");
    } finally {
      setReportToDelete(null);
    }
  };

  const textToParse = activeTab === 'history' && selectedHistoryItem ? selectedHistoryItem.generated_text : generatedText;
  const parsedData = parseGeneratedText(textToParse);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-[#1A1F26] relative">
      
      {/* MODALE UPSELL / OPTION PAYANTE */}
      {showUpsellModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl">
              Premium ⭐
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center text-xl mx-auto mb-4 mt-2">
              📂
            </div>
            <h3 className="text-base font-serif font-bold text-gray-900 mb-2">Import PDF & Excel</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Marre des copier-coller ? Déposez directement vos exports **Google Ads (PDF)** ou vos tableaux **Data Looker (Excel)**. Notre IA extrait et analyse tout en 2 secondes.
            </p>
            <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left border border-amber-100">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">Inclus dans l'offre Pro :</span>
              <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside">
                <li>Imports PDF & Excel illimités</li>
                <li>Rapports en Marque Blanche (votre logo)</li>
                <li>Support prioritaire 24/7</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { alert("Redirection vers Stripe..."); setIsPremium(true); setShowUpsellModal(false); }}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-[#FDFBF7] bg-[#1A1F26] hover:bg-[#C5A880] transition-colors rounded-lg shadow-md"
              >
                Passer à l'offre Pro — 19€/mois
              </button>
              <button 
                onClick={() => setShowUpsellModal(false)}
                className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE CONFIRMATION DE SUPPRESSION */}
      {reportToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl mx-auto mb-4">⚠️</div>
            <h3 className="text-base font-serif font-bold text-gray-900 mb-2">Supprimer le rapport</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement le rapport pour <span className="font-semibold text-gray-800">"{reportToDelete.client_name || 'Unknown'}"</span> ?
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setReportToDelete(null)} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg">Annuler</button>
              <button onClick={confirmDeleteReport} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7] bg-red-500 hover:bg-red-600 transition-colors rounded-lg shadow-sm">Confirmer</button>
            </div>
          </div>
        </div>
      )}

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
        <div>
          {/* Indicateur visuel du forfait dans la sidebar */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100 text-left">
            <span className="text-[9px] font-bold text-gray-400 uppercase block">Mon Compte</span>
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
              {isPremium ? '⭐ Plan PRO Active' : '🕊️ Version Gratuite'}
            </span>
            {!isPremium && (
              <button onClick={() => setShowUpsellModal(true)} className="text-[10px] text-amber-600 font-bold hover:underline mt-1 block">
                Passer Pro 🚀
              </button>
            )}
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }} className="text-left text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors w-full">Se déconnecter</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10 flex flex-col">
        <h2 className="text-2xl font-serif text-[#1A1F26] mb-8 text-left">
          {activeTab === 'new' ? 'Nouveau Reporting' : 'Mon Historique'}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          {activeTab === 'new' ? (
            <div className="flex flex-col gap-4">
              
              {/* ZONE D'IMPORT DE FICHIER (PAYANTE) */}
              <div 
                onClick={handleFileImportClick}
                className="border-2 border-dashed border-gray-200 hover:border-[#C5A880] bg-white rounded-xl p-5 text-center cursor-pointer transition-all relative group overflow-hidden"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf,.xlsx,.xls" 
                  className="hidden" 
                />
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">📁</span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      Importer un PDF ou un fichier Excel
                      {!isPremium && <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded tracking-wider uppercase">Pro 🔒</span>}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {importedFileName ? `Fichier chargé : ${importedFileName}` : 'Glissez-déposez ou cliquez pour parcourir'}
                    </p>
                  </div>
                </div>
              </div>

              <textarea 
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="w-full flex-1 border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#C5A880] transition-colors resize-none rounded-xl shadow-sm min-h-[200px]"
                placeholder="Collez vos données brutes SEO/SEA ici... Ou utilisez l'import de fichier ci-dessus !"
              ></textarea>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 text-left">Ton du message</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:border-[#C5A880] rounded-xl">
                  <option value="Rassurant">Rassurant</option>
                </select>
              </div>
              <button onClick={generateReport} disabled={isLoading} className="w-full bg-[#1A1F26] text-[#FDFBF7] py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] transition-colors rounded-xl shadow-sm">
                {isLoading ? "Traitement en cours..." : "Générer la synthèse magique ✨"}
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
                    className={`p-4 border rounded-xl cursor-pointer transition shadow-sm text-left relative ${selectedHistoryItem?.id === item.id ? 'border-[#C5A880] bg-white' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          👤 {item.client_name || 'Unknown'}
                          <button onClick={(e) => handleEditClientName(e, item)} className="text-[10px] font-normal text-blue-500 hover:underline bg-blue-50 px-1.5 py-0.5 rounded">Modifier</button>
                        </h4>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 mt-1 inline-block">{item.tone}</span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] text-gray-400">{new Date(item.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute:'2-digit' })}</span>
                        <button onClick={(e) => triggerDeleteModal(e, item)} className="text-[10px] text-red-500 hover:text-red-700 bg-red-50 px-2 py-0.5 rounded font-medium">Supprimer</button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 italic mt-1 pr-12">"{item.raw_data}"</p>
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
                    <p className="text-slate-400 text-sm">{activeTab === 'new' ? 'En attente des données...' : 'Sélectionnez un rapport...'}</p>
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
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>Zéro Jargon garanti</span>
                      <button onClick={() => navigator.clipboard.writeText(textToParse)} className="text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">Copier le message</button>
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-auto text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{textToParse}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
