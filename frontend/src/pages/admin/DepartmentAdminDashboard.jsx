import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DepartmentAdminDashboard.css";
import { getAllSchemes } from "../../api/schemeApi";
import { getAllOfficers } from "../../api/officerApi";
import { getApplications } from "../../api/applicationApi";
import { getSystemOverview } from "../../api/dashboardApi";

function DepartmentAdminDashboard() {
    const navigate = useNavigate();
    const [schemes, setSchemes] = useState([]);
    const [officersCount, setOfficersCount] = useState(0);
    const [applicationsCount, setApplicationsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setLoading(true);
                const [overview, schemesData, officersData, appsData] = await Promise.all([
                    getSystemOverview().catch(() => null),
                    getAllSchemes().catch(() => []),
                    getAllOfficers().catch(() => []),
                    getApplications().catch(() => []),
                ]);

                setSchemes(Array.isArray(schemesData) ? schemesData : []);
                setOfficersCount(overview?.totalOfficers ?? (Array.isArray(officersData) ? officersData.length : 0));
                setApplicationsCount(overview?.totalApplications ?? (Array.isArray(appsData) ? appsData.length : 0));
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const activeSchemesCount = schemes.filter((s) => s.status === "ACTIVE").length;

    return (
        <div className="admin-dashboard">
            {/* ================= HEADER ================= */}
            <div className="admin-header">
                <div>
                    <p className="admin-subtitle">Department Administration</p>
                    <h1>Welcome back, Department Admin 👋</h1>
                    <p className="admin-description">
                        Manage schemes, officers and monitor department activities.
                    </p>
                </div>

                <div className="admin-profile">
                    <div className="profile-icon">A</div>
                    <div>
                        <strong>Department Admin</strong>
                        <span>Administrator</span>
                    </div>
                </div>
            </div>

            {/* ================= STATISTICS ================= */}
            <div className="admin-stats">
                <div className="stat-card blue">
                    <div className="stat-icon">📁</div>
                    <div>
                        <h2>{schemes.length}</h2>
                        <p>Total Schemes</p>
                        <span>All department schemes</span>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon">✓</div>
                    <div>
                        <h2>{activeSchemesCount}</h2>
                        <p>Active Schemes</p>
                        <span>Currently active schemes</span>
                    </div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon">👥</div>
                    <div>
                        <h2>{officersCount}</h2>
                        <p>Total Officers</p>
                        <span>Registered officers</span>
                    </div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon">📄</div>
                    <div>
                        <h2>{applicationsCount}</h2>
                        <p>Applications</p>
                        <span>Total applications received</span>
                    </div>
                </div>
            </div>

            {/* ================= QUICK ACTIONS ================= */}
            <section className="quick-actions">
                <div className="section-heading">
                    <div>
                        <h2>Quick Actions</h2>
                        <p>Access frequently used department functions</p>
                    </div>
                </div>

                <div className="action-grid">
                    <button
                        type="button"
                        className="admin-action create"
                        onClick={() => navigate("/admin/create-scheme")}
                    >
                        <span className="action-icon">📄+</span>
                        <div>
                            <strong>Create Scheme</strong>
                            <small>Create a new government scheme</small>
                        </div>
                        <span className="arrow">→</span>
                    </button>

                    <button
                        type="button"
                        className="admin-action manage"
                        onClick={() => navigate("/admin/manage-schemes")}
                    >
                        <span className="action-icon">☷</span>
                        <div>
                            <strong>Manage Schemes</strong>
                            <small>View and manage all schemes</small>
                        </div>
                        <span className="arrow">→</span>
                    </button>

                    <button
                        type="button"
                        className="admin-action officers"
                        onClick={() => navigate("/admin/manage-officers")}
                    >
                        <span className="action-icon">👤</span>
                        <div>
                            <strong>Manage Officers</strong>
                            <small>Add, update and manage officers</small>
                        </div>
                        <span className="arrow">→</span>
                    </button>

                    <button
                        type="button"
                        className="admin-action reports"
                        onClick={() => navigate("/admin/reports")}
                    >
                        <span className="action-icon">📊</span>
                        <div>
                            <strong>Department Reports</strong>
                            <small>View analytics and reports</small>
                        </div>
                        <span className="arrow">→</span>
                    </button>

                    <button
                        type="button"
                        className="admin-action overdue"
                        onClick={() => navigate("/admin/overdue-resolution")}
                    >
                        <span className="action-icon">⏰</span>
                        <div>
                            <strong>Overdue Resolution</strong>
                            <small>Resolve overdue applications</small>
                        </div>
                        <span className="arrow">→</span>
                    </button>
                </div>
            </section>

            {/* ================= DEPARTMENT SCHEMES ================= */}
            <section className="schemes-section">
                <div className="section-heading schemes-heading">
                    <div>
                        <h2>Department Schemes</h2>
                        <p>Overview of schemes managed by your department</p>
                    </div>

                    <button
                        type="button"
                        className="view-all-btn"
                        onClick={() => navigate("/admin/manage-schemes")}
                    >
                        View All Schemes →
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="admin-table">
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
                                        No schemes registered yet.
                                    </td>
                                </tr>
                            ) : (
                                schemes.slice(0, 5).map((scheme) => (
                                    <tr key={scheme.schemeId}>
                                        <td><strong>{scheme.schemeName}</strong></td>
                                        <td>{scheme.department?.departmentName || "General"}</td>
                                        <td>₹{Number(scheme.maxGrant || 0).toLocaleString("en-IN")}</td>
                                        <td>
                                            <span className={scheme.status === "ACTIVE" ? "active-badge" : "status-badge disabled"}>
                                                {scheme.status || "ACTIVE"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="manage-btn"
                                                onClick={() => navigate("/admin/manage-schemes")}
                                            >
                                                Manage
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

export default DepartmentAdminDashboard;