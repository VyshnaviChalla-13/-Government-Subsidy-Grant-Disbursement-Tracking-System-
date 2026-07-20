import "./CreateScheme.css";

function CreateScheme() {

    return (

        <div className="container py-5">

            <h2 className="text-primary mb-3">
                Create Government Scheme
            </h2>

            <p className="text-muted mb-4">
                Configure a new government scheme for beneficiaries.
            </p>

            <div className="card shadow p-4">

                <form>

                    <h4 className="mb-4">
                        Basic Information
                    </h4>

                    <div className="row">

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Scheme Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Scheme Name"
                            />

                        </div>

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Department
                            </label>

                            <select className="form-select">

                                <option>Agriculture</option>

                                <option>Education</option>

                                <option>Housing</option>

                                <option>Social Welfare</option>

                            </select>

                        </div>

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Grant Amount
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                placeholder="Grant Amount"
                            />

                        </div>

                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                Last Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                            />

                        </div>

                    </div>

                    <hr />

                    <h4 className="mb-4">
                        Eligibility Rules
                    </h4>

                    <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Enter eligibility rules..."
                    ></textarea>

                    <hr />

                    <h4 className="mb-4">
                        Required Documents
                    </h4>

                    <div className="form-check">

                        <input
                            className="form-check-input"
                            type="checkbox"
                        />

                        <label className="form-check-label">
                            Aadhaar Card
                        </label>

                    </div>

                    <div className="form-check">

                        <input
                            className="form-check-input"
                            type="checkbox"
                        />

                        <label className="form-check-label">
                            Income Certificate
                        </label>

                    </div>

                    <div className="form-check">

                        <input
                            className="form-check-input"
                            type="checkbox"
                        />

                        <label className="form-check-label">
                            Bank Passbook
                        </label>

                    </div>

                    <hr />

                    <h4 className="mb-4">
                        Milestone Plan
                    </h4>

                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Describe approval workflow..."
                    ></textarea>

                    <hr />

                    <h4 className="mb-4">
                        Regional Budget Allocation
                    </h4>

                    <input
                        type="number"
                        className="form-control"
                        placeholder="Budget Amount"
                    />

                    <div className="mt-4">

                        <button
                            className="btn btn-success me-3"
                            type="button"
                        >
                            Save Draft
                        </button>

                        <button
                            className="btn btn-primary"
                            type="submit"
                        >
                            Publish Scheme
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CreateScheme;