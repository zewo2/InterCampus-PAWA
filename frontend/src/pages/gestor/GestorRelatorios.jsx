import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const percentage = (value, total) => {
  if (!total) {
    return 0;
  }
  return Math.round((Number(value || 0) / total) * 100);
};

const formatDate = (value) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-PT');
};

const GestorRelatorios = () => {
  const navigate = useNavigate();
  const { stats, loadingStats, statsError } = useOutletContext() || {};
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
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao preparar os relatórios.');
      setCandidaturas([]);
      setEstagios([]);
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const metrics = useMemo(() => {
    const totalCandidaturas = candidaturas.length;
    const accepted = candidaturas.filter((item) => ['aceite', 'aceito'].includes(String(item.estado || '').toLowerCase())).length;
    const rejected = candidaturas.filter((item) => ['recusado', 'recusada', 'rejeitado', 'rejeitada'].includes(String(item.estado || '').toLowerCase())).length;
    const pending = totalCandidaturas - accepted - rejected;
    const linkedInternships = new Set(estagios.map((item) => item.id_candidatura));

    const averageDuration = (() => {
      const durations = estagios
        .map((item) => {
          if (!item.data_inicio || !item.data_fim) {
            return null;
          }
          const start = new Date(item.data_inicio);
          const end = new Date(item.data_fim);
          const diff = end - start;
          if (Number.isNaN(diff) || diff <= 0) {
            return null;
          }
          return Math.round(diff / (1000 * 60 * 60 * 24));
        })
        .filter((value) => typeof value === 'number');

      if (!durations.length) {
        return 0;
      }
      return Math.round(durations.reduce((acc, value) => acc + value, 0) / durations.length);
    })();

    const lastCreatedInternship = estagios.reduce((latest, item) => {
      const current = item.data_inicio ? new Date(item.data_inicio).getTime() : 0;
      return current > latest ? current : latest;
    }, 0);

    return {
      totalCandidaturas,
      accepted,
      rejected,
      pending,
      conversionRate: percentage(accepted, totalCandidaturas),
      internshipConversion: percentage(linkedInternships.size, accepted || 1),
      averageDuration,
      lastInternship: lastCreatedInternship ? new Date(lastCreatedInternship).toLocaleDateString('pt-PT') : '—'
    };
  }, [candidaturas, estagios]);

  if (loading || loadingStats) {
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
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Relatórios</p>
        <h1 className="text-3xl font-semibold text-gray-900">Indicadores estratégicos</h1>
        <p className="text-gray-500">Consulta métricas combinadas de candidaturas, estágios e entidades para apoiar decisões do gestor.</p>
      </header>

      {(statsError || error) && (
        <div className="space-y-3">
          {statsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{statsError}</div>
          )}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
          )}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm font-semibold text-blue-700">Taxa de aprovação</p>
          <p className="mt-4 text-3xl font-bold text-blue-900">{metrics.conversionRate}%</p>
          <p className="mt-2 text-xs text-blue-700">{metrics.accepted} candidaturas aceites de {metrics.totalCandidaturas}.</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-5">
          <p className="text-sm font-semibold text-emerald-700">Candidaturas em estágio</p>
          <p className="mt-4 text-3xl font-bold text-emerald-900">{metrics.internshipConversion}%</p>
          <p className="mt-2 text-xs text-emerald-700">Candidaturas aceites convertidas em estágio.</p>
        </div>
        <div className="rounded-2xl border border-purple-100 bg-purple-50 px-6 py-5">
          <p className="text-sm font-semibold text-purple-700">Duração média</p>
          <p className="mt-4 text-3xl font-bold text-purple-900">{metrics.averageDuration || '—'} dias</p>
          <p className="mt-2 text-xs text-purple-700">Último estágio iniciado em {metrics.lastInternship}.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Distribuição de candidaturas</h2>
        <p className="mt-2 text-sm text-gray-500">Estados atuais das candidaturas submetidas.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Total</p>
            <p className="mt-3 text-2xl font-bold text-blue-900">{metrics.totalCandidaturas}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-4">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Aceites</p>
            <p className="mt-3 text-2xl font-bold text-emerald-900">{metrics.accepted}</p>
          </div>
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Recusadas</p>
            <p className="mt-3 text-2xl font-bold text-red-900">{metrics.rejected}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Pendentes</p>
            <p className="mt-3 text-2xl font-bold text-amber-900">{metrics.pending}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Resumo de entidades</h2>
        <p className="mt-2 text-sm text-gray-500">Dados cruzados com as estatísticas gerais da plataforma.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-700">Empresas validadas</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{Number(stats?.total_empresas || 0)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-700">Empresas pendentes</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{Number(stats?.empresas_pendentes || 0)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-700">Ofertas ativas</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{Number(stats?.total_ofertas || 0)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-700">Alunos inscritos</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{Number(stats?.total_alunos || 0)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Top empresas por ofertas</h2>
        <p className="mt-2 text-sm text-gray-500">Baseado nas candidaturas recentes.</p>
        <div className="mt-4 space-y-3 text-sm text-gray-600">
          {candidaturas.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-gray-500">
              Ainda não existem dados suficientes para gerar o ranking.
            </p>
          ) : (
            Object.entries(
              candidaturas.reduce((acc, candidatura) => {
                const key = candidatura.nome_empresa || 'Empresa não identificada';
                acc[key] = (acc[key] || 0) + 1;
                return acc;
              }, {})
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([empresa, total]) => (
                <div key={empresa} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div>
                    <p className="font-semibold text-gray-800">{empresa}</p>
                    <p className="text-xs text-gray-500">{total} candidatura(s)</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{percentage(total, candidaturas.length)}%</span>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
};

export default GestorRelatorios;
