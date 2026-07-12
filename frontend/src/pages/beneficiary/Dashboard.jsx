import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
function Dashboard() {

    const applications = [
        {
            scheme: "Farmer Assistance",
            date: "10-Jul-2026",
            status: "Approved"
        },
        {
            scheme: "Student Scholarship",
            date: "12-Jul-2026",
            status: "Under Verification"
        },
        {
            scheme: "Affordable Housing",
            date: "15-Jul-2026",
            status: "Returned"
        }
    ];

    const notifications = [
        "Your Farmer Assistance application has been approved.",
        "Upload documents for Student Scholarship.",
        "Affordable Housing application returned for correction."
    ];
    
     const navigate = useNavigate();

    return (

        <div className="dashboard-page">

            <div className="container py-4">

                {/* Welcome */}

                <div className="welcome-banner">

                    <div>

                        <h2>
                            Welcome, Beneficiary 👋
                        </h2>

                        <p>
                            Track your applications, explore schemes and manage your profile from one place.
                        </p>

                    </div>

                </div>

                {/* Statistics */}

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

                            <p>Under Review</p>

                        </div>

                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">

                        <div className="dashboard-card returned">

                            <h3>01</h3>

                            <p>Returned</p>

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
                                onClick={() => navigate("/beneficiary/schemes")}
                        >
                                Browse Schemes
                        </button>

                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">

                        <button
                            className="btn btn-success w-100"
                            onClick={() => navigate("/beneficiary/apply")}
                        >
                            Apply Scheme
                        </button>

                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">

                        <button
                            className="btn btn-warning w-100 text-white"
                            onClick={() => navigate("/beneficiary/my-applications")}
                        >
                            My Applications
                        </button>

                    </div>

                    <div className="col-lg-3 col-md-6 mb-3">

                        <button
                            className="btn btn-info text-white w-100"
                            onClick={() => navigate("/beneficiary/profile")}
                        >
                            View Profile
                        </button>
                    </div>

                </div>

                <div className="row mt-5">

                    {/* Recent Applications */}

                    <div className="col-lg-8">

                        <div className="content-card">

                            <h4>

                                Recent Applications

                            </h4>

                            <table className="table table-hover">

                                <thead className="table-primary">

                                    <tr>

                                        <th>Scheme</th>

                                        <th>Date</th>

                                        <th>Status</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        applications.map((app, index) => (

                                            <tr key={index}>

                                                <td>{app.scheme}</td>

                                                <td>{app.date}</td>

                                                <td>

                                                    <span className={`status ${app.status.replace(/\s/g,"").toLowerCase()}`}>

                                                        {app.status}

                                                    </span>

                                                </td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* Notifications */}

                    <div className="col-lg-4">

                        <div className="content-card">

                            <h4>

                                Notifications

                            </h4>

                            <ul className="notification-list">

                                {

                                    notifications.map((note,index)=>(

                                        <li key={index}>

                                            🔔 {note}

                                        </li>

                                    ))

                                }

                            </ul>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;