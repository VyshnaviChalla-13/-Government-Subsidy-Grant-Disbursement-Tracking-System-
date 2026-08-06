import "./MyApplications.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    FileText,
    Filter,
    FolderOpen,
    Search,
    XCircle,
} from "lucide-react";

function MyApplications() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [schemeFilter, setSchemeFilter] = useState("All Schemes");

    const applications = [
        {
            id: "APP1001",
            scheme: "Farmer Assistance",
            date: "10-Jul-2026",
            status: "Approved",
            department: "Department of Agriculture",
        },
        {
            id: "APP1002",
            scheme: "Student Scholarship",
            date: "12-Jul-2026",
            status: "Under Verification",
            department: "Department of Education",
        },
        {
            id: "APP1003",
            scheme: "Affordable Housing",
            date: "15-Jul-2026",
            status: "Returned",
            department: "Housing and Urban Development",
        },
    ];

    const schemes = [...new Set(applications.map((app) => app.scheme))];
    const statusCounts = {
        approved: applications.filter((app) => app.status === "Approved").length,
        pending: applications.filter((app) => app.status === "Under Verification").length,
        rejected: applications.filter((app) => app.status === "Returned").length,
    };

    const filteredApplications = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return applications.filter((app) => {
            const matchesSearch = !query || [app.id, app.scheme, app.department, app.status]
                .some((value) => value.toLowerCase().includes(query));
            const matchesStatus = statusFilter === "All Statuses" || app.status === statusFilter;
            const matchesScheme = schemeFilter === "All Schemes" || app.scheme === schemeFilter;

            return matchesSearch && matchesStatus && matchesScheme;
        });
    }, [searchTerm, statusFilter, schemeFilter]);

    const getStatusClass = (status) => {
        if (status === "Approved") return "approved";
        if (status === "Returned") return "rejected";
        return "under-review";
    };

    return (
        <div className="applications-page">
            <div className="container py-4 py-md-5">
                <section className="applications-hero">
                    <div className="applications-hero-content">
                        <span className="applications-eyebrow">Beneficiary Services</span>
                        <h1>My Applications</h1>
                        <p>Track every submitted application, review its current status, and stay updated on the next steps.</p>
                    </div>
                    <div className="applications-hero-icon" aria-hidden="true">
                        <FolderOpen size={82} strokeWidth={1.5} />
                    </div>
                </section>

                <section className="application-summary-grid" aria-label="Application summary">
                    <div className="application-summary-card">
                        <div className="application-summary-icon total"><FileText size={25} /></div>
                        <div><span>Total Applications</span><strong>{applications.length}</strong></div>
                    </div>
                    <div className="application-summary-card">
                        <div className="application-summary-icon approved"><CheckCircle2 size={25} /></div>
                        <div><span>Approved</span><strong>{statusCounts.approved}</strong></div>
                    </div>
                    <div className="application-summary-card">
                        <div className="application-summary-icon pending"><Clock3 size={25} /></div>
                        <div><span>Pending</span><strong>{statusCounts.pending}</strong></div>
                    </div>
                    <div className="application-summary-card">
                        <div className="application-summary-icon rejected"><XCircle size={25} /></div>
                        <div><span>Returned</span><strong>{statusCounts.rejected}</strong></div>
                    </div>
                </section>

                <section className="applications-content-card">
                    <div className="applications-card-heading">
                        <div>
                            <span className="applications-section-kicker">Application records</span>
                            <h2>Submitted Applications</h2>
                        </div>
                        <span className="applications-result-count">{filteredApplications.length} result{filteredApplications.length !== 1 ? "s" : ""}</span>
                    </div>

                    <div className="applications-toolbar">
                        <label className="application-search" htmlFor="application-search">
                            <Search size={19} aria-hidden="true" />
                            <input id="application-search" type="search" placeholder="Search by application ID or scheme" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                        </label>
                        <div className="application-filter-control">
                            <Filter size={18} aria-hidden="true" />
                            <label className="visually-hidden" htmlFor="status-filter">Filter by status</label>
                            <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                                <option>All Statuses</option>
                                <option>Approved</option>
                                <option>Under Verification</option>
                                <option>Returned</option>
                            </select>
                        </div>
                        <div className="application-filter-control">
                            <Building2 size={18} aria-hidden="true" />
                            <label className="visually-hidden" htmlFor="scheme-filter">Filter by scheme</label>
                            <select id="scheme-filter" value={schemeFilter} onChange={(event) => setSchemeFilter(event.target.value)}>
                                <option>All Schemes</option>
                                {schemes.map((scheme) => <option key={scheme}>{scheme}</option>)}
                            </select>
                        </div>
                    </div>

                    {filteredApplications.length > 0 ? (
                        <div className="applications-list">
                            {filteredApplications.map((app) => (
                                <article className="application-record-card" key={app.id}>
                                    <div className="application-record-main">
                                        <div className="application-file-icon" aria-hidden="true"><FileText size={25} /></div>
                                        <div className="application-record-title">
                                            <span className="application-id">{app.id}</span>
                                            <h3>{app.scheme}</h3>
                                            <div className="application-meta">
                                                <span><CalendarDays size={16} aria-hidden="true" /> Submitted {app.date}</span>
                                                <span><Building2 size={16} aria-hidden="true" /> {app.department}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="application-record-side">
                                        <span className={`application-status ${getStatusClass(app.status)}`}>{app.status}</span>
                                        <button className="application-timeline-btn" onClick={() => navigate("/beneficiary/timeline")}>
                                            <Eye size={17} aria-hidden="true" />
                                            View Timeline
                                            <ArrowRight size={16} aria-hidden="true" />
                                        </button>
                                        {app.status === "Approved" && (
                                            <button className="application-timeline-btn" onClick={() => navigate("/beneficiary/disbursement")}>
                                                <CheckCircle2 size={17} aria-hidden="true" />
                                                Track Disbursement
                                                <ArrowRight size={16} aria-hidden="true" />
                                            </button>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="applications-empty-state">
                            <div className="applications-empty-icon" aria-hidden="true"><FolderOpen size={42} /></div>
                            <h3>No applications found</h3>
                            <p>Try changing your search or filters, or browse available schemes to submit a new application.</p>
                            <button className="browse-schemes-btn" onClick={() => navigate("/beneficiary/schemes")}>
                                Browse Schemes <ArrowRight size={17} aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default MyApplications;
