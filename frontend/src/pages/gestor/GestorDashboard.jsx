import React from 'react';
import { useOutletContext } from 'react-router-dom';

const metricCards = [
  {
    key: 'total_empresas',
    title: 'Empresas ativas',
    description: 'Entidades com validação concluída'
  },
  {
    key: 'empresas_pendentes',
    title: 'Empresas pendentes',
    description: 'Aguardam revisão do gestor'
  },
  {
    key: 'total_candidaturas',
    title: 'Candidaturas totais',
    description: 'Volume global submetido'
  },
  {
    key: 'candidaturas_pendentes',
    title: 'Candidaturas pendentes',
    description: 'Sem decisão registada'
  },
  {
    key: 'total_estagios',
    title: 'Estágios ativos',
    description: 'Processos em execução ou concluídos'
  },
  {
    key: 'total_ofertas',
    title: 'Ofertas de estágio',
    description: 'Vagas publicadas pelas empresas'
  },
  {
    key: 'total_alunos',
    title: 'Alunos inscritos',
    description: 'Perfil académico validado'
  }
];

const GestorDashboard = () => {
  const { stats, loadingStats, statsError, reloadStats } = useOutletContext() || {};

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Visão geral</p>
          <h1 className="text-3xl font-semibold text-gray-900">Painel do gestor</h1>
          <p className="mt-2 text-sm text-gray-500">Monitoriza rapidamente os principais indicadores da plataforma e identifica pendências críticas.</p>
        </div>
        <button
          onClick={reloadStats}
          disabled={loadingStats}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M6.34 2.77a8 8 0 019.04 1.53l.19.2V2.5a.75.75 0 011.5 0v4a.75.75 0 01-.75.75h-4a.75.75 0 010-1.5h2.62l-.07-.07a6.5 6.5 0 10.9 8.58.75.75 0 011.2.9 8 8 0 11-10.63-11.39z" clipRule="evenodd" />
          </svg>
          {loadingStats ? 'A atualizar…' : 'Atualizar dados'}
        </button>
      </header>

      {statsError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {statsError}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((card) => (
          <div key={card.key} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">
              {loadingStats ? '—' : Number(stats?.[card.key] || 0)}
            </p>
            <p className="mt-2 text-xs text-gray-500">{card.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Alertas rápidos</h2>
          <p className="mt-2 text-sm text-gray-500">As principais ações pendentes ficam aqui em destaque para facilitar o planeamento do gestor.</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>
              <span className="font-semibold text-gray-700">{Number(stats?.empresas_pendentes || 0)}</span> empresa(s) aguardam validação.
            </li>
            <li>
              <span className="font-semibold text-gray-700">{Number(stats?.candidaturas_pendentes || 0)}</span> candidatura(s) aguardam decisão.
            </li>
            <li>
              <span className="font-semibold text-gray-700">{Number(stats?.total_ofertas || 0)}</span> ofertas ativas na plataforma.
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Próximos passos</h2>
          <p className="mt-2 text-sm text-gray-500">Utiliza os módulos à esquerda para validar empresas, acompanhar candidaturas e atribuir orientadores.</p>
          <div className="mt-4 grid gap-3 text-sm text-gray-600">
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="font-semibold text-blue-700">1. Validar novas empresas</p>
              <p className="text-xs text-blue-600">Confirma dados e desbloqueia a participação.</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="font-semibold text-amber-700">2. Acompanhar candidaturas</p>
              <p className="text-xs text-amber-600">Monitoriza estados e cria estágios quando necessário.</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="font-semibold text-emerald-700">3. Atribuir orientadores</p>
              <p className="text-xs text-emerald-600">Garante acompanhamento académico e empresarial.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GestorDashboard;
