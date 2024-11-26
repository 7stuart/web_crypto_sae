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