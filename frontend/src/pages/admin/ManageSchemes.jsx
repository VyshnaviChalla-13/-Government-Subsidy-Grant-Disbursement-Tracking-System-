import React, { useState, useEffect } from "react";
import "./ManageSchemes.css";
import { getAllSchemes, updateScheme, deleteScheme } from "../../api/schemeApi";
import { useNavigate } from "react-router-dom";

function formatCurrency(val) {
    if (val == null) return "₹0";
    return `₹${Number(val).toLocaleString("en-IN")}`;
}

function ManageSchemes() {
    const navigate = useNavigate();
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedScheme, setSelectedScheme] = useState(null);
    const [editScheme, setEditScheme] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadSchemes = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAllSchemes();
            setSchemes(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load schemes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSchemes();
    }, []);

    const filteredSchemes = schemes.filter((scheme) => {
        const name = (scheme.schemeName || "").toLowerCase();
        const dept = (scheme.department?.departmentName || "").toLowerCase();
        const idStr = String(scheme.schemeId || "");
        const q = search.toLowerCase();

        const matchesSearch = !search || name.includes(q) || dept.includes(q) || idStr.includes(q);
        const matchesStatus = statusFilter === "All" || (scheme.status || "ACTIVE") === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditScheme({
            ...editScheme,
            [name]: value,
        });
    };

    const saveEditedScheme = async () => {
        if (!editScheme) return;
        setSubmitting(true);
        try {
            await updateScheme(editScheme.schemeId, editScheme);
            alert("Scheme updated successfully!");
            setEditScheme(null);
            await loadSchemes();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Update failed");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleSchemeStatus = async (scheme) => {
        const newStatus = scheme.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        try {
            await updateScheme(scheme.schemeId, {
                ...scheme,
                status: newStatus,
            });
            await loadSchemes();
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to toggle status");
        }
    };

    const handleDelete = async (schemeId) => {
        if (!window.confirm("Are you sure you want to delete this scheme?")) return;
        try {
            await deleteScheme(schemeId);
            await loadSchemes();
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to delete scheme");
        }
    };

    return (
        <div className="manage-schemes-container">
            {/* Header */}
            <div className="manage-header">
                <div>
                    <h1>Manage Government Schemes</h1>
                    <p>Track, modify, and manage all welfare schemes created under the department.</p>
                </div>

                <button
                    className="add-scheme-btn"
                    onClick={() => navigate("/departmentadmin/schemes/create")}
                >
                    + Create New Scheme
                </button>
            </div>

            {/* Filters */}
            <div className="filters-card">
                <input
                    type="text"
                    placeholder="Search by Scheme Name, ID, or Department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                </select>
            </div>

            {loading && <p style={{ padding: "20px" }}>Loading schemes...</p>}
            {error && <div className="alert alert-danger" style={{ margin: "20px" }}>{error}</div>}

            {/* Schemes Table */}
            {!loading && !error && (
                <div className="schemes-table-card">
                    <table className="schemes-table">
                        <thead>
                            <tr>
                                <th>Scheme ID</th>
                                <th>Scheme Name</th>
                                <th>Department</th>
                                <th>Max Grant</th>
                                <th>Total Budget</th>
                                <th>Deadline</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredSchemes.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                                        No schemes found.
                                    </td>
                                </tr>
                            ) : (
                                filteredSchemes.map((scheme) => (
                                    <tr key={scheme.schemeId}>
                                        <td><strong>SCH-{scheme.schemeId}</strong></td>
                                        <td><strong>{scheme.schemeName}</strong></td>
                                        <td>{scheme.department?.departmentName || "General"}</td>
                                        <td>{formatCurrency(scheme.maxGrant)}</td>
                                        <td>{formatCurrency(scheme.totalBudget)}</td>
                                        <td>{scheme.applicationEndDate || "-"}</td>
                                        <td>
                                            <span className={scheme.status === "ACTIVE" ? "status-active" : "status-inactive"}>
                                                {scheme.status || "ACTIVE"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn view"
                                                onClick={() => setSelectedScheme(scheme)}
                                            >
                                                👁 View
                                            </button>
                                            <button
                                                className="action-btn edit"
                                                onClick={() => setEditScheme({ ...scheme })}
                                            >
                                                ✏ Edit
                                            </button>
                                            <button
                                                className="action-btn toggle"
                                                onClick={() => toggleSchemeStatus(scheme)}
                                            >
                                                {scheme.status === "ACTIVE" ? "Deactivate" : "Activate"}
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(scheme.schemeId)}
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* View Modal */}
            {selectedScheme && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>{selectedScheme.schemeName}</h2>
                        <div className="details-grid">
                            <div><strong>Scheme ID:</strong> SCH-{selectedScheme.schemeId}</div>
                            <div><strong>Department:</strong> {selectedScheme.department?.departmentName || "-"}</div>
                            <div><strong>Total Budget:</strong> {formatCurrency(selectedScheme.totalBudget)}</div>
                            <div><strong>Min Grant:</strong> {formatCurrency(selectedScheme.minGrant)}</div>
                            <div><strong>Max Grant:</strong> {formatCurrency(selectedScheme.maxGrant)}</div>
                            <div><strong>Start Date:</strong> {selectedScheme.applicationStartDate || "-"}</div>
                            <div><strong>End Date:</strong> {selectedScheme.applicationEndDate || "-"}</div>
                            <div><strong>Eligibility Score:</strong> {selectedScheme.eligibilityScore || 50}</div>
                            <div><strong>Status:</strong> {selectedScheme.status}</div>
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <strong>Description:</strong>
                            <p>{selectedScheme.description || "No description provided."}</p>
                        </div>
                        <button className="close-btn" onClick={() => setSelectedScheme(null)}>Close</button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editScheme && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Edit Scheme: {editScheme.schemeName}</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                            <div>
                                <label>Scheme Name</label>
                                <input
                                    type="text"
                                    name="schemeName"
                                    value={editScheme.schemeName || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <label>Total Budget (₹)</label>
                                <input
                                    type="number"
                                    name="totalBudget"
                                    value={editScheme.totalBudget || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <label>Min Grant (₹)</label>
                                <input
                                    type="number"
                                    name="minGrant"
                                    value={editScheme.minGrant || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <label>Max Grant (₹)</label>
                                <input
                                    type="number"
                                    name="maxGrant"
                                    value={editScheme.maxGrant || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <label>End Date</label>
                                <input
                                    type="date"
                                    name="applicationEndDate"
                                    value={editScheme.applicationEndDate || ""}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={editScheme.status || "ACTIVE"}
                                    onChange={handleEditChange}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={editScheme.description || ""}
                                onChange={handleEditChange}
                                rows="3"
                            />
                        </div>
                        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                            <button
                                className="save-btn"
                                disabled={submitting}
                                onClick={saveEditedScheme}
                            >
                                {submitting ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                className="close-btn"
                                onClick={() => setEditScheme(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageSchemes;