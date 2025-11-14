import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center">
            <span className="text-9xl font-bold text-blue-600">4</span>
            <div className="relative mx-4">
              <svg 
                className="w-32 h-32 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <span className="text-9xl font-bold text-blue-600">4</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Página Não Encontrada
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Oops! A página que procura não existe.
          </p>
          <p className="text-gray-500">
            O endereço pode estar incorreto ou a página pode ter sido removida.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Voltar ao Início
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar Atrás
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Talvez esteja à procura de:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/estagios')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
            >
              Estágios
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate('/empresas')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
            >
              Empresas
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate('/candidaturas')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
            >
              Candidaturas
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate('/perfil')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
            >
              Perfil
            </button>
          </div>
        </div>

        {/* Fun Element */}
        <div className="mt-8 text-gray-400 text-sm">
          <p>Erro 404 - Esta não é a página que procura 🔍</p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;