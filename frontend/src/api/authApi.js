import axiosClient from "./axiosClient";

// NOTE ON BACKEND SHAPE:
// UserController.login / .register currently return a plain String body
// (either a JWT, or a human-readable error like "Invalid Password") with a
// 200 OK status in every case - there's no JSON envelope and no 4xx/5xx on
// failure. Until that's changed on the backend, the frontend has to inspect
// the string itself to know whether the call actually succeeded.

function looksLikeJwt(value) {
    return typeof value === "string" && value.split(".").length === 3;
}

// Decode the JWT payload (no signature verification - that's the backend's
// job; this is only so the UI knows the role/mobile number right away).
function decodeJwtPayload(token) {
    try {
        const payload = token.split(".")[1];
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(normalized));
    } catch {
        return null;
    }
}

export async function loginRequest(mobileNumber, password) {
    const response = await axiosClient.post("/users/login", {
        mobileNumber,
        password,
    });

    const body = response.data;

    if (!looksLikeJwt(body)) {
        // Backend returned a message like "Invalid Password" or
        // "Mobile number not registered" instead of a token.
        throw new Error(body || "Login failed");
    }

    const claims = decodeJwtPayload(body);

    return {
        token: body,
        mobileNumber: claims?.sub ?? mobileNumber,
        role: claims?.role ?? null,
    };
}

export async function registerRequest(payload) {
    const response = await axiosClient.post("/users/register", payload);
    const body = response.data;

    const KNOWN_ERRORS = [
        "Email already exists",
        "Mobile number already exists",
        "Aadhaar already registered",
    ];

    if (KNOWN_ERRORS.includes(body)) {
        throw new Error(body);
    }

    return body; // "Registration Successful"
}