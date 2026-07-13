import "./ApplyScheme.css";

function ApplyScheme() {

    return (

        <div className="apply-page">

            <div className="container py-5">

                <h2 className="text-primary mb-3">
                    Apply for Government Scheme
                </h2>

                <p className="text-muted mb-4">
                    Complete the application form and upload the required documents.
                </p>

                <div className="apply-card">

                    <form>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your name"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Aadhaar Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="12 Digit Aadhaar"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Mobile Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter mobile number"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Annual Income
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Annual Income"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Occupation
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Occupation"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Address
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Address"
                                />

                            </div>

                        </div>

                        <hr />

                        <h4 className="mb-4">
                            Upload Documents
                        </h4>

                        <div className="row">

                            <div className="col-md-4 mb-3">

                                <label className="form-label">
                                    Aadhaar Card
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-4 mb-3">

                                <label className="form-label">
                                    Income Certificate
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-4 mb-3">

                                <label className="form-label">
                                    Bank Passbook
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                />

                            </div>

                        </div>

                        <div className="mt-4 d-flex gap-3">

                            <button
                                type="button"
                                className="btn btn-outline-primary"
                            >
                                Save Draft
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Submit Application
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default ApplyScheme;