import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Home from './Home';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import Profile from './Profile';
import Empresas from './Empresas';
import Estagios from './Estagios';
import EstagioDetalhes from './EstagioDetalhes';
import Candidaturas from './Candidaturas';
import Contacts from './Contacts';
import Termos from './Termos';
import Privacidade from './Privacidade';
import Fallback from './Fallback';
import Footer from '../components/Footer';
import ProfessorLayout from './professor/ProfessorLayout';
import DashboardProfessor from './professor/DashboardProfessor';
import ProfessorStudents from './professor/ProfessorStudents';
import ProfessorInternships from './professor/ProfessorInternships';
import ProfessorDocuments from './professor/ProfessorDocuments';
import EmpresaLayout from './empresa/EmpresaLayout';
import EmpresaDashboard from './empresa/EmpresaDashboard';
import EmpresaPerfil from './empresa/EmpresaPerfil';
import EmpresaOfertas from './empresa/EmpresaOfertas';
import EmpresaCandidaturas from './empresa/EmpresaCandidaturas';
import GestorLayout from './gestor/GestorLayout';
import GestorDashboard from './gestor/GestorDashboard';
import GestorEmpresasPendentes from './gestor/GestorEmpresasPendentes';
import GestorProcessos from './gestor/GestorProcessos';
import GestorOrientadores from './gestor/GestorOrientadores';
import GestorRelatorios from './gestor/GestorRelatorios';
import GestorLogs from './gestor/GestorLogs';
import '../styles/App.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const RequireRole = ({ allowedRoles, children }) => {
  const location = useLocation();
  const [state, setState] = useState({ checking: true, authorized: false });
  const rolesSignature = useMemo(() => allowedRoles.join('|'), [allowedRoles]);

  useEffect(() => {
    let isMounted = true;

    const hasAllowedRole = (role) =>
      allowedRoles.some((allowedRole) => allowedRole.toLowerCase() === String(role || '').toLowerCase());

    const token = localStorage.getItem('token');
    const storedUserRaw = localStorage.getItem('user');

    if (!token || !storedUserRaw) {
      setState({ checking: false, authorized: false });
      return;
    }

    let storedUser;
    try {
      storedUser = JSON.parse(storedUserRaw);
    } catch {
      storedUser = null;
    }

    if (!storedUser || !hasAllowedRole(storedUser.role)) {
      setState({ checking: false, authorized: false });
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('userUpdated'));
          }
          throw new Error('Não autorizado');
        }

        const data = await response.json();
        const roleFromServer = data?.user?.role;
        const authorized = hasAllowedRole(roleFromServer);

        if (isMounted) {
          setState({ checking: false, authorized });
        }
      } catch {
        if (isMounted) {
          setState({ checking: false, authorized: false });
        }
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, [rolesSignature, allowedRoles]);

  if (state.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">A validar acesso...</p>
      </div>
    );
  }

  if (!state.authorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const isPrivateArea =
    location.pathname.startsWith('/professor') ||
    location.pathname.startsWith('/empresa/') ||
    location.pathname === '/empresa' ||
    location.pathname.startsWith('/gestor');

  return (
    <>
      {!isPrivateArea && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/estagios" element={<Estagios />} />
        <Route path="/estagios/:id" element={<EstagioDetalhes />} />
        <Route path="/candidaturas" element={<Candidaturas />} />
        <Route path="/contactos" element={<Contacts />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />

        <Route
          path="/professor/*"
          element={(
            <RequireRole allowedRoles={['Professor']}>
              <ProfessorLayout />
            </RequireRole>
          )}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardProfessor />} />
          <Route path="alunos" element={<ProfessorStudents />} />
          <Route path="estagios" element={<ProfessorInternships />} />
          <Route path="documentos" element={<ProfessorDocuments />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route
          path="/empresa/*"
          element={(
            <RequireRole allowedRoles={['Empresa']}>
              <EmpresaLayout />
            </RequireRole>
          )}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmpresaDashboard />} />
          <Route path="perfil" element={<EmpresaPerfil />} />
          <Route path="ofertas" element={<EmpresaOfertas />} />
          <Route path="candidaturas" element={<EmpresaCandidaturas />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route
          path="/gestor/*"
          element={(
            <RequireRole allowedRoles={['Gestor']}>
              <GestorLayout />
            </RequireRole>
          )}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<GestorDashboard />} />
          <Route path="empresas" element={<GestorEmpresasPendentes />} />
          <Route path="processos" element={<GestorProcessos />} />
          <Route path="orientadores" element={<GestorOrientadores />} />
          <Route path="relatorios" element={<GestorRelatorios />} />
          <Route path="logs" element={<GestorLogs />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* 404 Fallback - must be last */}
        <Route path="*" element={<Fallback />} />
      </Routes>

      {!isPrivateArea && <Footer />}

      {/* Global toast container for react-toastify */}
      <ToastContainer
        position="bottom-right"
        theme="colored"
        newestOnTop
        pauseOnFocusLoss={false}
        closeOnClick
        autoClose={4000}
      />
    </>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
