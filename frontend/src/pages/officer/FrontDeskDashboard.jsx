import React, { useState } from "react";
import "./FrontDeskDashboard.css";

function FrontDeskDashboard() {

    const [applications, setApplications] = useState([
        {
            id: "APP001",
            name: "Ravi Kumar",
            scheme: "Farmer Scheme",
            date: "10-07-2026",
            status: "Pending"
        },
        {
            id: "APP002",
            name: "Anitha",
            scheme: "Education Scheme",
            date: "09-07-2026",
            status: "Forwarded"
        },
        {
            id: "APP003",
            name: "Suresh",
            scheme: "Housing Scheme",
            date: "08-07-2026",
            status: "Rejected"
        },
        {
            id: "APP004",
            name: "Priya",
            scheme: "Farmer Scheme",
            date: "07-07-2026",
            status: "Pending"
        }
    ]);

    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

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

                        <option>Farmer Scheme</option>

                        <option>Education Scheme</option>

                        <option>Housing Scheme</option>

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

                            <td>{app.name}</td>

                            <td>{app.scheme}</td>

                            <td>{app.date}</td>

                            <td>

                                    <span
                                        className={app.status.toLowerCase()}
                                    >
                                        {app.status}
                                    </span>

                            </td>

                            <td>

                                <button>
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

            </main>

        </div>

    );
}

export default FrontDeskDashboard;