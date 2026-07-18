import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/beneficiary/Dashboard";
import FrontDeskDashboard from "../pages/officer/FrontDeskDashboard";
import VerificationDashboard from "../pages/officer/VerificationDashboard";
import FinanceDashboard from "../pages/finance/FinanceDashboard";
import PaymentPage from "../pages/finance/PaymentPage";
function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                    path="/officer/frontdesk"
                    element={<FrontDeskDashboard />}
                />
                <Route path="/verification" element={<VerificationDashboard />} />
                <Route path="/finance" element={<FinanceDashboard />} />
                <Route path="/payment/:id" element={<PaymentPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;