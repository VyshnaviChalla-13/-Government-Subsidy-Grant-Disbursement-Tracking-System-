import "./SuperAdminDashboard.css";
import { useNavigate } from "react-router-dom";

function SuperAdminDashboard() {

    const navigate = useNavigate();

    return (

        <div className="container py-5">

            <h2 className="text-primary mb-2">
                Super Admin Dashboard
            </h2>

            <p className="text-muted mb-5">
                Monitor and manage the complete Government Subsidy & Grant Disbursement System.
            </p>

            <div className="row">

                <div className="col-md-3 mb-4">

                    <div className="summary-card">

                        <h3>4</h3>

                        <p>Departments</p>

                    </div>

                </div>

                <div className="col-md-3 mb-4">

                    <div className="summary-card">

                        <h3>16</h3>

                        <p>Officers</p>

                    </div>

                </div>

                <div className="col-md-3 mb-4">

                    <div className="summary-card">

                        <h3>1,245</h3>

                        <p>Total Applications</p>

                    </div>

                </div>

                <div className="col-md-3 mb-4">

                    <div className="summary-card">

                        <h3>₹4.8 Cr</h3>

                        <p>Total Grants</p>

                    </div>

                </div>

            </div>

            <div className="row mt-3">

                <div className="col-md-4 mb-4">

                    <div className="feature-card">

                        <h4>Manage Departments</h4>

                        <p>
                            Create, update and monitor government departments.
                        </p>

                        <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate("/superadmin/departments")}
                        >
                            Open
                        </button>

                    </div>

                </div>

                <div className="col-md-4 mb-4">

                    <div className="feature-card">

                        <h4>Manage Users</h4>

                        <p>
                            View and manage officers and beneficiary accounts.
                        </p>

                        <button
                            className="btn btn-success w-100"
                            onClick={() => navigate("/superadmin/users")}
                        >
                            Open
                        </button>

                    </div>

                </div>

                <div className="col-md-4 mb-4">

                    <div className="feature-card">

                        <h4>System Reports</h4>

                        <p>
                            View overall system analytics and reports.
                        </p>

                        <button
                            className="btn btn-warning text-white w-100"
                            onClick={() => navigate("/superadmin/reports")}
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