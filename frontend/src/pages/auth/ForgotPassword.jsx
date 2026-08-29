import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/forgotpassword.css";
import { forgotPasswordSendOtp, verifyOtp, resetPassword } from "../../api/otpApi";

function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Reset Password
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Step 1: Request OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!/^[6-9]\d{9}$/.test(mobileNumber.trim())) {
            setError("Please enter a valid 10-digit Indian mobile number.");
            return;
        }

        setLoading(true);
        try {
            const res = await forgotPasswordSendOtp(mobileNumber.trim());
            setMessage(res || "OTP has been sent to your mobile number.");
            setStep(2);
        } catch (err) {
            setError(err.response?.data || err.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!otp.trim()) {
            setError("Please enter the OTP.");
            return;
        }

        setLoading(true);
        try {
            const res = await verifyOtp(mobileNumber.trim(), otp.trim());
            setMessage(res || "OTP verified successfully!");
            setStep(3);
        } catch (err) {
            setError(err.response?.data || err.message || "Invalid OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await resetPassword(mobileNumber.trim(), newPassword);
            setMessage(res || "Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(err.response?.data || err.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page">
            <div className="forgot-wrapper">
                <div className="forgot-card">
                    <div className="forgot-header">
                        <i className="fa-solid fa-key forgot-icon"></i>
                        <h2>Reset Password</h2>
                        <p>
                            {step === 1 && "Enter your registered mobile number to receive an OTP."}
                            {step === 2 && `Enter the OTP sent to +91 ${mobileNumber}`}
                            {step === 3 && "Create a new password for your account."}
                        </p>
                    </div>

                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {step === 1 && (
                        <form onSubmit={handleSendOtp}>
                            <div className="mb-4">
                                <label className="form-label">Mobile Number</label>
                                <div className="input-box">
                                    <i className="fa-solid fa-phone"></i>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        placeholder="10-digit mobile number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn login-btn w-100"
                                disabled={loading}
                            >
                                <i className="fa-solid fa-paper-plane me-2"></i>
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="mb-4">
                                <label className="form-label">Enter OTP</label>
                                <div className="input-box">
                                    <i className="fa-solid fa-lock"></i>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn login-btn w-100"
                                disabled={loading}
                            >
                                <i className="fa-solid fa-check me-2"></i>
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>

                            <div style={{ textAlign: "center", marginTop: "12px" }}>
                                <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={() => setStep(1)}
                                    style={{ fontSize: "13px" }}
                                >
                                    Change Mobile Number
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <div className="input-box">
                                    <i className="fa-solid fa-lock"></i>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Confirm New Password</label>
                                <div className="input-box">
                                    <i className="fa-solid fa-lock"></i>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn login-btn w-100"
                                disabled={loading}
                            >
                                <i className="fa-solid fa-shield-check me-2"></i>
                                {loading ? "Resetting Password..." : "Update Password"}
                            </button>
                        </form>
                    )}

                    <div className="forgot-footer">
                        <p>
                            Remember your password?
                            <Link to="/login" className="login-link ms-2">
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