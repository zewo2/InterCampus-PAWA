import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'
import Footer from '../components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

          <h1 className="text-4xl md:text-6xl font-bold text-blue-600 text-center">
      Tailwind v4 a funcionar
    </h1>
    <p className="mt-4 text-gray-600 text-center">
      Utilitários responsivos (sm:, md:, lg:) ok.
    </p>
    
      <Footer />
    </>
  )
}

export default App

// include footer under the main app render by adding Footer in the component tree
