import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../LotteryABI.json"; // Assurez-vous que l'ABI est correctement importée
const contractAddress = "0x8D45Dd70309B0D23E4fC1cB31ED2ee78Fbc2ef6f"; // Remplace par l'adresse réelle du contrat

function Home({ setConnectedAccount }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connectedAccount, setConnectedAccountLocal] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const checkConnection = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setConnectedAccountLocal(accounts[0]); // Si un compte est connecté
        }
      };
      checkConnection();
    }
  }, []);

  // Fonction de connexion à MetaMask
  const connect = async () => {
    if (!window.ethereum) {
      console.log("MetaMask not installed; using read-only defaults");
      alert("Please install MetaMask to connect!");
    } else {
      console.log("MetaMask detected");
      const newProvider = new ethers.BrowserProvider(window.ethereum);

      try {
        await newProvider.send("eth_requestAccounts", []);
        const newSigner = await newProvider.getSigner();
        const account = await newSigner.getAddress();
        console.log("Connected with account:", account);

        setProvider(newProvider);
        setSigner(newSigner);
        setConnectedAccountLocal(account); // Save the connected account
        setConnectedAccount(account); // Propagation à l'état global
      } catch (error) {
        console.error("User rejected connection", error);
      }
    }
  };

  // Fonction pour participer à la loterie
  const participateLottery = async () => {
    if (!connectedAccount) {
      alert("Veuillez vous connecter d'abord avec MetaMask");
      return;
    }

    setIsParticipating(true);
    setError("");

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.participate({
        value: ethers.parseEther("0.0001"), // Envoie 0.01 ETH pour participer
      });

      await tx.wait(); // Attends que la transaction soit minée
      console.log("Participation réussie !");

      alert("Vous avez participé à la loterie avec succès !");
    } catch (error) {
      console.error("Erreur lors de la participation", error);
      setError("Erreur lors de la participation à la loterie");
    } finally {
      setIsParticipating(false);
    }
  };

  return (
    <>
      <h1>Bienvenue sur notre application de loterie décentralisée</h1>
      <p>
        Cette application a été créée pour aider notre association à générer des revenus en organisant
        une loterie décentralisée. En achetant des billets, vous contribuez directement au financement
        des activités de l'association. Une partie des recettes est allouée aux projets associatifs,
        tandis que la transparence totale est assurée grâce à la technologie blockchain.
      </p>
      <p>
        Pour participer à la loterie, il vous suffit de vous connecter à MetaMask et d'acheter un ticket
        au prix de 0.0001 ETH. Le tirage se fera automatiquement après chaque participation.
      </p>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        {connectedAccount ? (
          <div>
            <p>Votre compte MetaMask connecté: {connectedAccount}</p>
            <button onClick={participateLottery} disabled={isParticipating}>
              {isParticipating ? "Participation en cours..." : "Participer à la loterie"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        ) : (
          <div>
            <button onClick={connect}>Connectez-vous avec MetaMask</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
