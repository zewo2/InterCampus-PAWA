# InterCampus Frontend

React + Vite frontend application with Tailwind CSS.

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Fast build tool with HMR
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **ESLint** - Code linting

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
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── pages/        # Page components
│   │   ├── Auth/     # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Recovery.jsx
│   │   ├── App.jsx         # Main app with routing
│   │   ├── Home.jsx        # Homepage with stats & featured offers
│   │   ├── Profile.jsx     # User profile page with picture upload
│   │   ├── Empresas.jsx    # Companies list page
│   │   ├── Estagios.jsx    # Internship offers list page
│   │   ├── Candidaturas.jsx # User applications page
│   │   └── Contacts.jsx
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

- `/` - Home page with stats and featured internships
- `/login` - Login page
- `/register` - Registration page
- `/perfil` - User profile (protected)
- `/empresas` - Companies list
- `/estagios` - Internship offers list
- `/candidaturas` - User applications (protected)

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

