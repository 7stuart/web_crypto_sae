import './App.css';
import Navbar from './functions/navbar';
import { useState } from 'react';
import Home from './pages/home';
import Lottery from './pages/lottery';
import { ethers } from 'ethers';

function App() {
  const [redirection, setRedirection] = useState(1);
  const [connectedAccount, setConnectedAccount] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      console.log("MetaMask not installed; using read-only defaults");
      alert("Please install MetaMask to connect!");
    } else {
      console.log("MetaMask detected");
      const provider = new ethers.BrowserProvider(window.ethereum);

      try {
        await provider.send("eth_requestAccounts", []); // Request account access
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        console.log("Connected with account:", account);
        setConnectedAccount(account); // Save the connected account
      } catch (error) {
        console.error("User rejected connection", error);
      }
    }
  };

  return (
    <div className="App">
      {/* Pass connect function and connected account to Navbar */}
      <Navbar setRedirection={setRedirection} connectedAccount={connectedAccount} connect={connect} />
      {/* Conditional rendering of pages */}
      {redirection === 1 && <Home />}
      {redirection === 2 && <Lottery />}
    </div>
  );
}

export default App;
