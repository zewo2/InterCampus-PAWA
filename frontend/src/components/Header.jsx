import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../assets/brandlogo.png';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    const userName = user?.nome;
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info(`Sessão terminada. Até breve, ${userName || 'utilizador'}!`);
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between max-w-[1300px] mx-auto py-4 px-10 bg-white shadow-sm">
      {/* Logo e Menu */}
      <div className="flex items-center gap-20">
        <div className="shrink-0">
          <Link to="/">
            <img src={logo} alt="brandlogo" className="h-12 w-auto object-contain"/>
          </Link>
        </div>
        
        <nav className="flex items-center gap-10">
          <Link to="/estagios" className="text-black text-[17px] font-medium hover:text-blue-700 transition-colors no-underline">
            Estágios
          </Link>
          <Link to="/empresas" className="text-black text-[17px] font-medium hover:text-blue-700 transition-colors no-underline">
            Empresas
          </Link>
          <Link to="/candidaturas" className="text-black text-[17px] font-medium hover:text-blue-700 transition-colors no-underline">
            Candidaturas
          </Link>

        </nav>
      </div>

      {/* Botões de ação à direita */}
      <div className="flex items-center gap-6">
        {user ? (
          <>
            {/* Logged in state */}
            <Link to="/perfil" className="text-black font-bold text-[17px] hover:text-blue-700 transition-colors no-underline">
              Perfil
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white font-semibold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-red-700 active:bg-red-800 transition-all duration-300"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            {/* Logged out state */}
            <Link to="/login" className="text-black font-bold text-[17px] hover:text-blue-700 transition-colors no-underline">
              Entrar
            </Link>
            <Link to="/register" className="bg-blue-600 text-white font-semibold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 no-underline">
              Registar
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
