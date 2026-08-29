import React, { useState, useEffect } from "react";
import "./ManageOfficers.css";
import {
    getAllOfficers,
    createOfficer,
    updateOfficer,
    deleteOfficer,
} from "../../api/officerApi";
import { getAllDepartments } from "../../api/departmentApi";
import { getAllUsers } from "../../api/userApi";

function ManageOfficers() {
    const [officers, setOfficers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form fields for Add / Edit
    const [employeeCode, setEmployeeCode] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedDeptId, setSelectedDeptId] = useState("");
    const [designation, setDesignation] = useState("FRONT_DESK_OFFICER");
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const [officersData, deptData, usersData] = await Promise.all([
                getAllOfficers().catch(() => []),
                getAllDepartments().catch(() => []),
                getAllUsers().catch(() => []),
            ]);

            setOfficers(Array.isArray(officersData) ? officersData : []);
            setDepartments(Array.isArray(deptData) ? deptData : []);
            setUsers(Array.isArray(usersData) ? usersData : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load officers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ---------------- VIEW ----------------
    const handleView = (officer) => {
        setSelectedOfficer(officer);
        setViewMode(true);
        setEditMode(false);
    };

    // ---------------- EDIT ----------------
    const handleEdit = (officer) => {
        setSelectedOfficer(officer);
        setEmployeeCode(officer.employeeCode || "");
        setSelectedDeptId(officer.department?.departmentId || "");
        setSelectedUserId(officer.user?.userId || "");
        setDesignation(officer.designation || "FRONT_DESK_OFFICER");
        setEditMode(true);
        setViewMode(false);
    };

    // ---------------- SAVE ADD / EDIT ----------------
    const handleSaveOfficer = async () => {
        if (!employeeCode.trim()) {
            alert("Please enter employee code.");
            return;
        }

        setSubmitting(true);
        try {
            if (editMode && selectedOfficer) {
                await updateOfficer(selectedOfficer.officerId, {
                    employeeCode,
                    designation,
                    department: { departmentId: Number(selectedDeptId) || departments[0]?.departmentId },
                });
                alert("Officer updated successfully!");
            } else {
                if (!selectedUserId) {
                    alert("Please select a user account to designate as officer.");
                    setSubmitting(false);
                    return;
                }
                await createOfficer({
                    employeeCode,
                    designation,
                    user: { userId: Number(selectedUserId) },
                    department: { departmentId: Number(selectedDeptId) || departments[0]?.departmentId },
                });
                alert("Officer created successfully!");
            }

            setShowAddForm(false);
            setEditMode(false);
            setSelectedOfficer(null);
            setEmployeeCode("");
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    // ---------------- DELETE ----------------
    const handleDeleteOfficer = async (officerId) => {
        if (!window.confirm("Are you sure you want to remove this officer assignment?")) return;

        try {
            await deleteOfficer(officerId);
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to delete officer.");
        }
    };

    return (
        <div className="officers-page">
            {/* Header */}
            <div className="officers-header">
                <div>
                    <p className="page-subtitle">Department Administration</p>
                    <h1>Manage Officers</h1>
                    <p>View, update and manage Front Desk, Verification, and Finance Officers.</p>
                </div>

                <div className="officer-count">
                    <span>👥</span>
                    <div>
                        <strong>{officers.length}</strong>
                        <small>Total Officers</small>
                    </div>
                </div>
            </div>

            {/* Officer Table Card */}
            <div className="officers-card">
                <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h2>Department Officers</h2>
                        <p>Manage officers assigned to your department.</p>
                    </div>

                    <button
                        className="add-officer-btn"
                        style={{
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            setSelectedOfficer(null);
                            setEditMode(false);
                            setViewMode(false);
                            setEmployeeCode("");
                            setSelectedUserId(users[0]?.userId || "");
                            setSelectedDeptId(departments[0]?.departmentId || "");
                            setDesignation("FRONT_DESK_OFFICER");
                            setShowAddForm(true);
                        }}
                    >
                        + Add Officer
                    </button>
                </div>

                {loading && <p style={{ padding: "20px" }}>Loading officers...</p>}
                {error && <div className="alert alert-danger" style={{ margin: "20px" }}>{error}</div>}

                {/* Add / Edit Form Card */}
                {(showAddForm || editMode) && (
                    <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", margin: "20px 0", border: "1px solid #e2e8f0" }}>
                        <h3>{editMode ? "Edit Officer" : "Add New Officer"}</h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: 600 }}>Employee Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. EMP-2026-01"
                                    value={employeeCode}
                                    onChange={(e) => setEmployeeCode(e.target.value)}
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                                />
                            </div>

                            {!editMode && (
                                <div>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: 600 }}>Select User Account</label>
                                    <select
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(e.target.value)}
                                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                                    >
                                        <option value="">-- Choose User --</option>
                                        {users.map((u) => (
                                            <option key={u.userId} value={u.userId}>
                                                {u.fullName} ({u.mobileNumber} - {u.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: 600 }}>Designation / Role</label>
                                <select
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                                >
                                    <option value="FRONT_DESK_OFFICER">Front Desk Officer</option>
                                    <option value="VERIFICATION_OFFICER">Verification Officer</option>
                                    <option value="FINANCE_OFFICER">Finance Officer</option>
                                    <option value="DEPT_ADMIN">Department Admin</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: 600 }}>Department</label>
                                <select
                                    value={selectedDeptId}
                                    onChange={(e) => setSelectedDeptId(e.target.value)}
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                                >
                                    {departments.map((d) => (
                                        <option key={d.departmentId} value={d.departmentId}>
                                            {d.departmentName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button
                                style={{ background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: 600, cursor: "pointer" }}
                                onClick={handleSaveOfficer}
                                disabled={submitting}
                            >
                                {submitting ? "Saving..." : editMode ? "Update Officer" : "Save Officer"}
                            </button>
                            <button
                                style={{ background: "#64748b", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditMode(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <div className="table-wrapper">
                        <table className="officers-table">
                            <thead>
                                <tr>
                                    <th>Officer ID</th>
                                    <th>Name</th>
                                    <th>Role / Designation</th>
                                    <th>Department</th>
                                    <th>Employee Code</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {officers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                            No officers found. Add one above.
                                        </td>
                                    </tr>
                                ) : (
                                    officers.map((officer) => {
                                        const name = officer.user?.fullName || "Officer";
                                        const role = officer.designation || officer.user?.role || "OFFICER";
                                        const dept = officer.department?.departmentName || "General";

                                        return (
                                            <tr key={officer.officerId || officer.id}>
                                                <td>
                                                    <strong className="officer-id">
                                                        {officer.officerId || officer.id}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <div className="name-cell">
                                                        <div className="avatar">
                                                            {name.charAt(0)}
                                                        </div>
                                                        <strong>{name}</strong>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="role-badge">
                                                        {role}
                                                    </span>
                                                </td>

                                                <td>{dept}</td>

                                                <td>{officer.employeeCode || "-"}</td>

                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="action-btn view"
                                                            onClick={() => handleView(officer)}
                                                        >
                                                            👁 View
                                                        </button>

                                                        <button
                                                            className="action-btn edit"
                                                            onClick={() => handleEdit(officer)}
                                                        >
                                                            ✏ Edit
                                                        </button>

                                                        <button
                                                            className="action-btn disable"
                                                            onClick={() => handleDeleteOfficer(officer.officerId || officer.id)}
                                                        >
                                                            🗑 Remove
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ---------------- VIEW MODAL ---------------- */}
            {viewMode && selectedOfficer && (
                <div className="modal-backdrop">
                    <div className="modal-card">
                        <h2>Officer Details</h2>

                        <div className="modal-body">
                            <p><strong>Name:</strong> {selectedOfficer.user?.fullName}</p>
                            <p><strong>Email:</strong> {selectedOfficer.user?.email || "-"}</p>
                            <p><strong>Phone:</strong> {selectedOfficer.user?.mobileNumber || "-"}</p>
                            <p><strong>Role:</strong> {selectedOfficer.designation || selectedOfficer.user?.role}</p>
                            <p><strong>Department:</strong> {selectedOfficer.department?.departmentName}</p>
                            <p><strong>Employee Code:</strong> {selectedOfficer.employeeCode}</p>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="action-btn close"
                                onClick={() => setViewMode(false)}
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

export default ManageOfficers;