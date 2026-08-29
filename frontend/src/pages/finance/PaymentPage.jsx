import "./PaymentPage.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getApplicationById } from "../../api/applicationApi";
import { releaseMilestone, disburseApplication, getApplicationMilestones } from "../../api/disbursementApi";

function formatCurrency(amount) {
    if (amount == null) return "₹0";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function PaymentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [paymentData, setPaymentData] = useState(location.state || null);
    const [loading, setLoading] = useState(!location.state);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!location.state && id) {
            async function fetchDetails() {
                try {
                    setLoading(true);
                    const app = await getApplicationById(id);
                    let milestones = [];
                    try {
                        milestones = await getApplicationMilestones(id);
                    } catch {
                        milestones = [];
                    }

                    const pendingMilestone = Array.isArray(milestones)
                        ? milestones.find((m) => m.status === "PENDING" || m.status === "COMPLETED") || milestones[0]
                        : null;

                    setPaymentData({
                        id: app.applicationId || id,
                        applicationId: app.applicationId || id,
                        milestoneId: pendingMilestone?.applicationMilestoneId || pendingMilestone?.id,
                        beneficiary: app.beneficiary?.fullName || "Beneficiary",
                        scheme: app.scheme?.schemeName || "Welfare Scheme",
                        amount: formatCurrency(pendingMilestone?.amount || pendingMilestone?.amountToRelease || app.scheme?.maxGrant || app.scheme?.maxSubsidyAmount || 25000),
                        bank: app.beneficiary?.bankName || "State Bank of India",
                        account: app.beneficiary?.accountNumber
                            ? `XXXX${String(app.beneficiary.accountNumber).slice(-4)}`
                            : "XXXX1234",
                        ifsc: app.beneficiary?.ifscCode || "SBIN0001234",
                        date: new Date().toLocaleDateString("en-IN"),
                    });
                } catch (err) {
                    console.error("Failed to load payment details:", err);
                } finally {
                    setLoading(false);
                }
            }

            fetchDetails();
        }
    }, [id, location.state]);

    const handleConfirmPayment = async () => {
        setProcessing(true);
        try {
            const txRef = `TXN-${Date.now()}`;
            const targetAppId = paymentData?.applicationId || paymentData?.id || id;
            if (paymentData?.milestoneId) {
                try {
                    await releaseMilestone(paymentData.milestoneId, txRef);
                } catch {
                    await disburseApplication(targetAppId, txRef);
                }
            } else {
                await disburseApplication(targetAppId, txRef);
            }
            alert(`Payment released successfully!\nTransaction Reference: ${txRef}`);
            navigate("/finance");
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Failed to process payment");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="payment-page">
                <div className="payment-card text-center">
                    <p>Loading payment details for Application #{id}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <h1>Grant Payment Processing</h1>
            <p>Verify the beneficiary account details before authorizing fund transfer.</p>

            <div className="payment-card">
                <h2>Application Details</h2>

                <p><strong>Application ID:</strong> #{paymentData?.id || id}</p>
                <p><strong>Beneficiary Name:</strong> {paymentData?.beneficiary || "-"}</p>
                <p><strong>Scheme Name:</strong> {paymentData?.scheme || "-"}</p>
                <p><strong>Sanctioned Amount:</strong> <span style={{ color: "#16a34a", fontWeight: "700" }}>{paymentData?.amount || "₹0"}</span></p>
                <p><strong>Bank Name:</strong> {paymentData?.bank || "-"}</p>
                <p><strong>Account Number:</strong> {paymentData?.account || "-"}</p>
                <p><strong>IFSC Code:</strong> {paymentData?.ifsc || "-"}</p>
                <p><strong>Processing Date:</strong> {paymentData?.date || new Date().toLocaleDateString()}</p>

                <div className="payment-actions">
                    <button
                        className="confirm-btn"
                        disabled={processing}
                        onClick={handleConfirmPayment}
                    >
                        {processing ? "Authorizing Transfer..." : "✅ Confirm & Disburse Funds"}
                    </button>

                    <button
                        className="cancel-btn"
                        disabled={processing}
                        onClick={() => navigate("/finance")}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;