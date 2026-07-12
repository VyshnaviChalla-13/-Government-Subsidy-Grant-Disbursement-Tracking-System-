import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Dashboard from "../pages/beneficiary/Dashboard";
import BrowseSchemes from "../pages/beneficiary/BrowseSchemes";
import SchemeDetails from "../pages/beneficiary/SchemeDetails";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication */}

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Beneficiary */}

                <Route path="/dashboard" element={<Dashboard />} />

                <Route
                    path="/beneficiary/schemes"
                    element={<BrowseSchemes />}
                />
                <Route
                    path="/beneficiary/schemes/:id"
                    element={<SchemeDetails />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;