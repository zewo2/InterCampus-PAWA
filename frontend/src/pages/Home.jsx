import React from 'react';
import image1 from '../images/image1.png';

function Home() {
  return (
    <div className="App">
      {/* Hero Section */}
      <section className="hero">
        <header className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Encontre o estágio ideal para sua carreira</h1>
            <p className="hero-description">
              Conectamos estudantes talentosos com as melhores oportunidades de estágio em empresas de destaque
            </p>
            <div className="flex gap-4 mt-6">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                Buscar Estágios
              </button>
              <button className="bg-white text-blue-600  px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Para Empresas
              </button>
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
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Estágio em Desenvolvimento Web</h3>
            <p className="text-gray-600 font-semibold mb-3">Google</p>
            <p className="text-gray-600 mb-4">Oportunidade para desenvolver habilidades em React, Node.js e trabalhar em projetos.</p>
            <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Candidatar
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Estágio em Marketing Digital</h3>
            <p className="text-gray-600 font-semibold mb-3">Microsoft</p>
            <p className="text-gray-600 mb-4">Participe de campanhas globais e aprenda sobre estratégias de marketing digital.</p>
            <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Candidatar
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Estágio em UX/UI Design</h3>
            <p className="text-gray-600 font-semibold mb-3">Netflix</p>
            <p className="text-gray-600 mb-4">Trabalhe na criação de interfaces que milhões de usuários utilizam diariamente.</p>
            <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Candidatar
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">500+</h3>
            <p className="text-gray-600">Empresas Parceiras</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">2.500+</h3>
            <p className="text-gray-600">Vagas Disponíveis</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">15.000+</h3>
            <p className="text-gray-600">Estudantes Cadastrados</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">8.500+</h3>
            <p className="text-gray-600">Vagas Candidatas</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Explore por Categoria</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Marketing</h3>
            <p className="text-gray-600">450 Vagas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tecnologia</h3>
            <p className="text-gray-600">320 Vagas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Design</h3>
            <p className="text-gray-600">180 Vagas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Engenharia</h3>
            <p className="text-gray-600">150 Vagas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">AI</h3>
            <p className="text-gray-600">250 Vagas</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-600 text-white mb-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar a tua jornada?</h2>
          <p className="text-xl mb-8 text-blue-100">Junte-se a milhares de estudantes que já encontraram o estágio dos seus sonhos.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Criar Conta Gratuita
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Ver Todas as Vagas
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;