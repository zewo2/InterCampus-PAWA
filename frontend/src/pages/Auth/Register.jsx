import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Aluno',
    nomeEmpresa: '',
    nif: '',
    morada: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('As passwords não coincidem');
      return;
    }

    // Validate company-specific fields when applicable
    if (formData.role === 'Empresa') {
      if (!formData.nomeEmpresa.trim() || !formData.nif.trim() || !formData.morada.trim()) {
        setError('Preenche todos os campos da empresa para concluir o registo.');
        return;
      }

      if (!/^\d{9}$/.test(formData.nif.trim())) {
        setError('O NIF deve conter exatamente 9 dígitos.');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro ao registar');
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Trigger header update
      window.dispatchEvent(new Event('storage'));

      if (formData.role === 'Empresa') {
        const companyResponse = await fetch(`${API_URL}/empresas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          },
          body: JSON.stringify({
            nome_empresa: formData.nomeEmpresa.trim(),
            NIF: formData.nif.trim(),
            morada: formData.morada.trim(),
            id_utilizador: data.user.id
          })
        });

        const companyPayload = await companyResponse.json();

        if (!companyResponse.ok) {
          setError(companyPayload.error || 'Erro ao concluir o registo da empresa. Tenta novamente no separador Perfil.');
          return;
        }

        navigate('/empresa/dashboard', { replace: true });
        return;
      }

      // Redirect to home for other roles
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Criar Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              faça login na sua conta existente
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Conta
              </label>
              <select
                id="role"
                name="role"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Aluno">Aluno</option>
                <option value="Empresa">Empresa</option>
                <option value="Professor">Professor</option>
              </select>
            </div>
            {formData.role === 'Empresa' && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Empresa
                  </label>
                  <input
                    id="nomeEmpresa"
                    name="nomeEmpresa"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nome legal da empresa"
                    value={formData.nomeEmpresa}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-1">
                    NIF
                  </label>
                  <input
                    id="nif"
                    name="nif"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{9}"
                    maxLength={9}
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="000000000"
                    value={formData.nif}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="morada" className="block text-sm font-medium text-gray-700 mb-1">
                    Morada
                  </label>
                  <input
                    id="morada"
                    name="morada"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Morada completa da empresa"
                    value={formData.morada}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite a password novamente"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'A registar...' : 'Criar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
