
import './App.css';

import Navbar from './functions/navbar';
import { useState } from 'react';
import Home from './pages/home';
import Lottery from './pages/lottery';

function App() {
  const [redirection, setRedirection] = useState(1)

  return (
    <div className="App">
      {/* Render Interface component if redirection state is 1 */}
      {redirection === 1 && (<Home redirection={setRedirection} />)}
      {redirection === 2 && (<Lottery redirection={setRedirection} />)}
    </div>
  );
}

export default App;

