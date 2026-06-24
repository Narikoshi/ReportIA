import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  // On définit la Landing Page comme page d'accueil par défaut
  const [currentPage, setCurrentPage] = useState('landing');

  // Fonction pour passer au dashboard quand on clique sur "Tester"
  const goToDashboard = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="App w-full min-h-screen">
      {/* Affichage conditionnel magique */}
      {currentPage === 'landing' ? (
        <LandingPage onTestClick={goToDashboard} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
