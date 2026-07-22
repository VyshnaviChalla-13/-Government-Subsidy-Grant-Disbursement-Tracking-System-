import "../../styles/navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg custom-navbar sticky-top">

            <div className="container">

                {/* Logo */}

                <Link className="navbar-brand brand-section" to="/">

                    <div className="brand-icon">
                        <i className="bi bi-bank2"></i>
                    </div>

                    <div className="brand-text">

                        <h5>Government Welfare Portal</h5>

                        <small>Government Scheme Management System</small>

                    </div>

                </Link>

                {/* Mobile Toggle */}

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >

                    <span className="navbar-toggler-icon"></span>

                </button>

                <div className="collapse navbar-collapse" id="navbarNav">

                    <ul className="navbar-nav mx-auto">

                        <li className="nav-item">
                            <Link className="nav-link active" to="/">
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/schemes">
                                Schemes
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/track">
                                Track Status
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/about">
                                About
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">
                                Contact
                            </Link>
                        </li>

                    </ul>

                    <div className="nav-buttons">

                        <Link className="login-btn" to="/login">

                            <i className="bi bi-person-fill"></i>

                            Login

                        </Link>

                        <Link className="register-btn" to="/register">

                            <i className="bi bi-person-plus-fill"></i>

                            Register

                        </Link>

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;