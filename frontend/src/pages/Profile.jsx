import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    // Fetch updated user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar dados do utilizador');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
        // If token is invalid, redirect to login
        if (err.message.includes('401')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    // Use stored user for immediate display, then fetch fresh data
    setUser(JSON.parse(storedUser));
    setLoading(false);
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">A carregar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-red-600">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">{user?.nome}</h1>
                <p className="text-blue-100 mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white mt-2">
                    {user?.role}
                  </span>
                </p>
              </div>
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-blue-600">
                {user?.nome?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações da Conta</h2>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-600">ID do Utilizador</label>
                <p className="mt-1 text-lg text-gray-900">{user?.id}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-600">Nome Completo</label>
                <p className="mt-1 text-lg text-gray-900">{user?.nome}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-600">Tipo de Conta</label>
                <p className="mt-1 text-lg text-gray-900">{user?.role}</p>
              </div>

              <div className="pb-4">
                <label className="block text-sm font-medium text-gray-600">Estado da Conta</label>
                <p className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Ativa
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Voltar ao Início
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Terminar Sessão
              </button>
            </div>

            {/* Additional Info based on role */}
            {user?.role === 'Aluno' && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Próximos Passos</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Complete o seu perfil com CV e competências</li>
                  <li>• Explore as ofertas de estágio disponíveis</li>
                  <li>• Candidate-se às vagas que interessam</li>
                </ul>
              </div>
            )}

            {user?.role === 'Empresa' && (
              <div className="mt-8 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Próximos Passos</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Complete o perfil da sua empresa</li>
                  <li>• Publique ofertas de estágio</li>
                  <li>• Reveja candidaturas recebidas</li>
                </ul>
              </div>
            )}

            {user?.role === 'Professor' && (
              <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Próximos Passos</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Acompanhe os seus alunos orientados</li>
                  <li>• Avalie estágios em curso</li>
                  <li>• Submeta relatórios de orientação</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
