// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public owner; // Adresse du propriétaire du contrat
    address[] public participants; // Liste des participants
    address public winner; // Adresse du gagnant
    uint256 public ticketPrice = 0.02 ether; // Prix par ticket
    mapping(address => string) public participantNames; // Mapping de l'adresse au nom
    string public winnerName;

    // Modificateur pour restreindre l'accès au propriétaire
    modifier onlyOwner() {
        require(msg.sender == owner, "Access restricted to the owner");
        _;
    }

    // Constructeur qui définit le propriétaire comme le déployeur du contrat
    constructor() {
        owner = msg.sender;
    }

    // Fonction pour que les participants rejoignent la loterie
    function participate(string calldata name) external payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        require(bytes(name).length > 0, "Name cannot be empty");

        // On vérifie si l'adresse a déjà participé
        for (uint256 i = 0; i < participants.length; i++) {
            require(participants[i] != msg.sender, "You have already participated");
        }

        participants.push(msg.sender);
        participantNames[msg.sender] = name; // Stocker le nom du participant
    }

    // Fonction pour obtenir la liste des participants
    function getParticipants() external view returns (address[] memory) {
        return participants;
    }

    // Fonction pour tirer au sort le gagnant
    function drawWinner() external onlyOwner {
        require(participants.length > 0, "No participants in the lottery");
        uint256 randomIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, participants))
        ) % participants.length;

        winner = participants[randomIndex];
        winnerName = participantNames[winner]; // Enregistrer le nom du gagnant

        // Calculer la part du propriétaire (25%) et du gagnant (75%)
        uint256 contractBalance = address(this).balance;
        uint256 ownerShare = (contractBalance * 25) / 100;
        uint256 winnerShare = contractBalance - ownerShare;

        // Transférer les parts
        payable(owner).transfer(ownerShare);
        payable(winner).transfer(winnerShare);

        // Réinitialiser les participants pour le prochain tour
        delete participants;
    }


    // Fonction pour vérifier le solde du contrat
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getWinnerName() external view returns (string memory) {
        return winnerName;
    }

}
