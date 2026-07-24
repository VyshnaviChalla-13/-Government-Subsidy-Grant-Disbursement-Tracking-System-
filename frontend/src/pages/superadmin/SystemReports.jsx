import "./SystemReports.css";

function SystemReports() {

    return (

        <div className="container py-5">

            <h2 className="text-primary mb-4">
                System Reports
            </h2>

            <div className="row mb-4">

                <div className="col-md-3">
                    <div className="card shadow text-center p-3">
                        <h5>Total Departments</h5>
                        <h2 className="text-primary">4</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow text-center p-3">
                        <h5>Total Officers</h5>
                        <h2 className="text-success">16</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow text-center p-3">
                        <h5>Total Applications</h5>
                        <h2 className="text-warning">1245</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow text-center p-3">
                        <h5>Total Grants</h5>
                        <h2 className="text-danger">₹4.8 Cr</h2>
                    </div>
                </div>

            </div>

            <div className="card shadow p-4">

                <h4 className="mb-3">
                    Department Wise Report
                </h4>

                <table className="table table-hover">

                    <thead className="table-primary">

                    <tr>
                        <th>Department</th>
                        <th>Schemes</th>
                        <th>Applications</th>
                        <th>Approved</th>
                        <th>Rejected</th>
                    </tr>

                    </thead>

                    <tbody>

                    <tr>
                        <td>Agriculture</td>
                        <td>1</td>
                        <td>420</td>
                        <td>360</td>
                        <td>60</td>
                    </tr>

                    <tr>
                        <td>Education</td>
                        <td>1</td>
                        <td>310</td>
                        <td>270</td>
                        <td>40</td>
                    </tr>

                    <tr>
                        <td>Housing</td>
                        <td>1</td>
                        <td>280</td>
                        <td>240</td>
                        <td>40</td>
                    </tr>

                    <tr>
                        <td>Social Welfare</td>
                        <td>1</td>
                        <td>235</td>
                        <td>200</td>
                        <td>35</td>
                    </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default SystemReports;