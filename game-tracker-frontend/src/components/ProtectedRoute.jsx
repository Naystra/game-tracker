import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";


const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <p>Chargement...</p>;
    if (!user) return <Navigate to="/login" replace />

    return children;
};

export default ProtectedRoute;