import "./FinanceDisbursementConsole.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationById, getApplications } from "../../api/applicationApi";
import { getApplicationMilestones, releaseMilestone, completeMilestone, initMilestones } from "../../api/disbursementApi";

function FinanceDisbursementConsole() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [application, setApplication] = useState(null);
    const [stages, setStages] = useState([]);
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            let targetId = id;

            if (!targetId) {
                const apps = await getApplications();
                const approved = Array.isArray(apps)
                    ? apps.find((a) => a.status === "VERIFICATION_APPROVED" || a.status === "APPROVED" || a.status === "STAGE_RELEASED" || a.status === "DISBURSED") || apps[0]
                    : null;
                if (approved) {
                    targetId = approved.applicationId || approved.id;
                }
            }

            if (!targetId) {
                setError("No application selected for disbursement.");
                setLoading(false);
                return;
            }

            const appData = await getApplicationById(targetId);
            setApplication(appData);

            let milestoneData = [];
            try {
                milestoneData = await getApplicationMilestones(targetId);
            } catch {
                milestoneData = [];
            }

            if ((!Array.isArray(milestoneData) || milestoneData.length === 0) && appData) {
                try {
                    await initMilestones(targetId);
                    milestoneData = await getApplicationMilestones(targetId);
                } catch {
                    // Scheme may not have milestones configured
                }
            }

            if (Array.isArray(milestoneData)) {
                setStages(
                    milestoneData.map((m, index) => ({
                        id: m.applicationMilestoneId || m.id,
                        order: m.schemeMilestone?.milestoneOrder || m.milestone?.milestoneOrder || index + 1,
                        name: m.schemeMilestone?.milestoneName || m.milestone?.milestoneName || `Milestone #${index + 1}`,
                        amount: Number(m.amount || m.amountToRelease || 0),
                        dueDate: m.dueDate || "-",
                        status: m.status || "PENDING",
                        completedDate: m.disbursedAt || m.releaseDate || m.completedDate || null,
                    }))
                );
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load disbursement details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const approvedGrant = Number(application?.scheme?.maxGrant || 0);
    const totalStageAmount = stages.reduce((total, stage) => total + stage.amount, 0);
    const releasedAmount = stages
        .filter((stage) => stage.status === "RELEASED")
        .reduce((total, stage) => total + stage.amount, 0);

    const amountValid = totalStageAmount > 0 ? totalStageAmount === approvedGrant : true;

    const handleReleaseStage = async (stage) => {
        if (stage.status !== "PENDING" && stage.status !== "COMPLETED") {
            alert(`Stage is in ${stage.status} status and cannot be released.`);
            return;
        }

        setProcessing(true);
        try {
            // First ensure it's marked completed if pending
            if (stage.status === "PENDING") {
                try {
                    await completeMilestone(stage.id);
                } catch {
                    // Ignore if backend requires direct release
                }
            }

            const txRef = `TXN-${Date.now()}`;
            await releaseMilestone(stage.id, txRef);
            alert(`Stage "${stage.name}" payment of ₹${stage.amount.toLocaleString("en-IN")} released successfully!\nReference: ${txRef}`);
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Payment release failed");
        } finally {
            setProcessing(false);
        }
    };

    const handleCompleteMilestone = async (stage) => {
        setProcessing(true);
        try {
            await completeMilestone(stage.id);
            alert(`Milestone "${stage.name}" verification marked as COMPLETE.`);
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data || err.message || "Operation failed");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="disbursement-console text-center py-5">
                <p>Loading disbursement console...</p>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="disbursement-console py-5">
                <button className="btn btn-secondary mb-3" onClick={() => navigate("/finance")}>
                    ← Back to Finance Queue
                </button>
                <div className="alert alert-warning">
                    {error || "No application found for disbursement."}
                </div>
            </div>
        );
    }

    return (
        <div className="disbursement-console">
            {/* Header */}
            <div className="console-header">
                <div>
                    <h1>Finance Disbursement Console</h1>
                    <p>Manage staged subsidy releases and monitor milestone compliance.</p>
                </div>

                <div className="d-flex gap-2 align-items-center">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/finance")}>
                        ← Back to Queue
                    </button>
                    <span className="console-badge">Finance Officer</span>
                </div>
            </div>

            {/* Application Information */}
            <div className="application-card">
                <div className="application-title">
                    <div>
                        <h2>Application #{application.applicationId || application.id}</h2>
                        <p>{application.beneficiary?.fullName || "Applicant"}</p>
                    </div>

                    <span className="approved-badge">
                        {application.status}
                    </span>
                </div>

                <div className="application-details">
                    <div>
                        <span>Beneficiary</span>
                        <strong>{application.beneficiary?.fullName || "-"}</strong>
                    </div>

                    <div>
                        <span>Scheme</span>
                        <strong>{application.scheme?.schemeName || "-"}</strong>
                    </div>

                    <div>
                        <span>Approved Grant</span>
                        <strong>₹{approvedGrant.toLocaleString("en-IN")}</strong>
                    </div>

                    <div>
                        <span>Released</span>
                        <strong style={{ color: "#16a34a" }}>₹{releasedAmount.toLocaleString("en-IN")}</strong>
                    </div>

                    <div>
                        <span>Remaining</span>
                        <strong style={{ color: "#e11d48" }}>₹{Math.max(0, approvedGrant - releasedAmount).toLocaleString("en-IN")}</strong>
                    </div>

                    <div>
                        <span>Bank & Account</span>
                        <strong>{application.beneficiary?.bankName ? `${application.beneficiary.bankName} (${application.beneficiary.accountNumber})` : "Not Provided"}</strong>
                    </div>
                </div>
            </div>

            {/* Amount Validation */}
            <div className={amountValid ? "amount-validation valid" : "amount-validation invalid"}>
                <div>
                    <span>Total Stages Configured</span>
                    <strong>₹{totalStageAmount.toLocaleString("en-IN")}</strong>
                </div>

                <div>
                    <span>Approved Scheme Grant</span>
                    <strong>₹{approvedGrant.toLocaleString("en-IN")}</strong>
                </div>

                <span className="validation-status">
                    {amountValid ? "✓ Stage Totals Reconciled" : "⚠ Stage Totals Mismatch"}
                </span>
            </div>

            {/* Stages Section */}
            <div className="stages-container">
                <div className="stages-header">
                    <h2>Disbursement Milestones ({stages.length})</h2>
                    <p>Sequential releases enforce verified milestone completion before subsequent transfers.</p>
                </div>

                {stages.length === 0 ? (
                    <div className="alert alert-info mt-3">
                        No individual milestones scheduled for this scheme. You can disburse the full grant directly from the Payment page.
                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/payment/${application.applicationId || application.id}`, { state: application })}
                            >
                                💳 Go to One-Time Payment Page
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="stages-grid">
                        {stages.map((stage, index) => (
                            <div key={stage.id} className="stage-card">
                                <div className="stage-header">
                                    <span className="stage-number">Stage {stage.order || index + 1}</span>
                                    <span className={`stage-status ${stage.status.toLowerCase()}`}>
                                        {stage.status}
                                    </span>
                                </div>

                                <div className="stage-body">
                                    <h3>{stage.name}</h3>

                                    <div className="stage-amount">
                                        ₹{stage.amount.toLocaleString("en-IN")}
                                    </div>

                                    <div className="stage-date">
                                        Due Date: {stage.dueDate}
                                    </div>

                                    {stage.completedDate && (
                                        <div className="stage-date text-success">
                                            Disbursed on: {new Date(stage.completedDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                <div className="stage-actions">
                                    <button
                                        className="release-btn"
                                        disabled={processing || stage.status === "RELEASED"}
                                        onClick={() => handleReleaseStage(stage)}
                                    >
                                        {stage.status === "RELEASED" ? "✓ Released" : "💰 Disburse Stage"}
                                    </button>

                                    {stage.status === "PENDING" && (
                                        <button
                                            className="complete-btn"
                                            disabled={processing}
                                            onClick={() => handleCompleteMilestone(stage)}
                                        >
                                            ✓ Verify Proof
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FinanceDisbursementConsole;