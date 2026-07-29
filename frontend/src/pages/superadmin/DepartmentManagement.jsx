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

    const filteredDepartments = departments.filter(
        (dept) =>
            dept.name.toLowerCase().includes(search.toLowerCase()) ||
            dept.admin.toLowerCase().includes(search.toLowerCase())
    );

    const addDepartment = () => {

        const name = prompt("Department Name");
        if (!name) return;

        const admin = prompt("Department Admin");
        if (!admin) return;

        const newDepartment = {
            id: `DEP00${departments.length + 1}`,
            name,
            admin,
            officers: 0,
            schemes: 0,
            status: "Active",
        };

        setDepartments([...departments, newDepartment]);

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
                        onClick={addDepartment}
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

        </div>

    );

}

export default DepartmentManagement;