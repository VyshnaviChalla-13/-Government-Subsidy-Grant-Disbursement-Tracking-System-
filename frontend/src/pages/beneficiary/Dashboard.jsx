import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications, getAllApplications } from "../../api/applicationApi";
import { getUserById } from "../../api/userApi";
import { getUserNotifications } from "../../api/notificationApi";

function formatDate(date) {
    if (!date) return "-";
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
        ? date
        : parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
}

function getStageDetails(status, remarks) {
    const s = String(status || "").toUpperCase();

    if (s === "DISBURSED") {
        return {
            stageName: "Grant Disbursed",
            stepIndex: 5,
            badgeClass: "bg-success text-white",
            boxClass: "disbursed",
            icon: "bi-check-circle-fill",
            desc: "Grant funds have been successfully verified, sanctioned, and disbursed directly to your bank account via Direct Benefit Transfer (DBT).",
            progressPercent: "100%",
        };
    }

    if (s === "STAGE_RELEASED") {
        return {
            stageName: "Partially Disbursed",
            stepIndex: 5,
            badgeClass: "bg-info text-white",
            boxClass: "disbursed",
            icon: "bi-cash-stack",
            desc: "Some milestone instalments have been released. Remaining milestone payments are being processed by the Finance Officer.",
            progressPercent: "90%",
            isPartialDisbursement: true,
        };
    }

    if (s === "APPROVED" || s === "PENDING_FINANCE") {
        return {
            stageName: "Finance Sanctioned",
            stepIndex: 5,
            badgeClass: "bg-success",
            boxClass: "finance",
            icon: "bi-wallet2",
            desc: "Application verified & sanctioned. Finance Officer is processing DBT fund release.",
            progressPercent: "85%",
            isFinanceSanctioned: true,
        };
    }

    if (s === "VERIFICATION_APPROVED") {
        return {
            stageName: "Verification Approved",
            stepIndex: 4,
            badgeClass: "bg-primary",
            boxClass: "finance",
            icon: "bi-check2-all",
            desc: "Eligibility verified by officer. Forwarded to Finance for fund allocation.",
            progressPercent: "70%",
        };
    }

    if (s === "RETURNED" || s === "FIELD_RETURNED" || s === "VERIFY_RETURNED") {
        return {
            stageName: "Returned for Correction",
            stepIndex: 2,
            badgeClass: "bg-danger",
            boxClass: "returned",
            icon: "bi-exclamation-triangle-fill",
            isReturned: true,
            desc: remarks ? `Action Required: "${remarks}"` : "Officer returned application for correction of documents or details.",
            progressPercent: "40%",
        };
    }

    if (s === "REJECTED" || s === "FIELD_REJECTED" || s === "VERIFY_REJECTED") {
        return {
            stageName: "Application Rejected",
            stepIndex: 1,
            badgeClass: "bg-dark",
            boxClass: "rejected",
            icon: "bi-x-circle-fill",
            desc: remarks ? `Remarks: "${remarks}"` : "Application did not meet scheme eligibility requirements.",
            progressPercent: "10%",
        };
    }

    if (s === "FIELD_APPROVED" || s === "PENDING_VERIFICATION" || s === "UNDER_VERIFICATION") {
        return {
            stageName: "Under Verification",
            stepIndex: 3,
            badgeClass: "bg-warning text-dark",
            boxClass: "verification",
            icon: "bi-search",
            desc: "Front desk approved. Verification Officer is assessing documents and eligibility.",
            progressPercent: "50%",
        };
    }

    // Default: SUBMITTED or PENDING_FRONT_DESK
    return {
        stageName: "At Front Desk",
        stepIndex: 2,
        badgeClass: "bg-primary",
        boxClass: "frontdesk",
        icon: "bi-building",
        desc: "Application submitted successfully. Front Desk Officer is performing initial review.",
        progressPercent: "25%",
    };
}

