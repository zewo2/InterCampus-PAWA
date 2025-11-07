import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between max-w-[1300px] mx-auto py-4 px-10 bg-white shadow-sm">
      {/* Menu principal */}
      <nav className="flex items-center gap-10">
        <a href="#" className="text-black text-[17px] font-medium hover:text-orange-600 transition-colors">
          Estágios
        </a>
        <a href="#" className="text-black text-[17px] font-medium hover:text-orange-600 transition-colors">
          Empresas
        </a>
        <a href="#" className="text-black text-[17px] font-medium hover:text-orange-600 transition-colors">
          Candidatos
        </a>
        <a href="#" className="text-black text-[17px] font-medium hover:text-orange-600 transition-colors">
          Recursos
        </a>
      </nav>

      {/* Botões de ação */}
      <div className="flex items-center gap-6">
        <a href="#" className="text-black font-bold text-[17px] hover:text-orange-600 transition-colors no-underline">
          Entrar
        </a>
        <a href="#" className="bg-blue-600 text-white font-semibold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-300"
>
  Cadastrar
</a>
      </div>
    </header>
  );
};

export default Header;
