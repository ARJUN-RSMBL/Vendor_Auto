import "../styles/FooterStyles.css"

const FooterComponent = () => {
    return (
        <footer className="footers">
            {/* <div className="footer-header">
                <div className="footer-header-section">
                    <h3>About Us</h3>
                </div>
                <div className="footer-header-section">
                    <h3>Quick Links</h3>
                </div>
                <div className="footer-header-section">
                    <h3>Connect With Us</h3>
                </div>
            </div> */}

            <div className="footer-content">
                <div className="footer-section">
                    <div className="contact-info">
                        <p><i className="bi bi-geo-alt-fill"></i> Dubai, UAE</p>
                        <p><i className="bi bi-telephone-fill"></i> +971 4 123 4567</p>
                        <p><i className="bi bi-envelope-fill"></i> info@resemble.com</p>
                    </div>
                </div>

                <div className="footer-section">
                    <ul className="footer-links">
                        <li><a href="/"><i className="bi bi-house-door"></i> Home</a></li>
                        <li><a href="/form"><i className="bi bi-person-plus"></i> Register Vendor</a></li>
                        <li><a href="/vendors"><i className="bi bi-people"></i> View Vendors</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <div className="social-links">
                        <a href="#" className="social-link" aria-label="LinkedIn">
                            <i className="bi bi-linkedin"></i>
                        </a>
                        <a href="#" className="social-link" aria-label="Twitter">
                            <i className="bi bi-twitter"></i>
                        </a>
                        <a href="#" className="social-link" aria-label="Facebook">
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a href="#" className="social-link" aria-label="Instagram">
                            <i className="bi bi-instagram"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterComponent