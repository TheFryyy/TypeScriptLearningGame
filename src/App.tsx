import React from 'react';
import './App.css';
import { Board } from './Game'

function App() {

  return (
    <div className="App">
      <Board size={3}/>
    </div>
  );
}

export default App;
