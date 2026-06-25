import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Ajoute Link ici

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 font-sans">
      
      {/* Logo cliquable : Enveloppé dans un Link vers "/" */}
      <Link to="/" className="mb-10 text-center block hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-[#1A1F26] flex items-center justify-center text-[#FDFBF7] text-sm font-serif mx-auto mb-4">
          R
        </div>
        <h1 className="text-xl font-semibold tracking-widest uppercase text-[#1A1F26]">ReportAI</h1>
      </Link>

      <div className="w-full max-w-sm bg-white border border-gray-200 p-8 shadow-sm">
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-8 text-center">
          Connexion à votre espace
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {/* ... tes champs input restent identiques ... */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Email</label>
            <input type="email" className="w-full border border-gray-200 bg-[#FDFBF7] p-3 text-sm focus:outline-none focus:border-[#C5A880]" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Mot de passe</label>
            <input type="password" className="w-full border border-gray-200 bg-[#FDFBF7] p-3 text-sm focus:outline-none focus:border-[#C5A880]" required />
          </div>
          <button type="submit" className="w-full bg-[#1A1F26] text-[#FDFBF7] py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] transition-colors">
            Se connecter
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest">
        Accès réservé aux agences partenaires
      </p>
    </div>
  );
}
