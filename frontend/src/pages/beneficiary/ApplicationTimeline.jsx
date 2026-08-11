import "./ApplicationTimeline.css";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    ArrowLeft,
    BadgeCheck,
    Building2,
    CalendarDays,
    CheckCircle2,
    CircleDashed,
    Clock3,
    Download,
    FileText,
    GitBranch,
    History,
    PhoneCall,
    Printer,
    ShieldCheck,
    UserCheck,
} from "lucide-react";

function ApplicationTimeline() {
    const navigate = useNavigate();

    const timeline = [
        { title: "Application Submitted", date: "10 Jul 2026", status: "Completed" },
        { title: "Front Desk Approved", date: "11 Jul 2026", status: "Completed" },
        { title: "Verification Officer Review", date: "12 Jul 2026", status: "Completed" },
        { title: "Waiting for Finance Approval", date: "Pending", status: "In Progress" },
        { title: "Grant Disbursed", date: "-", status: "Pending" },
    ];

    const application = {
        id: "APP1001",
        scheme: "Farmer Assistance",
        applicant: "Beneficiary Name",
        department: "Department of Agriculture",
        submittedDate: "10 Jul 2026",
        currentStatus: "In Progress",
    };

    const completedSteps = timeline.filter((step) => step.status === "Completed").length;
    const progress = Math.round((completedSteps / timeline.length) * 100);

    const getStepIcon = (status) => {
        if (status === "Completed") return <CheckCircle2 size={21} aria-hidden="true" />;
        if (status === "In Progress") return <Clock3 size={21} aria-hidden="true" />;
        return <CircleDashed size={21} aria-hidden="true" />;
    };

    const getStepClass = (status) => {
        if (status === "Completed") return "completed";
        if (status === "In Progress") return "in-progress";
        return "pending";
    };

    return (
        <div className="timeline-page">
            <div className="container py-4 py-md-5">
                <section className="timeline-hero">
                    <div className="timeline-hero-content">
                        <span className="timeline-eyebrow">Beneficiary Services</span>
                        <h1>Application Timeline</h1>
                        <p>Track every stage of your application from submission to final approval.</p>
                    </div>
                    <div className="timeline-hero-icon" aria-hidden="true"><History size={82} strokeWidth={1.5} /></div>
                </section>

                <section className="timeline-summary-section">
                    <div className="timeline-section-heading">
                        <div>
                            <span className="timeline-section-kicker">Application overview</span>
                            <h2>Application Summary</h2>
                        </div>
                        <span className="timeline-current-status"><Clock3 size={16} aria-hidden="true" /> {application.currentStatus}</span>
                    </div>
                    <div className="timeline-summary-grid">
                        <div className="timeline-info-card"><FileText size={20} aria-hidden="true" /><div><span>Application ID</span><strong>{application.id}</strong></div></div>
                        <div className="timeline-info-card"><BadgeCheck size={20} aria-hidden="true" /><div><span>Scheme Name</span><strong>{application.scheme}</strong></div></div>
                        <div className="timeline-info-card"><UserCheck size={20} aria-hidden="true" /><div><span>Applicant Name</span><strong>{application.applicant}</strong></div></div>
                        <div className="timeline-info-card"><Building2 size={20} aria-hidden="true" /><div><span>Department</span><strong>{application.department}</strong></div></div>
                        <div className="timeline-info-card"><CalendarDays size={20} aria-hidden="true" /><div><span>Submitted Date</span><strong>{application.submittedDate}</strong></div></div>
                    </div>
                </section>

                <section className="timeline-progress-card">
                    <div className="timeline-progress-heading">
                        <div><span className="timeline-section-kicker">Progress tracker</span><h2>Application Progress</h2></div>
                        <strong>{progress}% Complete</strong>
                    </div>
                    <div className="timeline-progress-bar" role="progressbar" aria-label="Application progress" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                        <span className={`timeline-progress-fill progress-${progress}`}></span>
                    </div>
                    <p>{completedSteps} of {timeline.length} review stages have been completed. Your application is currently awaiting finance approval.</p>
                </section>

                <div className="timeline-main-grid">
                    <section className="timeline-card timeline-stages-card">
                        <div className="timeline-card-heading">
                            <div className="timeline-heading-icon"><GitBranch size={21} aria-hidden="true" /></div>
                            <div><span className="timeline-section-kicker">Application journey</span><h2>Review Timeline</h2></div>
                        </div>
                        <div className="timeline-stages">
                            {timeline.map((step, index) => (
                                <article className={`timeline-item ${getStepClass(step.status)}`} key={index}>
                                    <div className="timeline-marker">{getStepIcon(step.status)}</div>
                                    <div className="timeline-content">
                                        <div className="timeline-step-topline">
                                            <h3>{step.title}</h3>
                                            <span className={`timeline-status ${getStepClass(step.status)}`}>{step.status}</span>
                                        </div>
                                        <p>{step.status === "Completed" ? "This review stage has been completed successfully." : step.status === "In Progress" ? "Your application is currently in this review stage." : "This stage will begin after the previous review is completed."}</p>
                                        <div className="timeline-step-meta"><span><CalendarDays size={15} aria-hidden="true" /> {step.date}</span>{step.status !== "Pending" && <span><UserCheck size={15} aria-hidden="true" /> Beneficiary Services Team</span>}</div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <aside className="timeline-side-content">
                        <section className="timeline-card timeline-status-card">
                            <div className="timeline-card-heading"><div className="timeline-heading-icon"><ShieldCheck size={21} aria-hidden="true" /></div><div><span className="timeline-section-kicker">Status information</span><h2>What Happens Next</h2></div></div>
                            <dl className="status-information-list">
                                <div><dt>Current Status</dt><dd><span className="timeline-status in-progress">{application.currentStatus}</span></dd></div>
                                <div><dt>Estimated Next Step</dt><dd>Finance approval review</dd></div>
                                <div><dt>Expected Completion</dt><dd>Subject to department review</dd></div>
                                <div><dt>Officer Responsible</dt><dd>Finance Approval Team</dd></div>
                            </dl>
                        </section>

                        <section className="timeline-card timeline-activity-card">
                            <div className="timeline-card-heading"><div className="timeline-heading-icon"><Activity size={21} aria-hidden="true" /></div><div><span className="timeline-section-kicker">Review log</span><h2>Activity History</h2></div></div>
                            <div className="timeline-activity-list">
                                {timeline.map((step, index) => (
                                    <div className="timeline-activity-item" key={index}>
                                        <span className={`activity-dot ${getStepClass(step.status)}`}></span>
                                        <div><strong>{step.title}</strong><p>{step.status === "Completed" ? "Action completed by Beneficiary Services Team" : step.status === "In Progress" ? "Review currently in progress" : "Awaiting the previous review stage"}</p><span>{step.date} · {step.status}</span></div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>

                <section className="timeline-actions" aria-label="Timeline actions">
                    <button className="timeline-back-btn" onClick={() => navigate("/beneficiary/my-applications")}><ArrowLeft size={18} aria-hidden="true" /> Back to My Applications</button>
                    <div className="timeline-action-group">
                        <button className="timeline-utility-btn" type="button" disabled title="Timeline download will be available when document generation is connected"><Download size={18} aria-hidden="true" /> Download Timeline</button>
                        <button className="timeline-utility-btn" type="button" onClick={() => window.print()}><Printer size={18} aria-hidden="true" /> Print Timeline</button>
                        <button className="timeline-contact-btn" onClick={() => navigate("/contact")}><PhoneCall size={18} aria-hidden="true" /> Contact Support</button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ApplicationTimeline;
