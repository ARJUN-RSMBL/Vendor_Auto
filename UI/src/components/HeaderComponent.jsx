import { NavLink } from 'react-router-dom';

const HeaderComponent = () => {
  return (
    <div>
      <header>
        <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
          <div className='container-fluid'>
            {/* Brand/Logo on the left */}
            <NavLink to="/" className="navbar-brand">
              Vendor Automation Demo
            </NavLink>

            {/* Toggle button for mobile */}
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

            {/* Navbar links */}
            <div className='collapse navbar-collapse' id='navbarNav'>
              <ul className='navbar-nav ms-auto'> {/* ms-auto aligns links to the right */}
                <li className='nav-item'>
                  <NavLink to="/form" className="nav-link">Form</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to="/vendors" className="nav-link">Vendors</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to="/login" className="nav-link">Login</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HeaderComponent;