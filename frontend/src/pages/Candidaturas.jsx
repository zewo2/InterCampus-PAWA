import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Candidaturas() {
  const navigate = useNavigate();
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCandidaturas = async () => {
      try {
        const response = await fetch(`${API_URL}/candidaturas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Erro ao carregar candidaturas');
        }
        const data = await response.json();
        setCandidaturas(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidaturas();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'aceite':
        return 'bg-green-100 text-green-800';
      case 'rejeitada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">A carregar candidaturas...</div>
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Minhas Candidaturas</h1>
          <p className="mt-2 text-lg text-gray-600">
            {candidaturas.length} candidatura{candidaturas.length !== 1 ? 's' : ''} submetida{candidaturas.length !== 1 ? 's' : ''}
          </p>
        </div>

        {candidaturas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-4">Ainda não tem candidaturas</p>
            <button
              onClick={() => navigate('/estagios')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Ofertas de Estágio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {candidaturas.map((candidatura) => (
              <div
                key={candidatura.id_candidatura}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Candidatura #{candidatura.id_candidatura}
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Oferta:</span> {candidatura.titulo_oferta || `ID ${candidatura.id_oferta}`}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidatura.status)}`}>
                    {candidatura.status || 'Pendente'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  {candidatura.data_candidatura && (
                    <div>
                      <span className="font-medium">Data de Candidatura:</span>
                      <p>{new Date(candidatura.data_candidatura).toLocaleDateString('pt-PT')}</p>
                    </div>
                  )}
                  {candidatura.nome_empresa && (
                    <div>
                      <span className="font-medium">Empresa:</span>
                      <p>{candidatura.nome_empresa}</p>
                    </div>
                  )}
                  {candidatura.id_aluno && (
                    <div>
                      <span className="font-medium">ID Aluno:</span>
                      <p>{candidatura.id_aluno}</p>
                    </div>
                  )}
                </div>

                {candidatura.carta_motivacao && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Carta de Motivação:</span>
                    <p className="text-gray-600 mt-1">{candidatura.carta_motivacao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Candidaturas;
