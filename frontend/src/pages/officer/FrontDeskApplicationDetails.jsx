import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { forwardApplication, returnApplication, rejectApplication } from "../../api/frontDeskApi";
import { getDocumentsByApplication } from "../../api/documentApi";

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

function FrontDeskApplicationDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const appId = state?.applicationId || state?.id;

    useEffect(() => {
        if (appId) {
            async function fetchDocs() {
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
            fetchDocs();
        }
    }, [appId]);

    if (!state) {
        return (
            <div className="container py-5">
                <h3>No application selected.</h3>
                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/officer/frontdesk")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const applicant = state.beneficiary?.fullName || state.applicant || "-";
    const aadhaar = state.beneficiary?.aadhaarNumber ? `XXXX XXXX ${String(state.beneficiary.aadhaarNumber).slice(-4)}` : state.aadhaar || "-";
    const mobile = state.beneficiary?.mobileNumber || state.mobile || "-";
    const income = state.beneficiary?.annualIncome != null ? `₹${Number(state.beneficiary.annualIncome).toLocaleString("en-IN")}` : state.income || "-";
    const occupation = state.beneficiary?.occupation || state.occupation || "-";
    const address = state.beneficiary?.address || state.address || "-";
    const schemeName = state.scheme?.schemeName || state.scheme || "-";
    const deptName = state.scheme?.department?.departmentName || state.department || "General";
    const submittedDate = formatDate(state.submittedAt || state.submittedDate);
    const status = state.status || "SUBMITTED";

    const handleForward = async () => {
        setSubmitting(true);
        try {
            await forwardApplication(appId);
            alert("Application forwarded to Verification Officer successfully!");
            navigate("/officer/frontdesk");
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Failed to forward application.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReturn = async () => {
        const remarks = prompt("Enter reason for returning application:") || "Documents need update";
        setSubmitting(true);
        try {
            await returnApplication(appId, remarks);
            alert("Application returned to beneficiary.");
            navigate("/officer/frontdesk");
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Failed to return application.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        const remarks = prompt("Enter reason for rejection:") || "Ineligible criteria";
        setSubmitting(true);
        try {
            await rejectApplication(appId, remarks);
            alert("Application rejected.");
            navigate("/officer/frontdesk");
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Failed to reject application.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-primary">Application Details</h2>

            <div className="card shadow p-4">
                <h4 className="mb-3">Application Information</h4>
                <hr />

                <div className="row">
                    <div className="col-md-6 mb-2">
                        <strong>Application ID:</strong>
                        <p>{appId}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <strong>Scheme:</strong>
                        <p>{schemeName}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <strong>Department:</strong>
                        <p>{deptName}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <strong>Submitted Date:</strong>
                        <p>{submittedDate}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <strong>Status:</strong>
                        <p><span className="badge bg-primary">{status}</span></p>
                    </div>
                </div>

                <hr />
                <h4 className="mb-3">Personal Details</h4>

                <div className="row">
                    <div className="col-md-6 mb-2">
                        <strong>Full Name:</strong>
                        <p>{applicant}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <strong>Aadhaar Number:</strong>
                        <p>{aadhaar}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <strong>Mobile Number:</strong>
                        <p>{mobile}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <strong>Annual Income:</strong>
                        <p>{income}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <strong>Occupation:</strong>
                        <p>{occupation}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                        <strong>Address:</strong>
                        <p>{address}</p>
                    </div>
                </div>

                <hr />
                <h4 className="mb-3">Uploaded Documents</h4>

                {loadingDocs ? (
                    <p>Loading documents...</p>
                ) : documents.length > 0 ? (
                    <div className="document-list">
                        {documents.map((doc) => (
                            <div className="document-item" key={doc.documentId || doc.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                                <span>📄 {doc.documentType || "Document"}: <strong>{doc.fileName || "Uploaded"}</strong></span>
                                <span className="badge bg-secondary">{doc.verificationStatus || "PENDING"}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: "#666" }}>No uploaded documents found for this application.</p>
                )}

                <hr />
                <div className="d-flex gap-3">
                    <button
                        className="btn btn-success"
                        disabled={submitting}
                        onClick={handleForward}
                    >
                        ✓ Forward for Verification
                    </button>

                    <button
                        className="btn btn-warning text-white"
                        disabled={submitting}
                        onClick={handleReturn}
                    >
                        ↩ Return
                    </button>

                    <button
                        className="btn btn-danger"
                        disabled={submitting}
                        onClick={handleReject}
                    >
                        ✕ Reject
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/officer/frontdesk")}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FrontDeskApplicationDetails;