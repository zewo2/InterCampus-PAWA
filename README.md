# InterCampus

Full-stack web application built with Express.js (backend) and React + Vite (frontend).

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

Copy and edit the backend environment file:

```bash
cd backend
# Edit .env with your database credentials
```

Required environment variables in `backend/.env`:
- `PORT` - Backend server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port (default: 3306)
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_DATABASE` - Database name

### 3. Run Development Servers

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

### Frontend

- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### Health Check

```
GET http://localhost:3000/
GET http://localhost:3000/api/health
```

## Database Setup

1. Create a MySQL database
2. Update `backend/.env` with your credentials
3. The backend will automatically attempt to connect on startup

## Tech Stack

### Backend
- Express.js - Web framework
- MySQL2 - Database client
- dotenv - Environment configuration
- nodemon - Development auto-restart

### Frontend
- React 19 - UI library
- Vite - Build tool
- Tailwind CSS - Styling
- ESLint - Code linting

## Development Notes

- Backend uses `mysql2/promise` for async/await database operations
- Frontend is configured to call backend API at `http://localhost:3000/api` (see `frontend/.env.local`)
- Database credentials are gitignored for security
- Use `.env.example` as a template for required environment variables

## Troubleshooting

### Backend won't start
- Check that all dependencies are installed: `cd backend && npm install`
- Verify MySQL is running and credentials in `.env` are correct
- Check that port 3000 is not in use

### Frontend won't start
- Check that all dependencies are installed: `cd frontend && npm install`
- Verify port 5173 is available

### Database connection fails
- Verify MySQL server is running
- Check credentials in `backend/.env`
- Ensure the database exists
- Check firewall/network settings

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private project for ISTEC
