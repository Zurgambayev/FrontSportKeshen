import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateTournament = () => {
    navigate('/create-tournament');
  };

  const handleFindTournaments = () => {
    navigate('/AllRooms');
  };

  return (
    <div className="home-container">
      <div className="button-container">
        <div className="create_tour">
          <button className="btn" onClick={handleCreateTournament}>Создать Турнир</button>
        </div>
        <div className="create_tour">
          <button className="btn" onClick={handleFindTournaments}>Найти</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
