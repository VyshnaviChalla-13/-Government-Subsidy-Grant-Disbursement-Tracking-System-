import React from "react";
import { Link } from "react-router-dom";
import "../../styles/forgotpassword.css";

function ForgotPassword() {

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (

        <div className="forgot-page">

            <div className="forgot-wrapper">

                <div className="forgot-card">

                    <div className="forgot-header">

                        <i className="fa-solid fa-key forgot-icon"></i>

                        <h2>Forgot Password</h2>

                        <p>
                            Enter your registered email address to receive a
                            password reset link.
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">

                            <label className="form-label">
                                Email Address
                            </label>

                            <div className="input-box">

                                <i className="fa-solid fa-envelope"></i>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your registered email"
                                    required
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn login-btn w-100">

                            <i className="fa-solid fa-paper-plane me-2"></i>

                            Send Reset Link

                        </button>

                    </form>

                    <div className="forgot-footer">

                        <p>

                            Remember your password?

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

export default ForgotPassword;