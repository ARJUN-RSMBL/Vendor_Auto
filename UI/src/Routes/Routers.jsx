import { Navigate, Route, Routes } from 'react-router-dom'
import VendorTableComponent from '../pages/VendorTableComponent'
import LoginComponent from '../components/LoginComponent';
import Home from '../components/Home';
import VendorFormComponent from '../pages/VendorFormComponent';
import RegisterComponent from '../components/RegisterComponent';
import {
    isAdminUser,
    isUserLoggedIn,
    hasVendorAccess  // Add this import
} from '../services/authService';
import PropTypes from 'prop-types'
import WelcomeAdminComponent from '../components/WelcomeAdminComponent'
import DocumentTypeManagement from '../pages/DocumentTypeManagement';
import VendorDocumentsComponent from '../pages/VendorDocumentsComponent';

function Routers() {

    const isAdmin = isAdminUser();
    const isAuth = isUserLoggedIn();

    function AuthenticatedRoute({ children }) {
        if (isAuth) {
            return children;
        }
        return <Navigate to="/login" />
    }


    AuthenticatedRoute.propTypes = {
        children: PropTypes.node, // Add this line for 'children' prop
    };

    return (
        <>
            {/* <Routes>

                {isAdmin && <Route path='/welcome' element={<WelcomeAdminComponent />} />}
                {!isAdmin && <Route path='/' element={<Home />} />}

                <Route path='/register' element={<AuthenticatedRoute>
                    <RegisterComponent /></AuthenticatedRoute>}></Route>
                <Route path='/login' element={<LoginComponent />}></Route>
                <Route path='/form' element={<AuthenticatedRoute>
                    <VendorFormComponent /></AuthenticatedRoute>}></Route>
                <Route path='/vendors' element={<AuthenticatedRoute>
                    <VendorTableComponent /></AuthenticatedRoute>}></Route>
            </Routes> */}
            <Routes>
                {/* Public routes */}
                <Route path='/login' element={
                    isAuth ? (isAdmin ? <Navigate to="/welcome" /> : <Navigate to="/" />) : <LoginComponent />
                } />

                {/* Home route */}
                <Route path='/' element={
                    isAuth ? (isAdmin ? <Navigate to="/welcome" /> : <Home />) : <Home />
                } />

                {/* Admin routes */}
                <Route path='/welcome' element={
                    <AuthenticatedRoute>
                        {isAdmin ? <WelcomeAdminComponent /> : <Navigate to="/" />}
                    </AuthenticatedRoute>
                } />

                {/* Protected routes */}
                <Route path='/register' element={
                    // <AuthenticatedRoute>
                    <RegisterComponent />
                    // </AuthenticatedRoute>
                } />
                <Route path='/form' element={
                    <AuthenticatedRoute>
                        <VendorFormComponent />
                    </AuthenticatedRoute>
                } />
                <Route path='/document-types' element={
                    <AuthenticatedRoute>
                        <DocumentTypeManagement />
                    </AuthenticatedRoute>
                } />
                <Route path='/vendors' element={
                    <AuthenticatedRoute>
                        <VendorTableComponent />
                    </AuthenticatedRoute>
                } />
                <Route path='/documents' element={
                    <AuthenticatedRoute>
                        <VendorDocumentsComponent />
                    </AuthenticatedRoute>
                } />
            </Routes>

        </>
    )

}

export default Routers