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
const contractAddress = "0x1801d06891EeA95754995af26E8F7Be43F897838";

const Home = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(null);
  const [balance, setBalance] = useState("0");
  const [participants, setParticipants] = useState([]);
  const [participantNames, setParticipantNames] = useState({});
  const [winner, setWinner] = useState(null);
  const [userName, setUserName] = useState("");

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

      // Load participant names
      const names = {};
      for (const address of participantAddresses) {
        const name = await tempContract.getParticipantName(address);
        names[address] = name;
      }
      setParticipantNames(names);

      const winnerAddress = await tempContract.winner();
      setWinner(winnerAddress);

      // Set winner name if available
      if (winnerAddress && names[winnerAddress]) {
        setWinner(names[winnerAddress]);
      } else {
        setWinner("No winner yet");
      }
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
            This application was created to help our association generate revenue by
            organizing a decentralized lottery. By purchasing tickets, you directly
            contribute to funding the association's activities. Part of the proceeds
            is allocated to association projects, while complete transparency is
            ensured thanks to blockchain technology.
          </p>
          <p>
            To participate in the lottery, connect to MetaMask and purchase a ticket for{" "}
            <strong>0.0001 ETH</strong>. The draw is done automatically after each
            participation.
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
                <strong>Participants ({participants.length}):</strong>
              </p>
              <ul className="list-group">
                {participants.map((participant, index) => (
                  <li key={index} className="list-group-item">
                    {participantNames[participant] || participant}
                  </li>
                ))}
              </ul>
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
