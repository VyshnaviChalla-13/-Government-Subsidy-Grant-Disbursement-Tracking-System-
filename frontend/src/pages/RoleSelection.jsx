import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleHome } from "./auth/Login";

const RoleSelection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        navigate(getRoleHome(user?.role), { replace: true });
    }, [user, navigate]);

    return null;
};

export default RoleSelection;