import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    // Fetch updated user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar dados do utilizador');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
        // If token is invalid, redirect to login
        if (err.message.includes('401')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    // Use stored user for immediate display, then fetch fresh data
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
      window.dispatchEvent(new Event('storage'));

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">A carregar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-red-600">Erro: {error}</div>
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

              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-600">Tipo de Conta</label>
                <p className="mt-1 text-lg text-gray-900">{user?.role}</p>
              </div>

              <div className="pb-4">
                <label className="block text-sm font-medium text-gray-600">Estado da Conta</label>
                <p className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Ativa
                  </span>
                </p>
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
            )}

            {user?.role === 'Empresa' && (
              <div className="mt-8 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Próximos Passos</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Complete o perfil da sua empresa</li>
                  <li>• Publique ofertas de estágio</li>
                  <li>• Reveja candidaturas recebidas</li>
                </ul>
              </div>
            )}

            {user?.role === 'Professor' && (
              <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Próximos Passos</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Acompanhe os seus alunos orientados</li>
                  <li>• Avalie estágios em curso</li>
                  <li>• Submeta relatórios de orientação</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
