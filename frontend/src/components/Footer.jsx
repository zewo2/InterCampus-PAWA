import React from 'react'
import complaintsImg from '../assets/Livrodereclamações.png'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-column footer-brand">
          <h3>InterCampus</h3>
          <p>Conectando Talentos com oportunidades desde 2020</p>
        </div>

        <div className="footer-column">
          <h4>Para Estudantes</h4>
          <ul>
            <li>Buscar Estágios</li>
            <li>Criar Perfil</li>
            <li>Dicas de Carreira</li>
            <li>Blog</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Para Empresas</h4>
          <ul>
            <li>Publicar Vaga</li>
            <li>Buscar Candidatos</li>
            <li>Planos</li>
            <li>Recursos</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Suporte</h4>
          <ul>
            <li>Central de Ajuda</li>
            <li>Contato</li>
            <li>Termos de Uso</li>
            <li>Privacidade</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 InterCampus. Todos os direitos reservados.</p>
      </div>
      <div className="footer-image-right">
        <a href="https://www.livroreclamacoes.pt/" target="_blank" rel="noopener noreferrer" className="text-[inherit]">
          <img src={complaintsImg} alt="Livro de Reclamações" className="complaints-img" />
        </a>
      </div>
      
    </footer>
  )
}
