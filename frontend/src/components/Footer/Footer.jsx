import "../../styles/footer.css";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">

            <div className="container">

                <div className="footer-top">

                    <div className="footer-brand">

                        <h4>
                            <i className="bi bi-bank2"></i>
                            Government Scheme Portal
                        </h4>

                        <p>
                            A unified platform for citizens to explore, apply and
                            track government welfare schemes securely.
                        </p>

                    </div>

                    <div className="footer-links">

                        <h5>Quick Links</h5>

                        <Link to="/">Home</Link>
                        <Link to="/schemes">Schemes</Link>
                        <Link to="/track">Track Status</Link>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>

                    </div>

                    <div className="footer-contact">

                        <h5>Support</h5>

                        <p>
                            <i className="bi bi-envelope-fill"></i>
                            support@govschemes.gov.in
                        </p>

                        <p>
                            <i className="bi bi-telephone-fill"></i>
                            1800-123-4567
                        </p>

                    </div>

                </div>

                <hr />

                <div className="footer-bottom">

                    <p>
                        © 2026 Government Scheme Management System. All Rights Reserved.
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;