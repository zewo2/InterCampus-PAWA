import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// --- SVG Icons ---
const UserIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MailIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IdIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" /></svg>;
const RoleIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const LogoutIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>;
const PencilIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('A sua sessão expirou. Por favor, inicie sessão novamente.');
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    setUser(JSON.parse(storedUser));
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    toast.info(`Sessão terminada. Até breve, ${user?.nome || 'utilizador'}!`);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erro ao Carregar</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  const roleConfig = {
    Aluno: { color: "blue", title: "Aluno" },
    Empresa: { color: "green", title: "Empresa" },
    Professor: { color: "purple", title: "Professor" },
    Gestor: { color: "yellow", title: "Gestor" },
  };
  const currentRole = roleConfig[user?.role] || { color: "gray", title: user?.role };

  const nextSteps = {
    Aluno: [
      "Complete o seu perfil com CV e competências.",
      "Explore as ofertas de estágio disponíveis.",
      "Candidate-se às vagas que mais lhe interessam."
    ],
    Empresa: [
      "Complete o perfil da sua empresa para atrair talento.",
      "Publique novas e excitantes ofertas de estágio.",
      "Reveja e gira as candidaturas recebidas."
    ],
    Professor: [
      "Acompanhe o progresso dos seus alunos orientados.",
      "Avalie os estágios em curso.",
      "Submeta os relatórios de orientação atempadamente."
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative bg-blue-600 h-48">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
      </div>

      <div className="relative max-w-6xl mx-auto -mt-32 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
              <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-600 ring-4 ring-white mx-auto">
                {user?.nome?.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mt-4">{user?.nome}</h1>
              <span className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${currentRole.color}-100 text-${currentRole.color}-800`}>
                {currentRole.title}
              </span>
              <p className="text-gray-500 text-sm mt-2">{user?.email}</p>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <LogoutIcon />
                  Terminar Sessão
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Next Steps */}
          <div className="md:w-2/3 mt-8 md:mt-0">
            <div className="bg-white rounded-2xl shadow-xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Detalhes da Conta</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg"><UserIcon className="h-6 w-6 text-blue-600" /></div>
                  <div>
                    <p className="text-sm text-gray-500">Nome Completo</p>
                    <p className="font-semibold text-gray-800">{user?.nome}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg"><MailIcon className="h-6 w-6 text-blue-600" /></div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg"><IdIcon className="h-6 w-6 text-blue-600" /></div>
                  <div>
                    <p className="text-sm text-gray-500">ID do Utilizador</p>
                    <p className="font-semibold text-gray-800">{user?.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg"><RoleIcon className="h-6 w-6 text-blue-600" /></div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Conta</p>
                    <p className="font-semibold text-gray-800">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {nextSteps[user?.role] && (
              <div className="bg-white rounded-2xl shadow-xl mt-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Próximos Passos</h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {nextSteps[user?.role].map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon className={`h-6 w-6 text-${currentRole.color}-500 shrink-0 mt-0.5`} />
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
