import "./Profile.css";

function Profile() {

    return (

        <div className="profile-page">

            <div className="container py-5">

                <h2 className="text-primary mb-3">
                    My Profile
                </h2>

                <p className="text-muted mb-4">
                    View and update your beneficiary profile.
                </p>

                <div className="profile-card">

                    <form>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue="Deepak Priyan"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Aadhaar Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue="1234 5678 9012"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Mobile Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue="9876543210"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Annual Income
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    defaultValue="150000"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Occupation
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue="Farmer"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Bank Account Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue="123456789012"
                                />

                            </div>

                            <div className="col-12 mb-3">

                                <label className="form-label">
                                    Address
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    defaultValue="Salem, Tamil Nadu"
                                ></textarea>

                            </div>

                        </div>

                        <div className="mt-4">

                            <button
                                className="btn btn-primary"
                                type="submit"
                            >
                                Update Profile
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default Profile;