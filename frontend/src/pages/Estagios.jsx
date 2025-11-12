import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Estagios() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const empresaId = searchParams.get('empresa');
  
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingTo, setApplyingTo] = useState(null);

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

  const handleCandidatar = async (ofertaId) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(user);
    
    // Check if user is a student
    if (userData.role !== 'Aluno') {
      toast.error('Apenas alunos podem candidatar-se a estágios');
      return;
    }

    setApplyingTo(ofertaId);
    
    try {
      const response = await fetch(`${API_URL}/candidaturas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_oferta: ofertaId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao submeter candidatura');
      }

      toast.success('Candidatura submetida com sucesso!');
      
      // Update the applicant count in the list
      setOfertas(prev => prev.map(o => 
        o.id_oferta === ofertaId 
          ? { ...o, total_candidaturas: (o.total_candidaturas || 0) + 1 }
          : o
      ));
      
      // Optionally navigate to details or candidaturas page
      navigate(`/estagios/${ofertaId}`);
    } catch (err) {
      toast.error(err.message || 'Erro ao submeter candidatura');
    } finally {
      setApplyingTo(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">A carregar estágios...</p>
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className=" bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ofertas de Estágio</h1>
          <p className="text-xl text-blue-100">
            {ofertas.length} vaga{ofertas.length !== 1 ? 's' : ''} disponíve{ofertas.length !== 1 ? 'is' : 'l'}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {ofertas.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhum estágio disponível</h3>
            <p className="text-gray-600">Volta mais tarde para encontrar novas oportunidades.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {ofertas.map((oferta) => (
              <div
                key={oferta.id_oferta}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {oferta.titulo}
                      </h3>
                      <p className="text-lg text-blue-600 font-semibold mb-3">
                        {oferta.nome_empresa}
                      </p>
                    </div>
                    {oferta.area && (
                      <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
                        {oferta.area}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {oferta.descricao}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                    {oferta.morada && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700 block mb-1">Localização:</span>
                        <p className="text-gray-600">{oferta.morada}</p>
                      </div>
                    )}
                    {oferta.tipo_trabalho && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700 block mb-1">Tipo:</span>
                        <p className="text-gray-600">{oferta.tipo_trabalho}</p>
                      </div>
                    )}
                    {oferta.remuneracao && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700 block mb-1">Remuneração:</span>
                        <p className="text-gray-600">€{oferta.remuneracao}</p>
                      </div>
                    )}
                    {oferta.data_publicacao && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700 block mb-1">Publicado:</span>
                        <p className="text-gray-600">
                          {new Date(oferta.data_publicacao).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                    )}
                    {oferta.duracao && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700 block mb-1">Duração:</span>
                        <p className="text-gray-600">{oferta.duracao} meses</p>
                      </div>
                    )}
                    {oferta.vagas && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700 block mb-1">Vagas:</span>
                        <p className="text-gray-600">{oferta.vagas}</p>
                      </div>
                    )}
                  </div>

                  {oferta.requisitos && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Requisitos:
                      </h4>
                      <p className="text-gray-700">{oferta.requisitos}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      {oferta.bolsa && (
                        <span className="text-3xl font-bold text-blue-600">
                          €{oferta.bolsa}
                        </span>
                      )}
                      {typeof oferta.total_candidaturas !== 'undefined' && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-sm font-medium">
                            {oferta.total_candidaturas} candidato{oferta.total_candidaturas !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/estagios/${oferta.id_oferta}`)}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() => handleCandidatar(oferta.id_oferta)}
                        disabled={applyingTo === oferta.id_oferta}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
                      >
                        {applyingTo === oferta.id_oferta ? 'A processar...' : 'Candidatar-me'}
                      </button>
                    </div>
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

export default Estagios;
