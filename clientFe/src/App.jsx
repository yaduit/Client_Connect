import {Routes, Route } from 'react-router-dom';
import SearchPage from './pages/searchPage.jsx'
import ProviderDetailsPage from './pages/providerDetailsPage.jsx';
function App() {
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<SearchPage/>}/>
        <Route path='/providers/:id' element={<ProviderDetailsPage/>}/>
      </Routes>

     
    </div>
  )
}

export default App;