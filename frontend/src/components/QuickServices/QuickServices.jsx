import "../../styles/quickServices.css";

function QuickServices() {

    const services = [

        {
            icon:"bi bi-file-earmark-text",
            title:"Apply Scheme",
            description:"Apply for government welfare schemes."
        },

        {
            icon:"bi bi-search",
            title:"Track Application",
            description:"Track your submitted applications."
        },

        {
            icon:"bi bi-check-circle",
            title:"Check Eligibility",
            description:"Find schemes you are eligible for."
        },

        {
            icon:"bi bi-person",
            title:"Citizen Login",
            description:"Login to your account securely."
        }

    ];

    return (

        <section className="quick-services">

            <div className="container">

                <h2 className="text-center mb-5">

                    Quick Services

                </h2>

                <div className="row">

                    {

                        services.map((service,index)=>(

                            <div className="col-lg-3 col-md-6 mb-4" key={index}>

                                <div className="service-box">

                                    <i className={service.icon}></i>

                                    <h4>

                                        {service.title}

                                    </h4>

                                    <p>

                                        {service.description}

                                    </p>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

        </section>

    );

}

export default QuickServices;