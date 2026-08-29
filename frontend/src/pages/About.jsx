import "../styles/about.css";

function About() {
    return (
        <div className="about-page">

            <div className="container py-5">

                <div className="text-center mb-5">

                    <h1 className="about-title">
                        About Government Welfare Portal
                    </h1>

                    <p className="about-subtitle">
                        A unified digital platform that simplifies access to
                        government welfare schemes for every eligible citizen.
                    </p>

                </div>

                <div className="row g-4">

                    <div className="col-md-6">

                        <div className="about-card">

                            <h3>🎯 Our Mission</h3>

                            <p>
                                To provide a secure, transparent and
                                citizen-friendly platform that enables citizens
                                to explore, apply and track government welfare
                                schemes digitally.
                            </p>

                        </div>

                    </div>

                    <div className="col-md-6">

                        <div className="about-card">

                            <h3>🌍 Our Vision</h3>

                            <p>
                                To build an efficient digital ecosystem where
                                every eligible citizen can easily access
                                government welfare benefits anytime and
                                anywhere.
                            </p>

                        </div>

                    </div>

                    <div className="col-md-6">

                        <div className="about-card">

                            <h3>⭐ Key Features</h3>

                            <ul>

                                <li>Browse Government Welfare Schemes</li>

                                <li>Online Scheme Application</li>

                                <li>Track Application Status</li>

                                <li>Secure Document Upload</li>

                                <li>Beneficiary Dashboard</li>

                            </ul>

                        </div>

                    </div>

                    <div className="col-md-6">

                        <div className="about-card">

                            <h3>🎯 Objectives</h3>

                            <ul>

                                <li>Improve transparency</li>

                                <li>Reduce paperwork</li>

                                <li>Provide faster service delivery</li>

                                <li>Promote digital governance</li>

                                <li>Improve citizen accessibility</li>

                            </ul>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default About;