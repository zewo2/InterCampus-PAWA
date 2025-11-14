import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navIconProps = {
  className: 'h-5 w-5'
};

const ProfessorLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      return null;
    }
  });

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem('user');
      try {
        setUser(stored ? JSON.parse(stored) : null);
      } catch (err) {
        setUser(null);
      }
    };

    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const navItems = useMemo(
    () => [
      {
        to: '/professor/dashboard',
        label: 'Dashboard',
        description: 'Visão geral',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v4h8V3h-8z" />
          </svg>
        )
      },
      {
        to: '/professor/alunos',
        label: 'Alunos',
        description: 'Orientações ativas',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.121 17.804A3 3 0 017.88 16h8.24a3 3 0 012.758 1.804L21 21H3l2.121-3.196zM12 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        )
      },
      {
        to: '/professor/estagios',
        label: 'Estágios',
        description: 'Colocações em curso',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c1.654 0 3-.672 3-1.5S13.654 5 12 5s-3 .672-3 1.5S10.346 8 12 8zm0 0v3m0 9c1.654 0 3-.672 3-1.5V13c0-.828-1.346-1.5-3-1.5s-3 .672-3 1.5v5.5c0 .828 1.346 1.5 3 1.5z" />
          </svg>
        )
      },
      {
        to: '/professor/documentos',
        label: 'Documentos',
        description: 'Relatórios e uploads',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16h8M8 12h8M9 8h6m5 4V8.414A2 2 0 0019.586 7L15 2.414A2 2 0 0013.586 2H6a2 2 0 00-2 2v16a2 2 0 002 2h9" />
          </svg>
        )
      }
    ],
    []
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 pt-8 pb-6 border-b border-gray-200">
          <span className="inline-flex items-center rounded-full bg-linear-to-r from-blue-600 to-sky-500 px-3 py-1 text-xs font-semibold text-white">Professor</span>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Portal de Estágios</h1>
          <p className="mt-2 text-sm text-gray-500">Acompanha alunos, estágios e documentação num só lugar.</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span className="text-blue-600">{item.icon}</span>
              <span className="flex flex-col">
                <span>{item.label}</span>
                <span className="text-xs font-normal text-gray-500">{item.description}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="px-6 pb-8 pt-6 border-t border-gray-200">
          <div className="rounded-xl bg-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">{user?.nome || 'Professor'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'Sessão ativa'}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
          >
            Voltar ao Site
          </button>
          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-600 transition-colors"
          >
            Terminar sessão
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <div className="px-10 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProfessorLayout;
