import React from 'react';

const Privacidade = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
          <p className="text-sm text-gray-500 mb-8">Última atualização: 14 de novembro de 2025</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introdução</h2>
              <p className="mb-4">
                A InterCampus está comprometida com a proteção da privacidade e dos dados pessoais dos seus utilizadores. 
                Esta Política de Privacidade descreve como recolhemos, utilizamos, armazenamos e protegemos as suas 
                informações pessoais.
              </p>
              <p>
                Esta política aplica-se a todos os utilizadores da plataforma InterCampus: estudantes, empresas, 
                professores orientadores e gestores académicos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Dados Pessoais Recolhidos</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Informações de Registo</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Nome completo</li>
                <li>Endereço de email</li>
                <li>Palavra-passe (armazenada de forma encriptada)</li>
                <li>Tipo de utilizador (Estudante, Empresa, Professor, Gestor)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Informações de Perfil - Estudantes</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Curso académico</li>
                <li>Competências e áreas de interesse</li>
                <li>Currículo vitae (CV)</li>
                <li>Fotografia de perfil (opcional)</li>
                <li>Histórico de candidaturas e estágios</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Informações de Perfil - Empresas</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Nome da empresa e NIF</li>
                <li>Morada e contactos</li>
                <li>Informações sobre orientadores de estágio</li>
                <li>Ofertas de estágio publicadas</li>
                <li>Estado de validação</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.4 Dados de Utilização</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Endereço IP e informações do dispositivo</li>
                <li>Páginas visitadas e tempo de navegação</li>
                <li>Ações realizadas na plataforma</li>
                <li>Data e hora de acesso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Finalidade do Tratamento de Dados</h2>
              <p className="mb-4">Os dados pessoais recolhidos são utilizados para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Criar e gerir contas de utilizador</li>
                <li>Facilitar o processo de candidatura a estágios</li>
                <li>Permitir a comunicação entre estudantes, empresas e orientadores</li>
                <li>Acompanhar e avaliar o progresso de estágios</li>
                <li>Melhorar a experiência do utilizador e funcionalidades da plataforma</li>
                <li>Garantir a segurança e prevenir fraudes</li>
                <li>Cumprir obrigações legais e regulamentares</li>
                <li>Enviar notificações importantes relacionadas com a conta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Base Legal para o Tratamento</h2>
              <p className="mb-4">
                O tratamento dos seus dados pessoais baseia-se em:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consentimento:</strong> Ao criar uma conta, você consente o tratamento dos seus dados</li>
                <li><strong>Execução de contrato:</strong> Para fornecer os serviços solicitados</li>
                <li><strong>Interesse legítimo:</strong> Para melhorar os nossos serviços e garantir segurança</li>
                <li><strong>Obrigação legal:</strong> Para cumprir requisitos legais aplicáveis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Partilha de Dados</h2>
              <p className="mb-4">
                Os seus dados pessoais podem ser partilhados com:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Empresas:</strong> Quando candidata-se a uma oferta de estágio</li>
                <li><strong>Orientadores académicos:</strong> Para acompanhamento de estágios em curso</li>
                <li><strong>Gestores académicos:</strong> Para administração e validação de processos</li>
                <li><strong>Prestadores de serviços:</strong> Fornecedores de hosting, email e análise (sob acordo de confidencialidade)</li>
                <li><strong>Autoridades:</strong> Quando legalmente obrigatório</li>
              </ul>
              <p className="mt-4">
                <strong>Não vendemos nem alugamos os seus dados pessoais a terceiros.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Segurança dos Dados</h2>
              <p className="mb-4">
                A InterCampus implementa medidas técnicas e organizacionais para proteger os seus dados:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encriptação de palavras-passe com algoritmos seguros (bcrypt)</li>
                <li>Conexões HTTPS para transmissão segura de dados</li>
                <li>Controlo de acesso baseado em funções (RBAC)</li>
                <li>Monitorização de segurança e logs de auditoria</li>
                <li>Backups regulares dos dados</li>
                <li>Formação em segurança para colaboradores</li>
              </ul>
              <p className="mt-4">
                Apesar das medidas de segurança, nenhum sistema é 100% seguro. Recomendamos que utilize palavras-passe 
                fortes e não as partilhe com terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Retenção de Dados</h2>
              <p className="mb-4">
                Os seus dados pessoais são conservados pelo tempo necessário para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornecer os nossos serviços</li>
                <li>Cumprir obrigações legais</li>
                <li>Resolver disputas</li>
                <li>Fazer valer os nossos acordos</li>
              </ul>
              <p className="mt-4">
                Após a eliminação da conta, os dados pessoais são removidos permanentemente num prazo de 30 dias, 
                exceto quando a sua conservação for legalmente exigida.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Os Seus Direitos</h2>
              <p className="mb-4">
                De acordo com o Regulamento Geral sobre a Proteção de Dados (RGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Acesso:</strong> Obter confirmação sobre o tratamento dos seus dados</li>
                <li><strong>Retificação:</strong> Corrigir dados incorretos ou incompletos</li>
                <li><strong>Eliminação:</strong> Solicitar a eliminação dos seus dados ("direito ao esquecimento")</li>
                <li><strong>Limitação:</strong> Restringir o tratamento em determinadas circunstâncias</li>
                <li><strong>Portabilidade:</strong> Receber os seus dados em formato estruturado</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento baseado em interesses legítimos</li>
                <li><strong>Retirar consentimento:</strong> A qualquer momento, sem afetar a licitude do tratamento anterior</li>
              </ul>
              <p className="mt-4">
                Para exercer estes direitos, contacte-nos através de privacy@intercampus.pt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cookies e Tecnologias Semelhantes</h2>
              <p className="mb-4">
                A plataforma utiliza cookies e tecnologias semelhantes para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Manter a sessão do utilizador ativa</li>
                <li>Memorizar preferências</li>
                <li>Analisar o tráfego e padrões de utilização</li>
                <li>Melhorar a experiência do utilizador</li>
              </ul>
              <p className="mt-4">
                Pode configurar o seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades 
                da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Menores de Idade</h2>
              <p>
                A plataforma InterCampus destina-se a estudantes com idade igual ou superior a 16 anos. Se tivermos 
                conhecimento de que recolhemos dados de menores sem autorização parental adequada, tomaremos medidas 
                para eliminar essas informações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Transferências Internacionais</h2>
              <p>
                Os dados pessoais são armazenados em servidores localizados na União Europeia. Caso seja necessária 
                uma transferência para países fora da UE, garantiremos que existem salvaguardas adequadas de acordo 
                com o RGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Alterações a esta Política</h2>
              <p>
                Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos os utilizadores sobre 
                alterações significativas através de email ou notificação na plataforma. A data da última atualização 
                será sempre indicada no topo deste documento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Autoridade de Controlo</h2>
              <p className="mb-4">
                Tem o direito de apresentar uma reclamação junto da autoridade de controlo:
              </p>
              <div className="ml-4 space-y-1">
                <p><strong>Comissão Nacional de Proteção de Dados (CNPD)</strong></p>
                <p>Av. D. Carlos I, 134, 1º</p>
                <p>1200-651 Lisboa, Portugal</p>
                <p>Tel: +351 213 928 400</p>
                <p>Email: geral@cnpd.pt</p>
                <p>Website: www.cnpd.pt</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contacto</h2>
              <p className="mb-4">
                Para questões relacionadas com privacidade e proteção de dados, contacte o nosso Encarregado de 
                Proteção de Dados:
              </p>
              <ul className="space-y-1 ml-4">
                <li><strong>Email:</strong> privacy@intercampus.pt</li>
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

export default Privacidade;
