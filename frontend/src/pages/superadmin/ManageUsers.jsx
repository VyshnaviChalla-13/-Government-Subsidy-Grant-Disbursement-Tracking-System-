import { useState } from "react";
import "./ManageUsers.css";

function ManageUsers() {

    const [users, setUsers] = useState([
        {
            id: "USR001",
            name: "Rahul Kumar",
            role: "Beneficiary",
            department: "-",
            status: "Active",
        },
        {
            id: "USR002",
            name: "Ramesh Kumar",
            role: "Front Desk Officer",
            department: "Agriculture",
            status: "Active",
        },
        {
            id: "USR003",
            name: "Lakshmi Devi",
            role: "Department Admin",
            department: "Education",
            status: "Active",
        },
        {
            id: "USR004",
            name: "Srinivas Rao",
            role: "Finance Officer",
            department: "Housing",
            status: "Disabled",
        },
    ]);

    const [search, setSearch] = useState("");

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.role.toLowerCase().includes(search.toLowerCase())
    );

    const toggleStatus = (id) => {
        setUsers(
            users.map((user) =>
                user.id === id
                    ? {
                        ...user,
                        status:
                            user.status === "Active"
                                ? "Disabled"
                                : "Active",
                    }
                    : user
            )
        );
    };

    return (
        <div className="container py-5">

            <h2 className="text-primary mb-4">
                Manage Users
            </h2>

            <div className="card shadow p-4">

                <input
                    type="text"
                    className="form-control mb-4"
                    placeholder="Search User..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table className="table table-hover">

                    <thead className="table-primary">

                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>

                    </thead>

                    <tbody>

                    {filteredUsers.map((user) => (

                        <tr key={user.id}>

                            <td>{user.id}</td>

                            <td>{user.name}</td>

                            <td>{user.role}</td>

                            <td>{user.department}</td>

                            <td>
                                    <span
                                        className={`badge ${
                                            user.status === "Active"
                                                ? "bg-success"
                                                : "bg-danger"
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                            </td>

                            <td>

                                <button className="btn btn-outline-primary btn-sm me-2">
                                    Edit
                                </button>

                                <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={() => toggleStatus(user.id)}
                                >
                                    {user.status === "Active"
                                        ? "Disable"
                                        : "Enable"}
                                </button>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default ManageUsers;