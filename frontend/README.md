# InterCampus Frontend

React + Vite frontend application with Tailwind CSS.

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Fast build tool with HMR
- **Tailwind CSS 4** - Utility-first CSS framework
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
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images, fonts, etc.
│   ├── components/   # Reusable React components
│   ├── pages/        # Page components
│   │   ├── Auth/     # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Recovery.jsx
│   │   ├── Home.jsx
│   │   ├── Contacts.jsx
│   │   └── App.jsx
│   ├── styles/       # CSS files
│   └── main.jsx      # Entry point
├── index.html
├── vite.config.js
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
// Using fetch
const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
const data = await response.json();

// Or install axios: npm install axios
import axios from 'axios';
const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/health`);
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

