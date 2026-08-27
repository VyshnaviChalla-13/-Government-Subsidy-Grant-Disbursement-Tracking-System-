import React, { createContext, useContext, useState } from "react";
import { loginRequest } from "../api/authApi";

const AuthContext = createContext(null);

function readStoredUser() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const login = async (mobileNumber, password) => {
        const loginData = await loginRequest(mobileNumber, password);

        const nextUser = {
            userId: loginData.userId,
            mobileNumber: loginData.mobileNumber,
            role: loginData.role,
            fullName: loginData.fullName,
            email: loginData.email,
        };

        localStorage.setItem("token", loginData.token);
        localStorage.setItem("user", JSON.stringify(nextUser));

        setToken(loginData.token);
        setUser(nextUser);

        return nextUser;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return ctx;
}