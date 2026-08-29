import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

export function getRoleHome(role) {
    if (!role) return "/beneficiary/dashboard";
    const normalized = String(role).trim().toUpperCase();

    if (normalized.includes("SUPER_ADMIN")) {
        return "/superadmin/dashboard";
    }
    if (normalized.includes("DEPT_ADMIN") || normalized.includes("DEPARTMENT_ADMIN") || normalized.includes("DEPARTMENT_OFFICER") || normalized.includes("ADMIN")) {
        return "/admin/dashboard";
    }
    if (normalized.includes("FRONT_DESK") || normalized.includes("FIELD_OFFICER") || normalized.includes("FIELD")) {
        return "/officer/frontdesk";
    }
    if (normalized.includes("VERIFICATION") || normalized.includes("DISTRICT_OFFICER") || normalized.includes("DISTRICT")) {
        return "/officer/verification";
    }
    if (normalized.includes("FINANCE")) {
        return "/finance";
    }
    return "/beneficiary/dashboard";
}

function Login() {

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    console.log("Location State:", location.state);

    const handleLogin =  async (e) => {
        e.preventDefault();

        let newErrors = {};

        // Mobile Validation
        if (!mobileNumber.trim()) {
            newErrors.mobileNumber = "Mobile Number is required";
        } else if (!/^[0-9]{10}$/.test(mobileNumber)) {
            newErrors.mobileNumber = "Enter a valid 10-digit Mobile Number";
        }

        // Password Validation
//         if (!password.trim()) {
//             newErrors.password = "Password is required";
//         } else if (
//             !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
//         ) {
//             newErrors.password =
//                 "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.";
//         }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setSubmitting(true);

        try {
            const user = await login(mobileNumber, password);
            console.log("Logged in user:", user);

            if (location.state?.fromApply) {
                navigate("/beneficiary/apply", {
                    state: {
                        schemeId: location.state?.schemeId
                    }
                });
            } else if (location.state?.from) {
                navigate(location.state.from);
            } else {
                navigate(getRoleHome(user?.role));
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                (typeof err.response?.data === "string" ? err.response.data : null) ||
                (err.response?.status === 401 ? "Invalid mobile number or password." : null) ||
                err.message ||
                "Login failed. Please try again.";
            setErrors({ form: msg });
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <div className="login-page">

            <div className="container">

                <div className="login-wrapper">

                    <div className="row g-0">

                        {/* LEFT SECTION */}

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

                                    <div className="login-stat-card">

                                        <h3>100%</h3>

                                        <span>Secure</span>

                                    </div>

                                    <div className="login-stat-card">

                                        <h3>24×7</h3>

                                        <span>Available</span>

                                    </div>

                                    <div className="login-stat-card">

                                        <h3>Easy</h3>

                                        <span>Access</span>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT SECTION */}

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

                                {/* LOGIN FORM */}

                                <form onSubmit={handleLogin}>

                                    {errors.form && (
                                        <div className="alert alert-danger py-2">
                                            {errors.form}
                                        </div>
                                    )}

                                    {/* MOBILE NUMBER */}

                                    <div className="mb-4">

                                        <label className="form-label">
                                            Mobile Number
                                        </label>

                                        <div className="input-box">

                                            <i className="fa-solid fa-mobile-screen-button"></i>

                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter your Mobile Number"
                                                value={mobileNumber}
                                                onChange={(e) => setMobileNumber(e.target.value)}
                                                maxLength={10}
                                            />

                                        </div>

                                        {errors.mobileNumber && (
                                            <small className="text-danger">
                                                {errors.mobileNumber}
                                            </small>
                                        )}

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
                                                placeholder="Enter your Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />

                                        </div>

                                        {errors.password && (
                                            <small className="text-danger">
                                                {errors.password}
                                            </small>
                                        )}

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
                                        className="btn login-btn w-100"
                                        disabled={submitting}>

                                        <i className="fa-solid fa-right-to-bracket me-2"></i>

                                        {submitting? "Signing in..." : "Login"}

                                    </button>

                                </form>

                                {/* REGISTER */}

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