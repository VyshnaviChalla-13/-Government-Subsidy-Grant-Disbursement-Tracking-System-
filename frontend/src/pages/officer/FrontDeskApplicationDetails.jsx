import { useLocation, useNavigate } from "react-router-dom";

function FrontDeskApplicationDetails() {

    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="container py-5">
                <h3>No application selected.</h3>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/officer/frontdesk")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (

        <div className="container py-5">

            <h2 className="mb-4 text-primary">
                Application Details
            </h2>

            <div className="card shadow p-4">

                <h4 className="mb-3">
                    Application Information
                </h4>

                <hr />

                <div className="row">

                    <div className="col-md-6">
                        <strong>Application ID</strong>
                        <p>{state.id}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Scheme</strong>
                        <p>{state.scheme}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Department</strong>
                        <p>{state.department}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Submitted Date</strong>
                        <p>{state.submittedDate}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Status</strong>
                        <p>{state.status}</p>
                    </div>

                </div>

                <hr />

                <h4 className="mb-3">
                    Personal Details
                </h4>

                <div className="row">

                    <div className="col-md-6">
                        <strong>Full Name</strong>
                        <p>{state.applicant}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Aadhaar Number</strong>
                        <p>{state.aadhaar}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Mobile Number</strong>
                        <p>{state.mobile}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Annual Income</strong>
                        <p>{state.income}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Occupation</strong>
                        <p>{state.occupation}</p>
                    </div>

                    <div className="col-md-6">
                        <strong>Address</strong>
                        <p>{state.address}</p>
                    </div>

                </div>

                <hr />

                <h4 className="mb-3">
                    Uploaded Documents
                </h4>

                <div className="document-list">

                    <div className="document-item">
                        <span>✅ Aadhaar Card</span>

                        <button
                            className="btn btn-outline-primary btn-sm view-document-btn"
                            onClick={() => alert("Document preview will be available after backend integration.")}
                        >
                            👁 View
                        </button>
                    </div>

                    <div className="document-item">
                        <span>✅ Income Certificate</span>

                        <button
                            className="btn btn-outline-primary btn-sm view-document-btn"
                            onClick={() => alert("Document preview will be available after backend integration.")}
                        >
                            👁 View
                        </button>
                    </div>

                    <div className="document-item">
                        <span>✅ Bank Passbook</span>

                        <button
                            className="btn btn-outline-primary btn-sm view-document-btn"
                            onClick={() => alert("Document preview will be available after backend integration.")}
                        >
                            👁 View
                        </button>
                    </div>

                </div>
                <hr />

                <div className="d-flex gap-3">

                    <button className="btn btn-success">
                        Forward
                    </button>

                    <button className="btn btn-warning text-white">
                        Return
                    </button>

                    <button className="btn btn-danger">
                        Reject
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/officer/frontdesk")}
                    >
                        Back
                    </button>

                </div>

            </div>

        </div>

    );

}

export default FrontDeskApplicationDetails;