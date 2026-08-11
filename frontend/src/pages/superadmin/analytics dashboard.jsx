import "./AnalyticsDashboard.css";

function AnalyticsDashboard() {

    const districtData = [
        {
            district: "Ahmedabad",
            applications: 3,
            approved: 1,
            rejected: 0,
            pending: 2,
            grantValue: "₹50,000",
            disbursed: "₹0"
        },
        {
            district: "Surat",
            applications: 8,
            approved: 5,
            rejected: 1,
            pending: 2,
            grantValue: "₹2,50,000",
            disbursed: "₹0"
        },
        {
            district: "Rajkot",
            applications: 6,
            approved: 4,
            rejected: 1,
            pending: 1,
            grantValue: "₹1,80,000",
            disbursed: "₹0"
        }
    ];

    const getApprovalRate = (approved, applications) => {
        if (applications === 0) {
            return "0.0";
        }

        return ((approved / applications) * 100).toFixed(1);
    };

    return (
        <div className="container py-5">

            {/* Header */}

            <h2 className="text-primary mb-2">
                Analytics Dashboard
            </h2>

            <p className="text-muted mb-4">
                Monitor district-wise applications, grant allocation and fund utilization.
            </p>


            {/* Overall Summary */}

            <div className="row mb-4">

                {/* Total Departments */}

                <div className="col-md-3 mb-3">
                    <div className="card shadow text-center p-3 analytics-summary-card">

                        <h6>Total Departments</h6>

                        <h2 className="text-primary">
                            4
                        </h2>

                    </div>
                </div>


                {/* Total Officers */}

                <div className="col-md-3 mb-3">
                    <div className="card shadow text-center p-3 analytics-summary-card">

                        <h6>Total Officers</h6>

                        <h2 className="text-success">
                            16
                        </h2>

                    </div>
                </div>


                {/* Total Applications */}

                <div className="col-md-3 mb-3">
                    <div className="card shadow text-center p-3 analytics-summary-card">

                        <h6>Total Applications</h6>

                        <h2 className="text-warning">
                            1,245
                        </h2>

                    </div>
                </div>


                {/* Total Grant Allocation */}

                <div className="col-md-3 mb-3">
                    <div className="card shadow text-center p-3 analytics-summary-card">

                        <h6>Total Grant Allocation</h6>

                        <h2 className="text-danger">
                            ₹4.8 Cr
                        </h2>

                    </div>
                </div>

            </div>


            {/* District-wise Analytics */}

            <div className="card shadow p-4 mb-4">

                <div className="mb-3">

                    <h4 className="mb-1">
                        District-wise Fund Utilization & Application Report
                    </h4>

                    <small className="text-muted">
                        Regional application and grant overview
                    </small>

                </div>


                <div className="table-responsive">

                    <table className="table table-hover align-middle">

                        <thead className="table-primary">

                        <tr>

                            <th>District</th>

                            <th>Total Applications</th>

                            <th>Approved</th>

                            <th>Rejected</th>

                            <th>Pending</th>

                            <th>Approval Rate</th>

                            <th>District Grant Allocation</th>

                            <th>Total Disbursed</th>

                        </tr>

                        </thead>


                        <tbody>

                        {districtData.map((district) => (

                            <tr key={district.district}>

                                <td>
                                    <strong>
                                        {district.district}
                                    </strong>
                                </td>


                                <td>
                                    {district.applications}
                                </td>


                                <td>
                                    <span className="analytics-badge approved">
                                        {district.approved}
                                    </span>
                                </td>


                                <td>
                                    <span className="analytics-badge rejected">
                                        {district.rejected}
                                    </span>
                                </td>


                                <td>
                                    <span className="analytics-badge pending">
                                        {district.pending}
                                    </span>
                                </td>


                                <td>
                                    <strong>
                                        {getApprovalRate(
                                            district.approved,
                                            district.applications
                                        )}%
                                    </strong>
                                </td>


                                <td>
                                    {district.grantValue}
                                </td>


                                <td>
                                    {district.disbursed}
                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>


                {/* Backend Integration Note */}

                <div className="analytics-note">

                    <strong>Note:</strong> District-level figures are currently
                    sample data for UI demonstration. Actual values will be
                    populated through backend APIs.

                </div>

            </div>


            {/* Regional Overview */}

            <div className="card shadow p-4">

                <h4 className="mb-4 text-center">
                    Regional Overview
                </h4>


                <div className="row">

                    {/* Highest Applications */}

                    <div className="col-md-3 mb-3">

                        <div className="overview-item">

                            <div className="overview-icon">
                                <span>▥</span>
                            </div>

                            <div>

                                <span>
                                    Highest Applications
                                </span>

                                <strong>
                                    Surat
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* Highest Approval Rate */}

                    <div className="col-md-3 mb-3">

                        <div className="overview-item">

                            <div className="overview-icon">
                                <span>↗</span>
                            </div>

                            <div>

                                <span>
                                    Highest Approval Rate
                                </span>

                                <strong>
                                    Rajkot
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* District Grant Allocation */}

                    <div className="col-md-3 mb-3">

                        <div className="overview-item">

                            <div className="overview-icon">
                                <span>₹</span>
                            </div>

                            <div>

                                <span>
                                    District Grant Allocation
                                </span>

                                <strong>
                                    ₹4,80,000
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* Total Disbursed */}

                    <div className="col-md-3 mb-3">

                        <div className="overview-item">

                            <div className="overview-icon">
                                <span>₹</span>
                            </div>

                            <div>

                                <span>
                                    Total Disbursed
                                </span>

                                <strong>
                                    ₹0
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AnalyticsDashboard;