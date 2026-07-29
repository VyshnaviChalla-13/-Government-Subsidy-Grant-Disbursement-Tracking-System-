import "./ManageOfficers.css";

function ManageOfficers() {

    const officers = [

        {
            id: "OFF001",
            name: "Rajesh Kumar",
            role: "Field Officer",
            department: "Agriculture",
            region: "Chittoor",
            status: "Active"
        },

        {
            id: "OFF002",
            name: "Anjali Sharma",
            role: "District Officer",
            department: "Education",
            region: "Tirupati",
            status: "Active"
        },

        {
            id: "OFF003",
            name: "Suresh Reddy",
            role: "Field Officer",
            department: "Housing",
            region: "Nellore",
            status: "Active"
        },

        {
            id: "OFF004",
            name: "Priya Nair",
            role: "District Officer",
            department: "Social Welfare",
            region: "Salem",
            status: "Active"
        }

    ];

    return (

        <div className="container py-5">

            <h2 className="text-primary mb-3">
                Manage Officers
            </h2>

            <p className="text-muted mb-4">
                View and manage Field Officers and District Officers.
            </p>

            <div className="card shadow p-4">

                <table className="table table-hover">

                    <thead className="table-primary">

                    <tr>

                        <th>Officer ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Region</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                    </thead>

                    <tbody>

                    {officers.map((officer) => (

                        <tr key={officer.id}>

                            <td>{officer.id}</td>
                            <td>{officer.name}</td>
                            <td>{officer.role}</td>
                            <td>{officer.department}</td>
                            <td>{officer.region}</td>
                            <td>{officer.status}</td>

                            <td>

                                <button className="btn btn-sm btn-primary me-2">
                                    View
                                </button>

                                <button className="btn btn-sm btn-warning text-white me-2">
                                    Edit
                                </button>

                                <button className="btn btn-sm btn-danger">
                                    Disable
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

export default ManageOfficers;