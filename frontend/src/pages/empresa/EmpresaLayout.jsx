import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const navIconProps = {
  className: 'h-5 w-5'
};

const EmpresaLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      return null;
    }
  });
  const [empresa, setEmpresa] = useState(null);
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);
  const [empresaError, setEmpresaError] = useState('');

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  }, [navigate]);

  const loadEmpresa = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoadingEmpresa(true);
      setEmpresaError('');

      const [userResponse, empresasResponse] = await Promise.all([
        fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_URL}/empresas`)
      ]);

      if (userResponse.status === 401) {
        handleUnauthorized();
        return;
      }

      const userPayload = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(userPayload.error || 'Não foi possível carregar o utilizador autenticado.');
      }

      setUser(userPayload.user);
      localStorage.setItem('user', JSON.stringify(userPayload.user));

      const empresasPayload = await empresasResponse.json();

      if (!empresasResponse.ok) {
        throw new Error(empresasPayload.error || 'Não foi possível carregar os dados da empresa.');
      }

      const collection = Array.isArray(empresasPayload.data) ? empresasPayload.data : [];
      const matched = collection.find((item) => Number(item.id_utilizador) === Number(userPayload.user.id));

      setEmpresa(matched || null);

      if (!matched) {
        setEmpresaError('Ainda não existe um registo de empresa associado. Completa os dados no separador Perfil.');
      } else {
        setEmpresaError('');
      }
    } catch (err) {
      setEmpresa(null);
      setEmpresaError(err.message || 'Ocorreu um erro ao carregar a informação da empresa.');
    } finally {
      setLoadingEmpresa(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    loadEmpresa();
  }, [loadEmpresa]);

  useEffect(() => {
    const syncFromStorage = () => {
      const stored = localStorage.getItem('user');
      try {
        setUser(stored ? JSON.parse(stored) : null);
      } catch (err) {
        setUser(null);
      }
      loadEmpresa();
    };

    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener('storage', syncFromStorage);
    };
  }, [loadEmpresa]);

  const navItems = useMemo(
    () => [
      {
        to: '/empresa/dashboard',
        label: 'Dashboard',
        description: 'Visão geral',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 11h7V4H3v7zm0 9h7v-6H3v6zm11 0h7V10h-7v10zm0-17v4h7V3h-7z" />
          </svg>
        )
      },
      {
        to: '/empresa/perfil',
        label: 'Perfil',
        description: 'Dados e validação',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-9 8a5 5 0 0110 0v3H7v-3z" />
          </svg>
        )
      },
      {
        to: '/empresa/ofertas',
        label: 'Ofertas',
        description: 'Publica e gere',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c1.654 0 3-.672 3-1.5S13.654 5 12 5s-3 .672-3 1.5S10.346 8 12 8zm0 0v3m0 8c1.654 0 3-.672 3-1.5v-4.5c0-.828-1.346-1.5-3-1.5s-3 .672-3 1.5V17c0 .828 1.346 1.5 3 1.5z" />
          </svg>
        )
      },
      {
        to: '/empresa/candidaturas',
        label: 'Candidaturas',
        description: 'Avalia candidatos',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.121 17.804A3 3 0 017.88 16h8.24a3 3 0 012.758 1.804L21 21H3l2.121-3.196zM12 11a4 4 0 100-8 4 4 0 000 8z" />
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

  const outletContext = useMemo(
    () => ({
      user,
      empresa,
      reloadEmpresa: loadEmpresa,
      loadingEmpresa,
      empresaError
    }),
    [user, empresa, loadEmpresa, loadingEmpresa, empresaError]
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 pt-8 pb-6 border-b border-gray-200">
          <span className="inline-flex items-center rounded-full bg-linear-to-r from-blue-600 to-sky-500 px-3 py-1 text-xs font-semibold text-white">Empresa</span>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Portal de Estágios</h1>
          <p className="mt-2 text-sm text-gray-500">Acompanha oportunidades, candidaturas e o estado de validação da tua empresa.</p>
          {empresa && (
            <span
              className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                empresa.validada ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}
            >
              {empresa.validada ? 'Empresa validada' : 'A aguardar validação'}
            </span>
          )}
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
            <p className="text-sm font-semibold text-gray-800">{empresa?.nome_empresa || user?.nome || 'Empresa'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'Sessão ativa'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-600 transition-colors"
          >
            Terminar sessão
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <div className="px-10 py-10">
          <Outlet context={outletContext} />
        </div>
      </main>
    </div>
  );
};

export default EmpresaLayout;
