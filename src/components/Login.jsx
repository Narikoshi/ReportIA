import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      // Logique d'inscription
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } else {
      // Logique de connexion classique
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('E-mail ou mot de passe incorrect.');
      } else {
        navigate('/dashboard');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 font-sans">
      <Link to="/" className="mb-10 text-center block hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-[#1A1F26] flex items-center justify-center text-[#FDFBF7] text-sm font-serif mx-auto mb-4">R</div>
        <h1 className="text-xl font-semibold tracking-widest uppercase text-[#1A1F26]">ReportAI</h1>
      </Link>

      <div className="w-full max-w-sm bg-white border border-gray-200 p-8 shadow-sm">
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-8 text-center">
          {isSignUp ? 'Créer votre espace agence' : 'Connexion à votre espace'}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-6">
          {error && <p className="text-red-500 text-xs text-center font-medium bg-red-50 p-2 rounded">{error}</p>}
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full border border-gray-200 bg-[#FDFBF7] p-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors" 
              required 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border border-gray-200 bg-[#FDFBF7] p-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors" 
              required 
              minLength="6"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1A1F26] text-[#FDFBF7] py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] transition-colors disabled:opacity-50"
          >
            {loading ? 'Chargement...' : (isSignUp ? "S'inscrire" : "Se connecter")}
          </button>
        </form>

        {/* Le Toggle Inscription / Connexion */}
        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500">
            {isSignUp ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}
          </p>
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }} 
            className="mt-2 text-xs font-bold text-[#C5A880] uppercase tracking-widest hover:text-[#1A1F26] transition-colors"
          >
            {isSignUp ? "Se connecter" : "Créer un compte"}
          </button>
        </div>
      </div>
    </div>
  );
}
