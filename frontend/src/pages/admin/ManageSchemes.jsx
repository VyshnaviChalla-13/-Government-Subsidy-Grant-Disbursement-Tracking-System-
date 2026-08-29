import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageSchemes.css";
import {
    getAllSchemes,
    createScheme,
    updateScheme,
    deleteScheme,
} from "../../api/schemeApi";
import { getAllDepartments } from "../../api/departmentApi";
import { useAuth } from "../../context/AuthContext";

function formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(Number(amount))) return "₹0";
    const num = Number(amount);
    if (num >= 10000000) {
        return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
        return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
}

function ManageSchemes() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Data States
    const [schemes, setSchemes] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // Filter States
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, INACTIVE
    const [deptFilter, setDeptFilter] = useState("ALL");

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedSchemeForView, setSelectedSchemeForView] = useState(null);
    const [editingScheme, setEditingScheme] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        schemeName: "",
        departmentId: "",
        description: "",
        totalBudget: "",
        minGrant: "",
        maxGrant: "",
        minimumScore: "50",
        eligibilityScore: "50",
        applicationStartDate: new Date().toISOString().split("T")[0],
        applicationEndDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
        status: "ACTIVE",
    });

    const [modalSubmitting, setModalSubmitting] = useState(false);
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");

    const loadData = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const [schemesData, deptsData] = await Promise.allSettled([
                getAllSchemes(),
                getAllDepartments(),
            ]);

            if (schemesData.status === "fulfilled" && Array.isArray(schemesData.value)) {
                setSchemes(schemesData.value);
            }
            if (deptsData.status === "fulfilled" && Array.isArray(deptsData.value)) {
                setDepartments(deptsData.value);
            }
        } catch (err) {
            console.error("Failed to load schemes:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to load schemes from database."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Filtered Schemes
    const filteredSchemes = useMemo(() => {
        return schemes.filter((scheme) => {
            const name = (scheme.schemeName || "").toLowerCase();
            const deptName = (scheme.department?.departmentName || "").toLowerCase();
            const idStr = String(scheme.schemeId || "");
            const q = search.toLowerCase();

            const matchesSearch =
                !search.trim() ||
                name.includes(q) ||
                deptName.includes(q) ||
                idStr.includes(q);

            const statusUpper = (scheme.status || "ACTIVE").toUpperCase();
            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && statusUpper === "ACTIVE") ||
                (statusFilter === "INACTIVE" && statusUpper !== "ACTIVE");

            const matchesDept =
                deptFilter === "ALL" ||
                String(scheme.department?.departmentId) === String(deptFilter);

            return matchesSearch && matchesStatus && matchesDept;
        });
    }, [schemes, search, statusFilter, deptFilter]);

    // Computed Stats
    const stats = useMemo(() => {
        let totalAllocated = 0;
        let totalUsed = 0;
        let active = 0;
        let inactive = 0;

        schemes.forEach((s) => {
            const budget = Number(s.totalBudget) || Number(s.maxGrant) || 0;
            const used = Number(s.budgetUsed) || 0;
            totalAllocated += budget;
            totalUsed += used;

            if ((s.status || "ACTIVE").toUpperCase() === "ACTIVE") active++;
            else inactive++;
        });

        return {
            total: schemes.length,
            active,
            inactive,
            totalAllocated,
            totalUsed,
        };
    }, [schemes]);

    // Handlers
    const handleOpenCreateModal = () => {
        setEditingScheme(null);
        setFormData({
            schemeName: "",
            departmentId: departments[0]?.departmentId || "",
            description: "",
            totalBudget: "",
            minGrant: "",
            maxGrant: "",
            minimumScore: "50",
            eligibilityScore: "50",
            applicationStartDate: new Date().toISOString().split("T")[0],
            applicationEndDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
            status: "ACTIVE",
        });
        setModalError("");
        setModalSuccess("");
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (scheme) => {
        setEditingScheme(scheme);
        setFormData({
            schemeName: scheme.schemeName || "",
            departmentId: scheme.department?.departmentId || "",
            description: scheme.description || "",
            totalBudget: scheme.totalBudget || "",
            minGrant: scheme.minGrant || "",
            maxGrant: scheme.maxGrant || "",
            minimumScore: scheme.minimumScore || "50",
            eligibilityScore: scheme.eligibilityScore || "50",
            applicationStartDate: scheme.applicationStartDate || "",
            applicationEndDate: scheme.applicationEndDate || "",
            status: scheme.status || "ACTIVE",
        });
        setModalError("");
        setModalSuccess("");
        setIsCreateModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setEditingScheme(null);
        setSelectedSchemeForView(null);
        setModalError("");
        setModalSuccess("");
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.schemeName.trim()) {
            setModalError("Scheme Name is required.");
            return;
        }
        if (!formData.departmentId) {
            setModalError("Please select a Department.");
            return;
        }
        if (!formData.totalBudget || Number(formData.totalBudget) <= 0) {
            setModalError("Please provide a valid Total Budget.");
            return;
        }

        setModalSubmitting(true);
        setModalError("");
        try {
            const currentUserId = user?.userId ?? user?.id ?? 1;
            const payload = {
                schemeName: formData.schemeName.trim(),
                description: formData.description.trim(),
                totalBudget: Number(formData.totalBudget),
                minGrant: Number(formData.minGrant || 0),
                maxGrant: Number(formData.maxGrant || formData.totalBudget),
                minimumScore: Number(formData.minimumScore || 50),
                eligibilityScore: Number(formData.eligibilityScore || 50),
                applicationStartDate: formData.applicationStartDate,
                applicationEndDate: formData.applicationEndDate,
                status: formData.status,
                department: { departmentId: Number(formData.departmentId) },
                user: { userId: Number(currentUserId) },
            };

            if (editingScheme) {
                const response = await updateScheme(editingScheme.schemeId, {
                    ...editingScheme,
                    ...payload,
                });
                if (typeof response === "string" && response !== "Scheme updated successfully") {
                    setModalError(response);
                    return;
                }
                setModalSuccess("Scheme updated successfully!");
            } else {
                const response = await createScheme({
                    ...payload,
                    budgetUsed: 0,
                });
                if (typeof response === "string" && response !== "Scheme created successfully") {
                    setModalError(response);
                    return;
                }
                setModalSuccess("Scheme created successfully!");
            }

            setTimeout(async () => {
                handleCloseModal();
                await loadData(true);
            }, 800);
        } catch (err) {
            console.error("Scheme save error:", err);
            const msg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to save scheme.";
            setModalError(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally {
            setModalSubmitting(false);
        }
    };

    const handleToggleStatus = async (scheme) => {
        const currentStatus = (scheme.status || "ACTIVE").toUpperCase();
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        try {
            await updateScheme(scheme.schemeId, {
                ...scheme,
                status: newStatus,
            });
            await loadData(true);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to change scheme status."
            );
        }
    };

    const handleDelete = async (schemeId, schemeName) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${schemeName}" (ID: #${schemeId})? This action cannot be undone.`
            )
        ) {
            return;
        }

        try {
            await deleteScheme(schemeId);
            await loadData(true);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to delete scheme. It may have existing applications."
            );
        }
    };

    return (
        <div className="manage-schemes-page">
            <div className="container py-3">
                {/* 1. Page Hero / Header */}
                <div className="schemes-hero shadow-sm">
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
                                <span className="schemes-hero-tag">
                                    <i className="bi bi-award-fill me-1"></i> Welfare Scheme Portfolio
                                </span>
                            </div>
                            <h1 className="schemes-hero-title">Manage Government Schemes</h1>
                            <p className="schemes-hero-subtitle">
                                Track, configure, and monitor welfare grant schemes created across government departments.
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                className="btn btn-light rounded-pill px-3 shadow-sm fw-semibold"
                                onClick={handleOpenCreateModal}
                            >
                                <i className="bi bi-plus-circle-fill text-primary me-1"></i> Create Scheme
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-light rounded-pill px-3"
                                onClick={() => loadData(true)}
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
                    <div className="col-6 col-md-3">
                        <div className="scheme-stat-card">
                            <div className="scheme-icon-circle blue">
                                <i className="bi bi-collection-play-fill"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Total Schemes</span>
                                <h3>{loading ? "..." : stats.total}</h3>
                                <small className="text-muted">Registered programs</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="scheme-stat-card">
                            <div className="scheme-icon-circle green">
                                <i className="bi bi-check2-circle"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Active Schemes</span>
                                <h3>{loading ? "..." : stats.active}</h3>
                                <small className="text-success fw-medium">Open for applications</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="scheme-stat-card">
                            <div className="scheme-icon-circle cyan">
                                <i className="bi bi-bank"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Total Budget</span>
                                <h3>{loading ? "..." : formatCurrency(stats.totalAllocated)}</h3>
                                <small className="text-muted">Approved grant allocation</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="scheme-stat-card">
                            <div className="scheme-icon-circle orange">
                                <i className="bi bi-cash-coin"></i>
                            </div>
                            <div>
                                <span className="stat-card-label">Disbursed Funds</span>
                                <h3>{loading ? "..." : formatCurrency(stats.totalUsed)}</h3>
                                <small className="text-muted">Milestone releases</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Toolbar & Schemes Table */}
                <div className="card shadow-sm border-0 rounded-4 mt-4 bg-white overflow-hidden">
                    {/* Management Toolbar */}
                    <div className="schemes-toolbar p-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
                        {/* Search Input */}
                        <div className="schemes-search-wrapper">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search by scheme name, ID, or department..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Filters and Actions */}
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            {/* Department Filter */}
                            <select
                                className="form-select form-select-sm"
                                style={{ width: "190px" }}
                                value={deptFilter}
                                onChange={(e) => setDeptFilter(e.target.value)}
                            >
                                <option value="ALL">All Departments</option>
                                {departments.map((d) => (
                                    <option key={d.departmentId} value={d.departmentId}>
                                        {d.departmentName}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter Tabs */}
                            <div className="btn-group btn-group-sm" role="group">
                                <button
                                    type="button"
                                    className={`btn ${statusFilter === "ALL" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setStatusFilter("ALL")}
                                >
                                    All ({schemes.length})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${statusFilter === "ACTIVE" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setStatusFilter("ACTIVE")}
                                >
                                    Active ({stats.active})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${statusFilter === "INACTIVE" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setStatusFilter("INACTIVE")}
                                >
                                    Inactive ({stats.inactive})
                                </button>
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary btn-sm rounded-pill px-3 ms-2"
                                onClick={handleOpenCreateModal}
                            >
                                <i className="bi bi-plus-lg me-1"></i> New Scheme
                            </button>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="p-0">
                        {loading ? (
                            <div className="text-center py-5 text-muted">
                                <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                                Loading welfare schemes from database...
                            </div>
                        ) : filteredSchemes.length === 0 ? (
                            <div className="schemes-empty-state py-5 text-center">
                                <div className="empty-icon-box mb-3">
                                    <i className="bi bi-folder-x"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-1">No welfare schemes found</h5>
                                <p className="text-muted small mb-3">
                                    {schemes.length === 0
                                        ? "Create a scheme to begin managing government welfare programs."
                                        : "No schemes match your current search or status filter."}
                                </p>
                                {schemes.length === 0 ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm rounded-pill px-4"
                                        onClick={handleOpenCreateModal}
                                    >
                                        <i className="bi bi-plus-lg me-1"></i> Create First Scheme
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                        onClick={() => {
                                            setSearch("");
                                            setStatusFilter("ALL");
                                            setDeptFilter("ALL");
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle custom-schemes-table mb-0">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "100px" }}>Scheme ID</th>
                                            <th>Scheme Name</th>
                                            <th>Department</th>
                                            <th>Max Grant</th>
                                            <th>Total Budget</th>
                                            <th>Deadline</th>
                                            <th style={{ width: "110px" }}>Status</th>
                                            <th style={{ width: "210px", textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSchemes.map((scheme) => {
                                            const isActive = (scheme.status || "ACTIVE").toUpperCase() === "ACTIVE";
                                            return (
                                                <tr key={scheme.schemeId}>
                                                    <td>
                                                        <span className="scheme-id-badge">
                                                            #SCH-{scheme.schemeId}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <strong className="text-dark d-block scheme-title-text">
                                                            {scheme.schemeName}
                                                        </strong>
                                                        <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: "260px" }}>
                                                            {scheme.description || "No description"}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-light text-secondary border">
                                                            {scheme.department?.departmentName || "General Department"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <strong>{formatCurrency(scheme.maxGrant)}</strong>
                                                    </td>
                                                    <td>
                                                        <strong>{formatCurrency(scheme.totalBudget)}</strong>
                                                    </td>
                                                    <td className="text-muted small">
                                                        {scheme.applicationEndDate || "Open"}
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
                                                            {isActive ? "ACTIVE" : "INACTIVE"}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <div className="d-inline-flex gap-1">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-info btn-sm rounded-pill px-2 py-1"
                                                                title="View Scheme Details"
                                                                onClick={() => setSelectedSchemeForView(scheme)}
                                                            >
                                                                <i className="bi bi-eye"></i> View
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary btn-sm rounded-pill px-2 py-1"
                                                                title="Edit Scheme"
                                                                onClick={() => handleOpenEditModal(scheme)}
                                                            >
                                                                <i className="bi bi-pencil-square"></i> Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className={`btn ${
                                                                    isActive ? "btn-outline-warning" : "btn-outline-success"
                                                                } btn-sm rounded-pill px-2 py-1`}
                                                                title={isActive ? "Deactivate Scheme" : "Activate Scheme"}
                                                                onClick={() => handleToggleStatus(scheme)}
                                                            >
                                                                {isActive ? "Deactivate" : "Activate"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm rounded-pill px-2 py-1"
                                                                title="Delete Scheme"
                                                                onClick={() => handleDelete(scheme.schemeId, scheme.schemeName)}
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

            {/* 4. Create / Edit Scheme Modal */}
            {isCreateModalOpen && (
                <div className="schemes-modal-backdrop" onClick={handleCloseModal}>
                    <div className="schemes-modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="schemes-modal-header">
                            <div>
                                <h5 className="mb-0 fw-bold text-dark">
                                    {editingScheme ? "Edit Welfare Scheme" : "Launch New Welfare Scheme"}
                                </h5>
                                <small className="text-muted">
                                    {editingScheme
                                        ? `Update parameters for Scheme #${editingScheme.schemeId}`
                                        : "Define budget headroom, grant caps, and host department"}
                                </small>
                            </div>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>

                        {modalError && <div className="alert alert-danger mx-3 mt-3 mb-0">{modalError}</div>}
                        {modalSuccess && <div className="alert alert-success mx-3 mt-3 mb-0">{modalSuccess}</div>}

                        <form onSubmit={handleFormSubmit} className="p-3">
                            <div className="row g-3 mb-3">
                                <div className="col-12 col-md-8">
                                    <label className="form-label required-label fw-semibold">Scheme Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Higher Education Scholarship & Grant"
                                        value={formData.schemeName}
                                        onChange={(e) => setFormData({ ...formData, schemeName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <label className="form-label required-label fw-semibold">Host Department</label>
                                    <select
                                        className="form-select"
                                        value={formData.departmentId}
                                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Select Department --</option>
                                        {departments.map((d) => (
                                            <option key={d.departmentId} value={d.departmentId}>
                                                {d.departmentName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Description & Eligibility Criteria</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder="Purpose of the scheme, target beneficiaries, eligibility rules..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-12 col-md-4">
                                    <label className="form-label required-label fw-semibold">Total Budget (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="e.g. 5000000"
                                        value={formData.totalBudget}
                                        onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <label className="form-label required-label fw-semibold">Min Grant (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="e.g. 10000"
                                        value={formData.minGrant}
                                        onChange={(e) => setFormData({ ...formData, minGrant: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <label className="form-label required-label fw-semibold">Max Grant (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="e.g. 50000"
                                        value={formData.maxGrant}
                                        onChange={(e) => setFormData({ ...formData, maxGrant: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">Application Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.applicationStartDate}
                                        onChange={(e) => setFormData({ ...formData, applicationStartDate: e.target.value })}
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">Application End Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.applicationEndDate}
                                        onChange={(e) => setFormData({ ...formData, applicationEndDate: e.target.value })}
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold">Scheme Status</label>
                                    <select
                                        className="form-select"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>
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
                                        : editingScheme
                                        ? "Update Scheme"
                                        : "Launch Scheme"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 5. View Scheme Details Modal */}
            {selectedSchemeForView && (
                <div className="schemes-modal-backdrop" onClick={handleCloseModal}>
                    <div className="schemes-modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="schemes-modal-header">
                            <div>
                                <h5 className="mb-0 fw-bold text-dark">{selectedSchemeForView.schemeName}</h5>
                                <small className="text-muted">
                                    Department: {selectedSchemeForView.department?.departmentName || "General"} • ID: #SCH-{selectedSchemeForView.schemeId}
                                </small>
                            </div>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>

                        <div className="p-4">
                            <div className="row g-3 mb-4">
                                <div className="col-6 col-md-3">
                                    <div className="p-3 bg-light rounded text-center">
                                        <small className="text-muted d-block">Status</small>
                                        <span className="badge bg-success mt-1">
                                            {selectedSchemeForView.status || "ACTIVE"}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-6 col-md-3">
                                    <div className="p-3 bg-light rounded text-center">
                                        <small className="text-muted d-block">Total Budget</small>
                                        <strong className="text-dark">
                                            {formatCurrency(selectedSchemeForView.totalBudget || selectedSchemeForView.maxGrant)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="col-6 col-md-3">
                                    <div className="p-3 bg-light rounded text-center">
                                        <small className="text-muted d-block">Budget Used</small>
                                        <strong className="text-primary">
                                            {formatCurrency(selectedSchemeForView.budgetUsed || 0)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="col-6 col-md-3">
                                    <div className="p-3 bg-light rounded text-center">
                                        <small className="text-muted d-block">Grant Cap</small>
                                        <strong className="text-success">
                                            {formatCurrency(selectedSchemeForView.maxGrant)}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-bold text-dark">Description & Objectives</h6>
                                <p className="text-muted small mb-0">
                                    {selectedSchemeForView.description ||
                                        "No detailed description provided for this government scheme."}
                                </p>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <div className="border rounded p-3 bg-white">
                                        <strong className="d-block mb-1 text-dark">Grant Range</strong>
                                        <span className="text-muted small">
                                            Min: {formatCurrency(selectedSchemeForView.minGrant)} • Max: {formatCurrency(selectedSchemeForView.maxGrant)}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="border rounded p-3 bg-white">
                                        <strong className="d-block mb-1 text-dark">Application Window</strong>
                                        <span className="text-muted small">
                                            {selectedSchemeForView.applicationStartDate || "Anytime"} — {selectedSchemeForView.applicationEndDate || "Ongoing"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={handleCloseModal}>
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                                    onClick={() => {
                                        const sc = selectedSchemeForView;
                                        handleCloseModal();
                                        handleOpenEditModal(sc);
                                    }}
                                >
                                    <i className="bi bi-pencil-square me-1"></i> Edit Scheme
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageSchemes;