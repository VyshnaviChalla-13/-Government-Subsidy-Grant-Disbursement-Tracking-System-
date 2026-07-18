import React, { useState } from "react";
import "./VerificationDashboard.css";

function VerificationDashboard() {

    const [applications, setApplications] = useState([
        {
            id: "APP101",
            name: "Rahul Kumar",
            scheme: "Farmer Scheme",
            date: "12-07-2026",
            status: "Pending Verification"
        },
        {
            id: "APP102",
            name: "Anjali Sharma",
            scheme: "Education Scheme",
            date: "11-07-2026",
            status: "Pending Verification"
        },
        {
            id: "APP103",
            name: "Suresh",
            scheme: "Housing Scheme",
            date: "10-07-2026",
            status: "Approved"
        }
    ]);

    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);

    const filteredApplications = applications.filter((app) => {

        const matchesSearch =
            app.id.toLowerCase().includes(search.toLowerCase()) ||
            app.name.toLowerCase().includes(search.toLowerCase());

        const matchesScheme =
            schemeFilter === "" || app.scheme === schemeFilter;

        const matchesStatus =
            statusFilter === "" || app.status === statusFilter;

        return matchesSearch && matchesScheme && matchesStatus;
    });

    const updateStatus = (id, status) => {

        const updated = applications.map((app) =>
            app.id === id ? { ...app, status } : app
        );

        setApplications(updated);
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
                    <h3>Pending Verification</h3>
                    <p>
                        {
                            applications.filter(
                                a => a.status === "Pending Verification"
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
                    <option>Farmer Scheme</option>
                    <option>Education Scheme</option>
                    <option>Housing Scheme</option>
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
                        <td>{app.name}</td>
                        <td>{app.scheme}</td>
                        <td>{app.date}</td>
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
        {app.status}
    </span>
                        </td>

                        <td>

                            <button
                                className="view-btn"
                                onClick={() => setSelectedApplication(app)}
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
                                onClick={() => updateStatus(app.id, "Returned")}
                            >
                                ↩ Return
                            </button>
                            <button
                                className="reject-btn"
                                onClick={() => updateStatus(app.id, "Rejected")}
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
                                <p>{selectedApplication.name}</p>
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
        </div>

    );
}

export default VerificationDashboard;