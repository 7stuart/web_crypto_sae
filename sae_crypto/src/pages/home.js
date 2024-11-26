import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";

// ABI et adresse du contrat
const contractABI = [
  "function participate() external payable",
  "function getParticipants() external view returns (address[])",
  "function drawWinner() external",
  "function getBalance() external view returns (uint256)",
  "function ticketPrice() view returns (uint256)",
  "function winner() view returns (address)",
];
const contractAddress = "0x8D45Dd70309B0D23E4fC1cB31ED2ee78Fbc2ef6f";

const Home = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(null);
  const [balance, setBalance] = useState("0");
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);

  // Fonction pour se connecter à MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);

        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await tempProvider.getSigner();
        setProvider(tempProvider);

        const tempContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(tempContract);

        // Recharger la page après la connexion
        window.location.reload();
      } catch (error) {
        console.error("Erreur lors de la connexion à MetaMask :", error);
      }
    } else {
      alert("MetaMask non détecté. Veuillez l'installer.");
    }
  };

  // Charger les données du contrat
  const loadContractData = async (tempContract) => {
    try {
      const price = await tempContract.ticketPrice();
      setTicketPrice(ethers.formatUnits(price, "ether"));

      const balance = await tempContract.getBalance();
      setBalance(ethers.formatUnits(balance, "ether"));

      const participants = await tempContract.getParticipants();
      setParticipants(participants);

      const winner = await tempContract.winner();
      setWinner(winner);
    } catch (error) {
      console.error("Erreur lors du chargement des données du contrat :", error);
    }
  };

  // Fonction pour participer à la loterie
  const participateLottery = async () => {
    if (!contract || !ticketPrice) {
      alert("Contrat non initialisé ou ticketPrice indisponible.");
      return;
    }

    try {
      const tx = await contract.participate({
        value: ethers.parseUnits(ticketPrice, "ether"),
      });
      await tx.wait();
      alert("Participation réussie !");
      // Rafraîchir les données après la participation
      await loadContractData(contract);
    } catch (error) {
      console.error("Erreur lors de la participation :", error);
      alert(`Erreur lors de la participation : ${error.message}`);
    }
  };

  // Vérifier si un compte est déjà connecté au moment du montage du composant
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const checkConnection = async () => {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const tempProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await tempProvider.getSigner();
          setProvider(tempProvider);

          const tempContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(tempContract);

          // Charger les données du contrat après la connexion
          await loadContractData(tempContract);
        }
      };
      checkConnection();
    }
  }, []);

  return (
  <body>
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
            <button onClick={participateLottery} disabled={isParticipating}>
              {isParticipating ? "Participation en cours..." : "Participer à la loterie"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        ) : (
          <div>
            <p>Connectez vous à MetaMask pour participer</p>
          </div>
        )}
      </div>
          <div>
            <button onClick={connect}>Connectez-vous avec MetaMask</button>
          </div>
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-center text-primary mb-4">
            Bienvenue sur notre application de loterie décentralisée
          </h1>
          <p className="card-text">
            Cette application a été créée pour aider notre association à générer des revenus en
            organisant une loterie décentralisée. En achetant des billets, vous contribuez directement
            au financement des activités de l'association. Une partie des recettes est allouée aux
            projets associatifs, tandis que la transparence totale est assurée grâce à la technologie
            blockchain.
          </p>
          <p>
            Pour participer à la loterie, connectez-vous à MetaMask et achetez un ticket au prix de{" "}
            <strong>0.0001 ETH</strong>. Le tirage se fait automatiquement après chaque participation.
          </p>
          {account ? (
            <div className="mt-4">
              <p>
                <strong>Votre compte MetaMask connecté :</strong> {account}
              </p>
              <p>
                <strong>Prix du ticket :</strong> {ticketPrice || "Chargement..."} ETH
              </p>
              <p>
                <strong>Solde du contrat :</strong> {balance || "Chargement..."} ETH
              </p>
              <p>
                <strong>Participants ({participants.length}) :</strong>
              </p>
              <ul className="list-group">
                {participants.map((participant, index) => (
                  <li key={index} className="list-group-item">
                    {participant}
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                <strong>Gagnant actuel :</strong> {winner || "Aucun pour le moment"}
              </p>
              <button className="btn btn-primary mt-3" onClick={participateLottery}>
                Participer à la loterie
              </button>
            </div>
          ) : (
            <p>Connectez vous pour particper à la loterie</p>
          )}
        </div>
      </div>
    </div>
    </body>
  );
};

export default Home;
