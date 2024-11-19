
import './App.css';
import { ethers } from "ethers";
import Navbar from './functions/navbar';
function App() {
  const connect = async () => {
    let signer = null;
    let provider;

    if (!window.ethereum) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      console.log("MetaMask detected");
      provider = new ethers.BrowserProvider(window.ethereum);

      try {
        // Request account access
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        console.log("Connected with signer:", signer);
      } catch (error) {
        console.error("User rejected connection", error);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        
        <button onClick={connect}>Connect to MetaMask</button>
      
      </header>
    </div>
  );
}

export default App;

