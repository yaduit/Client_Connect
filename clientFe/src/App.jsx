import {Routes, Route } from 'react-router-dom';
import SearchPage from './pages/searchPage.jsx'
import ProviderDetailsPage from './pages/provider/providerDetailsPage.jsx';
import HomePage from './pages/homePage.jsx';
import CategoryPage from './pages/categoryPage.jsx';
import ProviderOnboarding from './pages/provider/providerOnboarding.jsx';
import ProviderDashBoard from './pages/provider/providerDashBoard.jsx';
import LoginPage from './pages/auth/loginPage.jsx';
import SignupPage from './pages/auth/signupPage.jsx';
function App() {
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/search' element={<SearchPage/>}/>
        <Route path='/categories/:categorySlug' element={<CategoryPage/>}/>
        <Route path='/providers/:id' element={<ProviderDetailsPage/>}/>
        <Route path='/provider/onboarding' element={<ProviderOnboarding/>}/>
        <Route path='/provider/dashboard' element={<ProviderDashBoard/>}/>
      </Routes>

     
    </div>
  )
}

export default App;