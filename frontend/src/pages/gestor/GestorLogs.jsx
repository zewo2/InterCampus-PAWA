import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const normalizeStatus = (estado) => {
  const normalized = String(estado || '').trim().toLowerCase();
  if (['aceite', 'aceito'].includes(normalized)) {
    return 'Aceite';
  }
  if (['recusado', 'recusada', 'rejeitado', 'rejeitada'].includes(normalized)) {
    return 'Recusada';
  }
  if (['anulada', 'cancelada', 'anulado', 'cancelado'].includes(normalized)) {
    return 'Anulada';
  }
  return 'Pendente';
};

const badgeClass = (label) => {
  if (label === 'Aceite') {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  }
  if (label === 'Recusada') {
    return 'bg-red-100 text-red-700 border-red-200';
  }
  if (label === 'Anulada') {
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }
  return 'bg-amber-100 text-amber-700 border-amber-200';
};

const formatDateTime = (value) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('pt-PT');
};

const GestorLogs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [logs, setLogs] = useState([]);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  }, [navigate]);

  const fetchLogs = useCallback(async () => {
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

      const candidaturaLogs = (Array.isArray(candidaturasPayload.data) ? candidaturasPayload.data : []).map((candidatura) => ({
        id: `cand-${candidatura.id_candidatura}`,
        type: 'candidatura',
        title: `Candidatura ${normalizeStatus(candidatura.estado).toLowerCase()}`,
        description: `${candidatura.aluno_nome || 'Aluno'} candidatou-se a ${candidatura.oferta_titulo || 'oferta'}.`,
        statusLabel: normalizeStatus(candidatura.estado),
        timestamp: candidatura.data_submissao,
        meta: {
          candidato: candidatura.aluno_nome,
          empresa: candidatura.nome_empresa,
          oferta: candidatura.oferta_titulo,
          candidaturaId: candidatura.id_candidatura
        }
      }));

      const estagioLogs = (Array.isArray(estagiosPayload.data) ? estagiosPayload.data : []).map((estagio) => ({
        id: `est-${estagio.id_estagio}`,
        type: 'estagio',
        title: 'Estágio criado',
        description: `${estagio.aluno_nome || 'Aluno'} iniciou estágio em ${estagio.nome_empresa || 'empresa'}.`,
        statusLabel: 'Estágio',
        timestamp: estagio.data_inicio,
        meta: {
          estagioId: estagio.id_estagio,
          candidaturaId: estagio.id_candidatura,
          professor: estagio.professor_nome,
          orientador: estagio.orientador_nome
        }
      }));

      const combined = [...candidaturaLogs, ...estagioLogs].sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA;
      });

      setLogs(combined);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao carregar os logs administrativos.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    if (filter === 'all') {
      return logs;
    }
    return logs.filter((log) => log.type === filter);
  }, [logs, filter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Logs administrativos</p>
        <h1 className="text-3xl font-semibold text-gray-900">Histórico de ações</h1>
        <p className="text-gray-500">Consulta os eventos relevantes relacionados com candidaturas e estágios para auditoria rápida.</p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">{error}</div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Eventos registados</h2>
            <p className="text-sm text-gray-500">{filteredLogs.length} evento(s) visível(eis) de {logs.length} total.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('candidatura')}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'candidatura'
                  ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Candidaturas
            </button>
            <button
              onClick={() => setFilter('estagio')}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'estagio'
                  ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Estágios
            </button>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-8 py-16 text-center text-gray-500">
            Sem eventos para apresentar com o filtro selecionado.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-semibold text-gray-900">{log.title}</p>
                      <p className="text-sm text-gray-500">{log.description}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-xs text-gray-500 md:grid-cols-2">
                      {log.meta.candidato && (
                        <p><span className="font-semibold text-gray-600">Candidato:</span> {log.meta.candidato}</p>
                      )}
                      {log.meta.empresa && (
                        <p><span className="font-semibold text-gray-600">Empresa:</span> {log.meta.empresa}</p>
                      )}
                      {log.meta.professor && (
                        <p><span className="font-semibold text-gray-600">Professor:</span> {log.meta.professor}</p>
                      )}
                      {log.meta.orientador && (
                        <p><span className="font-semibold text-gray-600">Orientador:</span> {log.meta.orientador}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 lg:items-end">
                    <span className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold ${log.type === 'estagio' ? 'bg-sky-100 text-sky-700 border-sky-200' : badgeClass(log.statusLabel)}`}>
                      {log.type === 'estagio' ? 'Estágio' : log.statusLabel}
                    </span>
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                      <p><span className="font-semibold text-gray-500">Data:</span> {formatDateTime(log.timestamp)}</p>
                      {log.meta.candidaturaId && (
                        <p><span className="font-semibold text-gray-500">Candidatura:</span> #{log.meta.candidaturaId}</p>
                      )}
                      {log.meta.estagioId && (
                        <p><span className="font-semibold text-gray-500">Estágio:</span> #{log.meta.estagioId}</p>
                      )}
                    </div>
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

export default GestorLogs;
