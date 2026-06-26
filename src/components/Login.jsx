import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // LE DÉTECTEUR AUTOMATIQUE : Si on est connecté, go Dashboard !
  useEffect(() => {
    // Vérifie si on a déjà une session active au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    // Écoute les changements (ex: quand Google nous renvoie sur la page)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError('E-mail ou mot de passe incorrect.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      // On retire le redirectTo forcé, on laisse Supabase faire son travail naturellement
    });
    if (error) setError(error.message);
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
        
        <form onSubmit={handleAuth} className="space-y-4">
          {error && <p className="text-red-500 text-xs text-center font-medium bg-red-50 p-2 rounded">{error}</p>}
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Email</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
              className="w-full border border-gray-200 bg-[#FDFBF7] p-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors" required 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Mot de passe</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
              className="w-full border border-gray-200 bg-[#FDFBF7] p-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors" required minLength="6"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#1A1F26] text-[#FDFBF7] py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Chargement...' : (isSignUp ? "S'inscrire" : "Se connecter")}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
          <span className="text-[10px] text-center text-gray-400 uppercase tracking-widest">Ou continuer avec</span>
          <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full mt-6 bg-white border border-gray-200 text-[#1A1F26] py-3 text-xs font-semibold uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
          </svg>
          Google
        </button>

        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500">
            {isSignUp ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}
          </p>
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="mt-2 text-xs font-bold text-[#C5A880] uppercase tracking-widest hover:text-[#1A1F26] transition-colors">
            {isSignUp ? "Se connecter" : "Créer un compte"}
          </button>
        </div>
      </div>
    </div>
  );
}
