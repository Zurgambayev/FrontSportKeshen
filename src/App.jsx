// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import CreateTournamentForm from './components/CreateTournamentForm/CreateTournamentForm.jsx';
import PlayerCard from './components/PlayerCard/PlayerCard.jsx';
import { AuthProvider } from './context/AuthContext';
import AllRooms from './pages/AllRooms/allRooms.jsx'
import RoomDetail from './pages/RoomDetail/RoomDetail.jsx'
import MyComponent from './pages/joj/MyComponent.jsx'
import FormJoinRoom from './pages/FormJoinRoom/FormJoinRoom.jsx'
// import v0 from './pages/V0/'
import axios from 'axios'

axios.baseUrl = 'http://localhost:4000'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AllRooms" element={<AllRooms />} />
          <Route path="/room/:id" element={<RoomDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/create-tournament" element={<CreateTournamentForm />} />
          <Route path="/player-card/:playerId" element={<PlayerCard />} />
          <Route path="/formJoin" element={<FormJoinRoom />} />
          <Route path="/joj" element={<MyComponent />} />
          {/* <Route path='/v0' element={<v0/>}/>3 */}
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
