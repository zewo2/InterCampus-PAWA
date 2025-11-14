# InterCampus

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Full-stack internship management platform built with Express.js (backend) and React + Vite (frontend). Connects students with companies for internship opportunities.

## Features

### Core Functionality
- 🔐 JWT-based authentication with role-based authorization
- 👥 Multiple user types: Students (Aluno), Companies (Empresa), Professors (Professor), Managers (Gestor)
- 🏢 Company profiles and validation system
- 📝 Internship offer management with advanced search and filtering
- 📋 Application tracking and status updates
- ⭐ Internship evaluations and progress tracking
- 🔍 Smart search with keyword expansion and location filtering

### User Experience
- 🎨 Modern, responsive UI with Tailwind CSS 4
- 🔔 Toast notifications with react-toastify
- 📊 Role-specific dashboards (Professor, Empresa, Gestor)
- 🖼️ Profile picture upload and management
- 🔄 Real-time data updates and statistics
- 📱 Mobile-friendly design

### Administration & Management
- 👨‍🏫 Professor dashboard for student supervision
- 🏢 Company dashboard for offer and application management
- 🛡️ Manager dashboard with validation controls and analytics
- 📈 Analytics and reporting features
- 📄 Document management for internship processes

### Legal & Security
- 📜 Terms and Conditions page
- 🔒 Privacy Policy (GDPR compliant)
- 🛡️ Secure password hashing (bcryptjs)
- 🔑 Token-based authentication with expiration handling
- 🚫 Role-based access control (RBAC)

## Project Structure

```
InterCampus/
├── backend/          # Express API server with MySQL
├── frontend/         # React + Vite + Tailwind UI
├── package.json      # Root scripts (concurrently)
└── README.md         # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL database server

## Quick Start

### 1. Install Dependencies

From the project root:

```bash
npm install
npm run install-all
```

Or install separately:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure Environment Variables

**Backend:** Copy and edit the backend environment file:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=intercampus_db
```

**Frontend:** Copy and edit the frontend environment file:

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Setup Database

Run the database initialization scripts:

```bash
cd backend
npm run init-db
```

This will:
1. Create the database
2. Create all tables
3. Populate with example data

**Or run steps individually:**
```bash
npm run create-db      # Create database
npm run create-tables  # Create tables
npm run seed-db        # Add example data
```

### 4. Run Development Servers

**Option 1: Run both servers together (recommended)**

From project root:

```bash
npm run dev
```

This starts:
- Backend on `http://localhost:3000`
- Frontend on `http://localhost:5173`

**Option 2: Run servers separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Available Scripts

### Root Level

- `npm run dev` - Start both backend and frontend in development mode
- `npm run start` - Start both backend and frontend in production mode
- `npm run install-all` - Install dependencies in both backend and frontend

### Backend

- `npm run dev` - Start backend with nodemon (auto-restart on changes)
- `npm start` - Start backend in production mode
- `npm run init-db` - Initialize database (create-db + create-tables + seed-db)
- `npm run create-db` - Create the database
- `npm run create-tables` - Create all database tables
- `npm run seed-db` - Populate database with example data
- `npm run reset-db` - Reset database (truncate all tables and reseed)

### Frontend

- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Public Endpoints
- `GET /api/home` - Homepage data (stats, featured offers)
- `GET /api/empresas` - List all companies
- `GET /api/ofertas` - List all internship offers

### Protected Endpoints
- `GET /api/candidaturas` - User's applications
- `GET /api/perfil` - User profile
- `POST /api/candidaturas` - Create application

See `backend/README.md` for complete API documentation.

## Database Setup

The application uses MySQL with the following schema:
- **Utilizador** - User accounts with role-based access
- **Empresa** - Company profiles
- **Aluno** - Student profiles with CV and skills
- **ProfessorOrientador** - Professor/advisor profiles
- **Gestor** - Manager profiles
- **OfertaEstagio** - Internship job offers
- **Candidatura** - Student applications to internships
- **Estagio** - Active internship records
- **Avaliacao** - Internship evaluations
- **OrientadorEmpresa** - Company supervisors

Run `npm run init-db` in the backend folder to set up everything automatically.

## Tech Stack

### Backend
- Express.js 5 - Web framework
- MySQL2 - Database client with promises
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - CORS middleware
- dotenv - Environment configuration
- nodemon - Development auto-restart

### Frontend
- React 19 - UI library
- Vite 7 - Build tool with HMR
- React Router DOM - Client-side routing
- Tailwind CSS 4 - Utility-first CSS framework
- ESLint - Code linting

## Development Notes

- Backend uses JWT tokens for authentication with role-based authorization
- Frontend stores auth tokens in localStorage
- Backend uses `mysql2/promise` for async/await database operations
- Frontend API calls use native fetch with proper authentication headers
- Database credentials are gitignored for security (`.env` files)
- Use `.env.example` files as templates
- CORS is configured to allow frontend requests from `http://localhost:5173`
- All passwords are hashed using bcryptjs before storage

## Default Login Credentials

After running `npm run init-db` in the backend, you can login with any of these test accounts:

### Students (Aluno)
- Email: `andre.gomes@my.istec.pt`
- Password: `InterCampus123!`

### Companies (Empresa)
- Email: `talento@farfetch.com`
- Password: `InterCampus123!`

### Professors (Professor)
- Email: `carolina.mendes@my.istec.pt`
- Password: `InterCampus123!`

### Managers (Gestor)
- Email: `gestor.01@istec.pt`
- Password: `InterCampus123!`

**Note:** All seeded accounts use the same default password: `InterCampus123!`

## Troubleshooting

### Backend won't start
- Check that all dependencies are installed: `cd backend && npm install`
- Verify MySQL is running and credentials in `.env` are correct
- Check that port 3000 is not in use
- Ensure `JWT_SECRET` is set in `.env`

### Frontend won't start
- Check that all dependencies are installed: `cd frontend && npm install`
- Verify port 5173 is available
- Check that `.env.local` exists with `VITE_API_URL`

### Database connection fails
- Verify MySQL server is running
- Check credentials in `backend/.env`
- Run `npm run init-db` to create database and tables
- Check firewall/network settings
- Ensure `DB_DATABASE` name matches in `.env` and scripts

### CORS errors
- Verify `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Check that backend is running on the expected port
- Clear browser cache and restart both servers

### Authentication issues
- Check that `JWT_SECRET` is set in `backend/.env`
- Verify token is being stored in localStorage
- Check browser console for authentication errors
- Try logging out and logging in again

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Citation

If you use this project in your academic work, please cite it as:

```
InterCampus - Internship Management Platform
Repository: https://github.com/zewo2/InterCampus-PAWA
Year: 2025
```

## Authors

Academic project developed at ISTEC for the PAWA course.

## Acknowledgments

- ISTEC faculty and staff
- Open-source community for libraries and tools used in this project
