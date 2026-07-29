import "./FinanceDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import defaultApplications from "../../data/applications";

import {
    getApplications,
    saveApplications,
} from "../../utils/applicationStorage";
function FinanceDashboard() {

    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const allApplications = getApplications(defaultApplications);

        const approvedApplications = allApplications
            .filter(
                app =>
                    app.status === "Approved" ||
                    app.status === "Payment Completed"
            )
            .map(app => ({
                id: app.id,
                beneficiary: app.applicant,
                scheme: app.scheme,
                amount: app.amount || "₹25,000",

                status:
                    app.status === "Payment Completed"
                        ? "Completed"
                        : "Pending",

                bank: "State Bank of India",
                account: "XXXX1234",
                ifsc: "SBIN0001234",
                date: app.submittedDate
            }));

        setPayments(approvedApplications);
    }, []);

    const handlePayment = (id) => {

        const updatedApplications = getApplications(defaultApplications).map(app =>
            app.id === id
                ? { ...app, status: "Payment Completed" }
                : app
        );

        saveApplications(updatedApplications);

        const updatedPayments = payments.map(payment =>
            payment.id === id
                ? { ...payment, status: "Completed" }
                : payment
        );

        setPayments(updatedPayments);
    };
    return (
        <div className="finance-dashboard">

            <h1>Finance Officer Dashboard</h1>
            <p>Manage approved applications and process beneficiary payments.</p>

            <div className="stats-container">

                <div className="stat-card">
                    <h3>Total Payments</h3>
                    <p>{payments.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Pending</h3>
                    <p>
                        {
                            payments.filter(
                                payment => payment.status === "Pending"
                            ).length
                        }
                    </p>
                </div>

                <div className="stat-card">
                    <h3>Completed</h3>
                    <p>
                        {
                            payments.filter(
                                payment => payment.status === "Completed"
                            ).length
                        }
                    </p>
                </div>

                <div className="stat-card">
                    <h3>Failed</h3>
                    <p>
                        {
                            payments.filter(
                                payment => payment.status === "Failed"
                            ).length
                        }
                    </p>
                </div>

            </div>

            <div className="filters">

                <input
                    type="text"
                    placeholder="Search by ID or Beneficiary..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={schemeFilter}
                    onChange={(e) => setSchemeFilter(e.target.value)}
                >
                    <option value="All">All Schemes</option>
                    <option value="Farmer Assistance Scheme">Farmer Assistance Scheme</option>
                    <option value="Student Scholarship Scheme">Student Scholarship Scheme</option>
                    <option value="Affordable Housing Scheme">Affordable Housing Scheme</option>
                    <option value="Women Empowerment Scheme">Women Empowerment Scheme</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                </select>

            </div>
            <table className="payment-table">

                <thead>

                <tr>
                    <th>Application ID</th>
                    <th>Beneficiary</th>
                    <th>Scheme</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>

                </thead>

                <tbody>

                {payments
                    .filter((payment) => {
                        const matchesSearch =
                            payment.id.toLowerCase().includes(search.toLowerCase()) ||
                            payment.beneficiary.toLowerCase().includes(search.toLowerCase());

                        const matchesScheme =
                            schemeFilter === "All" ||
                            payment.scheme === schemeFilter;

                        const matchesStatus =
                            statusFilter === "All" ||
                            payment.status === statusFilter;

                        return matchesSearch && matchesScheme && matchesStatus;
                    })
                    .map((payment) => (

                        <tr key={payment.id}>

                            <td>{payment.id}</td>

                            <td>{payment.beneficiary}</td>

                            <td>{payment.scheme}</td>

                            <td>{payment.amount}</td>

                            <td>
                                    <span
                                        className={
                                            payment.status === "Completed"
                                                ? "status completed"
                                                : payment.status === "Failed"
                                                    ? "status failed"
                                                    : "status pending"
                                        }
                                    >
                                        {payment.status}
                                    </span>
                            </td>

                            <td>

                                <button
                                    className="view-btn"
                                    onClick={() => setSelectedPayment(payment)}
                                >
                                    👁 View
                                </button>

                               <button
                                    className="pay-btn"
                                    disabled={payment.status === "Completed"}
                                    onClick={() => setSelectedPayment(payment)}
                                >
                                    💰 Pay
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>


            {selectedPayment && (

                <div className="modal-overlay">

                    <div className="modal">

                        <h2>Payment Details</h2>

                        <div className="details-grid">

                            <div>
                                <strong>Application ID</strong>
                                <p>{selectedPayment.id}</p>
                            </div>

                            <div>
                                <strong>Beneficiary</strong>
                                <p>{selectedPayment.beneficiary}</p>
                            </div>

                            <div>
                                <strong>Scheme</strong>
                                <p>{selectedPayment.scheme}</p>
                            </div>

                            <div>
                                <strong>Amount</strong>
                                <p>{selectedPayment.amount}</p>
                            </div>

                            <div>
                                <strong>Bank Name</strong>
                                <p>{selectedPayment.bank}</p>
                            </div>

                            <div>
                                <strong>Account Number</strong>
                                <p>{selectedPayment.account}</p>
                            </div>

                            <div>
                                <strong>IFSC Code</strong>
                                <p>{selectedPayment.ifsc}</p>
                            </div>

                            <div>
                                <strong>Status</strong>

                                <span
                                    className={
                                        selectedPayment.status === "Completed"
                                            ? "status completed"
                                            : selectedPayment.status === "Failed"
                                                ? "status failed"
                                                : "status pending"
                                    }
                                >
                                    {selectedPayment.status}
                                </span>

                            </div>

                        </div>

                        <div className="modal-buttons">

                            <button
                                className="pay-btn"
                                onClick={() => {
                                    handlePayment(selectedPayment.id);
                                    setSelectedPayment(null);
                                }}
                            >
                                💰 Process Payment
                            </button>

                            <button className="hold-btn">
                                ⏸ Hold Payment
                            </button>

                            <button className="cancel-btn">
                                ❌ Cancel Payment
                            </button>

                            <button
                                className="close-btn"
                                onClick={() => setSelectedPayment(null)}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}

export default FinanceDashboard;