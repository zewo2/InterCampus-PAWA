// Placeholder controller for view routes (pages under construction)

exports.loginPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Login - InterCampus</title></head>
      <body>
        <h1>Login Page</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/auth/login</p>
      </body>
    </html>
  `);
};

exports.registerPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Registo - InterCampus</title></head>
      <body>
        <h1>Registo Page</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/auth/register</p>
      </body>
    </html>
  `);
};

exports.dashboardPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Dashboard - InterCampus</title></head>
      <body>
        <h1>Dashboard</h1>
        <p>Esta página está em desenvolvimento.</p>
      </body>
    </html>
  `);
};

exports.ofertasPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Ofertas de Estágio - InterCampus</title></head>
      <body>
        <h1>Ofertas de Estágio</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/ofertas</p>
      </body>
    </html>
  `);
};

exports.ofertaDetailPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Detalhes da Oferta - InterCampus</title></head>
      <body>
        <h1>Detalhes da Oferta #${req.params.id}</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/ofertas/${req.params.id}</p>
      </body>
    </html>
  `);
};

exports.perfilPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Perfil - InterCampus</title></head>
      <body>
        <h1>Perfil do Utilizador</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/auth/me</p>
      </body>
    </html>
  `);
};

exports.candidaturasPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Minhas Candidaturas - InterCampus</title></head>
      <body>
        <h1>Minhas Candidaturas</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/candidaturas</p>
      </body>
    </html>
  `);
};

exports.estagiosPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Estágios - InterCampus</title></head>
      <body>
        <h1>Gestão de Estágios</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/estagios</p>
      </body>
    </html>
  `);
};

exports.avaliacoesPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Avaliações - InterCampus</title></head>
      <body>
        <h1>Avaliações</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/avaliacoes</p>
      </body>
    </html>
  `);
};

exports.empresasPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Empresas - InterCampus</title></head>
      <body>
        <h1>Empresas</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/empresas</p>
      </body>
    </html>
  `);
};

exports.alunosPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Alunos - InterCampus</title></head>
      <body>
        <h1>Alunos</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/alunos</p>
      </body>
    </html>
  `);
};

exports.professoresPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Professores - InterCampus</title></head>
      <body>
        <h1>Professores Orientadores</h1>
        <p>Esta página está em desenvolvimento. Use a API em /api/professores</p>
      </body>
    </html>
  `);
};

exports.notFoundPage = (req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head><title>404 - InterCampus</title></head>
      <body>
        <h1>404 - Página Não Encontrada</h1>
        <p>A página que procura não existe.</p>
        <p><a href="/">Voltar ao início</a></p>
      </body>
    </html>
  `);
};
