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
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rawData: rawData, tone: 'simplifié' }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Extraction sécurisée du texte pour éviter l'erreur de structure inattendue
      if (data && data.text) {
        setGeneratedText(data.text);
      } else if (data && data.output) {
        setGeneratedText(data.output);
      } else {
        setGeneratedText(typeof data === 'string' ? data : JSON.stringify(data));
      }
    } catch (error) {
      console.error("Erreur API:", error);
      setGeneratedText("Erreur : Impossible de contacter l'IA. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }; 

  return (
    <>
      {/* SIDEBAR */}
      R ReportAI
      Nouveau Reporting
      Historique
      <button onClick={handleLogout}>Se déconnecter</button>
    </>
  ); 
}
