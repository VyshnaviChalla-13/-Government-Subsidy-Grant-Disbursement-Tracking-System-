import "./SuperAdminDashboard.css";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllDepartments, createDepartment } from "../../api/departmentApi";
import { getAllOfficers, createOfficer } from "../../api/officerApi";
import { getAllApplications } from "../../api/applicationApi";
import { getAllSchemes, createScheme } from "../../api/schemeApi";
import { getSystemOverview, getSchemeSummary } from "../../api/dashboardApi";
import { getAllUsers } from "../../api/userApi";
import { getAllAuditLogs } from "../../api/auditApi";
import {
    getUserNotifications,
    markNotificationAsRead,
} from "../../api/notificationApi";

// Utility function to format currency in Indian format
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

// Utility function to format relative or standard timestamps
function formatTimestamp(timestamp) {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return timestamp;

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function SuperAdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Data States
    const [overview, setOverview] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [schemeSummaries, setSchemeSummaries] = useState([]);
    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [notifications, setNotifications] = useState([]);

    // UI & Control States
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());

    // Header Dropdowns
    const [showMoreActions, setShowMoreActions] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationFilter, setNotificationFilter] = useState("ALL"); // ALL, UNREAD

    const notifRef = useRef(null);
    const moreActionsRef = useRef(null);

    // Modal States
    const [activeModal, setActiveModal] = useState(null); // 'ADD_DEPARTMENT', 'ADD_OFFICER', 'CREATE_SCHEME', 'SCHEME_DETAILS'
    const [selectedSchemeForModal, setSelectedSchemeForModal] = useState(null);
    const [modalSubmitting, setModalSubmitting] = useState(false);
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");

    // Form States
    const [deptForm, setDeptForm] = useState({
        departmentName: "",
        description: "",
        status: "ACTIVE",
    });

    const [officerForm, setOfficerForm] = useState({
        employeeCode: "",
        designation: "FRONT_DESK_OFFICER",
        departmentId: "",
        userId: "",
    });

    const [schemeForm, setSchemeForm] = useState({
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

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    // Close dropdowns when clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
                setShowMoreActions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Primary Data Fetching
    const fetchAllData = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true); else setLoading(true);
            setError("");

            const currentUserId = user?.userId ?? user?.id;

            const [
                overviewRes, deptsRes, officersRes, schemesRes,
                schemeSummaryRes, appsRes, usersRes, auditRes, notifRes,
            ] = await Promise.allSettled([
                getSystemOverview(), getAllDepartments(), getAllOfficers(),
                getAllSchemes(), getSchemeSummary(), getAllApplications(),
                getAllUsers(), getAllAuditLogs(),
                currentUserId ? getUserNotifications(currentUserId) : Promise.resolve([]),
            ]);

            if (overviewRes.status === "fulfilled") setOverview(overviewRes.value);
            if (deptsRes.status === "fulfilled") setDepartments(deptsRes.value);
            if (officersRes.status === "fulfilled") setOfficers(officersRes.value);
            if (schemesRes.status === "fulfilled") setSchemes(schemesRes.value);
            if (schemeSummaryRes.status === "fulfilled") setSchemeSummaries(schemeSummaryRes.value);
            if (appsRes.status === "fulfilled") setApplications(appsRes.value);
            if (usersRes.status === "fulfilled") setUsers(usersRes.value);
            if (auditRes.status === "fulfilled") setAuditLogs(auditRes.value);
            if (notifRes.status === "fulfilled") setNotifications(notifRes.value);
        } catch (err) {
            setError("Some dashboard components failed to load fresh data.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [user?.userId, user?.id]);

    // Computed Metrics
    const beneficiaries = useMemo(() => {
        return users.filter((u) => ["ROLE_BENEFICIARY", "ROLE_USER", "BENEFICIARY"].includes(String(u.role || "").toUpperCase()) || !u.role);
    }, [users]);

    const activeSchemes = useMemo(() => {
        return schemes.filter((s) => (s.status || "ACTIVE").toUpperCase() === "ACTIVE");
    }, [schemes]);

    const financialStats = useMemo(() => {
        let totalAllocated = 0;
        let totalUsed = 0;
        schemes.forEach((s) => {
            totalAllocated += Number(s.totalBudget) || Number(s.maxGrant) || 0;
            totalUsed += Number(s.budgetUsed) || 0;
        });

        if (schemeSummaries.length > 0) {
            let sumAllocated = 0;
            let sumUsed = 0;
            schemeSummaries.forEach((ss) => {
                sumAllocated += Number(ss.totalBudget || 0);
                sumUsed += Number(ss.budgetUsed || 0);
            });
            if (sumAllocated > 0) {
                totalAllocated = sumAllocated;
                totalUsed = sumUsed;
            }
        }

        return {
            totalAllocated,
            totalUsed,
            remaining: Math.max(0, totalAllocated - totalUsed),
            utilizationPercent: totalAllocated > 0 ? Math.min(100, (totalUsed / totalAllocated) * 100).toFixed(1) : "0.0",
        };
    }, [schemes, schemeSummaries]);

    const applicationPipeline = useMemo(() => {
        let submitted = 0, underReview = 0, actionRequired = 0, approved = 0, disbursed = 0, rejected = 0;
        applications.forEach((app) => {
            const status = (app.status || "SUBMITTED").toUpperCase();
            if (["SUBMITTED", "PENDING_FRONT_DESK", "RESUBMITTED"].includes(status)) submitted++;
            else if (["PENDING_VERIFICATION", "UNDER_VERIFICATION", "FIELD_APPROVED"].includes(status)) underReview++;
            else if (["RETURNED", "FIELD_RETURNED", "VERIFY_RETURNED", "ACTION_REQUIRED"].includes(status)) actionRequired++;
            else if (["VERIFICATION_APPROVED", "APPROVED", "PENDING_FINANCE", "SANCTIONED"].includes(status)) approved++;
            else if (["DISBURSED", "STAGE_RELEASED", "COMPLETED"].includes(status)) disbursed++;
            else if (["REJECTED", "FIELD_REJECTED", "VERIFY_REJECTED"].includes(status)) rejected++;
            else underReview++;
        });
        return { total: applications.length, submitted, underReview, actionRequired, approved, disbursed, rejected };
    }, [applications]);

    const unreadNotificationCount = useMemo(() => notifications.filter((n) => !n.isRead && !n.read).length, [notifications]);
    const displayedNotifications = useMemo(() => notificationFilter === "UNREAD" ? notifications.filter((n) => !n.isRead && !n.read) : notifications, [notifications, notificationFilter]);

    // Handlers
    const handleOpenModal = (modalType, schemeData = null) => {
        setActiveModal(modalType);
        setSelectedSchemeForModal(schemeData);
        setModalError("");
        setModalSuccess("");
        setShowMoreActions(false);
        if (modalType === "CREATE_SCHEME") {
            setSchemeForm({
                schemeName: "",
                departmentId: departments.length > 0 ? departments[0].departmentId : "",
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
        }
        if (modalType === "ADD_OFFICER") {
            setOfficerForm({
                employeeCode: "",
                designation: "FRONT_DESK_OFFICER",
                departmentId: departments.length > 0 ? departments[0].departmentId : "",
                userId: users.length > 0 ? users[0].userId : "",
            });
        }
    };

    const handleCloseModal = () => {
        setActiveModal(null);
        setSelectedSchemeForModal(null);
        setModalError("");
        setModalSuccess("");
        setDeptForm({ departmentName: "", description: "", status: "ACTIVE" });
        setOfficerForm({ employeeCode: "", designation: "FRONT_DESK_OFFICER", departmentId: "", userId: "" });
        setSchemeForm({
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
    };

    const handleSubmitDepartment = async (e) => {
        e.preventDefault();
        if (!deptForm.departmentName.trim()) { setModalError("Department name is required."); return; }
        setModalSubmitting(true);
        try {
            await createDepartment({ departmentName: deptForm.departmentName.trim(), description: deptForm.description, status: deptForm.status });
            setModalSuccess("Department created successfully!");
            setTimeout(async () => { handleCloseModal(); await fetchAllData(true); }, 1000);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || err.message || "Failed to create department.";
            setModalError(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally { setModalSubmitting(false); }
    };

    const handleSubmitOfficer = async (e) => {
        e.preventDefault();
        if (!officerForm.employeeCode.trim()) {
            setModalError("Employee Code is required.");
            return;
        }
        if (!officerForm.departmentId || !officerForm.userId) {
            setModalError("Please select both Department and User Account.");
            return;
        }
        setModalSubmitting(true);
        setModalError("");
        try {
            const response = await createOfficer({
                employeeCode: officerForm.employeeCode.trim(),
                designation: officerForm.designation,
                department: { departmentId: Number(officerForm.departmentId) },
                user: { userId: Number(officerForm.userId) },
            });
            if (typeof response === "string" && !response.startsWith("Officer created successfully")) {
                setModalError(response);
                return;
            }
            setModalSuccess("Officer assigned successfully!");
            setTimeout(async () => {
                handleCloseModal();
                await fetchAllData(true);
            }, 800);
        } catch (err) {
            console.error("Officer assignment error:", err);
            const msg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to assign officer.";
            setModalError(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally {
            setModalSubmitting(false);
        }
    };

    const handleSubmitScheme = async (e) => {
        e.preventDefault();
        if (!schemeForm.schemeName.trim()) {
            setModalError("Scheme Title is required.");
            return;
        }
        if (!schemeForm.departmentId) {
            setModalError("Please select a Department.");
            return;
        }
        if (!schemeForm.totalBudget || Number(schemeForm.totalBudget) <= 0) {
            setModalError("Please enter a valid Total Budget.");
            return;
        }

        setModalSubmitting(true);
        setModalError("");
        try {
            const currentUserId = user?.userId ?? user?.id;
            const payload = {
                schemeName: schemeForm.schemeName.trim(),
                description: (schemeForm.description || "").trim(),
                totalBudget: Number(schemeForm.totalBudget),
                budgetUsed: 0,
                minGrant: Number(schemeForm.minGrant || 0),
                maxGrant: Number(schemeForm.maxGrant || schemeForm.totalBudget),
                minimumScore: Number(schemeForm.minimumScore || 50),
                eligibilityScore: Number(schemeForm.eligibilityScore || 50),
                applicationStartDate: schemeForm.applicationStartDate || new Date().toISOString().split("T")[0],
                applicationEndDate: schemeForm.applicationEndDate || new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
                status: schemeForm.status || "ACTIVE",
                department: { departmentId: Number(schemeForm.departmentId) },
                ...(currentUserId ? { user: { userId: Number(currentUserId) } } : {}),
            };

            const response = await createScheme(payload);
            if (typeof response === "string" && response !== "Scheme created successfully") {
                setModalError(response);
                return;
            }

            setModalSuccess("Scheme created successfully!");
            setTimeout(async () => {
                handleCloseModal();
                await fetchAllData(true);
            }, 800);
        } catch (err) {
            console.error("Scheme creation error:", err);
            const msg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to create scheme.";
            setModalError(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally {
            setModalSubmitting(false);
        }
    };

    const handleMarkAllNotifications = async () => {
        try {
            const unread = notifications.filter((n) => !n.isRead && !n.read);
            await Promise.all(unread.map((n) => markNotificationAsRead(n.id || n.notificationId)));
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
        } catch (err) { console.error("Failed to mark all read:", err); }
    };

    const getStatusBadge = (status) => {
        const s = (status || "").toUpperCase();
        if (["APPROVED", "VERIFICATION_APPROVED", "SANCTIONED"].includes(s)) return { label: s, className: "badge bg-success-subtle text-success border border-success-subtle" };
        if (["DISBURSED", "STAGE_RELEASED", "COMPLETED"].includes(s)) return { label: s, className: "badge bg-primary-subtle text-primary border border-primary-subtle" };
        if (["RETURNED", "FIELD_RETURNED", "VERIFY_RETURNED", "ACTION_REQUIRED"].includes(s)) return { label: s, className: "badge bg-warning-subtle text-warning border border-warning-subtle" };
        if (["REJECTED", "FIELD_REJECTED", "VERIFY_REJECTED"].includes(s)) return { label: s, className: "badge bg-danger-subtle text-danger border border-danger-subtle" };
        return { label: s || "UNDER REVIEW", className: "badge bg-info-subtle text-info border border-info-subtle" };
    };

    return (
        <div className="superadmin-dashboard-page">
            <div className="container py-2">
                {error && <div className="alert alert-warning mb-3 shadow-sm">{error}</div>}

                <div className="superadmin-hero compact-hero">
                    <div className="hero-content">
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <span className="hero-tag">
                                <i className="bi bi-shield-lock-fill me-1"></i> Central Governance & Administration Portal
                            </span>
                            <span className="live-clock-badge">
                                <i className="bi bi-clock me-1"></i>
                                {currentTime.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}{" "}
                                • {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>

                        <h1>Welcome back, {user?.fullName || "Super Administrator"} 👋</h1>
                        <p className="hero-subtext">Real-time surveillance, fund disbursement oversight, department governance, and scheme analytics.</p>

                        <div className="hero-buttons mt-3">
                            <button type="button" className="hero-btn primary-btn" onClick={() => handleOpenModal("ADD_DEPARTMENT")}>
                                <i className="bi bi-building-add"></i> Add Department
                            </button>
                            <button type="button" className="hero-btn secondary-btn" onClick={() => handleOpenModal("ADD_OFFICER")}>
                                <i className="bi bi-person-plus-fill"></i> Add Officer
                            </button>
                            <button type="button" className="hero-btn secondary-btn" onClick={() => handleOpenModal("CREATE_SCHEME")}>
                                <i className="bi bi-plus-circle-fill"></i> Create Scheme
                            </button>
                            <button type="button" className="hero-btn secondary-btn" onClick={() => navigate("/superadmin/reports")}>
                                <i className="bi bi-bar-chart-line-fill"></i> Analytics & Reports
                            </button>

                            <div className="dropdown position-relative d-inline-block" ref={moreActionsRef}>
                                <button type="button" className="hero-btn secondary-btn dropdown-toggle" onClick={() => setShowMoreActions(!showMoreActions)}>
                                    <i className="bi bi-three-dots-vertical"></i> More
                                </button>
                                {showMoreActions && (
                                    <div className="superadmin-dropdown-menu shadow-lg">
                                        <button type="button" className="dropdown-item-custom" onClick={() => { setShowMoreActions(false); navigate("/superadmin/users"); }}>
                                            <i className="bi bi-people me-2 text-primary"></i> Manage Users
                                        </button>
                                        <button type="button" className="dropdown-item-custom" onClick={() => { setShowMoreActions(false); navigate("/superadmin/departments"); }}>
                                            <i className="bi bi-buildings me-2 text-primary"></i> Manage Departments
                                        </button>
                                        <button type="button" className="dropdown-item-custom" onClick={() => { setShowMoreActions(false); navigate("/admin/manage-schemes"); }}>
                                            <i className="bi bi-card-checklist me-2 text-primary"></i> Manage Schemes
                                        </button>
                                        <button type="button" className="dropdown-item-custom" onClick={() => { setShowMoreActions(false); navigate("/superadmin/audit-logs"); }}>
                                            <i className="bi bi-journal-text me-2 text-primary"></i> Audit Trail
                                        </button>
                                        <hr className="my-1 dropdown-divider" />
                                        <button type="button" className="dropdown-item-custom" onClick={() => { setShowMoreActions(false); fetchAllData(true); }} disabled={refreshing}>
                                            <i className={`bi bi-arrow-repeat me-2 text-secondary ${refreshing ? "spin-animation" : ""}`}></i>
                                            {refreshing ? "Refreshing..." : "Refresh Live Data"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="hero-side-controls">
                        <div className="notification-bell-container" ref={notifRef}>
                            <button type="button" className="notification-bell-btn" onClick={() => setShowNotifications(!showNotifications)}>
                                <i className="bi bi-bell-fill"></i>
                                {unreadNotificationCount > 0 && <span className="notification-badge-counter">{unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}</span>}
                            </button>
                            {showNotifications && (
                                <div className="notification-dropdown-panel shadow-lg">
                                    <div className="notif-panel-header">
                                        <h6>System Alerts</h6>
                                        {unreadNotificationCount > 0 && <button type="button" className="btn-mark-all" onClick={handleMarkAllNotifications}>Mark all read</button>}
                                    </div>
                                    <div className="notif-list-body">
                                        {displayedNotifications.length === 0 ? (
                                            <div className="notif-empty-state"><i className="bi bi-bell-slash"></i><p>No notifications</p></div>
                                        ) : (
                                            displayedNotifications.slice(0, 5).map((item) => (
                                                <div key={item.id || item.notificationId} className={`notif-item ${!item.isRead && !item.read ? "unread" : ""}`}>
                                                    <div className="notif-item-content">
                                                        <strong>{item.title || "Notification"}</strong>
                                                        <p>{item.message || "-"}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="admin-profile-pill">
                            <div className="profile-pill-avatar">SA</div>
                            <div className="profile-pill-info"><strong>{user?.fullName || "Super Admin"}</strong><span>Head Administrator</span></div>
                        </div>
                    </div>
                </div>

                <div className="row g-3 mt-1">
                    <div className="col-6 col-md-3">
                        <div className="super-stat-card compact-card" onClick={() => navigate("/superadmin/departments")} style={{ cursor: "pointer" }}>
                            <div className="stat-icon-wrapper dashboard-blue"><i className="bi bi-building"></i></div>
                            <div className="stat-content">
                                <span className="stat-label">Departments</span>
                                <h3>{loading ? "..." : departments.length}</h3>
                                <span className="stat-subtext text-success"><i className="bi bi-check2-circle me-1"></i> {departments.filter((d) => (d.status || "ACTIVE") === "ACTIVE").length} Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="super-stat-card compact-card" onClick={() => navigate("/superadmin/users")} style={{ cursor: "pointer" }}>
                            <div className="stat-icon-wrapper dashboard-purple"><i className="bi bi-people-fill"></i></div>
                            <div className="stat-content">
                                <span className="stat-label">Total Officers</span>
                                <h3>{loading ? "..." : officers.length}</h3>
                                <span className="stat-subtext text-muted">Across {departments.length} depts</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="super-stat-card compact-card" onClick={() => navigate("/superadmin/users")} style={{ cursor: "pointer" }}>
                            <div className="stat-icon-wrapper dashboard-green"><i className="bi bi-person-check-fill"></i></div>
                            <div className="stat-content">
                                <span className="stat-label">Beneficiaries</span>
                                <h3>{loading ? "..." : beneficiaries.length}</h3>
                                <span className="stat-subtext text-success"><i className="bi bi-shield-check me-1"></i> Citizens</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="super-stat-card compact-card" onClick={() => navigate("/admin/manage-schemes")} style={{ cursor: "pointer" }}>
                            <div className="stat-icon-wrapper dashboard-cyan"><i className="bi bi-collection-play-fill"></i></div>
                            <div className="stat-content">
                                <span className="stat-label">Active Schemes</span>
                                <h3>{loading ? "..." : activeSchemes.length}</h3>
                                <span className="stat-subtext text-muted">{schemes.length} Registered</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card shadow-sm mt-3 p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h6 className="fw-bold mb-0 text-dark"><i className="bi bi-speedometer2 text-primary me-2"></i> Application Pipeline & Fiscal Treasury</h6>
                            <small className="text-muted">Consolidated submission distribution and fiscal headroom</small>
                        </div>
                        <button type="button" className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1" onClick={() => navigate("/superadmin/reports")}>Analytics →</button>
                    </div>
                    <div className="row g-2">
                        <div className="col-6 col-md-4 col-lg-2"><div className="pipeline-stat-box blue compact-box"><span>Total</span><h2>{loading ? "..." : applicationPipeline.total}</h2></div></div>
                        <div className="col-6 col-md-4 col-lg-2"><div className="pipeline-stat-box orange compact-box"><span>Review</span><h2>{loading ? "..." : applicationPipeline.underReview}</h2></div></div>
                        <div className="col-6 col-md-4 col-lg-2"><div className="pipeline-stat-box red compact-box"><span>Action</span><h2>{loading ? "..." : applicationPipeline.actionRequired}</h2></div></div>
                        <div className="col-6 col-md-4 col-lg-2"><div className="pipeline-stat-box green compact-box"><span>Approved</span><h2>{loading ? "..." : applicationPipeline.approved}</h2></div></div>
                        <div className="col-6 col-md-4 col-lg-2"><div className="pipeline-stat-box cyan compact-box"><span>Total Budget</span><h4 className="fw-bold text-dark mt-1">{loading ? "..." : formatCurrency(financialStats.totalAllocated)}</h4></div></div>
                        <div className="col-6 col-md-4 col-lg-2"><div className="pipeline-stat-box green compact-box"><span>Used ({financialStats.utilizationPercent}%)</span><h4 className="fw-bold text-primary mt-1">{loading ? "..." : formatCurrency(financialStats.totalUsed)}</h4></div></div>
                    </div>
                </div>

                <div className="dashboard-card shadow-sm mt-3">
                    <div className="card-header-flex py-2 px-3">
                        <div><h6 className="fw-bold mb-0"><i className="bi bi-pie-chart-fill me-2 text-primary"></i> Active Welfare Schemes</h6></div>
                        <button type="button" className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1" onClick={() => navigate("/admin/manage-schemes")}>View All ({schemes.length}) →</button>
                    </div>
                    <div className="p-3 pt-2">
                        {schemes.length === 0 ? <p className="text-center text-muted py-3">No schemes registered.</p> : (
                            <div className="row g-3">
                                {schemes.slice(0, 3).map((scheme) => {
                                    const percent = Number(scheme.totalBudget) > 0 ? Math.min(100, (Number(scheme.budgetUsed) / Number(scheme.totalBudget)) * 100) : 0;
                                    return (
                                        <div key={scheme.schemeId} className="col-12 col-md-4">
                                            <div className="scheme-budget-item h-100 p-3">
                                                <strong>{scheme.schemeName}</strong>
                                                <div className="progress my-2"><div className="progress-bar" style={{ width: `${percent}%` }}></div></div>
                                                <button className="btn btn-sm btn-link p-0" onClick={() => handleOpenModal("SCHEME_DETAILS", scheme)}>Details →</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="row g-3 mt-1">
                    <div className="col-12 col-lg-6">
                        <div className="dashboard-card shadow-sm h-100">
                            <div className="card-header-flex py-2 px-3"><h6><i className="bi bi-file-earmark-text-fill me-2 text-primary"></i> Recent Applications</h6></div>
                            <div className="p-2">
                                <table className="table table-hover align-middle custom-dashboard-table mb-0">
                                    <thead><tr><th>Applicant</th><th>Scheme</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {applications.slice(0, 5).map((app) => (
                                            <tr key={app.applicationId}>
                                                <td><strong>{app.beneficiary?.fullName}</strong></td>
                                                <td>{app.scheme?.schemeName}</td>
                                                <td><span className={getStatusBadge(app.status).className}>{getStatusBadge(app.status).label}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="dashboard-card shadow-sm h-100">
                            <div className="card-header-flex py-2 px-3"><h6><i className="bi bi-clock-history me-2 text-primary"></i> Recent Audit Activity</h6></div>
                            <div className="p-3">
                                {auditLogs.slice(0, 5).map((log) => (
                                    <div key={log.auditId} className="audit-item compact-audit">
                                        <div className="audit-details">
                                            <strong>{log.performedBy}</strong><p className="mb-0">{log.action}: {log.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {activeModal === "ADD_DEPARTMENT" && (
                <div className="super-modal-backdrop" onClick={handleCloseModal}>
                    <div className="super-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="super-modal-header">
                            <h5 className="mb-0 fw-bold">Add New Department</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <form onSubmit={handleSubmitDepartment} className="p-3">
                            {modalError && <div className="alert alert-danger py-2 small">{modalError}</div>}
                            {modalSuccess && <div className="alert alert-success py-2 small">{modalSuccess}</div>}
                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Department Name *</label>
                                <input
                                    className="form-control form-control-sm"
                                    placeholder="e.g. Department of Agriculture"
                                    value={deptForm.departmentName}
                                    onChange={(e) => setDeptForm({ ...deptForm, departmentName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Description</label>
                                <textarea
                                    className="form-control form-control-sm"
                                    rows="2"
                                    placeholder="Department operational scope and welfare objectives"
                                    value={deptForm.description}
                                    onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-sm w-100 rounded-pill" disabled={modalSubmitting}>
                                {modalSubmitting ? "Creating Department..." : "Create Department"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeModal === "ADD_OFFICER" && (
                <div className="super-modal-backdrop" onClick={handleCloseModal}>
                    <div className="super-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="super-modal-header">
                            <h5 className="mb-0 fw-bold">Assign Administrative Officer</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <form onSubmit={handleSubmitOfficer} className="p-3">
                            {modalError && <div className="alert alert-danger py-2 small">{modalError}</div>}
                            {modalSuccess && <div className="alert alert-success py-2 small">{modalSuccess}</div>}
                            <div className="mb-2">
                                <label className="form-label small fw-semibold">Employee Code</label>
                                <input
                                    className="form-control form-control-sm"
                                    placeholder="e.g. EMP-1049"
                                    value={officerForm.employeeCode}
                                    onChange={(e) => setOfficerForm({ ...officerForm, employeeCode: e.target.value })}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold">Designation *</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={officerForm.designation}
                                    onChange={(e) => setOfficerForm({ ...officerForm, designation: e.target.value })}
                                >
                                    <option value="FRONT_DESK_OFFICER">Front Desk Officer</option>
                                    <option value="VERIFICATION_OFFICER">Verification Officer</option>
                                    <option value="FINANCE_OFFICER">Finance Officer</option>
                                    <option value="DEPT_ADMIN">Department Admin</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold">Host Department *</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={officerForm.departmentId}
                                    onChange={(e) => setOfficerForm({ ...officerForm, departmentId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((d) => (
                                        <option key={d.departmentId} value={d.departmentId}>
                                            {d.departmentName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Assigned User Account *</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={officerForm.userId}
                                    onChange={(e) => setOfficerForm({ ...officerForm, userId: e.target.value })}
                                    required
                                >
                                    <option value="">Select User Profile</option>
                                    {users.map((u) => (
                                        <option key={u.userId} value={u.userId}>
                                            {u.fullName} ({u.mobileNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary btn-sm w-100 rounded-pill" disabled={modalSubmitting}>
                                {modalSubmitting ? "Assigning Officer..." : "Assign Officer"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeModal === "CREATE_SCHEME" && (
                <div className="super-modal-backdrop" onClick={handleCloseModal}>
                    <div className="super-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="super-modal-header">
                            <h5 className="mb-0 fw-bold">Launch Welfare Scheme</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <form onSubmit={handleSubmitScheme} className="p-3">
                            {modalError && <div className="alert alert-danger py-2 small">{modalError}</div>}
                            {modalSuccess && <div className="alert alert-success py-2 small">{modalSuccess}</div>}
                            <div className="mb-2">
                                <label className="form-label small fw-semibold">Scheme Title *</label>
                                <input
                                    className="form-control form-control-sm"
                                    placeholder="e.g. Pradhan Mantri Kisan Assistance"
                                    value={schemeForm.schemeName}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, schemeName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold">Department *</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={schemeForm.departmentId}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, departmentId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((d) => (
                                        <option key={d.departmentId} value={d.departmentId}>
                                            {d.departmentName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="row g-2 mb-2">
                                <div className="col-6">
                                    <label className="form-label small fw-semibold">Total Budget (₹) *</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="5000000"
                                        value={schemeForm.totalBudget}
                                        onChange={(e) => setSchemeForm({ ...schemeForm, totalBudget: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-semibold">Max Grant (₹) *</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="50000"
                                        value={schemeForm.maxGrant}
                                        onChange={(e) => setSchemeForm({ ...schemeForm, maxGrant: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Description</label>
                                <textarea
                                    className="form-control form-control-sm"
                                    rows="2"
                                    placeholder="Scheme eligibility requirements and guidelines"
                                    value={schemeForm.description}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-sm w-100 rounded-pill" disabled={modalSubmitting}>
                                {modalSubmitting ? "Launching Scheme..." : "Launch Scheme"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeModal === "SCHEME_DETAILS" && selectedSchemeForModal && (
                <div className="super-modal-backdrop" onClick={handleCloseModal}>
                    <div className="super-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="super-modal-header">
                            <div>
                                <h5 className="mb-0 fw-bold">{selectedSchemeForModal.schemeName}</h5>
                                <small className="text-muted">ID: #{selectedSchemeForModal.schemeId} • {selectedSchemeForModal.department?.departmentName || "General Welfare"}</small>
                            </div>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="p-3">
                            <div className="row g-2 mb-3">
                                <div className="col-6">
                                    <small className="text-muted d-block">Total Budget</small>
                                    <strong className="text-dark">{formatCurrency(selectedSchemeForModal.totalBudget)}</strong>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Maximum Grant</small>
                                    <strong className="text-primary">{formatCurrency(selectedSchemeForModal.maxGrant)}</strong>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Application Window</small>
                                    <span className="small text-dark">{formatTimestamp(selectedSchemeForModal.applicationStartDate)} - {formatTimestamp(selectedSchemeForModal.applicationEndDate)}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Status</small>
                                    <span className="badge bg-success-subtle text-success border border-success-subtle">{selectedSchemeForModal.status || "ACTIVE"}</span>
                                </div>
                            </div>
                            <div className="mb-3">
                                <small className="text-muted d-block mb-1">Description & Purpose</small>
                                <div className="p-2 bg-light rounded text-dark small">
                                    {selectedSchemeForModal.description || "No description provided."}
                                </div>
                            </div>
                            <div className="d-flex justify-content-end pt-2 border-top">
                                <button type="button" className="btn btn-secondary btn-sm rounded-pill px-3" onClick={handleCloseModal}>
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

export default SuperAdminDashboard;