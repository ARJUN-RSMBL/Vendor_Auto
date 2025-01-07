import { useState } from "react";
import { useAuth } from '../auth/AuthContext';

const Home = () => {
    const { isLoggedIn } = useAuth();
    


    const Dashboard = () => (
        <div className="container py-5">
            <div className="row">
                <div className="col-12 mb-4">
                    <h2 className="display-6 fw-bold">Dashboard</h2>
                    <p className="text-muted">Welcome back! Here's an overview of your activity.</p>
                </div>
                
                {/* Dashboard Cards */}
                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-primary">
                                <i className="bi bi-file-text me-2"></i>
                                Total Forms
                            </h5>
                            <h3 className="mt-3 mb-0">28</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-success">
                                <i className="bi bi-check-circle me-2"></i>
                                Approved
                            </h5>
                            <h3 className="mt-3 mb-0">15</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-warning">
                                <i className="bi bi-clock me-2"></i>
                                Pending
                            </h5>
                            <h3 className="mt-3 mb-0">8</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-danger">
                                <i className="bi bi-x-circle me-2"></i>
                                Rejected
                            </h5>
                            <h3 className="mt-3 mb-0">5</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h5 className="mb-0">Recent Activity</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Form ID</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Sample data - replace with real data */}
                                        <tr>
                                            <td>2024-03-20</td>
                                            <td>#F123</td>
                                            <td><span className="badge bg-success">Approved</span></td>
                                            <td><button className="btn btn-sm btn-outline-primary">View</button></td>
                                        </tr>
                                        <tr>
                                            <td>2024-03-19</td>
                                            <td>#F122</td>
                                            <td><span className="badge bg-warning">Pending</span></td>
                                            <td><button className="btn btn-sm btn-outline-primary">View</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const VisitorView = () => (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold mb-3 animate__animated animate__fadeIn">
                    Welcome to Our Platform
                </h1>
                <p className="lead text-muted mb-4">
                    Your one-stop destination for amazing experiences
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-primary btn-lg shadow-sm">
                        Get Started Now
                    </button>
                    <button className="btn btn-outline-primary btn-lg">
                        Learn More →
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="row row-cols-1 row-cols-md-4 g-4 text-center mt-5">
                {[
                    { value: '26k+', label: 'Users' },
                    { value: '81k+', label: 'Downloads' },
                    { value: '33k+', label: 'Countries' },
                    { value: '30k+', label: 'Reviews' }
                ].map((stat, index) => (
                    <div key={index} className="col">
                        <div className="card h-100 border-0 bg-white shadow-sm">
                            <div className="card-body">
                                <h2 className="display-6 text-primary fw-bold mb-2">
                                    {stat.value}
                                </h2>
                                <p className="text-muted mb-0">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-vh-100 bg-light">
            {isLoggedIn ? <Dashboard /> : <VisitorView />}
        </div>
    );
};

export default Home;