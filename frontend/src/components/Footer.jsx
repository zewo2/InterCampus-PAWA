import React from 'react'
import complaintsImg from '../assets/Livrodereclamações.png'

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white/90 relative left-1/2 -ml-[50vw] w-[100vw] box-border pt-4 pb-2 mt-5">
      <div className="max-w-[1200px] mx-auto flex gap-4 px-3 py-2 flex-wrap items-center">
        <div className="flex-1 min-w-[140px]">
          <h3 className="text-base font-semibold mb-1">InterCampus</h3>
          <p className="text-sm text-white/80">Conectando Talentos com oportunidades desde 2020</p>
        </div>

        <div className="flex-1 min-w-[140px]">
          <h4 className="text-sm font-medium mb-1">Para Estudantes</h4>
          <ul className="text-sm text-white/80 space-y-1">
            <li><a href="/estagios">Buscar Estágios</a></li>
            <li><a href="/perfil">Criar Perfil</a></li>
            <li><a href="/carreira">Dicas de Carreira</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        
        <div className="flex-1 min-w-[140px]">
          <h4 className="text-sm font-medium mb-1">Para Empresas</h4>
          <ul className="text-sm text-white/80 space-y-1">
            <li><a href="/publicar-vaga">Publicar Vaga</a></li>
            <li><a href="/candidatos">Buscar Candidatos</a></li>
            <li><a href="/planos">Planos</a></li>
            <li><a href="/recursos">Recursos</a></li>
          </ul>
        </div>

        <div className="flex-1 min-w-[140px]">
          <h4 className="text-sm font-medium mb-1">Suporte</h4>
          <ul className="text-sm text-white/80 space-y-1">
            <li><a href="/ajuda">Central de Ajuda</a></li>
            <li><a href="/contato">Contato</a></li>
            <li><a href="/termos">Termos de Uso</a></li>
            <li><a href="/privacidade">Privacidade</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/6 mt-2 py-2 text-center text-white/70 text-sm relative">
        <div>© 2025 InterCampus. Todos os direitos reservados.</div>
        <a href="https://www.livroreclamacoes.pt/" target="_blank" rel="noopener noreferrer" className="absolute right-4 top-1/2 -translate-y-1/2">
          <img src={complaintsImg} alt="Livro de Reclamações" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
        </a>
      </div>
    </footer>
  )
}