import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Estagios() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const empresaId = searchParams.get('empresa');
  
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const url = empresaId 
          ? `${API_URL}/ofertas?empresa=${empresaId}`
          : `${API_URL}/ofertas`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erro ao carregar ofertas');
        }
        const data = await response.json();
        setOfertas(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, [empresaId]);

  const handleCandidatar = (ofertaId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // TODO: Implement candidatura logic
    alert('Funcionalidade de candidatura em desenvolvimento');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">A carregar estágios...</div>
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
          <h1 className="text-4xl font-bold text-gray-900">Ofertas de Estágio</h1>
          <p className="mt-2 text-lg text-gray-600">
            {ofertas.length} vaga{ofertas.length !== 1 ? 's' : ''} disponíve{ofertas.length !== 1 ? 'is' : 'l'}
          </p>
        </div>

        {ofertas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma oferta de estágio encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {ofertas.map((oferta) => (
              <div
                key={oferta.id_oferta}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {oferta.titulo}
                    </h3>
                    <p className="text-lg text-blue-600 font-semibold mb-3">
                      {oferta.nome_empresa}
                    </p>
                    
                    <p className="text-gray-700 mb-4">
                      {oferta.descricao}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      {oferta.morada && (
                        <div>
                          <span className="font-medium">Localização:</span>
                          <p>{oferta.morada}</p>
                        </div>
                      )}
                      {oferta.tipo_trabalho && (
                        <div>
                          <span className="font-medium">Tipo:</span>
                          <p>{oferta.tipo_trabalho}</p>
                        </div>
                      )}
                      {oferta.remuneracao && (
                        <div>
                          <span className="font-medium">Remuneração:</span>
                          <p>€{oferta.remuneracao}</p>
                        </div>
                      )}
                      {oferta.data_publicacao && (
                        <div>
                          <span className="font-medium">Publicado:</span>
                          <p>{new Date(oferta.data_publicacao).toLocaleDateString('pt-PT')}</p>
                        </div>
                      )}
                    </div>

                    {oferta.requisitos && (
                      <div className="mb-4">
                        <span className="font-medium text-gray-700">Requisitos:</span>
                        <p className="text-gray-600">{oferta.requisitos}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleCandidatar(oferta.id_oferta)}
                    className="ml-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Candidatar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Estagios;
