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
    setGeneratedText('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          rawData: rawData, 
          tone: 'professionnel' 
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API (${response.status})`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Gestion de la réponse selon le format attendu (chaîne ou clé spécifique)
      if (typeof data === 'string') {
        setGeneratedText(data);
      } else if (data.text) {
        setGeneratedText(data.text);
      } else if (data.result) {
        setGeneratedText(data.result);
      } else {
        // Fallback si la réponse est un objet complexe simulé
        setGeneratedText(JSON.stringify(data));
      }

    } catch (error) {
      console.error("Erreur détaillée:", error);
      setGeneratedText("Erreur : Impossible de contacter l'IA. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }; 

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">ReportAI</div>
        <nav className="nav-menu">
          <button className="nav-item active">Nouveau Reporting</button>
          <button className="nav-item">Historique</button>
        </nav>
        <button onClick={handleLogout} className="logout-btn">Se déconnecter</button>
      </aside>

      {/* MAIN CONTENT - Conservation stricte de l'interface graphique */}
      <main className="main-content">
        <div className="workspace">
          <textarea 
            value={rawData} 
            onChange={(e) => setRawData(e.target.value)} 
            placeholder="Collez vos données brutes ici..."
            disabled={isLoading}
          />
          <button 
            onClick={generateReport} 
            disabled={isLoading || !rawData.trim()}
            className="generate-btn"
          >
            {isLoading ? 'Génération en cours...' : 'Générer le rapport'}
          </button>
        </div>
        
        {generatedText && (
          <div className="result-container">
            <h3>Rapport Généré</h3>
            <div className="report-output">{generatedText}</div>
          </div>
        )}
      </main>
    </div>
  ); 
}
