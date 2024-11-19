import React, { useState } from "react";
import { ethers } from "ethers";

function Home({ redirection }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      console.log("MetaMask not installed; using read-only defaults");
      setProvider(ethers.getDefaultProvider());
    } else {
      console.log("MetaMask detected");
      const newProvider = new ethers.BrowserProvider(window.ethereum);

      try {
        // Request account access
        await newProvider.send("eth_requestAccounts", []);
        const newSigner = await newProvider.getSigner();
        const account = await newSigner.getAddress();
        console.log("Connected with account:", account);

        setProvider(newProvider);
        setSigner(newSigner);
        setConnectedAccount(account); // Track the connected account
      } catch (error) {
        console.error("User rejected connection", error);
      }
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setConnectedAccount(null);
    console.log("Disconnected from MetaMask");
  };

  return (
    <div>
      {!connectedAccount ? (
        <button onClick={connect}>Connect to MetaMask</button>
      ) : (
        <>
          <p>Connected account: {connectedAccount}</p>
          <button onClick={disconnect}>Disconnect from MetaMask</button>
        </>
      )}
    </div>
  );
}

export default Home;
