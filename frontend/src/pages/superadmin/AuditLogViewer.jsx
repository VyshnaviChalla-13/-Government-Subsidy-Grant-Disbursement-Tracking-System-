import "./AuditLogViewer.css";
import { useState } from "react";

function AuditLogViewer() {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("All Roles");
    const [selectedAction, setSelectedAction] = useState("All Actions");
    const [selectedLog, setSelectedLog] = useState(null);

    const auditLogs = [
        {
            id: 1,
            date: "09-Aug-2026 10:00 AM",
            performedBy: "Rahul Kumar",
            role: "Beneficiary",
            action: "Registered",
            target: "User Account",
            details: "New beneficiary account created",
            status: "SUCCESS"
        },
        {
            id: 2,
            date: "09-Aug-2026 10:15 AM",
            performedBy: "Rahul Kumar",
            role: "Beneficiary",
            action: "Logged In",
            target: "User Account",
            details: "Successful login",
            status: "SUCCESS"
        },
        {
            id: 3,
            date: "09-Aug-2026 10:30 AM",
            performedBy: "Super Admin",
            role: "Super Admin",
            action: "Created Department",
            target: "Agriculture Department",
            details: "Department D01 created",
            status: "SUCCESS"
        },
        {
            id: 4,
            date: "09-Aug-2026 10:35 AM",
            performedBy: "Super Admin",
            role: "Super Admin",
            action: "Created Officer",
            target: "Officer Account",
            details: "Front Desk Officer account created",
            status: "SUCCESS"
        },
        {
            id: 5,
            date: "09-Aug-2026 11:00 AM",
            performedBy: "Rahul Kumar",
            role: "Beneficiary",
            action: "Submitted Application",
            target: "APP1001",
            details: "Farmer Assistance Scheme application submitted",
            status: "SUCCESS"
        },
        {
            id: 6,
            date: "09-Aug-2026 11:20 AM",
            performedBy: "Front Desk Officer",
            role: "Front Desk Officer",
            action: "Forwarded Application",
            target: "APP1001",
            details: "Application forwarded for verification",
            status: "SUCCESS"
        },
        {
            id: 7,
            date: "09-Aug-2026 12:00 PM",
            performedBy: "Verification Officer",
            role: "Verification Officer",
            action: "Returned Application",
            target: "APP1001",
            details: "Income certificate required for verification",
            status: "SUCCESS"
        },
        {
            id: 8,
            date: "09-Aug-2026 01:00 PM",
            performedBy: "Rahul Kumar",
            role: "Beneficiary",
            action: "Resubmitted Application",
            target: "APP1001",
            details: "Required income certificate uploaded",
            status: "SUCCESS"
        },
        {
            id: 9,
            date: "09-Aug-2026 02:00 PM",
            performedBy: "Verification Officer",
            role: "Verification Officer",
            action: "Approved Application",
            target: "APP1001",
            details: "Eligibility verified successfully",
            status: "SUCCESS"
        },
        {
            id: 10,
            date: "09-Aug-2026 02:30 PM",
            performedBy: "Finance Officer",
            role: "Finance Officer",
            action: "Approved Disbursement",
            target: "APP1001",
            details: "Application approved for financial disbursement",
            status: "SUCCESS"
        },
        {
            id: 11,
            date: "09-Aug-2026 03:00 PM",
            performedBy: "Finance Officer",
            role: "Finance Officer",
            action: "Released Milestone",
            target: "Milestone 1",
            details: "Payment released for APP1001",
            status: "SUCCESS"
        },
        {
            id: 12,
            date: "09-Aug-2026 03:15 PM",
            performedBy: "Rahul Kumar",
            role: "Beneficiary",
            action: "Logged In",
            target: "User Account",
            details: "Invalid password attempt",
            status: "FAILED"
        }
    ];

    // Filtering
    const filteredLogs = auditLogs.filter((log) => {

        const search = searchTerm.toLowerCase();

        const matchesSearch =
            log.performedBy.toLowerCase().includes(search) ||
            log.action.toLowerCase().includes(search) ||
            log.target.toLowerCase().includes(search) ||
            log.details.toLowerCase().includes(search);

        const matchesRole =
            selectedRole === "All Roles" ||
            log.role === selectedRole;

        const matchesAction =
            selectedAction === "All Actions" ||
            log.action === selectedAction;

        return matchesSearch && matchesRole && matchesAction;
    });

    // Summary values
    const totalEvents = auditLogs.length;

    const successfulEvents = auditLogs.filter(
        (log) => log.status === "SUCCESS"
    ).length;

    const failedEvents = auditLogs.filter(
        (log) => log.status === "FAILED"
    ).length;

    return (
        <div className="audit-page">

            {/* Header */}

            <div className="audit-header">

                <div>
                    <h2>Audit Log Viewer</h2>

                    <p>
                        Monitor important activities performed across the system.
                    </p>
                </div>

                <span className="admin-badge">
                    Super Admin
                </span>

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
                    placeholder="Search user, action or application..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="form-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option>All Roles</option>
                    <option>Beneficiary</option>
                    <option>Front Desk Officer</option>
                    <option>Verification Officer</option>
                    <option>Finance Officer</option>
                    <option>Department Admin</option>
                    <option>Super Admin</option>
                </select>

                <select
                    className="form-select"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                >
                    <option>All Actions</option>
                    <option>Registered</option>
                    <option>Logged In</option>
                    <option>Created Department</option>
                    <option>Created Officer</option>
                    <option>Submitted Application</option>
                    <option>Forwarded Application</option>
                    <option>Returned Application</option>
                    <option>Resubmitted Application</option>
                    <option>Approved Application</option>
                    <option>Approved Disbursement</option>
                    <option>Released Milestone</option>
                </select>

            </div>


            {/* Audit Table */}

            <div className="audit-card">

                <div className="table-responsive">

                    <table className="table audit-table">

                        <thead>

                        <tr>
                            <th>#</th>
                            <th>Date & Time</th>
                            <th>Performed By</th>
                            <th>Action</th>
                            <th>Target</th>
                            <th>Details</th>
                            <th>Status</th>
                            <th>View</th>
                        </tr>

                        </thead>

                        <tbody>

                        {filteredLogs.length > 0 ? (

                            filteredLogs.map((log) => (

                                <tr key={log.id}>

                                    <td>{log.id}</td>

                                    <td>{log.date}</td>

                                    <td>
                                        <strong>
                                            {log.performedBy}
                                        </strong>

                                        <br />

                                        <small className="text-muted">
                                            {log.role}
                                        </small>
                                    </td>

                                    <td>
                                        {log.action}
                                    </td>

                                    <td>
                                        {log.target}
                                    </td>

                                    <td>
                                        {log.details}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                log.status === "SUCCESS"
                                                    ? "status-success"
                                                    : "status-failed"
                                            }
                                        >
                                            {log.status}
                                        </span>

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setSelectedLog(log)}
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="text-center py-4"
                                >
                                    No audit records found.
                                </td>

                            </tr>

                        )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* Details Modal */}

            {selectedLog && (

                <div
                    className="audit-modal-overlay"
                    onClick={() => setSelectedLog(null)}
                >

                    <div
                        className="audit-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="audit-modal-header">

                            <h4>Audit Log Details</h4>

                            <button
                                className="modal-close"
                                onClick={() => setSelectedLog(null)}
                            >
                                ×
                            </button>

                        </div>


                        <div className="audit-modal-body">

                            <div className="detail-row">
                                <strong>Performed By:</strong>
                                <span>{selectedLog.performedBy}</span>
                            </div>

                            <div className="detail-row">
                                <strong>Role:</strong>
                                <span>{selectedLog.role}</span>
                            </div>

                            <div className="detail-row">
                                <strong>Action:</strong>
                                <span>{selectedLog.action}</span>
                            </div>

                            <div className="detail-row">
                                <strong>Target:</strong>
                                <span>{selectedLog.target}</span>
                            </div>

                            <div className="detail-row">
                                <strong>Date & Time:</strong>
                                <span>{selectedLog.date}</span>
                            </div>

                            <div className="detail-row">
                                <strong>Details:</strong>
                                <span>{selectedLog.details}</span>
                            </div>

                            <div className="detail-row">
                                <strong>Status:</strong>

                                <span
                                    className={
                                        selectedLog.status === "SUCCESS"
                                            ? "status-success"
                                            : "status-failed"
                                    }
                                >
                                    {selectedLog.status}
                                </span>

                            </div>

                        </div>


                        <div className="audit-modal-footer">

                            <button
                                className="btn btn-secondary"
                                onClick={() => setSelectedLog(null)}
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

export default AuditLogViewer;