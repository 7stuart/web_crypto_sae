import { useEffect, useState } from 'react';
import Web3 from 'web3';
import contractABI from '../LotteryABI.json'; // Assurez-vous que l'ABI est correctement importée

const Lottery = ({ connectedAccount }) => {
  const [owner, setOwner] = useState('');
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const contractAddress = "0x8D45Dd70309B0D23E4fC1cB31ED2ee78Fbc2ef6f"; // Remplace par l'adresse réelle de ton contrat

  useEffect(() => {
    const getOwnerAndParticipants = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);

        try {
          const accounts = await web3.eth.getAccounts(); // Vérifie si MetaMask est bien connecté
          if (accounts.length === 0) {
            console.log("Aucun compte MetaMask connecté");
            alert("Veuillez vous connecter à MetaMask");
            return;
          }

          // Vérifie si l'utilisateur connecté est le propriétaire
          const contract = new web3.eth.Contract(contractABI, contractAddress);
          const contractOwner = await contract.methods.owner().call();
          setOwner(contractOwner);

          if (accounts[0].toLowerCase() === contractOwner.toLowerCase()) {
            setIsOwner(true); // L'utilisateur est le propriétaire
          } else {
            setIsOwner(false); // L'utilisateur n'est pas le propriétaire
          }

          // Récupère la liste des participants
          const participantsList = await contract.methods.getParticipants().call();
          setParticipants(participantsList);
        } catch (error) {
          console.error("Erreur lors de la récupération des informations du contrat", error);
          setError("Erreur lors de la récupération des informations du contrat");
        }
      } else {
        console.log("MetaMask non trouvé");
        alert("Veuillez installer MetaMask pour continuer");
      }
    };

    getOwnerAndParticipants();
  }, [connectedAccount]);

  // Fonction pour tirer un gagnant
  const drawWinner = async () => {
    if (isOwner) {
      setLoading(true);
      setError('');

      try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Appeler la fonction drawWinner() du contrat
        await contract.methods.drawWinner().send({ from: owner });

        // Récupérer l'adresse du gagnant après le tirage
        const winnerAddress = await contract.methods.winner().call();
        setWinner(winnerAddress);

        // Récupérer les participants après le tirage
        const participantsList = await contract.methods.getParticipants().call();
        setParticipants(participantsList);

      } catch (error) {
        console.error("Erreur lors du tirage", error);
        setError("Erreur lors du tirage du gagnant");
      } finally {
        setLoading(false);
      }
    }
  };

  // Affichage
  if (!isOwner) {
    return (
      <div>
        <h1>Accès restreint</h1>
        <p>Vous devez être le propriétaire du contrat pour effectuer le tirage.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Loterie</h1>
      <p>Owner: {owner}</p>
      <p>Participants:</p>
      <ul>
        {participants.length === 0 ? (
          <li>Aucun participant pour le moment</li>
        ) : (
          participants.map((participant, index) => (
            <li key={index}>{participant}</li>
          ))
        )}
      </ul>

      <button onClick={drawWinner} disabled={loading}>
        {loading ? "Tirage en cours..." : "Effectuer le tirage"}
      </button>

      {winner && <p>Le gagnant est : {winner}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Lottery;
