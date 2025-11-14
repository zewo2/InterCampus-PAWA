# InterCampus Backend

Express.js REST API server with MySQL database integration.

## Tech Stack

- **Express.js 5** - Web framework
- **MySQL2** - MySQL client with Promise support
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **multer** - File upload handling
- **dotenv** - Environment variable management
- **nodemon** - Development auto-restart

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=intercampus_db
```

**Important:** Never commit `.env` to version control. It's already in `.gitignore`.

### Create Database

Run the initialization scripts to create and populate the database:

```bash
# Create database and tables
npm run init-db

# Or run steps individually:
npm run create-db      # Creates the database
npm run create-tables  # Creates all tables
npm run seed-db        # Populates with example data

# Reset database (truncate and reseed)
npm run reset-db

# Add profile picture support (migration)
npm run add-profile-pictures  # Adds profile_picture column and creates uploads directory
```

### Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000` with auto-restart on file changes.

### Start Production Server

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start with nodemon (auto-restart on changes)
- `npm start` - Start in production mode
- `npm run init-db` - Initialize database (create-db + create-tables + seed-db)
- `npm run create-db` - Create the database
- `npm run create-tables` - Create all database tables
- `npm run seed-db` - Populate database with example data
- `npm run reset-db` - Reset database (truncate all tables and reseed)
- `npm run add-profile-pictures` - Add profile_picture column to database and create uploads directory

## Project Structure

```
backend/
├── src/
│   ├── index.js              # Express app entry point
│   ├── controllers/          # Route handlers
│   │   ├── authController.js
│   │   ├── alunoController.js
│   │   ├── empresaController.js
│   │   ├── ofertaEstagioController.js
│   │   ├── candidaturaController.js
│   │   ├── estagioController.js
│   │   ├── avaliacaoController.js
│   │   ├── professorController.js
│   │   ├── gestorController.js
│   │   ├── homeController.js
│   │   ├── healthController.js
│   │   └── viewController.js
│   ├── routes/               # API routes
│   │   ├── index.js          # Route aggregator
│   │   ├── auth.js
│   │   ├── alunos.js
│   │   ├── empresas.js
│   │   ├── ofertas.js
│   │   ├── candidaturas.js
│   │   ├── estagios.js
│   │   ├── avaliacoes.js
│   │   ├── professores.js
│   │   ├── gestores.js
│   │   ├── home.js
│   │   └── views.js
│   ├── middlewares/          # Custom middleware
│   │   ├── authMiddleware.js        # JWT verification & authorization
│   │   ├── uploadMiddleware.js      # File upload handling with extension whitelist
│   │   ├── documentUploadMiddleware.js # Document upload middleware
│   │   └── errorHandler.js          # Global error handler
│   ├── models/               # Data models
│   │   └── userModel.js
│   └── database/             # Database scripts
│       ├── db.js             # MySQL connection pool
│       ├── createdatabase.js
│       ├── createtables.js
│       ├── exampledata.js
│       ├── resetdb.js
│       └── addProfilePicture.js  # Migration to add profile pictures
├── uploads/                  # User uploaded files (gitignored)
│   └── profile-pictures/     # Profile picture storage
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment template
├── .gitignore
└── package.json
```

## API Endpoints

### Authentication
```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login user (returns JWT token and user object)
GET    /api/auth/me              # Get current user with profile picture (protected)
PUT    /api/auth/update-profile  # Update user profile with optional picture upload (protected, multipart/form-data)
POST   /api/auth/recover-password # Password recovery (placeholder)
```

### Static Files
```
GET    /uploads/profile-pictures/:filename  # Access uploaded profile pictures
```

### Home
```
GET    /api/home             # Get homepage data (stats, featured offers, categories)
```

### Empresas
```
GET    /api/empresas         # Get all companies (public)
GET    /api/empresas/:id     # Get company by ID (public)
POST   /api/empresas         # Create company (protected: Empresa)
PUT    /api/empresas/:id     # Update company (protected: Empresa, Gestor)
PATCH  /api/empresas/:id/validate  # Validate company (protected: Gestor)
GET    /api/empresas/:id/ofertas   # Get company's job offers (public)
```

### Ofertas de Estágio
```
GET    /api/ofertas          # Get all offers (public)
GET    /api/ofertas/:id      # Get offer by ID (public)
POST   /api/ofertas          # Create offer (protected: Empresa)
PUT    /api/ofertas/:id      # Update offer (protected: Empresa, Gestor)
DELETE /api/ofertas/:id      # Delete offer (protected: Empresa, Gestor)
GET    /api/ofertas/:id/candidaturas  # Get offer applications (protected: Empresa, Gestor)
```

### Candidaturas
```
GET    /api/candidaturas     # Get all applications (protected, filtered by role)
GET    /api/candidaturas/:id # Get application by ID (protected)
POST   /api/candidaturas     # Create application (protected: Aluno)
PATCH  /api/candidaturas/:id/status  # Update status (protected: Empresa, Gestor)
DELETE /api/candidaturas/:id # Delete application (protected: Aluno, Gestor)
```

### Alunos
```
GET    /api/alunos           # Get all students (protected)
GET    /api/alunos/:id       # Get student by ID (protected)
PUT    /api/alunos/:id       # Update student (protected: Aluno, Gestor)
DELETE /api/alunos/:id       # Delete student (protected: Gestor)
GET    /api/alunos/:id/candidaturas  # Get student's applications (protected)
GET    /api/alunos/:id/estagio        # Get student's internship (protected)
```

