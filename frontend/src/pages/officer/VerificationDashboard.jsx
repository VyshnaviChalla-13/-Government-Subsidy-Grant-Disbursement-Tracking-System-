import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerificationDashboard.css";

import {
    getApplications,
    approveApplication,
    returnApplication,
    rejectApplication
} from "../../api/verificationApi";

function VerificationDashboard() {

    const navigate = useNavigate();

    // Applications from backend
    const [applications, setApplications] = useState([]);

    // Search and filters
    const [search, setSearch] = useState("");
    const [schemeFilter, setSchemeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Return / Reject popup
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [actionType, setActionType] = useState("");
    const [reason, setReason] = useState("");

    // ============================
    // FETCH APPLICATIONS
    // ============================

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {

            const data = await getApplications();

            console.log("Verification applications:", data);

            setApplications(data);

        } catch (error) {

            console.error("Failed to fetch applications:", error);

            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Response:", error.response.data);
            }
        }
    };


    // ============================
    // SEARCH + FILTER
    // ============================

    const filteredApplications = applications.filter((app) => {

        const applicationNumber =
            app.applicationNumber?.toLowerCase() || "";

        const beneficiaryName =
            app.beneficiary?.fullName?.toLowerCase() || "";

        const searchValue =
            search.toLowerCase();

        const matchesSearch =
            applicationNumber.includes(searchValue) ||
            beneficiaryName.includes(searchValue);

        const matchesScheme =
            schemeFilter === "" ||
            app.scheme?.schemeName === schemeFilter;

        const matchesStatus =
            statusFilter === "" ||
            app.status === statusFilter;

        return (
            matchesSearch &&
            matchesScheme &&
            matchesStatus
        );
    });


    // ============================
    // RETURN / REJECT POPUP
    // ============================

    const openReasonPopup = (application, action) => {

        setSelectedApplication(application);

        setActionType(action);

        setReason("");
    };


    // ============================
    // SUBMIT RETURN / REJECT
    // ============================

    const submitReason = async () => {

        if (reason.trim() === "") {
            return;
        }

        try {

            if (actionType === "RETURNED") {

                await returnApplication(
                    selectedApplication.applicationId,
                    reason
                );

            }

            if (actionType === "REJECTED") {

                await rejectApplication(
                    selectedApplication.applicationId,
                    reason
                );

            }

            // Refresh data from backend
            await fetchApplications();

            // Close popup
            setSelectedApplication(null);
            setReason("");
            setActionType("");

            alert(
                `Application ${actionType.toLowerCase()} successfully`
            );

        } catch (error) {

            console.error("Operation failed:", error);

            if (error.response) {

                console.log(
                    "Status:",
                    error.response.status
                );

                console.log(
                    "Response:",
                    error.response.data
                );
            }

            alert("Operation failed");
        }
    };


    // ============================
    // APPROVE APPLICATION
    // ============================

    const handleApprove = async (applicationId) => {

        try {

            await approveApplication(applicationId);

            await fetchApplications();

            alert(
                "Application approved successfully"
            );

        } catch (error) {

            console.error(
                "Failed to approve application:",
                error
            );

            if (error.response) {

                console.log(
                    "Status:",
                    error.response.status
                );

                console.log(
                    "Response:",
                    error.response.data
                );
            }

            alert(
                "Failed to approve application"
            );
        }
    };


    // ============================
    // STATUS DISPLAY
    // ============================

    const getStatusLabel = (status) => {

        switch (status) {

            case "FIELD_APPROVED":
                return "Pending Verification";

            case "VERIFICATION_APPROVED":
                return "Verification Approved";

            case "RETURNED":
                return "Returned";

            case "REJECTED":
                return "Rejected";

            case "SUBMITTED":
                return "Submitted";

            case "RESUBMITTED":
                return "Resubmitted";

            default:
                return status || "-";
        }
    };


    const getStatusClass = (status) => {

        switch (status) {

            case "VERIFICATION_APPROVED":
                return "status approved";

            case "REJECTED":
                return "status rejected";

            case "RETURNED":
                return "status returned";

            case "FIELD_APPROVED":
                return "status pending";

            default:
                return "status pending";
        }
    };


    return (

        <div className="verification-dashboard">

            {/* ============================
                TOP BAR
            ============================ */}

            <div className="topbar">

                <h1>
                    Verification Officer Dashboard
                </h1>

                <div className="officer-name">
                    Verification Officer
                </div>

            </div>


            <p className="welcome">
                Verify beneficiary applications and uploaded documents.
            </p>


            {/* ============================
                DASHBOARD CARDS
            ============================ */}

            <div className="dashboard-cards">

                <div className="card">

                    <h3>
                        Total Applications
                    </h3>

                    <p>
                        {applications.length}
                    </p>

                </div>


                <div className="card">

                    <h3>
                        Pending Verification
                    </h3>

                    <p>
                        {
                            applications.filter(
                                (a) =>
                                    a.status === "FIELD_APPROVED"
                            ).length
                        }
                    </p>

                </div>


                <div className="card">

                    <h3>
                        Approved
                    </h3>

                    <p>
                        {
                            applications.filter(
                                (a) =>
                                    a.status ===
                                    "VERIFICATION_APPROVED"
                            ).length
                        }
                    </p>

                </div>


                <div className="card">

                    <h3>
                        Returned
                    </h3>

                    <p>
                        {
                            applications.filter(
                                (a) =>
                                    a.status === "RETURNED"
                            ).length
                        }
                    </p>

                </div>


                <div className="card">

                    <h3>
                        Rejected
                    </h3>

                    <p>
                        {
                            applications.filter(
                                (a) =>
                                    a.status === "REJECTED"
                            ).length
                        }
                    </p>

                </div>

            </div>


            {/* ============================
                SEARCH + FILTERS
            ============================ */}

            <div className="filter-section">

                <input
                    type="text"
                    placeholder="Search by ID or Name..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />


                <select
                    value={schemeFilter}
                    onChange={(e) =>
                        setSchemeFilter(e.target.value)
                    }
                >

                    <option value="">
                        All Schemes
                    </option>

                    <option value="Farmer Assistance Scheme">
                        Farmer Assistance Scheme
                    </option>

                    <option value="Student Scholarship Scheme">
                        Student Scholarship Scheme
                    </option>

                    <option value="Affordable Housing Scheme">
                        Affordable Housing Scheme
                    </option>

                    <option value="Women Empowerment Scheme">
                        Women Empowerment Scheme
                    </option>

                </select>


                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >

                    <option value="">
                        All Status
                    </option>

                    <option value="FIELD_APPROVED">
                        Pending Verification
                    </option>

                    <option value="VERIFICATION_APPROVED">
                        Approved
                    </option>

                    <option value="RETURNED">
                        Returned
                    </option>

                    <option value="REJECTED">
                        Rejected
                    </option>

                </select>

            </div>


            {/* ============================
                APPLICATION TABLE
            ============================ */}

            <table className="application-table">

                <thead>

                <tr>

                    <th>
                        ID
                    </th>

                    <th>
                        Beneficiary
                    </th>

                    <th>
                        Scheme
                    </th>

                    <th>
                        Date
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Actions
                    </th>

                </tr>

                </thead>


                <tbody>

                {filteredApplications.map((app) => (

                    <tr
                        key={app.applicationId}
                    >

                        {/* Application Number */}

                        <td>
                            {app.applicationNumber}
                        </td>


                        {/* Beneficiary */}

                        <td>
                            {app.beneficiary?.fullName || "-"}
                        </td>


                        {/* Scheme */}

                        <td>
                            {app.scheme?.schemeName || "-"}
                        </td>


                        {/* Date */}

                        <td>

                            {app.submittedAt
                                ? new Date(
                                    app.submittedAt
                                ).toLocaleDateString()
                                : "-"}

                        </td>


                        {/* Status */}

                        <td>

                                <span
                                    className={getStatusClass(
                                        app.status
                                    )}
                                >
                                    {getStatusLabel(
                                        app.status
                                    )}
                                </span>

                        </td>


                        {/* Actions */}

                        <td>

                            {/* VIEW */}

                            <button
                                className="view-btn"
                                onClick={() => {
                                    console.log("ACTUAL VERIFICATION APPLICATION:", app);
                                    console.log(
                                        "BENEFICIARY OBJECT:",
                                        app.beneficiary
                                    );

                                    navigate(
                                        "/officer/verification/milestone",
                                        {
                                            state: app
                                        }
                                    );
                                }}
                            >
                                👁 View
                            </button>


                            {/* VERIFICATION ACTIONS
                                    ONLY FOR FIELD_APPROVED
                                */}

                            {app.status === "FIELD_APPROVED" && (
                                <>

                                    {/* APPROVE */}

                                    <button
                                        className="approve-btn"
                                        onClick={() =>
                                            handleApprove(
                                                app.applicationId
                                            )
                                        }
                                    >
                                        ✅ Approve
                                    </button>


                                    {/* RETURN */}

                                    <button
                                        className="return-btn"
                                        onClick={() =>
                                            openReasonPopup(
                                                app,
                                                "RETURNED"
                                            )
                                        }
                                    >
                                        ↩ Return
                                    </button>


                                    {/* REJECT */}

                                    <button
                                        className="reject-btn"
                                        onClick={() =>
                                            openReasonPopup(
                                                app,
                                                "REJECTED"
                                            )
                                        }
                                    >
                                        ❌ Reject
                                    </button>

                                </>
                            )}

                        </td>

                    </tr>

                ))}


                {/* No applications */}

                {filteredApplications.length === 0 && (

                    <tr>

                        <td
                            colSpan="6"
                            style={{
                                textAlign: "center",
                                padding: "30px"
                            }}
                        >
                            No applications found
                        </td>

                    </tr>

                )}

                </tbody>

            </table>


            {/* ============================
                RETURN / REJECT REASON MODAL
            ============================ */}

            {selectedApplication &&
                (
                    actionType === "RETURNED" ||
                    actionType === "REJECTED"
                ) && (

                    <div className="modal-overlay">

                        <div className="reason-modal">

                            <h2>
                                {actionType === "RETURNED"
                                    ? "Return Application"
                                    : "Reject Application"}
                            </h2>


                            <p>
                                Please provide the reason before continuing.
                            </p>


                            <textarea
                                value={reason}
                                onChange={(e) =>
                                    setReason(e.target.value)
                                }
                                placeholder="Enter reason..."
                                rows="5"
                            />


                            <div className="reason-buttons">

                                <button
                                    className="submit-btn"
                                    disabled={
                                        reason.trim() === ""
                                    }
                                    onClick={submitReason}
                                >
                                    Submit
                                </button>


                                <button
                                    className="cancel-btn"
                                    onClick={() => {

                                        setSelectedApplication(
                                            null
                                        );

                                        setReason("");

                                        setActionType("");

                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>

    );
}

export default VerificationDashboard;