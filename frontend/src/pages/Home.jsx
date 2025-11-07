import React from 'react';

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
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Buscar Estágios
              </button>
              <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Para Empresas
              </button>
            </div>
          </div>
          <div className="flex-1">
            <img 
              src="https://img.freepik.com/fotos-gratis/pessoas-em-reuniao-de-negocios-em-alto-angulo_23-2148911819.jpg" 
              alt="Imagem de pessoas em reunião" 
              className="w-full h-auto rounded-2xl shadow-lg object-cover"
            />
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
      <section className="stats">
        <div className="stat">
          <h3>500+</h3>
          <p>Empresas Parceiras</p>
        </div>
        <div className="stat">
          <h3>2.500+</h3>
          <p>Vagas Disponíveis</p>
        </div>
        <div className="stat">
          <h3>15.000+</h3>
          <p>Estudantes Cadastrados</p>
        </div>
        <div className="stat">
          <h3>8.500+</h3>
          <p>Vagas Candidatas</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2 className="section-title">Explore por Categoria</h2>
        <div className="category-cards">
          <div className="category-card">
            <h3>Marketing</h3>
            <p>450 Vagas</p>
          </div>
          <div className="category-card">
            <h3>Tecnologia</h3>
            <p>320 Vagas</p>
          </div>
          <div className="category-card">
            <h3>Design</h3>
            <p>180 Vagas</p>
          </div>
          <div className="category-card">
            <h3>Engenharia</h3>
            <p>150 Vagas</p>
          </div>
          <div className="category-card">
            <h3>AI</h3>
            <p>250 Vagas</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Pronto para começar a tua jornada?</h2>
        <p>Junte-se a milhares de estudantes que já encontraram o estágio dos seus sonhos.</p>
        <div className="cta-buttons">
          <button className="btn-primary">Criar Conta Gratuita</button>
          <button className="btn-secondary">Ver Todas as Vagas</button>
        </div>
      </section>
    </div>
  );
}

export default Home;
