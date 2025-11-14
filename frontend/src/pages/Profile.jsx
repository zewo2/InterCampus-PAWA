import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: '',
    email: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // If token is invalid/expired (401), clear storage and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('userUpdated'));
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Erro ao carregar dados do utilizador');
        }

        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setUser(JSON.parse(storedUser));
    setEditForm({
      nome: JSON.parse(storedUser).nome,
      email: JSON.parse(storedUser).email
    });
    setLoading(false);
    fetchUserData();
  }, [navigate]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setEditForm({
        nome: user.nome,
        email: user.email
      });
      setProfilePicture(null);
      setProfilePicturePreview(null);
    }
    setIsEditing(!isEditing);
    setError('');
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        setProfilePicture(null);
        setProfilePicturePreview(null);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecione uma imagem válida');
        setProfilePicture(null);
        setProfilePicturePreview(null);
        return;
      }

      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.onerror = () => {
        setError('Erro ao carregar pré-visualização da imagem');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setError('');
    setSuccessMessage('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData to handle both text and file upload
      const formData = new FormData();
      formData.append('nome', editForm.nome);
      formData.append('email', editForm.email);
      
      // Add profile picture if selected
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - let browser set it with boundary for multipart/form-data
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar perfil');
      }

      // Update local storage and state
      const updatedUser = data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userUpdated'));

      setSuccessMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
      setProfilePicture(null);
      setProfilePicturePreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    toast.info(`Sessão terminada. Até breve, ${user?.nome || 'utilizador'}!`);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userUpdated'));
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">{user?.nome}</h1>
                <p className="text-blue-100 mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white mt-2">
                    {user?.role}
                  </span>
                </p>
              </div>
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-blue-600 overflow-hidden">
                  {profilePicturePreview ? (
                    <img src={profilePicturePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : user?.profile_picture ? (
                    <img src={`${BACKEND_URL}/${user.profile_picture}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.nome?.charAt(0).toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-lg hover:bg-gray-100">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePictureChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Informações da Conta</h2>
              <button
                onClick={handleEditToggle}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancelar
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Perfil
                  </>
                )}
              </button>
            </div>

            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-600">ID do Utilizador</label>
                <p className="mt-1 text-lg text-gray-900">{user?.id}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Nome Completo</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nome"
                    value={editForm.nome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-lg text-gray-900">{user?.nome}</p>
                )}
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
                )}
              </div>

      <div className="relative max-w-6xl mx-auto -mt-32 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center relative">
              <div className="relative mx-auto h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-600 ring-4 ring-white overflow-hidden">
                {profilePicturePreview ? (
                  <img src={profilePicturePreview} alt="Pré-visualização" className="w-full h-full object-cover" />
                ) : user?.profile_picture ? (
                  <img src={`${BACKEND_URL}/${user.profile_picture}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.nome?.charAt(0).toUpperCase()
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-lg hover:bg-gray-100">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
                  </label>
                )}
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

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300"
                  >
                    {saving ? 'A guardar...' : 'Guardar Alterações'}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    disabled={saving}
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Voltar ao Início
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Terminar Sessão
                  </button>
                </>
              )}
            </div>

            {/* Additional Info based on role */}
            {user?.role === 'Aluno' && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Próximos Passos</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Complete o seu perfil com CV e competências</li>
                  <li>• Explore as ofertas de estágio disponíveis</li>
                  <li>• Candidate-se às vagas que interessam</li>
                </ul>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg"><UserIcon className="h-6 w-6 text-blue-600" /></div>
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Nome Completo</p>
                    {isEditing ? (
                      <input name="nome" value={editForm.nome} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
                    ) : (
                      <p className="font-semibold text-gray-800">{user?.nome}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg"><MailIcon className="h-6 w-6 text-blue-600" /></div>
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Email</p>
                    {isEditing ? (
                      <input name="email" value={editForm.email} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
                    ) : (
                      <p className="font-semibold text-gray-800">{user?.email}</p>
                    )}
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
              {successMessage && (
                <div className="p-4 mx-6 mb-4 bg-green-100 border border-green-300 text-green-800 rounded">{successMessage}</div>
              )}
              {error && (
                <div className="p-4 mx-6 mb-4 bg-red-100 border border-red-300 text-red-800 rounded">{error}</div>
              )}
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