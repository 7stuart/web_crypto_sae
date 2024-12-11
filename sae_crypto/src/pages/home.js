import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";

const contractABI = [
  "function participate(string name) external payable",
  "function getParticipants() external view returns (address[])",
  "function getParticipantName(address participant) external view returns (string)",
  "function drawWinner() external",
  "function getBalance() external view returns (uint256)",
  "function ticketPrice() view returns (uint256)",
  "function winner() view returns (address)",
];

const contractAddress = "0x89794cB714e01712AA3fDbfc8dd9F6F9cA704c4f";

const Home = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(null);
  const [balance, setBalance] = useState("0");
  const [participants, setParticipants] = useState([]);
  const [participantNames, setParticipantNames] = useState({});
  const [userName, setUserName] = useState("");
  const [winnerName, setWinnerName] = useState("");


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
        await loadContractData(tempContract);
      } catch (error) {
        console.error("Error while connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask not detected. Please install it.");
    }
  };

  const loadContractData = async (tempContract) => {
    try {
      const price = await tempContract.ticketPrice();
      setTicketPrice(ethers.formatUnits(price, "ether"));
  
      const balance = await tempContract.getBalance();
      setBalance(ethers.formatUnits(balance, "ether"));
  
      const participantAddresses = await tempContract.getParticipants();
      setParticipants(participantAddresses);
  
      const names = {};
      for (const address of participantAddresses) {
        const name = await tempContract.getParticipantName(address);
        names[address] = name;
      }
      setParticipantNames(names);
  
      // Récupérer le nom du gagnant
      const winnerName = await tempContract.getWinnerName();
      setWinnerName(winnerName);
  
    } catch (error) {
      console.error("Error while loading contract data:", error);
    }
  };
  

  const participateLottery = async () => {
    if (!contract || !ticketPrice || !userName) {
      alert("Please enter your name and ensure the contract is initialized.");
      return;
    }

    try {
      const tx = await contract.participate(userName, {
        value: ethers.parseUnits(ticketPrice, "ether"),
      });
      await tx.wait();
      alert("Participation successful!");
      await loadContractData(contract);
    } catch (error) {
      console.error("Error while participating:", error);
      alert(`Error: ${error.message}`);
    }
  };

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
          await loadContractData(tempContract);
        }
      };
      checkConnection();
    }
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-center text-primary mb-4">
            Welcome to our decentralized lottery application
          </h1>
          <p className="card-text">
            Participate in our decentralized lottery to support our association.
          </p>
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">
              Enter your name:
            </label>
            <input
              type="text"
              id="userName"
              className="form-control"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          {account ? (
            <>
              <p>
                <strong>Ticket price:</strong> {ticketPrice || "Loading..."} ETH
              </p>
              <p>
                <strong>Contract balance:</strong> {balance || "Loading..."} ETH
              </p>
              <p>
                <strong>Last winner:</strong> {winnerName || "No winner yet"}
              </p>
              <button className="btn btn-primary mt-3" onClick={participateLottery}>
                Participate in the lottery
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect to MetaMask
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;