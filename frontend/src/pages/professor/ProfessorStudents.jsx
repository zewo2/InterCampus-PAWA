import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const ProfessorStudents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      handleUnauthorized();
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_URL}/professores/me/alunos`, {
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
          throw new Error(payload.error || 'Não foi possível carregar os alunos orientados.');
        }

        setStudents(Array.isArray(payload.data) ? payload.data : []);
      } catch (err) {
        setError(err.message || 'Ocorreu um erro ao carregar a lista de alunos.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [handleUnauthorized]);

  const summary = useMemo(() => {
    const total = students.length;
    const active = students.filter((item) => !item.estadoFinal).length;
    const completed = students.filter((item) => String(item.estadoFinal || '').toLowerCase() === 'concluido').length;
    const cancelled = students.filter((item) => String(item.estadoFinal || '').toLowerCase() === 'cancelado').length;

    return {
      total,
      active,
      completed,
      cancelled
    };
  }, [students]);

  const resolveStatus = useCallback((student) => {
    const status = String(student.estadoFinal || '').toLowerCase();

    if (!status) {
      return { label: 'Em curso', badge: 'bg-blue-100 text-blue-700' };
    }

    if (status === 'concluido') {
      return { label: 'Concluído', badge: 'bg-green-100 text-green-700' };
    }

    if (status === 'cancelado') {
      return { label: 'Cancelado', badge: 'bg-red-100 text-red-700' };
    }

    return { label: student.estadoFinal, badge: 'bg-gray-100 text-gray-700' };
  }, []);

  const formatDate = useCallback((value) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-PT');
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Alunos orientados</p>
          <h1 className="text-3xl font-semibold text-gray-900">Acompanhamento em curso</h1>
          <p className="text-gray-500">A carregar dados dos teus alunos...</p>
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
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Alunos orientados</p>
        <h1 className="text-3xl font-semibold text-gray-900">Acompanhamento em curso</h1>
        <p className="text-gray-500">Monitoriza rapidamente os estágios sob a tua orientação, com estado, empresa e progresso de cada aluno.</p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">{error}</div>
      )}

      <section>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
            <p className="text-sm font-semibold text-blue-700">Total de alunos</p>
            <p className="mt-4 text-3xl font-bold text-blue-900">{summary.total}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
            <p className="text-sm font-semibold text-blue-700">Estágios ativos</p>
            <p className="mt-4 text-3xl font-bold text-blue-900">{summary.active}</p>
          </div>
          <div className="rounded-2xl border border-green-100 bg-green-50 px-6 py-5">
            <p className="text-sm font-semibold text-green-700">Concluídos</p>
            <p className="mt-4 text-3xl font-bold text-green-900">{summary.completed}</p>
          </div>
          <div className="rounded-2xl border border-yellow-100 bg-yellow-50 px-6 py-5">
            <p className="text-sm font-semibold text-yellow-700">Cancelados</p>
            <p className="mt-4 text-3xl font-bold text-yellow-900">{summary.cancelled}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Detalhe por aluno</h2>
          <p className="text-sm text-gray-500">{summary.total} registo(s)</p>
        </div>

        {students.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <p className="text-lg font-semibold text-gray-700">Sem alunos associados ainda</p>
            <p className="mt-2 text-sm text-gray-500">Assim que um estágio for atribuído à tua orientação, ele aparece automaticamente aqui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {students.map((student) => {
              const statusMeta = resolveStatus(student);
              return (
                <div key={student.idEstagio} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
                          {student.alunoNome?.charAt(0) ?? '?'}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{student.alunoNome}</p>
                          <p className="text-sm text-gray-500">{student.alunoEmail}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div>
                          <p className="font-semibold text-gray-500">Curso</p>
                          <p className="text-gray-700">{student.alunoCurso || '—'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500">Área de interesse</p>
                          <p className="text-gray-700">{student.areaInteresse || '—'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500">Empresa</p>
                          <p className="text-gray-700">{student.empresaNome}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500">Estágio</p>
                          <p className="text-gray-700">{student.ofertaTitulo}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full max-w-xs space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-blue-600">{student.empresaNome}</p>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badge}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        <p><span className="font-semibold text-gray-500">Início:</span> {formatDate(student.dataInicio)}</p>
                        <p><span className="font-semibold text-gray-500">Fim:</span> {formatDate(student.dataFim)}</p>
                        <p><span className="font-semibold text-gray-500">Candidatura:</span> {student.candidaturaEstado || '—'}</p>
                      </div>
                      <button
                        onClick={() => navigate('/professor/estagios', { state: { focusEstagio: student.idEstagio } })}
                        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                      >
                        Ver estágio
                      </button>
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

export default ProfessorStudents;
