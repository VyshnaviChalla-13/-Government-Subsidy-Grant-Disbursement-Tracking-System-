import "./BrowseSchemes.css";
import { useNavigate } from "react-router-dom";

function BrowseSchemes() {

    const schemes = [
        {
            id: 1,
            title: "Farmer Assistance",
            department: "Agriculture",
            amount: "₹50,000",
            deadline: "31 Dec 2026"
        },
        {
            id: 2,
            title: "Student Scholarship",
            department: "Education",
            amount: "₹25,000",
            deadline: "15 Nov 2026"
        },
        {
            id: 3,
            title: "Affordable Housing",
            department: "Housing",
            amount: "₹2,00,000",
            deadline: "20 Oct 2026"
        },
        {
            id: 4,
            title: "Women Empowerment",
            department: "Social Welfare",
            amount: "₹75,000",
            deadline: "10 Jan 2027"
        }
    ];
    
    const navigate = useNavigate();
    
    return (
        <div className="browse-page">
            <div className="container py-5">

                <h2 className="browse-title">
                    Browse Government Schemes
                </h2>

                <p className="browse-subtitle">
                    Explore available government schemes.
                </p>

                <div className="row">

                    {schemes.map((scheme) => (

                        <div className="col-lg-6 mb-4" key={scheme.id}>

                            <div className="scheme-card">

                                <h4>{scheme.title}</h4>

                                <p><strong>Department:</strong> {scheme.department}</p>

                                <p><strong>Grant:</strong> {scheme.amount}</p>

                                <p><strong>Last Date:</strong> {scheme.deadline}</p>

                                <div className="d-flex gap-2">

                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => navigate("/beneficiary/schemes/1")}
                                    >
                                        View Details
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate("/beneficiary/apply")}
                                    >
                                        Apply
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>
        </div>
    );
}

export default BrowseSchemes;