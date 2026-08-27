import "./AuditLogViewer.css";
import { useState, useEffect } from "react";
import { getAllAuditLogs } from "../../api/auditApi";

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
        });
}

function AuditLogViewer() {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("All Roles");
    const [selectedAction, setSelectedAction] = useState("All Actions");
    const [selectedLog, setSelectedLog] = useState(null);

    const loadLogs = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAllAuditLogs();
            if (Array.isArray(data) && data.length > 0) {
                setAuditLogs(
                    data.map((l) => ({
                        id: l.auditId,
                        date: formatTimestamp(l.performedAt),
                        performedBy: l.performedBy || "System",
                        role: l.performedBy?.includes("Admin") ? "Super Admin" : "Officer / User",
                        action: l.action,
                        target: `${l.entityType || "Entity"} #${l.entityId}`,
                        details: l.details || "Action recorded",
                        status: "SUCCESS",
                    }))
                );
            } else {
                setAuditLogs([]);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load audit logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    // Filtering
    const filteredLogs = auditLogs.filter((log) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            !searchTerm ||
            log.performedBy.toLowerCase().includes(search) ||
            log.action.toLowerCase().includes(search) ||
            log.target.toLowerCase().includes(search) ||
            log.details.toLowerCase().includes(search);

        const matchesRole =
            selectedRole === "All Roles" || log.role === selectedRole;

        const matchesAction =
            selectedAction === "All Actions" || log.action === selectedAction;

        return matchesSearch && matchesRole && matchesAction;
    });

    const totalEvents = auditLogs.length;
    const successfulEvents = auditLogs.filter((log) => log.status === "SUCCESS").length;
    const failedEvents = auditLogs.filter((log) => log.status === "FAILED").length;

    const distinctActions = ["All Actions", ...new Set(auditLogs.map((l) => l.action).filter(Boolean))];

    return (
        <div className="audit-page">
            {/* Header */}
            <div className="audit-header">
                <div>
                    <h2>Audit Log Viewer</h2>
                    <p>Monitor important activities performed across the system.</p>
                </div>

                <span className="admin-badge">Super Admin</span>
            </div>

            {/* Summary Cards */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="audit-summary-card">
                        <h3>{totalEvents}</h3>
                        <p>Total Events</p>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="audit-summary-card">
                        <h3>{successfulEvents}</h3>
                        <p>Successful Events</p>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="audit-summary-card">
                        <h3>{failedEvents}</h3>
                        <p>Failed Events</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="audit-filters">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search user, action, target, or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="form-select"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                >
                    {distinctActions.map((act) => (
                        <option key={act} value={act}>{act}</option>
                    ))}
                </select>
            </div>

            {loading && <p style={{ padding: "20px" }}>Loading audit logs...</p>}
            {error && <div className="alert alert-danger" style={{ margin: "20px" }}>{error}</div>}

            {/* Table */}
            {!loading && !error && (
                <div className="card shadow p-4">
                    <table className="table table-hover align-middle">
                        <thead className="table-primary">
                            <tr>
                                <th>Timestamp</th>
                                <th>Performed By</th>
                                <th>Action</th>
                                <th>Target Entity</th>
                                <th>Details</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                        No audit log events found.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} onClick={() => setSelectedLog(log)} style={{ cursor: "pointer" }}>
                                        <td>{log.date}</td>
                                        <td><strong>{log.performedBy}</strong></td>
                                        <td>
                                            <span className="badge bg-secondary">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td>{log.target}</td>
                                        <td>{log.details}</td>
                                        <td>
                                            <span className="badge bg-success">
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {selectedLog && (
                <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Audit Log Details</h3>
                        <div style={{ marginTop: "15px" }}>
                            <p><strong>Log ID:</strong> #{selectedLog.id}</p>
                            <p><strong>Timestamp:</strong> {selectedLog.date}</p>
                            <p><strong>Performed By:</strong> {selectedLog.performedBy}</p>
                            <p><strong>Action:</strong> {selectedLog.action}</p>
                            <p><strong>Target:</strong> {selectedLog.target}</p>
                            <p><strong>Details:</strong> {selectedLog.details}</p>
                            <p><strong>Status:</strong> {selectedLog.status}</p>
                        </div>
                        <div style={{ textAlign: "right", marginTop: "20px" }}>
                            <button className="btn btn-primary btn-sm" onClick={() => setSelectedLog(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AuditLogViewer;