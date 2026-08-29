import React, { useEffect, useMemo, useState } from "react";
import "./AdminOverdueResolution.css";
import { getOverdueReport, resolveOverdueMilestone } from "../../api/disbursementApi";

function AdminOverdueResolution() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("");
    const [stageFilter, setStageFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [actionType, setActionType] = useState("");
    const [resolutionRemarks, setResolutionRemarks] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getOverdueReport();
            if (Array.isArray(data)) {
                setApplications(
                    data.map((item) => {
                        const days = Number(item.daysOverdue ?? 0);
                        let priority = "Medium";
                        if (days >= 10) priority = "Critical";
                        else if (days >= 5) priority = "High";

                        return {
                            id: item.applicationNumber || `APP-${item.applicationId || item.applicationMilestoneId}`,
                            applicationMilestoneId: item.applicationMilestoneId,
                            applicationId: item.applicationId,
                            beneficiary: item.beneficiaryName || "Beneficiary",
                            scheme: item.schemeName || "Scheme",
                            stage: item.milestoneName || "Disbursement Stage",
                            officer: "Assigned Officer",
                            daysPending: days,
                            priority,
                            status: "Overdue",
                            submittedDate: item.dueDate || "-",
                            remarks: `Milestone amount: ₹${Number(item.amountToRelease || 0).toLocaleString("en-IN")}`,
                        };
                    })
                );
            } else {
                setApplications([]);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load overdue report.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                !search ||
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

    const resolveApplication = async () => {
        if (!selectedApplication || !actionType) {
            return;
        }

        if (resolutionRemarks.trim() === "") {
            alert("Please enter resolution remarks before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            const mId = selectedApplication.applicationMilestoneId;
            if (mId) {
                await resolveOverdueMilestone(mId, `${actionType}: ${resolutionRemarks}`);
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
            alert("Milestone overdue issue resolved successfully!");
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Resolution failed");
        } finally {
            setSubmitting(false);
        }
    };

    const openResolutionModal = (application) => {
        setSelectedApplication(application);
        setActionType("Grant Extension");
        setResolutionRemarks("");
    };

    const totalOverdue = applications.filter(
        (app) => app.status === "Overdue"
    ).length;

    const criticalCount = applications.filter(
        (app) => app.priority === "Critical" && app.status === "Overdue"
    ).length;

    const awaitingOfficer = applications.filter(
        (app) => app.status === "Overdue"
    ).length;

    const resolvedCount = applications.filter(
        (app) => app.status === "Resolved"
    ).length;

    const schemes = [...new Set(applications.map((a) => a.scheme).filter(Boolean))];
    const stages = [...new Set(applications.map((a) => a.stage).filter(Boolean))];

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
                        Monitor delayed applications and take appropriate administrative action.
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
                    <span>Awaiting Action</span>
                    <strong>{awaitingOfficer}</strong>
                    <small>Pending stage resolution</small>
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
                    <span>{filteredApplications.length} applications</span>
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
                        onChange={(e) => setSchemeFilter(e.target.value)}
                    >
                        <option value="">All Schemes</option>
                        {schemes.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <select
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                    >
                        <option value="">All Stages</option>
                        {stages.map((st) => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                    </select>
                </div>
            </section>

            {loading && <p style={{ padding: "20px" }}>Loading overdue applications...</p>}
            {error && <div className="alert alert-danger" style={{ margin: "20px" }}>{error}</div>}

            {/* Applications Table */}
            {!loading && !error && (
                <div className="overdue-table-container">
                    <table className="overdue-table">
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Beneficiary</th>
                                <th>Scheme</th>
                                <th>Current Stage</th>
                                <th>Days Overdue</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="no-overdue-data">
                                        No overdue applications found.
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app.id}>
                                        <td className="application-id">{app.id}</td>
                                        <td>{app.beneficiary}</td>
                                        <td>{app.scheme}</td>
                                        <td>
                                            <span className="stage-badge">{app.stage}</span>
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
                                            <span className={`priority-badge ${app.priority.toLowerCase()}`}>
                                                {app.priority}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`overdue-status ${app.status.toLowerCase()}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            {app.status === "Overdue" ? (
                                                <button
                                                    className="resolve-btn"
                                                    onClick={() => openResolutionModal(app)}
                                                >
                                                    Resolve
                                                </button>
                                            ) : (
                                                <span className="resolved-label">Resolved</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Resolution Modal */}
            {selectedApplication && (
                <div className="modal-overlay">
                    <div className="resolution-modal">
                        <h2>Resolve Overdue Application</h2>
                        <p>Application ID: {selectedApplication.id} ({selectedApplication.beneficiary})</p>

                        <div className="modal-field">
                            <label>Resolution Action</label>
                            <select
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                            >
                                <option value="Grant Extension">Grant Deadline Extension</option>
                                <option value="Admin Override">Override & Unblock Stage</option>
                                <option value="Reassign Officer">Reassign Officer</option>
                                <option value="Cancel Application">Cancel Milestone</option>
                            </select>
                        </div>

                        <div className="modal-field">
                            <label>Resolution Remarks (Mandatory)</label>
                            <textarea
                                value={resolutionRemarks}
                                onChange={(e) => setResolutionRemarks(e.target.value)}
                                placeholder="Enter reason and administrative instructions..."
                                rows="4"
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                className="submit-resolve-btn"
                                onClick={resolveApplication}
                                disabled={submitting}
                            >
                                {submitting ? "Resolving..." : "Confirm Resolution"}
                            </button>
                            <button
                                className="cancel-resolve-btn"
                                onClick={() => setSelectedApplication(null)}
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

export default AdminOverdueResolution;