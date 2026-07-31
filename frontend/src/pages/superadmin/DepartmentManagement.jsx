import { useState } from "react";
import "./DepartmentManagement.css";

function DepartmentManagement() {

    const [departments, setDepartments] = useState([
        {
            id: "DEP001",
            name: "Agriculture",
            admin: "Ramesh Kumar",
            officers: 5,
            schemes: 1,
            status: "Active",
        },
        {
            id: "DEP002",
            name: "Education",
            admin: "Lakshmi Devi",
            officers: 4,
            schemes: 1,
            status: "Active",
        },
        {
            id: "DEP003",
            name: "Housing",
            admin: "Srinivas Rao",
            officers: 3,
            schemes: 1,
            status: "Active",
        },
        {
            id: "DEP004",
            name: "Social Welfare",
            admin: "Anitha Sharma",
            officers: 4,
            schemes: 1,
            status: "Active",
        },
    ]);

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [departmentName, setDepartmentName] = useState("");

    const [departmentDescription, setDepartmentDescription] = useState("");

    const [departmentStatus, setDepartmentStatus] = useState("Active");

    const filteredDepartments = departments.filter(
        (dept) =>
            dept.name.toLowerCase().includes(search.toLowerCase()) ||
            dept.admin.toLowerCase().includes(search.toLowerCase())
    );

    const addDepartment = () => {

        if (!departmentName.trim()) {
            alert("Please enter Department Name.");
            return;
        }

        const newDepartment = {
            id: `DEP00${departments.length + 1}`,
            name: departmentName,
            admin: departmentDescription,
            officers: 0,
            schemes: 0,
            status: departmentStatus,
        };

        setDepartments([...departments, newDepartment]);

        setDepartmentName("");
        setDepartmentDescription("");
        setDepartmentStatus("Active");

        setShowForm(false);
    };

    const toggleStatus = (id) => {

        setDepartments(
            departments.map((dept) =>
                dept.id === id
                    ? {
                        ...dept,
                        status:
                            dept.status === "Active"
                                ? "Disabled"
                                : "Active",
                    }
                    : dept
            )
        );

    };

    const editDepartment = (id) => {

        const department = departments.find((d) => d.id === id);

        const updatedName = prompt(
            "Department Name",
            department.name
        );

        if (!updatedName) return;

        const updatedAdmin = prompt(
            "Department Admin",
            department.admin
        );

        if (!updatedAdmin) return;

        setDepartments(
            departments.map((dept) =>
                dept.id === id
                    ? {
                        ...dept,
                        name: updatedName,
                        admin: updatedAdmin,
                    }
                    : dept
            )
        );

    };

    return (

        <div className="container py-5">

            <h2 className="text-primary mb-4">
                Department Management
            </h2>

            <div className="card shadow p-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h4>Departments</h4>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Department
                    </button>

                </div>

                <div className="mb-4">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Department or Admin..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <table className="table table-hover">

                    <thead className="table-primary">

                    <tr>

                        <th>ID</th>
                        <th>Department</th>
                        <th>Department Admin</th>
                        <th>Officers</th>
                        <th>Schemes</th>
                        <th>Status</th>
                        <th>Actions</th>

                    </tr>

                    </thead>

                    <tbody>

                    {filteredDepartments.map((dept) => (

                        <tr key={dept.id}>

                            <td>{dept.id}</td>

                            <td>{dept.name}</td>

                            <td>{dept.admin}</td>

                            <td>{dept.officers}</td>

                            <td>{dept.schemes}</td>

                            <td>

                                    <span
                                        className={`badge ${
                                            dept.status === "Active"
                                                ? "bg-success"
                                                : "bg-danger"
                                        }`}
                                    >
                                        {dept.status}
                                    </span>

                            </td>

                            <td>

                                <button
                                    className="btn btn-outline-primary btn-sm me-2"
                                    onClick={() =>
                                        editDepartment(dept.id)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={() =>
                                        toggleStatus(dept.id)
                                    }
                                >
                                    {dept.status === "Active"
                                        ? "Disable"
                                        : "Enable"}
                                </button>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>
            {showForm && (

                <div className="modal-overlay">

                    <div className="department-modal">

                        <h3>Create Department</h3>

                        <input
                            type="text"
                            placeholder="Department Name"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                        />

                        <textarea
                            placeholder="Department Description"
                            value={departmentDescription}
                            onChange={(e) => setDepartmentDescription(e.target.value)}
                            rows="4"
                        />

                        <select
                            value={departmentStatus}
                            onChange={(e) => setDepartmentStatus(e.target.value)}
                        >
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>

                        <div className="modal-buttons">

                            <button
                                className="btn btn-success"
                                onClick={addDepartment}
                            >
                                Save
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowForm(false)}
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

export default DepartmentManagement;