import "../../styles/featuredSchemes.css";
import { useNavigate } from "react-router-dom";

function FeaturedSchemes() {

    const navigate = useNavigate();

    const schemes = [

        {
            id:1,
            icon: "bi bi-tree-fill",
            title: "Farmer Assistance",
            description: "Financial support for eligible farmers to improve agricultural productivity.",
            color: "green"
        },

        {
            id:2,
            icon: "bi bi-mortarboard-fill",
            title: "Student Scholarship",
            description: "Scholarships for deserving students to support higher education.",
            color: "blue"
        },

        {
            id:3,
            icon: "bi bi-house-heart-fill",
            title: "Affordable Housing",
            description: "Housing assistance for economically weaker families.",
            color: "orange"
        },

        {
            id:4,
            icon: "bi bi-person-hearts",
            title: "Women Empowerment",
            description: "Government initiatives for women entrepreneurship and welfare.",
            color: "purple"
        }

    ];

    return (

        <section className="featured-schemes">

            <div className="container">

                <div className="section-header">

                    <div>

                        <h2>Featured Government Schemes</h2>

                        <p>
                            Explore the most popular welfare schemes available for citizens.
                        </p>

                    </div>

                    <button
                        className="view-all-btn"
                        onClick={() =>
                            navigate("/beneficiary/schemes", {
                                state: { fromPublic: true }
                            })
                        }
                    >
                        View All Schemes
                        <i className="bi bi-arrow-right ms-2"></i>
                    </button>

                </div>

                <div className="row g-4">

                    {schemes.map((scheme, index) => (

                        <div className="col-lg-3 col-md-6" key={index}>

                            <div className={`featured-scheme-card ${scheme.color}`}>

                                <div className={`featured-scheme-icon ${scheme.color}`}>

                                    <i className={scheme.icon}></i>

                                </div>

                                <h4>{scheme.title}</h4>

                                <p>{scheme.description}</p>

                                <button
                                    className={`details-btn ${scheme.color}`}
                                    onClick={() =>
                                        navigate(`/beneficiary/schemes/${scheme.id}`, {
                                            state: { fromPublic: true }
                                        })
                                    }
                                >
                                    View Details
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}

export default FeaturedSchemes;