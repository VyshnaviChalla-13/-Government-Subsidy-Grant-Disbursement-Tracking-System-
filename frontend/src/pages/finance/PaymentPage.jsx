import "./PaymentPage.css";
import { useParams, useNavigate } from "react-router-dom";

function PaymentPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const payment = {
        id: id,
        beneficiary: "Rahul Kumar",
        scheme: "Farmer Scheme",
        amount: "₹25,000",
        bank: "State Bank of India",
        account: "XXXX1234",
        ifsc: "SBIN0001234",
        date: "12-07-2026"
    };

    return (

        <div className="payment-page">

            <h1>Payment Processing</h1>

            <p>
                Verify the beneficiary details before processing the payment.
            </p>

            <div className="payment-card">

                <h2>Application Details</h2>

                <p><strong>Application ID:</strong> {payment.id}</p>

            <p><strong>Beneficiary:</strong> {payment.beneficiary}</p>

            <p><strong>Scheme:</strong> {payment.scheme}</p>

            <p><strong>Amount:</strong> {payment.amount}</p>

            <p><strong>Bank Name:</strong> {payment.bank}</p>

            <p><strong>Account Number:</strong> {payment.account}</p>

            <p><strong>IFSC Code:</strong> {payment.ifsc}</p>

            <p><strong>Payment Date:</strong> {payment.date}</p>
                <div className="payment-actions">

                    <button
                        className="confirm-btn"
                        onClick={() => {
                            alert("Payment processed successfully!");
                            navigate("/finance");
                        }}
                    >
                        ✅ Confirm Payment
                    </button>

                    <button
                        className="cancel-btn"
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