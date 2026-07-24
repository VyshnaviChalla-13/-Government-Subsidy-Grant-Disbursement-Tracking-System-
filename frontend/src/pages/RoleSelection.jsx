import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/roleSelection.css";

const RoleSelection = () => {
    const navigate = useNavigate();

    const roles = [
        {
            title: "Beneficiary Module",
            icon: "👤",
            description: "Browse available schemes, submit applications and track status.",
            path: "/dashboard",
            available: true,
        },
        {
            title: "Officer Module",
            icon: "🧾",
            description: "Access the Front Desk dashboard to review submitted applications.",
            path: "/officer/frontdesk",
            available: true,
        },
        {
            title: "Verification Module",
            icon: "✅",
            description: "Document verification and eligibility approval.",
            path: "/officer/verification",
            available: true,
        },
        {
            title: "Finance Module",
            icon: "💰",
            description: "Manage fund disbursement for approved applications.",
            path: "/finance",
            available: true,
        },
        {
            title: "Department Admin Module",
            icon: "🏢",
            description: "Manage schemes and departmental operations.",
            path: "/admin/dashboard",
            available: true,
        },
        {
            title: "Super Admin Module",
            icon: "👑",
            description: "Portal administration, users and reports.",
            path: "/superadmin/dashboard",
            available: true,
        },
    ];

    return (
        <div className="role-page">
            <div className="container py-5">

                <h2 className="text-center fw-bold">
                    Government Scheme Management System
                </h2>

                <h4 className="text-center text-primary mb-3">
                    Module Preview
                </h4>

                <p className="text-center text-muted mb-5">
                    This page is provided to preview the frontend modules developed for
                    the project. Backend authentication and role-based access control
                    will be integrated in future milestones.
                </p>

                <div className="row">
                    {roles.map((role, index) => (
                        <div className="col-lg-4 col-md-6 mb-4" key={index}>
                            <div className="card role-card shadow-sm h-100">
                                <div className="card-body text-center">

                                    <h1>{role.icon}</h1>

                                    <h4 className="mt-3">{role.title}</h4>

                                    <p>{role.description}</p>

                                    <button
                                        className={`btn mt-2 ${
                                            role.available ? "btn-primary" : "btn-secondary"
                                        }`}
                                        disabled={!role.available}
                                        onClick={() => role.available && navigate(role.path)}
                                    >
                                        {role.available ? "Open Module" : "Coming Soon"}
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center text-muted mt-4">
                    <strong>Note:</strong> This is a frontend demonstration page.
                    In the final application, users will be redirected automatically
                    based on their authenticated role.
                </p>

            </div>
        </div>
    );
};

export default RoleSelection;