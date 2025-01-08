import React from 'react';

const WelcomeAdminComponent = () => {
    return (
        <div>
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
        </div>
    );
}

export default WelcomeAdminComponent;


