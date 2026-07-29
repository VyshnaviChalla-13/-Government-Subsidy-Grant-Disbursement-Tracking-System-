import "./ManageSchemes.css";

function ManageSchemes() {

    const schemes = [

        {
            id: "SCH001",
            name: "Farmer Assistance Scheme",
            department: "Agriculture",
            applications: 120,
            status: "Active"
        },

        {
            id: "SCH002",
            name: "Student Scholarship Scheme",
            department: "Education",
            applications: 95,
            status: "Active"
        },

        {
            id: "SCH003",
            name: "Affordable Housing Scheme",
            department: "Housing",
            applications: 80,
            status: "Active"
        },

        {
            id: "SCH004",
            name: "Women Empowerment Scheme",
            department: "Social Welfare",
            applications: 60,
            status: "Active"
        }

    ];

    return (

        <div className="container py-5">

            <h2 className="text-primary mb-3">
                Manage Schemes
            </h2>

            <p className="text-muted mb-4">
                View and manage all government schemes.
            </p>

            <div className="card shadow p-4">

                <table className="table table-hover">

                    <thead className="table-primary">

                    <tr>

                        <th>Scheme ID</th>
                        <th>Scheme Name</th>
                        <th>Department</th>
                        <th>Applications</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                    </thead>

                    <tbody>

                    {schemes.map((scheme) => (

                        <tr key={scheme.id}>

                            <td>{scheme.id}</td>

                            <td>{scheme.name}</td>

                            <td>{scheme.department}</td>

                            <td>{scheme.applications}</td>

                            <td>{scheme.status}</td>

                            <td>

                                <button className="btn btn-sm btn-primary me-2">

                                    View

                                </button>

                                <button className="btn btn-sm btn-warning text-white me-2">

                                    Edit

                                </button>

                                <button className="btn btn-sm btn-danger">

                                    Deactivate

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

export default ManageSchemes;