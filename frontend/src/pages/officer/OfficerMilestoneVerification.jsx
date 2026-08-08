import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OfficerMilestoneVerification.css";

function OfficerMilestoneVerification() {
    const location = useLocation();
    const navigate = useNavigate();

    const application = location.state;

    const [remarks, setRemarks] = useState("");
    const [documentStatus, setDocumentStatus] = useState({
        aadhaar: "Verified",
        income: "Verified",
        bank: "Pending",
        residence: "Verified",
    });

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

    const verifyDocument = (documentName) => {
        setDocumentStatus((previous) => ({
            ...previous,
            [documentName]: "Verified",
        }));
    };

    const handleApprove = () => {
        if (remarks.trim() === "") {
            alert("Please enter verification remarks before approving.");
            return;
        }

        alert("Application approved by Verification Officer.");

        navigate("/officer/verification");
    };

    const handleReturn = () => {
        if (remarks.trim() === "") {
            alert("Please enter a reason before returning the application.");
            return;
        }

        alert("Application returned for re-verification.");

        navigate("/officer/verification");
    };

    const handleReject = () => {
        if (remarks.trim() === "") {
            alert("Please enter a rejection reason.");
            return;
        }

        alert("Application rejected.");

        navigate("/officer/verification");
    };

    return (
        <div className="milestone-page">

            {/* Header */}
            <div className="milestone-header">

                <div>
                    <span className="milestone-eyebrow">
                        Verification Workflow
                    </span>

                    <h1>Officer Milestone Verification</h1>

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

            {/* Application Summary */}
            <section className="milestone-card">

                <div className="section-heading">
                    <div>
                        <span>Application Overview</span>
                        <h2>Application Details</h2>
                    </div>

                    <span className="application-status">
                        {application.status === "Forwarded"
                            ? "Pending Verification"
                            : application.status}
                    </span>
                </div>

                <div className="application-grid">

                    <div>
                        <label>Application ID</label>
                        <strong>{application.id}</strong>
                    </div>

                    <div>
                        <label>Beneficiary Name</label>
                        <strong>{application.applicant}</strong>
                    </div>

                    <div>
                        <label>Scheme</label>
                        <strong>{application.scheme}</strong>
                    </div>

                    <div>
                        <label>Submitted Date</label>
                        <strong>{application.submittedDate}</strong>
                    </div>

                </div>

            </section>

            {/* Workflow Timeline */}
            <section className="milestone-card">

                <div className="section-heading">
                    <div>
                        <span>Application Journey</span>
                        <h2>Verification Milestones</h2>
                    </div>
                </div>

                <div className="workflow">

                    <div className="workflow-step completed">
                        <div className="workflow-circle">✓</div>

                        <div>
                            <strong>Application Submitted</strong>
                            <p>Beneficiary submitted the application.</p>
                        </div>
                    </div>

                    <div className="workflow-line completed-line"></div>

                    <div className="workflow-step completed">
                        <div className="workflow-circle">✓</div>

                        <div>
                            <strong>Field Officer Review</strong>
                            <p>Application passed field-level review.</p>
                        </div>
                    </div>

                    <div className="workflow-line active-line"></div>

                    <div className="workflow-step active">
                        <div className="workflow-circle">3</div>

                        <div>
                            <strong>Verification Officer</strong>
                            <p>Current verification stage.</p>
                        </div>
                    </div>

                    <div className="workflow-line"></div>

                    <div className="workflow-step">
                        <div className="workflow-circle">4</div>

                        <div>
                            <strong>District Officer</strong>
                            <p>Pending next-level review.</p>
                        </div>
                    </div>

                    <div className="workflow-line"></div>

                    <div className="workflow-step">
                        <div className="workflow-circle">5</div>

                        <div>
                            <strong>Finance Approver</strong>
                            <p>Final approval and disbursement.</p>
                        </div>
                    </div>

                </div>

            </section>

            {/* Eligibility Score */}
            <section className="milestone-card">

                <div className="section-heading">
                    <div>
                        <span>Automated Assessment</span>
                        <h2>Eligibility Score</h2>
                    </div>

                    <div className="score-circle">
                        <strong>78</strong>
                        <span>/100</span>
                    </div>
                </div>

                <div className="score-message">
                    <strong>Eligible for further verification</strong>

                    <p>
                        The application has crossed the configured
                        eligibility threshold.
                    </p>
                </div>

                <div className="score-breakdown">

                    <div className="score-item">
                        <div>
                            <strong>Income Level</strong>
                            <span>24 / 30</span>
                        </div>

                        <div className="score-bar">
                            <div
                                className="score-fill"
                                style={{ width: "80%" }}
                            ></div>
                        </div>
                    </div>

                    <div className="score-item">
                        <div>
                            <strong>Category Match</strong>
                            <span>34 / 40</span>
                        </div>

                        <div className="score-bar">
                            <div
                                className="score-fill"
                                style={{ width: "85%" }}
                            ></div>
                        </div>
                    </div>

                    <div className="score-item">
                        <div>
                            <strong>Documents Complete</strong>
                            <span>20 / 30</span>
                        </div>

                        <div className="score-bar">
                            <div
                                className="score-fill"
                                style={{ width: "67%" }}
                            ></div>
                        </div>
                    </div>

                </div>

            </section>

            {/* Beneficiary Details */}
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
                        <strong>{application.applicant}</strong>
                    </div>

                    <div>
                        <label>Father Name</label>
                        <strong>Ramesh Kumar</strong>
                    </div>

                    <div>
                        <label>Mobile Number</label>
                        <strong>9876543210</strong>
                    </div>

                    <div>
                        <label>Aadhaar Number</label>
                        <strong>XXXX XXXX 4567</strong>
                    </div>

                    <div>
                        <label>Annual Income</label>
                        <strong>₹2,40,000</strong>
                    </div>

                    <div>
                        <label>Occupation</label>
                        <strong>Farmer</strong>
                    </div>

                    <div>
                        <label>District</label>
                        <strong>Tirupati</strong>
                    </div>

                    <div>
                        <label>State</label>
                        <strong>Andhra Pradesh</strong>
                    </div>

                    <div className="full-width-detail">
                        <label>Address</label>
                        <strong>
                            Tirupati, Andhra Pradesh
                        </strong>
                    </div>

                </div>

            </section>

            {/* Document Verification */}
            <section className="milestone-card">

                <div className="section-heading">
                    <div>
                        <span>Supporting Evidence</span>
                        <h2>Document Verification</h2>
                    </div>
                </div>

                <div className="document-list">

                    <div className="document-row">

                        <div>
                            <strong>Aadhaar Card</strong>
                            <p>Identity verification document</p>
                        </div>

                        <span className="document-status verified">
                            {documentStatus.aadhaar}
                        </span>

                        <button className="preview-btn">
                            View
                        </button>

                    </div>

                    <div className="document-row">

                        <div>
                            <strong>Income Certificate</strong>
                            <p>Latest household income certificate</p>
                        </div>

                        <span className="document-status verified">
                            {documentStatus.income}
                        </span>

                        <button className="preview-btn">
                            View
                        </button>

                    </div>

                    <div className="document-row">

                        <div>
                            <strong>Bank Passbook</strong>
                            <p>Beneficiary bank account details</p>
                        </div>

                        <span
                            className={`document-status ${
                                documentStatus.bank === "Verified"
                                    ? "verified"
                                    : "pending"
                            }`}
                        >
                            {documentStatus.bank}
                        </span>

                        <div className="document-actions">

                            <button className="preview-btn">
                                View
                            </button>

                            {documentStatus.bank === "Pending" && (
                                <button
                                    className="verify-btn"
                                    onClick={() =>
                                        verifyDocument("bank")
                                    }
                                >
                                    Verify
                                </button>
                            )}

                        </div>

                    </div>

                    <div className="document-row">

                        <div>
                            <strong>Residence Certificate</strong>
                            <p>Proof of residential address</p>
                        </div>

                        <span className="document-status verified">
                            {documentStatus.residence}
                        </span>

                        <button className="preview-btn">
                            View
                        </button>

                    </div>

                </div>

            </section>

            {/* Verification Remarks */}
            <section className="milestone-card">

                <div className="section-heading">
                    <div>
                        <span>Officer Decision</span>
                        <h2>Verification Remarks</h2>
                    </div>
                </div>

                <textarea
                    className="remarks-box"
                    value={remarks}
                    onChange={(e) =>
                        setRemarks(e.target.value)
                    }
                    placeholder="Enter your verification remarks, observations or reason for returning/rejecting the application..."
                    rows="6"
                />

                <p className="remarks-note">
                    Remarks are mandatory before approving, returning or
                    rejecting an application.
                </p>

                <div className="decision-buttons">

                    <button
                        className="approve-button"
                        onClick={handleApprove}
                    >
                        ✓ Approve
                    </button>

                    <button
                        className="return-button"
                        onClick={handleReturn}
                    >
                        ↩ Return for Re-verification
                    </button>

                    <button
                        className="reject-button"
                        onClick={handleReject}
                    >
                        ✕ Reject
                    </button>

                </div>

            </section>

        </div>
    );
}

export default OfficerMilestoneVerification;