import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LocationProvider } from './context/location/locationProvider.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <LocationProvider>
      <App />
    </LocationProvider>
    </BrowserRouter>
  </StrictMode>,
)
