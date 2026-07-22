import "../styles/contact.css";

function Contact() {
    return (
        <div className="contact-page">

            <div className="container py-5">

                <div className="text-center mb-5">
                    <h1 className="contact-title">
                        Contact Us
                    </h1>

                    <p className="contact-subtitle">
                        Have questions or need assistance? We're here to help you.
                    </p>
                </div>

                <div className="row g-4">

                    {/* Contact Information */}

                    <div className="col-lg-5">

                        <div className="contact-card">

                            <h3 className="mb-4">
                                Contact Information
                            </h3>

                            <div className="contact-item">

                                <h5>📍 Office Address</h5>

                                <p>
                                    Government Welfare Department<br />
                                    Hyderabad, Telangana, India
                                </p>

                            </div>

                            <div className="contact-item">

                                <h5>📞 Phone</h5>

                                <p>1800-123-4567</p>

                            </div>

                            <div className="contact-item">

                                <h5>📧 Email</h5>

                                <p>support@govportal.gov.in</p>

                            </div>

                            <div className="contact-item">

                                <h5>🕒 Working Hours</h5>

                                <p>
                                    Monday - Friday<br />
                                    9:00 AM - 6:00 PM
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Contact Form */}

                    <div className="col-lg-7">

                        <div className="contact-card">

                            <h3 className="mb-4">
                                Send us a Message
                            </h3>

                            <form>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your full name"
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Subject
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter subject"
                                    />

                                </div>

                                <div className="mb-4">

                                    <label className="form-label">
                                        Message
                                    </label>

                                    <textarea
                                        rows="5"
                                        className="form-control"
                                        placeholder="Write your message..."
                                    ></textarea>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary contact-btn"
                                >
                                    Send Message
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Contact;