import { useState } from 'react';
import { Link } from 'react-router-dom';


const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
    };

    return (
        <div className="min-vh-100 d-flex align-items-center py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeIn">
                            <div className="card-header text-white text-center py-4 border-0" 
                                 style={{ background: 'linear-gradient(to right, #1a237e, #0d47a1)' }}>
                                <h4 className="mb-0 fw-bold">
                                    <i className="bi bi-building me-2"></i>
                                    Vendor Login
                                </h4>
                            </div>
                            <div className="card-body p-md-5">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-person me-2"></i>
                                            Username or Email
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-envelope text-primary"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0"
                                                placeholder="Enter your username or email"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-lock me-2"></i>
                                            Password
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-key text-primary"></i>
                                            </span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control border-start-0 border-end-0"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="input-group-text bg-light border-start-0"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="rememberMe"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="rememberMe">
                                                Remember me
                                            </label>
                                        </div>
                                        <Link to="/forgot-password" className="text-primary text-decoration-none hover-link">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                        >
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            Sign In
                                        </button>
                                    </div>
                                </form>

                                <div className="position-relative my-4">
                                    <hr className="text-muted" />
                                    <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
                                        or continue with
                                    </span>
                                </div>

                                <div className="d-flex justify-content-center gap-3">
                                    {[
                                        { name: 'google', color: '#DB4437' },
                                        { name: 'facebook', color: '#4267B2' },
                                        { name: 'twitter', color: '#1DA1F2' },
                                        { name: 'linkedin', color: '#0077B5' }
                                    ].map((platform) => (
                                        <button
                                            key={platform.name}
                                            className="btn btn-light rounded-circle shadow-sm social-btn"
                                            style={{ '--hover-color': platform.color }}
                                            aria-label={`Login with ${platform.name}`}
                                        >
                                            <i className={`bi bi-${platform.name}`}></i>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;