import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const formatDate = (value) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-PT');
};

const GestorEmpresasPendentes = () => {
  const navigate = useNavigate();
  const { reloadStats } = useOutletContext() || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  }, [navigate]);

  const fetchEmpresas = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/empresas`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível carregar a lista de empresas.');
      }

      setEmpresas(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao carregar as empresas.');
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  const summary = useMemo(() => {
    const total = empresas.length;
    const pendentes = empresas.filter((empresa) => !empresa.validada).length;
    const validadas = empresas.filter((empresa) => empresa.validada).length;

    return {
      total,
      pendentes,
      validadas,
      percentualPendentes: total ? Math.round((pendentes / total) * 100) : 0
    };
  }, [empresas]);

  const pendentes = useMemo(() => empresas.filter((empresa) => !empresa.validada), [empresas]);

  const handleValidation = async (empresaId, isValid) => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setUpdatingId(empresaId);
      setError('');
      setSuccess('');

      const response = await fetch(`${API_URL}/empresas/${empresaId}/validate`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ validada: isValid })
      });

      const payload = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível atualizar o estado da empresa.');
      }

      setSuccess(isValid ? 'Empresa validada com sucesso.' : 'Empresa marcada como pendente.');
      await fetchEmpresas();
      if (typeof reloadStats === 'function') {
        reloadStats();
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao atualizar a empresa.');
    } finally {
      setUpdatingId(null);
    }
  };

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
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Validação de empresas</p>
        <h1 className="text-3xl font-semibold text-gray-900">Empresas pendentes</h1>
        <p className="text-gray-500">Revê os registos submetidos e aprova rapidamente as empresas que cumprem os critérios.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm font-semibold text-blue-700">Total registadas</p>
          <p className="mt-4 text-3xl font-bold text-blue-900">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-6 py-5">
          <p className="text-sm font-semibold text-amber-700">Pendentes</p>
          <p className="mt-4 text-3xl font-bold text-amber-900">{summary.pendentes}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-5">
          <p className="text-sm font-semibold text-emerald-700">Validadas</p>
          <p className="mt-4 text-3xl font-bold text-emerald-900">{summary.validadas}</p>
        </div>
        <div className="rounded-2xl border border-purple-100 bg-purple-50 px-6 py-5">
          <p className="text-sm font-semibold text-purple-700">Pendentes (%)</p>
          <p className="mt-4 text-3xl font-bold text-purple-900">{summary.percentualPendentes}%</p>
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
            <h2 className="text-xl font-semibold text-gray-900">Empresas a validar</h2>
            <p className="text-sm text-gray-500">{pendentes.length} registo(s) a necessitar de revisão.</p>
          </div>
        </div>

        {pendentes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <p className="text-lg font-semibold text-gray-700">Não existem empresas pendentes.</p>
            <p className="mt-2 text-sm text-gray-500">Novos registos surgirão aqui automaticamente assim que forem submetidos.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendentes.map((empresa) => (
              <div key={empresa.id_empresa} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-semibold text-gray-900">{empresa.nome_empresa}</p>
                      <p className="text-sm text-gray-500">{empresa.email || 'Contacto não disponível'}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-3">
                      <div>
                        <p className="font-semibold text-gray-500">NIF</p>
                        <p className="text-gray-700">{empresa.NIF || '—'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-500">Morada</p>
                        <p className="text-gray-700">{empresa.morada || '—'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-500">Criada em</p>
                        <p className="text-gray-700">{formatDate(empresa.data_criacao)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-semibold text-amber-700">
                      Pendente de validação
                    </span>
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                      <p><span className="font-semibold text-gray-500">ID empresa:</span> {empresa.id_empresa}</p>
                      <p><span className="font-semibold text-gray-500">ID utilizador:</span> {empresa.id_utilizador}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-nowrap">
                      <button
                        onClick={() => handleValidation(empresa.id_empresa, true)}
                        disabled={updatingId === empresa.id_empresa}
                        className={`inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors whitespace-nowrap ${
                          updatingId === empresa.id_empresa ? 'bg-emerald-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {updatingId === empresa.id_empresa ? 'A validar…' : 'Aprovar'}
                      </button>
                      <button
                        onClick={() => handleValidation(empresa.id_empresa, false)}
                        disabled={updatingId === empresa.id_empresa}
                        className={`inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors whitespace-nowrap ${
                          updatingId === empresa.id_empresa ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        {updatingId === empresa.id_empresa ? 'A atualizar…' : 'Manter pendente'}
                      </button>
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

export default GestorEmpresasPendentes;
