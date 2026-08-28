import {
    getApplications,
    forwardApplication,
    returnApplication,
    rejectApplication
} from "../../api/frontDeskApi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./FrontDeskDashboard.css";
import { useEffect } from "react";

function FrontDeskDashboard() {

    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [actionApplication, setActionApplication] = useState(null);
    const [actionType, setActionType] = useState("");
    const [reason, setReason] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await getApplications();

            console.log("Applications received:", data); // <-- ADD THIS

            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications:", error);

            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Response:", error.response.data);
            }
        }
    };

    const filteredApplications = applications.filter((app) => {

        const matchesSearch =
            app.applicationNumber?.toLowerCase().includes(search.toLowerCase()) ||
            app.beneficiary?.fullName?.toLowerCase().includes(search.toLowerCase());

        const matchesScheme =
            schemeFilter === "" ||
            app.scheme?.schemeName === schemeFilter;

        const matchesStatus =
            statusFilter === "" || app.status === statusFilter;

        return matchesSearch && matchesScheme && matchesStatus;
    });
    const schemes = [
        ...new Set(
            applications
                .map(app => app.scheme?.schemeName)
                .filter(Boolean)
        ),
    ];


    const openReasonPopup = (application, action) => {
        setActionApplication(application);
        setActionType(action);
        setReason("");
    };

    const submitReason = async () => {
        try {
            if (actionType === "RETURNED") {
                await returnApplication(
                    actionApplication.applicationId,
                    reason
                );
            }

            if (actionType === "REJECTED") {
                await rejectApplication(
                    actionApplication.applicationId,
                    reason
                );
            }

            await fetchApplications();

            setActionApplication(null);
            setReason("");
            setActionType("");

            alert(
                `Application ${actionType.toLowerCase()} successfully`
            );

        } catch (err) {
            console.error(err);
            alert("Operation failed");
        }
    };

    return (
        <div className="dashboard-layout">

            <Sidebar />

            {/* Main Content */}
            <main className="main-content">

                <div className="topbar">

                    <h1>Front Desk Dashboard</h1>

                    <div className="officer-name">

                        Front Desk Officer

                    </div>

                </div>



                <p className="welcome">

                    Welcome! Review and manage beneficiary applications.

                </p>



                {/* Dashboard Cards */}

                <div className="dashboard-cards">

                    <div className="card">

                        <h3>Total Applications</h3>

                        <p>{applications.length}</p>

                    </div>

                    <div className="card">

                        <h3>Pending Review</h3>

                        <p>
                            {
                                applications.filter(
                                    (a) => a.status === "SUBMITTED" ||
                                        a.status === "RESUBMITTED"
                                ).length
                            }
                        </p>

                    </div>

                    <div className="card">

                        <h3>Forwarded</h3>

                        <p>
                            {
                                applications.filter(
                                    (a) => a.status === "FIELD_APPROVED"
                                ).length
                            }
                        </p>

                    </div>

                    <div className="card">

                        <h3>Rejected</h3>

                        <p>
                            {
                                applications.filter(
                                    (a) => a.status === "REJECTED"
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

                        {schemes.map((scheme) => (
                            <option key={scheme} value={scheme}>
                                {scheme}
                            </option>
                        ))}
                    </select>



                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >

                        <option value="">All Status</option>

                        <option value="SUBMITTED">Submitted</option>
                        <option value="RESUBMITTED">Resubmitted</option>
                        <option value="FIELD_APPROVED">Field Approved</option>
                        <option value="RETURNED">Returned</option>
                        <option value="REJECTED">Rejected</option>

                    </select>

                </div>



                {/* Applications Table */}

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

                        <tr key={app.applicationId}>

                            <td>{app.applicationNumber}</td>

                            <td>{app.beneficiary?.fullName}</td>

                            <td>{app.scheme?.schemeName}</td>

                            <td>{new Date(app.submittedAt).toLocaleDateString()}</td>

                            <td>
    <span className={app.status.toLowerCase().replace(/\s+/g, "-")}>
        {app.status}
    </span>

                                {(app.status === "RETURNED" || app.status === "REJECTED") &&
                                    app.remarks && (
                                        <div className="reason-text">
                                            Reason: {app.remarks}
                                        </div>
                                    )}
                            </td>

                            <td>
                                <button
                                    className="view-btn"
                                    onClick={() => {
                                        console.log("Opening application:", app);
                                        navigate(
                                            `/officer/frontdesk/application/${app.applicationId}`,
                                            {
                                                state: app
                                            }
                                        );
                                    }}
                                >
                                    View
                                </button>

                                {(app.status === "SUBMITTED" ||
                                    app.status === "RESUBMITTED") && (
                                    <>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await forwardApplication(app.applicationId);
                                                    await fetchApplications();
                                                    alert("Application forwarded successfully");
                                                } catch (err) {
                                                    console.error(err);
                                                    alert("Failed to forward application");
                                                }
                                            }}
                                        >
                                            Forward
                                        </button>

                                        <button
                                            className="return-btn"
                                            onClick={() =>
                                                openReasonPopup(app, "RETURNED")
                                            }
                                        >
                                            ↩ Return
                                        </button>

                                        <button
                                            className="reject-btn"
                                            onClick={() =>
                                                openReasonPopup(app, "REJECTED")
                                            }
                                        >
                                            ❌ Reject
                                        </button>
                                    </>
                                )}
                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

                {actionApplication &&
                    (actionType === "RETURNED" || actionType === "REJECTED") && (

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
                                            setActionApplication(null);
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

            </main>

        </div>

    );
}

export default FrontDeskDashboard;