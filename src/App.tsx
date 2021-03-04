import React from 'react';
import './App.css';
import Game from './Game'

function App() {

  return (
    <div className="App">
      <h1>Le but du jeu est de cliquer dans l'ordre sur les cases.</h1>
      <div className="center-div"> <Game/> </div>
    </div>
  );
}

export default App;
