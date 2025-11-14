import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const EmpresaPerfil = () => {
  const navigate = useNavigate();
  const outletData = useOutletContext() || {};
  const { user, empresa, reloadEmpresa, loadingEmpresa } = outletData;
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    nomeEmpresa: '',
    nif: '',
    morada: ''
  });

  useEffect(() => {
    setForm({
      nome: user?.nome || '',
      email: user?.email || '',
      nomeEmpresa: empresa?.nome_empresa || '',
      nif: empresa?.NIF || '',
      morada: empresa?.morada || ''
    });
  }, [user, empresa]);

  useEffect(() => {
    if (!empresa && !loadingEmpresa) {
      setIsEditing(true);
    }
  }, [empresa, loadingEmpresa]);

  const empresaValidada = useMemo(() => Boolean(empresa?.validada), [empresa]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditing = () => {
    if (isEditing) {
      setForm({
        nome: user?.nome || '',
        email: user?.email || '',
        nomeEmpresa: empresa?.nome_empresa || '',
        nif: empresa?.NIF || '',
        morada: empresa?.morada || ''
      });
      setError('');
      setSuccess('');
    }
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!form.nome.trim() || !form.email.trim() || !form.nomeEmpresa.trim() || !form.nif.trim() || !form.morada.trim()) {
      setError('Preenche todos os campos obrigatórios.');
      return;
    }

    if (!/^\d{9}$/.test(form.nif.trim())) {
      setError('O NIF deve conter exatamente 9 dígitos.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      setSaving(true);

      const profileBody = new FormData();
      profileBody.append('nome', form.nome.trim());
      profileBody.append('email', form.email.trim());

      const profileResponse = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: profileBody
      });

      const profilePayload = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profilePayload.error || 'Não foi possível atualizar os dados do utilizador.');
      }

      localStorage.setItem('user', JSON.stringify(profilePayload.user));
      window.dispatchEvent(new Event('storage'));

      const companyPayload = {
        nome_empresa: form.nomeEmpresa.trim(),
        NIF: form.nif.trim(),
        morada: form.morada.trim()
      };

      let companyResponse;
      if (empresa?.id_empresa) {
        companyResponse = await fetch(`${API_URL}/empresas/${empresa.id_empresa}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(companyPayload)
        });
      } else {
        companyResponse = await fetch(`${API_URL}/empresas`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...companyPayload, id_utilizador: profilePayload.user.id })
        });
      }

      const companyResponsePayload = await companyResponse.json();

      if (!companyResponse.ok) {
        throw new Error(companyResponsePayload.error || 'Não foi possível atualizar os dados da empresa.');
      }

      await reloadEmpresa?.();

      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao guardar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingEmpresa) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Perfil</p>
        <h1 className="text-3xl font-semibold text-gray-900">Dados da empresa</h1>
        <p className="text-gray-500">Mantém a informação atualizada para acelerar a validação e a gestão das ofertas.</p>
      </header>

      <div className="bg-white shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">{empresa?.nome_empresa || 'Empresa não registada'}</h2>
            <p className="text-blue-100 text-sm mt-1">Responsável: {user?.nome || '—'}</p>
            <p className="text-blue-100 text-sm">Email: {user?.email || '—'}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${
              empresaValidada ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {empresaValidada ? 'Empresa validada' : 'A aguardar validação'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-semibold text-gray-900">Informação principal</h3>
            <button
              type="button"
              onClick={toggleEditing}
              className="inline-flex items-center justify-center rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="nomeEmpresa">
                Nome da empresa
              </label>
              <input
                id="nomeEmpresa"
                name="nomeEmpresa"
                type="text"
                value={form.nomeEmpresa}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                placeholder="Nome legal da empresa"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="nif">
                NIF
              </label>
              <input
                id="nif"
                name="nif"
                type="text"
                inputMode="numeric"
                pattern="\d{9}"
                maxLength={9}
                value={form.nif}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                placeholder="000000000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="morada">
                Morada
              </label>
              <input
                id="morada"
                name="morada"
                type="text"
                value={form.morada}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                placeholder="Morada completa"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="nome">
                Contacto principal
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                placeholder="Nome do contacto"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="email">
                Email do contacto
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                placeholder="email@empresa.pt"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:bg-green-300"
                >
                  {saving ? 'A guardar...' : 'Guardar alterações'}
                </button>
                <button
                  type="button"
                  onClick={toggleEditing}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-xl bg-gray-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-gray-700 disabled:bg-gray-300"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/empresa/ofertas')}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Gerir ofertas
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpresaPerfil;
