import "./SchemeDetails.css";
import { useNavigate, useLocation,useParams } from "react-router-dom";

function SchemeDetails() {

    const navigate = useNavigate();
    const location = useLocation();
    const fromPublic = location.state?.fromPublic || false;
    const { id } = useParams();
    const schemes = {
        1: {
            title: "Farmer Assistance Scheme",
            subtitle: "Financial support for eligible farmers to improve agricultural productivity.",
            department: "Agriculture",
            amount: "₹50,000",
            deadline: "31 Dec 2026",
            type: "Subsidy",
            status: "Open",
            mode: "Online",
            description: "This scheme provides financial assistance to eligible farmers for purchasing seeds, fertilizers, agricultural equipment and improving irrigation facilities."
        },
        2: {
            title: "Student Scholarship Scheme",
            subtitle: "Scholarships for deserving students pursuing higher education.",
            department: "Education",
            amount: "₹25,000",
            deadline: "15 Nov 2026",
            type: "Scholarship",
            status: "Open",
            mode: "Online",
            description: "This scheme provides financial assistance to eligible students for continuing higher education."
        },
        3: {
            title: "Affordable Housing Scheme",
            subtitle: "Housing assistance for economically weaker families.",
            department: "Housing",
            amount: "₹2,00,000",
            deadline: "20 Oct 2026",
            type: "Housing",
            status: "Open",
            mode: "Online",
            description: "This scheme supports economically weaker families by providing housing assistance."
        },
        4: {
            title: "Women Empowerment Scheme",
            subtitle: "Support for women entrepreneurship and welfare.",
            department: "Social Welfare",
            amount: "₹75,000",
            deadline: "10 Jan 2027",
            type: "Welfare",
            status: "Open",
            mode: "Online",
            description: "This scheme promotes women entrepreneurship and social welfare through financial assistance."
        }
    };

    const scheme = schemes[id] || schemes[1];
    return (

        <div className="scheme-details-page">

            <div className="container py-5">

                <div className="details-card">

                    <h2 className="text-primary">
                        {scheme.title}
                    </h2>

                    <p className="text-muted">
                        {scheme.subtitle}
                    </p>

                    <hr />

                    <div className="row">

                        <div className="col-md-6">

                            <p><strong>Department :</strong> {scheme.department}</p>

                            <p><strong>Grant Amount :</strong> {scheme.amount}</p>

                            <p><strong>Application Deadline :</strong> {scheme.deadline}</p>

                        </div>

                        <div className="col-md-6">

                            <p><strong>Scheme Type :</strong> {scheme.type}</p>

                            <p><strong>Status :</strong> Open</p>

                            <p><strong>Mode :</strong> Online</p>

                        </div>

                    </div>

                </div>

                <div className="details-card mt-4">

                    <h4>description</h4>

                    <p>
                        {scheme.description}
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

                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => {
                            if (fromPublic) {
                                navigate("/login", {
                                    state: {
                                        fromApply: true,
                                        schemeId: id
                                    }
                                });
                            } else {
                                navigate("/beneficiary/apply", {
                                    state: {
                                        schemeId: id
                                    }
                                });
                            }
                        }}
                    >
                        Apply Now
                    </button>

                </div>

            </div>

        </div>

    );

}

export default SchemeDetails;