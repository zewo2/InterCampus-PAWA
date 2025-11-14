import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Home from './Home';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Profile from './Profile';
import Empresas from './Empresas';
import Estagios from './Estagios';
import Candidaturas from './Candidaturas';
import Footer from '../components/Footer';
import '../styles/App.css'
import EstagioDetalhes from './EstagioDestalhes';    
import Contacts from './Contacts';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/estagios" element={<Estagios />} />
          <Route path="/estagios/:id" element={<EstagioDetalhes />} />
          <Route path="/candidaturas" element={<Candidaturas />} />
          <Route path="/contactos" element={<Contacts />} />
        </Routes>
        <Footer />
        <ToastContainer position="bottom-right" theme="colored" newestOnTop pauseOnFocusLoss={false} closeOnClick autoClose={4000} />
      </div>
    </Router>
  )
}

export default App
