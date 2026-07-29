import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const applications = [
    {
      scheme: "Farmer Assistance",
      date: "10-Jul-2026",
      status: "Approved",
    },
    {
      scheme: "Student Scholarship",
      date: "12-Jul-2026",
      status: "Under Verification",
    },
    {
      scheme: "Affordable Housing",
      date: "15-Jul-2026",
      status: "Returned",
    },
  ];

  const notifications = [
    "Your Farmer Assistance application has been approved.",
    "Upload documents for Student Scholarship.",
    "Affordable Housing application returned for correction.",
  ];

  return (
    <div className="dashboard-page">
      <div className="container py-4">

        {/* ================= HERO ================= */}

        <div className="dashboard-hero">

          <div className="hero-content">

            <span className="hero-tag">
              Government Welfare Portal
            </span>

            <h1>
              Welcome Back
            </h1>

            <p>
              Track your applications, explore government schemes and
              manage your profile from one convenient dashboard.
            </p>

            <div className="hero-buttons">

              <button
                className="hero-btn primary-btn"
                onClick={() => navigate("/beneficiary/schemes")}
              >
                Browse Schemes
              </button>

              <button
                className="hero-btn secondary-btn"
                onClick={() => navigate("/beneficiary/apply")}
              >
                Apply Now
              </button>

            </div>

          </div>

          <div className="hero-icon">

            <div className="hero-circle">

              <i className="bi bi-bank2" aria-hidden="true"></i>

            </div>

          </div>

        </div>

        {/* ================= Statistics ================= */}

        <div className="row mt-5">

          <div className="col-lg-3 col-md-6 mb-4">

            <div className="stat-card">

              <div className="stat-icon dashboard-blue">
                <i className="bi bi-file-earmark-text-fill" aria-hidden="true"></i>
              </div>

              <div>

                <h3>05</h3>

                <p>Total Applications</p>

              </div>

            </div>

          </div>

          <div className="col-lg-3 col-md-6 mb-4">

            <div className="stat-card">

              <div className="stat-icon dashboard-green">
                <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
              </div>

              <div>

                <h3>02</h3>

                <p>Approved</p>

              </div>

            </div>

          </div>

          <div className="col-lg-3 col-md-6 mb-4">

            <div className="stat-card">

              <div className="stat-icon dashboard-orange">
                <i className="bi bi-hourglass-split" aria-hidden="true"></i>
              </div>

              <div>

                <h3>02</h3>

                <p>Under Review</p>

              </div>

            </div>

          </div>

          <div className="col-lg-3 col-md-6 mb-4">

            <div className="stat-card">

              <div className="stat-icon dashboard-red">
                <i className="bi bi-arrow-return-left" aria-hidden="true"></i>
              </div>

              <div>

                <h3>01</h3>

                <p>Returned</p>

              </div>

            </div>

          </div>

        </div>

        {/* ================= Quick Services ================= */}

        <div className="section-header">

          <h3>Quick Services</h3>

          <p>Access the most frequently used services.</p>

        </div>

        <div className="row">

          <div className="col-lg-3 col-md-6 mb-4">

            <div
              className="service-card"
              onClick={() => navigate("/beneficiary/schemes")}
            >

              <div className="service-icon">
                <i className="bi bi-book-half" aria-hidden="true"></i>
              </div>

              <h5>Browse Schemes</h5>

              <p>
                Explore all available government schemes.
              </p>

            </div>

          </div>

          <div className="col-lg-3 col-md-6 mb-4">

            <div
              className="service-card"
              onClick={() => navigate("/beneficiary/apply")}
            >

              <div className="service-icon">
                <i className="bi bi-pencil-square" aria-hidden="true"></i>
              </div>

              <h5>Apply Scheme</h5>

              <p>
                Submit a new application easily.
              </p>

            </div>

          </div>

          <div className="col-lg-3 col-md-6 mb-4">

            <div
              className="service-card"
              onClick={() =>
                navigate("/beneficiary/my-applications")
              }
            >

              <div className="service-icon">
                <i className="bi bi-folder2-open" aria-hidden="true"></i>
              </div>

              <h5>My Applications</h5>

              <p>
                Track the status of submitted applications.
              </p>

            </div>

          </div>

          <div className="col-lg-3 col-md-6 mb-4">

            <div
              className="service-card"
              onClick={() =>
                navigate("/beneficiary/profile")
              }
            >

              <div className="service-icon">
                <i className="bi bi-person-vcard-fill" aria-hidden="true"></i>
              </div>

              <h5>My Profile</h5>

              <p>
                View and update your profile information.
              </p>

            </div>

          </div>

        </div>

        {/* ================= Applications ================= */}

        <div className="row mt-4">

          <div className="col-lg-8">

            <div className="content-card">

              <div className="card-title-row">

                <h4>
                  Recent Applications
                </h4>

                <button
                  className="view-btn"
                  onClick={() =>
                    navigate("/beneficiary/my-applications")
                  }
                >
                  View All →
                </button>

              </div>

              <table className="table align-middle">

                <thead>

                  <tr>

                    <th>Scheme</th>

                    <th>Date</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {applications.map((app, index) => (

                    <tr key={index}>

                      <td>{app.scheme}</td>

                      <td>{app.date}</td>

                      <td>

                        <span
                          className={`status ${app.status
                            .replace(/\s/g, "")
                            .toLowerCase()}`}
                        >
                          {app.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* ================= Notifications ================= */}

          <div className="col-lg-4">

            <div className="content-card">

              <h4>
                Notifications
              </h4>

              <div className="notification-wrapper">

                {notifications.map((note, index) => (

                  <div
                    className="notification-card"
                    key={index}
                  >

                    <div className="notify-icon">
                      <i className="bi bi-bell-fill" aria-hidden="true"></i>
                    </div>

                    <div>

                      <p>{note}</p>

                      <span>Just Now</span>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;