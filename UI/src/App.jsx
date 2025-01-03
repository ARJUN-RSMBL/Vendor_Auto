import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import Routers from '../src/Routes/Routers'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';

function App() {


  return (
    <>
     <div className="d-flex flex-column min-vh-100">
     <HeaderComponent />
      <Routers />
      <FooterComponent />
      <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  )
}

export default App