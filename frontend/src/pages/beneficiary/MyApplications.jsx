import "./MyApplications.css";
import { useNavigate } from "react-router-dom";

function MyApplications() {

    const navigate = useNavigate();

    const applications = [

        {
            id: "APP1001",
            scheme: "Farmer Assistance",
            date: "10-Jul-2026",
            status: "Approved"
        },

        {
            id: "APP1002",
            scheme: "Student Scholarship",
            date: "12-Jul-2026",
            status: "Under Verification"
        },

        {
            id: "APP1003",
            scheme: "Affordable Housing",
            date: "15-Jul-2026",
            status: "Returned"
        }

    ];

    return (

        <div className="applications-page">

            <div className="container py-5">

                <h2 className="text-primary mb-3">

                    My Applications

                </h2>

                <p className="text-muted mb-4">

                    Track all your submitted applications.

                </p>

                <div className="table-responsive">

                    <table className="table table-hover table-bordered">

                        <thead className="table-primary">

                            <tr>

                                <th>Application ID</th>

                                <th>Scheme</th>

                                <th>Date</th>

                                <th>Status</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                applications.map((app)=>(

                                    <tr key={app.id}>

                                        <td>{app.id}</td>

                                        <td>{app.scheme}</td>

                                        <td>{app.date}</td>

                                        <td>{app.status}</td>

                                        <td>

                                            <button

                                                className="btn btn-primary btn-sm"

                                                onClick={() => navigate("/beneficiary/timeline")}

                                            >

                                                View Timeline

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default MyApplications;