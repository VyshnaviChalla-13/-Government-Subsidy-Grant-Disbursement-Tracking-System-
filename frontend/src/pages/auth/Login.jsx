import { Link, useNavigate } from "react-router-dom";
import "../../styles/login.css";

function Login() {

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/dashboard");
    };

    return (
        <div className="login-page">

            <div className="container">

                <div className="row align-items-center">

                    {/* Left Side */}

                    <div className="col-lg-6 d-none d-lg-flex">

                        <div className="login-info text-center">

                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                alt="Government Portal"
                                className="img-fluid login-image"
                            />

                            <h2>Government Scheme Management System</h2>

                            <p>
                                A secure digital platform that enables citizens
                                to explore government welfare schemes, apply
                                online, upload documents, and track application
                                status anytime, anywhere.
                            </p>

                        </div>

                    </div>

                    {/* Right Side */}

                    <div className="col-lg-6">

                        <div className="login-card">

                            <h2 className="text-center mb-2">
                                Welcome Back
                            </h2>

                            <p className="text-center mb-4">
                                Login to continue
                            </p>

                            {/* IMPORTANT CHANGE */}
                            <form onSubmit={handleLogin}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        required
                                    />

                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-4">

                                    <div className="form-check">

                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="remember"
                                        />

                                        <label
                                            className="form-check-label"
                                            htmlFor="remember">

                                            Remember Me

                                        </label>

                                    </div>

                                    <Link
                                        to="/forgot-password"
                                        className="login-link">

                                        Forgot Password?

                                    </Link>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100">

                                    Login

                                </button>

                            </form>

                            <hr />

                            <p className="text-center">

                                Don't have an account?{" "}

                                <Link
                                    to="/register"
                                    className="login-link">

                                    Register

                                </Link>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;