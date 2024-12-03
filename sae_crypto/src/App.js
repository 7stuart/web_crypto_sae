import './App.css';
import Navbar from './functions/navbar';
import { useState, useEffect } from 'react';
import Home from './pages/home';
import Lottery from './pages/lottery';
import { ethers } from 'ethers';

function App() {
  const [redirection, setRedirection] = useState(1);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      console.log("MetaMask not installed; using read-only defaults");
      alert("Please install MetaMask to connect!");
    } else {
      console.log("MetaMask detected");
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      try {
        await tempProvider.send("eth_requestAccounts", []); // Request account access
        const signer = await tempProvider.getSigner();
        const account = await signer.getAddress();
        console.log("Connected with account:", account);
        setConnectedAccount(account); // Save the connected account
        setProvider(tempProvider); // Set provider for contract interaction
  
        // Forcer l'actualisation après la connexion
        window.location.reload();
      } catch (error) {
        console.error("User rejected connection", error);
      }
    }
  };
  

  useEffect(() => {
    // Check if the user is already connected on component mount
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
          const tempProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(tempProvider);
        }
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // Aucun compte connecté
        setConnectedAccount(null);
        setProvider(null);
        window.location.reload(); // Recharge la page si déconnecté
      } else {
        // Mettre à jour le compte connecté
        setConnectedAccount(accounts[0]);
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);
      }
    };
  
    const handleChainChanged = () => {
      // Recharge la page lorsque le réseau change
      window.location.reload();
    };
  
    if (window.ethereum) {
      // Ajouter les écouteurs
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }
  
    return () => {
      // Nettoyer les écouteurs d'événements
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);  

  return (
    <div className="App">
      {/* Pass connect function and connected account to Navbar */}
      <Navbar setRedirection={setRedirection} connectedAccount={connectedAccount} connect={connect} />
      
      {/* Conditional rendering of pages */}
      {redirection === 1 && <Home connectedAccount={connectedAccount} />}
      {redirection === 2 && <Lottery connectedAccount={connectedAccount} provider={provider} />}
    </div>
  );

}

export default App;