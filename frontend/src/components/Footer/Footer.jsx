import "../../styles/footer.css";

function Footer() {
    return (
        <footer className="footer">

            <div className="container">

                <div className="row">

                    <div className="col-lg-4">

                        <h4>Government Scheme Management System</h4>

                        <p>
                            A digital platform to discover, apply and track
                            government welfare schemes securely.
                        </p>

                    </div>

                    <div className="col-lg-4">

                        <h5>Quick Links</h5>

                        <ul className="footer-links">

                            <li>Home</li>
                            <li>Login</li>
                            <li>Register</li>
                            <li>Contact</li>

                        </ul>

                    </div>

                    <div className="col-lg-4">

                        <h5>Contact</h5>

                        <p>Email : support@gsms.gov.in</p>

                        <p>Phone : +91 9876543210</p>

                    </div>

                </div>

                <hr />

                <p className="text-center">

                    © 2026 Government Scheme Management System

                </p>

            </div>

        </footer>
    );
}

export default Footer;