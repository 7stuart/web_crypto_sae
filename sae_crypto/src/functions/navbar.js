import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Navbar = ({ setRedirection, connectedAccount, connect }) => {
  // Format Ethereum address for display (e.g., 0x1234...abcd)
  const formatAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="d-flex align-items-center">
        {/* Logo de la navbar */}
        <a className="navbar-brand" href="#home" onClick={() => setRedirection(1)}>
          APEAJ
        </a>
        {/* Bouton du menu burger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <a className="nav-link" href="#home" onClick={() => setRedirection(1)}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#lottery" onClick={() => setRedirection(2)}>
              Lottery
            </a>
          </li>
        </ul>
      </div>
      {/* Bouton Connect toujours visible à droite */}
      <button
        className={`btn ${connectedAccount ? "btn-outline-success" : "btn-primary"} ms-auto`}
        onClick={!connectedAccount ? connect : null}
      >
        {formatAddress(connectedAccount)}
      </button>
    </nav>
  );
};

export default Navbar;
