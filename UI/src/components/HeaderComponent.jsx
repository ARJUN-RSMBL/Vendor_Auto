import '../styles/HeaderStyles.css';
import { useEffect, useRef } from 'react';
import { Collapse } from 'bootstrap';
import {
  isAdminUser,
  isUserLoggedIn,
  logout,
  hasVendorAccess  // Add this import
} from '../services/authService'
import { NavLink, useNavigate } from 'react-router-dom'

const HeaderComponent = () => {

  const isAuth = isUserLoggedIn();
  const isAdmin = isAdminUser();
  const isVendor = hasVendorAccess();
  const navigator = useNavigate();
  const collapseRef = useRef(null);

  function handleLogout() {
    logout();
    navigator('/')
    window.location.reload(true)
  }

  useEffect(() => {
    // Initialize collapse
    const collapse = new Collapse(collapseRef.current, {
      toggle: false
    });

    // Clean up
    return () => {
      if (collapse) {
        collapse.dispose();
      }
    };
  }, []);

  const toggleNavbar = () => {
    const bsCollapse = new Collapse(collapseRef.current);
    bsCollapse.toggle();
  };

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
            onClick={toggleNavbar}
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>

          <div className='collapse navbar-collapse' id='navbarNav' ref={collapseRef}>
            <ul className='navbar-nav ms-auto'>
              {/* Form - Only for authenticated users */}
              {isAuth && (
                <li className='nav-item'>
                  <NavLink to="/form" className="nav-link d-flex align-items-center">
                    <i className="bi bi-file-earmark-text me-1"></i>
                    Form
                  </NavLink>
                </li>
              )}

              {/* Admin only navigation items */}
              {isAuth && isAdmin && (
                <>
                  <li className='nav-item'>
                    <NavLink to="/vendors" className="nav-link d-flex align-items-center">
                      <i className="bi bi-people me-1"></i>
                      Vendors
                    </NavLink>
                  </li>
                  <li className='nav-item'>
                    <NavLink to="/document-types" className="nav-link d-flex align-items-center">
                      <i className="bi bi-file-earmark-text me-1"></i>
                      Document Types
                    </NavLink>
                  </li>
                </>
              )}

              {/* Add this new nav item in the Admin section */}
              {isAuth && isAdmin && (
                <>
                  {/* ... existing admin items ... */}
                  <li className='nav-item'>
                    <NavLink to="/users" className="nav-link d-flex align-items-center">
                      <i className="bi bi-people-fill me-1"></i>
                      Users
                    </NavLink>
                  </li>
                </>
              )}

              {/* Documents - For admin and users with vendor access */}
              {isAuth && (isAdmin || hasVendorAccess()) && (
                <li className='nav-item'>
                  <NavLink to="/documents" className="nav-link d-flex align-items-center">
                    <i className="bi bi-file-text me-1"></i>
                    Documents
                  </NavLink>
                </li>
              )}

              {/* Login/Logout buttons */}
              {!isAuth ? (
                <li className='nav-item'>
                  <NavLink to="/login" className="nav-link d-flex align-items-center">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </NavLink>
                </li>
              ) : (
                <li className='nav-item'>
                  <NavLink to="/login" className="nav-link d-flex align-items-center border-0 bg-transparent"
                    onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header >
  );
};

export default HeaderComponent;