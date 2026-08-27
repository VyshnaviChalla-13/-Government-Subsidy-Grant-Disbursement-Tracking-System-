import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Dashboard from "../pages/beneficiary/Dashboard";
import BrowseSchemes from "../pages/beneficiary/BrowseSchemes";
import SchemeDetails from "../pages/beneficiary/SchemeDetails";
import ApplyScheme from "../pages/beneficiary/ApplyScheme";
import MyApplications from "../pages/beneficiary/MyApplications";
import ApplicationTimeline from "../pages/beneficiary/ApplicationTimeline";
import Profile from "../pages/beneficiary/Profile";
import DisbursementTracker from "../pages/beneficiary/DisbursementTracker";
import Notifications from "../pages/beneficiary/Notifications";


import Contact from "../pages/Contact";
import About from "../pages/About";
import RoleSelection from "../pages/RoleSelection";

import FrontDeskDashboard from "../pages/officer/FrontDeskDashboard";
import FrontDeskApplicationDetails from "../pages/officer/FrontDeskApplicationDetails";
import VerificationDashboard from "../pages/officer/VerificationDashboard";

import FinanceDashboard from "../pages/finance/FinanceDashboard";
import PaymentPage from "../pages/finance/PaymentPage";

import DepartmentAdminDashboard from "../pages/admin/DepartmentAdminDashboard";
import CreateScheme from "../pages/admin/CreateScheme";
import ManageSchemes from "../pages/admin/ManageSchemes";
import ManageOfficers from "../pages/admin/ManageOfficers";
import DepartmentReports from "../pages/admin/DepartmentReports";

import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import DepartmentManagement from "../pages/superadmin/DepartmentManagement";
import ManageUsers from "../pages/superadmin/ManageUsers";
import AnalyticsDashboard from "../pages/superadmin/analytics dashboard.jsx";
import AuditLogViewer from "../pages/superadmin/AuditLogViewer";

import FinanceDisbursementConsole from "../pages/finance/FinanceDisbursementConsole";
import OfficerMilestoneVerification from "../pages/officer/OfficerMilestoneVerification";
import AdminOverdueResolution from "../pages/admin/AdminOverdueResolution";
function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Beneficiary */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/beneficiary/dashboard" element={<Dashboard />} />
                <Route path="/beneficiary/schemes" element={<BrowseSchemes />} />
                <Route path="/beneficiary/schemes/:id" element={<SchemeDetails />} />
                <Route path="/beneficiary/apply" element={<ApplyScheme />} />
                <Route path="/beneficiary/my-applications" element={<MyApplications />} />
                <Route path="/beneficiary/timeline" element={<ApplicationTimeline />} />
                <Route path="/beneficiary/timeline/:id" element={<ApplicationTimeline />} />
                <Route path="/beneficiary/profile" element={<Profile />} />
                <Route path="/beneficiary/disbursement"element={<DisbursementTracker />}/>
                <Route path="/beneficiary/notifications"element={<Notifications />}/>

                {/* Officer */}
                <Route path="/officer/frontdesk" element={<FrontDeskDashboard />} />
                <Route path="/officer/frontdesk/application" element={<FrontDeskApplicationDetails />} />
                <Route path="/officer/frontdesk/application/:id" element={<FrontDeskApplicationDetails />} />
                <Route path="/officer/verification" element={<VerificationDashboard />} />
                <Route path="/officer/verification/review" element={<OfficerMilestoneVerification />} />
                <Route path="/officer/verification/review/:id" element={<OfficerMilestoneVerification />} />
                <Route path="/officer/verification/milestone" element={<OfficerMilestoneVerification />} />

                {/* Finance */}
                <Route path="/finance" element={<FinanceDashboard />} />
                <Route path="/finance/dashboard" element={<FinanceDashboard />} />
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="/finance/payment/:id" element={<PaymentPage />} />
                <Route
                    path="/finance/disbursement/:id"
                    element={<FinanceDisbursementConsole />}
                />
                <Route
                    path="/finance/disbursement"
                    element={<FinanceDisbursementConsole />}
                />

                <Route
                    path="/admin/overdue-resolution"
                    element={<AdminOverdueResolution />}
                />

                {/* Common Pages */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />



            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
