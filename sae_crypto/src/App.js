import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";

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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={connect}>Connect to MetaMask</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
