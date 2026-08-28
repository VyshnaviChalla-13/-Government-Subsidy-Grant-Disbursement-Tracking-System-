/**
 * Utility functions for formatting and displaying user roles across the portal.
 * Preserves backend security/role values while rendering clean presentation labels.
 */

export function getRoleDisplayName(role) {
    if (!role) return "Citizen / User";
    const r = String(role).trim().toUpperCase();
    switch (r) {
        case "ROLE_SUPER_ADMIN":
        case "SUPER_ADMIN":
            return "Super Admin";
        case "ROLE_DEPT_ADMIN":
        case "DEPT_ADMIN":
            return "Department Admin";
        case "ROLE_FINANCE_OFFICER":
        case "FINANCE_OFFICER":
            return "Finance Officer";
        case "ROLE_VERIFICATION_OFFICER":
        case "VERIFICATION_OFFICER":
            return "Verification Officer";
        case "ROLE_FRONT_DESK_OFFICER":
        case "FRONT_DESK_OFFICER":
            return "Front Desk Officer";
        case "ROLE_BENEFICIARY":
        case "BENEFICIARY":
        case "ROLE_USER":
        case "USER":
            return "Citizen / User";
        default:
            return r
                .replace(/^ROLE_/, "")
                .split("_")
                .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                .join(" ");
    }
}

export function getRoleBadgeClass(role) {
    if (!role) return "badge bg-light text-secondary border";
    const r = String(role).trim().toUpperCase();
    if (r.includes("SUPER_ADMIN")) return "badge bg-danger-subtle text-danger border border-danger-subtle";
    if (r.includes("DEPT_ADMIN")) return "badge bg-primary-subtle text-primary border border-primary-subtle";
    if (r.includes("FINANCE")) return "badge bg-success-subtle text-success border border-success-subtle";
    if (r.includes("VERIFICATION")) return "badge bg-warning-subtle text-warning border border-warning-subtle";
    if (r.includes("FRONT_DESK")) return "badge bg-info-subtle text-info border border-info-subtle";
    return "badge bg-light text-secondary border";
}
