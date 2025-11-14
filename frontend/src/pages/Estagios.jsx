import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Map category names to search keywords
const categoryKeywords = {
  'Design & UX': 'figma adobe photoshop illustrator xd sketch ui ux design',
  'Frontend Development': 'react vue angular frontend html css tailwind next.js javascript typescript',
  'Backend Development': 'java spring node.js backend api microserviços express django flask python',
  'Mobile Development': 'flutter react native ios android mobile swift kotlin',
  'Data Science & AI': 'machine learning ml tensorflow data science python power bi tableau analytics',
  'Cloud & DevOps': 'aws azure cloud devops kubernetes docker terraform ci/cd',
  'Cibersegurança': 'security cibersegurança pentesting network security siem',
  'QA & Testing': 'qa testing selenium cypress jest automation test',
  'Marketing & Comunicação': 'marketing seo social media comunicação google analytics',
  'Gestão & Produto': 'scrum agile product business gestão jira',
  'Tecnologia': 'developer engineer desenvolvimento programming'
};

function Estagios() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const empresaId = searchParams.get('empresa');
  
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingTo, setApplyingTo] = useState(null);
  
  // Filter states
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('local') || '');
  const [selectedArea, setSelectedArea] = useState('');
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch locations and categories for filters
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await fetch(`${API_URL}/home`);
        if (response.ok) {
          const data = await response.json();
          setLocations(data.data?.locations || []);
          setCategories(data.data?.categories || []);
          
          // Check if search param matches a category - if so, set it as area filter
          const searchParam = searchParams.get('search');
          if (searchParam) {
            const matchingCategory = data.data?.categories?.find(
              cat => cat.categoria.toLowerCase() === searchParam.toLowerCase()
            );
            if (matchingCategory) {
              setSelectedArea(matchingCategory.categoria);
            } else {
              setQuery(searchParam);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching filter data:', err);
      }
    };
    fetchFilterData();
  }, [searchParams]);

  useEffect(() => {
    const fetchOfertas = async () => {
      setLoading(true);
      try {
        // Build query string
        const params = new URLSearchParams();
        if (empresaId) params.append('empresa', empresaId);
        
        // If selectedArea is set, use category keywords; otherwise use query
        let searchTerm = query;
        if (selectedArea) {
          searchTerm = categoryKeywords[selectedArea] || selectedArea;
        }
        
        if (searchTerm) params.append('search', searchTerm);
        if (selectedLocation) params.append('local', selectedLocation);
        
        const url = `${API_URL}/ofertas${params.toString() ? '?' + params.toString() : ''}`;
        
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
  }, [empresaId, query, selectedLocation, selectedArea]);

  const handleSearch = () => {
    // Filters will auto-trigger via useEffect dependencies
    // Just update URL for sharing
    const params = new URLSearchParams();
    const searchTerm = selectedArea || query;
    if (searchTerm) params.append('search', searchTerm);
    if (selectedLocation) params.append('local', selectedLocation);
    if (empresaId) params.append('empresa', empresaId);
    
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedLocation('');
    setSelectedArea('');
    const params = new URLSearchParams();
    if (empresaId) params.append('empresa', empresaId);
    setSearchParams(params);
  };

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

      // If token is invalid/expired (401), clear storage and redirect to login
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userUpdated'));
        navigate('/login');
        return;
      }

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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">A carregar oportunidades...</p>
          <p className="text-gray-500 text-sm mt-2">Encontrando as melhores ofertas para si</p>
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
              Oportunidades de <span className="text-blue-200">Estágio</span>
            </h1>
            <div className="w-20 h-1.5 bg-linear-to-r from-blue-300 to-indigo-300 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Descubra as melhores oportunidades para iniciar a sua carreira
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <svg className="w-5 h-5 mr-2 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-blue-100 font-semibold">
                {ofertas.length} vaga{ofertas.length !== 1 ? 's' : ''} disponíve{ofertas.length !== 1 ? 'is' : 'l'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-30 mb-8">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 border-4 border-white/50 hover:border-blue-200 transition-all">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-gray-500 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Que tipo de estágio procuras?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
                className="w-full pl-16 pr-6 py-5 rounded-2xl text-gray-800 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-blue-400 bg-linear-to-r from-gray-50 to-gray-100 placeholder:text-gray-500 shadow-inner border-2 border-transparent focus:border-blue-300 transition-all"
              />
            </div>

            {/* Location Select */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-gray-500 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)} 
                className="appearance-none w-full md:w-52 pl-14 pr-10 py-5 rounded-2xl text-gray-800 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-blue-400 bg-linear-to-r from-gray-50 to-gray-100 cursor-pointer shadow-inner border-2 border-transparent focus:border-blue-300 transition-all"
              >
                <option value="">Localização</option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Area Select */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-gray-500 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <select 
                value={selectedArea} 
                onChange={(e) => setSelectedArea(e.target.value)} 
                className="appearance-none w-full md:w-52 pl-14 pr-10 py-5 rounded-2xl text-gray-800 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-blue-400 bg-linear-to-r from-gray-50 to-gray-100 cursor-pointer shadow-inner border-2 border-transparent focus:border-blue-300 transition-all"
              >
                <option value="">Área</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.categoria}>{cat.categoria}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <button 
              type="button" 
              onClick={handleSearch} 
              className="relative overflow-hidden bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 hover:bg-blue-700 group"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </button>

            {/* Clear Filters Button */}
            {(query || selectedLocation || selectedArea) && (
              <button 
                type="button" 
                onClick={handleClearFilters} 
                className="bg-gray-200 text-gray-700 px-6 py-5 rounded-2xl font-semibold hover:bg-gray-300 transition-all shadow-md hover:shadow-lg"
                title="Limpar filtros"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        {ofertas.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-3xl mb-8 shadow-lg">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nenhum estágio disponível</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
              Não encontramos oportunidades no momento. Volte mais tarde para descobrir novas ofertas.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-linear-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Atualizar Página
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {ofertas.map((oferta) => (
              <div
                key={oferta.id_oferta}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 hover:border-blue-200"
              >
                {/* Header do Cartão */}
                <div className="relative p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {oferta.titulo}
                      </h3>
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">
                            {oferta.nome_empresa?.charAt(0) || 'E'}
                          </span>
                        </div>
                        <p className="text-blue-600 font-semibold">
                          {oferta.nome_empresa}
                        </p>
                      </div>
                    </div>
                    {oferta.area && (
                      <span className="bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold px-3 py-2 rounded-full whitespace-nowrap">
                        {oferta.area}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 text-sm">
                    {oferta.descricao}
                  </p>
                </div>

                {/* Informações Principais */}
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {oferta.morada && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center text-gray-500 mb-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-semibold text-xs">Local</span>
                        </div>
                        <p className="text-gray-700 font-medium text-xs">{oferta.morada}</p>
                      </div>
                    )}
                    {oferta.tipo_trabalho && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center text-gray-500 mb-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                          </svg>
                          <span className="font-semibold text-xs">Tipo</span>
                        </div>
                        <p className="text-gray-700 font-medium text-xs">{oferta.tipo_trabalho}</p>
                      </div>
                    )}
                    {oferta.remuneracao && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center text-gray-500 mb-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span className="font-semibold text-xs">Remuneração</span>
                        </div>
                        <p className="text-gray-700 font-medium text-xs">€{oferta.remuneracao}</p>
                      </div>
                    )}
                    {oferta.duracao && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center text-gray-500 mb-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-xs">Duração</span>
                        </div>
                        <p className="text-gray-700 font-medium text-xs">{oferta.duracao} meses</p>
                      </div>
                    )}
                  </div>

                  {/* Requisitos */}
                  {oferta.requisitos && (
                    <div className="mt-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Requisitos:
                      </h4>
                      <p className="text-gray-700 text-sm line-clamp-2">{oferta.requisitos}</p>
                    </div>
                  )}
                </div>

                {/* Footer do Cartão */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {oferta.bolsa && (
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">Bolsa</span>
                          <span className="text-xl font-bold text-green-600">
                            €{oferta.bolsa}
                          </span>
                        </div>
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/estagios/${oferta.id_oferta}`)}
                        className="bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 text-sm shadow-sm hover:shadow-md"
                      >
                        Detalhes
                      </button>
                      <button
                        onClick={() => handleCandidatar(oferta.id_oferta)}
                        disabled={applyingTo === oferta.id_oferta}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed disabled:transform-none"
                        >
                        {applyingTo === oferta.id_oferta ? 'A processar...' : 'Candidatar-me'}
                      </button>
                    </div>
                  </div>
                  {oferta.data_publicacao && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Publicado em {new Date(oferta.data_publicacao).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  )}
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
