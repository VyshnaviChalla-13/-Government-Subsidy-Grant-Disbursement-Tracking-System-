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
import Contact from "../pages/Contact";
import FrontDeskDashboard from "../pages/officer/FrontDeskDashboard";
import About from "../pages/About";
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

                <Route
                    path="/beneficiary/apply"
                    element={<ApplyScheme />}
                />

                <Route
                    path="/beneficiary/my-applications"
                    element={<MyApplications />}
                />

                <Route
                    path="/beneficiary/timeline"
                    element={<ApplicationTimeline />}
                />

                <Route
                    path="/beneficiary/profile"
                    element={<Profile />}
                />

                {/* Officer */}

                <Route
                    path="/officer/frontdesk"
                    element={<FrontDeskDashboard />}
                />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;