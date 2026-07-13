import "../../styles/hero.css";

function Hero() {
    return (
        <section className="hero">

            <div className="container">

                <div className="row align-items-center">

                    <div className="col-lg-6">

                        <h1>
                            Empowering Citizens Through
                            <span className="text-primary"> Digital Government Services</span>
                        </h1>

                        <p>
                            Discover government welfare schemes, apply online,
                            upload documents securely, track your application
                            status and receive benefits through one unified platform.
                        </p>

                        <div className="mt-4">

                            <button className="btn btn-primary btn-lg me-3">
                                Apply Now
                            </button>

                            <button className="btn btn-outline-primary btn-lg">
                                Explore Schemes
                            </button>

                        </div>

                    </div>

                    <div className="col-lg-6 text-center">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="Government"
                            className="img-fluid hero-image"
                        />

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Hero;