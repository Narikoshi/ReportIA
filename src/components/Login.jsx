import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Redirection immédiate sans vérification réelle (Magicien d'Oz)
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 font-sans text-[#1A1F26]">
      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="w-10 h-10 bg-[#1A1F26] flex items-center justify-center text-[#FDFBF7] text-sm font-serif mx-auto mb-4">
          R
        </div>
        <h1 className="text-xl font-semibold tracking-widest uppercase">ReportAI</h1>
      </div>

      {/* Carte de connexion minimaliste */}
      <div className="w-full max-w-sm bg-white border border-gray-200 p-8 shadow-sm">
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-8 text-center">
          Connexion à votre espace
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-2">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full bg-[#FDFBF7] border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
              placeholder="votre-email@agence.com"
            />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Mot de passe</label>
            <input 
              type="password" 
              required
              className="w-full bg-[#FDFBF7] border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-[#1A1F26] text-[#FDFBF7] font-semibold tracking-widest text-xs uppercase hover:bg-[#C5A880] transition-all duration-300"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
