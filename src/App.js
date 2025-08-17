import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import GameLobby from './components/GameLobby';
import GameRoom from './components/GameRoom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>5x5 Board Game</h1>
        </header>
        
        <Routes>
          <Route path="/" element={<GameLobby />} />
          <Route path="/game/:roomId" element={<GameRoom />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;