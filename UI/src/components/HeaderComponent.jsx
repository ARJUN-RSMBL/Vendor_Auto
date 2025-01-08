import { NavLink } from 'react-router-dom';
import '../styles/HeaderStyles.css';
import { isAdminUser, isUserLoggedIn, logout } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const HeaderComponent = () => {

  const isAuth = isUserLoggedIn();

  const isAdmin = isAdminUser();

  const navigator = useNavigate();

  function handleLogout() {
    logout();
    navigator('/')
  }

  return (
    <header>
      <nav className='navbar navbar-expand-md navbar-dark'>
        <div className='container'>
          <NavLink to={isAuth ? (isAdmin ? "/welcome" : "/") : "/"} className="navbar-brand d-flex align-items-center">
            <i className="bi bi-building me-2"></i>
            Vendor Automation Demo
          </NavLink>

          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>

          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav ms-auto'>
              {
                isAuth &&
                <li className='nav-item'>
                  <NavLink to="/form" className="nav-link d-flex align-items-center">
                    <i className="bi bi-file-earmark-text me-1"></i>
                    Form</NavLink>
                </li>
              }
              {
                isAuth &&
                <li className='nav-item'>
                  <NavLink to="/vendors" className="nav-link d-flex align-items-center">
                    <i className="bi bi-people me-1"></i>
                    Vendors</NavLink>
                </li>
              }
              {
                !isAuth &&
                <li className='nav-item'>
                  <NavLink to="/login" className="nav-link d-flex align-items-center">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login</NavLink>
                </li>
              }
              {
                isAuth &&
                <li className='nav-item'>
                  <NavLink to="/login" className="nav-link d-flex align-items-center border-0 bg-transparent"
                    onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout</NavLink>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>
    </header >
  );
};

export default HeaderComponent;