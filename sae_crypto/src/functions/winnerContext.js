import { createContext, useContext, useState } from 'react';

export const WinnerContext = createContext();

export const WinnerProvider = ({ children }) => {
  const [winner, setWinner] = useState("");

  return (
    <WinnerContext.Provider value={{ winner, setWinner }}>
      {children}
    </WinnerContext.Provider>
  );
};

export const useWinner = () => useContext(WinnerContext);
