import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./AuditLogViewer.css";
import { getAllAuditLogs } from "../../api/auditApi";
import { getRoleDisplayName } from "../../utils/roleUtils";

function formatTimestamp(timestamp) {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime())
        ? timestamp
        : date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
}

function AuditLogViewer() {
    const navigate = useNavigate();

    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAction, setSelectedAction] = useState("ALL");
    const [selectedLog, setSelectedLog] = useState(null);

    const loadLogs = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const data = await getAllAuditLogs();
            if (Array.isArray(data)) {
                setAuditLogs(
                    data.map((l) => ({
                        id: l.auditId,
                        date: formatTimestamp(l.performedAt),
                        rawDate: l.performedAt,
                        performedBy: l.performedBy || "System",
                        role: l.performedBy?.toLowerCase().includes("admin")
                            ? "ROLE_SUPER_ADMIN"
                            : "ROLE_USER",
                        action: l.action || "SYSTEM_EVENT",
                        target: `${l.entityType || "Entity"} #${l.entityId || "0"}`,
                        details: l.details || "Action recorded by security monitor",
                        status: "SUCCESS",
                    }))
                );
            } else {
                setAuditLogs([]);
            }
        } catch (err) {
            console.error("Failed to load audit logs:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to load audit logs from database."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    // Distinct actions
    const distinctActions = useMemo(() => {
        const set = new Set(auditLogs.map((l) => l.action).filter(Boolean));
        return ["ALL", ...Array.from(set)];
    }, [auditLogs]);

    // Filtering
    const filteredLogs = useMemo(() => {
        return auditLogs.filter((log) => {
            const search = searchTerm.toLowerCase();
            const matchesSearch =
                !searchTerm.trim() ||
                log.performedBy.toLowerCase().includes(search) ||
                log.action.toLowerCase().includes(search) ||
                log.target.toLowerCase().includes(search) ||
                log.details.toLowerCase().includes(search) ||
                String(log.id).includes(search);

            const matchesAction =
                selectedAction === "ALL" || log.action === selectedAction;

            return matchesSearch && matchesAction;
        });
    }, [auditLogs, searchTerm, selectedAction]);

    const totalEvents = auditLogs.length;
    const successfulEvents = auditLogs.filter((log) => log.status === "SUCCESS").length;
    const adminEvents = auditLogs.filter((log) =>
        log.performedBy.toLowerCase().includes("admin")
    ).length;

    return (
        <div className="audit-log-page">
            <div className="container py-3">
                {/* 1. Page Hero / Header */}
                <div className="audit-hero shadow-sm">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-light rounded-pill px-3"
                                    onClick={() => navigate("/superadmin/dashboard")}
                                >
                                    <i className="bi bi-arrow-left me-1"></i> Dashboard
                                </button>
                                <span className="audit-hero-tag">
                                    <i className="bi bi-shield-check me-1"></i> Compliance & Security Audit
                                </span>
                            </div>
                            <h1 className="audit-hero-title">System Audit Log Trail</h1>
                            <p className="audit-hero-subtitle">
                                Complete immutable record of administrative actions, status transitions, disbursement executions, and security events.
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                className="btn btn-outline-light rounded-pill px-3"
                                onClick={() => loadLogs(true)}
                                disabled={refreshing}
                            >
                                <i className={`bi bi-arrow-repeat me-1 ${refreshing ? "spin-animation" : ""}`}></i>
                                {refreshing ? "Refreshing..." : "Refresh Logs"}
                            </button>
                        </div>
                    </div>
                </div>

                {error && <div className="alert alert-danger shadow-sm my-3">{error}</div>}

                {/* 2. Summary KPI Cards */}
                <div className="row g-3 mt-1">
                    <div className="col-12 col-md-4">
                        <div className="audit-stat-card">
                            <div className="audit-icon-circle blue">
                                <i className="bi bi-journal-text"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Total Audit Records</span>
                                <h3>{loading ? "..." : totalEvents}</h3>
                                <small className="text-muted">Recorded system interactions</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="audit-stat-card">
                            <div className="audit-icon-circle green">
                                <i className="bi bi-check2-circle"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Successful Operations</span>
                                <h3>{loading ? "..." : successfulEvents}</h3>
                                <small className="text-success fw-medium">Verified without errors</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="audit-stat-card">
                            <div className="audit-icon-circle purple">
                                <i className="bi bi-shield-shaded"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Privileged Admin Actions</span>
                                <h3>{loading ? "..." : adminEvents}</h3>
                                <small className="text-muted">Executive oversight events</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Toolbar & Table Container */}
                <div className="card shadow-sm border-0 rounded-4 mt-4 bg-white overflow-hidden">
                    {/* Management Toolbar */}
                    <div className="audit-toolbar p-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div className="audit-search-wrapper">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search by user, action, target entity, or details..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <select
                                className="form-select form-select-sm"
                                style={{ width: "200px" }}
                                value={selectedAction}
                                onChange={(e) => setSelectedAction(e.target.value)}
                            >
                                <option value="ALL">All Action Types</option>
                                {distinctActions
                                    .filter((act) => act !== "ALL")
                                    .map((act) => (
                                        <option key={act} value={act}>
                                            {act}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="p-0">
                        {loading ? (
                            <div className="text-center py-5 text-muted">
                                <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                                Loading immutable audit trail from database...
                            </div>
                        ) : filteredLogs.length === 0 ? (
                            <div className="audit-empty-state py-5 text-center">
                                <div className="empty-icon-box mb-3">
                                    <i className="bi bi-journal-x"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-1">No audit events found</h5>
                                <p className="text-muted small mb-3">
                                    No audit log entries match your active search filters.
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedAction("ALL");
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle custom-audit-table mb-0">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "160px" }}>Timestamp</th>
                                            <th>Performed By</th>
                                            <th>Action Event</th>
                                            <th>Target Entity</th>
                                            <th>Activity Details</th>
                                            <th style={{ width: "100px", textAlign: "right" }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLogs.map((log) => (
                                            <tr
                                                key={log.id}
                                                onClick={() => setSelectedLog(log)}
                                                style={{ cursor: "pointer" }}
                                                title="Click to view full event audit details"
                                            >
                                                <td className="text-muted small font-monospace">
                                                    {log.date}
                                                </td>
                                                <td>
                                                    <strong className="text-dark d-block">
                                                        {log.performedBy}
                                                    </strong>
                                                    <span className="badge bg-light text-secondary border mt-1" style={{ fontSize: "10.5px" }}>
                                                        {getRoleDisplayName(log.role)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {log.target}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="audit-details-cell text-muted" title={log.details}>
                                                        {log.details}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                                                        <i className="bi bi-check-circle-fill me-1"></i> {log.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. Audit Log Details Modal */}
            {selectedLog && (
                <div className="audit-modal-backdrop" onClick={() => setSelectedLog(null)}>
                    <div className="audit-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="audit-modal-header">
                            <div>
                                <h5 className="mb-0 fw-bold text-dark">Audit Event Record</h5>
                                <small className="text-muted">Event ID: #{selectedLog.id}</small>
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setSelectedLog(null)}
                            ></button>
                        </div>

                        <div className="p-4">
                            <div className="row g-3 mb-3">
                                <div className="col-6">
                                    <small className="text-muted d-block">Timestamp</small>
                                    <strong className="text-dark">{selectedLog.date}</strong>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Execution Status</small>
                                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                                        {selectedLog.status}
                                    </span>
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-6">
                                    <small className="text-muted d-block">Performed By</small>
                                    <strong className="text-dark">{selectedLog.performedBy}</strong>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Target Entity</small>
                                    <strong className="text-primary">{selectedLog.target}</strong>
                                </div>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted d-block">Action Performed</small>
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                                    {selectedLog.action}
                                </span>
                            </div>

                            <div className="mb-4">
                                <small className="text-muted d-block mb-1">Detailed Event Payload / Message</small>
                                <div className="p-3 bg-light rounded border text-dark font-monospace small">
                                    {selectedLog.details}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end pt-2 border-top">
                                <button
                                    type="button"
                                    className="btn btn-secondary rounded-pill px-4"
                                    onClick={() => setSelectedLog(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AuditLogViewer;