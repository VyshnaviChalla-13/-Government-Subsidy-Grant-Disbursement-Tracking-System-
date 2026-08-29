import "./Profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUserById } from "../../api/userApi";
import { getMyApplications } from "../../api/applicationApi";
import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    DollarSign,
    ExternalLink,
    Fingerprint,
    HandCoins,
    IndianRupee,
    Landmark,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    User,
    UserCircle,
    Wallet
} from "lucide-react";

function formatCurrency(amount) {
    if (amount == null) return "₹0";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        async function fetchProfileData() {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user") || "null");
                const userId = storedUser?.userId ?? storedUser?.id ?? localStorage.getItem("userId");

                if (!userId) {
                    throw new Error("Unable to identify the logged-in user.");
                }

                // 1. Fetch user profile
                const userProfile = await getUserById(userId);
                setProfile(userProfile);
                setFormData(userProfile);

                // 2. Fetch beneficiary's applications
                try {
                    const apps = await getMyApplications();
                    setApplications(Array.isArray(apps) ? apps : []);
                } catch (appErr) {
                    console.warn("Failed to fetch applications for profile:", appErr);
                    setApplications([]);
                }
            } catch (err) {
                setError(err.message || "Unable to load your profile.");
            } finally {
                setLoading(false);
            }
        }

        fetchProfileData();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: name === "annualIncome" && value !== "" ? Number(value) : value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const userId = profile?.userId ?? profile?.id;

        if (!userId) {
            setError("Unable to identify the user profile to update.");
            return;
        }

        setSaving(true);
        setError("");
        setSaveSuccess(false);

        try {
            const updatedProfile = await updateUserById(userId, formData);
            const nextProfile =
                updatedProfile && typeof updatedProfile === "object"
                    ? updatedProfile
                    : formData;

            setProfile(nextProfile);
            setFormData(nextProfile);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setError(err.message || "Unable to update your profile.");
        } finally {
            setSaving(false);
        }
    }

    // Calculations for grants and disbursement
    const isDisbursed =
        String(profile?.status).toUpperCase() === "DISBURSED" ||
        applications.some((a) =>
            ["DISBURSED", "STAGE_RELEASED"].includes(String(a.status).toUpperCase())
        );

    const approvedApps = applications.filter((a) =>
        ["DISBURSED", "STAGE_RELEASED", "APPROVED", "VERIFICATION_APPROVED"].includes(
            String(a.status).toUpperCase()
        )
    );

    const totalGrantedAmount = approvedApps.reduce((sum, a) => {
        const amt = a.scheme?.maxSubsidyAmount || a.scheme?.maxGrant || 0;
        return sum + Number(amt);
    }, 0);

    const totalDisbursedAmount = applications.reduce((sum, a) => {
        const s = String(a.status).toUpperCase();
        if (s === "DISBURSED") {
            return sum + Number(a.scheme?.maxSubsidyAmount || a.scheme?.maxGrant || 0);
        }
        if (s === "STAGE_RELEASED") {
            return sum + Math.round(Number(a.scheme?.maxSubsidyAmount || a.scheme?.maxGrant || 0) / 2);
        }
        return sum;
    }, 0);

    const effectiveStatus = isDisbursed
        ? "DISBURSED"
        : approvedApps.length > 0
        ? "APPROVED"
        : profile?.status || "PENDING";

    if (loading) {
        return (
            <div className="profile-page">
                <div className="container py-5 text-center">
                    <div className="spinner-border text-primary mb-3" role="status"></div>
                    <p className="text-muted">Loading your profile & grant status...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container py-4 py-md-5">
                {/* Hero Section */}
                <section className="profile-hero">
                    <div className="profile-hero-content">
                        <span className="profile-eyebrow">Government Welfare Portal</span>
                        <h1>My Profile & Grant Summary</h1>
                        <p>View your beneficiary credentials, linked DBT bank account, and real-time grant disbursement status.</p>

                        {/* Summary Badges in Hero */}
                        <div className="d-flex flex-wrap gap-2 mt-3 align-items-center">
                            <span className={`badge ${effectiveStatus === "DISBURSED" ? "bg-success" : effectiveStatus === "APPROVED" ? "bg-primary" : "bg-warning text-dark"} px-3 py-2 fs-6`}>
                                Status: {effectiveStatus}
                            </span>
                            {totalGrantedAmount > 0 && (
                                <span className="badge bg-light text-dark px-3 py-2 fs-6">
                                    Granted: {formatCurrency(totalGrantedAmount)}
                                </span>
                            )}
                            {totalDisbursedAmount > 0 && (
                                <span className="badge bg-info text-dark px-3 py-2 fs-6">
                                    Disbursed: {formatCurrency(totalDisbursedAmount)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="profile-hero-icon" aria-hidden="true">
                        <UserCircle size={88} strokeWidth={1.5} />
                    </div>
                </section>

                <div className="profile-layout">
                    {/* Left Sidebar */}
                    <aside className="profile-summary-card">
                        <div className="profile-avatar" aria-hidden="true">
                            <User size={34} />
                        </div>
                        <h2>{profile?.fullName || "Beneficiary"}</h2>
                        <p>Beneficiary Citizen Account</p>

                        <div className={`profile-status-badge ${effectiveStatus === "DISBURSED" ? "disbursed" : effectiveStatus === "APPROVED" ? "approved" : "pending"}`}>
                            {effectiveStatus === "DISBURSED" ? (
                                <CheckCircle2 size={16} />
                            ) : (
                                <ShieldCheck size={16} />
                            )}
                            Status: {effectiveStatus}
                        </div>

                        {/* Granted & Disbursed Stats */}
                        <div className="profile-financial-summary mt-3">
                            <div className="financial-stat-box">
                                <span className="stat-label">Total Grant Sanctioned</span>
                                <strong className="stat-value text-primary">{formatCurrency(totalGrantedAmount)}</strong>
                            </div>
                            <div className="financial-stat-box mt-2">
                                <span className="stat-label">Amount Disbursed (DBT)</span>
                                <strong className="stat-value text-success">{formatCurrency(totalDisbursedAmount)}</strong>
                            </div>
                        </div>

                        <div className="profile-summary-list">
                            <div>
                                <Fingerprint size={18} aria-hidden="true" />
                                <span>Aadhaar: {profile?.aadhaarNumber ? `XXXX XXXX ${String(profile.aadhaarNumber).slice(-4)}` : "Linked"}</span>
                            </div>
                            <div>
                                <Landmark size={18} aria-hidden="true" />
                                <span>{profile?.bankName ? `${profile.bankName}` : "Bank Account Linked"}</span>
                            </div>
                            <div>
                                <BriefcaseBusiness size={18} aria-hidden="true" />
                                <span>{profile?.occupation || "Self-Employed"}</span>
                            </div>
                            <div>
                                <MapPin size={18} aria-hidden="true" />
                                <span>{profile?.address || "Registered Address"}</span>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="d-flex flex-column gap-4">
                        {/* 1. DBT & Granted Subsidies Card */}
                        <section className="profile-card">
                            <div className="profile-card-heading">
                                <div>
                                    <span className="profile-section-kicker">Direct Benefit Transfer</span>
                                    <h2>Granted Subsidies & Disbursement Status</h2>
                                </div>
                                <HandCoins size={28} className="text-primary" aria-hidden="true" />
                            </div>

                            {applications.length === 0 ? (
                                <div className="p-4 text-center text-muted bg-light rounded-3">
                                    <Clock3 size={32} className="mb-2 text-muted" />
                                    <p className="mb-2">No subsidy applications registered yet.</p>
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => navigate("/beneficiary/schemes")}
                                    >
                                        Explore & Apply for Schemes
                                    </button>
                                </div>
                            ) : (
                                <div className="grant-schemes-list">
                                    {applications.map((app) => {
                                        const appStatus = String(app.status || "").toUpperCase();
                                        const grantAmt = app.scheme?.maxSubsidyAmount || app.scheme?.maxGrant || 0;
                                        const isAppDisbursed = appStatus === "DISBURSED" || appStatus === "STAGE_RELEASED";

                                        return (
                                            <div className={`grant-scheme-item ${isAppDisbursed ? "disbursed-item" : ""}`} key={app.applicationId || app.id}>
                                                <div className="grant-scheme-header">
                                                    <div>
                                                        <h4 className="grant-scheme-title">
                                                            {app.scheme?.schemeName || "Government Welfare Scheme"}
                                                        </h4>
                                                        <span className="grant-scheme-ref">
                                                            Application #{app.applicationNumber || app.applicationId} • {app.scheme?.department?.departmentName || "Welfare Dept"}
                                                        </span>
                                                    </div>
                                                    <span className={`grant-status-pill ${isAppDisbursed ? "pill-disbursed" : appStatus === "VERIFICATION_APPROVED" || appStatus === "APPROVED" ? "pill-approved" : "pill-pending"}`}>
                                                        {isAppDisbursed ? "✓ DISBURSED" : appStatus}
                                                    </span>
                                                </div>

                                                <div className="grant-scheme-metrics">
                                                    <div className="metric-chip">
                                                        <span>Sanctioned Grant</span>
                                                        <strong>{formatCurrency(grantAmt)}</strong>
                                                    </div>
                                                    <div className="metric-chip">
                                                        <span>Disbursement Status</span>
                                                        <strong className={isAppDisbursed ? "text-success" : "text-primary"}>
                                                            {isAppDisbursed ? "Amount Credited" : "In Processing"}
                                                        </strong>
                                                    </div>
                                                    <div className="metric-chip">
                                                        <span>Credited Bank</span>
                                                        <strong>{profile?.bankName || "Linked Account"} ({profile?.accountNumber ? `...${String(profile.accountNumber).slice(-4)}` : "Verified"})</strong>
                                                    </div>
                                                </div>

                                                <div className="grant-scheme-actions mt-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => navigate(`/beneficiary/disbursement?applicationId=${app.applicationId || app.id}`)}
                                                    >
                                                        <Wallet size={14} className="me-1" /> View Disbursement Tracker
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-link text-decoration-none"
                                                        onClick={() => navigate(`/beneficiary/timeline/${app.applicationId || app.id}`)}
                                                    >
                                                        <ExternalLink size={14} className="me-1" /> Timeline
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* 2. Personal Details Form */}
                        <section className="profile-card">
                            <div className="profile-card-heading">
                                <div>
                                    <span className="profile-section-kicker">Account Information</span>
                                    <h2>Personal & Banking Details</h2>
                                </div>
                                <ShieldCheck size={24} aria-hidden="true" />
                            </div>

                            {error && <div className="alert alert-danger mb-3">{error}</div>}
                            {saveSuccess && <div className="alert alert-success mb-3">✓ Profile updated successfully!</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row profile-form-row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="full-name"><User size={16} aria-hidden="true" />Full Name</label>
                                        <input id="full-name" name="fullName" type="text" className="form-control" value={formData.fullName ?? ""} onChange={handleChange} />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="aadhaar-number"><Fingerprint size={16} aria-hidden="true" />Aadhaar Number</label>
                                        <input id="aadhaar-number" name="aadhaarNumber" type="text" className="form-control" value={formData.aadhaarNumber ?? ""} onChange={handleChange} />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="mobile-number"><Phone size={16} aria-hidden="true" />Mobile Number</label>
                                        <input id="mobile-number" name="mobileNumber" type="text" className="form-control" value={formData.mobileNumber ?? ""} onChange={handleChange} />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="annual-income"><IndianRupee size={16} aria-hidden="true" />Annual Income</label>
                                        <input id="annual-income" name="annualIncome" type="number" className="form-control" value={formData.annualIncome ?? ""} onChange={handleChange} />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="occupation"><BriefcaseBusiness size={16} aria-hidden="true" />Occupation</label>
                                        <input id="occupation" name="occupation" type="text" className="form-control" value={formData.occupation ?? ""} onChange={handleChange} />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="bank-account"><Landmark size={16} aria-hidden="true" />Bank Account Number</label>
                                        <input id="bank-account" name="accountNumber" type="text" className="form-control" value={formData.accountNumber ?? ""} onChange={handleChange} />
                                    </div>

                                    <div className="col-12 mb-3">
                                        <label className="form-label" htmlFor="address"><MapPin size={16} aria-hidden="true" />Address</label>
                                        <textarea id="address" name="address" className="form-control" rows="3" value={formData.address ?? ""} onChange={handleChange}></textarea>
                                    </div>
                                </div>

                                <div className="profile-form-actions">
                                    <button className="update-profile-btn" type="submit" disabled={saving}>
                                        <Save size={18} aria-hidden="true" />
                                        {saving ? "Saving..." : "Update Profile"}
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
