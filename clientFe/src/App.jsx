import {Routes, Route } from 'react-router-dom';
import SearchPage from './pages/searchPage.jsx'
import ProviderDetailsPage from './pages/provider/providerDetailsPage.jsx';
import HomePage from './pages/homePage.jsx';
import CategoryPage from './pages/categoryPage.jsx';
function App() {
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/search' element={<SearchPage/>}/>
        <Route path='/categories/:categorySlug' element={<CategoryPage/>}/>
        <Route path='/providers/:id' element={<ProviderDetailsPage/>}/>
      </Routes>

     
    </div>
  )
}

export default App;