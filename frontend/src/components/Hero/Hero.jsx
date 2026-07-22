import "../../styles/hero.css";
import heroImage from "../../assets/hero-vector.png";
import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero">

            <div className="container">

                <div className="row align-items-center">

                    {/* Left Content */}

                    <div className="col-lg-6">

                        <div className="hero-badge">
                            <i className="bi bi-patch-check-fill"></i>
                            <span>Official Government Platform</span>
                        </div>

                        <h1 className="hero-title">
                            Empowering Citizens Through
                            <br />
                            <span>Digital Government Services</span>
                        </h1>

                        <p className="hero-description">
                            Discover government welfare schemes, check eligibility,
                            apply online and track application status —
                            all in one secure digital platform.
                        </p>

                        {/* Buttons */}

                        <div className="hero-buttons">

                            <button
                                className="hero-btn-primary"
                                onClick={() => navigate("/login")}
                            >
                                <i className="bi bi-rocket-takeoff-fill"></i>

                                <div className="btn-content">
                                    <span>Get Started</span>
                                    <small>Apply for Schemes</small>
                                </div>

                            </button>

                            <button
                                className="hero-btn-outline"
                                onClick={() => navigate("/schemes")}
                            >
                                <i className="bi bi-file-earmark-text-fill"></i>

                                <div className="btn-content">
                                    <span>View Schemes</span>
                                    <small>Explore All Schemes</small>
                                </div>

                            </button>

                        </div>

                        {/* Features */}

                        <div className="hero-features">

                            <div className="feature-item">
                                <i className="bi bi-shield-check-fill"></i>
                                <span>Secure Platform</span>
                            </div>

                            <div className="feature-item">
                                <i className="bi bi-eye-fill"></i>
                                <span>Transparent Process</span>
                            </div>

                            <div className="feature-item">
                                <i className="bi bi-lightning-charge-fill"></i>
                                <span>Fast Processing</span>
                            </div>

                            <div className="feature-item">
                                <i className="bi bi-person-check-fill"></i>
                                <span>Citizen Friendly</span>
                            </div>

                        </div>

                    </div>

                    {/* Right Image */}

                    <div className="col-lg-6">

                        <div className="hero-image-wrapper">

                            <img
                                src={heroImage}
                                alt="Government Welfare Portal"
                                className="hero-image img-fluid"
                            />

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Hero;