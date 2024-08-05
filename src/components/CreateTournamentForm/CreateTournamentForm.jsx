// src/components/CreateTournamentForm/CreateTournamentForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './CreateTournamentForm.css';

const CreateTournamentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    gameTime: '',
    tournamentType: 'лига',
    tournamentAiOr: 'Без ИИ',
    formatPlay: '5x5',
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      console.log('Sending data:', formData);

      const response = await axios.post('http://localhost:4000/create-room', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Настройте обработку токенов аутентификации
        },
      });

      setMessage('Комната для турнира успешно создана');
      setError(null);
      console.log(response.data);
      // Обработка успешного создания комнаты (например, редирект или показ сообщения об успехе)
    } catch (error) {
      setError('Ошибка при создании комнаты для турнира');
      setMessage(null);
      console.error('Error submitting form:', error);
      // Обработка ошибок (например, показ сообщения об ошибке)
    }
  };

  return (
    <div className="create-tournament-container">
      <form className="create-tournament-form" onSubmit={handleSubmit}>
        <label>Название</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>Время</label>
        <input type="text" name="gameTime" value={formData.gameTime} onChange={handleChange} />

        <label>Формат турнира</label>
        <select name="tournamentType" value={formData.tournamentType} onChange={handleChange}>
          <option value="на выбывание">на выбывание</option>
          <option value="лига">лига</option>
        </select>

        <label>Типа команд</label>
        <select name="formatPlay" value={formData.formatPlay} onChange={handleChange}>
          <option value="5x5">5×5</option>
          <option value="6x6">6×6</option>
        </select>

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="tournamentAiOr"
              value="ИИ"
              checked={formData.tournamentAiOr === 'ИИ'}
              onChange={handleChange}
            />
            ИИ
          </label>
          <label>
            <input
              type="radio"
              name="tournamentAiOr"
              value="Без ИИ"
              checked={formData.tournamentAiOr === 'Без ИИ'}
              onChange={handleChange}
            />
            Без ИИ
          </label>
        </div>

        <button type="submit">Создать турнир</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateTournamentForm;
