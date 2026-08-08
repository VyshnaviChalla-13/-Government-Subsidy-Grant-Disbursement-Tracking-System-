import React from "react";
import { useNavigate } from "react-router-dom";
import "./DepartmentAdminDashboard.css";

function DepartmentAdminDashboard() {

    const navigate = useNavigate();

    return (
        <div className="admin-dashboard">

            {/* ================= HEADER ================= */}
            <div className="admin-header">

                <div>
                    <p className="admin-subtitle">
                        Department Administration
                    </p>

                    <h1>
                        Welcome back, Department Admin 👋
                    </h1>

                    <p className="admin-description">
                        Manage schemes, officers and monitor department activities.
                    </p>
                </div>

                <div className="admin-profile">

                    <div className="profile-icon">
                        A
                    </div>

                    <div>
                        <strong>Department Admin</strong>
                        <span>Administrator</span>
                    </div>

                </div>

            </div>


            {/* ================= STATISTICS ================= */}
            <div className="admin-stats">

                <div className="stat-card blue">

                    <div className="stat-icon">
                        📁
                    </div>

                    <div>
                        <h2>4</h2>
                        <p>Total Schemes</p>
                        <span>All department schemes</span>
                    </div>

                </div>


                <div className="stat-card green">

                    <div className="stat-icon">
                        ✓
                    </div>

                    <div>
                        <h2>4</h2>
                        <p>Active Schemes</p>
                        <span>Currently active schemes</span>
                    </div>

                </div>


                <div className="stat-card purple">

                    <div className="stat-icon">
                        👥
                    </div>

                    <div>
                        <h2>12</h2>
                        <p>Total Officers</p>
                        <span>Registered officers</span>
                    </div>

                </div>


                <div className="stat-card orange">

                    <div className="stat-icon">
                        📄
                    </div>

                    <div>
                        <h2>355</h2>
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

                        <p>
                            Access frequently used department functions
                        </p>
                    </div>

                </div>


                <div className="action-grid">

                    {/* Create Scheme */}
                    <button
                        type="button"
                        className="admin-action create"
                        onClick={() => navigate("/admin/create-scheme")}
                    >

                        <span className="action-icon">
                            📄+
                        </span>

                        <div>
                            <strong>Create Scheme</strong>

                            <small>
                                Create a new government scheme
                            </small>
                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>


                    {/* Manage Schemes */}
                    <button
                        type="button"
                        className="admin-action manage"
                        onClick={() => navigate("/admin/manage-schemes")}
                    >

                        <span className="action-icon">
                            ☷
                        </span>

                        <div>
                            <strong>Manage Schemes</strong>

                            <small>
                                View and manage all schemes
                            </small>
                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>


                    {/* Manage Officers */}
                    <button
                        type="button"
                        className="admin-action officers"
                        onClick={() => navigate("/admin/manage-officers")}
                    >

                        <span className="action-icon">
                            👤
                        </span>

                        <div>
                            <strong>Manage Officers</strong>

                            <small>
                                Add, update and manage officers
                            </small>
                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>


                    {/* Department Reports */}
                    <button
                        type="button"
                        className="admin-action reports"
                        onClick={() => navigate("/admin/reports")}
                    >

                        <span className="action-icon">
                            📊
                        </span>

                        <div>
                            <strong>Department Reports</strong>

                            <small>
                                View analytics and reports
                            </small>
                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>


                    {/* Overdue Resolution */}
                    <button
                        type="button"
                        className="admin-action overdue"
                        onClick={() =>
                            navigate("/admin/overdue-resolution")
                        }
                    >

                        <span className="action-icon">
                            ⏰
                        </span>

                        <div>
                            <strong>Overdue Resolution</strong>

                            <small>
                                Resolve overdue applications
                            </small>
                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>

                </div>

            </section>


            {/* ================= DEPARTMENT SCHEMES ================= */}
            <section className="schemes-section">

                <div className="section-heading schemes-heading">

                    <div>

                        <h2>
                            Department Schemes
                        </h2>

                        <p>
                            Overview of schemes managed by your department
                        </p>

                    </div>


                    <button
                        type="button"
                        className="view-all-btn"
                        onClick={() =>
                            navigate("/admin/manage-schemes")
                        }
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
                            <th>Applications</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>

                        </thead>


                        <tbody>

                        {/* Farmer */}
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
                                    <span className="active-badge">
                                        Active
                                    </span>
                            </td>

                            <td>
                                <button
                                    type="button"
                                    className="manage-btn"
                                    onClick={() =>
                                        navigate("/admin/manage-schemes")
                                    }
                                >
                                    Manage
                                </button>
                            </td>

                        </tr>


                        {/* Student */}
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
                                    <span className="active-badge">
                                        Active
                                    </span>
                            </td>

                            <td>
                                <button
                                    type="button"
                                    className="manage-btn"
                                    onClick={() =>
                                        navigate("/admin/manage-schemes")
                                    }
                                >
                                    Manage
                                </button>
                            </td>

                        </tr>


                        {/* Housing */}
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
                                    <span className="active-badge">
                                        Active
                                    </span>
                            </td>

                            <td>
                                <button
                                    type="button"
                                    className="manage-btn"
                                    onClick={() =>
                                        navigate("/admin/manage-schemes")
                                    }
                                >
                                    Manage
                                </button>
                            </td>

                        </tr>


                        {/* Women */}
                        <tr>

                            <td>
                                <strong>
                                    ♀ Women Empowerment Scheme
                                </strong>
                            </td>

                            <td>
                                Women & Child Welfare
                            </td>

                            <td>
                                60
                            </td>

                            <td>
                                    <span className="active-badge">
                                        Active
                                    </span>
                            </td>

                            <td>
                                <button
                                    type="button"
                                    className="manage-btn"
                                    onClick={() =>
                                        navigate("/admin/manage-schemes")
                                    }
                                >
                                    Manage
                                </button>
                            </td>

                        </tr>

                        </tbody>

                    </table>

                </div>

            </section>

        </div>
    );
}

export default DepartmentAdminDashboard;