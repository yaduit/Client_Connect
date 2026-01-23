import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LocationProvider } from './context/location/locationProvider.jsx'
import AuthProvider from './context/auth/authProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider> 
    <LocationProvider>
      <App />
    </LocationProvider>
     </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