const WORKFLOW_STEPS = [
    { label: "Submitted", sub: "Portal Entry" },
    { label: "Front Desk", sub: "Initial Review" },
    { label: "Verification", sub: "Field & Docs" },
    { label: "Finance", sub: "Sanction" },
    { label: "Disbursed", sub: "Grant Release" },
];

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("ALL"); // ALL, IN_REVIEW, RETURNED, DISBURSED
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBeneficiaryPortal() {
            try {
                setLoading(true);
                setError("");
                const storedUser = JSON.parse(localStorage.getItem("user") || "null");
                const userId = storedUser?.userId ?? storedUser?.id;

                if (!userId) {
                    throw new Error("Unable to identify session. Please sign in.");
                }

                // 1. Fetch User Profile
                try {
                    const profileData = await getUserById(userId);
                    setUser(profileData || storedUser);
                } catch {
                    setUser(storedUser);
                }

                // 2. Fetch Beneficiary Applications
                let myApps = [];
                try {
                    myApps = await getMyApplications();
                } catch {
                    // Fallback to filtering all applications
                    const allApps = await getAllApplications();
                    myApps = allApps.filter(
                        (a) =>
                            a.beneficiary?.userId === userId ||
                            a.beneficiary?.mobileNumber === storedUser?.mobileNumber
                    );
                }

                setApplications(Array.isArray(myApps) ? myApps : []);

                // 3. Fetch Notifications
                try {
                    const notifs = await getUserNotifications(userId);
                    setNotifications(Array.isArray(notifs) ? notifs.slice(0, 4) : []);
                } catch {
                    setNotifications([]);
                }
            } catch (err) {
                setError(err.message || "Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        }

        loadBeneficiaryPortal();
    }, []);

    // Summary statistics
    const stats = {
        total: applications.length,
        inReview: applications.filter((a) =>
            ["SUBMITTED", "PENDING_FRONT_DESK", "FIELD_APPROVED", "PENDING_VERIFICATION", "UNDER_VERIFICATION"].includes(
                String(a.status).toUpperCase()
            )
        ).length,
        returned: applications.filter((a) =>
            ["RETURNED", "FIELD_RETURNED", "VERIFY_RETURNED"].includes(String(a.status).toUpperCase())
        ).length,
        approvedOrDisbursed: applications.filter((a) =>
            ["APPROVED", "STAGE_RELEASED", "DISBURSED", "VERIFICATION_APPROVED", "PENDING_FINANCE"].includes(
                String(a.status).toUpperCase()
            )
        ).length,
    };

    // Filter applications
    const filteredApps = applications.filter((app) => {
        const s = String(app.status || "").toUpperCase();
        if (filter === "IN_REVIEW") {
            return ["SUBMITTED", "PENDING_FRONT_DESK", "FIELD_APPROVED", "PENDING_VERIFICATION", "UNDER_VERIFICATION"].includes(s);
        }
        if (filter === "RETURNED") {
            return ["RETURNED", "FIELD_RETURNED", "VERIFY_RETURNED"].includes(s);
        }
        if (filter === "DISBURSED") {
            return ["APPROVED", "STAGE_RELEASED", "DISBURSED", "VERIFICATION_APPROVED", "PENDING_FINANCE"].includes(s);
        }
        return true;
    });

    return (
        <div className="dashboard-page">
            <div className="container py-3">
                {error && <div className="alert alert-danger mb-4">{error}</div>}

                {/* ================= 1. HERO BANNER ================= */}
                <div className="dashboard-hero">
                    <div className="hero-content">
                        <span className="hero-tag">
                            <i className="bi bi-shield-check me-1"></i> Beneficiary Citizen Portal
                        </span>
                        <h1>Welcome, {user?.fullName || "Citizen"}</h1>
                        <p>
                            Track all your applied government schemes in real-time — from Front Desk triage and Officer Verification to Finance sanction and Milestone Grant disbursements.
                        </p>
                        <div className="hero-buttons">
                            <button
                                className="hero-btn primary-btn"
                                onClick={() => navigate("/beneficiary/schemes")}
                            >
                                <i className="bi bi-grid-fill"></i> Browse All Schemes
                            </button>
                            <button
                                className="hero-btn secondary-btn"
                                onClick={() => navigate("/beneficiary/apply")}
                            >
                                <i className="bi bi-plus-circle-fill"></i> Apply for New Scheme
                            </button>
                        </div>
                    </div>

                    <div className="hero-icon d-none d-md-flex">
                        <div className="hero-circle">
                            <i className="bi bi-bank2"></i>
                        </div>
                    </div>
                </div>

                {/* ================= 2. METRICS COUNTERS ================= */}
                <div className="row g-3 mt-3">
                    <div className="col-6 col-lg-3">
                        <div className="stat-card" onClick={() => setFilter("ALL")} style={{ cursor: "pointer" }}>
                            <div className="stat-icon dashboard-blue">
                                <i className="bi bi-folder-fill"></i>
                            </div>
                            <div>
                                <h3>{loading ? "..." : String(stats.total).padStart(2, "0")}</h3>
                                <p>Total Applied Schemes</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-lg-3">
                        <div className="stat-card" onClick={() => setFilter("IN_REVIEW")} style={{ cursor: "pointer" }}>
                            <div className="stat-icon dashboard-orange">
                                <i className="bi bi-hourglass-split"></i>
                            </div>
                            <div>
                                <h3>{loading ? "..." : String(stats.inReview).padStart(2, "0")}</h3>
                                <p>Under Review</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-lg-3">
                        <div className="stat-card" onClick={() => setFilter("RETURNED")} style={{ cursor: "pointer" }}>
                            <div className="stat-icon dashboard-red">
                                <i className="bi bi-arrow-return-left"></i>
                            </div>
                            <div>
                                <h3>{loading ? "..." : String(stats.returned).padStart(2, "0")}</h3>
                                <p>Action Required</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-lg-3">
                        <div className="stat-card" onClick={() => setFilter("DISBURSED")} style={{ cursor: "pointer" }}>
                            <div className="stat-icon dashboard-green">
                                <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <div>
                                <h3>{loading ? "..." : String(stats.approvedOrDisbursed).padStart(2, "0")}</h3>
                                <p>Approved & Disbursed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= 3. QUICK SERVICES ROW ================= */}
                <div className="section-header">
                    <div>
                        <h3>Quick Services</h3>
                        <p>Instant shortcuts for scheme discovery and profile management</p>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-md-3 col-6">
                        <div className="service-card" onClick={() => navigate("/beneficiary/schemes")}>
                            <div className="service-icon">
                                <i className="bi bi-search"></i>
                            </div>
                            <h5>Explore Schemes</h5>
                            <p>Discover state & central subsidy programs</p>
                        </div>
                    </div>

                    <div className="col-md-3 col-6">
                        <div className="service-card" onClick={() => navigate("/beneficiary/apply")}>
                            <div className="service-icon">
                                <i className="bi bi-pencil-square"></i>
                            </div>
                            <h5>Submit Application</h5>
                            <p>Upload documents & apply directly</p>
                        </div>
                    </div>

                    <div className="col-md-3 col-6">
                        <div className="service-card" onClick={() => navigate("/beneficiary/profile")}>
                            <div className="service-icon">
                                <i className="bi bi-person-badge-fill"></i>
                            </div>
                            <h5>My Profile</h5>
                            <p>Check bank details & Aadhaar link</p>
                        </div>
                    </div>

                    <div className="col-md-3 col-6">
                        <div className="service-card" onClick={() => navigate("/beneficiary/notifications")}>
                            <div className="service-icon">
                                <i className="bi bi-bell-fill"></i>
                            </div>
                            <h5>Alerts & Updates</h5>
                            <p>View payment and timeline notices</p>
                        </div>
                    </div>
                </div>

                {/* ================= 4. APPLIED SCHEMES STATUS & STEPPER ================= */}
                <div className="row mt-4">
                    <div className="col-lg-8">
                        <div className="section-header mt-0">
                            <div>
                                <h3>Applied Schemes & Live Workflow Tracker</h3>
                                <p>Monitor stage-by-stage progression for each grant</p>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="status-filters-bar">
                            <button
                                className={`filter-pill ${filter === "ALL" ? "active" : ""}`}
                                onClick={() => setFilter("ALL")}
                            >
                                All Schemes ({applications.length})
                            </button>
                            <button
                                className={`filter-pill ${filter === "IN_REVIEW" ? "active" : ""}`}
                                onClick={() => setFilter("IN_REVIEW")}
                            >
                                Under Review ({stats.inReview})
                            </button>
                            <button
                                className={`filter-pill ${filter === "RETURNED" ? "active" : ""}`}
                                onClick={() => setFilter("RETURNED")}
                            >
                                Action Required ({stats.returned})
                            </button>
                            <button
                                className={`filter-pill ${filter === "DISBURSED" ? "active" : ""}`}
                                onClick={() => setFilter("DISBURSED")}
                            >
                                Disbursed & Approved ({stats.approvedOrDisbursed})
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="card p-5 text-center shadow-sm">
                                <div className="spinner-border text-primary mx-auto mb-3" role="status"></div>
                                <p className="text-muted mb-0">Loading your applied schemes...</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && filteredApps.length === 0 && (
                            <div className="card p-5 text-center shadow-sm border-0">
                                <i className="bi bi-folder2-open display-4 text-muted mb-3"></i>
                                <h5>No applied schemes found in this filter.</h5>
                                <p className="text-muted">
                                    Explore available government subsidies and apply today!
                                </p>
                                <button
                                    className="btn btn-primary mx-auto px-4"
                                    onClick={() => navigate("/beneficiary/schemes")}
                                >
                                    Browse Available Schemes
                                </button>
                            </div>
                        )}

                        {/* Application Tracking Cards */}
                        {!loading &&
                            filteredApps.map((app) => {
                                const stage = getStageDetails(app.status, app.remarks);
                                const schemeName = app.scheme?.schemeName || "Government Scheme";
                                const deptName = app.scheme?.department?.departmentName || "General Welfare";
                                const actualGrant = app.scheme?.maxGrant || app.scheme?.maxSubsidyAmount || app.scheme?.totalBudget || 25000;
                                const maxAmount = `₹${Number(actualGrant).toLocaleString("en-IN")}`;
                                const isDisbursed = ["DISBURSED", "STAGE_RELEASED"].includes(String(app.status || "").toUpperCase());
                                const appliedDate = formatDate(app.submittedAt);
                                const appId = app.applicationId;

                                return (
                                    <div className="scheme-tracking-card" key={appId}>
                                        {/* Card Header */}
                                        <div className="scheme-card-header">
                                            <div className="scheme-title-group">
                                                <h4>{schemeName}</h4>
                                                <div className="scheme-meta">
                                                    <span>
                                                        <i className="bi bi-building"></i> {deptName}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        <i className="bi bi-hash"></i> APP-{appId}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        <i className="bi bi-calendar3"></i> Applied: {appliedDate}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                <span className={`scheme-grant-badge ${isDisbursed ? "bg-success text-white border-0" : ""}`}>
                                                    {isDisbursed ? `Disbursed: ${maxAmount}` : `Sanctioned Grant: ${maxAmount}`}
                                                </span>
                                                <span className={`badge ${stage.badgeClass} px-3 py-2`} style={{ borderRadius: "20px" }}>
                                                    {stage.stageName}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stage Description Alert Box */}
                                        <div className={`stage-status-box ${stage.boxClass}`}>
                                            <i className={`bi ${stage.icon} stage-status-icon`}></i>
                                            <div className="stage-status-text">
                                                <h6>Current Status: {stage.stageName}</h6>
                                                <p>{stage.desc}</p>
                                            </div>
                                        </div>

                                        {/* 5-Step Visual Stepper */}
                                        <div className="stepper-container">
                                            <div className="stepper-progress-bar">
                                                <div
                                                    className="stepper-progress-fill"
                                                    style={{ width: stage.progressPercent }}
                                                ></div>
                                                {WORKFLOW_STEPS.map((step, idx) => {
                                                    const stepNum = idx + 1;
                                                    // Only mark all done when fully DISBURSED — not for APPROVED/STAGE_RELEASED
                                                    const isAllDone = stage.stepIndex === 5 && !stage.isFinanceSanctioned && !stage.isPartialDisbursement;
                                                    const isCompleted = isAllDone || stepNum < stage.stepIndex;
                                                    const isActive = !isAllDone && stepNum === stage.stepIndex;
                                                    const isReturnedNode = stage.isReturned && isActive;

                                                    let nodeClass = "";
                                                    if (isReturnedNode) nodeClass = "returned-active";
                                                    else if (isCompleted) nodeClass = "completed";
                                                    else if (isActive) nodeClass = "active";

                                                    return (
                                                        <div className={`step-node ${nodeClass}`} key={step.label}>
                                                            <div className="step-circle">
                                                                {isCompleted ? (
                                                                    <i className="bi bi-check-lg"></i>
                                                                ) : isReturnedNode ? (
                                                                    <i className="bi bi-arrow-return-left"></i>
                                                                ) : (
                                                                    stepNum
                                                                )}
                                                            </div>
                                                            <span className="step-label">{step.label}</span>
                                                            <small className="text-muted d-none d-sm-block" style={{ fontSize: "10px" }}>
                                                                {step.sub}
                                                            </small>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Action Buttons Footer */}
                                        <div className="scheme-card-footer">
                                            <div className="text-muted small">
                                                {app.eligibilityScore != null && (
                                                    <span>
                                                        Eligibility Score: <strong>{app.eligibilityScore}/100</strong>
                                                    </span>
                                                )}
                                            </div>

                                            <div className="tracking-actions">
                                                {stage.isReturned && (
                                                    <button
                                                        className="btn btn-danger btn-sm action-pill-btn"
                                                        onClick={() => navigate(`/beneficiary/apply`, { state: { schemeId: app.scheme?.schemeId, resubmitAppId: appId } })}
                                                    >
                                                        <i className="bi bi-arrow-repeat"></i> Correct & Resubmit
                                                    </button>
                                                )}

                                                <button
                                                    className="btn btn-outline-primary btn-sm action-pill-btn"
                                                    onClick={() => navigate(`/beneficiary/timeline/${appId}`)}
                                                >
                                                    <i className="bi bi-clock-history"></i> View Full Timeline
                                                </button>

                                                <button
                                                    className="btn btn-primary btn-sm action-pill-btn"
                                                    onClick={() => navigate(`/beneficiary/disbursement?applicationId=${appId}`)}
                                                >
                                                    <i className="bi bi-cash-stack"></i> Disbursement Tracker
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {/* ================= 5. SIDEBAR NOTIFICATIONS & PROFILE ================= */}
                    <div className="col-lg-4">
                        {/* Profile Summary Card */}
                        <div className="content-card mb-4">
                            <h4>Applicant Profile</h4>
                            <div className="d-flex align-items-center gap-3 mt-3 pb-3 border-bottom">
                                <div
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        background: "#e0f2fe",
                                        color: "#0369a1",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "22px",
                                        fontWeight: "700",
                                    }}
                                >
                                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">{user?.fullName || "Registered Citizen"}</h6>
                                    <small className="text-muted">+91 {user?.mobileNumber || "Mobile Registered"}</small>
                                </div>
                            </div>

                            <div className="mt-3 small">
                                <p className="mb-1 text-muted">
                                    <strong>Category:</strong> {user?.category || "General"}
                                </p>
                                <p className="mb-1 text-muted">
                                    <strong>Occupation:</strong> {user?.occupation || "Self-Employed / Farming"}
                                </p>
                                <p className="mb-2 text-muted">
                                    <strong>Bank Account:</strong> {user?.bankName ? `${user.bankName} (Linked)` : "Linked"}
                                </p>
                            </div>

                            <button
                                className="btn btn-outline-secondary btn-sm w-100 mt-2"
                                onClick={() => navigate("/beneficiary/profile")}
                            >
                                <i className="bi bi-gear-fill me-1"></i> Update Profile Details
                            </button>
                        </div>

                        {/* Recent Alerts Card */}
                        <div className="content-card">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h4 className="mb-0">Recent Alerts</h4>
                                <button
                                    className="btn btn-link p-0 text-decoration-none small"
                                    onClick={() => navigate("/beneficiary/notifications")}
                                >
                                    View All
                                </button>
                            </div>

                            <div className="notification-wrapper">
                                {notifications.length > 0 ? (
                                    notifications.map((note) => (
                                        <div className="notification-card" key={note.id}>
                                            <div className="notify-icon">
                                                <i className="bi bi-bell-fill"></i>
                                            </div>
                                            <div>
                                                <p className="fw-semibold mb-0">{note.title || "Portal Notice"}</p>
                                                <p className="text-muted small mb-1">{note.message}</p>
                                                <span>{formatDate(note.createdAt)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted">
                                        <i className="bi bi-bell-slash fs-3 d-block mb-1"></i>
                                        <small>No unread notifications</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
