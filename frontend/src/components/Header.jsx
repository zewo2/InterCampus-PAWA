import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../assets/brandlogo.png';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    const userName = user?.nome;
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info(`Sessão terminada. Até breve, ${userName || 'utilizador'}!`);
    setUser(null);
    setShowLogoutModal(false);
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-[1300px] mx-auto flex items-center justify-between py-3 px-4 md:px-10">
          <div className="flex items-center gap-4">
            <Link to="/" className="shrink-0">
              <img src={logo} alt="brandlogo" className="h-10 w-auto object-contain"/>
            </Link>
            {/* desktop nav */}
            <nav className="hidden md:flex items-center gap-8 ml-6">
              <Link to="/estagios" className="text-black text-[15px] font-medium hover:text-blue-700 transition-colors no-underline">Estágios</Link>
              <Link to="/empresas" className="text-black text-[15px] font-medium hover:text-blue-700 transition-colors no-underline">Empresas</Link>
              <Link to="/candidaturas" className="text-black text-[15px] font-medium hover:text-blue-700 transition-colors no-underline">Candidaturas</Link>
              <Link to="/contactos" className="text-black text-[15px] font-medium hover:text-blue-700 transition-colors no-underline">Contactos</Link>
            </nav>
          </div>

          {/* actions / mobile toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/perfil" className="text-black font-bold text-[15px] hover:text-blue-700 transition-colors no-underline">Perfil</Link>
                  <button onClick={handleLogoutClick} className="bg-blue-600 text-white font-semibold text-sm py-2 px-4 rounded-full shadow hover:bg-red-700 transition">Sair</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-black font-bold text-[15px] hover:text-blue-700 transition-colors no-underline">Entrar</Link>
                  <Link to="/register" className="bg-blue-600 text-white font-semibold text-sm py-2 px-4 rounded-full shadow hover:bg-blue-700 transition no-underline">Registar</Link>
                </>
              )}
            </div>

            {/* hamburger */}
            <button onClick={()=>setMenuOpen(s=>!s)} aria-label="Toggle menu" className="md:hidden p-2 rounded-md hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* mobile menu */}
        <div className={`${menuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-100`}>
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link to="/estagios" onClick={()=>setMenuOpen(false)} className="block text-gray-800 font-medium py-2">Estágios</Link>
            <Link to="/empresas" onClick={()=>setMenuOpen(false)} className="block text-gray-800 font-medium py-2">Empresas</Link>
            <Link to="/candidaturas" onClick={()=>setMenuOpen(false)} className="block text-gray-800 font-medium py-2">Candidaturas</Link>
            <Link to="/contactos" onClick={()=>setMenuOpen(false)} className="block text-gray-800 font-medium py-2">Contactos</Link>

            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <>
                  <Link to="/perfil" onClick={()=>setMenuOpen(false)} className="block text-gray-800 font-semibold py-2">Perfil</Link>
                  <button onClick={()=>{ setMenuOpen(false); handleLogoutClick(); }} className="w-full text-left bg-red-500 text-white px-4 py-2 rounded-md mt-2">Sair</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={()=>setMenuOpen(false)} className="block text-gray-800 font-semibold py-2">Entrar</Link>
                  <Link to="/register" onClick={()=>setMenuOpen(false)} className="block bg-blue-600 text-white text-center py-2 rounded-md mt-2">Registar</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Confirmação */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirmar Logout</h3>
            <p className="text-gray-600 mb-6">Tem a certeza que deseja terminar a sessão?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;