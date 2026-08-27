import "./SuperAdminDashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDepartments } from "../../api/departmentApi";
import { getAllOfficers } from "../../api/officerApi";
import { getAllApplications } from "../../api/applicationApi";
import { getAllSchemes } from "../../api/schemeApi";
import { getSystemOverview } from "../../api/dashboardApi";

function SuperAdminDashboard() {
    const navigate = useNavigate();
    const [departmentsCount, setDepartmentsCount] = useState(0);
    const [officersCount, setOfficersCount] = useState(0);
    const [applicationsCount, setApplicationsCount] = useState(0);
    const [schemes, setSchemes] = useState([]);
    const [totalGrants, setTotalGrants] = useState("₹0");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSystemData() {
            try {
                setLoading(true);
                const [overview, depts, officers, apps, schs] = await Promise.all([
                    getSystemOverview().catch(() => null),
                    getAllDepartments().catch(() => []),
                    getAllOfficers().catch(() => []),
                    getAllApplications().catch(() => []),
                    getAllSchemes().catch(() => []),
                ]);

                if (overview) {
                    setDepartmentsCount(overview.totalDepartments ?? (Array.isArray(depts) ? depts.length : 0));
                    setOfficersCount(overview.totalOfficers ?? (Array.isArray(officers) ? officers.length : 0));
                    setApplicationsCount(overview.totalApplications ?? (Array.isArray(apps) ? apps.length : 0));
                } else {
                    setDepartmentsCount(Array.isArray(depts) ? depts.length : 0);
                    setOfficersCount(Array.isArray(officers) ? officers.length : 0);
                    setApplicationsCount(Array.isArray(apps) ? apps.length : 0);
                }

                setSchemes(Array.isArray(schs) ? schs : []);

                if (Array.isArray(schs) && schs.length > 0) {
                    const sum = schs.reduce((acc, s) => acc + (Number(s.totalBudget) || Number(s.maxGrant) || 0), 0);
                    if (sum >= 10000000) {
                        setTotalGrants(`₹${(sum / 10000000).toFixed(1)} Cr`);
                    } else if (sum >= 100000) {
                        setTotalGrants(`₹${(sum / 100000).toFixed(1)} Lakh`);
                    } else {
                        setTotalGrants(`₹${sum.toLocaleString("en-IN")}`);
                    }
                } else if (overview?.totalGrantValue) {
                    setTotalGrants(`₹${Number(overview.totalGrantValue).toLocaleString("en-IN")}`);
                }
            } catch (err) {
                console.error("Failed to load superadmin overview:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchSystemData();
    }, []);

    return (
        <div className="superadmin-dashboard">
            {/* ================= HEADER ================= */}
            <div className="superadmin-header">
                <div>
                    <p className="superadmin-subtitle">System Administration</p>
                    <h1>Welcome back, Super Admin 👋</h1>
                    <p className="superadmin-description">
                        Monitor and manage the complete Government Subsidy & Grant Disbursement System.
                    </p>
                </div>

                <div className="superadmin-profile">
                    <div className="superadmin-profile-icon">SA</div>
                    <div>
                        <strong>Super Admin</strong>
                        <span>System Administrator</span>
                    </div>
                </div>
            </div>

            {/* ================= STATISTICS ================= */}
            <div className="superadmin-stats">
                <div className="superadmin-stat-card blue">
                    <div className="superadmin-stat-icon">🏢</div>
                    <div>
                        <h2>{departmentsCount}</h2>
                        <p>Departments</p>
                        <span>Registered departments</span>
                    </div>
                </div>

                <div className="superadmin-stat-card green">
                    <div className="superadmin-stat-icon">👥</div>
                    <div>
                        <h2>{officersCount}</h2>
                        <p>Officers</p>
                        <span>Registered officers</span>
                    </div>
                </div>

                <div className="superadmin-stat-card purple">
                    <div className="superadmin-stat-icon">📄</div>
                    <div>
                        <h2>{applicationsCount}</h2>
                        <p>Total Applications</p>
                        <span>Applications received</span>
                    </div>
                </div>

                <div className="superadmin-stat-card orange">
                    <div className="superadmin-stat-icon">₹</div>
                    <div>
                        <h2>{totalGrants}</h2>
                        <p>Total Grants</p>
                        <span>Allocated budget</span>
                    </div>
                </div>
            </div>

            {/* ================= QUICK ACTIONS ================= */}
            <section className="superadmin-actions">
                <div className="superadmin-section-heading">
                    <div>
                        <h2>Quick Actions</h2>
                        <p>Access frequently used system administration functions</p>
                    </div>
                </div>

                <div className="superadmin-action-grid">
                    <button
                        type="button"
                        className="superadmin-action departments"
                        onClick={() => navigate("/superadmin/departments")}
                    >
                        <span className="superadmin-action-icon">🏢</span>
                        <div>
                            <strong>Manage Departments</strong>
                            <small>Create, update and monitor departments</small>
                        </div>
                        <span className="superadmin-arrow">→</span>
                    </button>

                    <button
                        type="button"
                        className="superadmin-action users"
                        onClick={() => navigate("/superadmin/users")}
                    >
                        <span className="superadmin-action-icon">👥</span>
                        <div>
                            <strong>Manage Users</strong>
                            <small>Manage officers and beneficiary accounts</small>
                        </div>
                        <span className="superadmin-arrow">→</span>
                    </button>

                    <button
                        type="button"
                        className="superadmin-action reports"
                        onClick={() => navigate("/superadmin/reports")}
                    >
                        <span className="superadmin-action-icon">📊</span>
                        <div>
                            <strong>Analytics Dashboard</strong>
                            <small>View system-wide analytics and reports</small>
                        </div>
                        <span className="superadmin-arrow">→</span>
                    </button>

                    <button
                        type="button"
                        className="superadmin-action reports"
                        onClick={() => navigate("/superadmin/audit-logs")}
                    >
                        <span className="superadmin-action-icon">📋</span>
                        <div>
                            <strong>Audit Logs</strong>
                            <small>View and monitor important system activities</small>
                        </div>
                        <span className="superadmin-arrow">→</span>
                    </button>
                </div>
            </section>

            {/* ================= SYSTEM OVERVIEW ================= */}
            <section className="superadmin-overview">
                <div className="superadmin-section-heading">
                    <div>
                        <h2>System Overview</h2>
                        <p>Current government schemes and application activity</p>
                    </div>
                </div>

                <div className="superadmin-table-wrapper">
                    <table className="superadmin-table">
                        <thead>
                            <tr>
                                <th>Scheme</th>
                                <th>Department</th>
                                <th>Max Grant</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {schemes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                                        No schemes registered.
                                    </td>
                                </tr>
                            ) : (
                                schemes.slice(0, 5).map((scheme) => (
                                    <tr key={scheme.schemeId}>
                                        <td><strong>{scheme.schemeName}</strong></td>
                                        <td>{scheme.department?.departmentName || "General"}</td>
                                        <td>₹{Number(scheme.maxGrant || 0).toLocaleString("en-IN")}</td>
                                        <td>
                                            <span className={scheme.status === "ACTIVE" ? "superadmin-active-badge" : "status-badge disabled"}>
                                                {scheme.status || "ACTIVE"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="superadmin-view-btn"
                                                onClick={() => navigate("/superadmin/reports")}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default SuperAdminDashboard;