import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../../api/authApi";
import "../../styles/register.css";

const Register = () => {

    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        password: "",
        confirmPassword: "",
        aadhaarNumber: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        stateId: "",
        districtId: "",
        talukaId: "",
        villageId: "",
        pincode: "",
        occupation: "",
        disabilityStatus: "",
        maritalStatus: "",
        annualIncome: "",
        category: "",
        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {

        let newErrors = {};

        if (!/^[A-Za-z ]+$/.test(formData.fullName))
            newErrors.fullName = "Enter valid name";

        if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Enter valid email";

        if (!/^[6-9]\d{9}$/.test(formData.mobileNumber))
            newErrors.mobileNumber = "Enter valid 10 digit mobile number";

        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
                formData.password
            )
        )
            newErrors.password =
                "Password must contain uppercase, lowercase, number & special character";

        if (formData.confirmPassword !== formData.password)
            newErrors.confirmPassword = "Passwords do not match";

        if (!/^\d{12}$/.test(formData.aadhaarNumber))
            newErrors.aadhaarNumber = "Aadhaar must contain 12 digits";

        if (!formData.dateOfBirth)
            newErrors.dateOfBirth = "Select DOB";

        if (!formData.gender)
            newErrors.gender = "Select Gender";
        // Address
        if (!formData.address.trim())
            newErrors.address = "Address is required";

// State
        if (!formData.stateId.trim())
            newErrors.stateId = "State is required";

// District
        if (!formData.districtId.trim())
            newErrors.districtId = "District is required";

// Taluka
        if (!formData.talukaId.trim())
            newErrors.talukaId = "Taluka is required";

// Village
        if (!formData.villageId.trim())
            newErrors.villageId = "Village is required";

// Pincode
        if (!/^\d{6}$/.test(formData.pincode))
            newErrors.pincode = "Enter valid 6 digit pincode";
        // Occupation
        if (!formData.occupation.trim())
            newErrors.occupation = "Occupation is required";

// Disability Status
        if (!formData.disabilityStatus)
            newErrors.disabilityStatus = "Select disability status";

// Marital Status
        if (!formData.maritalStatus)
            newErrors.maritalStatus = "Select marital status";

// Annual Income
        if (!formData.annualIncome || Number(formData.annualIncome) <= 0)
            newErrors.annualIncome = "Enter valid annual income";

// Category
        if (!formData.category)
            newErrors.category = "Select category";

// Bank Name
        if (!formData.bankName.trim())
            newErrors.bankName = "Bank name is required";

// Account Holder Name
        if (!formData.accountHolderName.trim())
            newErrors.accountHolderName = "Enter account holder name";

// Account Number
        if (!/^\d{9,18}$/.test(formData.accountNumber))
            newErrors.accountNumber = "Enter valid account number";