### Estágios
```
GET    /api/estagios         # Get all internships (protected)
GET    /api/estagios/:id     # Get internship by ID (protected)
POST   /api/estagios         # Create internship (protected: Gestor)
PUT    /api/estagios/:id     # Update internship (protected: Gestor)
DELETE /api/estagios/:id     # Delete internship (protected: Gestor)
GET    /api/estagios/:id/avaliacoes  # Get internship evaluations (protected)
```

### Avaliações
```
GET    /api/avaliacoes       # Get all evaluations (protected)
GET    /api/avaliacoes/:id   # Get evaluation by ID (protected)
POST   /api/avaliacoes       # Create evaluation (protected: Professor, Empresa)
PUT    /api/avaliacoes/:id   # Update evaluation (protected: Professor, Empresa)
DELETE /api/avaliacoes/:id   # Delete evaluation (protected: Gestor)
```

### Professores
```
GET    /api/professores      # Get all professors (protected)
GET    /api/professores/:id  # Get professor by ID (protected)
PUT    /api/professores/:id  # Update professor (protected: Professor, Gestor)
GET    /api/professores/:id/estagios  # Get supervised internships (protected)
```

### Gestores
```
GET    /api/gestores         # Get all managers (protected: Gestor)
GET    /api/gestores/dashboard  # Get dashboard stats (protected: Gestor)
```

### Health Check
```
GET    /api/health           # Server health check
```

### View Routes (Dummy Pages)
```
GET    /login                # Login page placeholder
GET    /register             # Register page placeholder
GET    /dashboard            # Dashboard page placeholder
GET    /ofertas              # Offers page placeholder
GET    /perfil               # Profile page placeholder
GET    /candidaturas         # Applications page placeholder
GET    /estagios             # Internships page placeholder
GET    /avaliacoes           # Evaluations page placeholder
GET    /empresas             # Companies page placeholder
GET    /alunos               # Students page placeholder
GET    /professores          # Professors page placeholder
```

## Database Connection

The app uses `mysql2/promise` for async/await database operations.

### Database Schema

The database includes the following tables:
- **Utilizador** - User accounts (Empresa, Aluno, Professor, Gestor) with profile_picture field
- **Empresa** - Company profiles
- **OrientadorEmpresa** - Company supervisors
- **Aluno** - Student profiles
- **Gestor** - Manager profiles
- **ProfessorOrientador** - Professor profiles
- **OfertaEstagio** - Internship offers
- **Candidatura** - Applications to internships
- **Estagio** - Active internships
- **Avaliacao** - Internship evaluations

### Using the Database Pool

```javascript
const { pool } = require('./db');

// Example query
async function getUsers() {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
}
```

### Connection Configuration

Database configuration is in `src/db.js`. It reads from environment variables:

- `DB_HOST` - MySQL server host
- `DB_PORT` - MySQL server port (default: 3306)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name

The pool settings:
- `connectionLimit: 10` - Max concurrent connections
- `waitForConnections: true` - Queue requests when limit reached
- `queueLimit: 0` - No limit on queued requests

## Error Handling

Global error handler in `src/middleware/errorHandler.js` catches all errors.

Example usage in routes:

```javascript
router.get('/example', async (req, res, next) => {
  try {
    // Your code here
    res.json({ success: true });
  } catch (error) {
    next(error); // Pass to error handler
  }
});
```

## Adding New Routes

1. Create controller in `src/controllers/`:

```javascript
// src/controllers/userController.js
exports.getUsers = async (req, res, next) => {
  try {
    const { pool } = require('../db');
    const [users] = await pool.query('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    next(error);
  }
};
```

2. Add route in `src/routes/index.js`:

```javascript
const { getUsers } = require('../controllers/userController');
router.get('/users', getUsers);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRES_IN` | JWT token expiration time | `24h` |
| `DB_HOST` | MySQL host | Required |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | Required |
| `DB_PASSWORD` | MySQL password | Required |
| `DB_DATABASE` | Database name | Required |

## Security Best Practices

- ✅ Environment variables in `.env` (gitignored)
- ✅ No hardcoded credentials in source code
- ✅ JWT authentication implemented
- ✅ Password hashing with bcryptjs
- ✅ Role-based authorization (Empresa, Aluno, Professor, Gestor)
- ✅ CORS configured for frontend
- ✅ Parameterized queries to prevent SQL injection
- ⚠️ Use strong JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Add rate limiting for production
- ⚠️ Add input validation (consider express-validator)

## Troubleshooting

### Server won't start

**Check dependencies:**
```bash
npm install
```

**Check port availability:**
```bash
# Windows PowerShell
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <process_id> /F
```

### Database connection fails

**Verify MySQL is running:**
```bash
# Check MySQL service status
```

**Test connection:**
```bash
mysql -h localhost -u your_user -p
```

**Check credentials in `.env`:**
- Ensure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` are correct
- Database must exist (create it if needed)

**Check firewall:**
- Ensure MySQL port (3306) is accessible

### Module not found

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Auto-restart on changes
`nodemon` watches `src/` folder and restarts automatically.

### Database Migrations
Consider adding a migration tool like:
- `knex` - SQL query builder with migrations
- `sequelize` - ORM with migrations
- `db-migrate` - Database migration framework

### API Testing
Use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl
- Insomnia

Example curl test:
```bash
curl http://localhost:3000/api/health
```

## Next Steps

- [x] Add authentication (JWT)
- [x] Add role-based authorization
- [x] Add CORS configuration for frontend
- [x] Add database scripts (create, seed, reset)
- [x] Add file upload support (multer) for profile pictures
- [ ] Add input validation (express-validator, joi)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add unit tests (Jest, Mocha)
- [ ] Add logging (winston, morgan)
- [ ] Add rate limiting (express-rate-limit)
- [ ] Add file upload support for CVs and documents

## Learn More

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
