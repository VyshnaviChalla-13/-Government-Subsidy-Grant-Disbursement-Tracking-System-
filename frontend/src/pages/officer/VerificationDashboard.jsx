import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VerificationDashboard.css";
import { getApplications, getAllApplications } from "../../api/applicationApi";
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

const PENDING_STATUSES = [
    "PENDING_VERIFICATION",
    "FORWARDED",
    "SUBMITTED",
    "PENDING_FIELD_REVIEW",
    "PENDING_FRONT_DESK",
    "UNDER_VERIFICATION",
    "RESUBMITTED",
    "PENDING",
];

const APPROVED_STATUSES = [
    "VERIFICATION_APPROVED",
    "APPROVED",
    "DISBURSED",
    "STAGE_RELEASED",
    "PENDING_FINANCE",
];

const RETURNED_STATUSES = [
    "RETURNED",
    "FIELD_RETURNED",
    "VERIFY_RETURNED",
];

const REJECTED_STATUSES = [
    "REJECTED",
    "FIELD_REJECTED",
    "VERIFY_REJECTED",
];

function VerificationDashboard() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [modalRemarks, setModalRemarks] = useState("");
    const [actionType, setActionType] = useState("");
    const [reason, setReason] = useState("");
    const [processing, setProcessing] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            let data = [];
            try {
                data = await getApplications();
            } catch (err) {
                console.warn("getApplications note:", err);
            }
            if (!Array.isArray(data) || data.length === 0) {
                try {
                    const allData = await getAllApplications();
                    if (Array.isArray(allData) && allData.length > 0) {
                        data = allData;
                    }
                } catch (allErr) {
                    console.warn("getAllApplications note:", allErr);
                }
            }
            setApplications(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openViewModal = async (app) => {
        setSelectedApplication(app);
        setActionType("");
        setModalRemarks("");
        setDocuments([]);
        const appId = app.applicationId || app.id;
        if (appId) {
            try {
                setLoadingDocs(true);
                const docs = await getDocumentsByApplication(appId);
                setDocuments(Array.isArray(docs) ? docs : []);
            } catch (err) {
                console.error("Failed to load documents for application", appId, err);
            } finally {
                setLoadingDocs(false);
            }
        }
    };

    const handleVerifyDoc = async (docId) => {
        try {
            await verifyDocument(docId, "Verified by Officer", "Verification Officer");
            const appId = selectedApplication?.applicationId || selectedApplication?.id;
            if (appId) {
                const docs = await getDocumentsByApplication(appId);
                setDocuments(Array.isArray(docs) ? docs : []);
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to verify document.");
        }
    };

    const handleRejectDoc = async (docId) => {
        const docRemarks = prompt("Enter reason for document rejection:") || "Document rejected";
        try {
            await rejectDocument(docId, docRemarks, "Verification Officer");
            const appId = selectedApplication?.applicationId || selectedApplication?.id;
            if (appId) {
                const docs = await getDocumentsByApplication(appId);
                setDocuments(Array.isArray(docs) ? docs : []);
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to reject document.");
        }
    };

    const handleApprove = async (app) => {
        const targetApp = app || selectedApplication;
        const appId = targetApp?.applicationId || targetApp?.id;
        if (!appId) return;

        setProcessing(true);
        try {
            await verifyApprove(appId, modalRemarks || "Approved by Verification Officer");
            setSelectedApplication(null);
            setModalRemarks("");
            alert("Application verified and approved successfully! Forwarded to Finance.");
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Approval failed");
        } finally {
            setProcessing(false);
        }
    };

    const openReasonPopup = (app, action) => {
        setSelectedApplication(app);
        setActionType(action);
        setReason("");
    };

    const submitReason = async () => {
        const appId = selectedApplication?.applicationId || selectedApplication?.id;
        if (!appId || !reason.trim()) return;

        setProcessing(true);
        try {
            if (actionType === "Returned") {
                await verifyReturn(appId, reason);
                alert("Application returned to beneficiary for correction.");
            } else if (actionType === "Rejected") {
                await verifyReject(appId, reason);
                alert("Application rejected.");
            }
            setSelectedApplication(null);
            setReason("");
            setActionType("");
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Action failed");
        } finally {
            setProcessing(false);
        }
    };

    const schemes = [...new Set(applications.map((app) => app.scheme?.schemeName).filter(Boolean))];

    const filteredApplications = applications.filter((app) => {
        const idStr = String(app.applicationId || app.applicationNumber || app.id || "").toLowerCase();
        const nameStr = String(app.beneficiary?.fullName || app.applicant || "").toLowerCase();
        const q = search.toLowerCase();
        const matchesSearch = !search || idStr.includes(q) || nameStr.includes(q);

        const appSchemeName = app.scheme?.schemeName || app.scheme || "";
        const matchesScheme = !schemeFilter || appSchemeName === schemeFilter;

        const appStatus = String(app.status || "").toUpperCase();
        let matchesStatus = true;
        if (statusFilter === "Pending Verification") {
            matchesStatus = PENDING_STATUSES.includes(appStatus);
        } else if (statusFilter === "Approved") {
            matchesStatus = APPROVED_STATUSES.includes(appStatus);
        } else if (statusFilter === "Returned") {
            matchesStatus = RETURNED_STATUSES.includes(appStatus);
        } else if (statusFilter === "Rejected") {
            matchesStatus = REJECTED_STATUSES.includes(appStatus);
        }

        return matchesSearch && matchesScheme && matchesStatus;
    });

    const pendingCount = applications.filter((a) =>
        PENDING_STATUSES.includes(String(a.status || "").toUpperCase())
    ).length;

    const approvedCount = applications.filter((a) =>
        APPROVED_STATUSES.includes(String(a.status || "").toUpperCase())
    ).length;

    const returnedCount = applications.filter((a) =>
        RETURNED_STATUSES.includes(String(a.status || "").toUpperCase())
    ).length;

    const rejectedCount = applications.filter((a) =>
        REJECTED_STATUSES.includes(String(a.status || "").toUpperCase())
    ).length;

    return (
        <div className="verification-dashboard">
            <div className="topbar">
                <h1>Verification Officer Dashboard</h1>
                <div className="officer-name">Verification Officer</div>
            </div>

            <p className="welcome">
                Verify beneficiary applications and uploaded documents.
            </p>

            {/* Dashboard Cards */}
            <div className="dashboard-cards">
                <div className="card" onClick={() => setStatusFilter("")} style={{ cursor: "pointer" }}>
                    <h3>Total Applications</h3>
                    <p>{applications.length}</p>
                </div>
                <div className="card" onClick={() => setStatusFilter("Pending Verification")} style={{ cursor: "pointer" }}>
                    <h3>Pending Verification</h3>
                    <p>{pendingCount}</p>
                </div>
                <div className="card" onClick={() => setStatusFilter("Approved")} style={{ cursor: "pointer" }}>
                    <h3>Approved</h3>
                    <p>{approvedCount}</p>
                </div>
                <div className="card" onClick={() => setStatusFilter("Returned")} style={{ cursor: "pointer" }}>
                    <h3>Returned</h3>
                    <p>{returnedCount}</p>
                </div>
                <div className="card" onClick={() => setStatusFilter("Rejected")} style={{ cursor: "pointer" }}>
                    <h3>Rejected</h3>
                    <p>{rejectedCount}</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="filter-section">
                <input
                    type="text"
                    placeholder="Search by ID or Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={schemeFilter}
                    onChange={(e) => setSchemeFilter(e.target.value)}
                >
                    <option value="">All Schemes</option>
                    {schemes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Approved">Approved</option>
                    <option value="Returned">Returned</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {loading && <p style={{ padding: "20px" }}>Loading applications...</p>}
            {error && <div className="alert alert-danger" style={{ margin: "20px" }}>{error}</div>}

            {/* Table */}
            {!loading && !error && (
                <table className="application-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Beneficiary</th>
                            <th>Scheme</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.map((app) => {
                            const appId = app.applicationId || app.id;
                            const applicantName = app.beneficiary?.fullName || app.applicant || "-";
                            const schemeName = app.scheme?.schemeName || app.scheme || "-";
                            const date = formatDate(app.submittedAt || app.submittedDate);
                            const st = app.status || "PENDING";

                            return (
                                <tr key={appId}>
                                    <td>{appId}</td>
                                    <td>{applicantName}</td>
                                    <td>{schemeName}</td>
                                    <td>{date}</td>
                                    <td>
                                        <span
                                            className={
                                                st === "VERIFICATION_APPROVED" || st === "APPROVED" || st === "Approved"
                                                    ? "status approved"
                                                    : st === "REJECTED" || st === "Rejected"
                                                    ? "status rejected"
                                                    : st === "RETURNED" || st === "Returned"
                                                    ? "status returned"
                                                    : "status pending"
                                            }
                                        >
                                            {st}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={() => navigate("/officer/verification/review", { state: app })}
                                        >
                                            🔍 Review & Verify
                                        </button>
                                        <button
                                            className="approve-btn"
                                            onClick={() => handleApprove(app)}
                                            disabled={processing}
                                        >
                                            ✅ Approve
                                        </button>
                                        <button
                                            className="return-btn"
                                            onClick={() => openReasonPopup(app, "Returned")}
                                            disabled={processing}
                                        >
                                            ↩ Return
                                        </button>
                                        <button
                                            className="reject-btn"
                                            onClick={() => openReasonPopup(app, "Rejected")}
                                            disabled={processing}
                                        >
                                            ❌ Reject
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {/* View Modal */}
            {selectedApplication && !actionType && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Application Details</h2>

                        <div className="details-grid">
                            <div>
                                <strong>Application ID</strong>
                                <p>{selectedApplication.applicationId || selectedApplication.id}</p>
                            </div>
                            <div>
                                <strong>Beneficiary Name</strong>
                                <p>{selectedApplication.beneficiary?.fullName || selectedApplication.applicant || "-"}</p>
                            </div>
                            <div>
                                <strong>Mobile</strong>
                                <p>{selectedApplication.beneficiary?.mobileNumber || "-"}</p>
                            </div>
                            <div>
                                <strong>Aadhaar</strong>
                                <p>{selectedApplication.beneficiary?.aadhaarNumber ? `XXXX XXXX ${String(selectedApplication.beneficiary.aadhaarNumber).slice(-4)}` : "-"}</p>
                            </div>
                            <div>
                                <strong>Address</strong>
                                <p>{selectedApplication.beneficiary?.address || "-"}</p>
                            </div>
                            <div>
                                <strong>Scheme</strong>
                                <p>{selectedApplication.scheme?.schemeName || selectedApplication.scheme || "-"}</p>
                            </div>
                            <div>
                                <strong>Status</strong>
                                <span className="status pending">
                                    {selectedApplication.status}
                                </span>
                            </div>
                            <div>
                                <strong>Eligibility Score</strong>
                                <p>{selectedApplication.eligibilityScore != null ? selectedApplication.eligibilityScore : "-"}</p>
                            </div>
                        </div>

                        <hr />

                        <h3>Uploaded Documents</h3>
                        {loadingDocs ? (
                            <p>Loading documents...</p>
                        ) : documents.length > 0 ? (
                            <table className="document-table">
                                <thead>
                                    <tr>
                                        <th>Document Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc) => (
                                        <tr key={doc.documentId || doc.id}>
                                            <td>{doc.documentType || "Document"}</td>
                                            <td>
                                                <span className={doc.verificationStatus === "VERIFIED" ? "verified" : "pending-doc"}>
                                                    {doc.verificationStatus || "PENDING"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="approve-btn"
                                                    style={{ padding: "4px 8px", fontSize: "12px", marginRight: "6px" }}
                                                    onClick={() => handleVerifyDoc(doc.documentId || doc.id)}
                                                >
                                                    Verify
                                                </button>
                                                <button
                                                    className="reject-btn"
                                                    style={{ padding: "4px 8px", fontSize: "12px" }}
                                                    onClick={() => handleRejectDoc(doc.documentId || doc.id)}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: "#777" }}>No documents attached to this application.</p>
                        )}

                        <h3>Verification Remarks</h3>
                        <textarea
                            placeholder="Enter verification remarks..."
                            rows="3"
                            value={modalRemarks}
                            onChange={(e) => setModalRemarks(e.target.value)}
                        />

                        <div className="modal-buttons">
                            <button
                                className="approve-btn"
                                onClick={() => handleApprove()}
                                disabled={processing}
                            >
                                Approve
                            </button>
                            <button
                                className="return-btn"
                                onClick={() => {
                                    setActionType("Returned");
                                    setReason("");
                                }}
                                disabled={processing}
                            >
                                Return
                            </button>
                            <button
                                className="reject-btn"
                                onClick={() => {
                                    setActionType("Rejected");
                                    setReason("");
                                }}
                                disabled={processing}
                            >
                                Reject
                            </button>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedApplication(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reason Modal for Return / Reject */}
            {selectedApplication &&
                (actionType === "Returned" || actionType === "Rejected") && (
                    <div className="modal-overlay">
                        <div className="reason-modal">
                            <h2>{actionType} Application</h2>
                            <p>Please provide the reason before continuing.</p>

                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter reason..."
                                rows="5"
                            />

                            <div className="reason-buttons">
                                <button
                                    className="submit-btn"
                                    disabled={reason.trim() === "" || processing}
                                    onClick={submitReason}
                                >
                                    Submit
                                </button>
                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setActionType("");
                                        setReason("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default VerificationDashboard;