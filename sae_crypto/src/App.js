import './App.css';
import Navbar from './functions/navbar';
import { useState, useEffect } from 'react';
import Home from './pages/home';
import Lottery from './pages/lottery';
import { ethers } from 'ethers';
import { WinnerProvider } from './functions/winnerContext'; // Import du contexte

function App() {
  const [redirection, setRedirection] = useState(1);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to connect!");
    } else {
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      try {
        await tempProvider.send("eth_requestAccounts", []); // Request account access
        const signer = await tempProvider.getSigner();
        const account = await signer.getAddress();
        setConnectedAccount(account);
        setProvider(tempProvider);
        window.location.reload(); // Force reload after connection
      } catch (error) {
        console.error("User rejected connection", error);
      }
    }
  };

  useEffect(() => {
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
        setConnectedAccount(null);
        setProvider(null);
        window.location.reload();
      } else {
        setConnectedAccount(accounts[0]);
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return (
    <WinnerProvider>
      <div className="App">
        <Navbar setRedirection={setRedirection} connectedAccount={connectedAccount} connect={connect} />
        {redirection === 1 && <Home connectedAccount={connectedAccount} />}
        {redirection === 2 && <Lottery connectedAccount={connectedAccount} provider={provider} />}
      </div>
    </WinnerProvider>
  );
}

export default App;
