import "./Dashboard.css";

function Dashboard() {

    return (
        <div className="dashboard-page">

            <div className="container">

                <h2 className="dashboard-title">
                    Welcome, Beneficiary 👋
                </h2>

                <p className="dashboard-subtitle">
                    Manage your government scheme applications from one place.
                </p>

                {/* Statistics Cards */}

                <div className="row mt-4">

                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="dashboard-card">
                            <h3>05</h3>
                            <p>Total Applications</p>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="dashboard-card approved">
                            <h3>02</h3>
                            <p>Approved</p>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="dashboard-card pending">
                            <h3>02</h3>
                            <p>Pending</p>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="dashboard-card rejected">
                            <h3>01</h3>
                            <p>Rejected</p>
                        </div>
                    </div>

                </div>

                {/* Quick Actions */}

                <h4 className="section-title">Quick Actions</h4>

                <div className="row">

                    <div className="col-lg-3 col-md-6 mb-3">
                        <button className="btn btn-primary w-100">
                            View Schemes
                        </button>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <button className="btn btn-success w-100">
                            Apply Scheme
                        </button>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <button className="btn btn-warning w-100">
                            My Applications
                        </button>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">
                        <button className="btn btn-info w-100 text-white">
                            Track Status
                        </button>
                    </div>

                </div>

                {/* Recent Applications */}

                <h4 className="section-title mt-5">
                    Recent Applications
                </h4>

                <div className="table-responsive">

                    <table className="table table-bordered table-hover">

                        <thead className="table-primary">

                        <tr>
                            <th>Scheme</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>

                        </thead>

                        <tbody>

                        <tr>
                            <td>Farmer Assistance</td>
                            <td>10-Jul-2026</td>
                            <td>Approved</td>
                        </tr>

                        <tr>
                            <td>Student Scholarship</td>
                            <td>12-Jul-2026</td>
                            <td>Pending</td>
                        </tr>

                        <tr>
                            <td>Affordable Housing</td>
                            <td>15-Jul-2026</td>
                            <td>Rejected</td>
                        </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );

}

export default Dashboard;