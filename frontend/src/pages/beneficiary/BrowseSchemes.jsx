import "./BrowseSchemes.css";
import { useNavigate, useLocation } from "react-router-dom";

import {
    Search,
    Building2,
    IndianRupee,
    CalendarDays,
    ArrowRight,
    FileText
} from "lucide-react";

function BrowseSchemes() {

    const navigate = useNavigate();
    const location = useLocation();

    const fromPublic = location.state?.fromPublic || false;

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

    return (

        <div className="browse-page">

            <div className="container py-4">

                {/* ================= HERO ================= */}

                <div className="browse-hero">

                    <div>

                        <span className="browse-tag">
                            Government Welfare Portal
                        </span>

                        <h1>
                            Browse Government Schemes
                        </h1>

                        <p>
                            Explore available welfare schemes, check eligibility,
                            and apply online in just a few clicks.
                        </p>

                    </div>

                </div>

                {/* ================= SEARCH ================= */}

                <div className="search-section">

                    <div className="search-box">

                        <Search size={20} />

                        <input
                            type="text"
                            placeholder="Search schemes..."
                        />

                    </div>

                    <select className="filter-dropdown">

                        <option>All Departments</option>

                        <option>Agriculture</option>

                        <option>Education</option>

                        <option>Housing</option>

                        <option>Social Welfare</option>

                    </select>

                </div>

                {/* ================= SCHEMES ================= */}

                <div className="row mt-4">

                    {

                        schemes.map((scheme) => (

                            <div
                                className="col-lg-6 col-md-6 mb-4"
                                key={scheme.id}
                            >

                                <div className="scheme-card">

                                    <div className="scheme-header">

                                        <div className="scheme-icon">

                                            <FileText size={32} />

                                        </div>

                                        <div>

                                            <h4>

                                                {scheme.title}

                                            </h4>

                                            <span>

                                                Government Scheme

                                            </span>

                                        </div>

                                    </div>

                                    <div className="scheme-info">

                                        <div className="info-row">

                                            <Building2 size={18} />

                                            <span>

                                                {scheme.department}

                                            </span>

                                        </div>

                                        <div className="info-row">

                                            <IndianRupee size={18} />

                                            <span>

                                                {scheme.amount}

                                            </span>

                                        </div>

                                        <div className="info-row">

                                            <CalendarDays size={18} />

                                            <span>

                                                Last Date :
                                                {scheme.deadline}

                                            </span>

                                        </div>

                                    </div>

                                    <div className="scheme-actions">

                                        <button

                                            className="details-btn"

                                            onClick={() =>
                                                navigate(
                                                    `/beneficiary/schemes/${scheme.id}`,
                                                    {
                                                        state: {
                                                            fromPublic
                                                        }
                                                    }
                                                )
                                            }

                                        >

                                            View Details

                                            <ArrowRight size={16} />

                                        </button>

                                        <button

                                            className="apply-btn"

                                            onClick={() => {

                                                if (fromPublic) {

                                                    navigate("/login", {

                                                        state: {

                                                            fromApply: true,

                                                            schemeId: scheme.id

                                                        }

                                                    });

                                                }

                                                else {

                                                    navigate("/beneficiary/apply", {

                                                        state: {

                                                            schemeId: scheme.id

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

                        ))

                    }

                </div>

            </div>

        </div>

    );

}

export default BrowseSchemes;