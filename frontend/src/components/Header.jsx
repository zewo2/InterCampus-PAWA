import React from "react";

const Header = () => {
  return (
    <header className="header">
      {/* Menu principal */}
      <nav className="nav">
        <a href="#" className="nav-link">Estágios</a>
        <a href="#" className="nav-link">Empresas</a>
        <a href="#" className="nav-link">Candidatos</a>
        <a href="#" className="nav-link">Recursos</a>
      </nav>

      {/* Botões de ação */}
      <div className="action-buttons">
        <a href="#" className="login-button">
          Entrar
        </a>
        <a href="#" className="register-button">
          Registar
        </a>
      </div>
    </header>
  );
};

export default Header;
