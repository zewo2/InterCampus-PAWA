import React from 'react'
import complaintsImg from '../assets/Livrodereclamações.png'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 m-0">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-base font-semibold mb-1">InterCampus</h3>
            <p className="text-sm text-white/80">Conectando Talentos com oportunidades desde 2020</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Para Estudantes</h4>
            <ul className="text-sm text-white/80 space-y-1">
              <li><a href="/estagios" className="hover:text-white transition">Procurar Estágios</a></li>
              <li><a href="/register" className="hover:text-white transition">Criar Perfil</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Para Empresas</h4>
            <ul className="text-sm text-white/80 space-y-1">
              <li><a href="/publicar-vaga" className="hover:text-white transition">Publicar Vaga</a></li>
              <li><a href="/candidatos" className="hover:text-white transition">Procurar Candidatos</a></li>
              <li><a href="/planos" className="hover:text-white transition">Planos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Suporte</h4>
            <ul className="text-sm text-white/80 space-y-1">
              <li><a href="/contactos" className="hover:text-white transition">Central de Ajuda</a></li>
              <li><a href="/termos" className="hover:text-white transition">Termos de Uso</a></li>
              <li><a href="/privacidade" className="hover:text-white transition">Privacidade</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/6 mt-4 py-4 text-white/70 text-sm">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© 2025 InterCampus. Todos os direitos reservados.</div>
          <a href="https://www.livroreclamacoes.pt/" target="_blank" rel="noopener noreferrer" className="inline-block">
            <img src={complaintsImg} alt="Livro de Reclamações" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
          </a>
        </div>
      </div>
    </footer>
  )
}