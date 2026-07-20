import "./DepartmentAdminDashboard.css";
import { useNavigate } from "react-router-dom";
function DepartmentAdminDashboard() {
    const navigate = useNavigate();
    const schemes = [

        {
            id: 1,
            name: "Farmer Assistance Scheme",
            department: "Agriculture",
            applications: 120,
            status: "Active"
        },

        {
            id: 2,
            name: "Student Scholarship Scheme",
            department: "Education",
            applications: 95,
            status: "Active"
        },

        {
            id: 3,
            name: "Affordable Housing Scheme",
            department: "Housing",
            applications: 80,
            status: "Active"
        },

        {
            id: 4,
            name: "Women Empowerment Scheme",
            department: "Social Welfare",
            applications: 60,
            status: "Active"
        }

    ];

    return (

        <div className="department-dashboard">

            <div className="container py-4">

                {/* Welcome */}

                <div className="welcome-banner">

                    <div>

                        <h2>
                            Welcome, Department Admin 👋
                        </h2>

                        <p>
                            Configure schemes, manage officers and monitor department activities.
                        </p>

                    </div>

                </div>

                {/* Statistics */}

                <div className="row mt-4">

                    <div className="col-lg-3 col-md-6 mb-4">

                        <div className="dashboard-card">

                            <h3>4</h3>

                            <p>Total Schemes</p>

                        </div>

                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">

                        <div className="dashboard-card active">

                            <h3>4</h3>

                            <p>Active Schemes</p>

                        </div>

                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">

                        <div className="dashboard-card officers">

                            <h3>12</h3>

                            <p>Total Officers</p>

                        </div>

                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">

                        <div className="dashboard-card applications">

                            <h3>355</h3>

                            <p>Applications</p>

                        </div>

                    </div>

                </div>

                {/* Quick Actions */}

                <h4 className="section-title">

                    Quick Actions

                </h4>

                <div className="row">

                    <div className="col-lg-3 col-md-6 mb-3">

                        <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate("/admin/create-scheme")}
                        >
                            Create Scheme
                        </button>

                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">

                        <button
                            className="btn btn-success w-100"
                            onClick={() => navigate("/admin/manage-schemes")}
                        >
                            Manage Schemes
                        </button>

                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">

                        <button
                            className="btn btn-warning text-white w-100"
                            onClick={() => navigate("/admin/manage-officers")}
                        >
                            Manage Officers
                        </button>

                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">

                        <button
                            className="btn btn-info text-white w-100"
                            onClick={() => navigate("/admin/reports")}
                        >
                            Department Reports
                        </button>
                    </div>

                </div>

                {/* Recent Schemes */}

                <div className="content-card mt-5">

                    <h4>

                        Department Schemes

                    </h4>

                    <table className="table table-hover">

                        <thead className="table-primary">

                        <tr>

                            <th>Scheme</th>

                            <th>Department</th>

                            <th>Applications</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                        </thead>

                        <tbody>

                        {

                            schemes.map((scheme) => (

                                <tr key={scheme.id}>

                                    <td>{scheme.name}</td>

                                    <td>{scheme.department}</td>

                                    <td>{scheme.applications}</td>

                                    <td>{scheme.status}</td>

                                    <td>

                                        <button className="btn btn-sm btn-outline-primary">

                                            Manage

                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                        </tbody>

                    </table>

                </div>

                {/* Recent Activities */}

                <div className="content-card mt-4">

                    <h4>

                        Recent Activities

                    </h4>

                    <ul className="activity-list">

                        <li>Farmer Assistance Scheme published successfully.</li>

                        <li>New Field Officer assigned to Agriculture Department.</li>

                        <li>Housing Scheme budget updated.</li>

                        <li>Student Scholarship eligibility rules modified.</li>

                    </ul>

                </div>

            </div>

        </div>

    );

}

export default DepartmentAdminDashboard;