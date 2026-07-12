import "../../styles/aboutPortal.css";

function AboutPortal() {

    return (

        <section className="about-portal">

            <div className="container">

                <div className="row align-items-center">

                    <div className="col-lg-6">

                        <h2>
                            About Government Scheme Management System
                        </h2>

                        <p>

                            This portal enables citizens to explore
                            government welfare schemes, submit applications,
                            upload required documents, track application
                            status, and receive transparent updates through
                            a secure digital platform.

                        </p>

                    </div>

                    <div className="col-lg-6">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="Portal"
                            className="img-fluid"
                        />

                    </div>

                </div>

            </div>

        </section>

    );

}

export default AboutPortal;