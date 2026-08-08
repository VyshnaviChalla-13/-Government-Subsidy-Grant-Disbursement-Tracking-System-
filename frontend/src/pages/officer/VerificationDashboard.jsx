import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerificationDashboard.css";

import defaultApplications from "../../data/applications";

import {
    getApplications,
    saveApplications,
} from "../../utils/applicationStorage";
function VerificationDashboard() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState(() => {
        const stored = getApplications();

        if (stored.length > 0) {
            return stored;
        }

        saveApplications(defaultApplications);
        return defaultApplications;
    });

    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [actionType, setActionType] = useState("");
    const [reason, setReason] = useState("");

    const filteredApplications = applications.filter((app) => {

        const matchesSearch =
            app.id.toLowerCase().includes(search.toLowerCase()) ||
            app.name.toLowerCase().includes(search.toLowerCase());

        const matchesScheme =
            schemeFilter === "" || app.scheme === schemeFilter;

        const matchesStatus =
            statusFilter === "" ||
            (statusFilter === "Pending Verification"
                ? app.status === "Forwarded"
                : app.status === statusFilter);

        return matchesSearch && matchesScheme && matchesStatus;

    });

    const updateStatus = (id, status) => {

        const updated = applications.map((app) =>
            app.id === id
                ? {
                    ...app,
                    status,
                }
                : app
        );

        setApplications(updated);

        saveApplications(updated);

    };
    const openReasonPopup = (application, action) => {
        setSelectedApplication(application);
        setActionType(action);
        setReason("");
    };

    const submitReason = () => {

        const updated = applications.map((app) =>
            app.id === selectedApplication.id
                ? {
                    ...app,
                    status: actionType,
                    reason: reason
                }
                : app
        );

        setApplications(updated);
        saveApplications(updated);

        setSelectedApplication(null);
        setReason("");
        setActionType("");
    };
    return (

        <div className="verification-dashboard">

            <div className="topbar">
                <h1>Verification Officer Dashboard</h1>
                <div className="officer-name">
                    Verification Officer
                </div>
            </div>

            <p className="welcome">
                Verify beneficiary applications and uploaded documents.
            </p>

            {/* Dashboard Cards */}

            <div className="dashboard-cards">

                <div className="card">
                    <h3>Total Applications</h3>
                    <p>{applications.length}</p>
                </div>

                <div className="card">
                    <h3>Pending Verification</h3>
                    <p>
                        {
                            applications.filter(
                                a => a.status === "Forwarded"
                            ).length
                        }
                    </p>
                </div>

                <div className="card">
                    <h3>Approved</h3>
                    <p>
                        {
                            applications.filter(
                                a => a.status === "Approved"
                            ).length
                        }
                    </p>
                </div>

                <div className="card">
                    <h3>Returned</h3>
                    <p>
                        {
                            applications.filter(
                                a => a.status === "Returned"
                            ).length
                        }
                    </p>
                </div>

                <div className="card">
                    <h3>Rejected</h3>
                    <p>
                        {
                            applications.filter(
                                a => a.status === "Rejected"
                            ).length
                        }
                    </p>
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
                    <option>Farmer Assistance Scheme</option>
                    <option>Student Scholarship Scheme</option>
                    <option>Affordable Housing Scheme</option>
                    <option>Women Empowerment Scheme</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option>Pending Verification</option>
                    <option>Approved</option>
                    <option>Returned</option>
                    <option>Rejected</option>
                </select>

            </div>

            {/* Table */}

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

                {filteredApplications.map((app) => (

                    <tr key={app.id}>

                        <td>{app.id}</td>
                        <td>{app.applicant}</td>
                        <td>{app.scheme}</td>
                        <td>{app.submittedDate}</td>
                        <td>
    <span
        className={
            app.status === "Approved"
                ? "status approved"
                : app.status === "Rejected"
                    ? "status rejected"
                    : app.status === "Returned"
                        ? "status returned"
                        : "status pending"
        }
    >
        {app.status === "Forwarded"
            ? "Pending Verification"
            : app.status}
    </span>
                        </td>

                        <td>

                            <button
                                className="view-btn"
                                onClick={() =>
                                    navigate("/officer/verification/milestone", {
                                        state: app,
                                    })
                                }
                            >
                                👁 View
                            </button>

                            <button
                                className="approve-btn"
                                onClick={() => updateStatus(app.id, "Approved")}
                            >
                                ✅ Approve
                            </button>

                            <button
                                className="return-btn"
                                onClick={() => openReasonPopup(app, "Returned")}
                            >
                                ↩ Return
                            </button>
                            <button
                                className="reject-btn"
                                onClick={() => openReasonPopup(app, "Rejected")}
                            >
                                ❌ Reject
                            </button>

                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

            {/* View Modal */}

            {selectedApplication && (

                <div className="modal-overlay">

                    <div className="modal">

                        <h2>Application Details</h2>

                        <div className="details-grid">

                            <div>
                                <strong>Application ID</strong>
                                <p>{selectedApplication.id}</p>
                            </div>

                            <div>
                                <strong>Beneficiary Name</strong>
                                <p>{selectedApplication.applicant}</p>
                            </div>

                            <div>
                                <strong>Father Name</strong>
                                <p>Ramesh Kumar</p>
                            </div>

                            <div>
                                <strong>Mobile</strong>
                                <p>9876543210</p>
                            </div>

                            <div>
                                <strong>Aadhaar</strong>
                                <p>XXXX XXXX 4567</p>
                            </div>

                            <div>
                                <strong>Address</strong>
                                <p>Tirupati, Andhra Pradesh</p>
                            </div>

                            <div>
                                <strong>Scheme</strong>
                                <p>{selectedApplication.scheme}</p>
                            </div>

                            <div>
                                <strong>Status</strong>
                                <span className="status pending">
                        {selectedApplication.status}
                    </span>
                            </div>

                        </div>

                        <hr />

                        <h3>Uploaded Documents</h3>

                        <table className="document-table">

                            <thead>

                            <tr>
                                <th>Document</th>
                                <th>Status</th>
                                <th>Preview</th>
                            </tr>

                            </thead>

                            <tbody>

                            <tr>
                                <td>Aadhaar Card</td>
                                <td><span className="verified">Verified</span></td>
                                <td><button>View</button></td>
                            </tr>

                            <tr>
                                <td>Income Certificate</td>
                                <td><span className="verified">Verified</span></td>
                                <td><button>View</button></td>
                            </tr>

                            <tr>
                                <td>Residence Certificate</td>
                                <td><span className="verified">Verified</span></td>
                                <td><button>View</button></td>
                            </tr>

                            <tr>
                                <td>Bank Passbook</td>
                                <td><span className="pending-doc">Pending</span></td>
                                <td><button>View</button></td>
                            </tr>

                            </tbody>


                        </table>

                        <h3>Verification Remarks</h3>

                        <textarea
                            placeholder="Enter verification remarks..."
                            rows="4"
                        ></textarea>

                        <div className="modal-buttons">

                            <button className="approve-btn">
                                Approve
                            </button>

                            <button className="return-btn">
                                Return
                            </button>

                            <button className="reject-btn">
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
            {selectedApplication &&
                (actionType === "Returned" || actionType === "Rejected") && (

                    <div className="modal-overlay">

                        <div className="reason-modal">

                            <h2>{actionType} Application</h2>

                            <p>
                                Please provide the reason before continuing.
                            </p>

                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter reason..."
                                rows="5"
                            />

                            <div className="reason-buttons">

                                <button
                                    className="submit-btn"
                                    disabled={reason.trim() === ""}
                                    onClick={submitReason}
                                >
                                    Submit
                                </button>

                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setSelectedApplication(null);
                                        setReason("");
                                        setActionType("");
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