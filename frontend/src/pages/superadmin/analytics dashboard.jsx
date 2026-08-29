import "./AnalyticsDashboard.css";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    getSystemOverview,
    getSchemeSummary,
    getRegionSummary,
    getApprovalPerformance,
} from "../../api/dashboardApi";
import { getAllApplications } from "../../api/applicationApi";
import { getAllDepartments } from "../../api/departmentApi";
import { getAllOfficers } from "../../api/officerApi";
import { getAllUsers } from "../../api/userApi";
import {
    downloadSchemeSummaryPdf,
    downloadSchemeSummaryExcel,
} from "../../api/reportApi";

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

function AnalyticsDashboard() {
    const navigate = useNavigate();

    // Data States
    const [systemOverview, setSystemOverview] = useState(null);
    const [schemeSummaries, setSchemeSummaries] = useState([]);
    const [regionSummaries, setRegionSummaries] = useState([]);
    const [approvalPerformance, setApprovalPerformance] = useState([]);
    const [applications, setApplications] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [users, setUsers] = useState([]);

    // UI States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [downloadingExcel, setDownloadingExcel] = useState(false);
    const [schemeSearch, setSchemeSearch] = useState("");

    const fetchAnalyticsData = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const [
                overviewRes,
                schemesRes,
                regionsRes,
                perfRes,
                appsRes,
                deptsRes,
                officersRes,
                usersRes,
            ] = await Promise.allSettled([
                getSystemOverview(),
                getSchemeSummary(),
                getRegionSummary(),
                getApprovalPerformance(),
                getAllApplications(),
                getAllDepartments(),
                getAllOfficers(),
                getAllUsers(),
            ]);

            if (overviewRes.status === "fulfilled") setSystemOverview(overviewRes.value);
            if (schemesRes.status === "fulfilled" && Array.isArray(schemesRes.value)) setSchemeSummaries(schemesRes.value);
            if (regionsRes.status === "fulfilled" && Array.isArray(regionsRes.value)) setRegionSummaries(regionsRes.value);
            if (perfRes.status === "fulfilled" && Array.isArray(perfRes.value)) setApprovalPerformance(perfRes.value);
            if (appsRes.status === "fulfilled" && Array.isArray(appsRes.value)) setApplications(appsRes.value);
            if (deptsRes.status === "fulfilled" && Array.isArray(deptsRes.value)) setDepartments(deptsRes.value);
            if (officersRes.status === "fulfilled" && Array.isArray(officersRes.value)) setOfficers(officersRes.value);
            if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value)) setUsers(usersRes.value);
        } catch (err) {
            console.error("Analytics fetch error:", err);
            setError("Failed to load real-time analytics from database.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    // Beneficiaries count
    const beneficiariesCount = useMemo(() => {
        return users.filter((u) => {
            const r = String(u.role || "").toUpperCase();
            return (
                r === "ROLE_BENEFICIARY" ||
                r === "ROLE_USER" ||
                r === "BENEFICIARY" ||
                !u.role
            );
        }).length;
    }, [users]);

    // Financial Analytics Summary
    const financialStats = useMemo(() => {
        let totalAllocated = 0;
        let totalUsed = 0;

        schemeSummaries.forEach((s) => {
            totalAllocated += Number(s.totalBudget) || 0;
            totalUsed += Number(s.budgetUsed) || 0;
        });

        const remaining = Math.max(0, totalAllocated - totalUsed);
        const utilizationPercent =
            totalAllocated > 0 ? ((totalUsed / totalAllocated) * 100).toFixed(1) : "0.0";

        return {
            totalAllocated,
            totalUsed,
            remaining,
            utilizationPercent,
        };
    }, [schemeSummaries]);

    // Application Status Pipeline Breakdown
    const applicationPipeline = useMemo(() => {
        let submitted = 0;
        let underReview = 0;
        let actionRequired = 0;
        let approved = 0;
        let disbursed = 0;
        let rejected = 0;

        applications.forEach((app) => {
            const status = (app.status || "SUBMITTED").toUpperCase();
            if (["SUBMITTED", "PENDING_FRONT_DESK", "RESUBMITTED"].includes(status)) {
                submitted++;
            } else if (
                ["PENDING_VERIFICATION", "UNDER_VERIFICATION", "FIELD_APPROVED"].includes(status)
            ) {
                underReview++;
            } else if (
                ["RETURNED", "FIELD_RETURNED", "VERIFY_RETURNED", "ACTION_REQUIRED"].includes(status)
            ) {
                actionRequired++;
            } else if (
                ["VERIFICATION_APPROVED", "APPROVED", "PENDING_FINANCE", "SANCTIONED"].includes(status)
            ) {
                approved++;
            } else if (["DISBURSED", "STAGE_RELEASED", "COMPLETED"].includes(status)) {
                disbursed++;
            } else if (["REJECTED", "FIELD_REJECTED", "VERIFY_REJECTED"].includes(status)) {
                rejected++;
            } else {
                underReview++;
            }
        });

        const total = applications.length;
        const approvalRate =
            approved + rejected > 0
                ? (((approved + disbursed) / (approved + disbursed + rejected)) * 100).toFixed(1)
                : total > 0
                    ? (((approved + disbursed) / total) * 100).toFixed(1)
                    : "0.0";

        return {
            total,
            submitted,
            underReview,
            actionRequired,
            approved,
            disbursed,
            rejected,
            approvalRate,
        };
    }, [applications]);

    // Filtered Schemes
    const filteredSchemes = useMemo(() => {
        if (!schemeSearch.trim()) return schemeSummaries;
        const q = schemeSearch.toLowerCase();
        return schemeSummaries.filter(
            (s) =>
                s.schemeName?.toLowerCase().includes(q) ||
                s.departmentName?.toLowerCase().includes(q)
        );
    }, [schemeSummaries, schemeSearch]);

    // Download PDF Handler
    const handleDownloadPdf = async () => {
        try {
            setDownloadingPdf(true);
            const data = await downloadSchemeSummaryPdf();
            const blob = new Blob([data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "scheme-summary-report.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download PDF report:", err);
            alert("Could not download PDF report at this time.");
        } finally {
            setDownloadingPdf(false);
        }
    };

    // Download Excel Handler
    const handleDownloadExcel = async () => {
        try {
            setDownloadingExcel(true);
            const data = await downloadSchemeSummaryExcel();
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "scheme-summary-report.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download Excel report:", err);
            alert("Could not download Excel report at this time.");
        } finally {
            setDownloadingExcel(false);
        }
    };

    return (
        <div className="analytics-page-wrapper">
            <div className="container py-3">
                {/* Header Banner */}
                <div className="analytics-header-banner shadow-sm">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-light rounded-pill px-3"
                                    onClick={() => navigate("/superadmin/dashboard")}
                                >
                                    <i className="bi bi-arrow-left me-1"></i> Super Admin Dashboard
                                </button>
                                <span className="analytics-live-tag">
                                    <i className="bi bi-broadcast me-1"></i> Live Database Analytics
                                </span>
                            </div>
                            <h1 className="analytics-header-title">Executive Analytics & Reports</h1>
                            <p className="analytics-header-desc">
                                Real-time dynamic intelligence, fund disbursement telemetry, and application status metrics.
                            </p>
                        </div>

                        {/* Export & Refresh Actions */}
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                className="btn btn-light btn-sm rounded-pill px-3 shadow-sm"
                                onClick={handleDownloadPdf}
                                disabled={downloadingPdf}
                            >
                                <i className="bi bi-file-earmark-pdf-fill text-danger me-1"></i>
                                {downloadingPdf ? "Generating PDF..." : "Export PDF"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-light btn-sm rounded-pill px-3 shadow-sm"
                                onClick={handleDownloadExcel}
                                disabled={downloadingExcel}
                            >
                                <i className="bi bi-file-earmark-spreadsheet-fill text-success me-1"></i>
                                {downloadingExcel ? "Generating Excel..." : "Export Excel"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-light btn-sm rounded-pill px-3"
                                onClick={() => fetchAnalyticsData(true)}
                                disabled={refreshing}
                            >
                                <i className={`bi bi-arrow-repeat me-1 ${refreshing ? "spin-animation" : ""}`}></i>
                                {refreshing ? "Refreshing..." : "Refresh"}
                            </button>
                        </div>
                    </div>
                </div>

                {error && <div className="alert alert-warning my-3">{error}</div>}

                {/* ================= 1. SYSTEM & FINANCIAL SUMMARY KPIS ================= */}
                <div className="row g-3 mt-1">
                    {/* Total Departments */}
                    <div className="col-6 col-md-3">
                        <div className="analytics-kpi-card">
                            <div className="kpi-icon-box blue">
                                <i className="bi bi-building"></i>
                            </div>
                            <div>
                                <span className="kpi-label">Departments</span>
                                <h3>{loading ? "..." : departments.length}</h3>
                                <small className="text-muted">Registered entities</small>
                            </div>
                        </div>
                    </div>

                    {/* Total Officers */}
                    <div className="col-6 col-md-3">
                        <div className="analytics-kpi-card">
                            <div className="kpi-icon-box purple">
                                <i className="bi bi-person-badge"></i>
                            </div>
                            <div>
                                <span className="kpi-label">Active Officers</span>
                                <h3>{loading ? "..." : officers.length}</h3>
                                <small className="text-muted">Field & District staff</small>
                            </div>
                        </div>
                    </div>

                    {/* Total Citizens / Beneficiaries */}
                    <div className="col-6 col-md-3">
                        <div className="analytics-kpi-card">
                            <div className="kpi-icon-box green">
                                <i className="bi bi-people-fill"></i>
                            </div>
                            <div>
                                <span className="kpi-label">Beneficiaries</span>
                                <h3>{loading ? "..." : beneficiariesCount}</h3>
                                <small className="text-muted">Registered citizens</small>
                            </div>
                        </div>
                    </div>

                    {/* Total Submissions */}
                    <div className="col-6 col-md-3">
                        <div className="analytics-kpi-card">
                            <div className="kpi-icon-box orange">
                                <i className="bi bi-folder-fill"></i>
                            </div>
                            <div>
                                <span className="kpi-label">Total Applications</span>
                                <h3>{loading ? "..." : applicationPipeline.total}</h3>
                                <small className="text-muted">{applicationPipeline.approvalRate}% Approval Rate</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= 2. FINANCIAL DISBURSEMENT & TREASURY INTELLIGENCE ================= */}
                <div className="row g-3 mt-1">
                    {/* Budget Allocated */}
                    <div className="col-12 col-md-4">
                        <div className="analytics-fin-card allocated">
                            <div className="fin-icon"><i className="bi bi-bank"></i></div>
                            <div>
                                <span className="fin-label">Total Program Budget</span>
                                <h3>{loading ? "..." : formatCurrency(financialStats.totalAllocated)}</h3>
                                <p className="mb-0 text-muted small">Allocated across {schemeSummaries.length} schemes</p>
                            </div>
                        </div>
                    </div>

                    {/* Funds Disbursed / Used */}
                    <div className="col-12 col-md-4">
                        <div className="analytics-fin-card used">
                            <div className="fin-icon"><i className="bi bi-cash-coin"></i></div>
                            <div>
                                <span className="fin-label">Total Disbursed Funds</span>
                                <h3>{loading ? "..." : formatCurrency(financialStats.totalUsed)}</h3>
                                <p className="mb-0 text-muted small">
                                    <strong>{financialStats.utilizationPercent}%</strong> overall treasury utilization
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Remaining Headroom */}
                    <div className="col-12 col-md-4">
                        <div className="analytics-fin-card remaining">
                            <div className="fin-icon"><i className="bi bi-wallet2"></i></div>
                            <div>
                                <span className="fin-label">Available Treasury Headroom</span>
                                <h3>{loading ? "..." : formatCurrency(financialStats.remaining)}</h3>
                                <p className="mb-0 text-muted small">Remaining undisbursed balance</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= 3. APPLICATION PIPELINE DISTRIBUTION ================= */}
                <div className="card shadow-sm border-0 rounded-4 mt-3 p-3 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h6 className="fw-bold mb-0 text-dark">
                                <i className="bi bi-kanban text-primary me-2"></i> Application Status & Triage Distribution
                            </h6>
                            <small className="text-muted">Live workflow distribution of citizen grant submissions</small>
                        </div>
                        <span className="badge bg-light text-primary border px-3 py-1">
                            {applicationPipeline.total} Total Submissions
                        </span>
                    </div>

                    <div className="row g-2">
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="status-metric-box blue">
                                <span>Submitted</span>
                                <h4>{loading ? "..." : applicationPipeline.submitted}</h4>
                                <small>At Front Desk</small>
                            </div>
                        </div>

                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="status-metric-box orange">
                                <span>Under Verification</span>
                                <h4>{loading ? "..." : applicationPipeline.underReview}</h4>
                                <small>Field / District</small>
                            </div>
                        </div>

                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="status-metric-box red">
                                <span>Action Required</span>
                                <h4>{loading ? "..." : applicationPipeline.actionRequired}</h4>
                                <small>Returned for edits</small>
                            </div>
                        </div>

                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="status-metric-box green">
                                <span>Approved</span>
                                <h4>{loading ? "..." : applicationPipeline.approved}</h4>
                                <small>Sanctioned</small>
                            </div>
                        </div>

                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="status-metric-box cyan">
                                <span>Disbursed</span>
                                <h4>{loading ? "..." : applicationPipeline.disbursed}</h4>
                                <small>Milestone Released</small>
                            </div>
                        </div>

                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="status-metric-box gray">
                                <span>Rejected</span>
                                <h4>{loading ? "..." : applicationPipeline.rejected}</h4>
                                <small>Closed ineligible</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= 4. SCHEME-WISE BUDGET & COMPLIANCE TELEMETRY ================= */}
                <div className="card shadow-sm border-0 rounded-4 mt-3 bg-white overflow-hidden">
                    <div className="card-header-flex p-3 border-bottom">
                        <div>
                            <h6 className="fw-bold mb-0">
                                <i className="bi bi-pie-chart-fill text-primary me-2"></i> Scheme-Wise Budget & Compliance Telemetry
                            </h6>
                            <small className="text-muted">Real-time budget consumption, application traction, and milestone compliance per welfare scheme</small>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <div className="scheme-search-input-wrapper">
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Filter schemes..."
                                    value={schemeSearch}
                                    onChange={(e) => setSchemeSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle custom-dashboard-table mb-0">
                            <thead>
                                <tr>
                                    <th>Scheme Name</th>
                                    <th>Department</th>
                                    <th>Total Budget</th>
                                    <th>Disbursed</th>
                                    <th>Remaining</th>
                                    <th>Utilization</th>
                                    <th>Applications</th>
                                    <th>Compliance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchemes.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4 text-muted">
                                            {schemeSummaries.length === 0
                                                ? "No welfare schemes registered in the system."
                                                : "No schemes matching search filter."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSchemes.map((scheme) => {
                                        const total = Number(scheme.totalBudget) || 0;
                                        const used = Number(scheme.budgetUsed) || 0;
                                        const remaining = Math.max(0, total - used);
                                        const percent = scheme.utilizationPercent ?? (total > 0 ? (used / total) * 100 : 0);
                                        const isHigh = percent >= 80 || scheme.warning;

                                        return (
                                            <tr key={scheme.schemeId}>
                                                <td>
                                                    <strong>{scheme.schemeName}</strong>
                                                    {isHigh && (
                                                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle ms-2">
                                                            Critical &gt;80%
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className="dept-badge">
                                                        {scheme.departmentName || "General"}
                                                    </span>
                                                </td>
                                                <td>{formatCurrency(total)}</td>
                                                <td>
                                                    <strong className="text-primary">{formatCurrency(used)}</strong>
                                                </td>
                                                <td>
                                                    <span className={remaining < total * 0.2 ? "text-danger fw-bold" : "text-dark"}>
                                                        {formatCurrency(remaining)}
                                                    </span>
                                                </td>
                                                <td style={{ minWidth: "140px" }}>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="progress flex-grow-1" style={{ height: "6px" }}>
                                                            <div
                                                                className={`progress-bar ${isHigh ? "bg-danger" : percent >= 50 ? "bg-warning" : "bg-primary"}`}
                                                                style={{ width: `${Math.min(100, percent)}%` }}
                                                            ></div>
                                                        </div>
                                                        <small className="fw-semibold">{Number(percent).toFixed(1)}%</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {scheme.totalApplications ?? 0} Submissions
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                                                        {scheme.complianceRatePercent ?? 100}% on-time
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ================= 5. DISTRICT / REGIONAL ANALYTICS ================= */}
                <div className="card shadow-sm border-0 rounded-4 mt-3 bg-white overflow-hidden">
                    <div className="card-header-flex p-3 border-bottom">
                        <div>
                            <h6 className="fw-bold mb-0">
                                <i className="bi bi-geo-alt-fill text-primary me-2"></i> District & Regional Performance Telemetry
                            </h6>
                            <small className="text-muted">Real geographical distribution aggregated from citizen applicant registrations</small>
                        </div>
                    </div>

                    <div className="p-3">
                        {regionSummaries.length === 0 ? (
                            <div className="text-center text-muted py-4">
                                <i className="bi bi-geo-alt fs-2 text-secondary mb-2 d-block"></i>
                                <h6 className="text-dark fw-bold">No district-level analytics available yet.</h6>
                                <p className="small text-muted mb-0">
                                    Regional metrics will automatically populate once applicants with district profiles submit welfare applications.
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle custom-dashboard-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>District</th>
                                            <th>Total Applications</th>
                                            <th>Approved</th>
                                            <th>Rejected</th>
                                            <th>Pending</th>
                                            <th>Approval Rate</th>
                                            <th>Potential Grant</th>
                                            <th>Disbursed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {regionSummaries.map((region) => {
                                            const total = region.totalApplications || 0;
                                            const approved = region.approvedApplications || 0;
                                            const rate = total > 0 ? ((approved / total) * 100).toFixed(1) : "0.0";

                                            return (
                                                <tr key={region.district}>
                                                    <td>
                                                        <strong className="text-dark">{region.district}</strong>
                                                    </td>
                                                    <td>{total}</td>
                                                    <td>
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                                                            {approved}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                                                            {region.rejectedApplications || 0}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                                                            {region.pendingApplications || 0}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <strong>{rate}%</strong>
                                                    </td>
                                                    <td>{formatCurrency(region.potentialGrantValue || 0)}</td>
                                                    <td>
                                                        <strong className="text-primary">
                                                            {formatCurrency(region.totalDisbursed || 0)}
                                                        </strong>
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
        </div>
    );
}

export default AnalyticsDashboard;