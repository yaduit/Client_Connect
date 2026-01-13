import {Routes, Route } from 'react-router-dom';
import SearchPage from './pages/searchPage.jsx'
import ProviderDetailsPage from './pages/providerDetailsPage.jsx';
import HomePage from './pages/homePage.jsx';
function App() {
  return (
    <div>
      
      <Routes>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/' element={<SearchPage/>}/>
        <Route path='/providers/:id' element={<ProviderDetailsPage/>}/>
      </Routes>

     
    </div>
  )
}

export default App;