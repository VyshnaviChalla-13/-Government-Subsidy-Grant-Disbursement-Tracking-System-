import { useState, useEffect } from "react";
import "./DepartmentManagement.css";
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../../api/departmentApi";

function DepartmentManagement() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingDeptId, setEditingDeptId] = useState(null);

    const [departmentName, setDepartmentName] = useState("");
    const [departmentDescription, setDepartmentDescription] = useState("");
    const [departmentStatus, setDepartmentStatus] = useState("ACTIVE");
    const [submitting, setSubmitting] = useState(false);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAllDepartments();
            setDepartments(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load departments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const filteredDepartments = departments.filter((dept) => {
        const name = (dept.departmentName || "").toLowerCase();
        const desc = (dept.description || "").toLowerCase();
        const q = search.toLowerCase();
        return !search || name.includes(q) || desc.includes(q);
    });

    const handleSubmitDepartment = async () => {
        if (!departmentName.trim()) {
            alert("Please enter Department Name.");
            return;
        }

        setSubmitting(true);
        try {
            if (editingDeptId) {
                await updateDepartment(editingDeptId, {
                    departmentName,
                    description: departmentDescription,
                    status: departmentStatus,
                });
                alert("Department updated successfully!");
            } else {
                await createDepartment({
                    departmentName,
                    description: departmentDescription,
                    status: departmentStatus,
                });
                alert("Department created successfully!");
            }

            setDepartmentName("");
            setDepartmentDescription("");
            setDepartmentStatus("ACTIVE");
            setEditingDeptId(null);
            setShowForm(false);
            await loadDepartments();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = async (dept) => {
        const newStatus = dept.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
        try {
            await updateDepartment(dept.departmentId, {
                ...dept,
                status: newStatus,
            });
            await loadDepartments();
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to toggle status");
        }
    };

    const editDepartment = (dept) => {
        setEditingDeptId(dept.departmentId);
        setDepartmentName(dept.departmentName || "");
        setDepartmentDescription(dept.description || "");
        setDepartmentStatus(dept.status || "ACTIVE");
        setShowForm(true);
    };

    const handleDelete = async (deptId) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return;
        try {
            await deleteDepartment(deptId);
            await loadDepartments();
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to delete department");
        }
    };

    return (
        <div className="department-management">
            <div className="topbar">
                <h1>Department Management</h1>
                <div className="admin-name">Super Admin</div>
            </div>

            <p className="welcome">
                Manage government departments, assign admins, and monitor officer allocations.
            </p>

            {/* Department Summary Cards */}
            <div className="dashboard-cards">
                <div className="card">
                    <h3>Total Departments</h3>
                    <p>{departments.length}</p>
                </div>
                <div className="card">
                    <h3>Active Departments</h3>
                    <p>{departments.filter((d) => d.status === "ACTIVE").length}</p>
                </div>
                <div className="card">
                    <h3>Disabled Departments</h3>
                    <p>{departments.filter((d) => d.status !== "ACTIVE").length}</p>
                </div>
            </div>

            {/* Filter and Add Button Section */}
            <div className="filter-section">
                <input
                    type="text"
                    placeholder="Search Department Name or Description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    className="add-btn"
                    onClick={() => {
                        setEditingDeptId(null);
                        setDepartmentName("");
                        setDepartmentDescription("");
                        setDepartmentStatus("ACTIVE");
                        setShowForm(true);
                    }}
                >
                    + Add Department
                </button>
            </div>

            {/* Form Section */}
            {showForm && (
                <div className="form-card">
                    <h3>{editingDeptId ? "Edit Department" : "Add New Department"}</h3>

                    <input
                        type="text"
                        placeholder="Department Name"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                    />

                    <textarea
                        placeholder="Department Description / Mission"
                        value={departmentDescription}
                        onChange={(e) => setDepartmentDescription(e.target.value)}
                        rows="3"
                    />

                    <select
                        value={departmentStatus}
                        onChange={(e) => setDepartmentStatus(e.target.value)}
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DISABLED">DISABLED</option>
                    </select>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                            className="save-btn"
                            disabled={submitting}
                            onClick={handleSubmitDepartment}
                        >
                            {submitting ? "Saving..." : editingDeptId ? "Update Department" : "Save Department"}
                        </button>
                        <button
                            className="close-btn"
                            onClick={() => {
                                setShowForm(false);
                                setEditingDeptId(null);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {loading && <p style={{ padding: "20px" }}>Loading departments...</p>}
            {error && <div className="alert alert-danger" style={{ margin: "20px" }}>{error}</div>}

            {/* Department Table */}
            {!loading && !error && (
                <table className="department-table">
                    <thead>
                        <tr>
                            <th>Department ID</th>
                            <th>Department Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredDepartments.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                                    No departments found.
                                </td>
                            </tr>
                        ) : (
                            filteredDepartments.map((dept) => (
                                <tr key={dept.departmentId}>
                                    <td>{dept.departmentId}</td>
                                    <td><strong>{dept.departmentName}</strong></td>
                                    <td>{dept.description || "-"}</td>
                                    <td>
                                        <span className={dept.status === "ACTIVE" ? "status active" : "status disabled"}>
                                            {dept.status || "ACTIVE"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => editDepartment(dept)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="toggle-btn"
                                            onClick={() => toggleStatus(dept)}
                                        >
                                            {dept.status === "ACTIVE" ? "Disable" : "Enable"}
                                        </button>
                                        <button
                                            className="delete-btn"
                                            style={{ marginLeft: "6px" }}
                                            onClick={() => handleDelete(dept.departmentId)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DepartmentManagement;