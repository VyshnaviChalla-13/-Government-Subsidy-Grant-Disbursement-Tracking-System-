import "./SchemeDetails.css";

function SchemeDetails() {

    return (

        <div className="scheme-details-page">

            <div className="container py-5">

                <div className="details-card">

                    <h2 className="text-primary">
                        Farmer Assistance Scheme
                    </h2>

                    <p className="text-muted">
                        Financial support for eligible farmers to improve agricultural productivity.
                    </p>

                    <hr />

                    <div className="row">

                        <div className="col-md-6">

                            <p><strong>Department :</strong> Agriculture</p>

                            <p><strong>Grant Amount :</strong> ₹50,000</p>

                            <p><strong>Application Deadline :</strong> 31 Dec 2026</p>

                        </div>

                        <div className="col-md-6">

                            <p><strong>Scheme Type :</strong> Subsidy</p>

                            <p><strong>Status :</strong> Open</p>

                            <p><strong>Mode :</strong> Online</p>

                        </div>

                    </div>

                </div>

                <div className="details-card mt-4">

                    <h4>Description</h4>

                    <p>
                        This scheme provides financial assistance to eligible farmers
                        for purchasing seeds, fertilizers, agricultural equipment and
                        improving irrigation facilities.
                    </p>

                </div>

                <div className="details-card mt-4">

                    <h4>Eligibility Criteria</h4>

                    <ul>

                        <li>Applicant must be an Indian Citizen.</li>

                        <li>Age should be above 18 years.</li>

                        <li>Occupation must be Farmer.</li>

                        <li>Annual income should be below ₹2,00,000.</li>

                    </ul>

                </div>

                <div className="details-card mt-4">

                    <h4>Required Documents</h4>

                    <ul>

                        <li>Aadhaar Card</li>

                        <li>Income Certificate</li>

                        <li>Land Ownership Document</li>

                        <li>Bank Passbook</li>

                    </ul>

                </div>

                <div className="details-card mt-4">

                    <h4>Benefits</h4>

                    <ul>

                        <li>Financial Assistance up to ₹50,000</li>

                        <li>Direct Benefit Transfer (DBT)</li>

                        <li>Transparent Online Tracking</li>

                    </ul>

                </div>

                <div className="text-center mt-5">

                    <button className="btn btn-primary btn-lg">

                        Apply Now

                    </button>

                </div>

            </div>

        </div>

    );

}

export default SchemeDetails;