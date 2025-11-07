import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import image1 from '../images/image1.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Default values for loading state
  const stats = homeData?.stats || {
    total_empresas: 0,
    total_ofertas: 0,
    total_alunos: 0,
    total_candidaturas: 0
  };

  const ofertas = homeData?.ofertas || [];
  const categories = homeData?.categories || [];
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
              <div className="hero-content">
                <h1 className="hero-title">Encontre o estágio ideal para sua carreira</h1>
                <p className="hero-description">
                  Conectamos estudantes talentosos com as melhores oportunidades de estágio em empresas de destaque
                </p>
                <div className="flex gap-4 mt-6">
                  <Link to="/estagios" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors no-underline">
                    Buscar Estágios
                  </Link>
                  <Link to="/empresas" className="bg-white text-blue-600  px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors no-underline">
                    Para Empresas
                  </Link>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img src={image1} alt="Imagem de pessoas em reunião" className="w-full max-w-xl h-auto rounded-2xl shadow-lg object-cover"/>
              </div>
            </header>
          </section>

      {/* Search Section */}
      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Busque por Estágios</h2>
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 items-center justify-center">
            <input 
              type="text" 
              placeholder="Cargo ou palavra-chave" 
              className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              placeholder="Localização" 
              className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="estudo">Área de Estudo</option>
              <option value="marketing">Marketing</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="design">Design</option>
            </select>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Buscar
            </button>
        </div>
      </section>

      {/* Highlighted Internships */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Estágios em Destaque</h2>
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
              Nenhum estágio disponível no momento
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
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
            <p className="text-gray-600">Estudantes Cadastrados</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">{stats.total_candidaturas}+</h3>
            <p className="text-gray-600">Candidaturas</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Explore por Categoria</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{cat.categoria}</h3>
                <p className="text-gray-600">{cat.total} Vagas</p>
              </div>
            ))
          ) : (
            <div className="col-span-5 text-center text-gray-500 py-8">
              Nenhuma categoria disponível
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