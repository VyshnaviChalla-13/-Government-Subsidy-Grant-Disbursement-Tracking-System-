import "../../styles/featuredSchemes.css";

function FeaturedSchemes() {

    const schemes = [

        {
            title: "Farmer Assistance",
            description: "Financial support for eligible farmers."
        },

        {
            title: "Student Scholarship",
            description: "Scholarships for eligible students."
        },

        {
            title: "Affordable Housing",
            description: "Housing assistance for eligible families."
        },

        {
            title: "Women Empowerment",
            description: "Support schemes for women development."
        }

    ];

    return (

        <section className="featured-schemes">

            <div className="container">

                <h2 className="text-center mb-5">
                    Featured Government Schemes
                </h2>

                <div className="row">

                    {schemes.map((scheme,index)=>(

                        <div className="col-lg-3 col-md-6 mb-4" key={index}>

                            <div className="scheme-card">

                                <h4>{scheme.title}</h4>

                                <p>{scheme.description}</p>

                                <button className="btn btn-primary">
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