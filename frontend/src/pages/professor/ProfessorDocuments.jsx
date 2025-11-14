import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const CATEGORY_OPTIONS = [
  { key: 'relatorio', label: 'Relatório' },
  { key: 'avaliacao', label: 'Avaliação' },
  { key: 'outro', label: 'Outro' }
];

const CATEGORY_FILTERS = [{ key: 'all', label: 'Todos' }, ...CATEGORY_OPTIONS.map((opt) => ({ key: opt.key, label: opt.label }))];

const ProfessorDocuments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [internships, setInternships] = useState([]);
  const [summary, setSummary] = useState({ total: 0, porCategoria: {} });
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ estagioId: '', categoria: 'relatorio', file: null });
  const fileInputRef = useRef(null);

  const uploadsBaseUrl = useMemo(() => {
    try {
      const url = new URL(API_URL);
      return url.origin;
    } catch (err) {
      return '';
    }
  }, []);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  }, [navigate]);

  const formatBytes = useCallback((bytes) => {
    if (!bytes || Number(bytes) === 0) {
      return '—';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, index);
    return `${value.toFixed(value < 10 && index > 0 ? 1 : 0)} ${units[index]}`;
  }, []);

  const fetchDocuments = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/professores/me/documentos`, {
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
        throw new Error(payload.error || 'Não foi possível carregar os documentos.');
      }

      setDocuments(Array.isArray(payload?.data?.documents) ? payload.data.documents : []);
      setInternships(Array.isArray(payload?.data?.internships) ? payload.data.internships : []);
      setSummary({
        total: Number(payload?.data?.summary?.total) || 0,
        porCategoria: payload?.data?.summary?.porCategoria || {}
      });
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao carregar os documentos.');
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    if (location.state?.focusEstagio) {
      setForm((prev) => ({ ...prev, estagioId: String(location.state.focusEstagio) }));
    }
  }, [location.state]);

  const categorizedSummary = useMemo(() => {
    const base = CATEGORY_OPTIONS.reduce((acc, item) => {
      acc[item.key] = 0;
      return acc;
    }, {});
    const incoming = summary.porCategoria || {};
    return { ...base, ...incoming };
  }, [summary]);

  const filteredDocuments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return documents.filter((doc) => {
      const matchesCategory = activeFilter === 'all' || (doc.categoria || 'outro').toLowerCase() === activeFilter;
      if (!matchesCategory) {
        return false;
      }
      if (!term) {
        return true;
      }
      return (
        doc.nomeOriginal?.toLowerCase().includes(term) ||
        doc.alunoNome?.toLowerCase().includes(term) ||
        doc.ofertaTitulo?.toLowerCase().includes(term)
      );
    });
  }, [documents, activeFilter, searchTerm]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!form.estagioId) {
      setError('Seleciona o estágio associado ao documento.');
      return;
    }

    if (!form.file) {
      setError('Escolhe um ficheiro para upload.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setUploading(true);
      setError('');

      const body = new FormData();
      body.append('idEstagio', form.estagioId);
      body.append('categoria', form.categoria);
      body.append('file', form.file);

      const response = await fetch(`${API_URL}/professores/me/documentos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível carregar o documento.');
      }

      setForm({ estagioId: '', categoria: 'relatorio', file: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchDocuments();
    } catch (err) {
      setError(err.message || 'Falha ao carregar o documento.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (idDocumento) => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/professores/me/documentos/${idDocumento}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Não foi possível remover o documento.');
      }

      await fetchDocuments();
    } catch (err) {
      setError(err.message || 'Falha ao remover o documento.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Documentos</p>
          <h1 className="text-3xl font-semibold text-gray-900">Relatórios e uploads</h1>
          <p className="text-gray-500">A carregar os documentos associados aos teus estágios...</p>
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
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Documentos</p>
        <h1 className="text-3xl font-semibold text-gray-900">Relatórios e uploads</h1>
        <p className="text-gray-500">Centraliza relatórios, avaliações e restantes documentos partilhados com empresas e alunos.</p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">{error}</div>
      )}

      <section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
            <p className="text-sm font-semibold text-blue-700">Total de documentos</p>
            <p className="mt-4 text-3xl font-bold text-blue-900">{summary.total}</p>
          </div>
          {CATEGORY_OPTIONS.map((category) => (
            <div key={category.key} className="rounded-2xl border border-gray-200 bg-white px-6 py-5">
              <p className="text-sm font-semibold text-gray-600">{category.label}</p>
              <p className="mt-4 text-3xl font-bold text-gray-900">{categorizedSummary[category.key] || 0}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6 lg:col-span-2">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Documentos associados</h2>
              <p className="text-sm text-gray-500">Amostra {filteredDocuments.length} de {documents.length} registos.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2">
                {CATEGORY_FILTERS.map((filter) => (
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
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Procurar por aluno, estágio ou nome de ficheiro"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
              Não foram encontrados documentos com os filtros aplicados.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.idDocumento} className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">{doc.nomeOriginal}</span>
                        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {CATEGORY_OPTIONS.find((cat) => cat.key === (doc.categoria || 'outro').toLowerCase())?.label ?? 'Outro'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {doc.alunoNome} &mdash; {doc.ofertaTitulo}
                      </p>
                      <p className="text-xs text-gray-500">
                        Carregado em {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString('pt-PT') : '—'} &middot; {doc.tipo || '—'} &middot; {formatBytes(doc.tamanho)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 md:items-end">
                      <a
                        href={`${uploadsBaseUrl}${doc.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                      >
                        Transferir
                      </a>
                      <button
                        onClick={() => handleDelete(doc.idDocumento)}
                        className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6">
          <h2 className="text-xl font-semibold text-gray-900">Carregar documento</h2>
          <p className="mt-1 text-sm text-gray-500">Liga o upload ao estágio certo para manter o histórico consolidado.</p>

          <form onSubmit={handleUpload} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="document-estagio">
                Estágio associado
              </label>
              <select
                id="document-estagio"
                name="estagioId"
                value={form.estagioId}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              >
                <option value="">Seleciona um estágio</option>
                {internships.map((internship) => (
                  <option key={internship.idEstagio} value={internship.idEstagio}>
                    {internship.alunoNome} — {internship.ofertaTitulo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="document-categoria">
                Categoria
              </label>
              <select
                id="document-categoria"
                name="categoria"
                value={form.categoria}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="document-upload-input">
                Ficheiro
              </label>
              <input
                id="document-upload-input"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="mt-1 w-full rounded-xl border border-dashed border-gray-300 px-4 py-4 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <p className="mt-2 text-xs text-gray-500">Limite 10MB. Formatos aceites: PDF, Word, Excel, PowerPoint, JPG e PNG.</p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploading ? 'A carregar...' : 'Carregar documento'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ProfessorDocuments;
