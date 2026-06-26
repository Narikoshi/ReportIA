import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loadingLogout, setLoadingLogout] = useState(false);

  // 1. SÉCURITÉ : Vérifier si l'utilisateur est bien connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Pas de session ? Dehors ! Retour à la page de connexion
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate]);

  // 2. FONCTION DE DÉCONNEXION
  const handleLogout = async () => {
    setLoadingLogout(true);
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login'); // On le renvoie sur la page de connexion
    } else {
      console.error("Erreur lors de la déconnexion:", error.message);
    }
    setLoadingLogout(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-[#1A1F26]">
      
      {/* BARRE LATÉRALE (SIDEBAR) */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-[#1A1F26] flex items-center justify-center text-[#FDFBF7] text-xs font-serif">R</div>
            <h1 className="text-sm font-semibold tracking-widest uppercase">ReportAI</h1>
          </div>
          
          <nav className="space-y-4">
            <a href="#" className="block text-xs font-bold text-[#C5A880] uppercase tracking-widest">Nouveau Rapport</a>
            <a href="#" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-[#1A1F26] transition-colors">Historique</a>
            <a href="#" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-[#1A1F26] transition-colors">Paramètres</a>
          </nav>
        </div>

        {/* BOUTON DE DÉCONNEXION */}
        <button 
          onClick={handleLogout}
          disabled={loadingLogout}
          className="text-left text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors disabled:opacity-50"
        >
          {loadingLogout ? "Déconnexion..." : "Se déconnecter"}
        </button>
      </div>

      {/* ZONE PRINCIPALE (LE COEUR DU MVP) */}
      <div className="flex-1 p-10 flex flex-col">
        <h2 className="text-2xl font-serif text-[#1A1F26] mb-8">Nouveau Reporting</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          
          {/* COLONNE GAUCHE : LES INPUTS DE L'AGENCE */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 flex flex-col">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Collez vos données brutes SEO/Ads ici</label>
              <textarea 
                className="w-full flex-1 border border-gray-200 bg-white p-4 text-sm focus:outline-none focus:border-[#C5A880] transition-colors resize-none"
                placeholder="Ex: Le CPC a augmenté de 15% (1.42€), le CTR est en baisse à 2.1%. On a perdu 3 positions sur le mot-clé principal..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Ton du message</label>
              <select className="w-full border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors appearance-none">
                <option>Rassurant & Pédagogue</option>
                <option>Direct & Orienté Résultats</option>
                <option>Enthousiaste & Dynamique</option>
              </select>
            </div>

            <button className="w-full bg-[#1A1F26] text-[#FDFBF7] py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] transition-colors flex items-center justify-center gap-2">
              Générer la synthèse magique ✨
            </button>
          </div>

          {/* COLONNE DROITE : LE RÉSULTAT */}
          <div className="border border-gray-200 bg-white p-8 flex flex-col">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-6 border-b border-gray-100 pb-4">Aperçu pour votre client</h3>
            
            {/* ETAT VIDE (Avant génération) */}
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
              <svg className="w-8 h-8 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <p className="text-sm font-serif">Votre synthèse générée par IA apparaîtra ici...</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
