import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/register.css";

function Register() {

    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    return (

        <div className="register-page">

            <div className="register-wrapper">

                <div className="register-card">

                    <div className="register-header">

                        <h2>Create Your Account</h2>

                        <p>
                            Register to access Government Welfare Schemes.
                        </p>

                    </div>

                    <form onSubmit={handleRegister}>

                        <div className="mb-3">

                            <label className="form-label">
                                Full Name
                            </label>

                            <div className="input-box">

                                <i className="fa-solid fa-user"></i>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your full name"
                                    required
                                />

                            </div>

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Email Address
                            </label>

                            <div className="input-box">

                                <i className="fa-solid fa-envelope"></i>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    required
                                />

                            </div>

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Mobile Number
                            </label>

                            <div className="input-box">

                                <i className="fa-solid fa-phone"></i>

                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Enter your mobile number"
                                    required
                                />

                            </div>

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Password
                            </label>

                            <div className="input-box">

                                <i className="fa-solid fa-lock"></i>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Create password"
                                    required
                                />

                            </div>

                        </div>

                        <div className="mb-4">

                            <label className="form-label">
                                Confirm Password
                            </label>

                            <div className="input-box">

                                <i className="fa-solid fa-lock"></i>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirm password"
                                    required
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn login-btn w-100">

                            <i className="fa-solid fa-user-plus me-2"></i>

                            Register

                        </button>

                    </form>

                    <div className="register-footer">

                        <p>

                            Already have an account?

                            <Link
                                to="/login"
                                className="login-link ms-2">

                                Login

                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;