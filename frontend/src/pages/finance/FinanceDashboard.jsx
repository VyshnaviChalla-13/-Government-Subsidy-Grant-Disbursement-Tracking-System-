import "./FinanceDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFinanceQueue, releaseMilestone, rejectMilestone, disburseApplication } from "../../api/disbursementApi";
import { getApplications } from "../../api/applicationApi";

function formatCurrency(amount) {
    if (amount == null) return "₹0";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function FinanceDashboard() {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const loadQueue = async () => {
        try {
            setLoading(true);
            setError("");
            let items = [];
            try {
                const queueData = await getFinanceQueue();
                if (Array.isArray(queueData) && queueData.length > 0) {
                    items = queueData.map((m) => ({
                        milestoneId: m.applicationMilestoneId || m.id,
                        id: m.application?.applicationId || m.applicationId || m.id,
                        applicationId: m.application?.applicationId || m.applicationId,
                        beneficiary: m.application?.beneficiary?.fullName || "Applicant",
                        scheme: m.application?.scheme?.schemeName || m.schemeMilestone?.scheme?.schemeName || "Welfare Scheme",
                        amount: formatCurrency(m.amount || m.amountToRelease),
                        rawAmount: m.amount || m.amountToRelease,
                        status: m.status === "RELEASED" ? "Completed" : m.status === "REJECTED" ? "Failed" : "Pending",
                        milestoneName: m.schemeMilestone?.milestoneName || m.milestone?.milestoneName || `Milestone #${m.schemeMilestone?.milestoneOrder || m.milestone?.milestoneOrder || 1}`,
                        bank: m.application?.beneficiary?.bankName || "Not Provided",
                        account: m.application?.beneficiary?.accountNumber ? `XXXX${String(m.application.beneficiary.accountNumber).slice(-4)}` : "Not Provided",
                        ifsc: m.application?.beneficiary?.ifscCode || "Not Provided",
                        date: m.dueDate || m.disbursedAt || m.releaseDate || "Pending",
                    }));
                }
            } catch (queueErr) {
                console.warn("Queue fetch note:", queueErr);
            }

            if (items.length === 0) {
                const allApps = await getApplications();
                if (Array.isArray(allApps)) {
                    items = allApps
                        .filter((a) => a.status === "APPROVED" || a.status === "VERIFICATION_APPROVED" || a.status === "STAGE_RELEASED" || a.status === "DISBURSED")
                        .map((app) => ({
                            id: app.applicationId || app.id,
                            applicationId: app.applicationId || app.id,
                            beneficiary: app.beneficiary?.fullName || "Applicant",
                            scheme: app.scheme?.schemeName || "Welfare Scheme",
                            amount: formatCurrency(app.scheme?.maxGrant || app.scheme?.maxSubsidyAmount || 0),
                            rawAmount: app.scheme?.maxGrant || app.scheme?.maxSubsidyAmount || 0,
                            status: app.status === "DISBURSED" ? "Completed" : "Pending",
                            milestoneName: "Sanctioned Grant",
                            bank: app.beneficiary?.bankName || "Not Provided",
                            account: app.beneficiary?.accountNumber ? `XXXX${String(app.beneficiary.accountNumber).slice(-4)}` : "Not Provided",
                            ifsc: app.beneficiary?.ifscCode || "Not Provided",
                            date: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "-",
                        }));
                }
            }

            setQueue(items);
        } catch (err) {
            console.error("Finance queue error:", err);
            setQueue([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQueue();
    }, []);

    const handleReleasePayment = async (item) => {
        const target = item || selectedPayment;
        if (!target) return;

        setProcessing(true);
        try {
            const txRef = `TXN-${Date.now()}`;
            const targetAppId = target.applicationId || target.id;
            if (target.milestoneId) {
                try {
                    await releaseMilestone(target.milestoneId, txRef);
                } catch {
                    await disburseApplication(targetAppId, txRef);
                }
            } else {
                await disburseApplication(targetAppId, txRef);
            }
            alert(`Payment released successfully! Reference: ${txRef}`);
            setSelectedPayment(null);
            await loadQueue();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Release failed");
        } finally {
            setProcessing(false);
        }
    };

    const handleRejectPayment = async (item) => {
        const target = item || selectedPayment;
        if (!target) return;

        const reason = prompt("Enter rejection reason for this disbursement:") || "Disbursement rejected";
        setProcessing(true);
        try {
            if (target.milestoneId) {
                await rejectMilestone(target.milestoneId, reason);
            }
            alert("Disbursement rejected.");
            setSelectedPayment(null);
            await loadQueue();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Rejection failed");
        } finally {
            setProcessing(false);
        }
    };

    const schemes = ["All", ...new Set(queue.map((p) => p.scheme).filter(Boolean))];

    const filteredPayments = queue.filter((payment) => {
        const idStr = String(payment.id).toLowerCase();
        const bStr = String(payment.beneficiary).toLowerCase();
        const q = search.toLowerCase();
        const matchesSearch = !search || idStr.includes(q) || bStr.includes(q);

        const matchesScheme = schemeFilter === "All" || payment.scheme === schemeFilter;
        const matchesStatus = statusFilter === "All" || payment.status === statusFilter;

        return matchesSearch && matchesScheme && matchesStatus;
    });

    return (
        <div className="finance-dashboard">
            <h1>Finance Officer Dashboard</h1>
            <p>Manage approved applications and process beneficiary payments.</p>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>Total Payments</h3>
                    <p>{queue.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending</h3>
                    <p>{queue.filter((p) => p.status === "Pending").length}</p>
                </div>
                <div className="stat-card">
                    <h3>Completed</h3>
                    <p>{queue.filter((p) => p.status === "Completed").length}</p>
                </div>
                <div className="stat-card">
                    <h3>Failed</h3>
                    <p>{queue.filter((p) => p.status === "Failed").length}</p>
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
                    {schemes.map((s) => (
                        <option key={s} value={s}>{s === "All" ? "All Schemes" : s}</option>
                    ))}
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

            {loading && <p style={{ padding: "20px" }}>Loading payment queue...</p>}
            {error && <div className="alert alert-danger" style={{ margin: "20px" }}>{error}</div>}

            {!loading && !error && (
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
                        {filteredPayments.map((payment) => (
                            <tr key={`${payment.id}-${payment.milestoneId || ""}`}>
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
                                        👁 Quick View
                                    </button>
                                    <button
                                        className="pay-btn"
                                        disabled={payment.status === "Completed" || processing}
                                        onClick={() =>
                                            navigate(`/payment/${payment.applicationId || payment.id}`, { state: payment })
                                        }
                                    >
                                        💳 Process Payment
                                    </button>
                                    <button
                                        className="view-btn"
                                        onClick={() =>
                                            navigate(`/finance/disbursement/${payment.applicationId || payment.id}`)
                                        }
                                    >
                                        ⚙️ Staged Console
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedPayment && (
                <div className="modal-overlay">
                    <div
                        className="finance-payment-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="finance-payment-details-title"
                    >
                        <h2 id="finance-payment-details-title">Payment Details</h2>

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
                                disabled={processing}
                                onClick={() => handleReleasePayment(selectedPayment)}
                            >
                                💰 Release Payment
                            </button>
                            <button
                                className="cancel-btn"
                                disabled={processing}
                                onClick={() => handleRejectPayment(selectedPayment)}
                            >
                                ❌ Reject
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
