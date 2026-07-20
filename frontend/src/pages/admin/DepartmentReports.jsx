import "./DepartmentReports.css";

function DepartmentReports() {

    return (

        <div className="container py-5">

            <h2 className="text-primary mb-4">
                Department Reports
            </h2>

            <div className="row">

                <div className="col-md-3 mb-4">
                    <div className="report-card">
                        <h3>355</h3>
                        <p>Total Applications</p>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="report-card approved">
                        <h3>220</h3>
                        <p>Approved</p>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="report-card pending">
                        <h3>95</h3>
                        <p>Pending</p>
                    </div>
                </div>

                <div className="col-md-3 mb-4">
                    <div className="report-card rejected">
                        <h3>40</h3>
                        <p>Rejected</p>
                    </div>
                </div>

            </div>

            <div className="card shadow p-4 mt-4">

                <h4 className="mb-3">
                    Scheme-wise Summary
                </h4>

                <table className="table table-hover">

                    <thead className="table-primary">

                    <tr>
                        <th>Scheme</th>
                        <th>Applications</th>
                        <th>Approved</th>
                        <th>Pending</th>
                        <th>Rejected</th>
                    </tr>

                    </thead>

                    <tbody>

                    <tr>
                        <td>Farmer Assistance Scheme</td>
                        <td>120</td>
                        <td>80</td>
                        <td>25</td>
                        <td>15</td>
                    </tr>

                    <tr>
                        <td>Student Scholarship Scheme</td>
                        <td>95</td>
                        <td>60</td>
                        <td>25</td>
                        <td>10</td>
                    </tr>

                    <tr>
                        <td>Affordable Housing Scheme</td>
                        <td>80</td>
                        <td>50</td>
                        <td>20</td>
                        <td>10</td>
                    </tr>

                    <tr>
                        <td>Women Empowerment Scheme</td>
                        <td>60</td>
                        <td>30</td>
                        <td>25</td>
                        <td>5</td>
                    </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default DepartmentReports;