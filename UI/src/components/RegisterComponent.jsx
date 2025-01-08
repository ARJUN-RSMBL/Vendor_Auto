import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAPICall } from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterComponent = () => {

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    function handleRegistrationForm(e) {

        e.preventDefault();

        const register = { name, username, email, password }

        console.log(register);

        registerAPICall(register).then((response) => {
            console.log(response.data);
            toast.success('Registration successful!');
        }).catch(error => {
            console.error(error);
            toast.error('Registration failed. Please try again.');
        })
    }


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
                                    Vendor Registration
                                </h4>
                            </div>
                            <div className="card-body p-md-5">
                                <form >
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    {/* Company Name Field */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-building me-2"></i>
                                            Company Name
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-building text-primary"></i>
                                            </span>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control border-start-0"
                                                placeholder="Enter company name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <ToastContainer position="bottom-right" autoClose={3000} />
                                    {/* Username Field */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-person me-2"></i>
                                            Username
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-person text-primary"></i>
                                            </span>
                                            <input
                                                type="text"
                                                name="username"
                                                className="form-control border-start-0"
                                                placeholder="Enter username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-envelope me-2"></i>
                                            Email Address
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-envelope text-primary"></i>
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control border-start-0"
                                                placeholder="Enter email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Field */}
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
                                                name="password"
                                                className="form-control border-start-0 border-end-0"
                                                placeholder="Enter password"
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

                                    {/* Confirm Password Field (for frontend validation only) */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-lock-fill me-2"></i>
                                            Confirm Password
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-key-fill text-primary"></i>
                                            </span>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                className="form-control border-start-0 border-end-0"
                                                placeholder="Confirm password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="input-group-text bg-light border-start-0"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            onClick={(e) => handleRegistrationForm(e)}
                                        >
                                            <i className="bi bi-person-plus me-2"></i>
                                            Register
                                        </button>
                                    </div>

                                    <div className="text-center mt-4">
                                        <span className="text-muted">Already have an account? </span>
                                        <Link to="/login" className="text-primary text-decoration-none hover-link">
                                            Sign In
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;