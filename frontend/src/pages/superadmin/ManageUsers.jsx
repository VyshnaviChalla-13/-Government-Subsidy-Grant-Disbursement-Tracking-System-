import { useState, useEffect } from "react";
import "./ManageUsers.css";
import { getAllUsers, updateUserById, deleteUser } from "../../api/userApi";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const name = (user.fullName || "").toLowerCase();
        const role = (user.role || "").toLowerCase();
        const mobile = (user.mobileNumber || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const q = search.toLowerCase();

        return !search || name.includes(q) || role.includes(q) || mobile.includes(q) || email.includes(q);
    });

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditFormData({
            fullName: user.fullName || "",
            email: user.email || "",
            mobileNumber: user.mobileNumber || "",
            role: user.role || "ROLE_BENEFICIARY",
            address: user.address || "",
            occupation: user.occupation || "",
            category: user.category || "",
            bankName: user.bankName || "",
            accountNumber: user.accountNumber || "",
            ifscCode: user.ifscCode || "",
        });
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        setSubmitting(true);
        try {
            await updateUserById(editingUser.userId, editFormData);
            alert("User updated successfully!");
            setEditingUser(null);
            await loadUsers();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Update failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(userId);
            await loadUsers();
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to delete user.");
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-primary mb-4">Manage Users</h2>

            <div className="card shadow p-4">
                <input
                    type="text"
                    className="form-control mb-4"
                    placeholder="Search User by Name, Role, Mobile, or Email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {loading && <p>Loading users...</p>}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Edit Modal */}
                {editingUser && (
                    <div style={{ background: "#f1f5f9", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
                        <h4>Edit User: {editingUser.fullName} (ID: {editingUser.userId})</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                            <div>
                                <label style={{ fontWeight: 600 }}>Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editFormData.fullName}
                                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 600 }}>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 600 }}>Mobile Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editFormData.mobileNumber}
                                    onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 600 }}>Occupation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editFormData.occupation}
                                    onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                            <button
                                className="btn btn-success btn-sm"
                                disabled={submitting}
                                onClick={handleSaveEdit}
                            >
                                {submitting ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <table className="table table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.userId}>
                                        <td>{user.userId}</td>
                                        <td><strong>{user.fullName}</strong></td>
                                        <td>
                                            <span className="badge bg-primary">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.mobileNumber}</td>
                                        <td>{user.email || "-"}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-primary btn-sm me-2"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDeleteUser(user.userId)}
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
        </div>
    );
}

export default ManageUsers;