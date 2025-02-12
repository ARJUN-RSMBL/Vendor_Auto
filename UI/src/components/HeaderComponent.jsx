import { NavLink } from 'react-router-dom';
import '../styles/HeaderStyles.css';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const HeaderComponent = () => {

  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // You might want to redirect to home or login page here
  };

  return (
    <header>
      <nav className='navbar navbar-expand-md navbar-dark'>
        <div className='container'>
          <NavLink to="/" className="navbar-brand d-flex align-items-center">
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
              <li className='nav-item'>
                <NavLink to="/form" className="nav-link d-flex align-items-center">
                  <i className="bi bi-file-earmark-text me-1"></i>
                  Form
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink to="/vendors" className="nav-link d-flex align-items-center">
                  <i className="bi bi-people me-1"></i>
                  Vendors
                </NavLink>
              </li>
              <li className='nav-item'>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="nav-link d-flex align-items-center border-0 bg-transparent"
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                ) : (
                  <NavLink to="/login" className="nav-link d-flex align-items-center">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;