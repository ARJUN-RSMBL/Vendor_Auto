import { Navigate, Route, Routes } from 'react-router-dom'
import VendorTableComponent from '../pages/VendorTableComponent'
import LoginComponent from '../components/LoginComponent';
import Home from '../components/Home';
import VendorFormComponent from '../pages/VendorFormComponent';
import RegisterComponent from '../components/RegisterComponent';
import { isAdminUser, isUserLoggedIn } from '../services/authService';
import PropTypes from 'prop-types'
import WelcomeAdminComponent from '../components/WelcomeAdminComponent'


function Routers() {

    const isAdmin = isAdminUser();

    function AuthenticatedRoute({ children }) {

        const isAuth = isUserLoggedIn();

        if (isAuth) {
            return children;
        }

        if (isAdmin) {
            return <Navigate to="/" />
        } else {
            return <Navigate to="/login" />
        }

    }

    AuthenticatedRoute.propTypes = {
        children: PropTypes.node, // Add this line for 'children' prop
    };

    return (
        <>
            <Routes>

                {isAdmin && <Route path='/' element={<WelcomeAdminComponent />} />}
                {!isAdmin && <Route path='/' element={<Home />} />}

                <Route path='/register' element={<AuthenticatedRoute>
                    <RegisterComponent /></AuthenticatedRoute>}></Route>
                <Route path='/login' element={<LoginComponent />}></Route>
                <Route path='/form' element={<AuthenticatedRoute>
                    <VendorFormComponent /></AuthenticatedRoute>}></Route>
                <Route path='/vendors' element={<AuthenticatedRoute>
                    <VendorTableComponent /></AuthenticatedRoute>}></Route>
            </Routes>

        </>
    )

}

export default Routers