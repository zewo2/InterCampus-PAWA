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
            <li><a href="/estagios">Buscar Estágios</a></li>
            <li><a href="/perfil">Criar Perfil</a></li>
            <li><a href="/carreira">Dicas de Carreira</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>Para Empresas</h4>
          <ul>
            <li><a href="/publicar-vaga">Publicar Vaga</a></li>
            <li><a href="/candidatos">Buscar Candidatos</a></li>
            <li><a href="/planos">Planos</a></li>
            <li><a href="/recursos">Recursos</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Suporte</h4>
          <ul>
            <li><a href="/ajuda">Central de Ajuda</a></li>
            <li><a href="/contato">Contato</a></li>
            <li><a href="/termos">Termos de Uso</a></li>
            <li><a href="/privacidade">Privacidade</a></li>
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