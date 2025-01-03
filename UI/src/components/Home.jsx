const Home = () => {
    return (
        <div className="min-vh-100 bg-light">
            {/* Hero Section */}
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
        </div>
    )
}

export default Home