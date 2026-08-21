import React, { useState } from "react";
import "./ManageSchemes.css";

function ManageSchemes() {

    const [schemes, setSchemes] = useState([
        {
            id: "SCH001",
            name: "Farmer Assistance Scheme",
            department: "Agriculture",
            applications: 120,
            grantAmount: "₹50,000",
            category: "Agricultural Subsidy",
            deadline: "31 Dec 2026",
            status: "Active"
        },
        {
            id: "SCH002",
            name: "Student Scholarship Scheme",
            department: "Education",
            applications: 95,
            grantAmount: "₹30,000",
            category: "Education Support",
            deadline: "31 Dec 2026",
            status: "Active"
        },
        {
            id: "SCH003",
            name: "Affordable Housing Scheme",
            department: "Housing",
            applications: 80,
            grantAmount: "₹2,00,000",
            category: "Housing Support",
            deadline: "31 Dec 2026",
            status: "Active"
        },
        {
            id: "SCH004",
            name: "Women Empowerment Scheme",
            department: "Social Welfare",
            applications: 60,
            grantAmount: "₹40,000",
            category: "Women Welfare",
            deadline: "31 Dec 2026",
            status: "Active"
        }
    ]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedScheme, setSelectedScheme] = useState(null);
    const [editScheme, setEditScheme] = useState(null);
    const [deactivateScheme, setDeactivateScheme] = useState(null);

    /* ================= SEARCH & FILTER ================= */

    const filteredSchemes = schemes.filter((scheme) => {

        const matchesSearch =
            scheme.name.toLowerCase().includes(search.toLowerCase()) ||
            scheme.id.toLowerCase().includes(search.toLowerCase()) ||
            scheme.department.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            scheme.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    /* ================= EDIT ================= */

    const handleEditChange = (e) => {

        const { name, value } = e.target;

        setEditScheme({
            ...editScheme,
            [name]: value
        });
    };

    const saveEditedScheme = () => {

        setSchemes(
            schemes.map((scheme) =>
                scheme.id === editScheme.id
                    ? editScheme
                    : scheme
            )
        );

        setEditScheme(null);
    };

    /* ================= DEACTIVATE ================= */

    const confirmDeactivate = () => {

        setSchemes(
            schemes.map((scheme) =>
                scheme.id === deactivateScheme.id
                    ? {
                        ...scheme,
                        status: "Inactive"
                    }
                    : scheme
            )
        );

        setDeactivateScheme(null);
    };

    /* ================= ACTIVATE ================= */

    const activateScheme = (id) => {

        setSchemes(
            schemes.map((scheme) =>
                scheme.id === id
                    ? {
                        ...scheme,
                        status: "Active"
                    }
                    : scheme
            )
        );
    };

    const totalSchemes = schemes.length;

    const activeSchemes =
        schemes.filter((scheme) => scheme.status === "Active").length;

    const inactiveSchemes =
        schemes.filter((scheme) => scheme.status === "Inactive").length;

    const totalApplications =
        schemes.reduce(
            (total, scheme) => total + scheme.applications,
            0
        );

    return (

        <div className="manage-schemes-page">

            {/* ================= HEADER ================= */}

            <div className="schemes-header">

                <div>
                    <p className="schemes-subtitle">
                        Department Administration
                    </p>

                    <h1>
                        Manage Schemes
                    </h1>

                    <p>
                        View, update and monitor government schemes
                        managed by your department.
                    </p>
                </div>

            </div>


            {/* ================= STATISTICS ================= */}

            <div className="scheme-stats">

                <div className="scheme-stat-card blue">

                    <div className="scheme-stat-icon">
                        📁
                    </div>

                    <div>
                        <h2>{totalSchemes}</h2>
                        <p>Total Schemes</p>
                        <span>All department schemes</span>
                    </div>

                </div>


                <div className="scheme-stat-card green">

                    <div className="scheme-stat-icon">
                        ✓
                    </div>

                    <div>
                        <h2>{activeSchemes}</h2>
                        <p>Active Schemes</p>
                        <span>Currently active</span>
                    </div>

                </div>


                <div className="scheme-stat-card red">

                    <div className="scheme-stat-icon">
                        ⏸
                    </div>

                    <div>
                        <h2>{inactiveSchemes}</h2>
                        <p>Inactive Schemes</p>
                        <span>Currently inactive</span>
                    </div>

                </div>


                <div className="scheme-stat-card purple">

                    <div className="scheme-stat-icon">
                        📄
                    </div>

                    <div>
                        <h2>{totalApplications}</h2>
                        <p>Applications</p>
                        <span>Total applications</span>
                    </div>

                </div>

            </div>


            {/* ================= TABLE SECTION ================= */}

            <section className="schemes-card">

                <div className="schemes-card-header">

                    <div>
                        <h2>Government Schemes</h2>
                        <p>
                            Manage schemes and their current status.
                        </p>
                    </div>

                </div>


                {/* ================= SEARCH ================= */}

                <div className="scheme-filters">

                    <div className="search-box">

                        <span>🔍</span>

                        <input
                            type="text"
                            placeholder="Search by scheme, ID or department..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >
                        <option value="All">
                            All Status
                        </option>

                        <option value="Active">
                            Active
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>

                    </select>

                </div>


                {/* ================= TABLE ================= */}

                <div className="table-container">

                    <table className="schemes-table">

                        <thead>

                        <tr>
                            <th>Scheme ID</th>
                            <th>Scheme</th>
                            <th>Department</th>
                            <th>Applications</th>
                            <th>Grant Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                        </thead>


                        <tbody>

                        {filteredSchemes.length > 0 ? (

                            filteredSchemes.map((scheme) => (

                                <tr key={scheme.id}>

                                    <td>
                                        <span className="scheme-id">
                                            {scheme.id}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="scheme-name">

                                            <strong>
                                                {scheme.name}
                                            </strong>

                                            <small>
                                                {scheme.category}
                                            </small>

                                        </div>
                                    </td>

                                    <td>
                                        {scheme.department}
                                    </td>

                                    <td>
                                        <strong>
                                            {scheme.applications}
                                        </strong>
                                    </td>

                                    <td>
                                        {scheme.grantAmount}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                scheme.status === "Active"
                                                    ? "status-badge active"
                                                    : "status-badge inactive"
                                            }
                                        >
                                            {scheme.status}
                                        </span>

                                    </td>

                                    <td>

                                        <div className="action-buttons">

                                            {/* VIEW */}

                                            <button
                                                type="button"
                                                className="view-btn"
                                                onClick={() =>
                                                    setSelectedScheme(scheme)
                                                }
                                            >
                                                👁 View
                                            </button>


                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={() =>
                                                    setEditScheme({
                                                        ...scheme
                                                    })
                                                }
                                            >
                                                ✏ Edit
                                            </button>


                                            {/* DEACTIVATE / ACTIVATE */}

                                            {scheme.status === "Active" ? (

                                                <button
                                                    type="button"
                                                    className="deactivate-btn"
                                                    onClick={() =>
                                                        setDeactivateScheme(
                                                            scheme
                                                        )
                                                    }
                                                >
                                                    ⏸ Deactivate
                                                </button>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="activate-btn"
                                                    onClick={() =>
                                                        activateScheme(
                                                            scheme.id
                                                        )
                                                    }
                                                >
                                                    ✓ Activate
                                                </button>

                                            )}

                                        </div>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="no-results"
                                >
                                    No schemes found.
                                </td>

                            </tr>

                        )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* ================================================= */}
            {/* VIEW MODAL */}
            {/* ================================================= */}

            {selectedScheme && (

                <div className="modal-overlay">

                    <div className="scheme-modal">

                        <div className="modal-header">

                            <div>
                                <span>
                                    Scheme Details
                                </span>

                                <h2>
                                    {selectedScheme.name}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setSelectedScheme(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="details-grid">

                            <div>
                                <label>Scheme ID</label>
                                <strong>
                                    {selectedScheme.id}
                                </strong>
                            </div>

                            <div>
                                <label>Department</label>
                                <strong>
                                    {selectedScheme.department}
                                </strong>
                            </div>

                            <div>
                                <label>Grant Amount</label>
                                <strong>
                                    {selectedScheme.grantAmount}
                                </strong>
                            </div>

                            <div>
                                <label>Applications</label>
                                <strong>
                                    {selectedScheme.applications}
                                </strong>
                            </div>

                            <div>
                                <label>Category</label>
                                <strong>
                                    {selectedScheme.category}
                                </strong>
                            </div>

                            <div>
                                <label>Application Deadline</label>
                                <strong>
                                    {selectedScheme.deadline}
                                </strong>
                            </div>

                            <div>
                                <label>Status</label>

                                <span
                                    className={
                                        selectedScheme.status === "Active"
                                            ? "status-badge active"
                                            : "status-badge inactive"
                                    }
                                >
                                    {selectedScheme.status}
                                </span>

                            </div>

                        </div>


                        <div className="modal-footer">

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() =>
                                    setSelectedScheme(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* EDIT MODAL */}
            {/* ================================================= */}

            {editScheme && (

                <div className="modal-overlay">

                    <div className="scheme-modal edit-modal">

                        <div className="modal-header">

                            <div>
                                <span>
                                    Scheme Management
                                </span>

                                <h2>
                                    Edit Scheme
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setEditScheme(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="edit-form">

                            <div className="form-group">

                                <label>
                                    Scheme Name
                                </label>

                                <input
                                    name="name"
                                    value={editScheme.name}
                                    onChange={handleEditChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Department
                                </label>

                                <input
                                    name="department"
                                    value={editScheme.department}
                                    onChange={handleEditChange}
                                />

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Grant Amount
                                    </label>

                                    <input
                                        name="grantAmount"
                                        value={editScheme.grantAmount}
                                        onChange={handleEditChange}
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Deadline
                                    </label>

                                    <input
                                        name="deadline"
                                        value={editScheme.deadline}
                                        onChange={handleEditChange}
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <input
                                    name="category"
                                    value={editScheme.category}
                                    onChange={handleEditChange}
                                />

                            </div>

                        </div>


                        <div className="modal-footer">

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() =>
                                    setEditScheme(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="save-btn"
                                onClick={saveEditedScheme}
                            >
                                ✓ Save Changes
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* DEACTIVATE MODAL */}
            {/* ================================================= */}

            {deactivateScheme && (

                <div className="modal-overlay">

                    <div className="scheme-modal confirmation-modal">

                        <div className="warning-icon">
                            ⏸
                        </div>

                        <h2>
                            Deactivate Scheme?
                        </h2>

                        <p>
                            Are you sure you want to deactivate
                            <strong>
                                {" "}{deactivateScheme.name}
                            </strong>
                            ?
                        </p>

                        <p className="warning-text">
                            New applications will no longer be accepted
                            while this scheme is inactive.
                        </p>


                        <div className="modal-footer">

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() =>
                                    setDeactivateScheme(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="danger-confirm-btn"
                                onClick={confirmDeactivate}
                            >
                                Deactivate
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ManageSchemes;