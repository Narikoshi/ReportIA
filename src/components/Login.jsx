import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // La magie Supabase : une seule ligne pour authentifier
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 font-sans">
      <Link to="/" className="mb-10 text-center block">
        <div className="w-10 h-10 bg-[#1A1F26] flex items-center justify-center text-[#FDFBF7] text-sm font-serif mx-auto mb-4">R</div>
        <h1 className="text-xl font-semibold tracking-widest uppercase text-[#1A1F26]">ReportAI</h1>
      </Link>

      <div className="w-full max-w-sm bg-white border border-gray-200 p-8 shadow-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 bg-[#FDFBF7] p-3 text-sm focus:outline-none focus:border-[#C5A880]" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 bg-[#FDFBF7] p-3 text-sm focus:outline-none focus:border-[#C5A880]" required />
          </div>
          <button type="submit" className="w-full bg-[#1A1F26] text-[#FDFBF7] py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] transition-colors">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