// IFSC Code
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode))
            newErrors.ifscCode = "Enter valid IFSC code";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitError("");

        if (!validateForm()) {
            return;
        }

        // Map the form state 1:1 onto the backend User entity. confirmPassword
        // is UI-only and never sent.
        const payload = {
            fullName: formData.fullName,
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            password: formData.password,
            aadhaarNumber: formData.aadhaarNumber,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            address: formData.address,
            stateId: formData.stateId,
            districtId: formData.districtId,
            talukaId: formData.talukaId,
            villageId: formData.villageId,
            pincode: formData.pincode,
            occupation: formData.occupation,
            disabilityStatus: formData.disabilityStatus,
            maritalStatus: formData.maritalStatus,
            annualIncome: Number(formData.annualIncome),
            category: formData.category,
            bankName: formData.bankName,
            accountHolderName: formData.accountHolderName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
        };

        setSubmitting(true);

        try {
            await registerRequest(payload);
            navigate("/login", { state: { registered: true } });
        } catch (err) {
            setSubmitError(err.message || "Registration failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <div className="container mt-5">

            <div className="card shadow p-4">

                <h2 className="text-center mb-4">
                    User Registration
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="gov-header">
                        <h2>Government Subsidy Application Portal</h2>
                        <p>Department of Rural Development & Welfare</p>
                    </div>

                    <div className="note-box">
                        <strong>Important:</strong> Please ensure Aadhaar, Mobile Number and Bank Details are correct before submitting the application.
                    </div>

                    <div className="section-card">

                        <h4>
                            👤 Personal Information
                        </h4>
                    </div>
                    <div className="row">

                        <div className="col-md-6 mb-3">

                            <label>Full Name</label>

                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                value={formData.fullName}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.fullName}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.email}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Mobile Number</label>

                            <input
                                type="text"
                                name="mobileNumber"
                                className="form-control"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                maxLength="10"
                            />

                            <small className="text-danger">
                                {errors.mobileNumber}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Password</label>

                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.password}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Confirm Password</label>

                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.confirmPassword}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Aadhaar Number</label>

                            <input
                                type="text"
                                name="aadhaarNumber"
                                className="form-control"
                                value={formData.aadhaarNumber}
                                onChange={handleChange}
                                maxLength="12"
                            />

                            <small className="text-danger">
                                {errors.aadhaarNumber}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Date of Birth</label>

                            <input
                                type="date"
                                name="dateOfBirth"
                                className="form-control"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.dateOfBirth}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Gender</label>

                            <select
                                name="gender"
                                className="form-control"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>

                            <small className="text-danger">
                                {errors.gender}
                            </small>

                        </div>

                    </div>
                    {/* Address Information */}

                    <div className="section-card">

                        <h4>
                            📍 Address Information
                        </h4>
                    </div>

                        <div className="row">

                        <div className="col-md-12 mb-3">

                            <label>Address</label>

                            <textarea
                                name="address"
                                className="form-control"
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                            ></textarea>

                            <small className="text-danger">
                                {errors.address}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>State</label>

                            <input
                                type="text"
                                name="stateId"
                                className="form-control"
                                value={formData.stateId}
                                onChange={handleChange}
                                placeholder="Enter State"
                            />

                            <small className="text-danger">
                                {errors.stateId}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>District</label>

                            <input
                                type="text"
                                name="districtId"
                                className="form-control"
                                value={formData.districtId}
                                onChange={handleChange}
                                placeholder="Enter District"
                            />

                            <small className="text-danger">
                                {errors.districtId}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Taluka</label>

                            <input
                                type="text"
                                name="talukaId"
                                className="form-control"
                                value={formData.talukaId}
                                onChange={handleChange}
                                placeholder="Enter Taluka"
                            />

                            <small className="text-danger">
                                {errors.talukaId}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Village</label>

                            <input
                                type="text"
                                name="villageId"
                                className="form-control"
                                value={formData.villageId}
                                onChange={handleChange}
                                placeholder="Enter Village"
                            />

                            <small className="text-danger">
                                {errors.villageId}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Pincode</label>

                            <input
                                type="text"
                                name="pincode"
                                className="form-control"
                                value={formData.pincode}
                                onChange={handleChange}
                                maxLength="6"
                                placeholder="Enter Pincode"
                            />

                            <small className="text-danger">
                                {errors.pincode}
                            </small>

                        </div>

                    </div>
                    {/* Additional Information */}

                    <div className="section-card">

                        <h4>
                            📄 Additional Information
                        </h4>
                    </div>

                        <div className="row">

                        <div className="col-md-6 mb-3">

                            <label>Occupation</label>

                            <input
                                type="text"
                                name="occupation"
                                className="form-control"
                                value={formData.occupation}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.occupation}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Disability Status</label>

                            <select
                                name="disabilityStatus"
                                className="form-control"
                                value={formData.disabilityStatus}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="YES">YES</option>
                                <option value="NO">NO</option>
                            </select>

                            <small className="text-danger">
                                {errors.disabilityStatus}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Marital Status</label>

                            <select
                                name="maritalStatus"
                                className="form-control"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                            </select>

                            <small className="text-danger">
                                {errors.maritalStatus}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Annual Income</label>

                            <input
                                type="number"
                                name="annualIncome"
                                className="form-control"
                                value={formData.annualIncome}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.annualIncome}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Category</label>

                            <select
                                name="category"
                                className="form-control"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="GENERAL">GENERAL</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="EWS">EWS</option>
                            </select>

                            <small className="text-danger">
                                {errors.category}
                            </small>

                        </div>

                    </div>

                    {/* Bank Information */}

                    <div className="section-card">

                        <h4>
                            🏦 Bank Information
                        </h4>
                    </div>

                        <div className="row">

                        <div className="col-md-6 mb-3">

                            <label>Bank Name</label>

                            <input
                                type="text"
                                name="bankName"
                                className="form-control"
                                value={formData.bankName}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.bankName}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Account Holder Name</label>

                            <input
                                type="text"
                                name="accountHolderName"
                                className="form-control"
                                value={formData.accountHolderName}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.accountHolderName}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>Account Number</label>

                            <input
                                type="text"
                                name="accountNumber"
                                className="form-control"
                                value={formData.accountNumber}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.accountNumber}
                            </small>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label>IFSC Code</label>

                            <input
                                type="text"
                                name="ifscCode"
                                className="form-control"
                                value={formData.ifscCode}
                                onChange={handleChange}
                            />

                            <small className="text-danger">
                                {errors.ifscCode}
                            </small>

                        </div>

                    </div>
                    {submitError && (
                        <div className="alert alert-danger text-center">
                            {submitError}
                        </div>
                    )}

                    <div className="text-center mt-4">

                        <button
                            type="submit"
                            className="btn btn-success btn-lg px-5"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : "Submit Application"}
                        </button>

                    </div>
                </form>

            </div>

        </div>

    );
};

export default Register;