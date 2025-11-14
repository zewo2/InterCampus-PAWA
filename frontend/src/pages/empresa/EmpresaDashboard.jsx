import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const normalizeApplicationStatus = (estado) => {
  const normalized = String(estado || '').trim().toLowerCase();

  if (normalized === 'aceite' || normalized === 'aceito') {
    return 'accepted';
  }

  if (['recusado', 'recusada', 'rejeitado', 'rejeitada'].includes(normalized)) {
    return 'rejected';
  }

  return 'pending';
};

const resolveApplicationBadge = (estado) => {
  const normalized = normalizeApplicationStatus(estado);

  if (normalized === 'accepted') {
    return { label: 'Aceite', className: 'bg-green-100 text-green-700 border-green-200' };
  }

  if (normalized === 'rejected') {
    return { label: 'Recusado', className: 'bg-red-100 text-red-700 border-red-200' };
  }

  return { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
};

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('pt-PT');
};

const EmpresaDashboard = () => {
  const navigate = useNavigate();
  const outletData = useOutletContext() || {};
  const { user, empresa, loadingEmpresa, empresaError } = outletData;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);

  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (!empresa?.id_empresa) {
      setOffers([]);
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [offersResponse, candidaturasResponse] = await Promise.all([
        fetch(`${API_URL}/empresas/${empresa.id_empresa}/ofertas`),
        fetch(`${API_URL}/candidaturas`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (candidaturasResponse.status === 401) {
        navigate('/login', { replace: true });
        return;
      }

      const offersPayload = await offersResponse.json();
      const candidaturasPayload = await candidaturasResponse.json();

      if (!offersResponse.ok) {
        throw new Error(offersPayload.error || 'Não foi possível carregar as ofertas.');
      }

      if (!candidaturasResponse.ok) {
        throw new Error(candidaturasPayload.error || 'Não foi possível carregar as candidaturas.');
      }

      setOffers(Array.isArray(offersPayload.data) ? offersPayload.data : []);
      setApplications(Array.isArray(candidaturasPayload.data) ? candidaturasPayload.data : []);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao carregar a dashboard.');
    } finally {
      setLoading(false);
    }
  }, [empresa?.id_empresa, navigate]);

  useEffect(() => {
    if (!loadingEmpresa) {
      fetchDashboard();
    }
  }, [fetchDashboard, loadingEmpresa]);

  const summary = useMemo(() => {
    const counters = applications.reduce(
      (acc, item) => {
        const status = normalizeApplicationStatus(item.estado);
        if (status === 'accepted') {
          acc.accepted += 1;
        } else if (status === 'rejected') {
          acc.rejected += 1;
        } else {
          acc.pending += 1;
        }
        return acc;
      },
      { pending: 0, accepted: 0, rejected: 0 }
    );

    const totalCandidaturas = applications.length;
    const totalOffers = offers.length;
    const candidaturasPorOferta = offers.reduce((acc, offer) => acc + Number(offer.total_candidaturas || 0), 0);

    return {
      totalOffers,
      totalCandidaturas,
      candidaturasPorOferta,
      pending: counters.pending,
      accepted: counters.accepted,
      rejected: counters.rejected,
      validated: Boolean(empresa?.validada)
    };
  }, [applications, offers, empresa?.validada]);

  const recentApplications = useMemo(() => {
    const sorted = [...applications];
    sorted.sort((a, b) => {
      const dateA = a.data_submissao ? new Date(a.data_submissao).getTime() : 0;
      const dateB = b.data_submissao ? new Date(b.data_submissao).getTime() : 0;
      return dateB - dateA;
    });
    return sorted.slice(0, 5);
  }, [applications]);

  const latestOffers = useMemo(() => {
    const sorted = [...offers];
    sorted.sort((a, b) => {
      const dateA = a.data_publicacao ? new Date(a.data_publicacao).getTime() : 0;
      const dateB = b.data_publicacao ? new Date(b.data_publicacao).getTime() : 0;
      return dateB - dateA;
    });
    return sorted.slice(0, 3);
  }, [offers]);

  if (loadingEmpresa || loading) {
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

  if (!empresa) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Completa o perfil da empresa</h2>
        <p className="mt-2 text-sm text-gray-600">
          Para aceder à dashboard, preenche primeiro os dados essenciais da empresa.
        </p>
        <button
          onClick={() => navigate('/empresa/perfil')}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Ir para o Perfil
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-linear-to-r from-blue-700 via-blue-600 to-sky-500 px-8 py-12">
          <p className="text-sm uppercase tracking-wide text-blue-100 font-semibold">Dashboard Empresa</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">
            Olá{user?.nome ? `, ${user.nome}` : ''}!
          </h1>
          {empresa?.nome_empresa && (
            <p className="mt-3 inline-flex items-center rounded-full bg-blue-500/40 px-4 py-1 text-sm font-medium text-blue-50">
              {empresa.nome_empresa}
            </p>
          )}
          <p className="text-blue-100 mt-4 max-w-2xl">
            Acompanha o estado das tuas ofertas, monitoriza candidaturas recebidas e mantém a equipa alinhada sobre o processo de seleção.
          </p>
        </div>

        <div className="px-8 py-10 space-y-10">
          {(empresaError || error) && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">
              {empresaError || error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border border-gray-100 rounded-xl p-6 bg-gray-50">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Ofertas publicadas</p>
              <p className="text-4xl font-bold text-gray-900 mt-4">{summary.totalOffers}</p>
              <p className="text-sm text-gray-500 mt-3">Número total de ofertas ativas e históricas publicadas pela tua empresa.</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-6 bg-gray-50">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Candidaturas totais</p>
              <p className="text-4xl font-bold text-gray-900 mt-4">{summary.totalCandidaturas}</p>
              <p className="text-sm text-gray-500 mt-3">Inclui candidaturas pendentes, aceites e recusadas.</p>
            </div>
            <div className="border border-yellow-100 rounded-xl p-6 bg-yellow-50">
              <p className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">Pendentes</p>
              <p className="text-4xl font-bold text-yellow-900 mt-4">{summary.pending}</p>
              <p className="text-sm text-yellow-700 mt-3">Candidaturas a aguardar decisão.</p>
            </div>
            <div className="border border-green-100 rounded-xl p-6 bg-green-50">
              <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Aceites</p>
              <p className="text-4xl font-bold text-green-900 mt-4">{summary.accepted}</p>
              <p className="text-sm text-green-700 mt-3">Inclui candidaturas com decisão positiva.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações rápidas</h2>
              <p className="text-sm text-gray-500 mb-6">
                Acede rapidamente aos fluxos principais para publicar ofertas, rever candidaturas e atualizar o perfil da empresa.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/empresa/ofertas')}
                  className="w-full text-left bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg px-5 py-4"
                >
                  <p className="text-base font-semibold text-blue-700">Publicar nova oferta</p>
                  <p className="text-sm text-blue-500 mt-1">Cria uma oportunidade em menos de cinco minutos.</p>
                </button>
                <button
                  onClick={() => navigate('/empresa/candidaturas')}
                  className="w-full text-left bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg px-5 py-4"
                >
                  <p className="text-base font-semibold text-blue-700">Analisar candidaturas</p>
                  <p className="text-sm text-blue-500 mt-1">Mantém o estado das candidaturas sempre atualizado.</p>
                </button>
                <button
                  onClick={() => navigate('/empresa/perfil')}
                  className="w-full text-left bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg px-5 py-4"
                >
                  <p className="text-base font-semibold text-blue-700">Atualizar dados da empresa</p>
                  <p className="text-sm text-blue-500 mt-1">Garante que a equipa gestora tem toda a informação necessária.</p>
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ofertas recentes</h2>
              {latestOffers.length === 0 ? (
                <p className="text-sm text-gray-500">Ainda não existem ofertas publicadas. Começa por criar a primeira oferta.</p>
              ) : (
                <ul className="space-y-4 text-sm text-gray-600">
                  {latestOffers.map((offer) => (
                    <li key={offer.id_oferta} className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-base font-semibold text-gray-900">{offer.titulo}</p>
                          <span className="text-xs text-gray-500">{formatDate(offer.data_publicacao)}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Local: <span className="text-gray-700">{offer.local || 'Não definido'}</span> &middot; Duração: <span className="text-gray-700">{offer.duracao ? `${offer.duracao} semana(s)` : '—'}</span>
                        </p>
                        <p className="text-xs text-blue-600 font-semibold">
                          {Number(offer.total_candidaturas || 0)} candidatura(s) recebidas
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidaturas mais recentes</h2>
            {recentApplications.length === 0 ? (
              <p className="text-sm text-gray-500">Ainda não existem candidaturas associadas às tuas ofertas.</p>
            ) : (
              <ul className="space-y-4">
                {recentApplications.map((candidatura) => {
                  const badge = resolveApplicationBadge(candidatura.estado);
                  return (
                    <li key={candidatura.id_candidatura} className="border border-gray-100 rounded-xl bg-gray-50 px-5 py-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-gray-900">{candidatura.aluno_nome}</p>
                          <p className="text-xs text-gray-500">{candidatura.aluno_email}</p>
                          <p className="text-sm text-blue-600 font-medium mt-2">{candidatura.oferta_titulo || 'Oferta não identificada'}</p>
                          <p className="text-xs text-gray-500 mt-1">Submetida em {formatDate(candidatura.data_submissao)}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <span className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${badge.className}`}>
                            {badge.label}
                          </span>
                          <button
                            onClick={() => navigate('/empresa/candidaturas', { state: { focusId: candidatura.id_candidatura } })}
                            className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                          >
                            Abrir candidatura
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="bg-gray-50 border border-dashed border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Validação da empresa</h3>
            <p className="text-sm text-gray-600">
              {summary.validated
                ? 'A tua empresa encontra-se validada. Mantém os dados atualizados para facilitar a comunicação com a equipa gestora.'
                : 'Aguarda a confirmação por parte da equipa gestora. Caso seja necessário atualizar informação, utiliza o separador Perfil.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpresaDashboard;
