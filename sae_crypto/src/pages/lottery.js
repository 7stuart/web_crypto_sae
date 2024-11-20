import React, { useState } from 'react';

function Lottery() {
  const [number, setNumber] = useState(null); // État pour stocker le chiffre tiré

  const performDraw = () => {
    // Générer un chiffre aléatoire entre 1 et 10
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    setNumber(randomNumber); // Mettre à jour l'état avec ce chiffre
  };

  return (
    <div>
      <h1>Lottery Test</h1>
      <button onClick={performDraw}>Effectuer le tirage</button>
      {number && <p>Chiffre tiré : {number}</p>}
    </div>
  );
}

export default Lottery;
