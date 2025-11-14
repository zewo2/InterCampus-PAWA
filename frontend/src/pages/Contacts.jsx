import React, { useState } from 'react';
import { toast } from 'react-toastify';

function Contacts(){
  const [form, setForm] = useState({ nome:'', email:'', assunto:'', mensagem:'' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e)=> setForm(s=>({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {

      setForm({ nome:'', email:'', assunto:'', mensagem:'' });
      
      toast.info('Mensagem enviada com sucesso!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {/* Header com Background Gradiente */}
      <div className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Fale <span className="text-blue-200">Connosco</span>
          </h1>
          <div className="w-20 h-1.5 bg-linear-to-r from-blue-300 to-indigo-300 mx-auto mb-6 rounded-full"></div>
          <p className="text-blue-100 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
            Estamos aqui para ajudar. Partilhe as suas dúvidas e sugestões connosco.
          </p>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
        <div className="rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 backdrop-blur-sm bg-white/95">
          {/* Cabeçalho do Formulário */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Envie a sua Mensagem
            </h2>
            <p className="text-gray-600 text-lg">
              Responderemos o mais breve possível
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Nome e Email - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-3">
                  Nome Completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white shadow-sm"
                    placeholder="Escreva o seu nome completo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white shadow-sm"
                    placeholder="exemplo.aluno@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Assunto */}
            <div className="space-y-2">
              <label htmlFor="assunto" className="block text-sm font-semibold text-gray-700 mb-3">
                Assunto *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="assunto"
                  name="assunto"
                  value={form.assunto}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white shadow-sm"
                  placeholder="Descreva brevemente o assunto da mensagem"
                />
              </div>
            </div>

            {/* Mensagem */}
            <div className="space-y-2">
              <label htmlFor="mensagem" className="block text-sm font-semibold text-gray-700 mb-3">
                Mensagem *
              </label>
              <div className="relative">
                <div className="absolute top-4 left-3 flex items-start pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={form.mensagem}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white shadow-sm resize-none"
                  placeholder="Escreva aqui a sua mensagem detalhada. Responderemos o mais breve possível."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full md:w-auto inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      A enviar...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Enviar Mensagem
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </button>
            </div>
          </form>

          {/* Informação de Contacto Adicional */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Telefone</h3>
                <p className="text-gray-600">+351 123 456 789</p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600">geral@intercampus.pt</p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Localização</h3>
                <p className="text-gray-600">Porto, Portugal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Espaço inferior */}
      <div className="pb-20"></div>
    </div>
  );
}

export default Contacts;