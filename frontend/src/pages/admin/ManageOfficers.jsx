import React, { useState } from "react";
import "./ManageOfficers.css";

function ManageOfficers() {

    const [officers, setOfficers] = useState([
        {
            id: "OFF001",
            name: "Rajesh Kumar",
            role: "Field Officer",
            department: "Agriculture",
            region: "Chittoor",
            email: "rajesh.kumar@gov.in",
            phone: "9876543210",
            status: "Active"
        },
        {
            id: "OFF002",
            name: "Anjali Sharma",
            role: "District Officer",
            department: "Education",
            region: "Tirupati",
            email: "anjali.sharma@gov.in",
            phone: "9876543211",
            status: "Active"
        },
        {
            id: "OFF003",
            name: "Suresh Reddy",
            role: "Field Officer",
            department: "Housing",
            region: "Nellore",
            email: "suresh.reddy@gov.in",
            phone: "9876543212",
            status: "Active"
        },
        {
            id: "OFF004",
            name: "Priya Nair",
            role: "District Officer",
            department: "Social Welfare",
            region: "Salem",
            email: "priya.nair@gov.in",
            phone: "9876543213",
            status: "Active"
        }
    ]);

    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // ---------------- VIEW ----------------
    const handleView = (officer) => {
        setSelectedOfficer(officer);
        setViewMode(true);
        setEditMode(false);
    };

    // ---------------- EDIT ----------------
    const handleEdit = (officer) => {
        setSelectedOfficer({ ...officer });
        setEditMode(true);
        setViewMode(false);
    };

    // ---------------- SAVE EDIT ----------------
    const handleSave = () => {

        setOfficers(
            officers.map((officer) =>
                officer.id === selectedOfficer.id
                    ? selectedOfficer
                    : officer
            )
        );

        setSelectedOfficer(null);
        setEditMode(false);
    };

    // ---------------- DISABLE / ENABLE ----------------
    const handleToggleStatus = (id) => {

        setOfficers(
            officers.map((officer) =>
                officer.id === id
                    ? {
                        ...officer,
                        status:
                            officer.status === "Active"
                                ? "Disabled"
                                : "Active"
                    }
                    : officer
            )
        );
    };

    return (

        <div className="officers-page">

            {/* Header */}
            <div className="officers-header">

                <div>
                    <p className="page-subtitle">
                        Department Administration
                    </p>

                    <h1>Manage Officers</h1>

                    <p>
                        View, update and manage Field Officers and District Officers.
                    </p>
                </div>

                <div className="officer-count">
                    <span>👥</span>
                    <div>
                        <strong>{officers.length}</strong>
                        <small>Total Officers</small>
                    </div>
                </div>

            </div>


            {/* Officer Table */}
            <div className="officers-card">

                <div className="table-header">

                    <div>
                        <h2>Department Officers</h2>
                        <p>
                            Manage officers assigned to your department.
                        </p>
                    </div>

                </div>


                <div className="table-wrapper">

                    <table className="officers-table">

                        <thead>

                        <tr>
                            <th>Officer ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Region</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                        </thead>


                        <tbody>

                        {officers.map((officer) => (

                            <tr key={officer.id}>

                                <td>
                                    <strong className="officer-id">
                                        {officer.id}
                                    </strong>
                                </td>

                                <td>
                                    <div className="name-cell">
                                        <div className="avatar">
                                            {officer.name.charAt(0)}
                                        </div>

                                        <strong>
                                            {officer.name}
                                        </strong>
                                    </div>
                                </td>

                                <td>
                                    <span className="role-badge">
                                        {officer.role}
                                    </span>
                                </td>

                                <td>
                                    {officer.department}
                                </td>

                                <td>
                                    {officer.region}
                                </td>

                                <td>

                                    <span
                                        className={
                                            officer.status === "Active"
                                                ? "status-badge active"
                                                : "status-badge disabled"
                                        }
                                    >
                                        {officer.status}
                                    </span>

                                </td>


                                <td>

                                    <div className="action-buttons">

                                        {/* View */}
                                        <button
                                            className="action-btn view"
                                            onClick={() =>
                                                handleView(officer)
                                            }
                                        >
                                            👁 View
                                        </button>


                                        {/* Edit */}
                                        <button
                                            className="action-btn edit"
                                            onClick={() =>
                                                handleEdit(officer)
                                            }
                                        >
                                            ✏ Edit
                                        </button>


                                        {/* Disable / Enable */}
                                        <button
                                            className={
                                                officer.status === "Active"
                                                    ? "action-btn disable"
                                                    : "action-btn enable"
                                            }
                                            onClick={() =>
                                                handleToggleStatus(officer.id)
                                            }
                                        >
                                            {officer.status === "Active"
                                                ? "⛔ Disable"
                                                : "✓ Enable"}
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ================= VIEW MODAL ================= */}

            {viewMode && selectedOfficer && (

                <div className="modal-overlay">

                    <div className="officer-modal">

                        <div className="modal-header">

                            <div>
                                <h2>Officer Details</h2>
                                <p>
                                    Complete information about the officer
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => {
                                    setViewMode(false);
                                    setSelectedOfficer(null);
                                }}
                            >
                                ×
                            </button>

                        </div>


                        <div className="profile-section">

                            <div className="large-avatar">
                                {selectedOfficer.name.charAt(0)}
                            </div>

                            <div>
                                <h3>{selectedOfficer.name}</h3>

                                <span className="role-badge">
                                    {selectedOfficer.role}
                                </span>
                            </div>

                        </div>


                        <div className="details-grid">

                            <div>
                                <label>Officer ID</label>
                                <strong>{selectedOfficer.id}</strong>
                            </div>

                            <div>
                                <label>Department</label>
                                <strong>{selectedOfficer.department}</strong>
                            </div>

                            <div>
                                <label>Region</label>
                                <strong>{selectedOfficer.region}</strong>
                            </div>

                            <div>
                                <label>Status</label>
                                <strong>{selectedOfficer.status}</strong>
                            </div>

                            <div>
                                <label>Email</label>
                                <strong>{selectedOfficer.email}</strong>
                            </div>

                            <div>
                                <label>Phone</label>
                                <strong>{selectedOfficer.phone}</strong>
                            </div>

                        </div>


                        <div className="modal-footer">

                            <button
                                className="close-btn"
                                onClick={() => {
                                    setViewMode(false);
                                    setSelectedOfficer(null);
                                }}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ================= EDIT MODAL ================= */}

            {editMode && selectedOfficer && (

                <div className="modal-overlay">

                    <div className="officer-modal">

                        <div className="modal-header">

                            <div>
                                <h2>Edit Officer</h2>
                                <p>
                                    Update officer information
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => {
                                    setEditMode(false);
                                    setSelectedOfficer(null);
                                }}
                            >
                                ×
                            </button>

                        </div>


                        <div className="edit-form">

                            <div className="form-group">

                                <label>Officer Name</label>

                                <input
                                    type="text"
                                    value={selectedOfficer.name}
                                    onChange={(e) =>
                                        setSelectedOfficer({
                                            ...selectedOfficer,
                                            name: e.target.value
                                        })
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>Role</label>

                                <select
                                    value={selectedOfficer.role}
                                    onChange={(e) =>
                                        setSelectedOfficer({
                                            ...selectedOfficer,
                                            role: e.target.value
                                        })
                                    }
                                >
                                    <option>Field Officer</option>
                                    <option>District Officer</option>
                                </select>

                            </div>


                            <div className="form-group">

                                <label>Department</label>

                                <select
                                    value={selectedOfficer.department}
                                    onChange={(e) =>
                                        setSelectedOfficer({
                                            ...selectedOfficer,
                                            department: e.target.value
                                        })
                                    }
                                >
                                    <option>Agriculture</option>
                                    <option>Education</option>
                                    <option>Housing</option>
                                    <option>Social Welfare</option>
                                </select>

                            </div>


                            <div className="form-group">

                                <label>Region</label>

                                <input
                                    type="text"
                                    value={selectedOfficer.region}
                                    onChange={(e) =>
                                        setSelectedOfficer({
                                            ...selectedOfficer,
                                            region: e.target.value
                                        })
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>Email</label>

                                <input
                                    type="email"
                                    value={selectedOfficer.email}
                                    onChange={(e) =>
                                        setSelectedOfficer({
                                            ...selectedOfficer,
                                            email: e.target.value
                                        })
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>Phone</label>

                                <input
                                    type="text"
                                    value={selectedOfficer.phone}
                                    onChange={(e) =>
                                        setSelectedOfficer({
                                            ...selectedOfficer,
                                            phone: e.target.value
                                        })
                                    }
                                />

                            </div>

                        </div>


                        <div className="modal-footer">

                            <button
                                className="cancel-btn"
                                onClick={() => {
                                    setEditMode(false);
                                    setSelectedOfficer(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="save-btn"
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ManageOfficers;