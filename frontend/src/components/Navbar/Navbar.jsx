import "../../styles/navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">

                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <i className="bi bi-bank2 me-2"></i>
                    Government Scheme Management System
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">

                    <ul className="navbar-nav ms-auto align-items-center">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/schemes">Schemes</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/track">Track Status</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>

                        <li className="nav-item ms-3">
                            <Link className="btn btn-light text-primary fw-bold" to="/login">
                                Login
                            </Link>
                        </li>

                        <li className="nav-item ms-2">
                            <Link className="btn btn-warning fw-bold" to="/register">
                                Register
                            </Link>
                        </li>

                    </ul>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;