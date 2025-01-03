import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import Routers from '../src/Routes/Routers'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {


  return (
    <>
      <HeaderComponent />
      <Routers />
      <FooterComponent />
    </>
  )
}

export default App