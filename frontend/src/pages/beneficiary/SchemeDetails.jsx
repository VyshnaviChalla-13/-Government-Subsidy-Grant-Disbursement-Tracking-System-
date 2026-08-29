import "./SchemeDetails.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getSchemeById } from "../../api/schemeApi";
import { ArrowLeft, BadgeCheck, Building2, CalendarDays, FileStack, FileText, Gift, Globe, IndianRupee, Send, UserCheck } from "lucide-react";

const formatCurrency = (amount) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
}).format(Number(amount));

const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsedDate.getTime())
        ? "Not available"
        : new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(parsedDate);
};

function SchemeDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const fromPublic = location.state?.fromPublic || false;
    const { id } = useParams();
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id || !/^\d+$/.test(id)) {
            setError("The requested scheme could not be found.");
            setLoading(false);
            return;
        }

        const fetchScheme = async () => {
            try {
                setLoading(true);
                setError("");
                setScheme(await getSchemeById(id));
            } catch {
                setError("We couldn't load this scheme right now. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchScheme();
    }, [id]);

    const renderList = (items) => items.map((item) => <li key={item}>{item}</li>);

    if (loading || error || !scheme) {
        return (
            <div className="scheme-details-page">
                <div className="container py-4 py-md-5">
                    <section className="details-section text-center">
                        <div className="section-heading">
                            <span className="section-kicker">Government Welfare Portal</span>
                            <h2>{loading ? "Loading scheme details" : "Scheme unavailable"}</h2>
                            <p>{loading ? "Please wait while we retrieve the scheme information." : error}</p>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    const eligibility = [
        scheme.maximumIncome != null && `Maximum annual income: ${formatCurrency(scheme.maximumIncome)}.`,
        scheme.minimumScore != null && `Minimum score required: ${scheme.minimumScore}.`,
        scheme.eligibilityScore != null && `Eligibility score: ${scheme.eligibilityScore}.`,
    ].filter(Boolean);
    const benefits = [
        scheme.minGrant != null && `Minimum grant: ${formatCurrency(scheme.minGrant)}.`,
        scheme.maxGrant != null && `Maximum grant: ${formatCurrency(scheme.maxGrant)}.`,
        scheme.totalBudget != null && `Total scheme budget: ${formatCurrency(scheme.totalBudget)}.`,
    ].filter(Boolean);
    const overviewItems = [
        { label: "Department", value: scheme.department?.departmentName, icon: Building2 },
        { label: "Grant Amount", value: formatCurrency(scheme.maxGrant), icon: IndianRupee },
        { label: "Application Deadline", value: formatDate(scheme.applicationEndDate), icon: CalendarDays },
        { label: "Application Start Date", value: formatDate(scheme.applicationStartDate), icon: FileText },
        { label: "Eligibility Score", value: scheme.eligibilityScore, icon: Globe }
    ];

    return (
        <div className="scheme-details-page">
            <div className="container py-4 py-md-5">
                <section className="details-hero">
                    <div className="details-hero-content">
                        <span className="details-eyebrow">Government Welfare Portal</span>
                        <h1>{scheme.schemeName}</h1><p>{scheme.description}</p>
                        <div className="details-hero-meta">
                            <span className="status-badge"><BadgeCheck size={17} aria-hidden="true" />{scheme.status}</span>
                            <span className="hero-department"><Building2 size={17} aria-hidden="true" />{scheme.department?.departmentName} Department</span>
                        </div>
                    </div>
                    <div className="details-hero-icon" aria-hidden="true"><FileText size={82} strokeWidth={1.5} /></div>
                </section>

                <section className="details-section">
                    <div className="section-heading"><span className="section-kicker">At a glance</span><h2>Scheme Overview</h2><p>Key information about this government welfare scheme.</p></div>
                    <div className="overview-grid">
                        {overviewItems.map(({ label, value, icon: Icon }) => <div className="overview-card" key={label}><div className="overview-icon"><Icon size={22} aria-hidden="true" /></div><div><span>{label}</span><strong>{value}</strong></div></div>)}
                    </div>
                </section>

                <div className="details-content-grid">
                    <section className="details-card description-card"><div className="card-heading"><div className="card-heading-icon"><FileText size={21} aria-hidden="true" /></div><h2>Description</h2></div><p>{scheme.description}</p></section>
                    <section className="details-card"><div className="card-heading"><div className="card-heading-icon"><UserCheck size={21} aria-hidden="true" /></div><h2>Eligibility Criteria</h2></div><ul className="details-list">{eligibility.length ? renderList(eligibility) : <li>Eligibility requirements are not available for this scheme.</li>}</ul></section>
                    <section className="details-card"><div className="card-heading"><div className="card-heading-icon"><FileStack size={21} aria-hidden="true" /></div><h2>Required Documents</h2></div><ul className="details-list"><li>Required document information is not available for this scheme.</li></ul></section>
                    <section className="details-card"><div className="card-heading"><div className="card-heading-icon"><Gift size={21} aria-hidden="true" /></div><h2>Benefits</h2></div><ul className="details-list">{benefits.length ? renderList(benefits) : <li>Benefit information is not available for this scheme.</li>}</ul></section>
                </div>

                <section className="details-actions">
                    <button className="back-btn" onClick={() => navigate("/beneficiary/schemes", { state: { fromPublic } })}><ArrowLeft size={18} aria-hidden="true" /> Back to Schemes</button>
                    <button className="apply-details-btn" onClick={() => { if (fromPublic) { navigate("/login", { state: { fromApply: true, schemeId: scheme.schemeId } }); } else { navigate("/beneficiary/apply", { state: { schemeId: scheme.schemeId } }); } }}>Apply Now <Send size={18} aria-hidden="true" /></button>
                </section>
            </div>
        </div>
    );
}

export default SchemeDetails;
