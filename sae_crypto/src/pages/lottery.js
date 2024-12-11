import { useEffect, useState } from "react";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import contractABI from "../LotteryABI.json";

const Lottery = ({ connectedAccount }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [owner, setOwner] = useState("");
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState("");
  const [contractBalance, setContractBalance] = useState("0");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metaMaskConnected, setMetaMaskConnected] = useState(true);

  const contractAddress = "0x77500BC5e21f97D47686Fe0D96E72BF75de41130";

  useEffect(() => {
    const getOwnerAndParticipants = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);

        try {
          const accounts = await web3.eth.getAccounts();
          if (accounts.length === 0) {
            setMetaMaskConnected(false);
            return;
          } else {
            setMetaMaskConnected(true);
          }

          const contract = new web3.eth.Contract(contractABI, contractAddress);

          const contractOwner = await contract.methods.owner().call();
          setOwner(contractOwner);
          setIsOwner(accounts[0].toLowerCase() === contractOwner.toLowerCase());

          if (accounts[0].toLowerCase() === contractOwner.toLowerCase()) {
            const participantAddresses = await contract.methods.getParticipants().call();

            // Fetch participant names
            const participantNames = await Promise.all(
              participantAddresses.map(async (address) => {
                const name = await contract.methods.participantNames(address).call();
                return name || "Unknown";
              })
            );

            setParticipants(participantNames);

            const balance = await web3.eth.getBalance(contractAddress);
            setContractBalance(web3.utils.fromWei(balance, "ether"));
          }
        } catch (error) {
          console.error("Error retrieving contract data", error);
          setError("Error retrieving contract data");
        }
      } else {
        setMetaMaskConnected(false);
      }
    };

    getOwnerAndParticipants();
  }, [connectedAccount]);

  const drawWinner = async () => {
    if (isOwner) {
      setLoading(true);
      setError("");

      try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        await contract.methods.drawWinner().send({ from: owner });

        const winnerAddress = await contract.methods.winner().call();
        const winnerName = await contract.methods.participantNames(winnerAddress).call();
        setWinner(winnerName || winnerAddress);

        const participantAddresses = await contract.methods.getParticipants().call();
        const participantNames = await Promise.all(
          participantAddresses.map(async (address) => {
            const name = await contract.methods.participantNames(address).call();
            return name || "Unknown";
          })
        );

        setParticipants(participantNames);

        const balance = await web3.eth.getBalance(contractAddress);
        setContractBalance(web3.utils.fromWei(balance, "ether"));
      } catch (error) {
        console.error("Error during drawing", error);
        setError("Error drawing the winner");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };

    checkConnection();

    window.ethereum.on("accountsChanged", (accounts) => {
      setAccount(accounts[0] || null);
    });

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  if (!metaMaskConnected) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <strong>MetaMask not connected:</strong> Please install MetaMask or connect your wallet.
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <strong>Access Denied:</strong> This page is reserved for the contract owner.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-center text-primary mb-4">Lottery</h1>
          <p>
            <strong>Contract Balance:</strong> {contractBalance} ETH
          </p>
          <p>
            <strong>Number of Participants:</strong> {participants.length}
          </p>
          <h5>Participants:</h5>
          <ul className="list-group mb-4">
            {participants.length === 0 ? (
              <li className="list-group-item text-muted">No participants yet</li>
            ) : (
              participants.map((name, index) => (
                <li key={index} className="list-group-item">
                  {name}
                </li>
              ))
            )}
          </ul>
          <button
            className="btn btn-primary"
            onClick={drawWinner}
            disabled={loading}
          >
            {loading ? "Drawing..." : "Draw Winner"}
          </button>
          {winner && (
            <p className="mt-3 text-success">
              <strong>Winner:</strong> {winner}
            </p>
          )}
          {error && (
            <p className="mt-3 text-danger">
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lottery;