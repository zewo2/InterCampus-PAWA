import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const STATUS_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Em curso' },
  { key: 'upcoming', label: 'Por iniciar' },
  { key: 'completed', label: 'Concluídos' },
  { key: 'cancelled', label: 'Cancelados' },
  { key: 'pendingEvaluation', label: 'Avaliação pendente' }
];

const ProfessorInternships = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [internships, setInternships] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    ativos: 0,
    porIniciar: 0,
    concluidos: 0,
    cancelados: 0,
    pendentesAvaliacao: 0
  });
  const [activeFilter, setActiveFilter] = useState('all');

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  }, [navigate]);

  const formatDate = useCallback((value) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-PT');
  }, []);

  const resolveStatus = useCallback((internship) => {
    const normalized = String(internship.estadoFinal || '').toLowerCase();
    if (normalized === 'concluido') {
      return { key: 'completed', label: 'Concluído', badge: 'bg-green-100 text-green-700' };
    }
    if (normalized === 'cancelado') {
      return { key: 'cancelled', label: 'Cancelado', badge: 'bg-red-100 text-red-700' };
    }

    const start = internship.dataInicio ? new Date(internship.dataInicio) : null;
    if (start && !Number.isNaN(start.getTime()) && start > new Date()) {
      return { key: 'upcoming', label: 'Por iniciar', badge: 'bg-blue-100 text-blue-700' };
    }

    return { key: 'active', label: 'Em curso', badge: 'bg-sky-100 text-sky-700' };
  }, []);

  const resolveEvaluation = useCallback((internship) => {
    if (internship.avaliacaoFinalPendente) {
      return { label: 'Avaliação final pendente', badge: 'bg-amber-100 text-amber-700' };
    }
    return { label: 'Avaliação final submetida', badge: 'bg-emerald-100 text-emerald-700' };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      handleUnauthorized();
      return;
    }

    const fetchInternships = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_URL}/professores/me/estagios`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          return;
        }

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || 'Não foi possível carregar os estágios orientados.');
        }

        setInternships(Array.isArray(payload?.data?.internships) ? payload.data.internships : []);
        setSummary({
          total: Number(payload?.data?.summary?.total) || 0,
          ativos: Number(payload?.data?.summary?.ativos) || 0,
          porIniciar: Number(payload?.data?.summary?.porIniciar) || 0,
          concluidos: Number(payload?.data?.summary?.concluidos) || 0,
          cancelados: Number(payload?.data?.summary?.cancelados) || 0,
          pendentesAvaliacao: Number(payload?.data?.summary?.pendentesAvaliacao) || 0
        });
      } catch (err) {
        setError(err.message || 'Ocorreu um erro ao carregar os estágios.');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [handleUnauthorized]);

  const filteredInternships = useMemo(() => {
    if (activeFilter === 'all') {
      return internships;
    }

    return internships.filter((internship) => {
      const statusMeta = resolveStatus(internship);
      if (activeFilter === 'pendingEvaluation') {
        return Boolean(internship.avaliacaoFinalPendente);
      }
      return statusMeta.key === activeFilter;
    });
  }, [activeFilter, internships, resolveStatus]);

  if (loading) {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Estágios</p>
          <h1 className="text-3xl font-semibold text-gray-900">Gestão de estágios</h1>
          <p className="text-gray-500">A carregar os dados dos estágios orientados...</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Estágios</p>
        <h1 className="text-3xl font-semibold text-gray-900">Gestão de estágios</h1>
        <p className="text-gray-500">Acompanha o estado, a avaliação e os contactos chave de cada estágio sob a tua orientação.</p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">{error}</div>
      )}

      <section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
            <p className="text-sm font-semibold text-blue-700">Total de estágios</p>
            <p className="mt-4 text-3xl font-bold text-blue-900">{summary.total}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
            <p className="text-sm font-semibold text-blue-700">Em curso</p>
            <p className="mt-4 text-3xl font-bold text-blue-900">{summary.ativos}</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-6 py-5">
            <p className="text-sm font-semibold text-sky-700">Por iniciar</p>
            <p className="mt-4 text-3xl font-bold text-sky-900">{summary.porIniciar}</p>
          </div>
          <div className="rounded-2xl border border-green-100 bg-green-50 px-6 py-5">
            <p className="text-sm font-semibold text-green-700">Concluídos</p>
            <p className="mt-4 text-3xl font-bold text-green-900">{summary.concluidos}</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5">
            <p className="text-sm font-semibold text-red-700">Cancelados</p>
            <p className="mt-4 text-3xl font-bold text-red-900">{summary.cancelados}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-6 py-5">
            <p className="text-sm font-semibold text-amber-700">Avaliação pendente</p>
            <p className="mt-4 text-3xl font-bold text-amber-900">{summary.pendentesAvaliacao}</p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Estágios orientados</h2>
            <p className="text-sm text-gray-500">Apresentamos {filteredInternships.length} de {internships.length} registos.</p>
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

        {filteredInternships.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <p className="text-lg font-semibold text-gray-700">Sem estágios para apresentar</p>
            <p className="mt-2 text-sm text-gray-500">Quando novos estágios forem atribuídos à tua orientação, surgem automaticamente nesta vista.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredInternships.map((internship) => {
              const statusMeta = resolveStatus(internship);
              const evaluationMeta = resolveEvaluation(internship);

              return (
                <div key={internship.idEstagio} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                  <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{internship.ofertaTitulo}</p>
                          <p className="text-sm font-medium text-blue-600">{internship.empresaNome}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badge}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
                        <div>
                          <p className="font-semibold text-gray-500">Aluno</p>
                          <p className="text-gray-700">{internship.alunoNome}</p>
                          <p className="text-xs text-gray-500">{internship.alunoEmail}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500">Período</p>
                          <p className="text-gray-700">{formatDate(internship.dataInicio)} &ndash; {formatDate(internship.dataFim)}</p>
                          <p className="text-xs text-gray-500">Candidatura: {internship.candidaturaEstado || '—'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500">Local e duração</p>
                          <p className="text-gray-700">{internship.ofertaLocal || '—'}</p>
                          <p className="text-xs text-gray-500">Duração prevista: {internship.ofertaDuracao ? `${internship.ofertaDuracao} semanas` : '—'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500">Orientador na empresa</p>
                          <p className="text-gray-700">{internship.orientadorNome}</p>
                          <p className="text-xs text-gray-500">{[internship.orientadorCargo, internship.orientadorEmail, internship.orientadorTelefone].filter(Boolean).join(' • ') || '—'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full max-w-xs space-y-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${evaluationMeta.badge}`}>
                        {evaluationMeta.label}
                      </span>
                      <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        <p><span className="font-semibold text-gray-500">Curso:</span> {internship.alunoCurso || '—'}</p>
                        <p><span className="font-semibold text-gray-500">Área interesse:</span> {internship.areaInteresse || '—'}</p>
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => navigate('/professor/alunos', { state: { focusEstagio: internship.idEstagio } })}
                          className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                        >
                          Ver aluno
                        </button>
                        <button
                          onClick={() => navigate('/professor/documentos', { state: { focusEstagio: internship.idEstagio } })}
                          className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                          Documentação
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

export default ProfessorInternships;
