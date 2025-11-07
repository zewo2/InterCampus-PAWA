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
            <div className="hero-buttons">
              <button className="btn-primary">Buscar Estágios</button>
              <button className="btn-secondary">Para Empresas</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://img.freepik.com/fotos-gratis/pessoas-em-reuniao-de-negocios-em-alto-angulo_23-2148911819.jpg" alt="Imagem de pessoas em reunião" />
          </div>
        </header>
      </section>

      {/* Search Section */}
      <section className="search">
        <h2 className="search-title">Busque por Estágios</h2>
        <div className="search-bar">
            <input type="text" placeholder="Cargo ou palavra-chave" className="search-input" />
            <input type="text" placeholder="Localização" className="search-input" />
            <select className="search-select">
            <option value="estudo" classname="study">Área de Estudo</option>
            <option value="marketing">Marketing</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="design">Design</option>
            </select>
            <button className="btn-primary">Buscar</button>
        </div>
        </section>

      {/* Highlighted Internships */}
      <section className="highlighted">
        <h2 className="section-title">Estágios em Destaque</h2>
        <div className="internships">
          <div className="internship-card">
            <h3>Estágio em Desenvolvimento Web</h3>
            <p>Google</p>
            <p>Oportunidade para desenvolver habilidades em React, Node.js e trabalhar em projetos.</p>
            <button className="btn-primary">Candidatar</button>
          </div>
          <div className="internship-card">
            <h3>Estágio em Marketing Digital</h3>
            <p>Microsoft</p>
            <p>Participe de campanhas globais e aprenda sobre estratégias de marketing digital.</p>
            <button className="btn-primary">Candidatar</button>
          </div>
          <div className="internship-card">
            <h3>Estágio em UX/UI Design</h3>
            <p>Netflix</p>
            <p>Trabalhe na criação de interfaces que milhões de usuários utilizam diariamente.</p>
            <button className="btn-primary">Candidatar</button>
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
