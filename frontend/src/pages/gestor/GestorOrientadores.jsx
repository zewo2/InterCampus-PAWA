import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const formatDate = (value) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().split('T')[0];
};

const GestorOrientadores = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reloadStats } = useOutletContext() || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [candidaturas, setCandidaturas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [estagios, setEstagios] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    id_candidatura: '',
    id_professor: '',
    id_orientador: '',
    data_inicio: '',
    data_fim: ''
  });

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

      const [candidaturasResponse, estagiosResponse, professoresResponse] = await Promise.all([
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
        }),
        fetch(`${API_URL}/professores`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (
        candidaturasResponse.status === 401 ||
        candidaturasResponse.status === 403 ||
        estagiosResponse.status === 401 ||
        estagiosResponse.status === 403 ||
        professoresResponse.status === 401 ||
        professoresResponse.status === 403
      ) {
        handleUnauthorized();
        return;
      }

      const candidaturasPayload = await candidaturasResponse.json();
      const estagiosPayload = await estagiosResponse.json();
      const professoresPayload = await professoresResponse.json();

      if (!candidaturasResponse.ok) {
        throw new Error(candidaturasPayload.error || 'Não foi possível carregar as candidaturas.');
      }
      if (!estagiosResponse.ok) {
        throw new Error(estagiosPayload.error || 'Não foi possível carregar os estágios.');
      }
      if (!professoresResponse.ok) {
        throw new Error(professoresPayload.error || 'Não foi possível carregar os professores.');
      }

      setCandidaturas(Array.isArray(candidaturasPayload.data) ? candidaturasPayload.data : []);
      setEstagios(Array.isArray(estagiosPayload.data) ? estagiosPayload.data : []);
      setProfessores(Array.isArray(professoresPayload.data) ? professoresPayload.data : []);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao carregar os dados necessários.');
      setCandidaturas([]);
      setEstagios([]);
      setProfessores([]);
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (location.state?.focusCandidatura) {
      setForm((prev) => ({ ...prev, id_candidatura: String(location.state.focusCandidatura) }));
    }
  }, [location.state]);

  const existingInternshipCandidaturas = useMemo(() => new Set(estagios.map((item) => item.id_candidatura)), [estagios]);

  const candidaturasElegiveis = useMemo(
    () =>
      candidaturas
        .filter((candidatura) => {
          const estado = String(candidatura.estado || '').toLowerCase();
          return ['aceite', 'aceito'].includes(estado) && !existingInternshipCandidaturas.has(candidatura.id_candidatura);
        })
        .map((candidatura) => ({
          id: candidatura.id_candidatura,
          aluno: candidatura.aluno_nome,
          oferta: candidatura.oferta_titulo,
          empresa: candidatura.nome_empresa,
          data: candidatura.data_submissao
        })),
    [candidaturas, existingInternshipCandidaturas]
  );

  const orientadoresDisponiveis = useMemo(() => {
    const catalog = new Map();

    estagios.forEach((estagio) => {
      if (estagio.id_orientador && !catalog.has(estagio.id_orientador)) {
        catalog.set(estagio.id_orientador, {
          id: estagio.id_orientador,
          nome: estagio.orientador_nome,
          email: estagio.orientador_email,
          cargo: estagio.orientador_cargo
        });
      }
    });

    return Array.from(catalog.values());
  }, [estagios]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.id_candidatura || !form.id_professor || !form.id_orientador || !form.data_inicio) {
      setError('Preenche todos os campos obrigatórios.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      handleUnauthorized();
      return;
    }

    const payload = {
      id_candidatura: Number(form.id_candidatura),
      id_professor: Number(form.id_professor),
      id_orientador: Number(form.id_orientador),
      data_inicio: form.data_inicio,
      data_fim: form.data_fim || null
    };

    if (Number.isNaN(payload.id_candidatura) || Number.isNaN(payload.id_professor) || Number.isNaN(payload.id_orientador)) {
      setError('Seleciona opções válidas para candidatura, professor e orientador.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/estagios`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responsePayload = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(responsePayload.error || 'Não foi possível criar o estágio.');
      }

      setSuccess('Estágio criado e orientadores atribuídos com sucesso.');
      setForm({ id_candidatura: '', id_professor: '', id_orientador: '', data_inicio: '', data_fim: '' });
      await fetchData();
      if (typeof reloadStats === 'function') {
        reloadStats();
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao criar o estágio.');
    } finally {
      setSubmitting(false);
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
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Atribuição</p>
        <h1 className="text-3xl font-semibold text-gray-900">Atribuir orientadores</h1>
        <p className="text-gray-500">Seleciona uma candidatura aceite, associa o professor orientador e o orientador da empresa para criar o estágio.</p>
      </header>

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

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm font-semibold text-blue-700">Candidaturas elegíveis</p>
          <p className="mt-4 text-3xl font-bold text-blue-900">{candidaturasElegiveis.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-5">
          <p className="text-sm font-semibold text-emerald-700">Professores disponíveis</p>
          <p className="mt-4 text-3xl font-bold text-emerald-900">{professores.length}</p>
        </div>
        <div className="rounded-2xl border border-purple-100 bg-purple-50 px-6 py-5">
          <p className="text-sm font-semibold text-purple-700">Orientadores registados</p>
          <p className="mt-4 text-3xl font-bold text-purple-900">{orientadoresDisponiveis.length}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Criar novo estágio</h2>
        <p className="mt-2 text-sm text-gray-500">Este formulário utiliza componentes e estilos já presentes noutros fluxos para manter a consistência.</p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="id_candidatura" className="block text-sm font-medium text-gray-700">
                Candidatura aceite
              </label>
              <select
                id="id_candidatura"
                name="id_candidatura"
                value={form.id_candidatura}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              >
                <option value="">Seleciona uma candidatura</option>
                {candidaturasElegiveis.map((item) => (
                  <option key={item.id} value={item.id}>
                    #{item.id} · {item.aluno} · {item.empresa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="id_professor" className="block text-sm font-medium text-gray-700">
                Professor orientador
              </label>
              <select
                id="id_professor"
                name="id_professor"
                value={form.id_professor}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              >
                <option value="">Seleciona um professor</option>
                {professores.map((professor) => (
                  <option key={professor.id_professor} value={professor.id_professor}>
                    #{professor.id_professor} · {professor.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="id_orientador" className="block text-sm font-medium text-gray-700">
                Orientador na empresa
              </label>
              <select
                id="id_orientador"
                name="id_orientador"
                value={form.id_orientador}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              >
                <option value="">Seleciona um orientador existente</option>
                {orientadoresDisponiveis.map((orientador) => (
                  <option key={orientador.id} value={orientador.id}>
                    #{orientador.id} · {orientador.nome || orientador.email || 'Orientador'}
                  </option>
                ))}
              </select>
              {orientadoresDisponiveis.length === 0 && (
                <p className="mt-2 text-xs text-gray-500">Ainda não existem orientadores registados em estágios anteriores. Podes criar novos orientadores via API antes de regressar aqui.</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700">
                  Data de início
                </label>
                <input
                  id="data_inicio"
                  name="data_inicio"
                  type="date"
                  value={form.data_inicio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700">
                  Data de fim (opcional)
                </label>
                <input
                  id="data_fim"
                  name="data_fim"
                  type="date"
                  value={form.data_fim}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Os dados são gravados imediatamente e atualizam os módulos de processos e relatórios.</p>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors ${submitting ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              {submitting ? 'A guardar…' : 'Criar estágio'}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Histórico recente</h2>
          <p className="text-sm text-gray-500">{estagios.length} estágio(s) registados</p>
        </div>

        {estagios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <p className="text-lg font-semibold text-gray-700">Ainda não existem estágios registados.</p>
            <p className="mt-2 text-sm text-gray-500">Conclui o formulário acima para criar o primeiro estágio.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {estagios.map((estagio) => (
              <div key={estagio.id_estagio} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-900">{estagio.titulo || 'Estágio'}</p>
                      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">#{estagio.id_estagio}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
                      <div>
                        <p className="font-semibold text-gray-500">Aluno</p>
                        <p className="text-gray-700">{estagio.aluno_nome}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-500">Professor</p>
                        <p className="text-gray-700">{estagio.professor_nome}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-500">Orientador empresa</p>
                        <p className="text-gray-700">{estagio.orientador_nome}</p>
                        <p className="text-xs text-gray-500">{estagio.orientador_email}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-500">Período</p>
                        <p className="text-gray-700">{formatDate(estagio.data_inicio)} &ndash; {formatDate(estagio.data_fim)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                    <p><span className="font-semibold text-gray-500">Candidatura:</span> #{estagio.id_candidatura}</p>
                    <p><span className="font-semibold text-gray-500">Empresa:</span> {estagio.nome_empresa}</p>
                    <p><span className="font-semibold text-gray-500">Local:</span> {estagio.local || '—'}</p>
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

export default GestorOrientadores;
