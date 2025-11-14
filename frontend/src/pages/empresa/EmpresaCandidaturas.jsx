import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const STATUS_FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'accepted', label: 'Aceites' },
  { key: 'rejected', label: 'Recusadas' }
];

const normalizeStatus = (estado) => {
  const normalized = String(estado || '').trim().toLowerCase();

  if (normalized === 'aceite' || normalized === 'aceito') {
    return 'accepted';
  }

  if (['recusado', 'recusada', 'rejeitado', 'rejeitada'].includes(normalized)) {
    return 'rejected';
  }

  if (['anulada', 'cancelada', 'anulado', 'cancelado'].includes(normalized)) {
    return 'pending';
  }

  if (normalized === 'em análise' || normalized === 'em analise') {
    return 'pending';
  }

  return 'pending';
};

const resolveStatusBadge = (estado) => {
  const normalized = normalizeStatus(estado);

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
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-PT');
};

const EmpresaCandidaturas = () => {
  const navigate = useNavigate();
  const outletData = useOutletContext() || {};
  const { empresa, loadingEmpresa } = outletData;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [candidaturas, setCandidaturas] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCandidaturas = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (!empresa?.id_empresa) {
      setCandidaturas([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/candidaturas`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        navigate('/login', { replace: true });
        return;
      }

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível carregar as candidaturas.');
      }

      setCandidaturas(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao carregar as candidaturas.');
    } finally {
      setLoading(false);
    }
  }, [empresa?.id_empresa, navigate]);

  useEffect(() => {
    if (!loadingEmpresa) {
      fetchCandidaturas();
    }
  }, [fetchCandidaturas, loadingEmpresa]);

  const summary = useMemo(() => {
    return candidaturas.reduce(
      (acc, candidatura) => {
        const status = normalizeStatus(candidatura.estado);
        if (status === 'accepted') {
          acc.accepted += 1;
        } else if (status === 'rejected') {
          acc.rejected += 1;
        } else {
          acc.pending += 1;
        }
        return acc;
      },
      { total: candidaturas.length, pending: 0, accepted: 0, rejected: 0 }
    );
  }, [candidaturas]);

  const filteredCandidaturas = useMemo(() => {
    if (activeFilter === 'all') {
      return candidaturas;
    }

    return candidaturas.filter((candidatura) => normalizeStatus(candidatura.estado) === activeFilter);
  }, [candidaturas, activeFilter]);

  const handleStatusChange = async (id, estado) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setUpdatingId(id);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/candidaturas/${id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível atualizar a candidatura.');
      }

      setSuccess(estado === 'Aceite' ? 'Candidatura aceite com sucesso.' : 'Candidatura atualizada para recusada.');
      await fetchCandidaturas();
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao atualizar a candidatura.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loadingEmpresa || loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Completa o perfil da empresa</h2>
        <p className="mt-2 text-sm text-gray-600">Depois de validares os dados da empresa poderás gerir candidaturas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Candidaturas</p>
        <h1 className="text-3xl font-semibold text-gray-900">Candidaturas recebidas</h1>
        <p className="text-gray-500">Avalia rapidamente o estado de cada candidatura e comunica a decisão aos candidatos.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm font-semibold text-blue-700">Total</p>
          <p className="mt-4 text-3xl font-bold text-blue-900">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-yellow-100 bg-yellow-50 px-6 py-5">
          <p className="text-sm font-semibold text-yellow-700">Pendentes</p>
          <p className="mt-4 text-3xl font-bold text-yellow-900">{summary.pending}</p>
        </div>
        <div className="rounded-2xl border border-green-100 bg-green-50 px-6 py-5">
          <p className="text-sm font-semibold text-green-700">Aceites</p>
          <p className="mt-4 text-3xl font-bold text-green-900">{summary.accepted}</p>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5">
          <p className="text-sm font-semibold text-red-700">Recusadas</p>
          <p className="mt-4 text-3xl font-bold text-red-900">{summary.rejected}</p>
        </div>
      </section>

      {(success || error) && (
        <div className="space-y-3">
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {success}
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Candidaturas filtradas</h2>
            <p className="text-sm text-gray-500">A mostrar {filteredCandidaturas.length} de {candidaturas.length} candidaturas.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {filteredCandidaturas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <p className="text-lg font-semibold text-gray-700">Nenhuma candidatura encontrada com os filtros atuais.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidaturas.map((candidatura) => {
              const badge = resolveStatusBadge(candidatura.estado);
              const normalized = normalizeStatus(candidatura.estado);
              const isAccepted = normalized === 'accepted';
              const isRejected = normalized === 'rejected';
              const disableAccept = updatingId === candidatura.id_candidatura || isAccepted;
              const disableCancel = updatingId === candidatura.id_candidatura || (!isAccepted && isRejected);

              return (
                <div key={candidatura.id_candidatura} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-lg font-semibold text-gray-900">{candidatura.aluno_nome}</p>
                        <p className="text-sm text-gray-500">{candidatura.aluno_email}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><span className="font-semibold text-gray-500">Oferta:</span> {candidatura.oferta_titulo || '—'}</p>
                        <p><span className="font-semibold text-gray-500">Submetida em:</span> {formatDate(candidatura.data_submissao)}</p>
                      </div>
                      {candidatura.mensagem && (
                        <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
                          <p className="font-semibold text-blue-800 mb-1">Mensagem do candidato</p>
                          <p>{candidatura.mensagem}</p>
                        </div>
                      )}
                    </div>

                      <div className="flex flex-col gap-3 lg:items-end">
                      <span className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                        <p><span className="font-semibold text-gray-500">Candidatura ID:</span> {candidatura.id_candidatura}</p>
                        <p><span className="font-semibold text-gray-500">Oferta ID:</span> {candidatura.id_oferta}</p>
                      </div>
                      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-end">
                        {!isAccepted && (
                          <button
                            onClick={() => handleStatusChange(candidatura.id_candidatura, 'Aceite')}
                            disabled={disableAccept}
                            className={`inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors whitespace-nowrap ${
                              disableAccept ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {updatingId === candidatura.id_candidatura ? 'A atualizar...' : 'Aceitar'}
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(candidatura.id_candidatura, isAccepted ? 'Anulada' : 'Recusado')}
                          disabled={disableCancel}
                          className={`inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors whitespace-nowrap ${
                            disableCancel ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                          }`}
                        >
                          {updatingId === candidatura.id_candidatura
                            ? 'A atualizar...'
                            : isAccepted
                              ? 'Anular'
                              : 'Recusar'}
                        </button>
                        <button
                          onClick={() => navigate(`/estagios/${candidatura.id_oferta}`)}
                          className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50 whitespace-nowrap"
                        >
                          Ver oferta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default EmpresaCandidaturas;
