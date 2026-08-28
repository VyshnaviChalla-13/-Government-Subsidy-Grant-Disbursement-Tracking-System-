import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./DepartmentManagement.css";
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../../api/departmentApi";

function DepartmentManagement() {
    const navigate = useNavigate();

    // Data States
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // Filter States
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, DISABLED

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [formData, setFormData] = useState({
        departmentName: "",
        description: "",
        status: "ACTIVE",
    });
    const [modalSubmitting, setModalSubmitting] = useState(false);
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");

    const loadDepartments = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const data = await getAllDepartments();
            setDepartments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load departments:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to load departments from database."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    // Filtered departments
    const filteredDepartments = useMemo(() => {
        return departments.filter((dept) => {
            const name = (dept.departmentName || "").toLowerCase();
            const desc = (dept.description || "").toLowerCase();
            const idStr = String(dept.departmentId || "");
            const q = search.toLowerCase();

            const matchesSearch =
                !search.trim() ||
                name.includes(q) ||
                desc.includes(q) ||
                idStr.includes(q);

            const deptStatus = (dept.status || "ACTIVE").toUpperCase();
            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && deptStatus === "ACTIVE") ||
                (statusFilter === "DISABLED" && deptStatus !== "ACTIVE");

            return matchesSearch && matchesStatus;
        });
    }, [departments, search, statusFilter]);

    // Computed Counts
    const activeCount = useMemo(
        () => departments.filter((d) => (d.status || "ACTIVE").toUpperCase() === "ACTIVE").length,
        [departments]
    );
    const disabledCount = useMemo(
        () => departments.filter((d) => (d.status || "ACTIVE").toUpperCase() !== "ACTIVE").length,
        [departments]
    );

    // Modal Open Handlers
    const handleOpenCreateModal = () => {
        setEditingDept(null);
        setFormData({
            departmentName: "",
            description: "",
            status: "ACTIVE",
        });
        setModalError("");
        setModalSuccess("");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (dept) => {
        setEditingDept(dept);
        setFormData({
            departmentName: dept.departmentName || "",
            description: dept.description || "",
            status: dept.status || "ACTIVE",
        });
        setModalError("");
        setModalSuccess("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDept(null);
        setModalError("");
        setModalSuccess("");
    };

    // Submit Create or Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.departmentName.trim()) {
            setModalError("Department Name is required.");
            return;
        }

        setModalSubmitting(true);
        setModalError("");
        try {
            if (editingDept) {
                await updateDepartment(editingDept.departmentId, {
                    departmentName: formData.departmentName.trim(),
                    description: formData.description.trim(),
                    status: formData.status,
                });
                setModalSuccess("Department updated successfully!");
            } else {
                await createDepartment({
                    departmentName: formData.departmentName.trim(),
                    description: formData.description.trim(),
                    status: formData.status,
                });
                setModalSuccess("Department created successfully!");
            }

            setTimeout(async () => {
                handleCloseModal();
                await loadDepartments(true);
            }, 800);
        } catch (err) {
            setModalError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to save department."
            );
        } finally {
            setModalSubmitting(false);
        }
    };

    // Toggle Status
    const handleToggleStatus = async (dept) => {
        const currentStatus = (dept.status || "ACTIVE").toUpperCase();
        const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
        try {
            await updateDepartment(dept.departmentId, {
                ...dept,
                status: newStatus,
            });
            await loadDepartments(true);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to change department status."
            );
        }
    };

    // Delete Department
    const handleDelete = async (deptId, deptName) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${deptName}" (ID: #${deptId})? This action cannot be undone.`
            )
        ) {
            return;
        }

        try {
            await deleteDepartment(deptId);
            await loadDepartments(true);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to delete department. It may have associated schemes or officers."
            );
        }
    };

    return (
        <div className="dept-mgmt-page">
            <div className="container py-3">
                {/* 1. Page Hero / Header */}
                <div className="dept-hero shadow-sm">
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
                                <span className="dept-hero-tag">
                                    <i className="bi bi-building-gear me-1"></i> Central Governance
                                </span>
                            </div>
                            <h1 className="dept-hero-title">Department Management</h1>
                            <p className="dept-hero-subtitle">
                                Administer government ministries, configure department mandates, and supervise administrative jurisdiction.
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                className="btn btn-light rounded-pill px-3 shadow-sm fw-semibold"
                                onClick={handleOpenCreateModal}
                            >
                                <i className="bi bi-building-add text-primary me-1"></i> Add Department
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-light rounded-pill px-3"
                                onClick={() => loadDepartments(true)}
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
                        <div className="dept-stat-card">
                            <div className="stat-icon-circle blue">
                                <i className="bi bi-buildings-fill"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Total Departments</span>
                                <h3>{loading ? "..." : departments.length}</h3>
                                <small className="text-muted">Registered entities</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="dept-stat-card">
                            <div className="stat-icon-circle green">
                                <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Active Departments</span>
                                <h3>{loading ? "..." : activeCount}</h3>
                                <small className="text-success fw-medium">Operational & Hosting Schemes</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="dept-stat-card">
                            <div className="stat-icon-circle gray">
                                <i className="bi bi-slash-circle-fill"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Disabled Departments</span>
                                <h3>{loading ? "..." : disabledCount}</h3>
                                <small className="text-secondary fw-medium">Deactivated / Under Maintenance</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Toolbar & Table Container Card */}
                <div className="card shadow-sm border-0 rounded-4 mt-4 bg-white overflow-hidden">
                    {/* Management Toolbar */}
                    <div className="dept-toolbar p-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
                        {/* Search Input */}
                        <div className="dept-search-wrapper">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search by name, ID, or mission..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="d-flex align-items-center gap-2">
                            <div className="btn-group btn-group-sm" role="group">
                                <button
                                    type="button"
                                    className={`btn ${statusFilter === "ALL" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setStatusFilter("ALL")}
                                >
                                    All ({departments.length})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${statusFilter === "ACTIVE" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setStatusFilter("ACTIVE")}
                                >
                                    Active ({activeCount})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${statusFilter === "DISABLED" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setStatusFilter("DISABLED")}
                                >
                                    Disabled ({disabledCount})
                                </button>
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary btn-sm rounded-pill px-3 ms-2"
                                onClick={handleOpenCreateModal}
                            >
                                <i className="bi bi-plus-lg me-1"></i> Add Department
                            </button>
                        </div>
                    </div>

                    {/* Department Table */}
                    <div className="p-0">
                        {loading ? (
                            <div className="text-center py-5 text-muted">
                                <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                                Loading departments from database...
                            </div>
                        ) : filteredDepartments.length === 0 ? (
                            <div className="dept-empty-state py-5 text-center">
                                <div className="empty-icon-box mb-3">
                                    <i className="bi bi-buildings"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-1">No departments found</h5>
                                <p className="text-muted small mb-3">
                                    {departments.length === 0
                                        ? "Add a department to start organizing government welfare programs."
                                        : "No departments match your current search or status filter."}
                                </p>
                                {departments.length === 0 ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm rounded-pill px-4"
                                        onClick={handleOpenCreateModal}
                                    >
                                        <i className="bi bi-plus-lg me-1"></i> Add First Department
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                        onClick={() => {
                                            setSearch("");
                                            setStatusFilter("ALL");
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle custom-dept-table mb-0">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "110px" }}>Dept ID</th>
                                            <th style={{ width: "240px" }}>Department Name</th>
                                            <th>Mandate / Description</th>
                                            <th style={{ width: "120px" }}>Status</th>
                                            <th style={{ width: "190px", textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDepartments.map((dept) => {
                                            const isActive = (dept.status || "ACTIVE").toUpperCase() === "ACTIVE";
                                            return (
                                                <tr key={dept.departmentId}>
                                                    <td>
                                                        <span className="dept-id-badge">
                                                            #{dept.departmentId}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="dept-row-icon">
                                                                <i className="bi bi-building"></i>
                                                            </div>
                                                            <strong className="text-dark dept-name-text">
                                                                {dept.departmentName}
                                                            </strong>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="dept-desc-text mb-0" title={dept.description || ""}>
                                                            {dept.description || <span className="text-muted fst-italic">No description specified</span>}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                isActive
                                                                    ? "bg-success-subtle text-success border border-success-subtle"
                                                                    : "bg-secondary-subtle text-secondary border border-secondary-subtle"
                                                            } px-2 py-1 rounded-pill`}
                                                        >
                                                            <i className={`bi ${isActive ? "bi-check-circle-fill" : "bi-pause-circle-fill"} me-1`}></i>
                                                            {isActive ? "ACTIVE" : "DISABLED"}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <div className="d-inline-flex gap-1">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary btn-sm rounded-pill px-2 py-1"
                                                                title="Edit Department"
                                                                onClick={() => handleOpenEditModal(dept)}
                                                            >
                                                                <i className="bi bi-pencil-square me-1"></i> Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className={`btn ${
                                                                    isActive ? "btn-outline-warning" : "btn-outline-success"
                                                                } btn-sm rounded-pill px-2 py-1`}
                                                                title={isActive ? "Disable Department" : "Enable Department"}
                                                                onClick={() => handleToggleStatus(dept)}
                                                            >
                                                                {isActive ? "Disable" : "Enable"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm rounded-pill px-2 py-1"
                                                                title="Delete Department"
                                                                onClick={() => handleDelete(dept.departmentId, dept.departmentName)}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. Add / Edit Department Modal */}
            {isModalOpen && (
                <div className="dept-modal-backdrop" onClick={handleCloseModal}>
                    <div className="dept-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="dept-modal-header">
                            <div>
                                <h5 className="mb-0 fw-bold text-dark">
                                    {editingDept ? "Edit Department" : "Add Government Department"}
                                </h5>
                                <small className="text-muted">
                                    {editingDept
                                        ? `Update details for Department #${editingDept.departmentId}`
                                        : "Register a department to host welfare schemes and assign officers"}
                                </small>
                            </div>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>

                        {modalError && <div className="alert alert-danger mx-3 mt-3 mb-0">{modalError}</div>}
                        {modalSuccess && <div className="alert alert-success mx-3 mt-3 mb-0">{modalSuccess}</div>}

                        <form onSubmit={handleSubmit} className="p-3">
                            <div className="mb-3">
                                <label className="form-label required-label fw-semibold">Department Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Department of Agriculture & Farmers Welfare"
                                    value={formData.departmentName}
                                    onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Mandate / Mission Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Brief mandate, key welfare focus areas, and jurisdictional guidelines..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Operational Status</label>
                                <select
                                    className="form-select"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="ACTIVE">ACTIVE (Accepting Schemes & Applications)</option>
                                    <option value="DISABLED">DISABLED (Suspended / Under Review)</option>
                                </select>
                            </div>

                            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                                <button
                                    type="button"
                                    className="btn btn-light rounded-pill px-4"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                                    disabled={modalSubmitting}
                                >
                                    {modalSubmitting
                                        ? "Saving..."
                                        : editingDept
                                        ? "Update Department"
                                        : "Create Department"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DepartmentManagement;