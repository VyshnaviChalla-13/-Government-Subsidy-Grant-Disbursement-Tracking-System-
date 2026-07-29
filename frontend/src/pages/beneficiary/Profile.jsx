import "./Profile.css";
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
                        <h2>Beneficiary Name</h2>
                        <p>Beneficiary Account</p>
                        <div className="profile-verified">
                            <ShieldCheck size={17} aria-hidden="true" />
                            Verified Profile
                        </div>
                        <div className="profile-summary-list">
                            <div><Fingerprint size={18} aria-hidden="true" /><span>Aadhaar linked</span></div>
                            <div><BriefcaseBusiness size={18} aria-hidden="true" /><span>Farmer</span></div>
                            <div><MapPin size={18} aria-hidden="true" /><span>Salem, Tamil Nadu</span></div>
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

                        <form>
                            <div className="row profile-form-row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="full-name"><User size={16} aria-hidden="true" />Full Name</label>
                                    <input id="full-name" type="text" className="form-control" defaultValue="Beneficiary Name" />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="aadhaar-number"><Fingerprint size={16} aria-hidden="true" />Aadhaar Number</label>
                                    <input id="aadhaar-number" type="text" className="form-control" defaultValue="1234 5678 9012" />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="mobile-number"><Phone size={16} aria-hidden="true" />Mobile Number</label>
                                    <input id="mobile-number" type="text" className="form-control" defaultValue="9876543210" />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="annual-income"><IndianRupee size={16} aria-hidden="true" />Annual Income</label>
                                    <input id="annual-income" type="number" className="form-control" defaultValue="150000" />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="occupation"><BriefcaseBusiness size={16} aria-hidden="true" />Occupation</label>
                                    <input id="occupation" type="text" className="form-control" defaultValue="Farmer" />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label" htmlFor="bank-account"><Landmark size={16} aria-hidden="true" />Bank Account Number</label>
                                    <input id="bank-account" type="text" className="form-control" defaultValue="123456789012" />
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="form-label" htmlFor="address"><MapPin size={16} aria-hidden="true" />Address</label>
                                    <textarea id="address" className="form-control" rows="3" defaultValue="Salem, Tamil Nadu"></textarea>
                                </div>
                            </div>

                            <div className="profile-form-actions">
                                <button className="update-profile-btn" type="submit">
                                    <Save size={18} aria-hidden="true" />
                                    Update Profile
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
