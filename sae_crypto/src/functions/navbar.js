import React from 'react';
import '../css/navbar.css';

const Navbar = ({ setRedirection, connectedAccount, connect }) => {
  // Format Ethereum address for display (e.g., 0x1234...abcd)
  const formatAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect";
  };

  return (
    <nav className="navbar">
      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <button onClick={() => setRedirection(1)}>Home</button>
          </li>
          <li>
            <button onClick={() => setRedirection(2)}>Lottery</button>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        {/* Button that toggles between connect and displaying address */}
        <button className="profile-btn" onClick={!connectedAccount ? connect : null}>
          {formatAddress(connectedAccount)}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
