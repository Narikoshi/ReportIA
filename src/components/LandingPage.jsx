import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // La classe scroll-smooth ici active le glissement doux
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1F26] font-sans antialiased selection:bg-[#C5A880] selection:text-white scroll-smooth">
      
      {/* HEADER & NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 bg-[#1A1F26] flex items-center justify-center text-[#FDFBF7] text-sm font-serif">R</div>
            <span className="text-lg font-semibold tracking-widest uppercase text-[#1A1F26]">ReportAI</span>
          </div>

          <nav className="hidden md:flex items-center space-x-10 text-xs uppercase tracking-widest font-medium text-gray-500">
            <a href="#concept" className="hover:text-[#1A1F26] transition-colors">Le Concept</a>
            <a href="#demo" className="hover:text-[#1A1F26] transition-colors">Démonstration</a>
          </nav>

          <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold tracking-widest uppercase border border-[#1A1F26] text-[#1A1F26] hover:bg-[#1A1F26] hover:text-[#FDFBF7] transition-all duration-300 rounded-none">
            Connexion
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="concept" className="relative pt-36 pb-16 md:pt-48 md:pb-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-2 border-b border-[#C5A880] pb-2 mb-8">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#C5A880]">L'OUTIL DE REPORTING DES AGENCES D'ÉLITE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1A1F26] font-serif mb-8 leading-[1.15]">
              Traduisez vos rapports techniques en e-mails clients d'une clarté absolue.
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl font-light mb-12 max-w-2xl leading-relaxed">
              Nous aidons les experts SEO et SEA à valoriser leur travail. Collez vos données brutes, générez instantanément une synthèse orientée business qui rassure et fidélise votre clientèle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 bg-[#1A1F26] text-[#FDFBF7] font-semibold tracking-widest text-xs uppercase hover:bg-[#C5A880] transition-all duration-300 rounded-none">
                ESSAYER GRATUITEMENT
              </Link>
              <a href="#demo" className="inline-flex items-center justify-center px-8 py-4 border border-[#1A1F26] text-[#1A1F26] font-semibold tracking-widest text-xs uppercase hover:bg-[#1A1F26] hover:text-[#FDFBF7] transition-all duration-300 rounded-none">
                VOIR LE RÉSULTAT
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DÉMO */}
      <section id="demo" className="py-24 px-8 max-w-6xl mx-auto w-full border-t border-gray-200 bg-[#FBF9F4]">
        <div className="mb-20 text-center">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C5A880] block mb-3">LA DÉMONSTRATION</span>
            <h2 className="text-3xl md:text-4xl font-normal font-serif text-[#1A1F26]">L'IA traduit la technique en langage business</h2>
            <p className="text-gray-600 font-light mt-4 max-w-xl mx-auto">Découvrez comment l'intelligence artificielle transforme un rapport indigeste en une synthèse qui rassure le client en 10 secondes.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* BLOC AVANT */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden transform -rotate-1 hover:rotate-0 transition duration-300">
                <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-medium text-slate-400 ml-4">Rapport Mensuel SEA.eml</span>
                </div>
                <div className="p-6 text-sm">
                    <div className="border-b border-slate-100 pb-4 mb-4 text-slate-500 space-y-1">
                        <p><span className="font-semibold text-slate-700">De :</span> account-manager@votre-agence.com</p>
                        <p><span className="font-semibold text-slate-700">À :</span> contact@garage-artisan.fr</p>
                    </div>
                    <div className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">
                        <p className="font-bold text-rose-600 mb-2">⚠️ Données techniques brutes :</p>
                        "Bonjour, suite aux optimisations sur la Search Console, les impressions grimpent de 12%. Le <span className="bg-rose-100 text-rose-800 font-mono px-1 rounded">CPC moyen</span> s'établit à 1,42€ pour un <span className="bg-rose-100 text-rose-800 font-mono px-1 rounded">CTR de 3,5%</span>. Le <span className="bg-rose-100 text-rose-800 font-mono px-1 rounded">ROAS global</span> est à 2,8, impacté par la baisse des conversions sur la campagne Marque à cause de la hausse du <span className="bg-rose-100 text-rose-800 font-mono px-1 rounded">taux de rebond (72%)</span>..."
                    </div>
                </div>
            </div>

            {/* BLOC APRÈS - TON CODE EXACT */}
            <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl relative transform lg:translate-x-4 lg:scale-105 transition duration-300">
                {/* Petit badge IA stylé animé */}
                <div className="absolute -top-4 -right-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 font-black text-xs px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider animate-bounce">
                    Généré par IA ✨
                </div>
                
                <div className="bg-slate-900 rounded-[22px] p-8 text-white">
                    {/* En-tête pro */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-900 text-lg shadow-md shadow-emerald-500/20">🚀</div>
                            <div>
                                <h4 className="font-bold text-white text-base">Point Météo Google</h4>
                                <p className="text-xs text-slate-400">Le résumé hebdo en 15 secondes</p>
                            </div>
                        </div>
                        <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">Semaine Active</span>
                    </div>

                    {/* Les KPI visuels */}
                    <div className="space-y-4 mb-6">
                        {/* L'essentiel */}
                        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-800 transition">
                            <span className="text-2xl mt-0.5">💰</span>
                            <div>
                                <h5 className="font-semibold text-emerald-400 text-sm mb-0.5">Votre Rentabilité</h5>
                                <p className="text-slate-300 text-sm">Pour <span className="text-white font-bold underline decoration-emerald-400">100€ investis</span>, vos campagnes ont généré <span className="text-white font-bold bg-slate-700 px-1.5 py-0.5 rounded">280€ net</span> de ventes directes. Le système est très sain.</p>
                            </div>
                        </div>

                        {/* Ce qui a changé */}
                        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-start gap-4 hover:bg-slate-800 transition">
                            <span className="text-2xl mt-0.5">📈</span>
                            <div>
                                <h5 className="font-semibold text-sky-400 text-sm mb-0.5">Votre Visibilité</h5>
                                <p className="text-slate-300 text-sm">Vos publicités captent l'attention (+12%). Seul point à surveiller : les visiteurs quittent le site un peu trop vite une fois arrivés.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <footer className="bg-[#1A1F26] text-gray-400 text-[11px] tracking-wider py-12 text-center">
        <p>&copy; {new Date().getFullYear()} ReportAI. Transformez votre communication.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

