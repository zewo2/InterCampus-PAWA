import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const navIconProps = {
  className: 'h-5 w-5'
};

const defaultStats = {
  total_empresas: 0,
  empresas_pendentes: 0,
  total_candidaturas: 0,
  candidaturas_pendentes: 0,
  total_estagios: 0,
  total_ofertas: 0,
  total_alunos: 0
};

const GestorLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      return null;
    }
  });
  const [stats, setStats] = useState(defaultStats);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  }, [navigate]);

  const loadStats = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoadingStats(true);
      setStatsError('');

      const [userResponse, statsResponse] = await Promise.all([
        fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_URL}/gestores/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (userResponse.status === 401 || statsResponse.status === 401 || statsResponse.status === 403) {
        handleUnauthorized();
        return;
      }

      const userPayload = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userPayload.error || 'Não foi possível validar a sessão.');
      }
      setUser(userPayload.user);
      localStorage.setItem('user', JSON.stringify(userPayload.user));

      const statsPayload = await statsResponse.json();
      if (!statsResponse.ok) {
        throw new Error(statsPayload.error || 'Não foi possível carregar as estatísticas do gestor.');
      }

      setStats({ ...defaultStats, ...(statsPayload.data || {}) });
    } catch (err) {
      setStats(defaultStats);
      setStatsError(err.message || 'Ocorreu um erro ao carregar as estatísticas.');
    } finally {
      setLoadingStats(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem('user');
      try {
        setUser(stored ? JSON.parse(stored) : null);
      } catch (err) {
        setUser(null);
      }
      loadStats();
    };

    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
    };
  }, [loadStats]);

  const navItems = useMemo(() => {
    const pendingCompanies = Number(stats.empresas_pendentes || 0);
    const pendingApplications = Number(stats.candidaturas_pendentes || 0);

    return [
      {
        to: '/gestor/dashboard',
        label: 'Dashboard',
        description: 'Resumo operacional',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 13h7V4H4v9zm0 7h7v-5H4v5zm9 0h7V11h-7v9zm0-16v4h7V4h-7z" />
          </svg>
        )
      },
      {
        to: '/gestor/empresas',
        label: 'Empresas',
        description: pendingCompanies > 0 ? `${pendingCompanies} por validar` : 'Gestão de validação',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20V10a1 1 0 011-1h4a1 1 0 011 1v10m2 0h2a2 2 0 002-2v-7a2 2 0 00-1-1.732l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 11v7a2 2 0 002 2h2" />
          </svg>
        )
      },
      {
        to: '/gestor/processos',
        label: 'Processos',
        description: pendingApplications > 0 ? `${pendingApplications} candidatura(s)` : 'Candidaturas e estágios',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6M9 8h6m2 9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2z" />
          </svg>
        )
      },
      {
        to: '/gestor/orientadores',
        label: 'Orientadores',
        description: 'Atribuição e acompanhamento',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-3 11h-2a4 4 0 00-4 4v0h10v0a4 4 0 00-4-4z" />
          </svg>
        )
      },
      {
        to: '/gestor/relatorios',
        label: 'Relatórios',
        description: 'Indicadores chave',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 6H5a2 2 0 00-2 2v10a2 2 0 002 2h6m8-12h-6m6 4h-6m6 4h-6" />
          </svg>
        )
      },
      {
        to: '/gestor/logs',
        label: 'Logs',
        description: 'Histórico administrativo',
        icon: (
          <svg {...navIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    ];
  }, [stats.empresas_pendentes, stats.candidaturas_pendentes]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/', { replace: true });
  };

  const outletContext = useMemo(
    () => ({
      user,
      stats,
      reloadStats: loadStats,
      loadingStats,
      statsError
    }),
    [user, stats, loadStats, loadingStats, statsError]
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 pt-8 pb-6 border-b border-gray-200">
          <span className="inline-flex items-center rounded-full bg-linear-to-r from-blue-600 to-sky-500 px-3 py-1 text-xs font-semibold text-white">Gestor</span>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Centro de Operações</h1>
          <p className="mt-2 text-sm text-gray-500">Coordena empresas, candidaturas e estágios num painel integrado.</p>
          {stats.empresas_pendentes > 0 && (
            <span className="mt-4 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {stats.empresas_pendentes} empresa(s) por validar
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
            <p className="text-sm font-semibold text-gray-800">{user?.nome || 'Gestor'}</p>
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

export default GestorLayout;
