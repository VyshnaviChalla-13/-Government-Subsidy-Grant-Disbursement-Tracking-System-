import "./SuperAdminDashboard.css";
import { useNavigate } from "react-router-dom";
function SuperAdminDashboard() {
    const navigate = useNavigate();
    return (
        <div className="superadmin-dashboard">

            {/* ================= HEADER ================= */}
            <div className="superadmin-header">

                <div>
                    <p className="superadmin-subtitle">
                        System Administration
                    </p>

                    <h1>
                        Welcome back, Super Admin 👋
                    </h1>

                    <p className="superadmin-description">
                        Monitor and manage the complete Government Subsidy & Grant
                        Disbursement System.
                    </p>
                </div>

                <div className="superadmin-profile">
                    <div className="superadmin-profile-icon">
                        SA
                    </div>

                    <div>
                        <strong>Super Admin</strong>
                        <span>System Administrator</span>
                    </div>
                </div>

            </div>


            {/* ================= STATISTICS ================= */}
            <div className="superadmin-stats">

                <div className="superadmin-stat-card blue">
                    <div className="superadmin-stat-icon">
                        🏢
                    </div>

                    <div>
                        <h2>4</h2>
                        <p>Departments</p>
                        <span>Registered departments</span>
                    </div>
                </div>


                <div className="superadmin-stat-card green">
                    <div className="superadmin-stat-icon">
                        👥
                    </div>

                    <div>
                        <h2>16</h2>
                        <p>Officers</p>
                        <span>Registered officers</span>
                    </div>
                </div>


                <div className="superadmin-stat-card purple">
                    <div className="superadmin-stat-icon">
                        📄
                    </div>

                    <div>
                        <h2>1,245</h2>
                        <p>Total Applications</p>
                        <span>Applications received</span>
                    </div>
                </div>


                <div className="superadmin-stat-card orange">
                    <div className="superadmin-stat-icon">
                        ₹
                    </div>

                    <div>
                        <h2>₹4.8 Cr</h2>
                        <p>Total Grants</p>
                        <span>Grants processed</span>
                    </div>
                </div>

            </div>


            {/* ================= QUICK ACTIONS ================= */}
            <section className="superadmin-actions">

                <div className="superadmin-section-heading">
                    <div>
                        <h2>Quick Actions</h2>

                        <p>
                            Access frequently used system administration functions
                        </p>
                    </div>
                </div>


                <div className="superadmin-action-grid">

                    {/* Manage Departments */}
                    <button
                        type="button"
                        className="superadmin-action departments"
                        onClick={() =>
                            navigate("/superadmin/departments")
                        }
                    >
                        <span className="superadmin-action-icon">
                            🏢
                        </span>

                        <div>
                            <strong>Manage Departments</strong>

                            <small>
                                Create, update and monitor departments
                            </small>
                        </div>

                        <span className="superadmin-arrow">
                            →
                        </span>
                    </button>


                    {/* Manage Users */}
                    <button
                        type="button"
                        className="superadmin-action users"
                        onClick={() =>
                            navigate("/superadmin/users")
                        }
                    >
                        <span className="superadmin-action-icon">
                            👥
                        </span>

                        <div>
                            <strong>Manage Users</strong>

                            <small>
                                Manage officers and beneficiary accounts
                            </small>
                        </div>

                        <span className="superadmin-arrow">
                            →
                        </span>
                    </button>


                    {/* System Reports */}
                    <button
                        type="button"
                        className="superadmin-action reports"
                        onClick={() =>
                            navigate("/superadmin/reports")
                        }
                    >
                        <span className="superadmin-action-icon">
                            📊
                        </span>

                        <div>
                            <strong>System Reports</strong>

                            <small>
                                View system-wide analytics and reports
                            </small>
                        </div>

                        <span className="superadmin-arrow">
                            →
                        </span>
                    </button>

                </div>

            </section>


            {/* ================= SYSTEM OVERVIEW ================= */}
            <section className="superadmin-overview">

                <div className="superadmin-section-heading">
                    <div>
                        <h2>System Overview</h2>

                        <p>
                            Current government schemes and application activity
                        </p>
                    </div>
                </div>


                <div className="superadmin-table-wrapper">

                    <table className="superadmin-table">

                        <thead>
                        <tr>
                            <th>Scheme</th>
                            <th>Department</th>
                            <th>Applications</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>


                        <tbody>

                        <tr>
                            <td>
                                <strong>
                                    🌱 Farmer Assistance Scheme
                                </strong>
                            </td>

                            <td>
                                Agriculture
                            </td>

                            <td>
                                120
                            </td>

                            <td>
                                <span className="superadmin-active-badge">
                                    Active
                                </span>
                            </td>

                            <td>
                                <button
                                    type="button"
                                    className="superadmin-view-btn"
                                    onClick={() =>
                                        navigate("/superadmin/reports")
                                    }
                                >
                                    View
                                </button>
                            </td>
                        </tr>


                        <tr>
                            <td>
                                <strong>
                                    🎓 Student Scholarship Scheme
                                </strong>
                            </td>

                            <td>
                                Education
                            </td>

                            <td>
                                95
                            </td>

                            <td>
                                <span className="superadmin-active-badge">
                                    Active
                                </span>
                            </td>

                            <td>
                                <button
                                    type="button"
                                    className="superadmin-view-btn"
                                    onClick={() =>
                                        navigate("/superadmin/reports")
                                    }
                                >
                                    View
                                </button>
                            </td>
                        </tr>


                        <tr>
                            <td>
                                <strong>
                                    🏠 Affordable Housing Scheme
                                </strong>
                            </td>

                            <td>
                                Housing
                            </td>

                            <td>
                                80
                            </td>

                            <td>
                                <span className="superadmin-active-badge">
                                    Active
                                </span>
                            </td>

                            <td>
                                <button
                                    type="button"
                                    className="superadmin-view-btn"
                                    onClick={() =>
                                        navigate("/superadmin/reports")
                                    }
                                >
                                    View
                                </button>
                            </td>
                        </tr>


                        <tr>
                            <td>
                                <strong>
                                    ♀ Women Empowerment Scheme
                                </strong>
                            </td>

                            <td>
                                Social Welfare
                            </td>

                            <td>
                                60
                            </td>

                            <td>
                                <span className="superadmin-active-badge">
                                    Active
                                </span>
                            </td>

                            <td>
                                <button
                                    type="button"
                                    className="superadmin-view-btn"
                                    onClick={() =>
                                        navigate("/superadmin/reports")
                                    }
                                >
                                    View
                                </button>
                            </td>
                        </tr>

                        </tbody>

                    </table>

                </div>

                {/* Audit Logs */}

                <div className="col-md-4 mb-4">

                    <div className="feature-card">

                        <h4>Audit Logs</h4>

                        <p>
                            View and monitor important activities performed across the system.
                        </p>

                        <button
                            className="btn btn-dark w-100"
                            onClick={() => navigate("/superadmin/audit-logs")}
                        >
                            Open
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default SuperAdminDashboard;