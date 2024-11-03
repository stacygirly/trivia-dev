import React from 'react';
import './Header.css'; // Importing Header.css from the same folder

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Trivia Game</h1>
      <nav className="header-nav">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;