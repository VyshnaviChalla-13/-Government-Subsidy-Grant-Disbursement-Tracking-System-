import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FrontDeskApplicationDetails.css";

function FrontDeskApplicationDetails() {

    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="application-details-page">
                <div className="empty-state">
                    <h2>No Application Selected</h2>
                    <p>
                        Please select an application from the Front Desk Dashboard.
                    </p>

                    <button
                        onClick={() => navigate("/officer/frontdesk")}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const beneficiary = state.beneficiary || {};
    const scheme = state.scheme || {};

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatIncome = (income) => {
        if (!income) return "-";

        return `₹${Number(income).toLocaleString("en-IN")}`;
    };

    const maskAadhaar = (aadhaar) => {
        if (!aadhaar) return "-";

        const value = String(aadhaar);

        if (value.length === 12) {
            return `XXXX XXXX ${value.slice(-4)}`;
        }

        return value;
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "FIELD_APPROVED":
                return "status-approved";

            case "SUBMITTED":
            case "RESUBMITTED":
                return "status-pending";

            case "RETURNED":
                return "status-returned";

            case "REJECTED":
                return "status-rejected";

            case "VERIFICATION_APPROVED":
                return "status-approved";

            default:
                return "status-default";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "FIELD_APPROVED":
                return "Field Approved";

            case "VERIFICATION_APPROVED":
                return "Verification Approved";

            case "SUBMITTED":
                return "Submitted";

            case "RESUBMITTED":
                return "Resubmitted";

            case "RETURNED":
                return "Returned";

            case "REJECTED":
                return "Rejected";

            default:
                return status || "-";
        }
    };

    return (
        <div className="application-details-page">

            {/* Header */}

            <div className="details-header">

                <div>

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/officer/frontdesk")
                        }
                    >
                        ← Back to Front Desk
                    </button>

                    <h1>
                        Application Details
                    </h1>

                    <p>
                        Review beneficiary information and application documents.
                    </p>

                </div>

                <span
                    className={`status-badge ${getStatusClass(
                        state.status
                    )}`}
                >
                    {getStatusLabel(state.status)}
                </span>

            </div>


            {/* Application Information */}

            <section className="details-card">

                <div className="card-header">

                    <div>
                        <span className="section-label">
                            APPLICATION INFORMATION
                        </span>

                        <h2>
                            Application Overview
                        </h2>
                    </div>

                </div>


                <div className="information-grid">

                    <div className="information-item">
                        <span>Application ID</span>
                        <strong>
                            {state.applicationNumber || "-"}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>Beneficiary Name</span>
                        <strong>
                            {beneficiary.fullName || "-"}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>Scheme</span>
                        <strong>
                            {scheme.schemeName || "-"}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>Submitted Date</span>
                        <strong>
                            {formatDate(state.submittedAt)}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>Current Status</span>
                        <strong>
                            {getStatusLabel(state.status)}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>Application Reference</span>
                        <strong>
                            #{state.applicationId || "-"}
                        </strong>
                    </div>

                </div>

            </section>


            {/* Beneficiary Information */}

            <section className="details-card">

                <div className="card-header">

                    <div>
                        <span className="section-label">
                            BENEFICIARY INFORMATION
                        </span>

                        <h2>
                            Personal Details
                        </h2>
                    </div>

                </div>


                <div className="information-grid">

                    <div className="information-item">
                        <span>Full Name</span>
                        <strong>
                            {beneficiary.fullName || "-"}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>Mobile Number</span>
                        <strong>
                            {beneficiary.mobileNumber || "-"}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>Aadhaar Number</span>
                        <strong>
                            {maskAadhaar(beneficiary.aadhaarNumber)}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>Annual Income</span>
                        <strong>
                            {formatIncome(beneficiary.annualIncome)}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>Occupation</span>
                        <strong>
                            {beneficiary.occupation || "-"}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>District</span>
                        <strong>
                            {beneficiary.district || "Tirupati"}
                        </strong>
                    </div>

                    <div className="information-item">
                        <span>State</span>
                        <strong>
                            {beneficiary.state || "Andhra Pradesh"}
                        </strong>
                    </div>

                    <div className="information-item full-width">
                        <span>Address</span>
                        <strong>
                            {beneficiary.address || "Tirupati"}
                        </strong>
                    </div>

                </div>

            </section>


            {/* Documents */}

            <section className="details-card">

                <div className="card-header">

                    <div>
                        <span className="section-label">
                            SUPPORTING EVIDENCE
                        </span>

                        <h2>
                            Uploaded Documents
                        </h2>
                    </div>

                </div>


                <div className="documents-list">

                    <div className="document-row">

                        <div className="document-info">

                            <div className="document-icon">
                                📄
                            </div>

                            <div>
                                <strong>
                                    Aadhaar Card
                                </strong>

                                <span>
                                    Identity verification document
                                </span>
                            </div>

                        </div>

                        <div className="document-actions">

                            <span className="document-available">
                                ✓ Available
                            </span>

                            <button
                                className="view-document-btn"
                                onClick={() =>
                                    alert(
                                        "Document preview will be available after backend integration."
                                    )
                                }
                            >
                                View
                            </button>

                        </div>

                    </div>


                    <div className="document-row">

                        <div className="document-info">

                            <div className="document-icon">
                                📄
                            </div>

                            <div>
                                <strong>
                                    Income Certificate
                                </strong>

                                <span>
                                    Latest household income certificate
                                </span>
                            </div>

                        </div>

                        <div className="document-actions">

                            <span className="document-available">
                                ✓ Available
                            </span>

                            <button
                                className="view-document-btn"
                                onClick={() =>
                                    alert(
                                        "Document preview will be available after backend integration."
                                    )
                                }
                            >
                                View
                            </button>

                        </div>

                    </div>


                    <div className="document-row">

                        <div className="document-info">

                            <div className="document-icon">
                                📄
                            </div>

                            <div>
                                <strong>
                                    Bank Passbook
                                </strong>

                                <span>
                                    Beneficiary bank account details
                                </span>
                            </div>

                        </div>

                        <div className="document-actions">

                            <span className="document-available">
                                ✓ Available
                            </span>

                            <button
                                className="view-document-btn"
                                onClick={() =>
                                    alert(
                                        "Document preview will be available after backend integration."
                                    )
                                }
                            >
                                View
                            </button>

                        </div>

                    </div>

                </div>

            </section>


            {/* Actions */}

            <section className="details-card action-card">

                <div className="card-header">

                    <div>
                        <span className="section-label">
                            FRONT DESK ACTION
                        </span>

                        <h2>
                            Application Decision
                        </h2>

                        <p>
                            Select an appropriate action after reviewing
                            the application and supporting documents.
                        </p>
                    </div>

                </div>


                <div className="action-buttons">

                    <button className="forward-button">
                        ✓ Forward Application
                    </button>

                    <button className="return-button">
                        ↩ Return for Re-verification
                    </button>

                    <button className="reject-button">
                        ✕ Reject Application
                    </button>

                </div>

            </section>

        </div>
    );
}

export default FrontDeskApplicationDetails;