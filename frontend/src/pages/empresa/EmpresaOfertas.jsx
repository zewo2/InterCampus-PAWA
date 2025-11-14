import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const EmpresaOfertas = () => {
  const outletData = useOutletContext() || {};
  const { empresa, loadingEmpresa } = outletData;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [offers, setOffers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    duracao: '',
    local: ''
  });

  const resetForm = useCallback(() => {
    setForm({ titulo: '', descricao: '', requisitos: '', duracao: '', local: '' });
    setEditingId(null);
  }, []);

  const fetchOffers = useCallback(async () => {
    if (!empresa?.id_empresa) {
      setOffers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/empresas/${empresa.id_empresa}/ofertas`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível carregar as ofertas.');
      }

      setOffers(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao carregar as ofertas.');
    } finally {
      setLoading(false);
    }
  }, [empresa?.id_empresa]);

  useEffect(() => {
    if (!loadingEmpresa) {
      fetchOffers();
    }
  }, [fetchOffers, loadingEmpresa]);

  const summary = useMemo(() => {
    const total = offers.length;
    const totalCandidaturas = offers.reduce((acc, offer) => acc + Number(offer.total_candidaturas || 0), 0);
    const durations = offers
      .map((offer) => Number(offer.duracao))
      .filter((value) => !Number.isNaN(value) && value > 0);
    const averageDuration = durations.length
      ? Math.round(durations.reduce((acc, value) => acc + value, 0) / durations.length)
      : 0;

    const lastPublication = offers.reduce((latest, offer) => {
      const current = offer.data_publicacao ? new Date(offer.data_publicacao).getTime() : 0;
      return current > latest ? current : latest;
    }, 0);

    return {
      total,
      totalCandidaturas,
      averageDuration,
      lastPublication: lastPublication ? new Date(lastPublication).toLocaleDateString('pt-PT') : null
    };
  }, [offers]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!empresa?.id_empresa) {
      setError('Completa primeiro o perfil da empresa para publicar ofertas.');
      return;
    }

    if (!form.titulo.trim() || !form.descricao.trim() || !form.requisitos.trim() || !form.duracao.trim() || !form.local.trim()) {
      setError('Preenche todos os campos obrigatórios.');
      return;
    }

    const duracaoValue = Number(form.duracao);
    if (Number.isNaN(duracaoValue) || duracaoValue <= 0) {
      setError('A duração deve ser um número inteiro positivo.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Sessão expirada. Inicia sessão novamente.');
      return;
    }

    const payload = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      requisitos: form.requisitos.trim(),
      duracao: duracaoValue,
      local: form.local.trim()
    };

    try {
      let response;
      if (editingId) {
        response = await fetch(`${API_URL}/ofertas/${editingId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_URL}/ofertas`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...payload, id_empresa: empresa.id_empresa })
        });
      }

      const responsePayload = await response.json();

      if (!response.ok) {
        throw new Error(responsePayload.error || 'Não foi possível guardar a oferta.');
      }

      setSuccess(editingId ? 'Oferta atualizada com sucesso.' : 'Oferta criada com sucesso.');
      resetForm();
      await fetchOffers();
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao guardar a oferta.');
    }
  };

  const handleEdit = (offer) => {
    setEditingId(offer.id_oferta);
    setForm({
      titulo: offer.titulo || '',
      descricao: offer.descricao || '',
      requisitos: offer.requisitos || '',
      duracao: offer.duracao ? String(offer.duracao) : '',
      local: offer.local || ''
    });
    setSuccess('');
    setError('');
  };

  const handleDelete = async (offerId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Sessão expirada. Inicia sessão novamente.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/ofertas/${offerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Não foi possível eliminar a oferta.');
      }

      setSuccess('Oferta eliminada com sucesso.');
      if (editingId === offerId) {
        resetForm();
      }
      await fetchOffers();
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao eliminar a oferta.');
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
        <p className="mt-2 text-sm text-gray-600">Só após concluir o registo é possível criar e gerir ofertas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Ofertas</p>
        <h1 className="text-3xl font-semibold text-gray-900">Gestão de ofertas de estágio</h1>
        <p className="text-gray-500">Publica novas oportunidades e atualiza o detalhe das ofertas existentes.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm font-semibold text-blue-700">Total de ofertas</p>
          <p className="mt-4 text-3xl font-bold text-blue-900">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm font-semibold text-blue-700">Candidaturas recebidas</p>
          <p className="mt-4 text-3xl font-bold text-blue-900">{summary.totalCandidaturas}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5">
          <p className="text-sm font-semibold text-gray-600">Duração média</p>
          <p className="mt-4 text-3xl font-bold text-gray-900">{summary.averageDuration || '—'}</p>
          <p className="text-xs text-gray-500 mt-1">em semanas</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5">
          <p className="text-sm font-semibold text-gray-600">Última publicação</p>
          <p className="mt-4 text-lg font-semibold text-gray-900">{summary.lastPublication || '—'}</p>
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

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Ofertas publicadas</h2>
            <p className="text-sm text-gray-500">{offers.length} registo(s)</p>
          </div>

          {offers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
              <p className="text-lg font-semibold text-gray-700">Ainda não existem ofertas publicadas.</p>
              <p className="mt-2 text-sm text-gray-500">Utiliza o formulário ao lado para criar a primeira oferta.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id_oferta} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1">
                        <p className="text-lg font-semibold text-gray-900">{offer.titulo}</p>
                        <p className="text-sm text-gray-500">Publicada em {offer.data_publicacao ? new Date(offer.data_publicacao).toLocaleDateString('pt-PT') : '—'}</p>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{offer.descricao}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><span className="font-semibold text-gray-600">Local:</span> {offer.local || '—'}</p>
                        <p><span className="font-semibold text-gray-600">Duração:</span> {offer.duracao ? `${offer.duracao} semana(s)` : '—'}</p>
                        <p><span className="font-semibold text-gray-600">Requisitos:</span> {offer.requisitos || '—'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between gap-4 md:items-end">
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-700">
                        {Number(offer.total_candidaturas || 0)} candidatura(s)
                      </span>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id_oferta)}
                          className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6">
          <h2 className="text-xl font-semibold text-gray-900">{editingId ? 'Editar oferta' : 'Criar nova oferta'}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Preenche todos os campos para garantir que os candidatos têm a informação necessária.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="titulo">
                Título da oferta
              </label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                value={form.titulo}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ex.: Estágio em Desenvolvimento Web"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="descricao">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={4}
                placeholder="Resumo das responsabilidades e contexto do estágio"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="requisitos">
                Requisitos
              </label>
              <textarea
                id="requisitos"
                name="requisitos"
                value={form.requisitos}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={3}
                placeholder="Competências técnicas e soft skills desejadas"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="duracao">
                  Duração (semanas)
                </label>
                <input
                  id="duracao"
                  name="duracao"
                  type="number"
                  min={1}
                  value={form.duracao}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Ex.: 12"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="local">
                  Local
                </label>
                <input
                  id="local"
                  name="local"
                  type="text"
                  value={form.local}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Ex.: Porto / Híbrido"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                {editingId ? 'Guardar alterações' : 'Criar oferta'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EmpresaOfertas;
