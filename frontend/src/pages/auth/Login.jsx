import React from "react";
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

                <div className="login-wrapper">

                    <div className="row g-0">

                        {/* ===========================
                            LEFT SECTION
                        =========================== */}

                        <div className="col-lg-4 d-none d-lg-flex">

                            <div className="login-left">

                                <div className="portal-brand">

                                    <i className="fa-solid fa-landmark portal-icon"></i>

                                    <h2>Government Welfare Portal</h2>

                                    <p>
                                        One secure platform to access
                                        government welfare schemes,
                                        upload documents and track
                                        application status online.
                                    </p>

                                    <div className="gold-line"></div>

                                </div>

                                <div className="portal-stats">

                                    <div className="stat-card">

                                        <h3>100%</h3>

                                        <span>Secure</span>

                                    </div>

                                    <div className="stat-card">

                                        <h3>24×7</h3>

                                        <span>Available</span>

                                    </div>

                                    <div className="stat-card">

                                        <h3>Easy</h3>

                                        <span>Access</span>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ===========================
                            RIGHT SECTION
                        =========================== */}

                        <div className="col-lg-8">

                            <div className="login-card">

                                <div className="login-header">

                                    <span className="welcome-text">
                                        Welcome Back
                                    </span>

                                    <h1>Sign In</h1>

                                    <p>
                                        Login to continue to your dashboard.
                                    </p>

                                </div>
                                {/* ===========================
                                    LOGIN FORM
                                =========================== */}

                                <form onSubmit={handleLogin}>

                                    {/* EMAIL */}

                                    <div className="mb-4">

                                        <label className="form-label">
                                            Email Address
                                        </label>

                                        <div className="input-box">

                                            <i className="fa-solid fa-envelope"></i>

                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter your email address"
                                                required
                                            />

                                        </div>

                                    </div>

                                    {/* PASSWORD */}

                                    <div className="mb-4">

                                        <label className="form-label">
                                            Password
                                        </label>

                                        <div className="input-box">

                                            <i className="fa-solid fa-lock"></i>

                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter your password"
                                                required
                                            />

                                        </div>

                                    </div>

                                    {/* REMEMBER & FORGOT */}

                                    <div className="login-options">

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

                                    {/* LOGIN BUTTON */}

                                    <button
                                        type="submit"
                                        className="btn login-btn w-100">

                                        <i className="fa-solid fa-right-to-bracket me-2"></i>

                                        Login

                                    </button>
                                </form>

                                {/* ===========================
                                    REGISTER SECTION
                                =========================== */}

                                <div className="register-box">

                                    <p>

                                        Don't have an account?

                                        <Link
                                            to="/register"
                                            className="login-link ms-2">

                                            Register Now

                                        </Link>

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;