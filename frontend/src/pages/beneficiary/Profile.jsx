import "./Profile.css";
import { useEffect, useState } from "react";
import { getUserById, updateUserById } from "../../api/userApi";
import {
    BriefcaseBusiness,
    Fingerprint,
    IndianRupee,
    Landmark,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    User,
    UserCircle
} from "lucide-react";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user") || "null");
                const userId = storedUser?.userId ?? storedUser?.id ?? localStorage.getItem("userId");

                if (!userId) {
                    throw new Error("Unable to identify the logged-in user.");
                }

                const userProfile = await getUserById(userId);

                setProfile(userProfile);
                setFormData(userProfile);
            } catch (err) {
                setError(err.message || "Unable to load your profile.");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
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

        try {
            const updatedProfile = await updateUserById(userId, formData);
            const nextProfile =
                updatedProfile && typeof updatedProfile === "object"
                    ? updatedProfile
                    : formData;

            setProfile(nextProfile);
            setFormData(nextProfile);
        } catch (err) {
            setError(err.message || "Unable to update your profile.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="profile-page">
                <div className="container py-4 py-md-5">Loading profile...</div>
            </div>
        );
    }

    return (

        <div className="profile-page">
            <div className="container py-4 py-md-5">
                <section className="profile-hero">
                    <div className="profile-hero-content">
                        <span className="profile-eyebrow">Government Welfare Portal</span>
                        <h1>My Profile</h1>
                        <p>View and update your beneficiary profile securely in one place.</p>
                    </div>
                    <div className="profile-hero-icon" aria-hidden="true">
                        <UserCircle size={88} strokeWidth={1.5} />
                    </div>
                </section>

                <div className="profile-layout">
                    <aside className="profile-summary-card">
                        <div className="profile-avatar" aria-hidden="true">
                            <User size={34} />
                        </div>
                        <h2>{profile?.fullName}</h2>
                        <p>Beneficiary Account</p>
                        <div className="profile-verified">
                            <ShieldCheck size={17} aria-hidden="true" />
                            Verified Profile
                        </div>
                        <div className="profile-summary-list">
                            <div><Fingerprint size={18} aria-hidden="true" /><span>Aadhaar linked</span></div>
                            <div><BriefcaseBusiness size={18} aria-hidden="true" /><span>{profile?.occupation}</span></div>
                            <div><MapPin size={18} aria-hidden="true" /><span>{profile?.address}</span></div>
                        </div>
                    </aside>

                    <section className="profile-card">
                        <div className="profile-card-heading">
                            <div>
                                <span className="profile-section-kicker">Account information</span>
                                <h2>Personal Details</h2>
                            </div>
                            <ShieldCheck size={24} aria-hidden="true" />
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

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

    );

}

export default Profile;
