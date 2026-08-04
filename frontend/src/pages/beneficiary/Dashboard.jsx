import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllApplications } from "../../api/applicationApi";
import { getAllUsers } from "../../api/userApi";

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
}

function getDisplayStatus(status) {
  if (["APPROVED", "DISBURSED"].includes(status)) return "Approved";
  if (["RETURNED", "REJECTED"].includes(status)) return "Returned";
  return "Under Review";
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const [allApplications, allUsers] = await Promise.all([
          getAllApplications(),
          getAllUsers(),
        ]);
        const currentUser = allUsers.find((item) =>
          item.userId === storedUser?.userId ||
          item.userId === storedUser?.id ||
          item.mobileNumber === storedUser?.mobileNumber
        );

        if (!currentUser) {
          throw new Error("Unable to load the logged-in user's dashboard data.");
        }

        const userApplications = allApplications
          .filter((application) => application.beneficiary?.userId === currentUser.userId)
          .map((application) => ({
            id: application.applicationId,
            scheme: application.scheme?.schemeName,
            date: formatDate(application.submittedAt),
            status: getDisplayStatus(application.status),
            remarks: application.remarks,
          }));

        setUser(currentUser);
        setApplications(userApplications);
      } catch (err) {
        setError(err.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const statistics = {
    total: applications.length,
    approved: applications.filter((application) => application.status === "Approved").length,
    underReview: applications.filter((application) => application.status === "Under Review").length,
    returned: applications.filter((application) => application.status === "Returned").length,
  };

  const notifications = applications.slice(0, 3).map((application) =>
    application.remarks || `Your ${application.scheme} application is ${application.status.toLowerCase()}.`
  );

  return (
    <div className="dashboard-page">
      <div className="container py-4">

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        {/* ================= HERO ================= */}

        <div className="dashboard-hero">

          <div className="hero-content">

            <span className="hero-tag">
              Government Welfare Portal
            </span>

            <h1>
              Welcome Back{user?.fullName ? `, ${user.fullName}` : ""}
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

                <h3>{loading ? "..." : String(statistics.total).padStart(2, "0")}</h3>

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

                <h3>{loading ? "..." : String(statistics.approved).padStart(2, "0")}</h3>

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

                <h3>{loading ? "..." : String(statistics.underReview).padStart(2, "0")}</h3>

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

                <h3>{loading ? "..." : String(statistics.returned).padStart(2, "0")}</h3>

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

                  {loading ? (
                    <tr><td colSpan="3">Loading applications...</td></tr>
                  ) : applications.length > 0 ? applications.map((app) => (

                    <tr key={app.id}>

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

                  )) : (
                    <tr><td colSpan="3">No applications found.</td></tr>
                  )}

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

                {loading ? (
                  <p>Loading notifications...</p>
                ) : notifications.length > 0 ? notifications.map((note, index) => (

                  <div
                    className="notification-card"
                    key={index}
                  >

                    <div className="notify-icon">
                      <i className="bi bi-bell-fill" aria-hidden="true"></i>
                    </div>

                    <div>

                      <p>{note}</p>

                      <span>Recent</span>

                    </div>

                  </div>

                )) : (
                  <p>No notifications available.</p>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
