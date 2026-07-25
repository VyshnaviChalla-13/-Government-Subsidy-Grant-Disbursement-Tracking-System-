import "./SchemeDetails.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Building2, CalendarDays, FileStack, FileText, Gift, Globe, IndianRupee, Send, UserCheck } from "lucide-react";

const schemes = {
    1: {
        title: "Farmer Assistance Scheme", subtitle: "Financial support for eligible farmers to improve agricultural productivity.", department: "Agriculture", amount: "₹50,000", deadline: "31 Dec 2026", type: "Subsidy", status: "Open", mode: "Online",
        description: "This scheme provides financial assistance to eligible farmers for purchasing seeds, fertilizers, agricultural equipment and improving irrigation facilities.",
        eligibility: ["Indian farmer.", "Owns or cultivates agricultural land.", "Valid land records.", "Annual agricultural income within scheme limits."],
        documents: ["Aadhaar Card", "Land Ownership Certificate", "Income Certificate", "Bank Passbook", "Farmer ID"],
        benefits: ["Subsidy up to ₹50,000.", "Direct Benefit Transfer (DBT).", "Agricultural equipment assistance.", "Crop support."]
    },
    2: {
        title: "Student Scholarship Scheme", subtitle: "Scholarships for deserving students pursuing higher education.", department: "Education", amount: "₹25,000", deadline: "15 Nov 2026", type: "Scholarship", status: "Open", mode: "Online",
        description: "This scheme provides financial assistance to eligible students for continuing higher education.",
        eligibility: ["Indian citizen.", "Currently enrolled in a recognized school/college.", "Minimum 60% marks in previous examination.", "Annual family income below ₹2,50,000."],
        documents: ["Aadhaar Card", "Student ID Card", "Previous Marksheet", "Income Certificate", "Bonafide Certificate", "Bank Passbook"],
        benefits: ["Scholarship up to ₹50,000 per academic year.", "Direct transfer to bank account.", "Tuition fee assistance.", "Educational support."]
    },
    3: {
        title: "Affordable Housing Scheme", subtitle: "Housing assistance for economically weaker families.", department: "Housing", amount: "₹2,00,000", deadline: "20 Oct 2026", type: "Housing", status: "Open", mode: "Online",
        description: "This scheme supports economically weaker families by providing housing assistance.",
        eligibility: ["Indian citizen.", "First-time home buyer.", "Annual family income within government limits.", "Applicant must not own a pucca house."],
        documents: ["Aadhaar Card", "PAN Card", "Income Certificate", "Property Documents", "Loan Sanction Letter", "Bank Passbook"],
        benefits: ["Interest subsidy on home loan.", "Affordable housing support.", "Reduced EMI burden.", "Government-backed financial assistance."]
    },
    4: {
        title: "Women Empowerment Scheme", subtitle: "Support for women entrepreneurship and welfare.", department: "Social Welfare", amount: "₹75,000", deadline: "10 Jan 2027", type: "Welfare", status: "Open", mode: "Online",
        description: "This scheme promotes women entrepreneurship and social welfare through financial assistance.",
        eligibility: ["Indian woman aged 18 years or above.", "Member of Self Help Group (SHG) or entrepreneur.", "Annual family income below ₹3,00,000.", "Valid Aadhaar."],
        documents: ["Aadhaar Card", "Income Certificate", "SHG Membership Proof", "Bank Passbook", "Passport Size Photo"],
        benefits: ["Financial assistance up to ₹1,00,000.", "Skill development training.", "Entrepreneurship support.", "Subsidized business loans."]
    },
    5: {
        title: "Senior Citizen Pension Scheme", subtitle: "Monthly financial support for eligible senior citizens.", department: "Social Welfare", amount: "₹1,000 per month", deadline: "31 Mar 2027", type: "Pension", status: "Open", mode: "Online",
        description: "This scheme provides monthly pension support to eligible senior citizens to help meet their essential expenses.",
        eligibility: ["Indian citizen.", "Age 60 years or above.", "Annual family income below scheme limit.", "Not receiving another government pension."],
        documents: ["Aadhaar Card", "Age Proof", "Income Certificate", "Bank Passbook", "Passport Size Photo"],
        benefits: ["Monthly pension.", "Direct DBT.", "Financial security.", "Social welfare assistance."]
    }
};

const genericScheme = {
    ...schemes[1],
    eligibility: ["Applicant must be an Indian citizen.", "Meet the scheme-specific eligibility requirements."],
    documents: ["Aadhaar Card", "Income Certificate", "Bank Passbook"],
    benefits: ["Financial assistance as per scheme guidelines.", "Direct Benefit Transfer (DBT), where applicable."]
};

function SchemeDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const fromPublic = location.state?.fromPublic || false;
    const { id } = useParams();
    const scheme = schemes[id] || genericScheme;
    const overviewItems = [
        { label: "Department", value: scheme.department, icon: Building2 },
        { label: "Grant Amount", value: scheme.amount, icon: IndianRupee },
        { label: "Application Deadline", value: scheme.deadline, icon: CalendarDays },
        { label: "Scheme Type", value: scheme.type, icon: FileText },
        { label: "Application Mode", value: scheme.mode, icon: Globe }
    ];

    const renderList = (items) => items.map((item) => <li key={item}>{item}</li>);

    return (
        <div className="scheme-details-page">
            <div className="container py-4 py-md-5">
                <section className="details-hero">
                    <div className="details-hero-content">
                        <span className="details-eyebrow">Government Welfare Portal</span>
                        <h1>{scheme.title}</h1><p>{scheme.subtitle}</p>
                        <div className="details-hero-meta">
                            <span className="status-badge"><BadgeCheck size={17} aria-hidden="true" />{scheme.status}</span>
                            <span className="hero-department"><Building2 size={17} aria-hidden="true" />{scheme.department} Department</span>
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
                    <section className="details-card"><div className="card-heading"><div className="card-heading-icon"><UserCheck size={21} aria-hidden="true" /></div><h2>Eligibility Criteria</h2></div><ul className="details-list">{renderList(scheme.eligibility)}</ul></section>
                    <section className="details-card"><div className="card-heading"><div className="card-heading-icon"><FileStack size={21} aria-hidden="true" /></div><h2>Required Documents</h2></div><ul className="details-list">{renderList(scheme.documents)}</ul></section>
                    <section className="details-card"><div className="card-heading"><div className="card-heading-icon"><Gift size={21} aria-hidden="true" /></div><h2>Benefits</h2></div><ul className="details-list">{renderList(scheme.benefits)}</ul></section>
                </div>

                <section className="details-actions">
                    <button className="back-btn" onClick={() => navigate("/beneficiary/schemes", { state: { fromPublic } })}><ArrowLeft size={18} aria-hidden="true" /> Back to Schemes</button>
                    <button className="apply-details-btn" onClick={() => { if (fromPublic) { navigate("/login", { state: { fromApply: true, schemeId: id } }); } else { navigate("/beneficiary/apply", { state: { schemeId: id } }); } }}>Apply Now <Send size={18} aria-hidden="true" /></button>
                </section>
            </div>
        </div>
    );
}

export default SchemeDetails;
