import { Route, Routes } from 'react-router-dom'
import VendorTableComponent from '../pages/VendorTableComponent'
import LoginComponent from '../components/LoginComponent';
import Home from '../components/Home';
import VendorFormComponent from '../pages/VendorFormComponent';
import RegisterComponent from '../components/RegisterComponent';


function Routers() {

    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/form' element={<VendorFormComponent />}></Route>
                <Route path='/vendors' element={<VendorTableComponent />}></Route>
                <Route path='/login' element={<LoginComponent />}></Route>
                <Route path='/register' element={<RegisterComponent />} />
            </Routes>

        </>
    )

}

export default Routers