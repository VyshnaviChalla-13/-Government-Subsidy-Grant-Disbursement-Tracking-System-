import React, { useMemo, useState } from "react";
import "./AdminOverdueResolution.css";

const initialOverdueApplications = [
    {
        id: "APP-1001",
        beneficiary: "Ravi Kumar",
        scheme: "Farmer Assistance Scheme",
        stage: "Field Verification",
        officer: "Suresh Kumar",
        daysPending: 10,
        priority: "Critical",
        status: "Overdue",
        submittedDate: "01-08-2026",
        remarks: "Field verification is pending.",
    },
    {
        id: "APP-1002",
        beneficiary: "Anitha Devi",
        scheme: "Student Scholarship Scheme",
        stage: "District Verification",
        officer: "Priya Sharma",
        daysPending: 7,
        priority: "High",
        status: "Overdue",
        submittedDate: "04-08-2026",
        remarks: "Waiting for district officer review.",
    },
    {
        id: "APP-1003",
        beneficiary: "Rahul Reddy",
        scheme: "Affordable Housing Scheme",
        stage: "Finance Approval",
        officer: "Mahesh Kumar",
        daysPending: 12,
        priority: "Critical",
        status: "Overdue",
        submittedDate: "29-07-2026",
        remarks: "Finance approval is pending.",
    },
    {
        id: "APP-1004",
        beneficiary: "Lakshmi Devi",
        scheme: "Women Empowerment Scheme",
        stage: "Field Verification",
        officer: "Kavitha Rao",
        daysPending: 5,
        priority: "Medium",
        status: "Overdue",
        submittedDate: "06-08-2026",
        remarks: "Officer has not completed verification.",
    },
    {
        id: "APP-1005",
        beneficiary: "Arun Kumar",
        scheme: "Farmer Assistance Scheme",
        stage: "District Verification",
        officer: "Ramesh Kumar",
        daysPending: 9,
        priority: "High",
        status: "Overdue",
        submittedDate: "02-08-2026",
        remarks: "Application awaiting district review.",
    },
];

