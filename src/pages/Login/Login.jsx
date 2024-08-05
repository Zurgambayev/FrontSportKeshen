import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/auth/login', { email, password });
      login(response.data.token, response.data.user._id);
      navigate('/'); // Редирект на защищенную страницу после входа
    } catch (err) {
      console.error('Ошибка входа', err);
      alert('Ошибка входа, неверные учетные данные');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Добро пожаловать</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Логин"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
