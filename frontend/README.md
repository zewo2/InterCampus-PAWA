# InterCampus Frontend

React + Vite frontend application with Tailwind CSS.

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Fast build tool with HMR
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing with nested routes
- **react-toastify** - Toast notifications for user feedback
- **ESLint** - Code linting

## Key Features

### User Interface
- Responsive design with Tailwind CSS 4
- Modern glassmorphism effects and gradients
- Toast notifications for all user actions
- Loading states and error handling
- Profile picture upload and display

### Navigation
- Conditional Header/Footer rendering (hidden in dashboards)
- Dashboard button in header for authenticated users with roles
- "Return to Website" button in all dashboards
- Role-based route protection with RequireRole component

### Data Management
- Dynamic data fetching from backend API
- Real-time search and filtering (location, category, keywords)
- Keyword-based OR search for internship offers
- Category detection from internship requirements
- Application status tracking

### Authentication & Authorization
- JWT token management
- LocalStorage persistence with userUpdated events
- 401 error handling with automatic logout
- Role-based redirects after login
- Protected routes with authentication checks

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173` with hot module replacement.

### Build for Production

```bash
npm run build
```

Outputs to `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Environment Variables

The frontend uses Vite environment variables (prefixed with `VITE_`).

Create or edit `.env.local`:

```
VITE_API_URL=http://localhost:3000/api
VITE_BACKEND_URL=http://localhost:3000
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const backendUrl = import.meta.env.VITE_BACKEND_URL;
```

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images, fonts, brand assets
│   ├── components/   # Reusable React components
│   │   ├── Header.jsx    # Navigation header with dashboard button
│   │   └── Footer.jsx    # Footer with legal links
│   ├── pages/        # Page components
│   │   ├── Auth/     # Authentication pages
│   │   │   ├── Login.jsx      # Login with role-based redirect
│   │   │   ├── Register.jsx   # User registration
│   │   │   └── Recovery.jsx   # Password recovery
│   │   ├── professor/         # Professor dashboard pages
│   │   │   ├── ProfessorLayout.jsx
│   │   │   ├── DashboardProfessor.jsx
│   │   │   ├── ProfessorStudents.jsx
│   │   │   ├── ProfessorInternships.jsx
│   │   │   └── ProfessorDocuments.jsx
│   │   ├── empresa/           # Company dashboard pages
│   │   │   ├── EmpresaLayout.jsx
│   │   │   ├── EmpresaDashboard.jsx
│   │   │   ├── EmpresaPerfil.jsx
│   │   │   ├── EmpresaOfertas.jsx
│   │   │   └── EmpresaCandidaturas.jsx
│   │   ├── gestor/            # Manager dashboard pages
│   │   │   ├── GestorLayout.jsx
│   │   │   ├── GestorDashboard.jsx
│   │   │   ├── GestorEmpresasPendentes.jsx
│   │   │   ├── GestorProcessos.jsx
│   │   │   ├── GestorOrientadores.jsx
│   │   │   ├── GestorRelatorios.jsx
│   │   │   └── GestorLogs.jsx
│   │   ├── App.jsx              # Main app with routing and RequireRole
│   │   ├── Home.jsx             # Homepage with dynamic data
│   │   ├── Profile.jsx          # User profile with picture upload
│   │   ├── Empresas.jsx         # Companies list
│   │   ├── Estagios.jsx         # Internship offers with filters
│   │   ├── EstagioDetalhes.jsx  # Internship details and application
│   │   ├── Candidaturas.jsx     # User applications
│   │   ├── Contacts.jsx         # Contact page
│   │   ├── Termos.jsx           # Terms and Conditions
│   │   ├── Privacidade.jsx      # Privacy Policy
│   │   └── Fallback.jsx         # 404 page
│   ├── images/       # Image assets
│   ├── styles/       # CSS files
│   │   └── App.css
│   └── main.jsx      # Entry point
├── index.html
├── vite.config.js
├── eslint.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Making API Calls

The backend API URL is configured in `.env.local`. Example:

```javascript
// Get API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Public API call (no auth)
const response = await fetch(`${API_URL}/empresas`);
const data = await response.json();

// Protected API call (with JWT token)
const token = localStorage.getItem('token');
const response = await fetch(`${API_URL}/candidaturas`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// POST request (e.g., login)
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
});
const data = await response.json();

// File upload with FormData (e.g., profile picture)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const formData = new FormData();
formData.append('nome', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('profilePicture', fileObject); // File from input[type="file"]

const response = await fetch(`${API_URL}/auth/update-profile`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
    // Don't set Content-Type for FormData - browser sets it automatically
  },
  body: formData
});
const data = await response.json();

// Display uploaded image
if (user.profile_picture) {
  const imageUrl = `${BACKEND_URL}/${user.profile_picture}`;
  // Use imageUrl in <img src={imageUrl} />
}
```

## Routes

### Public Routes
- `/` - Home page with stats, featured internships, and category cards
- `/login` - Login page with role-based redirect
- `/register` - Registration page
- `/empresas` - Companies list with validation status
- `/estagios` - Internship offers list with advanced filters
- `/estagios/:id` - Internship details with application functionality
- `/contactos` - Contact page
- `/termos` - Terms and Conditions page
- `/privacidade` - Privacy Policy page (GDPR compliant)

### Protected Routes (Require Authentication)
- `/perfil` - User profile with picture upload
- `/candidaturas` - User applications list

### Professor Dashboard (Role: Professor)
- `/professor/dashboard` - Overview and statistics
- `/professor/alunos` - Supervised students
- `/professor/estagios` - Active internships
- `/professor/documentos` - Document management

### Company Dashboard (Role: Empresa)
- `/empresa/dashboard` - Company overview
- `/empresa/perfil` - Company profile and validation status
- `/empresa/ofertas` - Manage job offers
- `/empresa/candidaturas` - Review applications

### Manager Dashboard (Role: Gestor)
- `/gestor/dashboard` - System-wide statistics
- `/gestor/empresas` - Company validation queue
- `/gestor/processos` - Application and internship management
- `/gestor/orientadores` - Assign and manage supervisors
- `/gestor/relatorios` - Reports and analytics
- `/gestor/logs` - System activity logs

## Authentication

The app uses JWT tokens stored in localStorage:

```javascript
// After login/register
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

// Check if logged in
const user = localStorage.getItem('user');
const token = localStorage.getItem('token');

// Logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

## Vite Plugins

This template uses:
- `@vitejs/plugin-react` - Babel-based Fast Refresh
- `@tailwindcss/vite` - Tailwind CSS integration

## ESLint Configuration

The project includes ESLint with React-specific rules. Configuration in `eslint.config.js`.

To expand the ESLint configuration for production, consider:
- Adding TypeScript support
- Enabling type-aware lint rules
- See [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)

## React Compiler

The React Compiler is not enabled by default due to build performance impact. To add it, see [React Compiler documentation](https://react.dev/learn/react-compiler/installation).

## Troubleshooting

### Port 5173 already in use
Kill the process using the port or set a custom port:
```bash
npm run dev -- --port 3001
```

### Module not found errors
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Hot reload not working
- Check that you're editing files inside `src/`
- Restart the dev server
- Clear browser cache

## Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

