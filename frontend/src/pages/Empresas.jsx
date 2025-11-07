import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch(`${API_URL}/empresas`);
        if (!response.ok) {
          throw new Error('Erro ao carregar empresas');
        }
        const data = await response.json();
        setEmpresas(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">A carregar empresas...</div>
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Empresas Parceiras</h1>
          <p className="mt-2 text-lg text-gray-600">
            {empresas.length} empresa{empresas.length !== 1 ? 's' : ''} registada{empresas.length !== 1 ? 's' : ''}
          </p>
        </div>

        {empresas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma empresa encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {empresas.map((empresa) => (
              <div
                key={empresa.id_empresa}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {empresa.nome_empresa}
                  </h3>
                  {empresa.validada && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Validada
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  {empresa.NIF && (
                    <p><span className="font-medium">NIF:</span> {empresa.NIF}</p>
                  )}
                  {empresa.morada && (
                    <p><span className="font-medium">Morada:</span> {empresa.morada}</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to={`/estagios?empresa=${empresa.id_empresa}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Ver vagas desta empresa →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Empresas;
