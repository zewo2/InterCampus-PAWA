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
    const colors = {
      'Pendente': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Em Análise': 'bg-blue-100 text-blue-700 border-blue-200',
      'Aceite': 'bg-green-100 text-green-700 border-green-200',
      'Rejeitada': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pendente':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Em Análise':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Aceite':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'Rejeitada':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">A carregar candidaturas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erro ao Carregar</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Minhas Candidaturas</h1>
          <p className="text-xl text-blue-100">
            {candidaturas.length} candidatura{candidaturas.length !== 1 ? 's' : ''} enviada{candidaturas.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {candidaturas.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma candidatura encontrada</h3>
            <p className="text-gray-600 mb-6">Ainda não te candidataste a nenhum estágio.</p>
            <button
              onClick={() => navigate('/estagios')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Explorar Estágios
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {candidaturas.map((candidatura) => (
              <div
                key={candidatura.id_candidatura}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header with ID and Status */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Candidatura #{candidatura.id_candidatura}
                      </h2>
                      <p className="text-gray-600">Oferta: ID {candidatura.id_oferta}</p>
                    </div>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(candidatura.estado)}`}>
                      {getStatusIcon(candidatura.estado)}
                      <span className="ml-2">{candidatura.estado}</span>
                    </span>
                  </div>

                  {/* Main Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações da Oferta</h3>
                      <div className="space-y-3">
                        {candidatura.titulo_oferta && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-semibold text-gray-700 block mb-1">Título:</span>
                            <p className="text-gray-900">{candidatura.titulo_oferta}</p>
                          </div>
                        )}
                        {candidatura.nome_empresa && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-semibold text-gray-700 block mb-1">Empresa:</span>
                            <p className="text-gray-900">{candidatura.nome_empresa}</p>
                          </div>
                        )}
                        {candidatura.morada && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-semibold text-gray-700 block mb-1">Localização:</span>
                            <p className="text-gray-600">{candidatura.morada}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalhes da Candidatura</h3>
                      <div className="space-y-3">
                        {candidatura.id_aluno && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-semibold text-gray-700 block mb-1">ID Aluno:</span>
                            <p className="text-gray-900">{candidatura.id_aluno}</p>
                          </div>
                        )}
                        {candidatura.data_candidatura && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-semibold text-gray-700 block mb-1">Data de Candidatura:</span>
                            <p className="text-gray-600">
                              {new Date(candidatura.data_candidatura).toLocaleDateString('pt-PT', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        )}
                        {candidatura.duracao && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-semibold text-gray-700 block mb-1">Duração:</span>
                            <p className="text-gray-600">{candidatura.duracao} meses</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message Section */}
                  {candidatura.mensagem && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Mensagem enviada:
                      </h4>
                      <p className="text-gray-700">{candidatura.mensagem}</p>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      {candidatura.bolsa && (
                        <div>
                          <span className="text-sm text-gray-600 block mb-1">Bolsa:</span>
                          <span className="text-3xl font-bold text-blue-600">€{candidatura.bolsa}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/estagios/${candidatura.id_oferta}`)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center"
                    >
                      Ver Detalhes da Oferta
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Candidaturas;
