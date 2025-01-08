import React, { useEffect, useState } from 'react';

const WelcomeAdminComponent = () => {
    // Mock data for testing
    const mockStats = {
        vendors: 24,
        users: 156,
        documents: 438,
        pendingApprovals: 15
    };
    // Initialize as empty array
    const mockActivity = [
        {
            id: 1,
            date: '2024-03-15',
            status: 'approved',
            formId: 'FORM-001'
        },
        {
            id: 2,
            date: '2024-03-14',
            status: 'pending',
            formId: 'FORM-002'
        },
        {
            id: 3,
            date: '2024-03-13',
            status: 'rejected',
            formId: 'FORM-003'
        }
    ];

    const [stats, setStats] = useState(mockStats);
    const [recentActivity, setRecentActivity] = useState(mockActivity);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'danger';
            default: return 'secondary';
        }
    };

    const handleViewActivity = (id) => {
        console.log('Viewing activity:', id);
        // Implement view functionality when needed
    };
    // useEffect(() => {
    //     const fetchDashboardData = async () => {
    //         try {
    //             const [statsResponse, activityResponse] = await Promise.all([
    //                 axios.get('/api/admin/dashboard/stats'),
    //                 axios.get('/api/admin/dashboard/recent-activity')
    //             ]);
    //             setStats(statsResponse.data);
    //             setRecentActivity(activityResponse.data);
    //         } catch (error) {
    //             console.error('Error fetching dashboard data:', error);
    //         }
    //     };

    //     fetchDashboardData();
    // }, []);
    return (
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
                                <i className="bi bi-shop me-2"></i>
                                Registered Vendors
                            </h5>
                            <h3 className="mt-3 mb-0">{stats.vendors}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-success">
                                <i className="bi bi-people me-2"></i>
                                Total Users
                            </h5>
                            <h3 className="mt-3 mb-0">{stats.users}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-info">
                                <i className="bi bi-file-earmark me-2"></i>
                                Documents
                            </h5>
                            <h3 className="mt-3 mb-0">{stats.documents}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-warning">
                                <i className="bi bi-clock-history me-2"></i>
                                Pending Approvals
                            </h5>
                            <h3 className="mt-3 mb-0">{stats.pendingApprovals}</h3>
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
                                        {Array.isArray(recentActivity) && recentActivity.map((activity) => (
                                            <tr key={activity.id}>
                                                <td>{new Date(activity.date).toLocaleDateString()}</td>
                                                <td>{activity.formId}</td>
                                                <td>
                                                    <span className={`badge bg-${getStatusColor(activity.status)}`}>
                                                        {activity.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleViewActivity(activity.id)}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeAdminComponent;


