import { Link } from "react-router-dom";
import "../../styles/login.css";

function ForgotPassword() {
    return (
        <div className="login-page">

            <div className="container">

                <div className="row align-items-center">

                    {/* Left Section */}

                    <div className="col-lg-6 d-none d-lg-flex">

                        <div className="login-info text-center">

                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                alt="Forgot Password"
                                className="img-fluid login-image"
                            />

                            <h2>Government Scheme Management System</h2>

                            <p>
                                Enter your registered email address to receive
                                a password reset link.
                            </p>

                        </div>

                    </div>

                    {/* Right Section */}

                    <div className="col-lg-6">

                        <div className="login-card">

                            <h2 className="text-center mb-2">
                                Forgot Password
                            </h2>

                            <p className="text-center mb-4">
                                Reset your password
                            </p>

                            <form>

                                <div className="mb-4">

                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your registered email"
                                    />

                                </div>

                                <button
                                    className="btn btn-primary w-100">

                                    Send Reset Link

                                </button>

                            </form>

                            <hr />

                            <p className="text-center">

                                Remember your password?{" "}

                                <Link
                                    to="/login"
                                    className="login-link">

                                    Login

                                </Link>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;