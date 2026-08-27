import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OfficerMilestoneVerification.css";
import { getApplicationById } from "../../api/applicationApi";
import { verifyApprove, verifyReturn, verifyReject } from "../../api/verificationApi";
import { getDocumentsByApplication, verifyDocument, rejectDocument } from "../../api/documentApi";

function formatDate(date) {
    if (!date) return "-";
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
        ? date
        : parsed.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
}

function OfficerMilestoneVerification() {
    const location = useLocation();
    const navigate = useNavigate();

    const stateApp = location.state;
    const appId = stateApp?.applicationId || stateApp?.id;

    const [application, setApplication] = useState(stateApp || null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(!stateApp);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchAppDetails() {
            if (appId) {
                try {
                    const data = await getApplicationById(appId);
                    if (data) {
                        setApplication(data);
                    }
                } catch (err) {
                    console.error("Failed to load application:", err);
                } finally {
                    setLoading(false);
                }

                try {
                    setLoadingDocs(true);
                    const docs = await getDocumentsByApplication(appId);
                    setDocuments(Array.isArray(docs) ? docs : []);
                } catch (err) {
                    console.error("Failed to load documents:", err);
                } finally {
                    setLoadingDocs(false);
                }
            } else {
                setLoading(false);
            }
        }

        fetchAppDetails();
    }, [appId]);

    if (!application && !loading) {
        return (
            <div className="milestone-page">
                <div className="milestone-empty">
                    <h2>Application Not Found</h2>
                    <p>No application was selected for verification.</p>
                    <button onClick={() => navigate("/officer/verification")}>
                        Back to Verification Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleVerifySingleDoc = async (docId) => {
        try {
            await verifyDocument(docId, "Verified by Officer", "Verification Officer");
            const docs = await getDocumentsByApplication(appId);
            setDocuments(Array.isArray(docs) ? docs : []);
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to verify document.");
        }
    };

    const handleRejectSingleDoc = async (docId) => {
        const r = prompt("Enter rejection reason for this document:") || "Rejected";
        try {
            await rejectDocument(docId, r, "Verification Officer");
            const docs = await getDocumentsByApplication(appId);
            setDocuments(Array.isArray(docs) ? docs : []);
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to reject document.");
        }
    };

    const handleApprove = async () => {
        if (remarks.trim() === "") {
            alert("Please enter verification remarks before approving.");
            return;
        }

        setSubmitting(true);
        try {
            await verifyApprove(appId, remarks);
            alert("Application approved by Verification Officer.");
            navigate("/officer/verification");
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Approval failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReturn = async () => {
        if (remarks.trim() === "") {
            alert("Please enter a reason before returning the application.");
            return;
        }

        setSubmitting(true);
        try {
            await verifyReturn(appId, remarks);
            alert("Application returned for re-verification.");
            navigate("/officer/verification");
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Return failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (remarks.trim() === "") {
            alert("Please enter a rejection reason.");
            return;
        }

        setSubmitting(true);
        try {
            await verifyReject(appId, remarks);
            alert("Application rejected.");
            navigate("/officer/verification");
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Rejection failed");
        } finally {
            setSubmitting(false);
        }
    };

    const beneficiary = application?.beneficiary || {};
    const scheme = application?.scheme || {};
    const score = application?.eligibilityScore ?? 78;

    return (
        <div className="milestone-page">
            {/* Header */}
            <div className="milestone-header">
                <div>
                    <span className="milestone-eyebrow">Verification Workflow</span>
                    <h1>Officer Milestone Verification</h1>
                    <p>
                        Review the beneficiary application, verify supporting documents and record your decision.
                    </p>
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() => navigate("/officer/verification")}
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
                        {application?.status || "Pending Verification"}
                    </span>
                </div>

                <div className="application-grid">
                    <div>
                        <label>Application ID</label>
                        <strong>{application?.applicationId || application?.id}</strong>
                    </div>

                    <div>
                        <label>Beneficiary Name</label>
                        <strong>{beneficiary.fullName || application?.applicant || "-"}</strong>
                    </div>

                    <div>
                        <label>Scheme</label>
                        <strong>{scheme.schemeName || application?.scheme || "-"}</strong>
                    </div>

                    <div>
                        <label>Submitted Date</label>
                        <strong>{formatDate(application?.submittedAt || application?.submittedDate)}</strong>
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
                            <p>Beneficiary applied online</p>
                        </div>
                    </div>

                    <div className="workflow-line completed-line"></div>

                    <div className="workflow-step completed">
                        <div className="workflow-circle">✓</div>
                        <div>
                            <strong>Field Officer (Level 1)</strong>
                            <p>Initial triage & docs verified</p>
                        </div>
                    </div>

                    <div className="workflow-line active-line"></div>

                    <div className="workflow-step active">
                        <div className="workflow-circle">3</div>
                        <div>
                            <strong>District Officer (Level 2)</strong>
                            <p>Eligibility scoring & policy review</p>
                        </div>
                    </div>

                    <div className="workflow-line"></div>

                    <div className="workflow-step">
                        <div className="workflow-circle">4</div>
                        <div>
                            <strong>Finance Officer</strong>
                            <p>Sanction & milestone allocation</p>
                        </div>
                    </div>

                    <div className="workflow-line"></div>

                    <div className="workflow-step">
                        <div className="workflow-circle">5</div>
                        <div>
                            <strong>Fund Disbursement</strong>
                            <p>Milestone payment released</p>
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
                        <strong>{score}</strong>
                        <span>/100</span>
                    </div>
                </div>

                <div className="score-message">
                    <strong>{score >= 50 ? "Eligible for further verification" : "Below standard threshold"}</strong>
                    <p>
                        Eligibility evaluated automatically against scheme criteria.
                    </p>
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
                        <strong>{beneficiary.fullName || "-"}</strong>
                    </div>

                    <div>
                        <label>Mobile Number</label>
                        <strong>{beneficiary.mobileNumber || "-"}</strong>
                    </div>

                    <div>
                        <label>Aadhaar Number</label>
                        <strong>{beneficiary.aadhaarNumber ? `XXXX XXXX ${String(beneficiary.aadhaarNumber).slice(-4)}` : "-"}</strong>
                    </div>

                    <div>
                        <label>Annual Income</label>
                        <strong>{beneficiary.annualIncome ? `₹${Number(beneficiary.annualIncome).toLocaleString("en-IN")}` : "-"}</strong>
                    </div>

                    <div>
                        <label>Occupation</label>
                        <strong>{beneficiary.occupation || "-"}</strong>
                    </div>

                    <div>
                        <label>Category</label>
                        <strong>{beneficiary.category || "General"}</strong>
                    </div>

                    <div className="full-width-detail">
                        <label>Address</label>
                        <strong>{beneficiary.address || "-"}</strong>
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

                {loadingDocs ? (
                    <p>Loading documents...</p>
                ) : documents.length > 0 ? (
                    <div className="document-list">
                        {documents.map((doc) => (
                            <div className="document-row" key={doc.documentId || doc.id}>
                                <div>
                                    <strong>{doc.documentType || "Document"}</strong>
                                    <p>{doc.fileName || "Uploaded file"}</p>
                                </div>

                                <span className={`document-status ${doc.verificationStatus === "VERIFIED" ? "verified" : "pending"}`}>
                                    {doc.verificationStatus || "PENDING"}
                                </span>

                                <div className="document-actions">
                                    <button
                                        className="verify-btn"
                                        style={{ marginRight: "6px" }}
                                        onClick={() => handleVerifySingleDoc(doc.documentId || doc.id)}
                                    >
                                        Verify
                                    </button>
                                    <button
                                        className="reject-btn"
                                        style={{ padding: "6px 12px", fontSize: "12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px" }}
                                        onClick={() => handleRejectSingleDoc(doc.documentId || doc.id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: "#777", padding: "10px 0" }}>No documents uploaded for this application.</p>
                )}
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
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter your verification remarks, observations or reason for returning/rejecting the application..."
                    rows="6"
                />

                <p className="remarks-note">
                    Remarks are mandatory before approving, returning or rejecting an application.
                </p>

                <div className="decision-buttons">
                    <button
                        className="approve-button"
                        onClick={handleApprove}
                        disabled={submitting}
                    >
                        ✓ Approve
                    </button>

                    <button
                        className="return-button"
                        onClick={handleReturn}
                        disabled={submitting}
                    >
                        ↩ Return for Re-verification
                    </button>

                    <button
                        className="reject-button"
                        onClick={handleReject}
                        disabled={submitting}
                    >
                        ✕ Reject
                    </button>
                </div>
            </section>
        </div>
    );
}

export default OfficerMilestoneVerification;