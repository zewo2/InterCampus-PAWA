import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const normalizeStatus = (estado) => {
  const normalized = String(estado || '').trim().toLowerCase();

  if (['aceite', 'aceito'].includes(normalized)) {
    return 'accepted';
  }
  if (['recusado', 'recusada', 'rejeitado', 'rejeitada'].includes(normalized)) {
    return 'rejected';
  }
  if (['anulada', 'cancelada', 'anulado', 'cancelado'].includes(normalized)) {
    return 'cancelled';
  }
  return 'pending';
};

const resolveBadge = (estado) => {
  const normalized = normalizeStatus(estado);

  if (normalized === 'accepted') {
    return { label: 'Aceite', className: 'bg-green-100 text-green-700 border-green-200' };
  }
  if (normalized === 'rejected') {
    return { label: 'Recusada', className: 'bg-red-100 text-red-700 border-red-200' };
  }
  if (normalized === 'cancelled') {
    return { label: 'Anulada', className: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
  return { label: 'Pendente', className: 'bg-amber-100 text-amber-700 border-amber-200' };
};

const formatDate = (value) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-PT');
};

const GestorProcessos = () => {
  const navigate = useNavigate();
  const { reloadStats } = useOutletContext() || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [candidaturas, setCandidaturas] = useState([]);
  const [estagios, setEstagios] = useState([]);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  }, [navigate]);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [candidaturasResponse, estagiosResponse] = await Promise.all([
        fetch(`${API_URL}/candidaturas`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_URL}/estagios`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (candidaturasResponse.status === 401 || candidaturasResponse.status === 403 || estagiosResponse.status === 401 || estagiosResponse.status === 403) {
        handleUnauthorized();
        return;
      }

      const candidaturasPayload = await candidaturasResponse.json();
      const estagiosPayload = await estagiosResponse.json();

      if (!candidaturasResponse.ok) {
        throw new Error(candidaturasPayload.error || 'Não foi possível carregar as candidaturas.');
      }

      if (!estagiosResponse.ok) {
        throw new Error(estagiosPayload.error || 'Não foi possível carregar os estágios.');
      }

      setCandidaturas(Array.isArray(candidaturasPayload.data) ? candidaturasPayload.data : []);
      setEstagios(Array.isArray(estagiosPayload.data) ? estagiosPayload.data : []);

      if (typeof reloadStats === 'function') {
        reloadStats();
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao carregar os dados.');
      setCandidaturas([]);
      setEstagios([]);
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, reloadStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const candidaturaSummary = useMemo(() => {
    return candidaturas.reduce(
      (acc, candidatura) => {
        const normalized = normalizeStatus(candidatura.estado);
        acc.total += 1;
        if (normalized === 'accepted') {
          acc.accepted += 1;
        } else if (normalized === 'rejected') {
          acc.rejected += 1;
        } else if (normalized === 'cancelled') {
          acc.cancelled += 1;
        } else {
          acc.pending += 1;
        }
        return acc;
      },
      { total: 0, pending: 0, accepted: 0, rejected: 0, cancelled: 0 }
    );
  }, [candidaturas]);

  const estagioSummary = useMemo(() => {
    const now = new Date();
    return estagios.reduce(
      (acc, estagio) => {
        acc.total += 1;
        const start = estagio.data_inicio ? new Date(estagio.data_inicio) : null;
        const end = estagio.data_fim ? new Date(estagio.data_fim) : null;
        const estadoFinal = String(estagio.estado_final || '').toLowerCase();

        if (estadoFinal === 'concluido') {
          acc.completed += 1;
        } else if (estadoFinal === 'cancelado') {
          acc.cancelled += 1;
        } else if (start && !Number.isNaN(start.getTime()) && start > now) {
          acc.upcoming += 1;
        } else {
          acc.active += 1;
        }

        return acc;
      },
      { total: 0, active: 0, upcoming: 0, completed: 0, cancelled: 0 }
    );
  }, [estagios]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Acompanhamento</p>
        <h1 className="text-3xl font-semibold text-gray-900">Candidaturas e estágios</h1>
        <p className="text-gray-500">Centraliza a monitorização das candidaturas submetidas e dos estágios já em curso.</p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">{error}</div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm font-semibold text-blue-700">Candidaturas</p>
          <p className="mt-4 text-3xl font-bold text-blue-900">{candidaturaSummary.total}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-6 py-5">
          <p className="text-sm font-semibold text-amber-700">Pendentes</p>
          <p className="mt-4 text-3xl font-bold text-amber-900">{candidaturaSummary.pending}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-5">
          <p className="text-sm font-semibold text-emerald-700">Aceites</p>
          <p className="mt-4 text-3xl font-bold text-emerald-900">{candidaturaSummary.accepted}</p>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5">
          <p className="text-sm font-semibold text-red-700">Recusadas</p>
          <p className="mt-4 text-3xl font-bold text-red-900">{candidaturaSummary.rejected}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">Estágios ativos</p>
          <p className="mt-4 text-3xl font-bold text-gray-900">{estagioSummary.active}</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Candidaturas</h2>
          <p className="text-sm text-gray-500">{candidaturas.length} registo(s)</p>
        </div>

        {candidaturas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <p className="text-lg font-semibold text-gray-700">Sem candidaturas para apresentar.</p>
            <p className="mt-2 text-sm text-gray-500">Novas submissões e decisões ficarão visíveis assim que forem registadas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {candidaturas.map((candidatura) => {
              const badge = resolveBadge(candidatura.estado);
              return (
                <div key={candidatura.id_candidatura} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-lg font-semibold text-gray-900">{candidatura.aluno_nome}</p>
                        <p className="text-sm text-gray-500">{candidatura.aluno_email}</p>
                      </div>
                      <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
                        <div>
                          <p className="font-semibold text-gray-500">Oferta</p>
                          <p className="text-gray-700">{candidatura.oferta_titulo || '—'}</p>
                          <p className="text-xs text-gray-500">Empresa: {candidatura.nome_empresa || '—'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500">Submetida em</p>
                          <p className="text-gray-700">{formatDate(candidatura.data_submissao)}</p>
                          <p className="text-xs text-gray-500">Estado atual: {badge.label}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 lg:items-end">
                      <span className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                        <p><span className="font-semibold text-gray-500">Candidatura ID:</span> {candidatura.id_candidatura}</p>
                        <p><span className="font-semibold text-gray-500">Oferta ID:</span> {candidatura.id_oferta}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/estagios/${candidatura.id_oferta}`)}
                        className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
                      >
                        Ver oferta
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Estágios</h2>
          <p className="text-sm text-gray-500">{estagios.length} registo(s)</p>
        </div>

        {estagios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <p className="text-lg font-semibold text-gray-700">Ainda não existem estágios ativos.</p>
            <p className="mt-2 text-sm text-gray-500">Assim que uma candidatura aceite for convertida em estágio, verás os detalhes aqui.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {estagios.map((estagio) => (
              <div key={estagio.id_estagio} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-semibold text-gray-900">{estagio.titulo || 'Estágio'}</p>
                      <p className="text-sm text-blue-600">{estagio.nome_empresa}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
                      <div>
                        <p className="font-semibold text-gray-500">Aluno</p>
                        <p className="text-gray-700">{estagio.aluno_nome}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-500">Período</p>
                        <p className="text-gray-700">{formatDate(estagio.data_inicio)} &ndash; {formatDate(estagio.data_fim)}</p>
                        <p className="text-xs text-gray-500">Estado candidatura: {estagio.candidatura_estado || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-semibold text-sky-700">
                      #{estagio.id_estagio}
                    </span>
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                      <p><span className="font-semibold text-gray-500">Professor:</span> {estagio.professor_nome}</p>
                      <p><span className="font-semibold text-gray-500">Orientador empresa:</span> {estagio.orientador_nome}</p>
                      <p><span className="font-semibold text-gray-500">Local:</span> {estagio.local || estagio.titulo || '—'}</p>
                    </div>
                    <button
                      onClick={() => navigate('/gestor/orientadores', { state: { focusCandidatura: estagio.id_candidatura } })}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
                    >
                      Gerir orientação
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default GestorProcessos;
