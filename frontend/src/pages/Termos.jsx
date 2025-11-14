import React from 'react';

const Termos = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Termos e Condições</h1>
          <p className="text-sm text-gray-500 mb-8">Última atualização: 14 de novembro de 2025</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="mb-4">
                Ao aceder e utilizar a plataforma InterCampus, você concorda em estar vinculado a estes Termos e Condições. 
                Se não concordar com qualquer parte destes termos, não deve utilizar a nossa plataforma.
              </p>
              <p>
                A InterCampus reserva-se o direito de modificar estes termos a qualquer momento. As alterações entrarão 
                em vigor imediatamente após a sua publicação na plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p className="mb-4">
                A InterCampus é uma plataforma digital que conecta estudantes em busca de estágios profissionais com 
                empresas que oferecem oportunidades de formação prática. Os nossos serviços incluem:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Publicação e pesquisa de ofertas de estágio</li>
                <li>Gestão de candidaturas e processos de seleção</li>
                <li>Acompanhamento de estágios em curso</li>
                <li>Ferramentas de comunicação entre estudantes, empresas e orientadores académicos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Requisitos de Registo</h2>
              <p className="mb-4">
                Para utilizar determinadas funcionalidades da plataforma, é necessário criar uma conta. Ao registar-se, 
                compromete-se a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
                <li>Manter a segurança da sua palavra-passe</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta</li>
                <li>Ser responsável por todas as atividades que ocorram sob a sua conta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Responsabilidades dos Utilizadores</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Estudantes</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Garantir a veracidade das informações fornecidas no perfil e candidaturas</li>
                <li>Manter o CV e competências atualizados</li>
                <li>Comunicar de forma profissional com empresas e orientadores</li>
                <li>Cumprir os compromissos assumidos em processos de candidatura</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Empresas</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Publicar apenas ofertas de estágio legítimas e em conformidade com a legislação</li>
                <li>Fornecer descrições precisas das vagas e requisitos</li>
                <li>Tratar os dados dos candidatos com confidencialidade</li>
                <li>Respeitar os prazos e compromissos assumidos nos processos de seleção</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Professores Orientadores</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acompanhar os estudantes sob sua orientação de forma ativa</li>
                <li>Manter a confidencialidade das informações académicas</li>
                <li>Realizar avaliações justas e fundamentadas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Conteúdo do Utilizador</h2>
              <p className="mb-4">
                Ao publicar conteúdo na plataforma (CVs, cartas de motivação, descrições de vagas, etc.), você:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mantém todos os direitos de propriedade sobre o seu conteúdo</li>
                <li>Concede à InterCampus uma licença para exibir e processar esse conteúdo na plataforma</li>
                <li>Garante que possui os direitos necessários para publicar o conteúdo</li>
                <li>Concorda que o conteúdo não viola direitos de terceiros nem contém material ilegal</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Uso Proibido</h2>
              <p className="mb-4">É expressamente proibido:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Utilizar a plataforma para qualquer finalidade ilegal ou não autorizada</li>
                <li>Publicar conteúdo falso, enganoso ou fraudulento</li>
                <li>Assediar, intimidar ou discriminar outros utilizadores</li>
                <li>Tentar aceder a contas ou dados de outros utilizadores sem autorização</li>
                <li>Distribuir vírus, malware ou outro código malicioso</li>
                <li>Fazer scraping ou extrair dados da plataforma através de meios automatizados</li>
                <li>Interferir com o funcionamento normal da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Propriedade Intelectual</h2>
              <p className="mb-4">
                Todos os direitos de propriedade intelectual relacionados com a plataforma InterCampus, incluindo mas 
                não limitado a software, design, logótipos, textos e gráficos, pertencem à InterCampus ou aos seus 
                licenciadores.
              </p>
              <p>
                É proibida a reprodução, distribuição ou criação de obras derivadas sem autorização prévia por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitação de Responsabilidade</h2>
              <p className="mb-4">
                A InterCampus não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A veracidade das informações fornecidas pelos utilizadores</li>
                <li>O resultado de processos de candidatura ou estágios</li>
                <li>Disputas entre estudantes, empresas e orientadores</li>
                <li>Perda de dados devido a falhas técnicas ou ataques informáticos</li>
                <li>Danos indiretos ou consequenciais resultantes do uso da plataforma</li>
              </ul>
              <p className="mt-4">
                A plataforma é fornecida "como está" sem garantias de qualquer tipo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Suspensão e Cancelamento</h2>
              <p className="mb-4">
                A InterCampus reserva-se o direito de suspender ou cancelar contas que:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violem estes Termos e Condições</li>
                <li>Sejam reportadas por comportamento inadequado</li>
                <li>Estejam inativas por períodos prolongados</li>
                <li>Representem riscos de segurança para a plataforma</li>
              </ul>
              <p className="mt-4">
                Os utilizadores podem cancelar as suas contas a qualquer momento através das definições de perfil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Lei Aplicável</h2>
              <p>
                Estes Termos e Condições são regidos pela legislação portuguesa. Qualquer disputa será resolvida nos 
                tribunais competentes de Portugal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contacto</h2>
              <p className="mb-2">
                Para questões sobre estes Termos e Condições, contacte-nos através de:
              </p>
              <ul className="space-y-1 ml-4">
                <li><strong>Email:</strong> legal@intercampus.pt</li>
                <li><strong>Telefone:</strong> +351 220 100 200</li>
                <li><strong>Morada:</strong> Campus ISTEC, Porto, Portugal</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Termos;
