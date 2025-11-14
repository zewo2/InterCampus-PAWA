import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Empresas() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch(`${API_URL}/empresas`);
        if (!response.ok) {
          throw new Error('Erro ao carregar empresas');
        }
        const data = await response.json();
        setEmpresas(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">A carregar empresas...</p>
          <p className="text-gray-500 text-sm mt-2">Encontrando os melhores parceiros</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-linear-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Erro ao Carregar</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="relative bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Empresas <span className="text-blue-200">Parceiras</span>
            </h1>
            <div className="w-20 h-1.5 bg-linear-to-r from-blue-300 to-indigo-300 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Conheça as empresas que oferecem as melhores oportunidades de estágio
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <svg className="w-5 h-5 mr-2 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-blue-100 font-semibold">
                {empresas.length} empresa{empresas.length !== 1 ? 's' : ''} parceira{empresas.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-20">
        {empresas.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-3xl mb-8 shadow-lg">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nenhuma empresa disponível</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
              Não encontramos empresas parceiras no momento. Volte mais tarde para descobrir novas oportunidades.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-linear-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Atualizar Página
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {empresas.map((empresa, index) => (
              <div
                key={empresa.id_empresa}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 hover:border-blue-200 cursor-pointer transform hover:-translate-y-2"
                onClick={() => navigate(`/estagios?empresa=${empresa.id_empresa}`)}
              >
                {/* Company Header */}
                <div className="relative p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    {/* Company Logo/Avatar */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl font-bold">
                          {empresa.nome_empresa?.charAt(0) || 'E'}
                        </span>
                      </div>
                    {empresa.validada && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    </div>

                    {/* Status Badge */}
                    {empresa.validada && (
                      <span className="bg-linear-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-semibold px-3 py-2 rounded-full flex items-center shadow-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Empresa Validada
                      </span>
                    )}
                  </div>

                  {/* Company Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {empresa.nome_empresa}
                  </h3>

                  {/* Company Details */}
                  <div className="space-y-3">
                    {empresa.NIF && (
                      <div className="flex items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-semibold block">NIF</span>
                          <span className="text-gray-700 font-medium text-sm">{empresa.NIF}</span>
                        </div>
                      </div>
                    )}
                    
                    {empresa.morada && (
                      <div className="flex items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-semibold block">Localização</span>
                          <span className="text-gray-700 font-medium text-sm line-clamp-1">{empresa.morada}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-blue-50 border-t border-gray-100">
                  <button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform group-hover:scale-105 flex items-center justify-center">
                    <span>Ver Oportunidades</span>
                  </button>
                  
                  {/* Additional Info */}
                  <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                    Clique para ver vagas disponíveis
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

export default Empresas;
