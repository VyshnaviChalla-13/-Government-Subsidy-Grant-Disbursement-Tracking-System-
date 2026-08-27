import "../../styles/featuredSchemes.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSchemes } from "../../api/schemeApi";

const COLORS = ["green", "blue", "orange", "purple"];
const ICONS = ["bi bi-tree-fill", "bi bi-mortarboard-fill", "bi bi-house-heart-fill", "bi bi-person-hearts"];

function FeaturedSchemes() {
    const navigate = useNavigate();
    const [schemes, setSchemes] = useState([]);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const data = await getAllSchemes();
                if (Array.isArray(data) && data.length > 0) {
                    setSchemes(
                        data.slice(0, 4).map((s, idx) => ({
                            id: s.schemeId,
                            icon: ICONS[idx % ICONS.length],
                            title: s.schemeName,
                            description: s.description || "Government welfare grant scheme for eligible citizens.",
                            color: COLORS[idx % COLORS.length],
                        }))
                    );
                }
            } catch (err) {
                console.error("Failed to load featured schemes:", err);
            }
        }

        fetchFeatured();
    }, []);

    const displaySchemes = schemes.length > 0 ? schemes : [
        {
            id: 1,
            icon: "bi bi-tree-fill",
            title: "Farmer Assistance",
            description: "Financial support for eligible farmers to improve agricultural productivity.",
            color: "green",
        },
        {
            id: 2,
            icon: "bi bi-mortarboard-fill",
            title: "Student Scholarship",
            description: "Scholarships for deserving students to support higher education.",
            color: "blue",
        },
        {
            id: 3,
            icon: "bi bi-house-heart-fill",
            title: "Affordable Housing",
            description: "Housing assistance for economically weaker families.",
            color: "orange",
        },
        {
            id: 4,
            icon: "bi bi-person-hearts",
            title: "Women Empowerment",
            description: "Government initiatives for women entrepreneurship and welfare.",
            color: "purple",
        },
    ];

    return (
        <section className="featured-schemes">
            <div className="container">
                <div className="section-header">
                    <div>
                        <h2>Featured Government Schemes</h2>
                        <p>Explore the most popular welfare schemes available for citizens.</p>
                    </div>

                    <button
                        className="view-all-btn"
                        onClick={() =>
                            navigate("/beneficiary/schemes", {
                                state: { fromPublic: true },
                            })
                        }
                    >
                        View All Schemes
                        <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                </div>

                <div className="row g-4">
                    {displaySchemes.map((scheme, index) => (
                        <div className="col-lg-3 col-md-6" key={scheme.id || index}>
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
                                            state: { fromPublic: true },
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