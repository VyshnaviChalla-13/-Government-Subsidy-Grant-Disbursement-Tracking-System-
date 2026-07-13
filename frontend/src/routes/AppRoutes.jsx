import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/beneficiary/Dashboard";
import FrontDeskDashboard from "../pages/officer/FrontDeskDashboard";
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
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;