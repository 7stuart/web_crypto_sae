import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const Home = ({ connectedAccount, contract }) => {
  const [ticketPrice, setTicketPrice] = useState(null);
  const [balance, setBalance] = useState("0");
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);

  const loadContractData = async () => {
    try {
      if (contract) {
        const price = await contract.ticketPrice();
        setTicketPrice(ethers.formatUnits(price, "ether"));

        const balance = await contract.getBalance();
        setBalance(ethers.formatUnits(balance, "ether"));

        const participants = await contract.getParticipants();
        setParticipants(participants);

        const winner = await contract.winner();
        setWinner(winner);
      }
    } catch (error) {
      console.error("Error loading contract data:", error);
    }
  };

  const participateLottery = async () => {
    if (!contract || !ticketPrice) {
      alert("Contract not initialized or ticketPrice unavailable.");
      return;
    }

    try {
      const tx = await contract.participate({
        value: ethers.parseUnits(ticketPrice, "ether"),
      });
      await tx.wait();
      alert("Participation successful!");
      await loadContractData();
    } catch (error) {
      console.error("Error during participation:", error);
      alert(`Error during participation: ${error.message}`);
    }
  };

  useEffect(() => {
    loadContractData();
  }, [contract]);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-center text-primary mb-4">
            Welcome to our decentralized lottery application
          </h1>
          <p className="card-text">
            This application was created to help our association generate revenue by organizing a
            decentralized lottery. By purchasing tickets, you directly contribute to funding the
            association's activities. Part of the proceeds are allocated to association projects, while
            total transparency is ensured through blockchain technology.
          </p>
          <p>
            To participate in the lottery, connect to MetaMask and buy a ticket for{" "}
            <strong>0.0001 ETH</strong>. The draw is made automatically after each participation.
          </p>
          {connectedAccount ? (
            <div>
              <p>
                <strong>Your connected MetaMask account:</strong> {connectedAccount}
              </p>
              <p>
                <strong>Ticket price:</strong> 0.001 ETH
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
                    {participant}
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                <strong>Current winner:</strong> {winner || "None at the moment"}
              </p>
              <button className="btn btn-primary mt-3" onClick={participateLottery}>
                Participate in the lottery
              </button>
            </div>
          ) : (
            <p style={{ color: 'red' }}>
              Please connect to MetaMask to participate in the lottery.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
