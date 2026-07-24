import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FrontDeskDashboard.css";

function FrontDeskDashboard() {

    const [applications, setApplications] = useState([
        {
            id: "APP1001",
            applicant: "Rahul Kumar",
            scheme: "Farmer Assistance Scheme",
            department: "Agriculture",
            submittedDate: "10-Jul-2026",
            aadhaar: "1234 5678 9012",
            mobile: "9876543210",
            income: "₹1,50,000",
            occupation: "Farmer",
            address: "Chittoor, Andhra Pradesh",
            documents: {
                aadhaar: true,
                incomeCertificate: true,
                bankPassbook: true,
            },
            status: "Pending",
        },

        {
            id: "APP1002",
            applicant: "Anjali Sharma",
            scheme: "Student Scholarship Scheme",
            department: "Education",
            submittedDate: "12-Jul-2026",
            aadhaar: "2345 6789 0123",
            mobile: "9876501234",
            income: "₹90,000",
            occupation: "Student",
            address: "Tirupati, Andhra Pradesh",
            documents: {
                aadhaar: true,
                incomeCertificate: true,
                bankPassbook: true,
            },
            status: "Pending",
        },

        {
            id: "APP1003",
            applicant: "Suresh Reddy",
            scheme: "Affordable Housing Scheme",
            department: "Housing",
            submittedDate: "15-Jul-2026",
            aadhaar: "3456 7890 1234",
            mobile: "9876512345",
            income: "₹1,80,000",
            occupation: "Construction Worker",
            address: "Nellore, Andhra Pradesh",
            documents: {
                aadhaar: true,
                incomeCertificate: false,
                bankPassbook: true,
            },
            status: "Pending",
        },

        {
            id: "APP1004",
            applicant: "Priya Nair",
            scheme: "Women Empowerment Scheme",
            department: "Social Welfare",
            submittedDate: "16-Jul-2026",
            aadhaar: "4567 8901 2345",
            mobile: "9876523456",
            income: "₹1,20,000",
            occupation: "Tailor",
            address: "Salem, Tamil Nadu",
            documents: {
                aadhaar: true,
                incomeCertificate: true,
                bankPassbook: true,
            },
            status: "Pending",
        },
    ]);
    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const navigate = useNavigate();

    const filteredApplications = applications.filter((app) => {

        const matchesSearch =
            app.id.toLowerCase().includes(search.toLowerCase()) ||
            app.name.toLowerCase().includes(search.toLowerCase());

        const matchesScheme =
            schemeFilter === "" || app.scheme === schemeFilter;

        const matchesStatus =
            statusFilter === "" || app.status === statusFilter;

        return matchesSearch && matchesScheme && matchesStatus;
    });

    const updateStatus = (id, status) => {

        const updated = applications.map((app) =>
            app.id === id ? { ...app, status } : app
        );

        setApplications(updated);
    };

    return (

        <div className="dashboard-layout">

            {/* Sidebar */}

            <aside className="sidebar">

                <h2>Gov Portal</h2>

                <ul>

                    <li>🏠 Dashboard</li>

                    <li>📄 Applications</li>

                    <li>📋 Schemes</li>

                    <li>👤 Profile</li>

                    <li>🚪 Logout</li>

                </ul>

            </aside>





            {/* Main Content */}

            <main className="main-content">

                <div className="topbar">

                    <h1>Front Desk Dashboard</h1>

                    <div className="officer-name">

                        Front Desk Officer

                    </div>

                </div>



                <p className="welcome">

                    Welcome! Review and manage beneficiary applications.

                </p>



                {/* Dashboard Cards */}

                <div className="dashboard-cards">

                    <div className="card">

                        <h3>Total Applications</h3>

                        <p>{applications.length}</p>

                    </div>

                    <div className="card">

                        <h3>Pending Review</h3>

                        <p>
                            {
                                applications.filter(
                                    (a) => a.status === "Pending"
                                ).length
                            }
                        </p>

                    </div>

                    <div className="card">

                        <h3>Forwarded</h3>

                        <p>
                            {
                                applications.filter(
                                    (a) => a.status === "Forwarded"
                                ).length
                            }
                        </p>

                    </div>

                    <div className="card">

                        <h3>Rejected</h3>

                        <p>
                            {
                                applications.filter(
                                    (a) => a.status === "Rejected"
                                ).length
                            }
                        </p>

                    </div>

                </div>



                {/* Search & Filters */}

                <div className="filter-section">

                    <input
                        type="text"
                        placeholder="Search by ID or Name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={schemeFilter}
                        onChange={(e) => setSchemeFilter(e.target.value)}
                    >

                        <option value="">All Schemes</option>
                        <option value="Farmer Assistance Scheme">Farmer Assistance Scheme</option>
                        <option value="Student Scholarship Scheme">Student Scholarship Scheme</option>
                        <option value="Affordable Housing Scheme">Affordable Housing Scheme</option>
                        <option value="Women Empowerment Scheme">Women Empowerment Scheme</option>

                    </select>



                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >

                        <option value="">All Status</option>

                        <option>Pending</option>

                        <option>Forwarded</option>

                        <option>Rejected</option>

                    </select>

                </div>



                {/* Applications Table */}

                <table className="application-table">

                    <thead>

                    <tr>

                        <th>ID</th>

                        <th>Beneficiary</th>

                        <th>Scheme</th>

                        <th>Date</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                    </thead>

                    <tbody>

                    {filteredApplications.map((app) => (

                        <tr key={app.id}>

                            <td>{app.id}</td>

                            <td>{app.applicant}</td>

                            <td>{app.scheme}</td>

                            <td>{app.submittedDate}</td>

                            <td>

                                    <span
                                        className={app.status.toLowerCase()}
                                    >
                                        {app.status}
                                    </span>

                            </td>

                            <td>

                                <button
                                    className="view-btn"
                                    onClick={() =>
                                        navigate("/officer/frontdesk/application", {
                                            state: app,
                                        })
                                    }
                                >
                                    View
                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus(
                                            app.id,
                                            "Forwarded"
                                        )
                                    }
                                >
                                    Forward
                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus(
                                            app.id,
                                            "Rejected"
                                        )
                                    }
                                >
                                    Reject
                                </button>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>
                {selectedApplication && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>Application Details</h2>

                            <div className="details-grid">

                                <div>
                                    <strong>Application ID</strong>
                                    <p>{selectedApplication.id}</p>
                                </div>

                                <div>
                                    <strong>Beneficiary Name</strong>
                                    <p>{selectedApplication.name}</p>
                                </div>

                                <div>
                                    <strong>Scheme</strong>
                                    <p>{selectedApplication.scheme}</p>
                                </div>

                                <div>
                                    <strong>Date</strong>
                                    <p>{selectedApplication.date}</p>
                                </div>

                                <div>
                                    <strong>Status</strong>
                                    <p>{selectedApplication.status}</p>
                                </div>

                                <div>
                                    <strong>Mobile</strong>
                                    <p>9876543210</p>
                                </div>

                                <div>
                                    <strong>Email</strong>
                                    <p>beneficiary@gmail.com</p>
                                </div>

                                <div>
                                    <strong>Aadhaar</strong>
                                    <p>XXXX XXXX 5678</p>
                                </div>

                                <div>
                                    <strong>Address</strong>
                                    <p>Tirupati, Andhra Pradesh</p>
                                </div>

                                <div>
                                    <strong>Income</strong>
                                    <p>₹2,40,000 / Year</p>
                                </div>

                                <div>
                                    <strong>Bank</strong>
                                    <p>State Bank of India</p>
                                </div>

                                <div>
                                    <strong>Account Status</strong>
                                    <p>Verified</p>
                                </div>

                            </div>

                            <div className="document-section">

                                <h3>Uploaded Documents</h3>

                                <ul>
                                    <li>✔ Aadhaar Card</li>
                                    <li>✔ Income Certificate</li>
                                    <li>✔ Bank Passbook</li>
                                    <li>✔ Residence Certificate</li>
                                </ul>

                            </div>

                            <div className="modal-buttons">

                                <button
                                    className="close-btn"
                                    onClick={() => setSelectedApplication(null)}
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </main>

        </div>

    );
}

export default FrontDeskDashboard;