import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AbrirClientes from './Components/AbrirClientes';
function App() {
  return (
    <BrowserRouter> 
    <Routes> 
      <Route path='/' element={<AbrirClientes></AbrirClientes>}></Route>
    </Routes>
    </BrowserRouter>

  );
}

export default App;
