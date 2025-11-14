import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import image1 from '../images/image1.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [filteredOfertas, setFilteredOfertas] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch(`${API_URL}/home`);
        if (!response.ok) {
          throw new Error('Failed to fetch home data');
        }
        const data = await response.json();
        setHomeData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Keep filteredOfertas in sync with fetched data
  useEffect(() => {
    setFilteredOfertas(homeData?.ofertas || []);
  }, [homeData]);

  // Default values for loading state
  const stats = homeData?.stats || {
    total_empresas: 0,
    total_ofertas: 0,
    total_alunos: 0,
    total_candidaturas: 0
  };

  const ofertas = filteredOfertas || [];
  const categories = homeData?.categories || [];

  const handleSearch = () => {
    const base = homeData?.ofertas || [];
    const q = query.trim().toLowerCase();
    const loc = selectedLocation.trim().toLowerCase();
    const area = selectedArea.trim().toLowerCase();

    const result = base.filter((o) => {
      const text = `${o.titulo || ''} ${o.descricao || ''} ${o.nome_empresa || ''} ${o.morada || ''} ${o.tipo_trabalho || ''}`.toLowerCase();
      const matchesQuery = q ? text.includes(q) : true;
      const matchesLocation = loc ? (o.morada || '').toLowerCase().includes(loc) : true;
      const matchesArea = area ? text.includes(area) : true;
      return matchesQuery && matchesLocation && matchesArea;
    });

    setFilteredOfertas(result);
  };

  return (
    <div className="App">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl text-gray-600">A carregar...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl text-red-600">Erro: {error}</div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Hero Section */}
          <section className="hero">
            <header className="hero-container">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Hero Content */}
                <div className="flex-1 text-center lg:text-left px-4 lg:px-0">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
                    Encontre o estágio ideal para sua carreira
                  </h1>
                  
                  {/* Hero Image - Only visible on mobile, positioned after title */}
                  <div className="flex lg:hidden items-center justify-center w-full mb-6">
                    <img 
                      src={image1} 
                      alt="Imagem de pessoas em reunião" 
                      className="w-full max-w-md h-auto rounded-2xl shadow-lg object-cover"
                    />
                  </div>

                  <p className="text-base md:text-lg lg:text-xl mb-6 lg:mb-8 opacity-90">
                    Conectamos estudantes talentosos com as melhores oportunidades de estágio em empresas de destaque
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6 px-4 sm:px-0 mb-8 lg:mb-0">
                    <Link 
                      to="/estagios"
                      className="bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#2563eb] transition-colors no-underline"
                    >
                      Procurar Estágios
                    </Link>
                    <Link 
                      to="/empresas" 
                      className="bg-white text-blue-600 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors no-underline"
                    >
                      Para Empresas
                    </Link>
                  </div>
                </div>

                {/* Hero Image - Only visible on desktop */}
                <div className="hidden lg:flex flex-1 items-center justify-center w-full px-4 lg:px-0">
                  <img 
                    src={image1} 
                    alt="Imagem de pessoas em reunião" 
                    className="w-full max-w-md lg:max-w-xl h-auto rounded-2xl shadow-lg object-cover"
                  />
                </div>
              </div>
            </header>
          </section>

      {/* Search Section */}
      <section className="py-16 px-4 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Procura por Estágios</h2>
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 flex flex-col md:flex-row gap-4 max-w-6xl mx-auto border-4 border-white/50 hover:border-blue-200 transition-all">
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
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="appearance-none w-full md:w-52 pl-14 pr-10 py-5 rounded-2xl text-gray-800 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-blue-400 bg-linear-to-r from-gray-50 to-gray-100 cursor-pointer shadow-inner border-2 border-transparent focus:border-blue-300 transition-all">
              <option value="">Localização</option>
              <option value="lisboa">Lisboa</option>
              <option value="porto">Porto</option>
              <option value="coimbra">Coimbra</option>
              <option value="braga">Braga</option>
              <option value="faro">Faro</option>
              <option value="aveiro">Aveiro</option>
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
            <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="appearance-none w-full md:w-52 pl-14 pr-10 py-5 rounded-2xl text-gray-800 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-blue-400 bg-linear-to-r from-gray-50 to-gray-100 cursor-pointer shadow-inner border-2 border-transparent focus:border-blue-300 transition-all">
              <option value="">Área</option>
              <option value="ti">Tecnologia da Informação</option>
              <option value="marketing">Marketing & Comunicação</option>
              <option value="design">Design & Criatividade</option>
              <option value="engenharia">Engenharia</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Search Button */}
          <button type="button" onClick={handleSearch} className="relative overflow-hidden bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 hover:bg-blue-700 group">
            <span className="relative z-10 flex items-center justify-center">
              <span className="mr-2">Pesquisar</span>
              <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* Highlighted Internships */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Estágios de Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertas.slice(0, 6).map((oferta) => (
            <div key={oferta.id_oferta} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{oferta.titulo}</h3>
              <p className="text-gray-600 font-semibold mb-3">{oferta.nome_empresa}</p>
              <p className="text-gray-600 mb-2 text-sm">{oferta.morada}</p>
              <p className="text-gray-600 mb-4 line-clamp-2">{oferta.descricao}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{oferta.tipo_trabalho}</span>
                <span>{oferta.remuneracao ? `€${oferta.remuneracao}` : 'Não especificado'}</span>
              </div>
              <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Candidatar
              </button>
            </div>
          ))}
          {ofertas.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 py-8">
              Nenhum estágio disponível de momento
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">{stats.total_empresas}+</h3>
            <p className="text-gray-600">Empresas Parceiras</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">{stats.total_ofertas}+</h3>
            <p className="text-gray-600">Vagas Disponíveis</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">{stats.total_alunos}+</h3>
            <p className="text-gray-600">Estudantes Registados</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">{stats.total_candidaturas}+</h3>
            <p className="text-gray-600">Candidaturas</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">Explorar por Categoria</h2>
          <p className="text-xl text-gray-600">Descobre oportunidades na tua área de interesse</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <div 
                key={index} 
                className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-2"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-all group-hover:scale-110">
                  <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {cat.categoria}
                </h3>
                <p className="text-gray-500 text-sm font-medium">{cat.total} vagas</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">Nenhuma categoria disponível</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-600 text-white mb-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar a tua jornada?</h2>
          <p className="text-xl mb-8 text-blue-100">Junte-se a milhares de estudantes que já encontraram o estágio dos seus sonhos.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors no-underline">
              Criar Conta Gratuita
            </Link>
            <Link to="/estagios" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors no-underline">
              Ver Todas as Vagas
            </Link>
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
}

export default Home;