import "./ApplicationTimeline.css";

function ApplicationTimeline() {

    const timeline = [

        {
            title: "Application Submitted",
            date: "10 Jul 2026",
            status: "Completed"
        },

        {
            title: "Front Desk Approved",
            date: "11 Jul 2026",
            status: "Completed"
        },

        {
            title: "Verification Officer Review",
            date: "12 Jul 2026",
            status: "Completed"
        },

        {
            title: "Waiting for Finance Approval",
            date: "Pending",
            status: "In Progress"
        },

        {
            title: "Grant Disbursed",
            date: "-",
            status: "Pending"
        }

    ];

    return (

        <div className="timeline-page">

            <div className="container py-5">

                <h2 className="text-primary mb-3">
                    Application Timeline
                </h2>

                <p className="text-muted mb-5">
                    Track the progress of your application.
                </p>

                {

                    timeline.map((step,index)=>(

                        <div className="timeline-item" key={index}>

                            <div className="timeline-circle">

                                {index+1}

                            </div>

                            <div className="timeline-content">

                                <h5>

                                    {step.title}

                                </h5>

                                <p>

                                    {step.date}

                                </p>

                                <span className={`badge ${
                                    step.status==="Completed"
                                    ?"bg-success"
                                    :step.status==="In Progress"
                                    ?"bg-warning text-dark"
                                    :"bg-secondary"
                                }`}>

                                    {step.status}

                                </span>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default ApplicationTimeline;