import React from "react";
import logo from '../assets/brandlogo.png';

const Header = () => {
  return (
    <header className="flex items-center justify-between max-w-[1300px] mx-auto py-4 px-10 bg-white shadow-sm">
      {/* Logo e Menu */}
      <div className="flex items-center gap-20">
        <div className="flex-shrink-0">
          <img src={logo} alt="brandlogo" className="h-12 w-auto object-contain"/>
        </div>
        
        <nav className="flex items-center gap-10">
          <a href="#" className="text-black text-[17px] font-medium hover:text-blue-700 transition-colors no-underline">
            Estágios
          </a>
          <a href="#" className="text-black text-[17px] font-medium hover:text-blue-700 transition-colors no-underline">
            Empresas
          </a>
          <a href="#" className="text-black text-[17px] font-medium hover:text-blue-700 transition-colors no-underline">
            Candidatos
          </a>
          <a href="#" className="text-black text-[17px] font-medium hover:text-blue-700 transition-colors no-underline">
            Recursos
          </a>
        </nav>
      </div>

      {/* Botões de ação à direita */}
      <div className="flex items-center gap-6">
        <a href="#" className="text-black font-bold text-[17px] hover:text-blue-700 transition-colors no-underline">
          Entrar
        </a>
        <a href="#" className="bg-blue-600 text-white font-semibold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 no-underline">
          Registar
        </a>
      </div>
    </header>
  );
};

export default Header;
