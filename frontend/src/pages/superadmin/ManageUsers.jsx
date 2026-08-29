import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageUsers.css";
import { getAllUsers, updateUserById, deleteUser } from "../../api/userApi";
import { getRoleDisplayName, getRoleBadgeClass } from "../../utils/roleUtils";

function ManageUsers() {
    const navigate = useNavigate();

    // Data States
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // Filter States
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    // Modal / Edit States
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");

    const loadUsers = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const data = await getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load users:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to load users from database."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Filtered Users
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const name = (user.fullName || "").toLowerCase();
            const role = (user.role || "").toLowerCase();
            const displayRole = getRoleDisplayName(user.role).toLowerCase();
            const mobile = (user.mobileNumber || "").toLowerCase();
            const email = (user.email || "").toLowerCase();
            const idStr = String(user.userId || "");
            const q = search.toLowerCase();

            const matchesSearch =
                !search.trim() ||
                name.includes(q) ||
                role.includes(q) ||
                displayRole.includes(q) ||
                mobile.includes(q) ||
                email.includes(q) ||
                idStr.includes(q);

            const roleUpper = String(user.role || "").toUpperCase();
            const matchesRole =
                roleFilter === "ALL" ||
                roleUpper === roleFilter ||
                (roleFilter === "OFFICER" &&
                    (roleUpper.includes("OFFICER") || roleUpper.includes("ADMIN"))) ||
                (roleFilter === "BENEFICIARY" &&
                    (roleUpper.includes("BENEFICIARY") || roleUpper.includes("USER")));

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    // Computed Counts
    const counts = useMemo(() => {
        let officers = 0;
        let citizens = 0;
        users.forEach((u) => {
            const r = String(u.role || "").toUpperCase();
            if (r.includes("OFFICER") || r.includes("ADMIN")) {
                officers++;
            } else {
                citizens++;
            }
        });
        return {
            total: users.length,
            officers,
            citizens,
        };
    }, [users]);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditFormData({
            fullName: user.fullName || "",
            email: user.email || "",
            mobileNumber: user.mobileNumber || "",
            role: user.role || "ROLE_BENEFICIARY",
            address: user.address || "",
            occupation: user.occupation || "",
            category: user.category || "",
            bankName: user.bankName || "",
            accountNumber: user.accountNumber || "",
            ifscCode: user.ifscCode || "",
        });
        setModalError("");
        setModalSuccess("");
    };

    const handleSaveEdit = async (e) => {
        if (e) e.preventDefault();
        if (!editingUser) return;

        setSubmitting(true);
        setModalError("");
        try {
            await updateUserById(editingUser.userId, editFormData);
            setModalSuccess("User details updated successfully!");
            setTimeout(async () => {
                setEditingUser(null);
                await loadUsers(true);
            }, 700);
        } catch (err) {
            setModalError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to update user."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}" (ID: #${userId})?`)) return;
        try {
            await deleteUser(userId);
            await loadUsers(true);
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to delete user.");
        }
    };

    return (
        <div className="manage-users-page">
            <div className="container py-3">
                {/* 1. Page Hero / Header */}
                <div className="users-hero shadow-sm">
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
                                <span className="users-hero-tag">
                                    <i className="bi bi-shield-lock-fill me-1"></i> User Directory & Access
                                </span>
                            </div>
                            <h1 className="users-hero-title">Manage System Users</h1>
                            <p className="users-hero-subtitle">
                                Inspect registered citizen profiles, oversee administrative officers, and manage access entitlements.
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                className="btn btn-outline-light rounded-pill px-3"
                                onClick={() => loadUsers(true)}
                                disabled={refreshing}
                            >
                                <i className={`bi bi-arrow-repeat me-1 ${refreshing ? "spin-animation" : ""}`}></i>
                                {refreshing ? "Refreshing..." : "Refresh"}
                            </button>
                        </div>
                    </div>
                </div>

                {error && <div className="alert alert-danger shadow-sm my-3">{error}</div>}

                {/* 2. Summary KPI Cards */}
                <div className="row g-3 mt-1">
                    <div className="col-12 col-md-4">
                        <div className="user-stat-card">
                            <div className="user-icon-circle blue">
                                <i className="bi bi-people-fill"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Total Users</span>
                                <h3>{loading ? "..." : counts.total}</h3>
                                <small className="text-muted">Registered accounts</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="user-stat-card">
                            <div className="user-icon-circle green">
                                <i className="bi bi-person-badge-fill"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Officers & Admins</span>
                                <h3>{loading ? "..." : counts.officers}</h3>
                                <small className="text-success fw-medium">Departmental staff</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="user-stat-card">
                            <div className="user-icon-circle purple">
                                <i className="bi bi-person-check-fill"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Citizens / Beneficiaries</span>
                                <h3>{loading ? "..." : counts.citizens}</h3>
                                <small className="text-muted">Direct grant applicants</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Users Table Card */}
                <div className="card shadow-sm border-0 rounded-4 mt-4 bg-white overflow-hidden">
                    {/* Management Toolbar */}
                    <div className="users-toolbar p-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div className="users-search-wrapper">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search by name, role, mobile, email, or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <div className="btn-group btn-group-sm" role="group">
                                <button
                                    type="button"
                                    className={`btn ${roleFilter === "ALL" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setRoleFilter("ALL")}
                                >
                                    All ({counts.total})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${roleFilter === "OFFICER" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setRoleFilter("OFFICER")}
                                >
                                    Officers ({counts.officers})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${roleFilter === "BENEFICIARY" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setRoleFilter("BENEFICIARY")}
                                >
                                    Citizens ({counts.citizens})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="p-0">
                        {loading ? (
                            <div className="text-center py-5 text-muted">
                                <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                                Loading system users from database...
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="users-empty-state py-5 text-center">
                                <div className="empty-icon-box mb-3">
                                    <i className="bi bi-person-x"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-1">No users found</h5>
                                <p className="text-muted small mb-3">
                                    No accounts match your current search criteria.
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                    onClick={() => {
                                        setSearch("");
                                        setRoleFilter("ALL");
                                    }}
                                >
                                    Clear Search
                                </button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle custom-users-table mb-0">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "100px" }}>User ID</th>
                                            <th>Full Name</th>
                                            <th>System Role</th>
                                            <th>Mobile Number</th>
                                            <th>Email</th>
                                            <th style={{ width: "160px", textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.userId}>
                                                <td>
                                                    <span className="user-id-badge">
                                                        #{user.userId}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="user-avatar-circle">
                                                            {(user.fullName || "U").charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <strong className="text-dark d-block">
                                                                {user.fullName}
                                                            </strong>
                                                            <small className="text-muted">
                                                                {user.occupation || user.category || "Citizen"}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`${getRoleBadgeClass(user.role)} px-2 py-1 rounded-pill`}>
                                                        {getRoleDisplayName(user.role)}
                                                    </span>
                                                </td>
                                                <td className="text-dark fw-medium">
                                                    {user.mobileNumber || "—"}
                                                </td>
                                                <td className="text-muted small">
                                                    {user.email || "—"}
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <div className="d-inline-flex gap-1">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm rounded-pill px-2 py-1"
                                                            title="Edit User Profile"
                                                            onClick={() => handleEditClick(user)}
                                                        >
                                                            <i className="bi bi-pencil-square me-1"></i> Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm rounded-pill px-2 py-1"
                                                            title="Delete User"
                                                            onClick={() => handleDeleteUser(user.userId, user.fullName)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
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

            {/* 4. Edit User Modal */}
            {editingUser && (
                <div className="users-modal-backdrop" onClick={() => setEditingUser(null)}>
                    <div className="users-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="users-modal-header">
                            <div>
                                <h5 className="mb-0 fw-bold text-dark">Edit User Profile</h5>
                                <small className="text-muted">
                                    {editingUser.fullName} (User ID: #{editingUser.userId})
                                </small>
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setEditingUser(null)}
                            ></button>
                        </div>

                        {modalError && <div className="alert alert-danger mx-3 mt-3 mb-0">{modalError}</div>}
                        {modalSuccess && <div className="alert alert-success mx-3 mt-3 mb-0">{modalSuccess}</div>}

                        <form onSubmit={handleSaveEdit} className="p-3">
                            <div className="row g-3 mb-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label required-label fw-semibold">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editFormData.fullName || ""}
                                        onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={editFormData.email || ""}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label required-label fw-semibold">Mobile Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editFormData.mobileNumber || ""}
                                        onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">Role</label>
                                    <select
                                        className="form-select"
                                        value={editFormData.role || "ROLE_BENEFICIARY"}
                                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                    >
                                        <option value="ROLE_BENEFICIARY">Citizen / Beneficiary</option>
                                        <option value="ROLE_FRONT_DESK_OFFICER">Front Desk Officer</option>
                                        <option value="ROLE_VERIFICATION_OFFICER">Verification Officer</option>
                                        <option value="ROLE_FINANCE_OFFICER">Finance Officer</option>
                                        <option value="ROLE_DEPT_ADMIN">Department Admin</option>
                                        <option value="ROLE_SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">Occupation</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editFormData.occupation || ""}
                                        onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editFormData.address || ""}
                                        onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                                <button
                                    type="button"
                                    className="btn btn-light rounded-pill px-4"
                                    onClick={() => setEditingUser(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                                    disabled={submitting}
                                >
                                    {submitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageUsers;