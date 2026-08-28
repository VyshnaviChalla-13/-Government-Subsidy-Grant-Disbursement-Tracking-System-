import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OfficerMilestoneVerification.css";

function OfficerMilestoneVerification() {
    const location = useLocation();
    const navigate = useNavigate();

    const application = location.state;
    console.log("APPLICATION DATA:", application);

    const [remarks, setRemarks] = useState("");



    // No application selected
    if (!application) {
        return (
            <div className="milestone-page">
                <div className="milestone-empty">

                    <h2>Application Not Found</h2>

                    <p>
                        No application was selected for verification.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/officer/verification")
                        }
                    >
                        Back to Verification Dashboard
                    </button>

                </div>
            </div>
        );
    }



    return (
        <div className="milestone-page">

            {/* HEADER */}

            <div className="milestone-header">

                <div>

                    <span className="milestone-eyebrow">
                        Verification Workflow
                    </span>

                    <h1>
                        Officer Milestone Verification
                    </h1>

                    <p>
                        Review the beneficiary application, verify
                        supporting documents and record your decision.
                    </p>

                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() =>
                        navigate("/officer/verification")
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>


            {/* APPLICATION OVERVIEW */}

            <section className="milestone-card">

                <div className="section-heading">

                    <div>

                        <span>
                            Application Overview
                        </span>

                        <h2>
                            Application Details
                        </h2>

                    </div>

                    <span className="application-status">
                        {application.status === "FIELD_APPROVED"
                            ? "Pending Verification"
                            : application.status}
                    </span>

                </div>


                <div className="application-grid">

                    <div>
                        <label>Application ID</label>

                        <strong>
                            {application.applicationNumber || "-"}
                        </strong>
                    </div>


                    <div>
                        <label>Beneficiary Name</label>

                        <strong>
                            {application.beneficiary?.fullName || "-"}
                        </strong>
                    </div>


                    <div>
                        <label>Scheme</label>

                        <strong>
                            {application.scheme?.schemeName || "-"}
                        </strong>
                    </div>


                    <div>
                        <label>Submitted Date</label>

                        <strong>
                            {application.submittedAt
                                ? new Date(
                                    application.submittedAt
                                ).toLocaleDateString()
                                : "-"}
                        </strong>
                    </div>

                </div>

            </section>


            {/* WORKFLOW */}

            <section className="milestone-card">

                <div className="section-heading">

                    <div>

                        <span>
                            Application Journey
                        </span>

                        <h2>
                            Verification Milestones
                        </h2>

                    </div>

                </div>


                <div className="workflow">

                    <div className="workflow-step completed">

                        <div className="workflow-circle">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Application Submitted
                            </strong>

                            <p>
                                Beneficiary submitted the application.
                            </p>
                        </div>

                    </div>


                    <div className="workflow-line completed-line"></div>


                    <div className="workflow-step completed">

                        <div className="workflow-circle">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Field Officer Review
                            </strong>

                            <p>
                                Application passed field-level review.
                            </p>
                        </div>

                    </div>


                    <div className="workflow-line active-line"></div>


                    <div className="workflow-step active">

                        <div className="workflow-circle">
                            3
                        </div>

                        <div>
                            <strong>
                                Verification Officer
                            </strong>

                            <p>
                                Current verification stage.
                            </p>
                        </div>

                    </div>


                    <div className="workflow-line"></div>


                    <div className="workflow-step">

                        <div className="workflow-circle">
                            4
                        </div>

                        <div>
                            <strong>
                                District Officer
                            </strong>

                            <p>
                                Pending next-level review.
                            </p>
                        </div>

                    </div>


                    <div className="workflow-line"></div>


                    <div className="workflow-step">

                        <div className="workflow-circle">
                            5
                        </div>

                        <div>
                            <strong>
                                Finance Approver
                            </strong>

                            <p>
                                Final approval and disbursement.
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* BENEFICIARY DETAILS */}

            <section className="milestone-card">

                <div className="section-heading">
                    <div>
                        <span>Applicant Information</span>
                        <h2>Beneficiary Details</h2>
                    </div>
                </div>

                <div className="details-grid">

                    <div>
                        <label>Full Name</label>
                        <strong>
                            {application.beneficiary?.fullName || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Date of Birth</label>
                        <strong>
                            {application.beneficiary?.dateOfBirth || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Gender</label>
                        <strong>
                            {application.beneficiary?.gender || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Marital Status</label>
                        <strong>
                            {application.beneficiary?.maritalStatus || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Mobile Number</label>
                        <strong>
                            {application.beneficiary?.mobileNumber || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Email</label>
                        <strong>
                            {application.beneficiary?.email || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Aadhaar Number</label>
                        <strong>
                            {application.beneficiary?.aadhaarNumber
                                ? `XXXX XXXX ${application.beneficiary.aadhaarNumber.slice(-4)}`
                                : "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Annual Income</label>
                        <strong>
                            {application.beneficiary?.annualIncome != null
                                ? `₹${application.beneficiary.annualIncome.toLocaleString("en-IN")}`
                                : "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Occupation</label>
                        <strong>
                            {application.beneficiary?.occupation || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Category</label>
                        <strong>
                            {application.beneficiary?.category || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Disability Status</label>
                        <strong>
                            {application.beneficiary?.disabilityStatus || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Address</label>
                        <strong>
                            {application.beneficiary?.address || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>District ID</label>
                        <strong>
                            {application.beneficiary?.districtId || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>State ID</label>
                        <strong>
                            {application.beneficiary?.stateId || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Taluka ID</label>
                        <strong>
                            {application.beneficiary?.talukaId || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Village ID</label>
                        <strong>
                            {application.beneficiary?.villageId || "-"}
                        </strong>
                    </div>

                    <div>
                        <label>Pincode</label>
                        <strong>
                            {application.beneficiary?.pincode || "-"}
                        </strong>
                    </div>

                </div>

            </section>
            {/* DOCUMENT VERIFICATION */}

            <section className="milestone-card">

                <div className="section-heading">

                    <div>
                        <span>Supporting Evidence</span>
                        <h2>Document Verification</h2>
                    </div>

                </div>

                <div className="document-list">

                    {/* AADHAAR CARD */}

                    <div className="document-row">

                        <div className="document-info">

                            <div className="document-icon">
                                📄
                            </div>

                            <div>
                                <strong>Aadhaar Card</strong>

                                <p>
                                    Identity verification document
                                </p>

                                <small>
                                    Aadhaar:{" "}
                                    {application.beneficiary?.aadhaarNumber
                                        ? `XXXX XXXX ${application.beneficiary.aadhaarNumber.slice(-4)}`
                                        : "Not available"}
                                </small>
                            </div>

                        </div>

                        <button
                            className="preview-btn"
                            onClick={() =>
                                alert(
                                    "Aadhaar document preview is not available because the backend response does not contain a document file or URL."
                                )
                            }
                        >
                            👁 View
                        </button>

                    </div>


                    {/* INCOME CERTIFICATE */}

                    <div className="document-row">

                        <div className="document-info">

                            <div className="document-icon">
                                📄
                            </div>

                            <div>
                                <strong>Income Certificate</strong>

                                <p>
                                    Income eligibility supporting document
                                </p>

                                <small>
                                    Annual Income:{" "}
                                    {application.beneficiary?.annualIncome != null
                                        ? `₹${application.beneficiary.annualIncome.toLocaleString("en-IN")}`
                                        : "Not available"}
                                </small>
                            </div>

                        </div>



                        <button
                            className="preview-btn"
                            onClick={() =>
                                alert(
                                    "Income Certificate preview is not available because the backend response does not contain a document file or URL."
                                )
                            }
                        >
                            👁 View
                        </button>

                    </div>


                    {/* BANK PASSBOOK */}

                    <div className="document-row">

                        <div className="document-info">

                            <div className="document-icon">
                                📄
                            </div>

                            <div>
                                <strong>Bank Passbook</strong>

                                <p>
                                    Beneficiary bank account verification
                                </p>

                                <small>
                                    Bank:{" "}
                                    {application.beneficiary?.bankName || "Not available"}
                                </small>

                                <small>
                                    Account:{" "}
                                    {application.beneficiary?.accountNumber
                                        ? `XXXXXX${application.beneficiary.accountNumber.slice(-4)}`
                                        : "Not available"}
                                </small>

                                <small>
                                    IFSC:{" "}
                                    {application.beneficiary?.ifscCode || "Not available"}
                                </small>
                            </div>

                        </div>
                        {/* VIEW BUTTON */}
                        <button
                            className="preview-btn"
                            onClick={() =>
                                alert(
                                    "Bank Passbook preview is not available because the backend response does not contain a document file or URL."
                                )
                            }
                        >
                            👁 View
                        </button>



                    </div>


                    {/* RESIDENCE CERTIFICATE */}

                    <div className="document-row">

                        <div className="document-info">

                            <div className="document-icon">
                                📄
                            </div>

                            <div>
                                <strong>Residence Certificate</strong>

                                <p>
                                    Proof of residential address
                                </p>

                                <small>
                                    Address:{" "}
                                    {application.beneficiary?.address || "Not available"}
                                </small>

                                <small>
                                    Pincode:{" "}
                                    {application.beneficiary?.pincode || "Not available"}
                                </small>
                            </div>

                        </div>


                        <button
                            className="preview-btn"
                            onClick={() =>
                                alert(
                                    "Residence Certificate preview is not available because the backend response does not contain a document file or URL."
                                )
                            }
                        >
                            👁 View
                        </button>

                    </div>

                </div>

            </section>

            {/* REMARKS */}

            <section className="milestone-card">

                <div className="section-heading">

                    <div>

                        <span>
                            Officer Decision
                        </span>

                        <h2>
                            Verification Remarks
                        </h2>

                    </div>

                </div>


                <textarea
                    className="remarks-box"
                    value={remarks}
                    onChange={(e) =>
                        setRemarks(e.target.value)
                    }
                    placeholder="Enter verification remarks..."
                    rows="6"
                />


                <p className="remarks-note">
                    Remarks are mandatory before approving,
                    returning or rejecting an application.
                </p>


                <div className="decision-buttons">

                    <button
                        className="approve-button"
                        onClick={() => {

                            if (!remarks.trim()) {
                                alert(
                                    "Please enter verification remarks."
                                );
                                return;
                            }

                            alert(
                                "Application approved."
                            );

                            navigate(
                                "/officer/verification"
                            );

                        }}
                    >
                        ✓ Approve
                    </button>


                    <button
                        className="return-button"
                        onClick={() => {

                            if (!remarks.trim()) {
                                alert(
                                    "Please enter a reason."
                                );
                                return;
                            }

                            alert(
                                "Application returned for re-verification."
                            );

                            navigate(
                                "/officer/verification"
                            );

                        }}
                    >
                        ↩ Return for Re-verification
                    </button>


                    <button
                        className="reject-button"
                        onClick={() => {

                            if (!remarks.trim()) {
                                alert(
                                    "Please enter a rejection reason."
                                );
                                return;
                            }

                            alert(
                                "Application rejected."
                            );

                            navigate(
                                "/officer/verification"
                            );

                        }}
                    >
                        ✕ Reject
                    </button>

                </div>

            </section>

        </div>
    );
}

export default OfficerMilestoneVerification;