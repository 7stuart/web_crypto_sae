import React, { createContext, useState, useContext } from 'react';

// Création du contexte
const WinnerContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useWinner = () => useContext(WinnerContext);

// Fournisseur du contexte
export const WinnerProvider = ({ children }) => {
  const [winnerName, setWinnerName] = useState(null); // État du gagnant

  const updateWinner = (newWinnerName) => {
    setWinnerName(newWinnerName); // Mettre à jour le gagnant
  };

  return (
    <WinnerContext.Provider value={{ winnerName, updateWinner }}>
      {children}
    </WinnerContext.Provider>
  );
};
