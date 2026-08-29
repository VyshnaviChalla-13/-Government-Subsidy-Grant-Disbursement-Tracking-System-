import "../../styles/quickServices.css";
import { useNavigate } from "react-router-dom";

function QuickServices() {

    const navigate = useNavigate();

    const services = [

        {
            id: 1,
            icon: "bi bi-file-earmark-text-fill",
            title: "Apply for Scheme",
            description: "Fill application form and apply online.",
            color: "blue",
            route: "/login"
        },

        {
            id: 2,
            icon: "bi bi-search",
            title: "Track Application",
            description: "Track your application status in real-time.",
            color: "green",
            route: "/track"
        },

        {
            id: 3,
            icon: "bi bi-person-check-fill",
            title: "Check Eligibility",
            description: "Check eligibility criteria for schemes.",
            color: "purple",
            route: "/eligibility"
        },

        {
            id: 4,
            icon: "bi bi-folder2-open",
            title: "Required Documents",
            description: "View required documents for application.",
            color: "orange",
            route: "/documents"
        },

        {
            id: 5,
            icon: "bi bi-headset",
            title: "Help & Support",
            description: "Get assistance and support.",
            color: "cyan",
            route: "/support"
        }

    ];

    return (

        <section className="quick-services">

            <div className="container">

                {/* Section Heading */}

                <div className="section-title">

                    <div className="title-line"></div>

                    <h2>Quick Access Services</h2>

                    <div className="title-line"></div>

                </div>

                {/* Cards */}

                <div className="row g-4">

                    {services.map((service) => (

                        <div
                            className="col-lg col-md-6"
                            key={service.id}
                        >

                            <div
                                className={`service-box ${service.color}`}
                                onClick={() => navigate(service.route)}
                            >

                                <div className="service-top">

                                    <div className={`icon-box ${service.color}`}>

                                        <i className={service.icon}></i>

                                    </div>

                                    <div className={`arrow-box ${service.color}`}>

                                        <i className="bi bi-arrow-right"></i>

                                    </div>

                                </div>

                                <h4>{service.title}</h4>

                                <p>{service.description}</p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}

export default QuickServices;