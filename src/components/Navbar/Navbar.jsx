// src/components/Navbar/Navbar.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span className="navbar-title">SPORTKESHEM</span>
        <button className="navbar-button">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
        <div className="navbar-links">
          <Link to="/tournaments" className="navbar-link">ТУРНИРЫ</Link>
          <Link to="/community" className="navbar-link">СООБЩЕСТВО</Link>
          {isAuthenticated ? (
            <>
              <button className="navbar-link" onClick={handleLogout}>ВЫЙТИ</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-login">ВОЙТИ</Link>
              <Link to="/register" className="navbar-register">Зарегистрироваться</Link>
              <Link to="/create-tournament" className="navbar-register">Создать Турнир</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
