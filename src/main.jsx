import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
console.log("Sistema cargado correctamente");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
