import { Link } from "react-router-dom";
import "../../styles/login.css";

function Register() {
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
                                Create your account to apply for government
                                welfare schemes and track applications online.
                            </p>

                        </div>

                    </div>

                    {/* Right Side */}

                    <div className="col-lg-6">

                        <div className="login-card">

                            <h2 className="text-center mb-2">
                                Create Account
                            </h2>

                            <p className="text-center mb-4">
                                Register as a Beneficiary
                            </p>

                            <form>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Full Name"
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter Email"
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Mobile Number
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Mobile Number"
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Create Password"
                                    />

                                </div>

                                <div className="mb-4">

                                    <label className="form-label">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm Password"
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100">

                                    Register

                                </button>

                            </form>

                            <hr />

                            <p className="text-center">

                                Already have an account?{" "}

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

export default Register;