function AdminOverdueResolution() {
    const [applications, setApplications] = useState(
        initialOverdueApplications
    );

    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("");
    const [stageFilter, setStageFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [actionType, setActionType] = useState("");
    const [resolutionRemarks, setResolutionRemarks] = useState("");

    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                app.id.toLowerCase().includes(searchText) ||
                app.beneficiary.toLowerCase().includes(searchText);

            const matchesScheme =
                schemeFilter === "" || app.scheme === schemeFilter;

            const matchesStage =
                stageFilter === "" || app.stage === stageFilter;

            const matchesPriority =
                priorityFilter === "" ||
                app.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesScheme &&
                matchesStage &&
                matchesPriority
            );
        });
    }, [applications, search, schemeFilter, stageFilter, priorityFilter]);

    const resolveApplication = () => {
        if (!selectedApplication || !actionType) {
            return;
        }

        if (resolutionRemarks.trim() === "") {
            return;
        }

        const updatedApplications = applications.map((app) =>
            app.id === selectedApplication.id
                ? {
                    ...app,
                    status: "Resolved",
                    resolutionAction: actionType,
                    resolutionRemarks: resolutionRemarks,
                }
                : app
        );

        setApplications(updatedApplications);

        setSelectedApplication(null);
        setActionType("");
        setResolutionRemarks("");
    };

    const openResolutionModal = (application) => {
        setSelectedApplication(application);
        setActionType("");
        setResolutionRemarks("");
    };

    const totalOverdue = applications.filter(
        (app) => app.status === "Overdue"
    ).length;

    const criticalCount = applications.filter(
        (app) => app.priority === "Critical" && app.status === "Overdue"
    ).length;

    const awaitingOfficer = applications.filter(
        (app) =>
            app.status === "Overdue" &&
            app.stage === "Field Verification"
    ).length;

    const resolvedCount = applications.filter(
        (app) => app.status === "Resolved"
    ).length;

    return (
        <div className="admin-overdue-page">

            {/* Header */}

            <div className="admin-overdue-header">
                <div>
                    <span className="admin-overdue-kicker">
                        Department Administration
                    </span>

                    <h1>Overdue Resolution</h1>

                    <p>
                        Monitor delayed applications and take appropriate
                        administrative action.
                    </p>
                </div>

                <div className="admin-role-badge">
                    Department Admin
                </div>
            </div>

            {/* Summary Cards */}

            <div className="overdue-summary">

                <div className="overdue-card">
                    <span>Total Overdue</span>
                    <strong>{totalOverdue}</strong>
                    <small>Applications requiring attention</small>
                </div>

                <div className="overdue-card critical-card">
                    <span>Critical</span>
                    <strong>{criticalCount}</strong>
                    <small>High-priority delays</small>
                </div>

                <div className="overdue-card">
                    <span>Awaiting Officer</span>
                    <strong>{awaitingOfficer}</strong>
                    <small>Pending field verification</small>
                </div>

                <div className="overdue-card resolved-card">
                    <span>Resolved</span>
                    <strong>{resolvedCount}</strong>
                    <small>Issues resolved by admin</small>
                </div>

            </div>

            {/* Filters */}

            <section className="overdue-filter-section">

                <div className="filter-heading">
                    <h2>Overdue Applications</h2>

                    <span>
                        {filteredApplications.length} applications
                    </span>
                </div>

                <div className="overdue-filters">

                    <input
                        type="text"
                        placeholder="Search by ID or beneficiary..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={schemeFilter}
                        onChange={(e) =>
                            setSchemeFilter(e.target.value)
                        }
                    >
                        <option value="">All Schemes</option>
                        <option>Farmer Assistance Scheme</option>
                        <option>Student Scholarship Scheme</option>
                        <option>Affordable Housing Scheme</option>
                        <option>Women Empowerment Scheme</option>
                    </select>

                    <select
                        value={stageFilter}
                        onChange={(e) =>
                            setStageFilter(e.target.value)
                        }
                    >
                        <option value="">All Stages</option>
                        <option>Field Verification</option>
                        <option>District Verification</option>
                        <option>Finance Approval</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) =>
                            setPriorityFilter(e.target.value)
                        }
                    >
                        <option value="">All Priorities</option>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                    </select>

                </div>
            </section>

            {/* Applications Table */}

            <div className="overdue-table-container">

                <table className="overdue-table">

                    <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Beneficiary</th>
                        <th>Scheme</th>
                        <th>Current Stage</th>
                        <th>Assigned Officer</th>
                        <th>Days Pending</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>

                    {filteredApplications.length === 0 ? (

                        <tr>
                            <td
                                colSpan="9"
                                className="no-overdue-data"
                            >
                                No overdue applications found.
                            </td>
                        </tr>

                    ) : (

                        filteredApplications.map((app) => (

                            <tr key={app.id}>

                                <td className="application-id">
                                    {app.id}
                                </td>

                                <td>
                                    {app.beneficiary}
                                </td>

                                <td>
                                    {app.scheme}
                                </td>

                                <td>
                                        <span className="stage-badge">
                                            {app.stage}
                                        </span>
                                </td>

                                <td>
                                    {app.officer}
                                </td>

                                <td>
                                    <strong
                                        className={
                                            app.daysPending >= 10
                                                ? "days-critical"
                                                : "days-warning"
                                        }
                                    >
                                        {app.daysPending} days
                                    </strong>
                                </td>

                                <td>
                                        <span
                                            className={`priority-badge ${app.priority.toLowerCase()}`}
                                        >
                                            {app.priority}
                                        </span>
                                </td>

                                <td>
                                        <span
                                            className={`overdue-status ${app.status.toLowerCase()}`}
                                        >
                                            {app.status}
                                        </span>
                                </td>

                                <td>

                                    {app.status === "Overdue" ? (

                                        <button
                                            className="resolve-btn"
                                            onClick={() =>
                                                openResolutionModal(app)
                                            }
                                        >
                                            Resolve
                                        </button>

                                    ) : (

                                        <span className="resolved-label">
                                                Resolved
                                            </span>

                                    )}

                                </td>

                            </tr>

                        ))

                    )}

                    </tbody>

                </table>

            </div>

            {/* Resolution Modal */}

            {selectedApplication && (

                <div className="overdue-modal-overlay">

                    <div className="overdue-modal">

                        <div className="modal-header">

                            <div>
                                <span>
                                    Administrative Action
                                </span>

                                <h2>
                                    Resolve Overdue Application
                                </h2>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setSelectedApplication(null)
                                }
                            >
                                ×
                            </button>

                        </div>

                        {/* Application Information */}

                        <div className="application-info-grid">

                            <div>
                                <label>Application ID</label>
                                <strong>
                                    {selectedApplication.id}
                                </strong>
                            </div>

                            <div>
                                <label>Beneficiary</label>
                                <strong>
                                    {selectedApplication.beneficiary}
                                </strong>
                            </div>

                            <div>
                                <label>Scheme</label>
                                <strong>
                                    {selectedApplication.scheme}
                                </strong>
                            </div>

                            <div>
                                <label>Current Stage</label>
                                <strong>
                                    {selectedApplication.stage}
                                </strong>
                            </div>

                            <div>
                                <label>Assigned Officer</label>
                                <strong>
                                    {selectedApplication.officer}
                                </strong>
                            </div>

                            <div>
                                <label>Days Pending</label>
                                <strong className="days-critical">
                                    {selectedApplication.daysPending} days
                                </strong>
                            </div>

                        </div>

                        {/* Existing Remarks */}

                        <div className="existing-remarks">

                            <h3>Current Remarks</h3>

                            <p>
                                {selectedApplication.remarks}
                            </p>

                        </div>

                        {/* Admin Action */}

                        <div className="resolution-section">

                            <h3>Administrative Action</h3>

                            <div className="action-options">

                                <button
                                    className={
                                        actionType === "Reassign Officer"
                                            ? "action-option active"
                                            : "action-option"
                                    }
                                    onClick={() =>
                                        setActionType("Reassign Officer")
                                    }
                                >
                                    Reassign Officer
                                </button>

                                <button
                                    className={
                                        actionType === "Escalate"
                                            ? "action-option active"
                                            : "action-option"
                                    }
                                    onClick={() =>
                                        setActionType("Escalate")
                                    }
                                >
                                    Escalate
                                </button>

                                <button
                                    className={
                                        actionType === "Send Reminder"
                                            ? "action-option active"
                                            : "action-option"
                                    }
                                    onClick={() =>
                                        setActionType("Send Reminder")
                                    }
                                >
                                    Send Reminder
                                </button>

                                <button
                                    className={
                                        actionType === "Mark Resolved"
                                            ? "action-option active"
                                            : "action-option"
                                    }
                                    onClick={() =>
                                        setActionType("Mark Resolved")
                                    }
                                >
                                    Mark Resolved
                                </button>

                            </div>

                        </div>

                        {/* Remarks */}

                        <div className="resolution-remarks">

                            <label>
                                Resolution Remarks
                            </label>

                            <textarea
                                rows="4"
                                value={resolutionRemarks}
                                onChange={(e) =>
                                    setResolutionRemarks(e.target.value)
                                }
                                placeholder="Enter the reason or action taken..."
                            />

                        </div>

                        {/* Buttons */}

                        <div className="resolution-buttons">

                            <button
                                className="cancel-resolution-btn"
                                onClick={() => {
                                    setSelectedApplication(null);
                                    setActionType("");
                                    setResolutionRemarks("");
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-resolution-btn"
                                disabled={
                                    !actionType ||
                                    resolutionRemarks.trim() === ""
                                }
                                onClick={resolveApplication}
                            >
                                Confirm Resolution
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminOverdueResolution;