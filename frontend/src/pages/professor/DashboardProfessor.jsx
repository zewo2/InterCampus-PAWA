import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const DashboardProfessor = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      return null;
    }
  });
  const [profileLoading, setProfileLoading] = useState(!user);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    professor: { id: null, departamento: '' },
    summary: {
      totalEstagios: 0,
      alunosOrientados: 0,
      estagiosAtivos: 0,
      estagiosConcluidos: 0,
      avaliacoesPendentes: 0
    },
    recentEstagios: []
  });

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    setUser(null);
    setProfileLoading(false);
    setDashboardLoading(false);
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    const syncFromStorage = () => {
      const stored = localStorage.getItem('user');
      try {
        setUser(stored ? JSON.parse(stored) : null);
      } catch (err) {
        setUser(null);
      }
    };

    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  const loadDashboard = useCallback(async (tokenValue) => {
    try {
      setDashboardLoading(true);
      const response = await fetch(`${API_URL}/professores/me/dashboard`, {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível carregar a dashboard do professor.');
      }

      const summary = payload?.data?.summary || {};
      setDashboardData({
        professor: payload?.data?.professor || { id: null, departamento: '' },
        summary: {
          totalEstagios: Number(summary.totalEstagios) || 0,
          alunosOrientados: Number(summary.alunosOrientados) || 0,
          estagiosAtivos: Number(summary.estagiosAtivos) || 0,
          estagiosConcluidos: Number(summary.estagiosConcluidos) || 0,
          avaliacoesPendentes: Number(summary.avaliacoesPendentes) || 0
        },
        recentEstagios: Array.isArray(payload?.data?.recentEstagios) ? payload.data.recentEstagios : []
      });
    } catch (err) {
      setError(err.message || 'Não foi possível carregar a dashboard do professor.');
    } finally {
      setDashboardLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleUnauthorized();
      return;
    }

    const fetchUser = async () => {
      try {
        setError('');
        setProfileLoading(true);
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error('Não foi possível carregar as informações do professor.');
        }

        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user?.role?.toLowerCase() !== 'professor') {
          navigate('/', { replace: true });
          setDashboardLoading(false);
          return;
        }

        await loadDashboard(token);
      } catch (err) {
        setError(err.message || 'Ocorreu um erro ao carregar os dados.');
        setDashboardLoading(false);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUser();
  }, [navigate, loadDashboard, handleUnauthorized]);

  const formatDate = useCallback((value) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleDateString('pt-PT');
  }, []);

  const resolveStatus = useCallback((status) => {
    if (!status) {
      return { label: 'Em curso', className: 'bg-blue-100 text-blue-700' };
    }

    const normalized = String(status).toLowerCase();
    if (normalized === 'concluido') {
      return { label: 'Concluído', className: 'bg-green-100 text-green-700' };
    }
    if (normalized === 'cancelado') {
      return { label: 'Cancelado', className: 'bg-red-100 text-red-700' };
    }

    return { label: status, className: 'bg-gray-100 text-gray-700' };
  }, []);

  const quickActions = useMemo(
    () => [
      {
        title: 'Gerir candidaturas',
        description: 'Revê o progresso das submissões dos teus alunos orientados.',
        action: () => navigate('/candidaturas')
      },
      {
        title: 'Explorar estágios',
        description: 'Consulta novas oportunidades para recomendar aos alunos.',
        action: () => navigate('/estagios')
      },
      {
        title: 'Atualizar perfil',
        description: 'Mantém os teus dados de contacto e preferências em dia.',
        action: () => navigate('/perfil')
      }
    ],
    [navigate]
  );

  const summaryCards = useMemo(
    () => [
      {
        label: 'Alunos orientados',
        value: dashboardData.summary.alunosOrientados,
        helper:
          dashboardData.summary.estagiosConcluidos > 0
            ? `${dashboardData.summary.estagiosConcluidos} estágio(s) concluídos até ao momento.`
            : 'Ainda não existem estágios concluídos associados.'
      },
      {
        label: 'Estágios ativos',
        value: dashboardData.summary.estagiosAtivos,
        helper:
          dashboardData.summary.estagiosAtivos > 0
            ? 'Estágios atualmente em acompanhamento.'
            : 'Sem estágios ativos neste momento.'
      },
      {
        label: 'Avaliações pendentes',
        value: dashboardData.summary.avaliacoesPendentes,
        helper:
          dashboardData.summary.avaliacoesPendentes > 0
            ? 'Avaliações finais que ainda precisam de ser submetidas.'
            : 'Não existem avaliações finais pendentes.'
      }
    ],
    [dashboardData.summary]
  );

  const isLoading = profileLoading || dashboardLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-linear-to-r from-blue-700 via-blue-600 to-sky-500 px-8 py-12">
          <p className="text-sm uppercase tracking-wide text-blue-100 font-semibold">Dashboard Professor</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">
            Olá{user?.nome ? `, ${user.nome}` : ''}!
          </h1>
          {dashboardData.professor.departamento && (
            <p className="mt-3 inline-flex items-center rounded-full bg-blue-500/40 px-4 py-1 text-sm font-medium text-blue-50">
              {dashboardData.professor.departamento}
            </p>
          )}
          <p className="text-blue-100 mt-4 max-w-2xl">
            Consolida a tua visão sobre alunos, estágios e avaliações num único lugar. Os números abaixo são sincronizados com os dados do backend e atualizam-se assim que novas interações forem registadas.
          </p>
        </div>

        <div className="px-8 py-10">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {summaryCards.map((card) => (
              <div key={card.label} className="border border-gray-100 rounded-xl p-6 bg-gray-50">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{card.label}</p>
                <p className="text-4xl font-bold text-gray-900 mt-4">{card.value}</p>
                <p className="text-sm text-gray-500 mt-3">{card.helper}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações rápidas</h2>
              <p className="text-sm text-gray-500 mb-6">
                Liga-te rapidamente às secções existentes do portal para monitorizar candidaturas, consultar oportunidades ou atualizar o teu perfil.
              </p>
              <div className="space-y-4">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className="w-full text-left bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg px-5 py-4"
                  >
                    <p className="text-base font-semibold text-blue-700">{action.title}</p>
                    <p className="text-sm text-blue-500 mt-1">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos passos</h2>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="border-l-4 border-blue-500 pl-4">
                  Confirma se os teus alunos já submeteram relatórios e regista feedback assim que as integrações estiverem concluídas.
                </li>
                <li className="border-l-4 border-blue-500 pl-4">
                  Coordena-te com as empresas para validar o progresso dos estágios em acompanhamento.
                </li>
                <li className="border-l-4 border-blue-500 pl-4">
                  Atualiza os teus dados no perfil para garantir que os alunos conseguem contactar-te facilmente.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estágios acompanhados recentemente</h2>
            {dashboardData.recentEstagios.length > 0 ? (
              <ul className="space-y-4">
                {dashboardData.recentEstagios.map((estagio) => {
                  const statusMeta = resolveStatus(estagio.estadoFinal);
                  return (
                    <li key={estagio.idEstagio} className="border border-gray-100 rounded-lg px-5 py-4 bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{estagio.ofertaTitulo}</p>
                          <p className="text-sm text-blue-600 font-medium mt-1">{estagio.empresaNome}</p>
                          <p className="text-sm text-gray-600 mt-2">Aluno acompanhado: {estagio.alunoNome}</p>
                        </div>
                        <div className="text-sm text-right space-y-2">
                          <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 font-semibold ${statusMeta.className}`}>
                            {statusMeta.label}
                          </span>
                          <p className="text-gray-500">
                            {formatDate(estagio.dataInicio)} &ndash; {formatDate(estagio.dataFim)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">
                Assim que existirem estágios associados à tua orientação, a lista surge automaticamente aqui.
              </p>
            )}
          </div>

          <div className="mt-10 bg-gray-50 border border-dashed border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mais integrações em breve</h3>
            <p className="text-sm text-gray-600">
              À medida que forem disponibilizados novos endpoints (por exemplo, avaliação qualitativa ou relatórios intermédios), estes painéis podem ser expandidos sem alterar a estrutura atual.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfessor;
