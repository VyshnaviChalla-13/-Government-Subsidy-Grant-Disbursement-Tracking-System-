import "./FinanceDisbursementConsole.css";
import { useState } from "react";

function FinanceDisbursementConsole() {
    const [plan, setPlan] = useState({
        applicationId: "APP1002",
        beneficiary: "Anjali Sharma",
        scheme: "Student Scholarship Scheme",
        approvedGrant: 50000,

        stages: [
            {
                id: 1,
                name: "Initial Documentation Proof",
                amount: 20000,
                dueDate: "2026-08-10",
                status: "PENDING"
            },
            {
                id: 2,
                name: "Ground Verification Complete",
                amount: 15000,
                dueDate: "2026-08-20",
                status: "BLOCKED"
            },
            {
                id: 3,
                name: "Final Utilization Proof",
                amount: 15000,
                dueDate: "2026-08-30",
                status: "BLOCKED"
            }
        ]
    });

    const totalStageAmount = plan.stages.reduce(
        (total, stage) => total + stage.amount,
        0
    );

    const releasedAmount = plan.stages
        .filter(
            stage =>
                stage.status === "RELEASED" ||
                stage.status === "COMPLETE"
        )
        .reduce((total, stage) => total + stage.amount, 0);

    const amountValid =
        totalStageAmount === plan.approvedGrant;

    const isOverdue = (dueDate, status) => {
        if (status === "COMPLETE" || status === "RELEASED") {
            return false;
        }

        return new Date(dueDate) < new Date();
    };

    const getStageStatus = (stage, index) => {
        if (isOverdue(stage.dueDate, stage.status)) {
            return "OVERDUE";
        }

        return stage.status;
    };

    const releaseStage = (index) => {
        if (!amountValid) {
            alert(
                "Cannot release payment. Stage amounts must equal the approved grant."
            );
            return;
        }

        const stage = plan.stages[index];

        if (isOverdue(stage.dueDate, stage.status)) {
            alert(
                "This milestone is overdue. Resolve the milestone before releasing funds."
            );
            return;
        }

        if (stage.status === "BLOCKED") {
            alert(
                "This stage is blocked. Complete the previous milestone first."
            );
            return;
        }

        if (
            stage.status !== "PENDING"
        ) {
            return;
        }

        const updatedStages = [...plan.stages];

        updatedStages[index] = {
            ...updatedStages[index],
            status: "RELEASED"
        };

        setPlan({
            ...plan,
            stages: updatedStages
        });

        alert(
            `Stage ${stage.id} payment of ₹${stage.amount.toLocaleString(
                "en-IN"
            )} released successfully.`
        );
    };

    const completeMilestone = (index) => {
        const stage = plan.stages[index];

        if (stage.status !== "RELEASED") {
            alert(
                "The milestone can be completed only after its payment is released."
            );
            return;
        }

        const updatedStages = [...plan.stages];

        updatedStages[index] = {
            ...updatedStages[index],
            status: "COMPLETE"
        };

        if (index + 1 < updatedStages.length) {
            updatedStages[index + 1] = {
                ...updatedStages[index + 1],
                status: "PENDING"
            };
        }

        setPlan({
            ...plan,
            stages: updatedStages
        });

        alert(`Stage ${stage.id} milestone marked as COMPLETE.`);
    };

    return (
        <div className="disbursement-console">

            {/* Header */}

            <div className="console-header">

                <div>
                    <h1>Finance Disbursement Console</h1>

                    <p>
                        Manage staged subsidy releases and monitor milestone
                        compliance.
                    </p>
                </div>

                <span className="console-badge">
                    Finance Officer
                </span>

            </div>


            {/* Application Information */}

            <div className="application-card">

                <div className="application-title">
                    <div>
                        <h2>{plan.applicationId}</h2>
                        <p>{plan.beneficiary}</p>
                    </div>

                    <span className="approved-badge">
                        Fully Approved
                    </span>
                </div>

                <div className="application-details">

                    <div>
                        <span>Beneficiary</span>
                        <strong>{plan.beneficiary}</strong>
                    </div>

                    <div>
                        <span>Scheme</span>
                        <strong>{plan.scheme}</strong>
                    </div>

                    <div>
                        <span>Approved Grant</span>
                        <strong>
                            ₹{plan.approvedGrant.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div>
                        <span>Released</span>
                        <strong>
                            ₹{releasedAmount.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div>
                        <span>Remaining</span>
                        <strong>
                            ₹{(
                            plan.approvedGrant - releasedAmount
                        ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                </div>

            </div>


            {/* Amount Validation */}

            <div
                className={
                    amountValid
                        ? "amount-validation valid"
                        : "amount-validation invalid"
                }
            >

                <div>
                    <span>Total Stage Amount</span>

                    <strong>
                        ₹{totalStageAmount.toLocaleString("en-IN")}
                    </strong>
                </div>

                <div>
                    <span>Approved Grant</span>

                    <strong>
                        ₹{plan.approvedGrant.toLocaleString("en-IN")}
                    </strong>
                </div>

                <div className="validation-message">

                    {amountValid
                        ? "✓ Stage amounts match the approved grant"
                        : "⚠ Stage amounts do not match the approved grant"}

                </div>

            </div>


            {/* Milestone Section */}

            <div className="milestone-section">

                <div className="section-heading">

                    <div>
                        <h2>Disbursement Plan</h2>

                        <p>
                            Funds are released only after the required
                            milestone conditions are satisfied.
                        </p>
                    </div>

                    <span className="stage-count">
                        {plan.stages.length} Stages
                    </span>

                </div>


                <div className="milestone-list">

                    {plan.stages.map((stage, index) => {

                        const status = getStageStatus(stage, index);

                        const previousStage =
                            index > 0
                                ? plan.stages[index - 1]
                                : null;

                        const canRelease =
                            status === "PENDING" &&
                            (index === 0 ||
                                previousStage?.status === "COMPLETE");

                        return (

                            <div
                                key={stage.id}
                                className={`milestone-card ${status.toLowerCase()}`}
                            >

                                <div className="stage-number">
                                    {stage.id}
                                </div>


                                <div className="stage-content">

                                    <div className="stage-top">

                                        <div>
                                            <span className="stage-label">
                                                STAGE {stage.id}
                                            </span>

                                            <h3>
                                                {stage.name}
                                            </h3>
                                        </div>

                                        <span
                                            className={`stage-status ${status.toLowerCase()}`}
                                        >
                                            {status}
                                        </span>

                                    </div>


                                    <div className="stage-details">

                                        <div>
                                            <span>Release Amount</span>

                                            <strong>
                                                ₹{stage.amount.toLocaleString(
                                                "en-IN"
                                            )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Due Date</span>

                                            <strong>
                                                {new Date(
                                                    stage.dueDate
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Trigger</span>

                                            <strong>
                                                {index === 0
                                                    ? "Final approval"
                                                    : "Previous milestone complete"}
                                            </strong>
                                        </div>

                                    </div>


                                    {status === "OVERDUE" && (

                                        <div className="overdue-warning">
                                            ⚠ This milestone is overdue.
                                            Further disbursement is paused
                                            until it is resolved.
                                        </div>

                                    )}


                                    {status === "BLOCKED" && (

                                        <div className="blocked-message">
                                            🔒 Complete Stage {stage.id - 1}
                                            before releasing this stage.
                                        </div>

                                    )}


                                    {status === "RELEASED" && (

                                        <div className="released-message">
                                            ✓ Payment released. Milestone
                                            verification is now required.
                                        </div>

                                    )}


                                    {status === "COMPLETE" && (

                                        <div className="complete-message">
                                            ✓ Milestone completed successfully.
                                        </div>

                                    )}


                                    <div className="stage-actions">

                                        {status === "PENDING" && (

                                            <button
                                                className="release-button"
                                                disabled={!canRelease}
                                                onClick={() =>
                                                    releaseStage(index)
                                                }
                                            >
                                                💰 Release ₹
                                                {stage.amount.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </button>

                                        )}


                                        {status === "RELEASED" && (

                                            <button
                                                className="complete-button"
                                                onClick={() =>
                                                    completeMilestone(index)
                                                }
                                            >
                                                ✓ Complete Milestone
                                            </button>

                                        )}

                                        {status === "BLOCKED" && (

                                            <button
                                                className="blocked-button"
                                                disabled
                                            >
                                                🔒 Stage Blocked
                                            </button>

                                        )}

                                        {status === "OVERDUE" && (

                                            <button
                                                className="resolve-button"
                                                onClick={() =>
                                                    alert(
                                                        "Overdue resolution will be connected to the Admin module."
                                                    )
                                                }
                                            >
                                                Resolve Overdue
                                            </button>

                                        )}

                                        {status === "COMPLETE" && (

                                            <span className="completed-label">
                                                ✓ Completed
                                            </span>

                                        )}

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>

            </div>

        </div>
    );
}

export default FinanceDisbursementConsole;