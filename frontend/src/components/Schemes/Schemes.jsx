import "../../styles/schemes.css";

function Schemes() {
    return (
        <section className="schemes">

            <div className="container">

                <h2 className="text-center mb-5">
                    Popular Government Schemes
                </h2>

                <div className="row">

                    <div className="col-md-4 mb-4">
                        <div className="card scheme-card">
                            <div className="card-body">
                                <h4>🌾Farmer Assistance Scheme </h4>
                                <p>
                                    Financial assistance for eligible farmers.
                                </p>

                                <button className="btn btn-primary">
                                    View Details
                                </button>

                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="card scheme-card">
                            <div className="card-body">

                                <h4>🎓 Scholarship Scheme</h4>

                                <p>
                                    Scholarships for eligible students.
                                </p>

                                <button className="btn btn-primary">
                                    View Details
                                </button>

                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">

                        <div className="card scheme-card">

                            <div className="card-body">

                                <h4>🏠 Housing Scheme</h4>

                                <p>
                                    Affordable housing support for citizens.
                                </p>

                                <button className="btn btn-primary">
                                    View Details
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Schemes;